import Link from "next/link";
import { Button } from "./ui/Button";
import { PhoneNumberReveal } from "./PhoneNumberReveal";
import { Stethoscope, Hammer, Zap, Heart, Activity, MapPin } from "lucide-react";

interface PractitionerCardProps {
    id: string;
    name: string;
    specialty: string;
    city?: string | null;
    address_full?: string | null;
    phone_norm?: string | null;
    isClaimed?: boolean;
    isVerified?: boolean;
    slug_seo: string;
}

// Map specialty to icon
const getSpecialtyIcon = (specialty: string) => {
    if (specialty.includes("Ostéopathe")) return Stethoscope;
    if (specialty.includes("Maréchal")) return Hammer;
    if (specialty.includes("Dentist")) return Zap;
    if (specialty.includes("Vétérinaire")) return Heart;
    return Activity;
};

// Map specialty display name
const getSpecialtyDisplay = (specialty: string) => {
    if (specialty === "Ostéopathe animalier") return "Ostéopathe équin";
    if (specialty === "Dentisterie équine") return "Dentiste équin";
    return specialty;
};

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
    const getFallbackCity = (address: string | null | undefined) => {
        if (!address) return "Localisation non renseignée";
        const match = address.match(/\d{5}\s+(.+)$/);
        return match ? match[1].trim() : address.split(',').pop()?.trim() || "Localisation non renseignée";
    };

    const displayCity = city || getFallbackCity(address_full);
    const displaySpecialty = getSpecialtyDisplay(specialty);
    const SpecialtyIcon = getSpecialtyIcon(specialty);

    return (
        <div className="bg-white rounded-2xl border border-neutral-stone/40 p-6 transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-1 hover:border-primary/30 group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="space-y-3 flex-1 min-w-0">
                    <Link href={`/praticien/${slug_seo}`} className="block">
                        <h3 className="text-xl font-bold text-primary group-hover:text-primary-soft transition-colors truncate">
                            {name}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <SpecialtyIcon className="w-4 h-4" />
                        </div>
                        <p className="text-neutral-charcoal font-medium">
                            {displaySpecialty}
                        </p>
                    </div>

                    <p className="text-neutral-charcoal/60 text-sm font-medium capitalize flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-charcoal/40" />
                        {displayCity}
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    {phone_norm && (
                        <PhoneNumberReveal phoneNumber={phone_norm} practitionerId={id} />
                    )}
                    <Link href={`/praticien/${slug_seo}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full border-neutral-stone hover:bg-primary hover:text-white hover:border-primary text-neutral-charcoal/80 font-medium transition-all press-effect">
                            Voir le profil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

