
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env
try {
    const envPath = path.resolve(__dirname, '../../.env.local');
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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if needed for writes

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deduplicate() {
    console.log("--- Starting Deduplication Analysis ---");

    // 1. Fetch all active practitioners
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('*')
        .eq('status', 'active');

    if (error) {
        console.error("Error fetching practitioners:", error);
        return;
    }

    console.log(`Fetched ${practitioners.length} active practitioners.`);

    // 2. Group by keys
    const paramMap = new Map<string, any[]>();

    // Helper to normalize strings
    const norm = (s: string | null) => s ? s.trim().toLowerCase().replace(/\s+/g, ' ') : '';

    practitioners.forEach(p => {
        // Key 1: Name + Phone (if phone exists)
        // Key 2: Name + First 5 chars of Address (if address exists)
        // For simplicity, let's use Name + Phone as primary strong signal, and Name + City as secondary.

        // Strategy: Use Name as bucket, then check sub-conditions.
        // Actually, let's use Name as the main grouping key for now, because phone might be missing.
        // But names can be common.

        let key = norm(p.name);
        if (p.phone_norm) {
            key += `|${norm(p.phone_norm)}`;
        } else if (p.city) {
            key += `|${norm(p.city)}`;
        } else {
            key += `|${p.id}`; // No phone/city -> treat as unique to be safe, or just name? Risk of false positive.
        }

        if (!paramMap.has(key)) {
            paramMap.set(key, []);
        }
        paramMap.get(key)!.push(p);
    });

    // 3. Analyze duplicates
    let duplicatesParamCount = 0;
    const toArchiveIds: string[] = [];

    for (const [key, group] of paramMap.entries()) {
        if (group.length > 1) {
            console.log(`\nFound potential duplicates for key [${key}]: ${group.length} records`);
            duplicatesParamCount++;

            // Sort by "quality" (e.g. has website, has phone, most recent intervention?)
            // We want to KEEP the one with the most filled fields.
            const score = (p: any) => {
                let s = 0;
                if (p.website) s += 2;
                if (p.phone_norm) s += 2;
                if (p.address_full) s += 1;
                if (p.description) s += 1;
                return s;
            };

            // Descending score
            group.sort((a, b) => score(b) - score(a));

            const keeper = group[0];
            const others = group.slice(1);

            console.log(`  Keeping: ${keeper.name} (ID: ${keeper.id}) - Score: ${score(keeper)}`);
            others.forEach(o => {
                console.log(`  Marking as duplicate: ${o.name} (ID: ${o.id}) - Score: ${score(o)}`);
                toArchiveIds.push(o.id);
            });
        }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Total groups checked: ${paramMap.size}`);
    console.log(`Duplicate groups found: ${duplicatesParamCount}`);
    console.log(`Records to archive: ${toArchiveIds.length}`);

    if (toArchiveIds.length > 0) {
        // Uncomment to execute
        console.log("Starting update...");

        const { error: updateError } = await supabase
            .from('practitioners')
            .update({ status: 'duplicate' }) // or 'archived'
            .in('id', toArchiveIds);

        if (updateError) console.error("Update failed:", updateError);
        else console.log("Update successful. Archived duplicates.");

        // console.log("DRY RUN: Updates commented out. Set 'status' to 'duplicate' for IDs:", toArchiveIds);
    } else {
        console.log("No duplicates found to merge.");
    }
}

deduplicate().catch(console.error);
