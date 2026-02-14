'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/audit";

export async function approveClaim(claimId: string, practitionerId: string, contactInfo: any) {
    // 1. Update Practitioner: set is_claimed=true, claimed_at=now, claimed_contact=info
    // Get before data for audit
    const { data: beforeData } = await supabaseAdmin.from('practitioners').select('*').eq('id', practitionerId).single();

    const { error: pError } = await supabaseAdmin
        .from('practitioners')
        .update({
            is_claimed: true,
            claimed_at: new Date().toISOString(),
            claimed_contact: contactInfo
        })
        .eq('id', practitionerId);

    if (pError) throw new Error(`Failed to update practitioner: ${pError.message}`);

    // Audit Log
    await logAdminAction('claim.approve', 'practitioner', practitionerId, beforeData, { is_claimed: true, claimed_contact: contactInfo });
    await logAdminAction('claim.approve', 'claim_request', claimId, { status: 'pending' }, { status: 'approved' });

    // 2. Update Request Status: approved
    const { error: rError } = await supabaseAdmin
        .from('practitioner_claim_requests')
        .update({ status: 'approved' })
        .eq('id', claimId);

    if (rError) throw new Error(`Failed to update request: ${rError.message}`);

    revalidatePath('/admin/claims');
    revalidatePath(`/praticien`); // Revalidate all practitioner pages roughly (or specific one if possible, but path is slug based)
}

export async function rejectClaim(claimId: string) {
    const { error } = await supabaseAdmin
        .from('practitioner_claim_requests')
        .update({ status: 'rejected' })
        .eq('id', claimId);

    if (error) throw new Error(`Failed to reject request: ${error.message}`);

    // Audit Log
    await logAdminAction('claim.reject', 'claim_request', claimId, { status: 'pending' }, { status: 'rejected' });

    revalidatePath('/admin/claims');
}

// Practitioner Management Actions

export async function updatePractitioner(id: string, data: any) {
    try {
        // Basic validation / cleaning
        const updateData = { ...data };

        // Normalize phone (strip spaces/symbols if needed)
        if (updateData.phone_norm) {
            updateData.phone_norm = updateData.phone_norm.replace(/\s/g, '');
        }

        // Ensure slug isn't empty if provided
        if (updateData.slug_seo === '') {
            delete updateData.slug_seo;
        }

        // Clean undefined values
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        // Get before data
        const { data: beforeData } = await supabaseAdmin.from('practitioners').select('*').eq('id', id).single();

        const { error } = await supabaseAdmin
            .from('practitioners')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Update Error:", error);
            return { success: false, error: error.message };
        }

        // Audit Log
        if (beforeData) {
            await logAdminAction('practitioner.update', 'practitioner', id, beforeData, updateData);
        }

        revalidatePath('/admin/practitioners');
        if (data.slug_seo) {
            revalidatePath(`/praticien/${data.slug_seo}`);
        } else {
            revalidatePath('/praticien/[slug]', 'page');
        }

        return { success: true };
    } catch (err: any) {
        console.error("Unexpected Error:", err);
        return { success: false, error: err.message || "Une erreur inattendue est survenue" };
    }
}

export async function createPractitioner(data: any) {
    try {
        // Basic validation / cleaning
        const insertData = { ...data };

        // Normalize phone
        if (insertData.phone_norm) {
            insertData.phone_norm = insertData.phone_norm.replace(/\s/g, '');
        }

        // Generate Slug if missing
        if (!insertData.slug_seo && insertData.name) {
            insertData.slug_seo = insertData.name
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Default status
        if (!insertData.status) insertData.status = 'active';

        // Clean undefined
        Object.keys(insertData).forEach(key => insertData[key] === undefined && delete insertData[key]);

        const { data: newPractitioner, error } = await supabaseAdmin
            .from('practitioners')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            console.error("Create Error:", error);
            return { success: false, error: error.message };
        }

        // Audit Log
        await logAdminAction('practitioner.create', 'practitioner', newPractitioner.id, null, insertData);

        revalidatePath('/admin/practitioners');
        return { success: true, id: newPractitioner.id };

    } catch (err: any) {
        console.error("Unexpected Create Error:", err);
        return { success: false, error: err.message || "Erreur inattendue" };
    }
}

export async function bulkUpdateStatus(ids: string[], status: 'active' | 'inactive') {
    if (!ids || ids.length === 0) return { success: false, error: "Aucun élément sélectionné" };

    try {
        const { error } = await supabaseAdmin
            .from('practitioners')
            .update({ status })
            .in('id', ids);

        if (error) {
            console.error("Bulk Update Error:", error);
            return { success: false, error: error.message };
        }

        // Audit Log (Bulk)
        await logAdminAction('practitioner.bulk_status', 'practitioner', 'bulk', { count: ids.length, ids }, { status });

        revalidatePath('/admin/practitioners');
        return { success: true };
    } catch (err: any) {
        console.error("Unexpected Bulk Error:", err);
        return { success: false, error: err.message || "Erreur inattendue" };
    }
}

export async function geocodeAddress(query: string) {
    if (!query) return { success: false, error: "Adresse vide" };

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'EquivioAdmin/1.0 (admin@equivio.fr)'
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            return {
                success: true,
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            };
        } else {
            return { success: false, error: "Aucun résultat trouvé pour cette adresse" };
        }
    } catch (err: any) {
        console.error("Geocoding Error:", err);
        return { success: false, error: "Erreur lors du géocodage" };
    }
}
