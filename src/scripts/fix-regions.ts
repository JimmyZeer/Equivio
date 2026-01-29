/**
 * Fix Regions Script
 * 
 * Uses reverse geocoding to populate the `region` field for practitioners
 * who have GPS coordinates but no region.
 * 
 * Run with: npx ts-node src/scripts/fix-regions.ts         (dry-run)
 * Run with: npx ts-node src/scripts/fix-regions.ts --live  (apply changes)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Nominatim Reverse Geocoding API
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

// Mapping of French regions to URL-friendly slugs
const REGION_SLUG_MAP: Record<string, string> = {
    'île-de-france': 'ile-de-france',
    'ile-de-france': 'ile-de-france',
    'provence-alpes-côte d\'azur': 'provence-alpes-cote-d-azur',
    'provence-alpes-cote d\'azur': 'provence-alpes-cote-d-azur',
    'auvergne-rhône-alpes': 'auvergne-rhone-alpes',
    'auvergne-rhone-alpes': 'auvergne-rhone-alpes',
    'nouvelle-aquitaine': 'nouvelle-aquitaine',
    'occitanie': 'occitanie',
    'hauts-de-france': 'hauts-de-france',
    'grand est': 'grand-est',
    'pays de la loire': 'pays-de-la-loire',
    'bretagne': 'bretagne',
    'normandie': 'normandie',
    'bourgogne-franche-comté': 'bourgogne-franche-comte',
    'bourgogne-franche-comte': 'bourgogne-franche-comte',
    'centre-val de loire': 'centre-val-de-loire',
    'corse': 'corse',
};

interface ReverseGeocodingResult {
    address?: {
        state?: string;
        region?: string;
        country?: string;
    };
    display_name?: string;
}

function normalizeRegion(region: string): string {
    const normalized = region.toLowerCase().trim();
    return REGION_SLUG_MAP[normalized] || normalized.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lng.toString(),
            format: 'json',
            zoom: '5', // Region level
        });

        const response = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
            headers: {
                'User-Agent': 'Equivio-RegionFixer/1.0 (contact@equivio.fr)',
            },
        });

        if (!response.ok) {
            console.error(`  ⚠️ HTTP error: ${response.status}`);
            return null;
        }

        const data: ReverseGeocodingResult = await response.json();

        // Extract region from address.state (French administrative region)
        const region = data.address?.state || data.address?.region;

        if (region) {
            return normalizeRegion(region);
        }

        return null;
    } catch (error) {
        console.error(`  ⚠️ Reverse geocoding error:`, error);
        return null;
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixRegions(dryRun = true) {
    console.log("🌍 Starting Region Fix (Reverse Geocoding)...\n");
    console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no updates)' : '✏️ LIVE UPDATE'}\n`);

    // Fetch practitioners with coordinates but missing/empty region
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name, lat, lng, region, city')
        .eq('status', 'active')
        .not('lat', 'is', null)
        .not('lng', 'is', null);

    if (error) {
        console.error("❌ Error fetching practitioners:", error);
        return;
    }

    // Filter to those with empty/null/placeholder region
    const needsRegion = practitioners?.filter(p =>
        !p.region ||
        p.region.trim() === '' ||
        p.region.toLowerCase() === 'non renseigné' ||
        p.region.toLowerCase() === 'non renseigne'
    ) || [];

    console.log(`📊 Found ${needsRegion.length} practitioners with GPS but no region\n`);

    if (needsRegion.length === 0) {
        console.log("✅ All practitioners with GPS already have regions!");
        return;
    }

    let successCount = 0;
    let failCount = 0;
    const updates: Array<{ id: string; name: string; city: string | null; region: string }> = [];

    for (let i = 0; i < needsRegion.length; i++) {
        const p = needsRegion[i];

        console.log(`  🔍 [${i + 1}/${needsRegion.length}] ${p.name} (${p.city || 'no city'})`);
        console.log(`     Coords: ${p.lat}, ${p.lng}`);

        const region = await reverseGeocode(p.lat, p.lng);

        if (region) {
            console.log(`     ✅ Region: ${region}`);
            successCount++;
            updates.push({ id: p.id, name: p.name, city: p.city, region });

            if (!dryRun) {
                const { error: updateError } = await supabase
                    .from('practitioners')
                    .update({ region })
                    .eq('id', p.id);

                if (updateError) {
                    console.log(`     ⚠️ Update failed:`, updateError.message);
                } else {
                    console.log(`     💾 Saved to database`);
                }
            }
        } else {
            console.log(`     ❌ Could not determine region`);
            failCount++;
        }

        // Rate limit: 1 request per second for Nominatim
        if (i < needsRegion.length - 1) {
            await sleep(1100);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 RESULTS");
    console.log("=".repeat(60));
    console.log(`\n   ✅ Regions found: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📍 Total processed: ${needsRegion.length}`);

    // Show region distribution
    if (updates.length > 0) {
        const regionCounts: Record<string, number> = {};
        updates.forEach(u => {
            regionCounts[u.region] = (regionCounts[u.region] || 0) + 1;
        });

        console.log("\n📊 Region Distribution:");
        Object.entries(regionCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([region, count]) => {
                console.log(`   ${region}: ${count}`);
            });
    }

    if (dryRun && successCount > 0) {
        console.log("\n⚠️  This was a DRY RUN. To apply changes, run with --live flag:");
        console.log("   npx ts-node src/scripts/fix-regions.ts --live");
    }

    console.log("\n" + "=".repeat(60));

    return updates;
}

// Parse CLI arguments
const args = process.argv.slice(2);
const isLive = args.includes('--live');

fixRegions(!isLive).catch(console.error);
