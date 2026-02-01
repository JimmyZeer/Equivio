'use client';

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { trackClaimClick } from "@/lib/analytics";

interface ClaimButtonProps {
    practitionerId: string;
    specialty: string;
}

export function ClaimButton({ practitionerId, specialty }: ClaimButtonProps) {
    const handleClick = () => {
        trackClaimClick(practitionerId, specialty);
    };

    return (
        <Link
            href={`/revendiquer?pid=${practitionerId}`}
            onClick={handleClick}
            className="block w-full pt-2"
        >
            <Button variant="outline" className="w-full text-primary hover:bg-primary/5 hover:text-primary font-medium border-transparent">
                Revendiquer ce profil
            </Button>
        </Link>
    );
}
