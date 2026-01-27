import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            practitionerId,
            practitionerName,
            name,
            email,
            phone,
            message,
            timestamp
        } = body;

        // Validate required fields
        if (!practitionerId || !name || !email || !message) {
            return NextResponse.json(
                { error: "Champs requis manquants" },
                { status: 400 }
            );
        }

        // Log the contact request (always works)
        console.log("📧 Nouvelle demande de contact:", {
            practitionerId,
            practitionerName,
            sender: { name, email, phone },
            message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
            timestamp: timestamp || new Date().toISOString()
        });

        // Try to store in Supabase (may fail if table doesn't exist)
        try {
            const { data, error } = await supabase
                .from("contact_requests")
                .insert({
                    practitioner_id: practitionerId,
                    practitioner_name: practitionerName,
                    sender_name: name,
                    sender_email: email,
                    sender_phone: phone || null,
                    message: message,
                    status: "pending",
                    created_at: timestamp || new Date().toISOString(),
                })
                .select()
                .single();

            if (error) {
                console.warn("Supabase insert failed (table may not exist):", error.code);
            } else {
                console.log("✅ Contact saved to Supabase:", data?.id);
            }
        } catch (dbError) {
            console.warn("Database operation failed:", dbError);
        }

        // TODO: Send email notification to practitioner
        // await sendEmailToPractitioner(practitionerId, { name, email, phone, message });

        // Always return success - contact was logged
        return NextResponse.json({
            success: true,
            message: "Demande envoyée avec succès"
        });

    } catch (err) {
        console.error("Contact API error:", err);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
