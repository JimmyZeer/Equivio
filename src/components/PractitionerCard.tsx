import Link from "next/link";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { MapPin, Activity } from "lucide-react";
import { PhoneNumberReveal } from "./PhoneNumberReveal";

interface PractitionerCardProps {
    id: string; // Added ID for tracking
    name: string;
    specialty: string;
    city?: string | null;
    address_full?: string | null;
    phone_norm?: string | null;
    isClaimed?: boolean;
    isVerified?: boolean;
    slug_seo: string;
}

export function PractitionerCard({
    id,
    name,
    specialty,
    city,
    address_full,
    phone_norm,
    isClaimed,
    isVerified,
    slug_seo
}: PractitionerCardProps) {
    // Helper to extract city from address_full
    const getFallbackCity = (address: string | null | undefined) => {
        if (!address) return "Localisation non renseignée";
        const match = address.match(/\d{5}\s+(.+)$/);
        return match ? match[1].trim() : address.split(',').pop()?.trim() || "Localisation non renseignée";
    };

    const displayCity = city || getFallbackCity(address_full);

    // Badge Logic: Max 1 badge per card (Priority: Verified > Claimed > Presence)
    // For now, assume "Verified" implies verified presence or explicitly verified profile.
    // If multiple flags are true, we show only the highest priority one.
    let badge = null;
    if (isVerified) {
        badge = <Badge variant="verified">Profil vérifié</Badge>;
    } else if (isClaimed) {
        badge = <Badge variant="claimed">Profil revendiqué</Badge>;
    } else {
        // Fallback for visual balance if we want a badge or leave empty
        // For now, leave empty if neither verified nor claimed
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-stone/60 p-5 md:p-8 hover:shadow-premium-hover hover:border-primary-soft/20 hover:translate-y-[-2px] transition-soft group shadow-premium ring-0 hover:ring-1 hover:ring-primary-soft/5">
            <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-5 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href={`/praticien/${slug_seo}`} className="hover:underline decoration-primary/30 underline-offset-4">
                            <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight group-hover:text-primary-soft transition-colors duration-300">{name}</h3>
                        </Link>
                        {badge}
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-bold text-neutral-charcoal">{specialty}</span>
                        <div className="flex items-center gap-2 text-neutral-charcoal/50">
                            <MapPin className="w-4 h-4 text-primary-soft/60" strokeWidth={1.5} />
                            <span className="font-medium">{displayCity}</span>
                        </div>
                        {phone_norm && (
                            <div className="mt-2">
                                <PhoneNumberReveal phoneNumber={phone_norm} practitionerId={id} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-center gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-neutral-stone/20 pt-5 md:pt-0 md:pl-8 mt-2 md:mt-0">
                    {/* Replaced Metrics & "Presence terrain" with simpler Trust signal or removed entirely if redundant with badge */}
                    {/* Requirement: "Uniquement par badges de confiance" */}
                    {/* Keeping a subtle text if verified, else nothing */}
                    {isVerified && (
                        <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-right">
                            <Activity className="w-4 h-4 text-primary-soft shrink-0" strokeWidth={2} />
                            <span>Présence terrain confirmée</span>
                        </div>
                    )}
                </div>
            </div>
            {/* CTA Button */}
            <div className="mt-6 flex justify-end">
                <Link href={`/praticien/${slug_seo}`} className="w-full md:w-auto">
                    <Button variant="outline" className="w-full md:w-auto py-2 hover:bg-primary hover:border-primary hover:text-white">Voir le profil</Button>
                </Link>
            </div>
        </div>
    );
}
