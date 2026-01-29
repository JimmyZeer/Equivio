/**
 * Fix Slugs Script
 * 
 * Repairs corrupted slug_seo values where the first character was truncated.
 * Regenerates proper SEO-friendly slugs from name + specialty + city.
 * 
 * Run with: npx ts-node src/scripts/fix-slugs.ts         (dry-run)
 * Run with: npx ts-node src/scripts/fix-slugs.ts --live  (apply changes)
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

interface Practitioner {
    id: string;
    name: string;
    specialty: string;
    city: string | null;
    slug_seo: string | null;
}

/**
 * Generate a SEO-friendly slug from name, specialty, and city
 */
function generateSlug(name: string, specialty: string, city: string | null): string {
    // Build base string: "Name - Specialty - City"
    let base = name;

    // Add shortened specialty
    if (specialty) {
        // Shorten common specialties
        let shortSpec = specialty
            .replace(/Ostéopathe pour animaux/i, 'osteopathe')
            .replace(/Ostéopathe équin/i, 'osteopathe-equin')
            .replace(/Ostéopathe animalier/i, 'osteopathe-animalier')
            .replace(/Maréchal-ferrant/i, 'marechal-ferrant')
            .replace(/Dentiste équin/i, 'dentiste-equin')
            .replace(/Vétérinaire équin/i, 'veterinaire-equin');
        base += ` ${shortSpec}`;
    }

    if (city) {
        base += ` ${city}`;
    }

    return base
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with dashes
        .replace(/^-+|-+$/g, '')         // Trim leading/trailing dashes
        .replace(/-{2,}/g, '-');         // Collapse multiple dashes
}

/**
 * Check if a slug is corrupted (first character missing)
 */
function isSlugCorrupted(name: string, slug: string | null): boolean {
    if (!slug) return true; // No slug = needs fixing

    // Normalize name to compare
    const normalizedName = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    const normalizedSlug = slug
        .replace(/-/g, '')
        .toLowerCase();

    // The slug should start with at least the first few characters of the name
    const nameStart = normalizedName.substring(0, 3);
    const slugStart = normalizedSlug.substring(0, 3);

    // If the slug starts one character into the name, it's corrupted
    // e.g., name "Laura" -> "laura" but slug starts with "aura"
    if (normalizedName.length >= 4 && normalizedSlug.length >= 3) {
        const truncatedNameStart = normalizedName.substring(1, 4);
        if (slugStart === truncatedNameStart && slugStart !== nameStart) {
            return true;
        }
    }

    return false;
}

async function fixSlugs(dryRun = true) {
    console.log("🔧 Starting Slug Fix...\n");
    console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no updates)' : '✏️ LIVE UPDATE'}\n`);

    // Fetch all active practitioners
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name, specialty, city, slug_seo')
        .eq('status', 'active');

    if (error) {
        console.error("❌ Error fetching practitioners:", error);
        return;
    }

    console.log(`📊 Checking ${practitioners?.length || 0} practitioners for corrupted slugs\n`);

    if (!practitioners || practitioners.length === 0) {
        console.log("✅ No practitioners found!");
        return;
    }

    const corrupted: Array<{ p: Practitioner; newSlug: string }> = [];

    // Find corrupted slugs
    for (const p of practitioners as Practitioner[]) {
        if (isSlugCorrupted(p.name, p.slug_seo)) {
            const newSlug = generateSlug(p.name, p.specialty, p.city);
            corrupted.push({ p, newSlug });
        }
    }

    console.log(`🔍 Found ${corrupted.length} practitioners with corrupted/missing slugs\n`);

    if (corrupted.length === 0) {
        console.log("✅ All slugs look correct!");
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < corrupted.length; i++) {
        const { p, newSlug } = corrupted[i];

        console.log(`  🔧 [${i + 1}/${corrupted.length}] ${p.name}`);
        console.log(`     Old: "${p.slug_seo || '(none)'}"`);
        console.log(`     New: "${newSlug}"`);

        if (!dryRun) {
            const { error: updateError } = await supabase
                .from('practitioners')
                .update({ slug_seo: newSlug })
                .eq('id', p.id);

            if (updateError) {
                console.log(`     ⚠️ Update failed:`, updateError.message);
                failCount++;
            } else {
                console.log(`     💾 Saved to database`);
                successCount++;
            }
        } else {
            successCount++;
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 RESULTS");
    console.log("=".repeat(60));
    console.log(`\n   ✅ Slugs ${dryRun ? 'to fix' : 'fixed'}: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📍 Total corrupted: ${corrupted.length}`);

    if (dryRun && successCount > 0) {
        console.log("\n⚠️  This was a DRY RUN. To apply changes, run with --live flag:");
        console.log("   npx ts-node src/scripts/fix-slugs.ts --live");
    }

    console.log("\n" + "=".repeat(60));

    // Show sample of changes
    if (corrupted.length > 0) {
        console.log("\n📋 Sample changes:");
        corrupted.slice(0, 5).forEach(({ p, newSlug }) => {
            console.log(`   ${p.name}: "${p.slug_seo || '(none)'}" → "${newSlug}"`);
        });
        if (corrupted.length > 5) {
            console.log(`   ... and ${corrupted.length - 5} more`);
        }
    }

    return corrupted;
}

// Parse CLI arguments
const args = process.argv.slice(2);
const isLive = args.includes('--live');

fixSlugs(!isLive).catch(console.error);
