import { supabaseAdmin } from "@/lib/supabase-admin";
import { TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

interface HealthCriteria {
    label: string;
    points: number;
    description: string;
}

const CRITERIA: Record<string, HealthCriteria> = {
    location: { label: "Localisation (Lat/Lng)", points: 20, description: "Géolocalisation précise" },
    phone: { label: "Téléphone", points: 20, description: "Numéro de contact" },
    description: { label: "Description", points: 20, description: "Présentation détaillée" },
    photo: { label: "Photo de profil", points: 20, description: "Image ou logo" },
    trust: { label: "Confiance (Revendiqué/Vérifié)", points: 20, description: "Statut validé" }
};

async function getHealthStats() {
    // Fetch active practitioners with necessary fields
    // Note: 'photo_url' usage depends on DB schema. If column missing, it will return null.
    // We assume 'description' exists. If not, adjustment needed.
    const { data: practitioners, error } = await supabaseAdmin
        .from('practitioners')
        .select('id, lat, lng, phone_norm, description, photo_url, is_claimed, is_verified')
        .eq('status', 'active');

    if (error || !practitioners) {
        console.error("Error fetching practitioners for health score:", error);
        return null;
    }

    let totalScore = 0;
    const criteriaFailureCounts = {
        location: 0,
        phone: 0,
        description: 0,
        photo: 0,
        trust: 0
    };

    const totalCount = practitioners.length;

    if (totalCount === 0) return { score: 0, weakPoints: [], totalCount: 0 };

    practitioners.forEach(p => {
        let pScore = 0;

        // 1. Location
        if (p.lat && p.lng) pScore += 20;
        else criteriaFailureCounts.location++;

        // 2. Phone
        if (p.phone_norm) pScore += 20;
        else criteriaFailureCounts.phone++;

        // 3. Description (check if not explicitly null or empty)
        if (p.description && p.description.trim().length > 0) pScore += 20;
        else criteriaFailureCounts.description++;

        // 4. Photo
        if (p.photo_url) pScore += 20;
        else criteriaFailureCounts.photo++;

        // 5. Trust
        if (p.is_claimed || p.is_verified) pScore += 20;
        else criteriaFailureCounts.trust++;

        totalScore += pScore;
    });

    const averageScore = Math.round(totalScore / totalCount);

    // Identify weak points (criteria with highest failure rate)
    const weakPoints = Object.entries(criteriaFailureCounts)
        .map(([key, count]) => ({
            key,
            failRate: (count / totalCount) * 100,
            label: CRITERIA[key].label
        }))
        .sort((a, b) => b.failRate - a.failRate) // Descending failure rate
        .slice(0, 3); // Top 3 weakest

    return {
        score: averageScore,
        weakPoints,
        totalCount
    };
}

export async function DataHealthScore() {
    const stats = await getHealthStats();

    if (!stats) return null;

    const { score, weakPoints } = stats;

    // Color logic
    let colorClass = "text-red-500";
    let bgClass = "bg-red-50";
    let barColor = "bg-red-500";
    let containerClass = "border-red-100";

    if (score >= 80) {
        colorClass = "text-emerald-600";
        bgClass = "bg-emerald-50/50";
        barColor = "bg-emerald-500";
        containerClass = "border-emerald-100/50";
    } else if (score >= 50) {
        colorClass = "text-orange-500";
        bgClass = "bg-orange-50";
        barColor = "bg-orange-500";
        containerClass = "border-orange-100";
    }

    return (
        <div className={`p-8 rounded-[24px] border shadow-sm ${containerClass} ${stats.score >= 80 ? 'bg-gradient-to-br from-white to-emerald-50/30' : 'bg-white'}`}>
            <div className="flex flex-col md:flex-row gap-8 items-center">

                {/* Score Circle / Left Side */}
                <div className="flex flex-col items-center justify-center text-center gap-2 min-w-[150px]">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Simply circular progress visualisation could be SVG, keeping it simpler for now with text */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            {/* Background Circle */}
                            <path
                                className="text-gray-100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            {/* Value Circle */}
                            <path
                                className={`${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-orange-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                strokeDasharray={`${score}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-black ${colorClass}`}>{score}</span>
                            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">/ 100</span>
                        </div>
                    </div>
                </div>

                {/* Content / Right Side */}
                <div className="flex-1 w-full space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            🧠 Score Global Santé des Données
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Calculé sur la moyenne de {stats.totalCount} profils actifs.
                        </p>
                    </div>

                    {/* Progress Bar VIsual */}
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${barColor} transition-all duration-1000`}
                            style={{ width: `${score}%` }}
                        />
                    </div>

                    {/* Weak Points */}
                    {weakPoints.length > 0 && (
                        <div className="bg-white/50 rounded-xl p-4 border border-gray-100/50">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Points d'amélioration prioritaires
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {weakPoints.map((wp) => (
                                    <div key={wp.key} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{wp.label}</p>
                                            <p className="text-xs text-red-500 font-medium">{Math.round(wp.failRate)}% incomplets</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
