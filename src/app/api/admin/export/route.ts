import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Basic Auth Check (Middleware handles it generally, but good to be safe)
    // NOTE: Middleware acts before this, so we assume auth is generic.

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const status = searchParams.get('status');
    const warning = searchParams.get('warning');
    const region = searchParams.get('region');

    let dbQuery = supabaseAdmin
        .from('practitioners')
        .select('id, name, specialty, region, city, address_full, postcode, lat, lng, phone_norm, website, profile_url, status, is_verified, is_claimed, claimed_at, created_at, slug_seo');

    // Apply same filters as UI
    if (status && status !== 'all') {
        dbQuery = dbQuery.eq('status', status);
    }

    if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%`);
    }

    if (region && region !== 'all') {
        dbQuery = dbQuery.eq('region', region);
    }

    if (warning === 'missing_coords') {
        dbQuery = dbQuery.is('lat', null);
    } else if (warning === 'missing_city') {
        dbQuery = dbQuery.is('city', null);
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: 'No data' }, { status: 404 });
    }

    // Convert to CSV
    const headers = [
        'ID', 'Nom', 'Spécialité', 'Région', 'Ville', 'Adresse', 'Code Postal', 'Lat', 'Lng',
        'Téléphone', 'Site Web', 'URL Profil', 'Statut', 'Vérifié', 'Revendiqué', 'Date Revendication', 'Date Création', 'Slug'
    ];

    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = [
            row.id,
            `"${(row.name || '').replace(/"/g, '""')}"`,
            `"${(row.specialty || '').replace(/"/g, '""')}"`,
            `"${(row.region || '').replace(/"/g, '""')}"`,
            `"${(row.city || '').replace(/"/g, '""')}"`,
            `"${(row.address_full || '').replace(/"/g, '""')}"`,
            `"${(row.postcode || '').replace(/"/g, '""')}"`,
            row.lat,
            row.lng,
            `"${(row.phone_norm || '').replace(/"/g, '""')}"`,
            `"${(row.website || '').replace(/"/g, '""')}"`,
            `"${(row.profile_url || '').replace(/"/g, '""')}"`,
            row.status,
            row.is_verified ? 'Oui' : 'Non',
            row.is_claimed ? 'Oui' : 'Non',
            row.claimed_at,
            row.created_at,
            row.slug_seo
        ];
        csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="practitioners_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
    });
}
