import { supabase } from "@/lib/supabase";

export async function trackPhoneReveal(practitionerId: string) {
    try {
        // We identify the session anonymously or via headers if available, but for now simple increment is key.
        // We log the event.
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
            // Silently fail or log to monitoring service in real app
            console.warn("Analytics Error:", error.message);
        } else {
            console.log("Analytics: Phone reveal tracked for", practitionerId);
        }
    } catch (e) {
        console.error("Analytics Exception:", e);
    }
}
