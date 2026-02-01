import { supabase } from "@/lib/supabase";
import * as gtag from "@/lib/gtag";

export async function trackPhoneReveal(practitionerId: string) {
    try {
        // GA4 Event
        gtag.event({
            action: 'phone_reveal',
            category: 'engagement',
            label: practitionerId,
            value: 1
        });

        // Supabase Analytics
        const { error } = await supabase
            .from('analytics_events')
            .insert([
                {
                    event_type: 'phone_reveal',
                    practitioner_id: practitionerId,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
                    }
                }
            ]);

        if (error) {
            console.warn("Supabase Analytics Error:", error.message);
        }
    } catch (e) {
        console.error("Analytics Exception:", e);
    }
}

export function trackPractitionerView(practitioner: { id: string, specialty: string, region?: string }) {
    gtag.event({
        action: 'view_practitioner',
        category: 'view',
        label: practitioner.specialty,
        practitioner_id: practitioner.id,
        region: practitioner.region || 'unknown'
    });
}

export function trackClaimClick(practitionerId: string, specialty: string) {
    gtag.event({
        action: 'claim_click',
        category: 'conversion',
        label: specialty,
        practitioner_id: practitionerId
    });
}

