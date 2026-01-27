import Link from "next/link";
import { Button } from "./ui/Button";
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

    // Display Logic streamlined:
    // Name, Specialty (mapped if needed), City, Buttons.
    // No badges in listing.

    return (
        <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="space-y-3 flex-1 min-w-0">
                    <Link href={`/praticien/${slug_seo}`} className="block">
                        <h3 className="text-xl font-bold text-primary group-hover:text-primary-soft transition-colors truncate">
                            {name}
                        </h3>
                    </Link>

                    <p className="text-neutral-charcoal font-medium">
                        {specialty === "Ostéopathe animalier" ? "Ostéopathe équin" : specialty}
                    </p>

                    <p className="text-neutral-charcoal/60 text-sm font-medium capitalize flex items-center gap-2">
                        {displayCity}
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    {phone_norm && (
                        <PhoneNumberReveal phoneNumber={phone_norm} practitionerId={id} />
                    )}
                    <Link href={`/praticien/${slug_seo}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full border-neutral-stone hover:bg-neutral-offwhite hover:text-primary text-neutral-charcoal/80 font-medium">
                            Voir le profil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
