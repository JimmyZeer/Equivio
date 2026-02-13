export interface TransparencyCriteria {
    isVerified?: boolean;
    hasPhone?: boolean;
    hasRegion?: boolean;
    hasCity?: boolean;
    hasWebsite?: boolean;
    hasPhoto?: boolean;
    hasDiploma?: boolean;
}

export const TRANSPARENCY_WEIGHTS = {
    isVerified: 20,
    hasPhone: 15,
    hasRegion: 25,
    hasCity: 15,
    hasWebsite: 10,
    hasPhoto: 15,
    hasDiploma: 20,
};

export const MAX_SCORE = Object.values(TRANSPARENCY_WEIGHTS).reduce((a, b) => a + b, 0);

export function calculateTransparencyScore(criteria: TransparencyCriteria) {
    const score =
        (criteria.isVerified ? TRANSPARENCY_WEIGHTS.isVerified : 0) +
        (criteria.hasPhone ? TRANSPARENCY_WEIGHTS.hasPhone : 0) +
        (criteria.hasRegion ? TRANSPARENCY_WEIGHTS.hasRegion : 0) +
        (criteria.hasCity ? TRANSPARENCY_WEIGHTS.hasCity : 0) +
        (criteria.hasWebsite ? TRANSPARENCY_WEIGHTS.hasWebsite : 0) +
        (criteria.hasPhoto ? TRANSPARENCY_WEIGHTS.hasPhoto : 0) +
        (criteria.hasDiploma ? TRANSPARENCY_WEIGHTS.hasDiploma : 0);

    const percentage = Math.round((score / MAX_SCORE) * 100);

    return { score, maxScore: MAX_SCORE, percentage };
}

export function getTransparencyLevel(percentage: number) {
    if (percentage >= 70) return { label: "Excellent", color: "emerald" };
    if (percentage >= 40) return { label: "Bon", color: "amber" };
    return { label: "À compléter", color: "neutral" };
}
