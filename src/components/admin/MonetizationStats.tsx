import { CheckCircle2, ShieldCheck, Crown, Percent, Euro, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface MonetizationStatsProps {
    claimedCount: number;
    verifiedCount: number;
    totalActive: number;
}

export function MonetizationStats({ claimedCount, verifiedCount, totalActive }: MonetizationStatsProps) {
    // Calculated metrics
    const conversionRate = totalActive > 0 ? ((claimedCount / totalActive) * 100).toFixed(1) : "0.0";

    // Placeholder metrics
    const premiumCount = 0;
    const revenueMetadata = { value: "0,00 €", trend: "+0%" };

    return (
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Euro className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">💰 Monétisation</h2>
                        <p className="text-xs text-gray-500">Revenus et conversion</p>
                    </div>
                </div>
                <Button variant="outline" className="text-xs h-8 gap-2 bg-white hover:bg-gray-50">
                    <CreditCard className="w-3 h-3" />
                    Connecter Stripe
                </Button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                {/* Revendiqués */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Revendiqués
                    </span>
                    <span className="text-2xl font-black text-gray-900">{claimedCount}</span>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                        Actifs
                    </span>
                </div>

                {/* Vérifiés */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" />
                        Vérifiés
                    </span>
                    <span className="text-2xl font-black text-gray-900">{verifiedCount}</span>
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                        Trust
                    </span>
                </div>

                {/* Premium (Placeholder) */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Crown className="w-3 h-3" />
                        Premium
                    </span>
                    <span className="text-2xl font-black text-gray-300">{premiumCount}</span>
                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                        Bientôt
                    </span>
                </div>

                {/* Taux de Conversion */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Percent className="w-3 h-3" />
                        Taux Conv.
                    </span>
                    <span className="text-2xl font-black text-gray-900">{conversionRate}%</span>
                    <span className="text-xs text-gray-500 font-medium">
                        Des profils actifs
                    </span>
                </div>

                {/* Revenus (Placeholder) */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Euro className="w-3 h-3" />
                        Revenus (Mois)
                    </span>
                    <span className="text-2xl font-black text-gray-300">{revenueMetadata.value}</span>
                    <span className="text-xs text-gray-400 font-medium">
                        ---
                    </span>
                </div>

            </div>
        </div>
    );
}
