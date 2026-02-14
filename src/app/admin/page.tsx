import { supabaseAdmin } from "@/lib/supabase-admin";
import { Users, CheckCircle2, AlertTriangle, MapPin, PhoneOff, FileWarning } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getStats() {
    // 1. Basic Counts
    const { count: activeCount } = await supabaseAdmin.from('practitioners').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: inactiveCount } = await supabaseAdmin.from('practitioners').select('*', { count: 'exact', head: true }).neq('status', 'active'); // Assuming active/inactive logic

    // 2. Engagement
    const { count: claimedCount } = await supabaseAdmin.from('practitioners').select('*', { count: 'exact', head: true }).eq('is_claimed', true);
    const { count: verifiedCount } = await supabaseAdmin.from('practitioners').select('*', { count: 'exact', head: true }).eq('is_verified', true);

    // 3. Data Health (Complex queries handled better directly if possible, or fetch small subsets. For now, we will do separate counts or use filters client side? No, server side preferred.)
    // For specific counts, we might need raw SQL or specific filters.

    // Missing Coords: status active AND (lat is null OR lng is null)
    const { count: missingCoords } = await supabaseAdmin.from('practitioners')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .is('lat', null);

    // Missing City
    const { count: missingCity } = await supabaseAdmin.from('practitioners')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .is('city', null); // Or empty string check? Supabase treats empty string diff than null usually.

    // 4. Recent Activity
    const { data: recentPractitioners } = await supabaseAdmin
        .from('practitioners')
        .select('id, name, city, specialty, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

    return {
        activeCount: activeCount || 0,
        inactiveCount: inactiveCount || 0,
        claimedCount: claimedCount || 0,
        verifiedCount: verifiedCount || 0,
        missingCoords: missingCoords || 0,
        missingCity: missingCity || 0,
        recentPractitioners: recentPractitioners || [],
        total: (activeCount || 0) + (inactiveCount || 0)
    };
}


export default async function AdminDashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-500">Aperçu de la base de données et de la santé des données.</p>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Praticiens Actifs</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-2">{stats.activeCount}</h3>
                        <p className="text-xs text-green-600 font-medium mt-1">Sur {stats.total} total</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Revendiqués</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-2">{stats.claimedCount}</h3>
                        <p className="text-xs text-gray-400 mt-1">Profils gérés par pros</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Verifiés</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-2">{stats.verifiedCount}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Inactifs / Cachés</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-2">{stats.inactiveCount}</h3>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-500">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Data Health Section */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Santé des Données
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Missing Coords */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold text-gray-800">Localisation Manquante</h3>
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-2">{stats.missingCoords}</p>
                        <p className="text-sm text-gray-500 mb-4">Praticiens actifs sans lat/lng</p>
                        <Link href="/admin/practitioners?warning=missing_coords" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                            Voir la liste <span>→</span>
                        </Link>
                    </div>

                    {/* Missing City */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-red-500" />
                            <h3 className="font-bold text-gray-800">Ville Manquante</h3>
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-2">{stats.missingCity}</p>
                        <p className="text-sm text-gray-500 mb-4">Praticiens sans ville renseignée</p>
                        <Link href="/admin/practitioners?warning=missing_city" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                            Voir la liste <span>→</span>
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-emerald-300 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-bold text-gray-800">Derniers Ajouts</h3>
                        </div>
                        <div className="space-y-3">
                            {stats.recentPractitioners?.map((p: any) => (
                                <div key={p.id} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                    <div>
                                        <p className="font-bold text-gray-900 truncate max-w-[120px]">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.city || "Ville inconnue"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono text-gray-400">
                                            {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'N/A'}
                                        </p>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!stats.recentPractitioners || stats.recentPractitioners.length === 0) && (
                                <p className="text-sm text-gray-400 italic">Aucune activité récente.</p>
                            )}
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-100">
                            <Link href="/admin/practitioners" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
                                Voir tout <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
