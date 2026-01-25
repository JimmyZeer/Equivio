"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { Info, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegionPage({ params }: { params: Promise<{ region: string }> }) {
    const [practitioners, setPractitioners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [regionName, setRegionName] = useState("");

    useEffect(() => {
        const fetchPractitioners = async () => {
            const p = await params;
            const rName = p.region.charAt(0).toUpperCase() + p.region.slice(1);
            setRegionName(rName);

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('practitioners')
                    .select('*')
                    .eq('region', rName)
                    .order('last_intervention', { ascending: false });

                if (error) throw error;
                setPractitioners(data || []);
            } catch (error) {
                console.error("Error fetching practitioners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPractitioners();
    }, [params]);

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: `Région : ${regionName}` },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="max-w-4xl space-y-6 reveal [animation-delay:100ms]">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                            Praticiens équins référencés en <span className="text-primary-soft">{regionName || "..."}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-charcoal/60 leading-relaxed text-pretty max-w-3xl">
                            Consultez l'activité réelle des professionnels intervenant dans la région {regionName}.
                            Equivio répertorie les interventions anonymisées pour vous offrir une vision objective du maillage professionnel local.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-neutral-stone/40 shadow-premium reveal [animation-delay:200ms]">
                        <SearchBar />
                    </div>

                    <section className="space-y-10 reveal [animation-delay:300ms]">
                        <div className="flex justify-between items-center bg-stone-100/50 p-6 rounded-xl border border-neutral-stone/30">
                            <h2 className="font-bold text-primary uppercase tracking-[0.15em] text-xs flex items-center gap-3">
                                <span className="w-2 h-2 bg-primary-soft rounded-full animate-pulse shadow-[0_0_8px_rgba(58,107,79,0.5)]"></span>
                                Activité récente anonymisée en {regionName}
                            </h2>
                            <span className="text-[10px] text-neutral-charcoal/40 font-bold uppercase tracking-[0.2em]">Flux territorial</span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            </div>
                        ) : practitioners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {practitioners.map((p) => (
                                    <PractitionerCard
                                        key={p.id}
                                        name={p.name}
                                        specialty={p.specialty}
                                        region={p.region}
                                        slug={p.slug}
                                        interventionCount={p.intervention_count}
                                        lastIntervention={p.last_intervention ? new Date(p.last_intervention).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                                        isClaimed={true}
                                        isVerified={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-2xl border border-dashed border-neutral-stone/40 text-center text-neutral-charcoal/40 italic">
                                Aucun praticien trouvé dans cette région.
                            </div>
                        )}
                    </section>

                    <section className="bg-leather-light/30 border border-leather-light/50 p-10 rounded-2xl flex flex-col md:flex-row gap-10 items-center reveal [animation-delay:400ms]">
                        <div className="bg-white p-5 rounded-full text-leather shadow-premium">
                            <Info className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-primary tracking-tight">Note de transparence locale</h3>
                            <p className="text-neutral-charcoal/70 text-base leading-relaxed max-w-3xl">
                                L'activité affichée pour la région {regionName} est issue d'un cumul de données certifiées et de déclarations propriétaires vérifiées par notre algorithme de cohérence géographique.
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
