export const runtime = 'edge';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { DentistsList } from "@/components/DentistsList";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ specialite: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const titles: Record<string, string> = {
        osteopathes: "Ostéopathe animalier",
        marechaux: "Maréchal-ferrant",
        dentistes: "Dentiste équin",
        veterinaires: "Vétérinaire équin",
        "bien-etre": "Praticien bien-être",
    };
    const title = titles[resolvedParams.specialite] || "Praticien équin";

    return {
        title: `${title} certifiés en France | Equivio`,
        description: `Trouvez les meilleurs professionnels spécialisés en ${title.toLowerCase()} sur la base de leur activité réelle. Le réseau de confiance des praticiens équins.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ specialite: string }> }) {
    const resolvedParams = await params;

    const titles: Record<string, string> = {
        osteopathes: "Ostéopathe animalier",
        marechaux: "Maréchal-ferrant",
        dentistes: "Dentisterie équine", // Updated strictly for the requirement
        veterinaires: "Vétérinaire équin",
        "bien-etre": "Praticien bien-être",
    };

    const currentTitle = titles[resolvedParams.specialite] || "Praticien équin";

    let practitioners: any[] = [];
    let error: any = null;
    let dbCount = 0;

    try {
        // Build the query
        let query = supabase
            .from('practitioners')
            .select('id, slug, name, specialty, city, address_full, phone_norm, website, profile_url, quality_score, status', { count: 'exact' })
            .eq('specialty', currentTitle);

        // Filter status 'active' as required
        query = query.eq('status', 'active');

        // Sort by quality_score if available, otherwise name
        // (Assuming quality_score is descending, name ascending)
        query = query.order('quality_score', { ascending: false, nullsFirst: false })
            .order('name', { ascending: true });

        const { data, error: fetchError, count } = await query;

        if (fetchError) {
            console.error("Supabase fetch error details (Specialty):", fetchError);
            throw fetchError;
        }

        practitioners = data || [];
        dbCount = count || 0;

        // Debug Panel (Server Side Logs as requested)
        if (process.env.NODE_ENV === 'development') {
            console.log("--- DEBUG PANEL: Dentisterie Équine ---");
            console.log(`Querying for specialty: '${currentTitle}'`);
            console.log(`Rows fetched: ${practitioners.length}`);
            if (practitioners.length > 0) {
                console.log("First record sample:", practitioners[0]);
            } else {
                console.log("No records found. Check table 'practitioners', column 'specialty', and status 'active'.");
            }
            console.log("---------------------------------------");
        }

    } catch (e: any) {
        console.error("Caught error in CategoryPage:", e);
        error = e;
    }

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: currentTitle },
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
                            {currentTitle} <span className="text-primary-soft">référencés en France</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-charcoal/60 leading-relaxed text-pretty max-w-3xl">
                            Découvrez les professionnels spécialisés en {currentTitle.toLowerCase()} sur la base de leur activité réelle enregistrée.
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
                                    {dbCount} Praticiens trouvés
                                </h2>
                            </div>
                            <span className="text-[10px] text-neutral-charcoal/40 font-bold uppercase tracking-[0.2em]">Données certifiées</span>
                        </div>

                        {/* Rendering the dedicated list component */}
                        <DentistsList practitioners={practitioners} error={error} />
                    </section>

                    <section className="bg-leather-light/20 p-8 rounded-2xl border border-leather-light">
                        <h3 className="text-xl font-bold mb-6">Rechercher par région</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
                            {["Normandie", "Bretagne", "Nouvelle-Aquitaine", "Pays de la Loire", "Hauts-de-France", "Grand Est", "Occitanie"].map(r => (
                                <Link key={r} href={`/regions/${r.toLowerCase()}`} className="text-neutral-charcoal/60 hover:text-primary transition-all">
                                    {currentTitle} en {r}
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
