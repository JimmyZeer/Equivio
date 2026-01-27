
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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase keys. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON KEY) are in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function geocodeAddress(address: string, city: string) {
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

// Simple sleep to respect API limits
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("🚀 Starting Geocoding Script...");

    // 1. Fetch practitioners without coordinates
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name, address_full, city')
        .is('lat', null);

    if (error) {
        console.error("Error fetching practitioners:", error);
        return;
    }

    console.log(`📍 Found ${practitioners.length} practitioners to geocode.`);

    let successCount = 0;
    let failCount = 0;

    for (const p of practitioners) {
        if (!p.city) {
            console.log(`⚠️ Skipping ${p.name} (No city)`);
            failCount++;
            continue;
        }

        // Clean address for better results? simple heuristic
        const address = p.address_full || "";

        console.log(`SEARCHING: ${p.name} -> ${address}, ${p.city}`);

        let coords = await geocodeAddress(address, p.city);

        if (!coords && p.city) {
            console.log(`   🔸 Retry city only: ${p.city}`);
            await sleep(1100);
            coords = await geocodeAddress("", p.city);
        }

        if (coords) {
            console.log(`   ✅ Found: ${coords.lat}, ${coords.lng}`);

            const { error: updateError } = await supabase
                .from('practitioners')
                .update({ lat: coords.lat, lng: coords.lng })
                .eq('id', p.id);

            if (updateError) {
                console.error(`   ❌ Failed to update DB:`, updateError.message);
                failCount++;
            } else {
                successCount++;
            }
        } else {
            console.log(`   ❌ Not Found`);
            failCount++;
        }

        // Respect Nominatim Usage Policy (Max 1 request per second)
        await sleep(1100);
    }

    console.log(`\n🎉 Done! Updated: ${successCount}, Failed/Skipped: ${failCount}`);
}

main();
