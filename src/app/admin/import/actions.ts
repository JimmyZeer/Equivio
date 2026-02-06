'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { logAdminAction } from "@/lib/audit";
import Papa from 'papaparse';
import { revalidatePath } from "next/cache";

// Types
export interface ImportRow {
    status: 'OK' | 'UPDATE' | 'WARNING' | 'ERROR' | 'NEEDS_REVIEW';
    reasons: string[];
    matchType?: 'profile_url' | 'phone' | 'slug';
    data: any; // Normalized data
    originalIndex: number;
    existingId?: string;
}

export interface ImportSummary {
    total: number;
    inserted: number;
    updated: number;
    skipped: number;
    errors: number;
}

// Helpers
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accents
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function normalizePhone(phone: string) {
    if (!phone) return null;
    let p = phone.replace(/[^\d+]/g, '');
    if (p.startsWith('+33')) p = '0' + p.slice(3);
    if (p.startsWith('33')) p = '0' + p.slice(2);
    // Basic french check
    if (p.length === 10 && (p.startsWith('06') || p.startsWith('07') || p.startsWith('01') || p.startsWith('02') || p.startsWith('03') || p.startsWith('04') || p.startsWith('05') || p.startsWith('09'))) {
        return p;
    }
    return p; // Return stripped version anyway
}

// Allowed Specialties
const ALLOWED_SPECIALTIES = [
    "Ostéopathe animalier",
    "Dentisterie équine",
    "Maréchal-ferrant",
    "Pareur",
    "Shiatsu",
    "Saddle fitter",
    "Bit fitter",
    "Nutritionniste",
    "Masseur",
    "Algothérapeute",
    "Naturophate",
    "Comportementaliste"
];

// --- ACTION: Preview Import ---
export async function previewImport(formData: FormData): Promise<{ success: boolean, rows?: ImportRow[], error?: string }> {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: "Aucun fichier fourni" };

    const text = await file.text();

    // Check if Supabase Admin is ready
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { success: false, error: "Configuration serveur manquante (SERVICE_ROLE_KEY)" };
    }

    // Parse CSV
    const { data: rawRows, errors: parseErrors } = Papa.parse(text, { header: true, skipEmptyLines: true });

    if (parseErrors.length > 0 && rawRows.length === 0) {
        return { success: false, error: "Erreur de parsing CSV: " + parseErrors[0].message };
    }

    // Fetch existing practitioners to check against
    // Optimization: fetch only relevant fields for matching
    const { data: existingPractitioners, error: dbError } = await supabaseAdmin
        .from('practitioners')
        .select('id, name, slug_seo, phone_norm, profile_url');

    if (dbError) {
        console.error("Supabase Admin Error:", dbError);
        return { success: false, error: "Erreur Supabase: " + dbError.message };
    }

    if (!existingPractitioners) return { success: false, error: "Erreur DB: Aucune donnée retournée" };

    const existingByProfile = new Map();
    const existingByPhone = new Map(); // phone -> [ids...]
    const existingBySlug = new Map();

    existingPractitioners.forEach(p => {
        if (p.profile_url) existingByProfile.set(p.profile_url, p);
        if (p.slug_seo) existingBySlug.set(p.slug_seo, p);
        if (p.phone_norm) {
            const list = existingByPhone.get(p.phone_norm) || [];
            list.push(p);
            existingByPhone.set(p.phone_norm, list);
        }
    });

    const processedRows: ImportRow[] = [];

    for (let i = 0; i < rawRows.length; i++) {
        const row: any = rawRows[i];
        const reasons: string[] = [];
        let status: ImportRow['status'] = 'OK';
        let matchType: ImportRow['matchType'] | undefined;
        let existingId: string | undefined;

        // 1. Validate & Normalize
        if (!row.name) {
            status = 'ERROR';
            reasons.push("Nom manquant");
        }

        // Validate Specialty
        // Fuzzy match or exact? Let's do exact or simple includes for now
        let specialty = row.specialty;
        if (!specialty) {
            status = 'ERROR';
            reasons.push("Spécialité manquante");
        } else {
            // Basic normalization
            const found = ALLOWED_SPECIALTIES.find(s => s.toLowerCase() === specialty.toLowerCase() || specialty.toLowerCase().includes(s.toLowerCase().replace('é', 'e')));
            if (found) specialty = found;
            else {
                status = 'ERROR';
                reasons.push(`Spécialité inconnue: ${specialty}`);
            }
        }

        const phoneNorm = normalizePhone(row.phone || row.phone_norm);

        let slug = row.slug || slugify(row.name || '');

        // 2. Duplicate Detection
        // A. Profile URL Match (Strongest)
        if (status !== 'ERROR') {
            if (row.profile_url && existingByProfile.has(row.profile_url)) {
                status = 'UPDATE';
                matchType = 'profile_url';
                existingId = existingByProfile.get(row.profile_url).id;
                reasons.push("Mise à jour via URL Profil");
            }
            // B. Phone Match
            else if (phoneNorm && existingByPhone.has(phoneNorm)) {
                const matches = existingByPhone.get(phoneNorm);
                if (matches.length > 1) {
                    status = 'NEEDS_REVIEW';
                    matchType = 'phone';
                    reasons.push(`Téléphone partagé par ${matches.length} fiches existantes`);
                } else {
                    status = 'UPDATE';
                    matchType = 'phone';
                    existingId = matches[0].id;
                    reasons.push("Mise à jour via Téléphone");
                }
            }
            // C. Slug Match
            else if (existingBySlug.has(slug)) {
                // Check if name is similar?
                const existing = existingBySlug.get(slug);
                // If names are very different -> warning collision
                // For MVP, we treat exact slug match as UPDATE if names are close, else Warning collision
                if (existing.name.toLowerCase() === row.name.toLowerCase()) {
                    status = 'UPDATE';
                    matchType = 'slug';
                    existingId = existing.id;
                    reasons.push("Mise à jour via Slug/Nom");
                } else {
                    // Slug collision!
                    status = 'WARNING'; // Will be suffixed
                    slug = `${slug}-1`; // Simple resolution for now (preview only)
                    reasons.push("Collision de Slug (renommé)");
                }
            }
        }

        processedRows.push({
            status,
            reasons,
            matchType,
            existingId,
            originalIndex: i,
            data: {
                name: row.name,
                specialty,
                region: row.region || '',
                city: row.city || null,
                address_full: row.address_full || row.address || null,
                lat: row.lat ? parseFloat(row.lat) : null,
                lng: row.lng ? parseFloat(row.lng) : null,
                phone_norm: phoneNorm,
                website: row.website || null,
                profile_url: row.profile_url || null,
                status: row.status || 'active',
                is_verified: row.is_verified === 'true' || row.is_verified === '1' || row.is_verified === true,
                slug_seo: slug
            }
        });
    }

    return { success: true, rows: processedRows };
}


// --- ACTION: Publish ---
export async function publishImport(rows: ImportRow[]): Promise<{ success: boolean, summary: ImportSummary }> {
    // Re-verify rows logic would be ideal, but for MVP we trust the client passed back what we gave them (filtered)
    // Actually, safer to re-run matching or trust the IDs if we passed them?
    // We will trust the payloads for now, assuming admin is not malicious against themselves.

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of rows) {
        if (row.status === 'ERROR' || row.status === 'NEEDS_REVIEW') {
            skipped++;
            continue;
        }

        try {
            if (row.status === 'UPDATE' && row.existingId) {
                // Update logic: only non-empty fields
                const updatePayload: any = {};
                // Helper to only set if valid
                const setIf = (k: string, v: any) => { if (v !== null && v !== "" && v !== undefined) updatePayload[k] = v; };

                setIf('specialty', row.data.specialty);
                setIf('region', row.data.region);
                setIf('city', row.data.city);
                setIf('address_full', row.data.address_full);
                setIf('lat', row.data.lat);
                setIf('lng', row.data.lng);
                setIf('phone_norm', row.data.phone_norm);
                setIf('website', row.data.website);
                setIf('profile_url', row.data.profile_url);

                // Do NOT flip active to inactive unless explicit?
                // For now, allow CSV to determine status
                setIf('status', row.data.status);

                if (Object.keys(updatePayload).length > 0) {
                    await supabaseAdmin
                        .from('practitioners')
                        .update(updatePayload)
                        .eq('id', row.existingId);
                    updated++;
                } else {
                    skipped++;
                }

            } else {
                // Insert
                // Ensure unique slug loop if needed? 
                // For MVP, we try insert, if slug conflict, we append random
                let finalSlug = row.data.slug_seo;
                let attempts = 0;
                while (attempts < 3) {
                    const { error } = await supabaseAdmin.from('practitioners').insert({
                        ...row.data,
                        slug_seo: finalSlug
                    });

                    if (error && error.message.includes('unique constraint') && error.message.includes('slug')) {
                        finalSlug = `${row.data.slug_seo}-${Math.floor(Math.random() * 1000)}`;
                        attempts++;
                    } else if (error) {
                        console.error("Insert error", error);
                        errors++;
                        break;
                    } else {
                        inserted++;
                        break;
                    }
                }
            }
        } catch (e) {
            console.error(e);
            errors++;
        }
    }

    await logAdminAction('import.bulk', 'practitioners', 'batch', { count: rows.length }, { inserted, updated, errors });

    revalidatePath('/admin/practitioners');

    return {
        success: true,
        summary: {
            total: rows.length,
            inserted,
            updated,
            skipped,
            errors
        }
    };
}
