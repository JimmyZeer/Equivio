"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { ChevronRight } from "lucide-react";
import { AddInterventionModal } from "./AddInterventionModal";

interface ClientProps {
    practitionerName: string;
    practitionerId: string;
}

export function ProfileInterventionClient({ practitionerName, practitionerId }: ClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(true)} className="group">
                Je suis client <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <AddInterventionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                practitionerName={practitionerName}
                practitionerId={practitionerId}
            />
        </>
    );
}
