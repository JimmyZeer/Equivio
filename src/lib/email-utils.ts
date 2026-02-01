import nodemailer from 'nodemailer';

// Configure SMTP Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.equivio.fr',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const SENDER_EMAIL = '"Equivio" <contact@equivio.fr>';
const ADMIN_EMAIL = 'contact@equivio.fr';

/**
 * Sends a confirmation email to the practitioner claiming their profile.
 */
export async function sendClaimConfirmationEmail(toEmail: string, practitionerName: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.warn("⚠️ SMTP credentials missing. Email not sent.");
        return;
    }

    try {
        await transporter.sendMail({
            from: SENDER_EMAIL,
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
        console.log(`📧 Confirmation email sent to ${toEmail} via SMTP`);
    } catch (error) {
        console.error("❌ Failed to send confirmation email:", error);
    }
}

/**
 * Sends a notification email to the admin.
 */
export async function sendAdminNotificationEmail(practitionerName: string, claimerEmail: string, practitionerId: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return;

    try {
        await transporter.sendMail({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL,
            subject: `[ADMIN] Nouvelle revendication : ${practitionerName}`,
            html: `
                <div style="font-family: sans-serif;">
                    <h3>Nouvelle demande de revendication</h3>
                    <ul>
                        <li><strong>Praticien :</strong> ${practitionerName}</li>
                        <li><strong>Demandeur :</strong> ${claimerEmail}</li>
                        <li><strong>ID Praticien :</strong> ${practitionerId}</li>
                    </ul>
                    <p>
                        <a href="https://equivio.fr/admin" style="background: #000; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
                            Accéder au dashboard (ou vérifier Supabase)
                        </a>
                    </p>
                    <p style="font-size: 12px; color: #666; margin-top: 20px;">
                        Vérifiez la table <code>practitioner_claim_requests</code>.
                    </p>
                </div>
            `
        });
        console.log(`📧 Admin notification sent via SMTP`);
    } catch (error) {
        console.error("❌ Failed to send admin notification:", error);
    }
}
