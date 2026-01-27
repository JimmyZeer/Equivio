import { MapPin, Phone, Globe, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PractitionerCard } from "./PractitionerCard";
import { Practitioner } from "@/lib/practitioners";

interface PractitionersListProps {
    practitioners: Practitioner[];
    error?: any;
}

export function PractitionersList({ practitioners, error }: PractitionersListProps) {
    if (error) {
        return (
            <div className="bg-red-50 p-8 rounded-xl border border-red-200 text-center text-red-800 flex flex-col items-center gap-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <p>Une erreur est survenue lors du chargement des dentistes. Veuillez réessayer.</p>
            </div>
        );
    }

    if (!practitioners || practitioners.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl border border-dashed border-neutral-stone/40 text-center text-neutral-charcoal/40 italic">
                Aucun dentiste équin trouvé pour le moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {practitioners.map((p) => {
                return (
                    <PractitionerCard
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        specialty={p.specialty}
                        city={p.city}
                        address_full={p.address_full}
                        phone_norm={p.phone_norm}
                        isClaimed={false} // TODO: Expose this from DB if needed, currently not in interface consistently
                        isVerified={p.status === 'active'} // Simplified logic for now, using status
                        slug_seo={p.slug_seo || p.slug || ""}
                    />
                );
            })}
        </div>
    );
}
