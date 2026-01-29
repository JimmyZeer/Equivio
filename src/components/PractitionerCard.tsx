"use client";

import Link from "next/link";
import { Button } from "./ui/Button";
import { PhoneNumberReveal } from "./PhoneNumberReveal";
import { FavoriteButton } from "./FavoriteButton";
import { Stethoscope, Hammer, Zap, Heart, Activity, MapPin, BadgeCheck, ArrowRight } from "lucide-react";

interface PractitionerCardProps {
    id: string;
    name: string;
    specialty: string;
    city?: string | null;
    address_full?: string | null;
    phone_norm?: string | null;
    isClaimed?: boolean;
    isVerified?: boolean;
    slug_seo?: string;
}

// Map specialty to icon and color
const getSpecialtyConfig = (specialty: string) => {
    if (specialty.includes("Ostéopathe")) return { icon: Stethoscope, color: "bg-emerald-500", textColor: "text-emerald-600", bgLight: "bg-emerald-50", label: "Ostéopathe équin" };
    if (specialty.includes("Maréchal")) return { icon: Hammer, color: "bg-amber-500", textColor: "text-amber-600", bgLight: "bg-amber-50", label: "Maréchal-ferrant" };
    if (specialty.includes("Dentist")) return { icon: Zap, color: "bg-sky-500", textColor: "text-sky-600", bgLight: "bg-sky-50", label: "Dentiste équin" };
    if (specialty.includes("Vétérinaire")) return { icon: Heart, color: "bg-rose-500", textColor: "text-rose-600", bgLight: "bg-rose-50", label: "Vétérinaire" };
    return { icon: Activity, color: "bg-violet-500", textColor: "text-violet-600", bgLight: "bg-violet-50", label: specialty };
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
        if (!address) return null;
        const match = address.match(/\d{5}\s+(.+)$/);
        return match ? match[1].trim() : address.split(',').pop()?.trim() || null;
    };

    const displayCity = city || getFallbackCity(address_full);
    const specialtyConfig = getSpecialtyConfig(specialty);
    const SpecialtyIcon = specialtyConfig.icon;
    const profileUrl = `/praticien/${slug_seo || id}`;

    return (
        <Link
            href={profileUrl}
            className="group block bg-white rounded-xl border border-neutral-stone/50 shadow-md p-4 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 relative overflow-hidden"
        >
            {/* Top gradient accent on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-soft to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

            {/* Header: Specialty icon + Name */}
            <div className="flex items-start gap-3">
                {/* Specialty Icon */}
                <div className={`shrink-0 w-10 h-10 rounded-lg ${specialtyConfig.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <SpecialtyIcon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h3 className="font-bold text-primary group-hover:text-primary-soft transition-colors line-clamp-2 leading-tight text-[15px]">
                        {name}
                    </h3>

                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Specialty tag */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${specialtyConfig.bgLight} ${specialtyConfig.textColor}`}>
                            {specialtyConfig.label}
                        </span>

                        {/* Location tag */}
                        {displayCity && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-600">
                                <MapPin className="w-3 h-3" />
                                {displayCity}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right side: Verified + Favorite */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                    {isVerified && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase tracking-wide">
                            <BadgeCheck className="w-3 h-3" />
                            Vérifié
                        </span>
                    )}
                    <div onClick={(e) => e.preventDefault()}>
                        <FavoriteButton practitionerId={id} size="sm" />
                    </div>
                </div>
            </div>

            {/* CTA Row */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-stone/20">
                {/* Phone (if available) */}
                {phone_norm ? (
                    <div onClick={(e) => e.preventDefault()} className="flex-1 max-w-[180px]">
                        <PhoneNumberReveal phoneNumber={phone_norm} practitionerId={id} compact />
                    </div>
                ) : (
                    <div className="flex-1" />
                )}

                {/* View Profile CTA */}
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-primary-soft transition-colors">
                    Voir le profil
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
            </div>
        </Link>
    );
}
