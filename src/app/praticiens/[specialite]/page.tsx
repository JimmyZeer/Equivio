"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function CategoryPage({ params }: { params: { specialite: string } }) {
    const [practitioners, setPractitioners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const titles: Record<string, string> = {
        osteopathes: "Ostéopathes équins",
        marechaux: "Maréchaux-ferrants",
        dentistes: "Dentistes équins",
        veterinaires: "Vétérinaires équins",
        "bien-etre": "Praticiens bien-être",
    };

    const title = titles[params.specialite] || "Praticiens équins";

    useEffect(() => {
        const fetchPractitioners = async () => {
            setLoading(true);
            try {
                // In a real app we might store specialty slug in the DB
                // For now, we'll fetch where specialty matches the mapped title
                const { data, error } = await supabase
                    .from('practitioners')
                    .select('*')
                    .eq('specialty', title)
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
    }, [params.specialite, title]);

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: title },
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
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                            {title} <span className="text-primary-soft">référencés en France</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-charcoal/60 leading-relaxed text-pretty max-w-3xl">
                            Découvrez les professionnels spécialisés en {title.toLowerCase()} sur la base de leur activité réelle enregistrée.
                            La sélection Equivio garantit une visibilité neutre et factuelle.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-neutral-stone/40 shadow-premium reveal [animation-delay:200ms]">
                        <SearchBar />
                    </div>

                    <section className="space-y-10 reveal [animation-delay:300ms]">
                        <div className="flex justify-between items-center bg-stone-100/50 p-6 rounded-xl border border-neutral-stone/30">
                            <div className="space-y-1">
                                <h2 className="font-bold text-primary uppercase tracking-[0.15em] text-xs flex items-center gap-3">
                                    <span className="w-2 h-2 bg-primary-soft rounded-full animate-pulse shadow-[0_0_8px_rgba(58,107,79,0.5)]"></span>
                                    Activité récente enregistrée
                                </h2>
                            </div>
                            <span className="text-[10px] text-neutral-charcoal/40 font-bold uppercase tracking-[0.2em]">Flux en temps réel</span>
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
                                Aucun praticien trouvé dans cette catégorie.
                            </div>
                        )}
                    </section>

                    <section className="bg-leather-light/20 p-8 rounded-2xl border border-leather-light">
                        <h3 className="text-xl font-bold mb-6">Rechercher par région</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
                            {["Normandie", "Bretagne", "Nouvelle-Aquitaine", "Pays de la Loire", "Hauts-de-France", "Grand Est", "Occitanie"].map(r => (
                                <Link key={r} href={`/regions/${r.toLowerCase()}`} className="text-neutral-charcoal/60 hover:text-primary transition-all">
                                    {title} en {r}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
