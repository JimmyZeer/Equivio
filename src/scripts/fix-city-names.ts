/**
 * Fix City Name Formatting
 * 
 * Normalizes city names to proper title case:
 * - "paris" -> "Paris"
 * - "troyes" -> "Troyes"
 * - "saint-germain-en-laye" -> "Saint-Germain-en-Laye"
 * 
 * Usage:
 *   npx ts-node src/scripts/fix-city-names.ts --dry-run
 *   npx ts-node src/scripts/fix-city-names.ts --live
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Words that should stay lowercase in French city names
const LOWERCASE_WORDS = new Set([
    'de', 'du', 'des', 'la', 'le', 'les', 'en', 'sur', 'sous', 'aux', 'et', 'l'
]);

// Special cases for known abbreviations and proper formatting
const SPECIAL_CASES: Record<string, string> = {
    'paris': 'Paris',
    'lyon': 'Lyon',
    'marseille': 'Marseille',
    'toulouse': 'Toulouse',
    'nice': 'Nice',
    'nantes': 'Nantes',
    'bordeaux': 'Bordeaux',
    'strasbourg': 'Strasbourg',
    'lille': 'Lille',
    'rennes': 'Rennes',
};

/**
 * Capitalize a city name properly in French style
 */
function formatCityName(city: string): string {
    if (!city) return city;

    const lowercaseCity = city.toLowerCase().trim();

    // Check special cases first
    if (SPECIAL_CASES[lowercaseCity]) {
        return SPECIAL_CASES[lowercaseCity];
    }

    // Split by spaces and hyphens, preserving the separator
    const parts = lowercaseCity.split(/(\s+|-)/);

    return parts.map((part, index) => {
        // Skip separators
        if (part.match(/^\s+$/) || part === '-') {
            return part;
        }

        // Keep lowercase words as lowercase (except if first word)
        if (index > 0 && LOWERCASE_WORDS.has(part)) {
            return part;
        }

        // Handle l' prefix (e.g., l'Isle)
        if (part.startsWith("l'") || part.startsWith("l'")) {
            return "L'" + part.slice(2).charAt(0).toUpperCase() + part.slice(3);
        }

        // Capitalize first letter
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');
}

/**
 * Check if city name needs formatting
 */
function needsFormatting(city: string | null): boolean {
    if (!city) return false;

    const formatted = formatCityName(city);
    return city !== formatted;
}

async function fixCityNames(dryRun = true) {
    console.log(`\n🏙️  Fix City Names ${dryRun ? '(DRY RUN)' : '(LIVE)'}\n`);
    console.log('='.repeat(50));

    // Fetch all practitioners with cities
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name, city')
        .eq('status', 'active')
        .not('city', 'is', null);

    if (error) {
        console.error('Error fetching practitioners:', error);
        return;
    }

    console.log(`Found ${practitioners?.length || 0} practitioners with cities\n`);

    // Find those needing formatting
    const toFix = practitioners?.filter(p => needsFormatting(p.city)) || [];

    console.log(`${toFix.length} cities need formatting\n`);

    if (toFix.length === 0) {
        console.log('✅ All city names are properly formatted!');
        return;
    }

    // Show preview
    console.log('Preview of changes:');
    console.log('-'.repeat(50));

    for (const p of toFix.slice(0, 20)) {
        const formatted = formatCityName(p.city);
        console.log(`  "${p.city}" → "${formatted}" (${p.name})`);
    }

    if (toFix.length > 20) {
        console.log(`  ... and ${toFix.length - 20} more`);
    }

    console.log('-'.repeat(50));

    if (dryRun) {
        console.log('\n⚠️  DRY RUN - No changes made');
        console.log('Run with --live to apply changes');
        return;
    }

    // Apply changes
    console.log('\nApplying changes...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const p of toFix) {
        const formatted = formatCityName(p.city);

        const { error: updateError } = await supabase
            .from('practitioners')
            .update({ city: formatted })
            .eq('id', p.id);

        if (updateError) {
            console.error(`  ❌ Error updating ${p.name}:`, updateError.message);
            errorCount++;
        } else {
            console.log(`  ✓ ${p.city} → ${formatted}`);
            successCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Updated: ${successCount}`);
    if (errorCount > 0) {
        console.log(`❌ Errors: ${errorCount}`);
    }
}

// Parse arguments
const args = process.argv.slice(2);
const isLive = args.includes('--live');

fixCityNames(!isLive).catch(console.error);
