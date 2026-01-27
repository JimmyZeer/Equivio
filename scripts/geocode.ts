
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars manually if not present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
    });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ OBLIGATOIRE: SUPABASE_SERVICE_ROLE_KEY manquant.");
    console.error("Le script nécessite cette clé pour outrepasser les RLS et mettre à jour les praticiens.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function geocodeAddress(address: string, city: string) {
    // Strategy: address_full -> fallback on city
    const query = `${address ? address + ', ' : ''}${city}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Equivio-Geocode-Script/1.0'
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (e) {
        console.error(`Error geocoding ${query}:`, e);
    }
    return null;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("🚀 Starting Geocoding Script (Backfill)...");

    // 1. Fetch practitioners without coordinates
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name, address_full, city, specialty')
        .is('lat', null);

    if (error) {
        console.error("Error fetching practitioners:", error);
        return;
    }

    console.log(`📍 Found ${practitioners.length} practitioners to geocode.`);

    let successCount = 0;
    let failCount = 0;

    for (const p of practitioners) {
        const address = p.address_full || "";
        const city = p.city || "";

        if (!city && !address) {
            console.log(`⚠️ Skipping ID: ${p.id} (${p.name}) - No address/city`);
            failCount++;
            continue;
        }

        console.log(`GEOCODING ID: ${p.id} | ${p.name} | ${address}, ${city}`);

        let coords = await geocodeAddress(address, city);

        // Fallback on city only if full address failed
        if (!coords && city && address) {
            console.log(`   🔸 Fallback on city only: ${city}`);
            await sleep(1100);
            coords = await geocodeAddress("", city);
        }

        if (coords) {
            const { data, error: updateError } = await supabase
                .from('practitioners')
                .update({ lat: coords.lat, lng: coords.lng })
                .eq('id', p.id)
                .select(); // Should return the updated row count

            if (updateError) {
                console.error(`   ❌ Failed to update DB for ID ${p.id}:`, updateError.message);
                failCount++;
            } else if (!data || data.length === 0) {
                console.error(`   ❌ Failed: Update count is 0 for ID ${p.id} (Operation failed)`);
                failCount++;
            } else {
                console.log(`   ✅ Success! Update count: ${data.length} | Coords: ${coords.lat}, ${coords.lng}`);
                successCount++;
            }
        } else {
            console.log(`   ❌ Not Found for ID: ${p.id}`);
            failCount++;
        }

        // Respect Nominatim Usage Policy (Max 1 request per second)
        await sleep(1100);
    }

    console.log("\n--- VERIFICATION FINALE ---");
    const { data: summary, error: sumError } = await supabase
        .from('practitioners')
        .select('specialty')
        .not('lat', 'is', null)
        .not('lng', 'is', null);

    if (summary) {
        console.log(`📊 Practitioners with valid coords: ${summary.length}`);
    }

    console.log(`🎉 Done! Success: ${successCount}, Fail/Skipped: ${failCount}`);
}

main();

