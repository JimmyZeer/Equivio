
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

// ... imports

// Helper interface for script
interface ScriptPractitioner {
    id: string;
    name: string;
    specialty: string;
    city?: string | null;
    address_full?: string | null;
    phone_norm?: string | null;
    website?: string | null;
    description?: string | null;
    status: string;
}

const DRY_RUN = true; // Set to false to actually apply changes

async function deduplicate() {
    console.log("--- Starting Deduplication Analysis ---");
    if (DRY_RUN) console.log("⚠️ DRY RUN MODE: No changes will be applied to the database.");

    // 1. Fetch all active practitioners
    const { data, error } = await supabase
        .from('practitioners')
        .select('*')
        .eq('status', 'active');

    if (error) {
        console.error("Error fetching practitioners:", error);
        return;
    }

    const practitioners = data as ScriptPractitioner[];

    console.log(`Fetched ${practitioners.length} active practitioners.`);

    // 2. Group by keys
    const paramMap = new Map<string, ScriptPractitioner[]>();

    // Helper to normalize strings
    const norm = (s: string | null | undefined) => s ? s.trim().toLowerCase().replace(/\s+/g, ' ') : '';

    practitioners.forEach(p => {
        let key = norm(p.name);
        if (p.phone_norm) {
            key += `|${norm(p.phone_norm)}`;
        } else if (p.city) {
            key += `|${norm(p.city)}`;
        } else {
            key += `|${p.id}`;
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

            // Sort by "quality"
            const score = (p: ScriptPractitioner) => {
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
        if (!DRY_RUN) {
            console.log("Starting update...");

            const { error: updateError } = await supabase
                .from('practitioners')
                .update({ status: 'duplicate' })
                .in('id', toArchiveIds);

            if (updateError) console.error("Update failed:", updateError);
            else console.log("Update successful. Archived duplicates.");
        } else {
            console.log("[DRY RUN] Would set 'status' to 'duplicate' for IDs:", toArchiveIds);
        }
    } else {
        console.log("No duplicates found to merge.");
    }
}

deduplicate().catch(console.error);
