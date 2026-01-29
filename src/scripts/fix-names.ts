/**
 * Fix Practitioner Name Formatting
 * 
 * Normalizes practitioner names to proper title case:
 * - "jean dupont" -> "Jean Dupont"
 * - "MARIE MARTIN" -> "Marie Martin"
 * - "dr. pierre durand" -> "Dr. Pierre Durand"
 * 
 * Usage:
 *   npx ts-node src/scripts/fix-names.ts --dry-run
 *   npx ts-node src/scripts/fix-names.ts --live
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

// Words/prefixes that have special formatting
const PREFIXES = ['dr.', 'dr', 'me', 'mme', 'mr', 'm.'];
const LOWERCASE_CONNECTORS = ['de', 'du', 'des', 'la', 'le', 'les', 'et', "d'", "l'"];

// Common suffixes to preserve
const PRESERVED_SUFFIXES = ['OA', 'RNA', 'IDF'];

/**
 * Format a name to proper title case (French style)
 */
function formatName(name: string): string {
    if (!name) return name;

    // Preserve the original if it contains special patterns we shouldn't touch
    // Like "OA 1000" or "RNA"

    // Split into words, preserving separators
    const words = name.split(/(\s+|-)/);

    return words.map((word, index) => {
        // Skip separators
        if (word.match(/^\s+$/) || word === '-') {
            return word;
        }

        // Check if it's a preserved suffix/acronym (should stay uppercase)
        const upperWord = word.toUpperCase();
        if (PRESERVED_SUFFIXES.some(s => upperWord.includes(s))) {
            return word; // Keep as-is
        }

        // Check if it's a number or contains numbers (like OA410)
        if (/\d/.test(word) || /^[A-Z]{2,}$/.test(word)) {
            return word; // Keep as-is
        }

        const lowerWord = word.toLowerCase();

        // Check for prefixes (Dr., etc.)
        if (index === 0 && PREFIXES.includes(lowerWord)) {
            // Capitalize first letter
            return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
        }

        // Check for lowercase connectors (but not at start)
        if (index > 0 && LOWERCASE_CONNECTORS.some(c => lowerWord === c || lowerWord.startsWith(c))) {
            return lowerWord;
        }

        // Handle names with apostrophes (d'Artagnan, L'Isle)
        if (lowerWord.includes("'") || lowerWord.includes("'")) {
            const parts = lowerWord.split(/('|')/);
            return parts.map((part, i) => {
                if (part === "'" || part === "'") return "'";
                if (part.length === 1 && i === 0) return part.toLowerCase(); // d', l'
                return part.charAt(0).toUpperCase() + part.slice(1);
            }).join('');
        }

        // Standard capitalization: first letter uppercase, rest lowercase
        // But preserve mixed case that looks intentional (like McDonald)
        if (word !== word.toLowerCase() && word !== word.toUpperCase()) {
            // Mixed case - might be intentional, check if it looks like a name
            if (/^[A-Z][a-z]+[A-Z]/.test(word)) {
                return word; // Keep McSomething, DuPont etc
            }
        }

        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    }).join('');
}

/**
 * Check if name needs formatting
 * Returns true if the name would change after formatting
 */
function needsFormatting(name: string | null): boolean {
    if (!name) return false;

    const formatted = formatName(name);
    return name !== formatted;
}

/**
 * Extra check: is the name all lowercase or all uppercase?
 */
function hasObviousIssue(name: string): boolean {
    if (!name) return false;

    // Check if entirely lowercase (excluding numbers and special chars)
    const letters = name.replace(/[^a-zA-ZÀ-ÿ]/g, '');
    if (letters.length > 3) {
        if (letters === letters.toLowerCase()) return true;
        if (letters === letters.toUpperCase()) return true;
    }

    return false;
}

async function fixNames(dryRun = true) {
    console.log(`\n👤 Fix Practitioner Names ${dryRun ? '(DRY RUN)' : '(LIVE)'}\n`);
    console.log('='.repeat(50));

    // Fetch all practitioners
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name')
        .eq('status', 'active');

    if (error) {
        console.error('Error fetching practitioners:', error);
        return;
    }

    console.log(`Found ${practitioners?.length || 0} active practitioners\n`);

    // Find those with obvious issues (all lowercase/uppercase)
    const withIssues = practitioners?.filter(p => hasObviousIssue(p.name)) || [];

    console.log(`${withIssues.length} names have obvious formatting issues\n`);

    if (withIssues.length === 0) {
        console.log('✅ All names look properly formatted!');
        return;
    }

    // Show preview
    console.log('Preview of changes:');
    console.log('-'.repeat(60));

    for (const p of withIssues.slice(0, 25)) {
        const formatted = formatName(p.name);
        console.log(`  "${p.name.substring(0, 40)}..." → "${formatted.substring(0, 40)}..."`);
    }

    if (withIssues.length > 25) {
        console.log(`  ... and ${withIssues.length - 25} more`);
    }

    console.log('-'.repeat(60));

    if (dryRun) {
        console.log('\n⚠️  DRY RUN - No changes made');
        console.log('Run with --live to apply changes');
        return;
    }

    // Apply changes
    console.log('\nApplying changes...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const p of withIssues) {
        const formatted = formatName(p.name);

        const { error: updateError } = await supabase
            .from('practitioners')
            .update({ name: formatted })
            .eq('id', p.id);

        if (updateError) {
            console.error(`  ❌ Error:`, updateError.message);
            errorCount++;
        } else {
            console.log(`  ✓ Updated`);
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

fixNames(!isLive).catch(console.error);
