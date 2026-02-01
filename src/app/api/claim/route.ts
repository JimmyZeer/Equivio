import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendClaimConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email-utils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { practitionerId, claimData, slug, _gotcha } = body;
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // 🛡️ 1. Honeypot Check
        if (_gotcha) {
            console.warn(`🍯 Honeypot triggered by IP ${ip}`);
            // Return success to confuse bot
            return NextResponse.json({ success: true, message: "Revendication enregistrée" });
        }

        // Basic validation
        if (!practitionerId || !claimData?.claimer_email || !claimData.consent) {
            return NextResponse.json(
                { error: "Données incomplètes ou consentement manquant" },
                { status: 400 }
            );
        }

        // 🛡️ 2. Rate Limiting (Database Backed)
        // Check submissions from IP in last 15 mins
        const { count: ipCount, error: countError } = await supabase
            .from('practitioner_claim_requests')
            .select('*', { count: 'exact', head: true })
            .eq('ip_address', ip)
            .gt('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()); // 15 mins

        if (countError) {
            console.error("Rate limit check failed:", countError);
            // Fail open or closed? Let's fail open but log.
        }

        if ((ipCount || 0) >= 3) {
            console.warn(`🚫 Rate limit exceeded for IP ${ip}`);
            return NextResponse.json(
                { error: "Trop de demandes récentes. Veuillez réessayer plus tard." },
                { status: 429 }
            );
        }

        // Check submissions for this practitioner in last 1 hour
        const { count: practCount } = await supabase
            .from('practitioner_claim_requests')
            .select('*', { count: 'exact', head: true })
            .eq('practitioner_id', practitionerId)
            .gt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // 1 hour

        if ((practCount || 0) >= 2) {
            console.warn(`🚫 Rate limit exceeded for Practitioner ${practitionerId}`);
            return NextResponse.json(
                { error: "Une demande est déjà en cours pour ce praticien. Contactez le support si besoin." },
                { status: 429 }
            );
        }

        // 3. Insert into Request Table (Secure)
        const { error } = await supabase
            .from('practitioner_claim_requests')
            .insert({
                practitioner_id: practitionerId,
                claimer_name: claimData.claimer_name,
                claimer_email: claimData.claimer_email,
                claimer_phone: claimData.claimer_phone,
                claimer_website: claimData.claimer_website,
                claimer_message: claimData.claimer_message,
                consent: claimData.consent,
                ip_address: ip,
                status: 'pending',
                // details: { slug } // Optional if we want to store extra context
            });

        if (error) {
            console.error("DB Insert Error:", error);
            return NextResponse.json(
                { error: "Erreur lors de l'enregistrement de la demande" },
                { status: 500 }
            );
        }

        // 4. Send Confirmation Email to User
        // Note: We might want to be careful not to spam email service if rate limit fails.
        await sendClaimConfirmationEmail(claimData.claimer_email, claimData.claimer_name || "Praticien");

        // 5. Send Admin Notification
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
