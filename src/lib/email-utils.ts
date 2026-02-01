import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = 'contact@equivio.fr'; // Or 'ne-pas-repondre@equivio.fr' if configured, but user asked for contact@equivio.fr
const ADMIN_EMAIL = 'contact@equivio.fr'; // Where admin notifications go

export async function sendClaimConfirmationEmail(toEmail: string, practitionerName: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY missing. Email not sent.");
        return;
    }

    try {
        await resend.emails.send({
            from: `Equivio <${SENDER_EMAIL}>`,
            to: toEmail,
            subject: 'Reçu : Votre demande de revendication sur Equivio',
            html: `
                <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
                    <h2>Demande bien reçue</h2>
                    <p>Bonjour,</p>
                    <p>Nous avons bien reçu votre demande de revendication pour la fiche de <strong>${practitionerName}</strong>.</p>
                    <p><strong>Rappel des engagements Equivio :</strong></p>
                    <ul>
                        <li>La vérification est effectuée manuellement par notre équipe.</li>
                        <li>Cette démarche permet de garantir l'exactitude des informations.</li>
                        <li>Elle n'implique aucun classement préférentiel ni avantage de visibilité.</li>
                    </ul>
                    <p>Vous recevrez un nouvel email dès que votre demande aura été traitée.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">
                        Equivio - L'annuaire indépendant des praticiens équins.<br>
                        Ceci est un message automatique, merci de ne pas y répondre directement.
                    </p>
                </div>
            `
        });
        console.log(`📧 Confirmation email sent to ${toEmail}`);
    } catch (error) {
        console.error("❌ Failed to send confirmation email:", error);
    }
}

export async function sendAdminNotificationEmail(practitionerName: string, claimerEmail: string, practitionerId: string) {
    if (!process.env.RESEND_API_KEY) return;

    try {
        await resend.emails.send({
            from: `System Equivio <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `[ADMIN] Nouvelle revendication : ${practitionerName}`,
            html: `
                <p>Nouvelle demande de revendication.</p>
                <ul>
                    <li><strong>Praticien :</strong> ${practitionerName}</li>
                    <li><strong>Demandeur :</strong> ${claimerEmail}</li>
                    <li><strong>ID :</strong> ${practitionerId}</li>
                </ul>
                <p>Vérifier dans Supabase > Practitioners.</p>
            `
        });
    } catch (error) {
        console.error("❌ Failed to send admin notification:", error);
    }
}
