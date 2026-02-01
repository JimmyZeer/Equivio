import { supabaseAdmin } from "@/lib/supabase-admin";
import { Search, MapPin, Filter, AlertTriangle } from "lucide-react";
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminPractitionersPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const params = await searchParams; // Next.js 15+ needs await for searchParams access usually, safe to treat as promise or direct depending on version. Assuming direct access for standard Next.

    // Filters
    const query = typeof params.q === 'string' ? params.q : '';
    const statusFilter = typeof params.status === 'string' ? params.status : 'all';
    const warningFilter = typeof params.warning === 'string' ? params.warning : '';

    let dbQuery = supabaseAdmin
        .from('practitioners')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Pagination needed later, limit for now

    // Apply Filters
    if (statusFilter !== 'all') {
        dbQuery = dbQuery.eq('status', statusFilter);
    }

    if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    if (warningFilter === 'missing_coords') {
        dbQuery = dbQuery.is('lat', null);
    }
    if (warningFilter === 'missing_city') {
        dbQuery = dbQuery.is('city', null);
    }

    const { data: practitioners, error } = await dbQuery;

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Annuaire Praticiens</h1>
                    <p className="text-gray-500">Gérer, rechercher et corriger les fiches.</p>
                </div>
                {/* Search Box placeholder - Would need client component for interactivity or form submission */}
                <form className="flex gap-2">
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Rechercher par nom..."
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
                        <Search className="w-4 h-4" />
                    </button>
                </form>
            </header>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
                <Link
                    href="/admin/practitioners"
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${!statusFilter || statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Tous
                </Link>
                <Link
                    href="/admin/practitioners?status=active"
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Actifs
                </Link>
                <Link
                    href="/admin/practitioners?status=inactive"
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Inactifs
                </Link>

                <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>

                <Link
                    href="/admin/practitioners?warning=missing_coords"
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 transition-colors ${warningFilter === 'missing_coords' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                    <AlertTriangle className="w-3 h-3" />
                    Sans Coordonnées
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="p-4">Nom / Slug</th>
                                <th className="p-4">Spécialité</th>
                                <th className="p-4">Localisation</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {practitioners?.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{p.name}</div>
                                        <div className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{p.slug_seo}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                                            {p.job_title || "N/A"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className={`w-4 h-4 ${!p.lat ? 'text-orange-400' : 'text-gray-400'}`} />
                                            <span>{p.city || <span className="text-red-400 italic">Ville manquante</span>}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 pl-5.5">{p.postcode}</div>
                                    </td>
                                    <td className="p-4">
                                        {p.status === 'active' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Actif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                                                Inactif
                                            </span>
                                        )}
                                        {p.is_claimed && (
                                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                                                Revendiqué
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <a
                                            href={`/praticien/${p.slug_seo}`}
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                                        >
                                            Voir
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {practitioners?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                                        Aucun praticien trouvé avec ces critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
