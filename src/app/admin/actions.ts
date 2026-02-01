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
