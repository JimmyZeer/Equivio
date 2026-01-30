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
            className="group block bg-white rounded-[20px] shadow-card-rest p-6 transition-all duration-300 hover:shadow-card-hover hover-lift relative overflow-hidden ring-1 ring-black/[0.03]"
        >
            {/* Top gradient accent on hover - Refined opacity */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-soft to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-80" />

            {/* Header: Specialty icon + Name */}
            <div className="flex items-start gap-5">
                {/* Specialty Icon - Larger & Rounder */}
                <div className={`shrink-0 w-12 h-12 rounded-2xl ${specialtyConfig.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <SpecialtyIcon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                    {/* Name - Cleaner font weight */}
                    <h3 className="font-semibold text-lg text-primary group-hover:text-primary-soft transition-colors line-clamp-2 leading-tight">
                        {name}
                    </h3>

                    {/* Tags row - Pill shapes */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {/* Specialty tag */}
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${specialtyConfig.bgLight} ${specialtyConfig.textColor}`}>
                            {specialtyConfig.label}
                        </span>

                        {/* Location tag */}
                        {displayCity && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                                <MapPin className="w-3 h-3" />
                                {displayCity}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right side: Verified + Favorite */}
                <div className="shrink-0 flex flex-col items-end gap-3">
                    {isVerified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-wide border border-primary/10">
                            <BadgeCheck className="w-3 h-3" />
                            Vérifié
                        </span>
                    )}
                    <div onClick={(e) => e.preventDefault()} className="hover:scale-110 transition-transform">
                        <FavoriteButton practitionerId={id} size="sm" />
                    </div>
                </div>
            </div>

            {/* CTA Row - Ghost button style */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-neutral-100">
                {/* Phone (if available) */}
                {phone_norm ? (
                    <div onClick={(e) => e.preventDefault()} className="flex-1 max-w-[200px]">
                        <PhoneNumberReveal phoneNumber={phone_norm} practitionerId={id} compact />
                    </div>
                ) : (
                    <div className="flex-1" />
                )}

                {/* View Profile CTA - Animated Arrow */}
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-primary-soft transition-colors">
                    Voir le profil
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
            </div>
        </Link>
    );
}
