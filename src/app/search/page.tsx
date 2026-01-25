export const runtime = 'edge';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{
        q?: string;
        l?: string;
        specialties?: string;
        verified?: string;
        claimed?: string;
        sort?: string;
    }>
}) {
    const params = await searchParams;
    const query = params.q || "";
    const location = params.l || "";
    const specialtiesMap: Record<string, string> = {
        osteopathes: "Ostéopathe animalier",
        marechaux: "Maréchal-ferrant",
        dentistes: "Dentiste équin",
        veterinaires: "Vétérinaire équin",
        "bien-etre": "Praticien bien-être",
    };

    const specialties = params.specialties ? params.specialties.split(",") : [];
    const verified = params.verified === "true";
    const claimed = params.claimed === "true";
    const sort = params.sort || "recent";

    const specialtyFilterNames = specialties.map(s => specialtiesMap[s]).filter(Boolean);

    let practitioners: any[] = [];
    let count = 0;
    let error: any = null;

    try {
        let supabaseQuery = supabase
            .from('practitioners')
            .select('id, name, specialty, city, address_full, slug_seo, status', { count: 'exact' })
            .eq('status', 'active');

        if (query) {
            supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,specialty.ilike.%${query}%`);
        }

        if (location) {
            supabaseQuery = supabaseQuery.ilike('city', `%${location}%`);
        }

        if (specialtyFilterNames.length > 0) {
            supabaseQuery = supabaseQuery.in('specialty', specialtyFilterNames);
        }

        // Sorting
        if (sort === "alpha") {
            supabaseQuery = supabaseQuery.order('name', { ascending: true });
        } else {
            supabaseQuery = supabaseQuery.order('name', { ascending: true }); // Fallback to name
        }

        const { data, error: fetchError, count: totalCount } = await supabaseQuery;

        if (fetchError) throw fetchError;
        practitioners = data || [];
        count = totalCount || 0;
    } catch (e: any) {
        console.error("Error fetching practitioners:", e);
        error = e;
    }

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Recherche" },
    ];

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
                                        {count} praticiens trouvés
                                    </h1>
                                    <p className="text-sm text-neutral-charcoal/50 font-medium tracking-wide">
                                        Professionnels actifs vérifiés
                                    </p>
                                </div>

                                <div className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">
                                    Tri : <span className="text-primary font-extrabold">
                                        {sort === "alpha" ? "Alphabétique" : "Pertinence"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {error ? (
                                    <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center text-red-800">
                                        Une erreur est survenue lors du chargement des praticiens.
                                    </div>
                                ) : practitioners.length > 0 ? (
                                    practitioners.map((p) => (
                                        <PractitionerCard
                                            key={p.id}
                                            name={p.name}
                                            specialty={p.specialty}
                                            city={p.city}
                                            address_full={p.address_full}
                                            slug_seo={p.slug_seo}
                                            interventionCount={0}
                                            lastIntervention="—"
                                            isClaimed={false}
                                            isVerified={true}
                                        />
                                    ))
                                ) : (
                                    <div className="bg-white p-12 rounded-2xl border border-dashed border-neutral-stone/40 text-center text-neutral-charcoal/40 italic">
                                        Aucun praticien trouvé pour cette recherche.
                                    </div>
                                )}
                            </div>

                            {count > 10 && (
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
