"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { MessageCircle } from "lucide-react";
import { ContactFormModal } from "./ContactFormModal";

interface ContactButtonProps {
    practitionerId: string;
    practitionerName: string;
    variant?: "primary" | "outline";
    className?: string;
}

export function ContactButton({
    practitionerId,
    practitionerName,
    variant = "primary",
    className = ""
}: ContactButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                variant={variant}
                onClick={() => setIsModalOpen(true)}
                className={`gap-2 ${className}`}
            >
                <MessageCircle className="w-4 h-4" />
                Demander un rappel
            </Button>

            {isModalOpen && (
                <ContactFormModal
                    practitionerId={practitionerId}
                    practitionerName={practitionerName}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
