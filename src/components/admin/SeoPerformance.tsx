import { LineChart, Search, MousePointer2, Eye, FileText, TrendingUp, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { fetchGscData } from '@/lib/gsc';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface SparklineProps {
    data: number[];
    color: string;
}

function Sparkline({ data, color }: SparklineProps) {
    const height = 40;
    const width = 100;

    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

async function getSeoStats() {
    // Check for GSC connection (placeholder logic)
    const isConnected = false;

    if (!isConnected) {
        // Return mock data for placeholder view
        return {
            connected: false,
            impressions: { value: "12.5k", data: [8, 9, 11, 10, 12, 13, 15, 14, 16, 18, 20, 19, 22, 24] },
            clicks: { value: "843", data: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 9, 10] },
            ctr: { value: "4.2%", data: [3.5, 3.6, 3.8, 4.0, 3.9, 4.1, 4.0, 4.2, 4.1, 4.3, 4.2, 4.4, 4.2, 4.2] },
            pages: { value: "156", data: [120, 125, 130, 132, 135, 140, 142, 145, 148, 150, 152, 154, 155, 156] },
            topQueries: [
                { query: "ostéopathe équin bordeaux", clicks: 124, impressions: 850 },
                { query: "dentiste cheval gironde", clicks: 98, impressions: 620 },
                { query: "maréchal ferrant urgence", clicks: 85, impressions: 410 },
                { query: "prix consultation ostéo cheval", clicks: 64, impressions: 320 },
                { query: "vétérinaire équin garde", clicks: 52, impressions: 280 },
            ],
            topPages: [
                { path: "/praticien/sophie-martin-osteo", clicks: 312 },
                { path: "/praticiens/osteopathe", clicks: 245 },
                { path: "/blog/mal-de-dos-cheval", clicks: 189 },
                { path: "/praticien/jean-dupont-marechal", clicks: 156 },
                { path: "/", clicks: 142 },
            ]
        };
    }

    return null; // TODO: Implement real API fetching
}

export async function SeoPerformance() {
    const stats = await getSeoStats();

    if (!stats) return null;

    const blurClass = !stats.connected ? "blur-[2px] select-none pointer-events-none opacity-60" : "";

    return (
        <div className="relative bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <LineChart className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">📈 Performance SEO (Google)</h2>
                        <p className="text-xs text-gray-500">28 derniers jours</p>
                    </div>
                </div>
                {!stats.connected && (
                    <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Mode Démo
                    </span>
                )}
            </div>

            {/* Content Container */}
            <div className="p-6">

                {/* KPI Cards */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${blurClass}`}>
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Impressions</span>
                            <Eye className="w-4 h-4 text-indigo-400" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 mb-2">{stats.impressions.value}</p>
                        <div className="h-8">
                            <Sparkline data={stats.impressions.data} color="#6366f1" />
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Clics</span>
                            <MousePointer2 className="w-4 h-4 text-blue-400" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 mb-2">{stats.clicks.value}</p>
                        <div className="h-8">
                            <Sparkline data={stats.clicks.data} color="#3b82f6" />
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">CTR Moyen</span>
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 mb-2">{stats.ctr.value}</p>
                        <div className="h-8">
                            <Sparkline data={stats.ctr.data} color="#10b981" />
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Pages Indexées</span>
                            <FileText className="w-4 h-4 text-orange-400" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 mb-2">{stats.pages.value}</p>
                        <div className="h-8">
                            <Sparkline data={stats.pages.data} color="#f97316" />
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${blurClass}`}>
                    {/* Top Queries */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            Top Requêtes
                        </h3>
                        <div className="space-y-3">
                            {stats.topQueries.map((q, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                    <span className="font-medium text-gray-700 truncate max-w-[200px]">{q.query}</span>
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="text-gray-500">{q.impressions} imp.</span>
                                        <span className="font-bold text-indigo-600">{q.clicks} clics</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Pages */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Top Pages
                        </h3>
                        <div className="space-y-3">
                            {stats.topPages.map((p, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                    <span className="font-medium text-gray-700 truncate max-w-[200px]">{p.path}</span>
                                    <span className="font-bold text-blue-600 text-xs">{p.clicks} visites</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Connect Overlay */}
            {!stats.connected && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100 max-w-md mx-4 transform transition-all hover:scale-105 active:scale-100">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LineChart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Connecter Search Console</h3>
                        <p className="text-gray-500 mb-6">Connectez votre compte Google pour voir les performances réelles de votre site en temps réel.</p>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-200">
                            Connecter maintenant
                        </button>
                        <p className="text-xs text-gray-400 mt-4">Nécessite des droits d'accès administrateur</p>
                    </div>
                </div>
            )}
        </div>
    );
}
