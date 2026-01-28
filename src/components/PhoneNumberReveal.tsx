
"use client";

import { useState } from "react";
import { Phone, PhoneCall } from "lucide-react";
import { trackPhoneReveal } from "@/lib/analytics";

interface PhoneNumberRevealProps {
    phoneNumber: string;
    practitionerId: string;
}

export function PhoneNumberReveal({ phoneNumber, practitionerId }: PhoneNumberRevealProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    const handleReveal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRevealed(true);
        trackPhoneReveal(practitionerId);
    };

    if (isRevealed) {
        return (
            <a
                href={`tel:${phoneNumber}`}
                className="group flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-soft text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={(e) => e.stopPropagation()}
            >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                <span className="tracking-wide">{phoneNumber}</span>
            </a>
        );
    }

    return (
        <button
            onClick={handleReveal}
            className="group flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-soft text-white font-bold text-sm shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full"
        >
            <Phone className="w-4 h-4 group-hover:animate-bounce" />
            <span className="tracking-wide">Afficher le numéro</span>
        </button>
    );
}

