
"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Phone } from "lucide-react";

interface PhoneNumberRevealProps {
    phoneNumber: string;
    practitionerId: string; // For analytics tracking later
}

export function PhoneNumberReveal({ phoneNumber, practitionerId }: PhoneNumberRevealProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    const handleReveal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRevealed(true);
        // TODO: Trigger analytics event 'reveal_phone' here
        console.log("Phone revealed for practitioner:", practitionerId);
    };

    if (isRevealed) {
        return (
            <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a
                    href={`tel:${phoneNumber}`}
                    className="font-bold text-primary hover:underline transition-colors animate-in fade-in zoom-in duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {phoneNumber}
                </a>
            </div>
        );
    }

    return (
        <Button
            variant="outline"
            className="gap-2 h-8 text-xs font-medium border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 px-3 py-1"
            onClick={handleReveal}
        >
            <Phone className="w-3 h-3" />
            Afficher le numéro
        </Button>
    );
}
