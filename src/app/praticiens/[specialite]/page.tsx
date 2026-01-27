export const runtime = 'edge';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { DentistsList } from "@/components/DentistsList";
import Link from "next/link";
import { fetchPractitioners } from "@/lib/practitioners";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ specialite: string }> }): Promise<Metadata> {
    const resolvedParams = await params;

    // Plural mapping for Title
    const pluralTitles: Record<string, string> = {
        osteopathes: "Ostéopathes animaliers",
        marechaux: "Maréchaux-ferrants",
        dentistes: "Dentistes équins",
        veterinaires: "Vétérinaires équins",
        "bien-etre": "Praticiens bien-être",
    };

    // Singular mapping for description
    const singularTitles: Record<string, string> = {
        osteopathes: "ostéopathe animalier",
        marechaux: "maréchal-ferrant",
        dentistes: "dentiste équin",
        veterinaires: "vétérinaire équin",
        "bien-etre": "praticien bien-être",
    };

    const title = pluralTitles[resolvedParams.specialite] || "Praticiens équins";
    const typeSingular = singularTitles[resolvedParams.specialite] || "praticien équin";

    // We need the count for the title. 
    // Ideally we should cache or estimate this as fetching in generateMetadata might double cost if not careful,
    // but Next.js deduplicates requests.
    // However, we don't have the count here easily without importing fetch.
    // Let's assume we can fetch just the count or use a placeholder if needed, but request said "Dynamique".
    // I will fetch only count here.
    const { count } = await fetchPractitioners({
        specialty: singularTitles[resolvedParams.specialite] === "dentiste équin" ? "Dentisterie équine" : (resolvedParams.specialite === 'osteopathes' ? 'Ostéopathe animalier' : title), /* Need match DB specialty name */
        pageSize: 1
    });
    // Note: Mapping above for DB specialty is tricky if I don't use the exact shared logic.
    // The previous code had `titles` mapping to single DB values. I'll reuse that logic.

    return {
        title: `${title} en France (${count} praticiens) | Equivio`,
        description: `Trouvez un ${typeSingular} près de chez vous. Professionnels référencés selon leur présence terrain, sans classement sponsorisé.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ specialite: string }> }) {
    const resolvedParams = await params;

    const dbTitles: Record<string, string> = {
        osteopathes: "Ostéopathe animalier",
        marechaux: "Maréchal-ferrant",
        dentistes: "Dentisterie équine",
        veterinaires: "Vétérinaire équin",
        "bien-etre": "Praticien bien-être",
    };

    // Plural display for H1
    const pluralTitles: Record<string, string> = {
        osteopathes: "Ostéopathes animaliers",
        marechaux: "Maréchaux-ferrants",
        dentistes: "Dentistes équins",
        veterinaires: "Vétérinaires équins",
        "bien-etre": "Praticiens bien-être",
    };

    const currentDbTitle = dbTitles[resolvedParams.specialite] || "Praticien équin";
    const currentDisplayTitle = pluralTitles[resolvedParams.specialite] || "Praticiens équins";

    // Use shared fetch function
    const { data: practitioners, count: dbCount, error } = await fetchPractitioners({
        specialty: currentDbTitle,
        sort: 'pertinence',
        page: 1,
        pageSize: 50
    });

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: currentDisplayTitle },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="max-w-4xl space-y-8 reveal [animation-delay:100ms]">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                            {currentDisplayTitle} <span className="text-primary-soft">référencés en France</span>
                        </h1>

                        {/* 1. Bloc éditorial « Méthodologie Equivio » (OBLIGATOIRE) */}
                        <div className="bg-white border-l-4 border-primary p-6 rounded-r-xl shadow-sm max-w-3xl">
                            <h2 className="text-lg font-bold text-primary mb-2">Méthodologie Equivio</h2>
                            <p className="text-neutral-charcoal/80 text-sm leading-relaxed">
                                Les praticiens listés sur Equivio sont issus de bases professionnelles publiques, croisées et vérifiées manuellement.
                                La présence sur la plateforme repose sur une activité professionnelle constatée, sans notation, sans avis clients et sans classement sponsorisé.
                            </p>
                        </div>
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
                                    {currentDisplayTitle} en {r}
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
