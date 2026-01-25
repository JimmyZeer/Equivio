"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
    const [practitioners, setPractitioners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Recherche" },
    ];

    useEffect(() => {
        const fetchPractitioners = async () => {
            setLoading(true);
            try {
                const { data, error, count } = await supabase
                    .from('practitioners')
                    .select('*', { count: 'exact' })
                    .order('last_intervention', { ascending: false });

                if (error) throw error;
                setPractitioners(data || []);
                setCount(count || 0);
            } catch (error) {
                console.error("Error fetching practitioners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPractitioners();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-neutral-stone/40 shadow-premium reveal [animation-delay:100ms]">
                        <SearchBar />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="reveal [animation-delay:200ms]">
                            <FilterSidebar />
                        </div>

                        <div className="flex-1 space-y-10 reveal [animation-delay:300ms]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-extrabold tracking-tight">
                                        {loading ? "..." : count} praticiens trouvés
                                    </h1>
                                    <p className="text-sm text-neutral-charcoal/50 font-medium tracking-wide">
                                        Basé sur l’activité réelle enregistrée
                                    </p>
                                </div>

                                <div className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">
                                    Tri : <span className="text-primary font-extrabold">Activité récente</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {loading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    </div>
                                ) : practitioners.length > 0 ? (
                                    practitioners.map((p) => (
                                        <PractitionerCard
                                            key={p.id}
                                            name={p.name}
                                            specialty={p.specialty}
                                            region={p.region}
                                            slug={p.slug}
                                            interventionCount={p.intervention_count}
                                            lastIntervention={p.last_intervention ? new Date(p.last_intervention).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                                            isClaimed={true} // Defaulting for now
                                            isVerified={true} // Defaulting for now
                                        />
                                    ))
                                ) : (
                                    <div className="bg-white p-12 rounded-2xl border border-dashed border-neutral-stone/40 text-center text-neutral-charcoal/40 italic">
                                        Aucun praticien trouvé pour cette recherche.
                                    </div>
                                )}
                            </div>

                            {!loading && count > 10 && (
                                <div className="pt-8">
                                    <Pagination currentPage={1} totalPages={Math.ceil(count / 10)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
