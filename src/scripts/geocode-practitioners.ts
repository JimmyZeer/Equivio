/**
 * GPS Geocoding Script
 * 
 * Enriches practitioners without GPS coordinates using OpenStreetMap Nominatim API
 * 
 * Run with: npx ts-node src/scripts/geocode-practitioners.ts
 * 
 * Note: Nominatim has a rate limit of 1 request/second. This script respects that.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env manually
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^"(.*)"$/, '$1');
            process.env[key] = value;
        }
    });
} catch (e) {
    console.warn("Could not load .env.local via fs, relying on process.env");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Nominatim API (free, no API key required)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

interface GeocodingResult {
    lat: string;
    lon: string;
    display_name: string;
}

interface Practitioner {
    id: string;
    name: string;
    city: string | null;
    address_full: string | null;
    region: string | null;
}

async function geocodeAddress(query: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const params = new URLSearchParams({
            q: query,
            format: 'json',
            countrycodes: 'fr',
            limit: '1',
        });

        const response = await fetch(`${NOMINATIM_URL}?${params}`, {
            headers: {
                'User-Agent': 'Equivio-Geocoder/1.0 (contact@equivio.fr)',
            },
        });

        if (!response.ok) {
            console.error(`  ⚠️ HTTP error: ${response.status}`);
            return null;
        }

        const data: GeocodingResult[] = await response.json();

        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }

        return null;
    } catch (error) {
        console.error(`  ⚠️ Geocoding error:`, error);
        return null;
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocodePractitioners(dryRun = true) {
    console.log("🌍 Starting GPS Geocoding...\n");
    console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no updates)' : '✏️ LIVE UPDATE'}\n`);

    // Fetch practitioners without coordinates
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name, city, address_full, region')
        .eq('status', 'active')
        .or('lat.is.null,lng.is.null');

    if (error) {
        console.error("❌ Error fetching practitioners:", error);
        return;
    }

    console.log(`📊 Found ${practitioners?.length || 0} practitioners without GPS coordinates\n`);

    if (!practitioners || practitioners.length === 0) {
        console.log("✅ All practitioners have GPS coordinates!");
        return;
    }

    let successCount = 0;
    let failCount = 0;
    const results: Array<{ name: string; city: string | null; coords: { lat: number; lng: number } | null }> = [];

    for (let i = 0; i < practitioners.length; i++) {
        const p = practitioners[i] as Practitioner;

        // Build search query - filter out corrupted data
        let query = '';

        // Check if address is valid (not corrupted with "·" or too short)
        const hasValidAddress = p.address_full &&
            !p.address_full.includes('·') &&
            !p.address_full.toLowerCase().includes('ouvre à') &&
            p.address_full.length > 10;

        // Check if city is valid
        const hasValidCity = p.city &&
            !p.city.includes('·') &&
            p.city.length > 2;

        if (hasValidAddress) {
            query = p.address_full + ', France';
        } else if (hasValidCity) {
            query = p.city + ', France';
        } else {
            console.log(`  ⏭️ [${i + 1}/${practitioners.length}] ${p.name} - No valid address/city, skipping`);
            failCount++;
            continue;
        }

        console.log(`  🔍 [${i + 1}/${practitioners.length}] ${p.name}`);
        console.log(`     Query: "${query}"`);

        const coords = await geocodeAddress(query);

        if (coords) {
            console.log(`     ✅ Found: ${coords.lat}, ${coords.lng}`);
            successCount++;
            results.push({ name: p.name, city: p.city, coords });

            if (!dryRun) {
                // Update Supabase
                const { error: updateError } = await supabase
                    .from('practitioners')
                    .update({ lat: coords.lat, lng: coords.lng })
                    .eq('id', p.id);

                if (updateError) {
                    console.log(`     ⚠️ Update failed:`, updateError.message);
                } else {
                    console.log(`     💾 Saved to database`);
                }
            }
        } else {
            console.log(`     ❌ Not found`);
            failCount++;
            results.push({ name: p.name, city: p.city, coords: null });
        }

        // Rate limit: 1 request per second for Nominatim
        if (i < practitioners.length - 1) {
            await sleep(1100);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 RESULTS");
    console.log("=".repeat(60));
    console.log(`\n   ✅ Geocoded successfully: ${successCount}`);
    console.log(`   ❌ Failed/skipped: ${failCount}`);
    console.log(`   📍 Total processed: ${practitioners.length}`);

    if (dryRun && successCount > 0) {
        console.log("\n⚠️  This was a DRY RUN. To apply changes, run with --live flag:");
        console.log("   npx ts-node src/scripts/geocode-practitioners.ts --live");
    }

    console.log("\n" + "=".repeat(60));

    return results;
}

// Parse CLI arguments
const args = process.argv.slice(2);
const isLive = args.includes('--live');

geocodePractitioners(!isLive).catch(console.error);
