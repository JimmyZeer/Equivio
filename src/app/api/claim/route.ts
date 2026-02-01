import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendClaimConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email-utils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { practitionerId, claimData, slug } = body;

        // Basic validation
        if (!practitionerId || !claimData?.claimer_email || !claimData.consent) {
            return NextResponse.json(
                { error: "Données incomplètes ou consentement manquant" },
                { status: 400 }
            );
        }

        // 1. Update Database (Secure Server-Side Operation)
        // Note: In production with RLS, using the service role key would be better if public update is restricted.
        // For now, assuming standard client/anon key works as per previous implementation logic, 
        // but server-side is safer for future RLS hardening.
        const { error } = await supabase
            .from('practitioners')
            .update({
                claimed_contact: {
                    ...claimData,
                    ip: request.headers.get('x-forwarded-for') || 'unknown'
                },
                claimed_at: new Date().toISOString(),
                // is_claimed remains false
            })
            .eq('id', practitionerId);

        if (error) {
            console.error("DB Update Error:", error);
            return NextResponse.json(
                { error: "Erreur lors de l'enregistrement en base" },
                { status: 500 }
            );
        }

        // 2. Send Confirmation Email to User
        await sendClaimConfirmationEmail(claimData.claimer_email, claimData.claimer_name || "Praticien");

        // 3. Send Admin Notification (Fire and forget)
        const pName = claimData.claimer_name || "Inconnu";
        sendAdminNotificationEmail(pName, claimData.claimer_email, practitionerId).catch(console.error);

        return NextResponse.json({
            success: true,
            message: "Revendication enregistrée avec succès"
        });

    } catch (err) {
        console.error("Claim API Error:", err);
        return NextResponse.json(
            { error: "Erreur serveur inattendue" },
            { status: 500 }
        );
    }
}
