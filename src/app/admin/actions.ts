'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function approveClaim(claimId: string, practitionerId: string, contactInfo: any) {
    // 1. Update Practitioner: set is_claimed=true, claimed_at=now, claimed_contact=info
    const { error: pError } = await supabaseAdmin
        .from('practitioners')
        .update({
            is_claimed: true,
            claimed_at: new Date().toISOString(),
            claimed_contact: contactInfo
        })
        .eq('id', practitionerId);

    if (pError) throw new Error(`Failed to update practitioner: ${pError.message}`);

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

        const { error } = await supabaseAdmin
            .from('practitioners')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Update Error:", error);
            return { success: false, error: error.message };
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

        revalidatePath('/admin/practitioners');
        return { success: true };
    } catch (err: any) {
        console.error("Unexpected Bulk Error:", err);
        return { success: false, error: err.message || "Erreur inattendue" };
    }
}
