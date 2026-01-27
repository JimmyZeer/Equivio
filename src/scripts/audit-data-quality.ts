/**
 * Data Quality Audit Script
 * 
 * Run with: npx ts-node src/scripts/audit-data-quality.ts
 * 
 * Analyzes the practitioners table for data quality issues:
 * - Missing/null fields
 * - Unknown values
 * - Invalid formats
 * - Potential duplicates
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface AuditResult {
    category: string;
    issue: string;
    count: number;
    severity: 'critical' | 'warning' | 'info';
    examples?: string[];
}

async function auditDataQuality() {
    console.log("🔍 Starting Data Quality Audit...\n");

    const results: AuditResult[] = [];

    // Fetch all practitioners
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('id, name, specialty, city, region, phone_norm, website, status, slug_seo, lat, lng')
        .eq('status', 'active');

    if (error || !practitioners) {
        console.error("❌ Failed to fetch practitioners:", error);
        return;
    }

    console.log(`📊 Analyzing ${practitioners.length} active practitioners...\n`);

    // === CRITICAL ISSUES ===

    // 1. Missing names
    const missingNames = practitioners.filter(p => !p.name || p.name.trim() === '');
    if (missingNames.length > 0) {
        results.push({
            category: 'Identity',
            issue: 'Missing name',
            count: missingNames.length,
            severity: 'critical',
            examples: missingNames.slice(0, 3).map(p => p.id)
        });
    }

    // 2. Missing slug_seo (can't access profile)
    const missingSlugs = practitioners.filter(p => !p.slug_seo);
    if (missingSlugs.length > 0) {
        results.push({
            category: 'SEO',
            issue: 'Missing slug_seo',
            count: missingSlugs.length,
            severity: 'critical',
            examples: missingSlugs.slice(0, 3).map(p => p.name)
        });
    }

    // === WARNING ISSUES ===

    // 3. Unknown region
    const unknownRegions = practitioners.filter(p =>
        p.region && p.region.toLowerCase() === 'unknown'
    );
    results.push({
        category: 'Location',
        issue: 'Region = "unknown"',
        count: unknownRegions.length,
        severity: 'warning',
        examples: unknownRegions.slice(0, 3).map(p => p.name)
    });

    // 4. Missing city
    const missingCities = practitioners.filter(p => !p.city || p.city.trim() === '');
    results.push({
        category: 'Location',
        issue: 'Missing city',
        count: missingCities.length,
        severity: 'warning'
    });

    // 5. Missing phone
    const missingPhones = practitioners.filter(p => !p.phone_norm);
    results.push({
        category: 'Contact',
        issue: 'Missing phone number',
        count: missingPhones.length,
        severity: 'warning'
    });

    // 6. Missing coordinates (can't show on map)
    const missingCoords = practitioners.filter(p => !p.lat || !p.lng);
    results.push({
        category: 'Geolocation',
        issue: 'Missing lat/lng coordinates',
        count: missingCoords.length,
        severity: 'warning'
    });

    // === INFO ISSUES ===

    // 7. Missing website
    const missingWebsites = practitioners.filter(p => !p.website);
    results.push({
        category: 'Online Presence',
        issue: 'No website',
        count: missingWebsites.length,
        severity: 'info'
    });

    // 8. Null region (not 'unknown', just empty)
    const nullRegions = practitioners.filter(p => p.region === null);
    results.push({
        category: 'Location',
        issue: 'Region is NULL',
        count: nullRegions.length,
        severity: 'info'
    });

    // === PRINT RESULTS ===

    console.log("=".repeat(60));
    console.log("📋 AUDIT RESULTS");
    console.log("=".repeat(60));

    const criticals = results.filter(r => r.severity === 'critical');
    const warnings = results.filter(r => r.severity === 'warning');
    const infos = results.filter(r => r.severity === 'info');

    if (criticals.length > 0) {
        console.log("\n🔴 CRITICAL ISSUES:");
        criticals.forEach(r => {
            console.log(`   • ${r.issue}: ${r.count} practitioners`);
            if (r.examples) console.log(`     Examples: ${r.examples.join(', ')}`);
        });
    }

    if (warnings.length > 0) {
        console.log("\n🟠 WARNINGS:");
        warnings.forEach(r => {
            console.log(`   • ${r.issue}: ${r.count} practitioners`);
            if (r.examples) console.log(`     Examples: ${r.examples.join(', ')}`);
        });
    }

    if (infos.length > 0) {
        console.log("\n🔵 INFO:");
        infos.forEach(r => {
            console.log(`   • ${r.issue}: ${r.count} practitioners`);
        });
    }

    // === SUMMARY ===

    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));

    const totalIssues = results.reduce((sum, r) => sum + r.count, 0);
    const dataQualityScore = Math.round(
        ((practitioners.length * 7 - totalIssues) / (practitioners.length * 7)) * 100
    );

    console.log(`\n   Total practitioners: ${practitioners.length}`);
    console.log(`   Total issues found: ${totalIssues}`);
    console.log(`   Data quality score: ${dataQualityScore}%`);

    if (dataQualityScore >= 80) {
        console.log("\n   ✅ Good data quality!");
    } else if (dataQualityScore >= 60) {
        console.log("\n   ⚠️  Data needs improvement");
    } else {
        console.log("\n   ❌ Poor data quality - cleanup required");
    }

    console.log("\n" + "=".repeat(60));

    return results;
}

// Run the audit
auditDataQuality().catch(console.error);
