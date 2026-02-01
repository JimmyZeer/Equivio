import { supabaseAdmin } from "@/lib/supabase-admin";
import { approveClaim, rejectClaim } from "../actions";
import { Button } from "@/components/ui/Button"; // Assuming these exist, or use standard HTML
import { Check, X, Globe, Mail, Phone, Clock } from "lucide-react";

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';

export default async function AdminClaimsPage() {
    // Fetch pending claims
    const { data: claims, error } = await supabaseAdmin
        .from('practitioner_claim_requests')
        .select(`
            *,
            practitioner:practitioners (slug_seo, name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-10 text-red-600">Error loading claims: {error.message}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Demandes de Revendication</h1>
                <p className="text-gray-500">Gérer les demandes en attente ({claims?.length || 0})</p>
            </header>

            <div className="space-y-6">
                {claims?.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-400">Aucune demande en attente.</p>
                    </div>
                ) : (
                    claims?.map((claim) => (
                        <div key={claim.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col lg:flex-row gap-6">

                            {/* Info Praticien */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">Cible</h3>
                                    <p className="text-xl font-bold text-gray-900">
                                        {/* @ts-ignore join relation */}
                                        {claim.practitioner?.name || "Praticien Inconnu"}
                                    </p>
                                    {/* @ts-ignore join relation */}
                                    {claim.practitioner?.slug_seo && (
                                        <a
                                            /* @ts-ignore join relation */
                                            href={`/praticien/${claim.practitioner.slug_seo}`}
                                            target="_blank"
                                            className="text-sm text-blue-500 hover:universe underline"
                                        >
                                            Voir la fiche publique
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>Demande du {new Date(claim.created_at).toLocaleDateString()} à {new Date(claim.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <span>IP: {claim.ip_address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Demandeur */}
                            <div className="flex-1 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0">
                                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">Demandeur</h3>
                                <div className="space-y-2">
                                    <p className="font-semibold text-gray-800">{claim.claimer_name}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <a href={`mailto:${claim.claimer_email}`} className="hover:text-blue-600">{claim.claimer_email}</a>
                                    </div>
                                    {claim.claimer_phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{claim.claimer_phone}</span>
                                        </div>
                                    )}
                                    {claim.claimer_website && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Globe className="w-4 h-4" />
                                            <a href={claim.claimer_website} target="_blank" className="hover:text-blue-600 underline truncate max-w-[200px]">{claim.claimer_website}</a>
                                        </div>
                                    )}
                                </div>
                                {claim.claimer_message && (
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic border border-gray-100">
                                        "{claim.claimer_message}"
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                                <form action={async () => {
                                    'use server';
                                    await approveClaim(claim.id, claim.practitioner_id, {
                                        email: claim.claimer_email,
                                        phone: claim.claimer_phone,
                                        name: claim.claimer_name
                                    });
                                }}>
                                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                        <Check className="w-5 h-5" />
                                        Approuver
                                    </button>
                                </form>

                                <form action={async () => {
                                    'use server';
                                    await rejectClaim(claim.id);
                                }}>
                                    <button className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                        <X className="w-5 h-5" />
                                        Rejeter
                                    </button>
                                </form>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
