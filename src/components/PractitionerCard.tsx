"use client";

import Link from "next/link";
import { Button } from "./ui/Button";
import { PhoneNumberReveal } from "./PhoneNumberReveal";
import { FavoriteButton } from "./FavoriteButton";
import { Stethoscope, Hammer, Zap, Heart, Activity, MapPin, BadgeCheck } from "lucide-react";

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

// Map specialty to icon and color
const getSpecialtyConfig = (specialty: string) => {
    if (specialty.includes("Ostéopathe")) return { icon: Stethoscope, color: "bg-emerald-500", label: "Ostéopathe équin" };
    if (specialty.includes("Maréchal")) return { icon: Hammer, color: "bg-amber-500", label: "Maréchal-ferrant" };
    if (specialty.includes("Dentist")) return { icon: Zap, color: "bg-sky-500", label: "Dentiste équin" };
    if (specialty.includes("Vétérinaire")) return { icon: Heart, color: "bg-rose-500", label: "Vétérinaire" };
    return { icon: Activity, color: "bg-violet-500", label: specialty };
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
    const specialtyConfig = getSpecialtyConfig(specialty);
    const SpecialtyIcon = specialtyConfig.icon;

    return (
        <div className="bg-white rounded-2xl border border-neutral-stone/30 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(31,61,43,0.15)] hover:-translate-y-1.5 hover:border-primary/20 group relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-soft to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex flex-col gap-4">
                {/* Header: Name + Badge + Favorite */}
                <div className="flex items-start justify-between gap-3">
                    <Link href={`/praticien/${slug_seo}`} className="block flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-primary-soft transition-colors leading-tight">
                            {name}
                        </h3>
                    </Link>
                    <div className="shrink-0 flex items-center gap-2">
                        {isVerified && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                                <BadgeCheck className="w-3 h-3" />
                                Vérifié
                            </div>
                        )}
                        <FavoriteButton practitionerId={id} size="sm" />
                    </div>
                </div>

                {/* Specialty Badge */}
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${specialtyConfig.color} flex items-center justify-center text-white shadow-lg`}>
                        <SpecialtyIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-neutral-charcoal">
                            {specialtyConfig.label}
                        </p>
                        <p className="text-xs text-neutral-charcoal/50 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {displayCity}
                        </p>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-neutral-stone/20">
                    {phone_norm && (
                        <div className="flex-1">
                            <PhoneNumberReveal phoneNumber={phone_norm} practitionerId={id} />
                        </div>
                    )}
                    <Link href={`/praticien/${slug_seo}`} className="flex-1">
                        <Button variant="outline" className="w-full min-h-[44px] border-neutral-stone/50 hover:bg-neutral-charcoal hover:text-white hover:border-neutral-charcoal text-neutral-charcoal font-semibold transition-all">
                            Voir le profil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
