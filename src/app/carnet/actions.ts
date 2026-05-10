'use server';

import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { headers } from 'next/headers';

const schema = z.object({
    email: z.string().trim().toLowerCase().email("Email invalide"),
    role: z.enum(['owner', 'pro', 'both']),
    horse_count: z.coerce.number().int().min(1).max(200).optional().nullable(),
    pro_specialty: z.string().trim().max(100).optional().nullable(),
    region: z.string().trim().max(100).optional().nullable(),
    source: z.string().trim().max(100).optional().nullable(),
    utm_source: z.string().trim().max(100).optional().nullable(),
    utm_medium: z.string().trim().max(100).optional().nullable(),
    utm_campaign: z.string().trim().max(100).optional().nullable(),
});

export type EarlyAccessResult =
    | { success: true }
    | { success: false; error: string; field?: 'email' | 'role' | 'general' };

export async function submitEarlyAccess(formData: FormData): Promise<EarlyAccessResult> {
    const raw = {
        email: formData.get('email'),
        role: formData.get('role'),
        horse_count: formData.get('horse_count') || null,
        pro_specialty: formData.get('pro_specialty') || null,
        region: formData.get('region') || null,
        source: formData.get('source') || null,
        utm_source: formData.get('utm_source') || null,
        utm_medium: formData.get('utm_medium') || null,
        utm_campaign: formData.get('utm_campaign') || null,
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const field = issue?.path[0];
        return {
            success: false,
            error: issue?.message || "Données invalides",
            field: field === 'email' ? 'email' : field === 'role' ? 'role' : 'general',
        };
    }

    const userAgent = (await headers()).get('user-agent')?.slice(0, 500) || null;

    try {
        const { error } = await supabase
            .from('early_access_signups')
            .insert({
                email: parsed.data.email,
                role: parsed.data.role,
                horse_count: parsed.data.horse_count,
                pro_specialty: parsed.data.pro_specialty,
                region: parsed.data.region,
                source: parsed.data.source,
                utm_source: parsed.data.utm_source,
                utm_medium: parsed.data.utm_medium,
                utm_campaign: parsed.data.utm_campaign,
                user_agent: userAgent,
            });

        if (error) {
            // Duplicate email — treat as success to avoid leaking info & to keep UX positive
            if (error.code === '23505') {
                return { success: true };
            }
            console.error('Early access insert error:', error);
            return { success: false, error: "Erreur lors de l'enregistrement. Réessayez.", field: 'general' };
        }

        return { success: true };
    } catch (e) {
        console.error('Early access submit exception:', e);
        return { success: false, error: "Erreur serveur. Réessayez dans un instant.", field: 'general' };
    }
}
