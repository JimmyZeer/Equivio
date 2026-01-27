"use client";

import { ShieldCheck, Phone, MapPin, Camera, Globe, GraduationCap } from "lucide-react";
import { useState } from "react";

interface TransparencyIndexProps {
    // Score components (each true = points)
    isVerified?: boolean;        // Profil vérifié = +20pts
    hasPhone?: boolean;          // Téléphone confirmé = +15pts
    hasRegion?: boolean;         // Présence terrain = +25pts
    hasCity?: boolean;           // Ville renseignée = +15pts
    hasWebsite?: boolean;        // Site web = +10pts
    hasPhoto?: boolean;          // Photo pro = +15pts (future)
    hasDiploma?: boolean;        // Diplôme vérifié = +20pts (future)
}

const SCORE_WEIGHTS = {
    isVerified: 20,
    hasPhone: 15,
    hasRegion: 25,
    hasCity: 15,
    hasWebsite: 10,
    hasPhoto: 15,
    hasDiploma: 20,
};

export function TransparencyIndex({
    isVerified = false,
    hasPhone = false,
    hasRegion = false,
    hasCity = false,
    hasWebsite = false,
    hasPhoto = false,
    hasDiploma = false,
}: TransparencyIndexProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate score
    const score =
        (isVerified ? SCORE_WEIGHTS.isVerified : 0) +
        (hasPhone ? SCORE_WEIGHTS.hasPhone : 0) +
        (hasRegion ? SCORE_WEIGHTS.hasRegion : 0) +
        (hasCity ? SCORE_WEIGHTS.hasCity : 0) +
        (hasWebsite ? SCORE_WEIGHTS.hasWebsite : 0) +
        (hasPhoto ? SCORE_WEIGHTS.hasPhoto : 0) +
        (hasDiploma ? SCORE_WEIGHTS.hasDiploma : 0);

    // Max possible score based on current criteria
    const maxScore = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
    const percentage = Math.round((score / maxScore) * 100);

    // Color based on score
    const getColor = () => {
        if (percentage >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (percentage >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-neutral-500 bg-neutral-100 border-neutral-200";
    };

    const getProgressColor = () => {
        if (percentage >= 70) return "bg-emerald-500";
        if (percentage >= 40) return "bg-amber-500";
        return "bg-neutral-400";
    };

    const criteria = [
        { key: "isVerified", label: "Profil vérifié", icon: ShieldCheck, active: isVerified, points: SCORE_WEIGHTS.isVerified },
        { key: "hasPhone", label: "Téléphone confirmé", icon: Phone, active: hasPhone, points: SCORE_WEIGHTS.hasPhone },
        { key: "hasRegion", label: "Zone d'intervention", icon: MapPin, active: hasRegion, points: SCORE_WEIGHTS.hasRegion },
        { key: "hasCity", label: "Ville renseignée", icon: MapPin, active: hasCity, points: SCORE_WEIGHTS.hasCity },
        { key: "hasWebsite", label: "Site web vérifié", icon: Globe, active: hasWebsite, points: SCORE_WEIGHTS.hasWebsite },
        { key: "hasPhoto", label: "Photo professionnelle", icon: Camera, active: hasPhoto, points: SCORE_WEIGHTS.hasPhoto },
        { key: "hasDiploma", label: "Diplôme vérifié", icon: GraduationCap, active: hasDiploma, points: SCORE_WEIGHTS.hasDiploma },
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
                        {percentage >= 70 ? "Excellent" : percentage >= 40 ? "Bon" : "À compléter"}
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
