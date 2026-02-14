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

export async function trackPractitionerView(practitioner: { id: string, specialty: string, region?: string }) {
    try {
        // GA4
        gtag.event({
            action: 'view_practitioner',
            category: 'view',
            label: practitioner.specialty,
            practitioner_id: practitioner.id,
            region: practitioner.region || 'unknown'
        });

        // Supabase
        const { error } = await supabase
            .from('analytics_events')
            .insert([
                {
                    event_type: 'view_practitioner',
                    practitioner_id: practitioner.id,
                    metadata: {
                        specialty: practitioner.specialty,
                        region: practitioner.region || 'unknown',
                        timestamp: new Date().toISOString(),
                        page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
                    }
                }
            ]);

        if (error) console.warn("Supabase Analytics Error (view):", error.message);
    } catch (e) {
        console.error("Analytics Exception:", e);
    }
}

export async function trackWebsiteClick(practitionerId: string, url: string) {
    try {
        // GA4
        gtag.event({
            action: 'website_click',
            category: 'conversion',
            label: url,
            practitioner_id: practitionerId
        });

        // Supabase
        const { error } = await supabase
            .from('analytics_events')
            .insert([
                {
                    event_type: 'website_click',
                    practitioner_id: practitionerId,
                    metadata: {
                        target_url: url,
                        timestamp: new Date().toISOString()
                    }
                }
            ]);

        if (error) console.warn("Supabase Analytics Error (website_click):", error.message);
    } catch (e) {
        console.error("Analytics Exception:", e);
    }
}

export function trackClaimClick(practitionerId: string, specialty: string) {
    gtag.event({
        action: 'claim_click',
        category: 'conversion',
        label: specialty,
        practitioner_id: practitionerId
    });
}

