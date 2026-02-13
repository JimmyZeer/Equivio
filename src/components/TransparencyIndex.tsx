"use client";

import { ShieldCheck, Phone, MapPin, Camera, Globe, GraduationCap } from "lucide-react";
import { useState } from "react";

import { TransparencyCriteria, calculateTransparencyScore, getTransparencyLevel, TRANSPARENCY_WEIGHTS } from "@/lib/transparency";

// ... existing imports

interface TransparencyIndexProps extends TransparencyCriteria { }

export function TransparencyIndex(props: TransparencyIndexProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        isVerified, hasPhone, hasRegion, hasCity,
        hasWebsite, hasPhoto, hasDiploma
    } = props;

    // Calculate score using shared utility
    const { score, maxScore, percentage } = calculateTransparencyScore(props);

    // Get level and color info
    const { label, color } = getTransparencyLevel(percentage);

    // Color based on score
    const getColor = () => {
        if (color === "emerald") return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (color === "amber") return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-neutral-500 bg-neutral-100 border-neutral-200";
    };

    const getProgressColor = () => {
        if (color === "emerald") return "bg-emerald-500";
        if (color === "amber") return "bg-amber-500";
        return "bg-neutral-400";
    };

    const criteria = [
        { key: "isVerified", label: "Profil vérifié", icon: ShieldCheck, active: isVerified, points: TRANSPARENCY_WEIGHTS.isVerified },
        { key: "hasPhone", label: "Téléphone confirmé", icon: Phone, active: hasPhone, points: TRANSPARENCY_WEIGHTS.hasPhone },
        { key: "hasRegion", label: "Zone d'intervention", icon: MapPin, active: hasRegion, points: TRANSPARENCY_WEIGHTS.hasRegion },
        { key: "hasCity", label: "Ville renseignée", icon: MapPin, active: hasCity, points: TRANSPARENCY_WEIGHTS.hasCity },
        { key: "hasWebsite", label: "Site web vérifié", icon: Globe, active: hasWebsite, points: TRANSPARENCY_WEIGHTS.hasWebsite },
        { key: "hasPhoto", label: "Photo professionnelle", icon: Camera, active: hasPhoto, points: TRANSPARENCY_WEIGHTS.hasPhoto },
        { key: "hasDiploma", label: "Diplôme vérifié", icon: GraduationCap, active: hasDiploma, points: TRANSPARENCY_WEIGHTS.hasDiploma },
    ];

    return (
        <div className="relative">
            {/* Main Badge */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all hover:shadow-md ${getColor()}`}
            >
                {/* Circular Progress */}
                <div className="relative w-10 h-10">
                    <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            opacity="0.2"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${percentage}, 100`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {percentage}
                    </span>
                </div>

                <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Indice de Transparence</p>
                    <p className="text-sm font-bold">
                        {label}
                    </p>
                </div>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-stone/40 p-4 z-50 animate-reveal">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-neutral-stone/20 pb-3">
                            <span className="text-sm font-bold text-primary">Détail du score</span>
                            <span className="text-lg font-bold">{score}/{maxScore} pts</span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        {/* Criteria list */}
                        <ul className="space-y-2 pt-2">
                            {criteria.map((item) => (
                                <li
                                    key={item.key}
                                    className={`flex items-center justify-between text-sm ${item.active ? "text-neutral-charcoal" : "text-neutral-charcoal/40"}`}
                                >
                                    <span className="flex items-center gap-2">
                                        <item.icon className={`w-4 h-4 ${item.active ? "text-emerald-500" : ""}`} />
                                        {item.label}
                                    </span>
                                    <span className={`font-bold ${item.active ? "text-emerald-600" : ""}`}>
                                        {item.active ? `+${item.points}` : "—"}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <p className="text-[10px] text-neutral-charcoal/40 pt-2 border-t border-neutral-stone/20">
                            L'Indice de Transparence Equivio™ mesure la complétude et la vérification du profil.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
