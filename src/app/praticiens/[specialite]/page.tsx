

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { PractitionerResults } from "@/components/PractitionerResults";
import Link from "next/link";
import { fetchPractitioners } from "@/lib/practitioners";
import { Metadata } from 'next';
import { SPECIALTY_CONTENT } from "@/lib/seo-content";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";

import { SPECIALTIES_CONFIG, DEFAULT_SPECIALTY } from "@/config/specialties";

export async function generateMetadata({ params }: { params: Promise<{ specialite: string }> }): Promise<Metadata> {
    const resolvedParams = await params;

    const current = SPECIALTIES_CONFIG[resolvedParams.specialite] || DEFAULT_SPECIALTY;

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

    const current = SPECIALTIES_CONFIG[resolvedParams.specialite] || DEFAULT_SPECIALTY;
    const currentDbTitle = current.db;
    const currentDisplayTitle = current.plural;
    const seoContent = SPECIALTY_CONTENT[resolvedParams.specialite];

    // SEO H1 fallback if exact match not found (should not happen for core specialties)
    const pageH1 = seoContent?.h1 || `${currentDisplayTitle} référencés en France`;

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
            {/* Structured Data */}
            <BreadcrumbSchema items={breadcrumbItems.map(item => ({ name: item.label, url: `https://equivio.fr${item.href || ''}` }))} />
            {seoContent?.faq && <FAQSchema questions={seoContent.faq} />}

            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    {/* ... breadcrumb, header, searchbar ... */}

                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="max-w-4xl space-y-8 reveal [animation-delay:100ms]">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                            {pageH1}
                        </h1>

                        <div className="space-y-6">
                            {/* SEO Intro Text */}
                            {seoContent?.intro && (
                                <div className="space-y-4 text-neutral-charcoal/80 text-lg leading-relaxed">
                                    {seoContent.intro.map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}
                                </div>
                            )}

                            <div className="bg-white border-l-4 border-primary p-6 rounded-r-[16px] shadow-sm max-w-3xl">
                                <h2 className="text-base font-bold text-primary mb-2">Méthodologie Equivio</h2>
                                <p className="text-neutral-charcoal/70 text-sm leading-relaxed">
                                    Les praticiens listés sur Equivio sont issus de bases professionnelles publiques, croisées et vérifiées manuellement.
                                    La présence sur la plateforme repose sur une activité professionnelle constatée, sans notation, sans avis clients et sans classement sponsorisé.
                                </p>
                            </div>
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

                    {/* FAQ Section */}
                    {seoContent?.faq && seoContent.faq.length > 0 && (
                        <section className="bg-white p-8 sm:p-10 rounded-[24px] shadow-card-rest border border-neutral-stone/20 reveal [animation-delay:500ms]">
                            <h2 className="text-2xl font-bold text-primary mb-8 text-center sm:text-left">
                                Questions fréquentes sur les {currentDisplayTitle.toLowerCase()}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {seoContent.faq.map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <h3 className="font-bold text-lg text-primary">{item.question}</h3>
                                        <p className="text-neutral-charcoal/70 text-sm leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="bg-white p-8 sm:p-10 rounded-[24px] shadow-card-rest hover:shadow-card-hover transition-all duration-300 border border-neutral-stone/20">
                        <h3 className="text-xl font-bold text-primary mb-6">Rechercher par région</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
                            {["Normandie", "Bretagne", "Nouvelle-Aquitaine", "Pays de la Loire", "Hauts-de-France", "Grand Est", "Occitanie", "Auvergne-Rhône-Alpes", "PACA", "Ile-de-France", "Corse"].map(r => (
                                <Link key={r} href={`/regions/${r.toLowerCase()}`} className="text-neutral-charcoal/60 hover:text-primary hover:underline transition-all">
                                    Trouver un {(SPECIALTIES_CONFIG[resolvedParams.specialite]?.db || DEFAULT_SPECIALTY.db).toLowerCase()} en {r}
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
