

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { PractitionerResults } from "@/components/PractitionerResults";
import Link from "next/link";
import { fetchPractitioners } from "@/lib/practitioners";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ specialite: string }> }): Promise<Metadata> {
    const resolvedParams = await params;

    // Plural mapping for Title
    const config: Record<string, { plural: string, singular: string, db: string }> = {
        osteopathes: { plural: "Ostéopathes équins", singular: "ostéopathe équin", db: "Ostéopathe animalier" },
        marechaux: { plural: "Maréchaux-ferrants", singular: "maréchal-ferrant", db: "Maréchal-ferrant" },
        dentistes: { plural: "Dentistes équins", singular: "dentiste équin", db: "Dentisterie équine" },
        "bien-etre": { plural: "Praticiens bien-être", singular: "praticien bien-être", db: "Praticien bien-être" },
    };

    const current = config[resolvedParams.specialite] || {
        plural: "Praticiens équins",
        singular: "praticien équin",
        db: "Praticien équin"
    };

    const { count } = await fetchPractitioners({
        specialty: current.db,
        pageSize: 1
    });

    return {
        title: `${current.plural} en France (${count} praticiens) | Equivio`,
        description: `Trouvez un ${current.singular} près de chez vous. Professionnels référencés selon leur présence terrain, sans classement sponsorisé.`,
    };
}

import { Pagination } from "@/components/ui/Pagination";

// ... previous imports

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ specialite: string }>, searchParams: Promise<{ page?: string }> }) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '1', 10) || 1;
    const pageSize = 50;

    const dbTitles: Record<string, string> = {
        osteopathes: "Ostéopathe animalier",
        marechaux: "Maréchal-ferrant",
        dentistes: "Dentisterie équine",
        "bien-etre": "Praticien bien-être",
    };

    // Plural display for H1
    const pluralTitles: Record<string, string> = {
        osteopathes: "Ostéopathes équins",
        marechaux: "Maréchaux-ferrants",
        dentistes: "Dentistes équins",
        "bien-etre": "Praticiens bien-être",
    };

    const currentDbTitle = dbTitles[resolvedParams.specialite] || "Praticien équin";
    const currentDisplayTitle = pluralTitles[resolvedParams.specialite] || "Praticiens équins";

    // Use shared fetch function
    const { data: practitioners, count: dbCount, error } = await fetchPractitioners({
        specialty: currentDbTitle,
        sort: 'pertinence',
        page: page,
        pageSize: pageSize
    });

    // Calculate total pages
    const totalPages = Math.ceil(dbCount / pageSize);

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: currentDisplayTitle },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    {/* ... breadcrumb, header, searchbar ... */}

                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="max-w-4xl space-y-8 reveal [animation-delay:100ms]">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                            {currentDisplayTitle} <span className="text-primary-soft">référencés en France</span>
                        </h1>

                        <div className="bg-white border-l-4 border-primary p-8 sm:p-10 rounded-r-[24px] shadow-card-rest hover:shadow-card-hover transition-all duration-300 max-w-3xl">
                            <h2 className="text-lg font-bold text-primary mb-3">Méthodologie Equivio</h2>
                            <p className="text-neutral-charcoal/80 text-sm leading-relaxed">
                                Les praticiens listés sur Equivio sont issus de bases professionnelles publiques, croisées et vérifiées manuellement.
                                La présence sur la plateforme repose sur une activité professionnelle constatée, sans notation, sans avis clients et sans classement sponsorisé.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-[24px] shadow-card-rest hover:shadow-card-hover transition-all duration-300 reveal [animation-delay:100ms]">
                        <SearchBar />
                    </div>

                    <div className="reveal [animation-delay:300ms]">
                        <PractitionerResults practitioners={practitioners} count={dbCount} error={error} />
                    </div>

                    {totalPages > 1 && (
                        <div className="reveal [animation-delay:400ms] pt-8 border-t border-neutral-stone/20">
                            <Pagination currentPage={page} totalPages={totalPages} />
                        </div>
                    )}

                    <section className="bg-white p-8 sm:p-10 rounded-[24px] shadow-card-rest hover:shadow-card-hover transition-all duration-300 border border-neutral-stone/20">
                        <h3 className="text-xl font-bold text-primary mb-6">Rechercher par région</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
                            {["Normandie", "Bretagne", "Nouvelle-Aquitaine", "Pays de la Loire", "Hauts-de-France", "Grand Est", "Occitanie"].map(r => (
                                <Link key={r} href={`/regions/${r.toLowerCase()}`} className="text-neutral-charcoal/60 hover:text-primary hover:underline transition-all">
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
