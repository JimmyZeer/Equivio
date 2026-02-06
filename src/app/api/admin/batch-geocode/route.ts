
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Reusing logic from admin actions to ensure consistency
async function geocodeAddress(query: string) {
    if (!query) return null;
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'EquivioAdmin/1.0 (admin@equivio.fr)' }
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        return null;
    } catch (e) {
        console.error("Geocoding error", e);
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Simple protection
    if (key !== 'equivio_secure_batch') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = 10; // Process 10 items per batch (approx 12 seconds)

    // 1. Fetch candidates
    const { data: candidates, error } = await supabaseAdmin
        .from('practitioners')
        .select('id, name, address_full, city, region')
        .eq('status', 'active')
        .or('lat.is.null,lng.is.null')
        .limit(limit);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!candidates || candidates.length === 0) {
        return NextResponse.json({ message: "All done! No missing coordinates found.", processed: 0, remaining: 0 });
    }

    let successCount = 0;
    const results = [];

    // 2. Process
    for (const p of candidates) {
        // Build query
        let query = '';
        if (p.address_full && p.address_full.length > 5 && !p.address_full.includes('·')) {
            query = p.address_full + ', France';
        } else if (p.city) {
            query = p.city + ', France';
        }

        if (!query) {
            results.push({ name: p.name, status: 'skipped_no_address' });
            continue;
        }

        // Call Geocoder
        const coords = await geocodeAddress(query);

        if (coords) {
            await supabaseAdmin.from('practitioners').update({
                lat: coords.lat,
                lng: coords.lng
            }).eq('id', p.id);
            results.push({ name: p.name, status: 'updated', lat: coords.lat, lng: coords.lng });
            successCount++;
        } else {
            results.push({ name: p.name, status: 'not_found' });
        }

        // 3. Sleep 1.1s (Nominatim rate limit)
        await new Promise(r => setTimeout(r, 1100));
    }

    // Check remaining count
    const { count } = await supabaseAdmin
        .from('practitioners')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .or('lat.is.null,lng.is.null');

    return NextResponse.json({
        message: `Processed ${candidates.length} items. Success: ${successCount}.`,
        processed: candidates.length,
        remaining: count || 0,
        results
    });
}
