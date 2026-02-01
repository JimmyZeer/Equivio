'use server';

import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2, "Le nom est trop court"),
    specialty: z.enum([
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
    ]),
    city: z.string().min(2, "Ville requise"),
    phone: z.string().optional(),
    email: z.string().email("Email invalide"),
    notes: z.string().optional()
});

export async function submitListingRequest(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        specialty: formData.get('specialty'),
        city: formData.get('city'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        notes: formData.get('notes')
    };

    const result = schema.safeParse(rawData);

    if (!result.success) {
        // ZodError has an errors array
        return { success: false, error: result.error.issues[0]?.message || "Données invalides" };
    }

    try {
        const { error } = await supabase
            .from('listing_requests')
            .insert({
                ...result.data,
                status: 'pending'
            });

        if (error) {
            console.error('Submission error:', error);
            return { success: false, error: "Erreur lors de l'enregistrement. Réessayez." };
        }

        // Send Admin Notification (Fire & Forget)
        const { sendListingRequestNotification } = await import('@/lib/email-utils');
        sendListingRequestNotification(result.data).catch(console.error);

        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Erreur serveur." };
    }
}
