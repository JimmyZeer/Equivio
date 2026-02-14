import { supabaseAdmin } from "@/lib/supabase-admin";
import { AlertOctagon, AlertTriangle, PhoneOff, MapPinOff, Copy, Clock, FileInput } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getAlerts() {
    // 1. Fetch Practitioners Data for analysis
    const { data: practitioners, error } = await supabaseAdmin
        .from('practitioners')
        .select('id, name, city, lat, lng, phone_norm, updated_at')
        .eq('status', 'active');

    if (error || !practitioners) {
        console.error("Error fetching practitioners for alerts:", error);
        return null;
    }

    // 2. Calculate Metrics
    let noPhoneCount = 0;
    let noCoordsCount = 0;
    let inactiveCount = 0;

    // Duplicates logic: distinct key = name + city (normalized)
    const duplicateMap = new Map<string, number>();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    practitioners.forEach(p => {
        // No Phone
        if (!p.phone_norm) noPhoneCount++;

        // No Coords
        if (!p.lat || !p.lng) noCoordsCount++;

        // Inactive (based on updated_at) - simplistic check
        if (p.updated_at && new Date(p.updated_at) < sixMonthsAgo) inactiveCount++;

        // Duplicates
        if (p.name && p.city) {
            const key = `${p.name.toLowerCase().trim()}|${p.city.toLowerCase().trim()}`;
            duplicateMap.set(key, (duplicateMap.get(key) || 0) + 1);
        }
    });

    // Count actual duplicate GROUPS (not total duplicate items, but groups that have > 1 item)
    // Or users usually want to know "How many practitioners are potential duplicates?"
    // Let's count the number of practitioners involved in duplicates (i.e. if 2 same, count 2. If 3 same, count 3).
    // Actually, usually "Potential Duplicates" implies "X cases found". Let's count groups for now.
    let duplicateGroups = 0;
    duplicateMap.forEach((count) => {
        if (count > 1) duplicateGroups++;
    });

    // 3. Pending Claims
    const { count: pendingClaimsCount } = await supabaseAdmin
        .from('practitioner_claim_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    return {
        noPhoneCount,
        noCoordsCount,
        inactiveCount,
        duplicateGroups,
        pendingClaimsCount: pendingClaimsCount || 0
    };
}

export async function SystemAlerts() {
    const alerts = await getAlerts();

    if (!alerts) return null;

    // Define items
    const items = [
        {
            label: "Revendications en attente",
            count: alerts.pendingClaimsCount,
            icon: FileInput,
            color: "red", // Critical
            href: "/admin/claims",
            criticalThreshold: 1 // If > 0, it's critical
        },
        {
            label: "Sans téléphone",
            count: alerts.noPhoneCount,
            icon: PhoneOff,
            color: "orange",
            href: "/admin/practitioners?warning=no_phone",
            criticalThreshold: 50
        },
        {
            label: "Sans coordonnées GPS",
            count: alerts.noCoordsCount,
            icon: MapPinOff,
            color: "orange",
            href: "/admin/practitioners?warning=missing_coords",
            criticalThreshold: 50
        },
        {
            label: "Doublons potentiels",
            count: alerts.duplicateGroups,
            icon: Copy,
            color: "red", // Critical quality issue
            href: "/admin/practitioners?warning=duplicates",
            criticalThreshold: 1
        },
        {
            label: "Inactifs > 6 mois",
            count: alerts.inactiveCount,
            icon: Clock,
            color: "gray",
            href: "/admin/practitioners?warning=inactive",
            criticalThreshold: 100
        }
    ];

    // Filter to only show relevant alerts (count > 0)
    const activeAlerts = items.filter(item => item.count > 0);

    if (activeAlerts.length === 0) return null;

    return (
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <AlertOctagon className="w-5 h-5 text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">⚠️ Alertes Système</h2>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeAlerts.length}
                </span>
            </div>

            <div className="divide-y divide-gray-100">
                {activeAlerts.map((alert, idx) => {
                    const isCritical = alert.color === 'red' || alert.count >= alert.criticalThreshold;
                    const textColor = isCritical ? 'text-red-600' : 'text-orange-600';
                    const bgColor = isCritical ? 'bg-red-50' : 'bg-orange-50';
                    const iconColor = isCritical ? 'text-red-500' : 'text-orange-500';

                    return (
                        <Link
                            key={idx}
                            href={alert.href}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>
                                    <alert.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                                        {alert.label}
                                    </p>
                                    <p className="text-xs text-gray-400">Action requise</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`font-black text-xl ${textColor}`}>
                                    {alert.count}
                                </span>
                                <span className="text-gray-300">→</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
