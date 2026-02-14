import { supabaseAdmin } from "@/lib/supabase-admin";
import { MousePointerClick, ExternalLink, Eye, Share2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getEngagementStats() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(today.getDate() - 60);

    const nowIso = today.toISOString();
    const thirtyDaysIso = thirtyDaysAgo.toISOString();
    const sixtyDaysIso = sixtyDaysAgo.toISOString();

    // 1. Fetch Analytics Events (last 60 days for variation)
    const { data: events, error } = await supabaseAdmin
        .from('analytics_events')
        .select('event_type, created_at')
        .gte('created_at', sixtyDaysIso);

    if (error) {
        console.error("Error fetching analytics events:", error);
        return null;
    }

    // Filter by period
    const currentPeriodEvents = events.filter(e => e.created_at >= thirtyDaysIso);
    const previousPeriodEvents = events.filter(e => e.created_at < thirtyDaysIso && e.created_at >= sixtyDaysIso);

    // Helpers
    const getCount = (eventList: any[], type: string) => eventList.filter(e => e.event_type === type).length;

    // Metrics
    const phoneRevealsCurrent = getCount(currentPeriodEvents, 'phone_reveal');
    const phoneRevealsPrev = getCount(previousPeriodEvents, 'phone_reveal');

    const websiteClicksCurrent = getCount(currentPeriodEvents, 'website_click');
    const websiteClicksPrev = getCount(previousPeriodEvents, 'website_click');

    const profileViewsCurrent = getCount(currentPeriodEvents, 'view_practitioner');
    const profileViewsPrev = getCount(previousPeriodEvents, 'view_practitioner');

    // 2. Claim Rate (Global)
    const { count: totalPractitioners } = await supabaseAdmin
        .from('practitioners')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    const { count: claimedPractitioners } = await supabaseAdmin
        .from('practitioners')
        .select('*', { count: 'exact', head: true })
        .eq('is_claimed', true);

    const claimRate = totalPractitioners ? ((claimedPractitioners || 0) / totalPractitioners) * 100 : 0;

    return {
        phoneReveals: {
            current: phoneRevealsCurrent,
            prev: phoneRevealsPrev,
            variation: calculateVariation(phoneRevealsCurrent, phoneRevealsPrev)
        },
        websiteClicks: {
            current: websiteClicksCurrent,
            prev: websiteClicksPrev,
            variation: calculateVariation(websiteClicksCurrent, websiteClicksPrev)
        },
        profileViews: {
            current: profileViewsCurrent,
            prev: profileViewsPrev,
            variation: calculateVariation(profileViewsCurrent, profileViewsPrev)
        },
        claimRate: {
            current: claimRate.toFixed(1),
            // No historical data for claim rate easily available without snapshots, so we omit variation or set 0
            variation: null
        }
    };
}

function calculateVariation(current: number, prev: number) {
    if (prev === 0) return current > 0 ? 100 : 0;
    return ((current - prev) / prev) * 100;
}

function VariationBadge({ value }: { value: number | null }) {
    if (value === null) return <span className="text-gray-400 text-xs">-</span>;
    if (value === 0) return <span className="text-gray-400 text-xs flex items-center gap-1"><Minus className="w-3 h-3" /> 0%</span>;

    const isPositive = value > 0;
    return (
        <span className={`text-xs font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(value).toFixed(0)}%
        </span>
    );
}

export async function EngagementStats() {
    const stats = await getEngagementStats();

    if (!stats) return <div className="p-4 text-red-500">Erreur de chargement des statistiques.</div>;

    const cards = [
        {
            title: "Phone Reveals",
            value: stats.phoneReveals.current,
            variation: stats.phoneReveals.variation,
            icon: MousePointerClick, // Or Phone if available, using generic click/interact icon
            colorClass: "bg-blue-50 text-blue-600",
            period: "30 jours"
        },
        {
            title: "Clics vers site web",
            value: stats.websiteClicks.current,
            variation: stats.websiteClicks.variation,
            icon: ExternalLink,
            colorClass: "bg-purple-50 text-purple-600",
            period: "30 jours"
        },
        {
            title: "Profils consultés",
            value: stats.profileViews.current,
            variation: stats.profileViews.variation,
            icon: Eye,
            colorClass: "bg-emerald-50 text-emerald-600",
            period: "30 jours"
        },
        {
            title: "Taux de revendication",
            value: `${stats.claimRate.current}%`,
            variation: null,
            icon: Share2,
            colorClass: "bg-orange-50 text-orange-600",
            period: "Global"
        }
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                📊 Engagement & Conversion
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[16px] shadow-sm border border-gray-200 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.colorClass}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                {card.period}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{card.title}</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
                                <div className="mb-1">
                                    <VariationBadge value={card.variation} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
