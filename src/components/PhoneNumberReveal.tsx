
"use client";

import { useState } from "react";
import { Phone, PhoneCall } from "lucide-react";
import { trackPhoneReveal } from "@/lib/analytics";

interface PhoneNumberRevealProps {
    phoneNumber: string;
    practitionerId: string;
    compact?: boolean;
}

export function PhoneNumberReveal({ phoneNumber, practitionerId, compact = false }: PhoneNumberRevealProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    const handleReveal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRevealed(true);
        trackPhoneReveal(practitionerId);
    };

    // Compact styles for card view
    const compactStyles = compact
        ? "px-3 py-1.5 rounded-lg text-xs gap-1.5"
        : "px-5 py-3 rounded-xl text-sm gap-2.5";

    if (isRevealed) {
        return (
            <a
                href={`tel:${phoneNumber}`}
                className={`group flex items-center justify-center ${compactStyles} bg-gradient-to-r from-primary to-primary-soft text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
                onClick={(e) => e.stopPropagation()}
            >
                <PhoneCall className={compact ? "w-3 h-3" : "w-4 h-4"} />
                <span className="tracking-wide">{phoneNumber}</span>
            </a>
        );
    }

    return (
        <button
            onClick={handleReveal}
            className={`group flex items-center justify-center ${compactStyles} bg-gradient-to-r from-primary to-primary-soft text-white font-bold shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full`}
        >
            <Phone className={compact ? "w-3 h-3" : "w-4 h-4 group-hover:animate-bounce"} />
            <span className="tracking-wide">{compact ? "Appeler" : "Afficher le numéro"}</span>
        </button>
    );
}

