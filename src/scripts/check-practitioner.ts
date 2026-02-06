import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env manually like in deduplicate.ts
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

console.log("URL Format Check:");
try {
    const url = new URL(supabaseUrl!);
    console.log("  Protocol:", url.protocol);
    console.log("  Hostname:", url.hostname);
} catch (e) {
    console.error("  Invalid URL:", e);
}

// Test network
// fetch('https://www.google.com').then(res => console.log("Google Reachable:", res.status)).catch(err => console.error("Google Unreachable:", err));


if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPractitioner() {
    console.log("Searching for Mélissa ROIG...");
    const { data, error } = await supabase
        .from('practitioners')
        .select('*')
        .ilike('name', '%Mélissa ROIG%');

    if (error) {
        console.error("Error:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Found:", data.length, "records");
        data.forEach(p => {
            console.log(`\nID: ${p.id}`);
            console.log(`Name: ${p.name}`);
            console.log(`Slug: ${p.slug} / ${p.slug_seo}`);
            console.log(`Specialty: ${p.specialty}`);
            console.log(`Status: ${p.status}`);
            console.log(`Is Verified: ${p.is_verified}`);
            console.log(`Address: ${p.address_full}`);
            console.log(`City: ${p.city}`);
            console.log(`Region: "${p.region}"`); // Quotes to see hidden spaces
            console.log(`Lat/Lng: ${p.lat}, ${p.lng}`);
        });
    } else {
        console.log("No practitioner found with that name.");
    }
}

checkPractitioner();
