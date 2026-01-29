
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { Info, ShieldCheck, Stethoscope, Scissors, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Metadata } from 'next';
import Link from "next/link";

const SPECIALTIES = [
    { key: "all", label: "Tous", icon: null },
    { key: "osteopathe", label: "Ostéopathes", icon: Heart },
    { key: "dentiste", label: "Dentistes", icon: Scissors },
    { key: "veterinaire", label: "Vétérinaires", icon: Stethoscope },
];

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const regionName = resolvedParams.region.charAt(0).toUpperCase() + resolvedParams.region.slice(1);

    return {
        title: `Praticiens équins en ${regionName} | Equivio`,
        description: `Découvrez les meilleurs ostéopathes, vétérinaires et maréchaux certifiés intervenant en région ${regionName}. Basé sur l'activité réelle enregistrée.`,
    };
}

interface PageProps {
    params: Promise<{ region: string }>;
    searchParams: Promise<{ specialite?: string }>;
}

export default async function RegionPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const regionName = resolvedParams.region.charAt(0).toUpperCase() + resolvedParams.region.slice(1);
    const specialtyFilter = resolvedSearchParams.specialite || "all";

    let practitioners: any[] = [];
    let error: any = null;

    try {
        let query = supabase
            .from('practitioners')
            .select('id, name, specialty, city, address_full, slug_seo, status')
            .ilike('region', `%${resolvedParams.region}%`)
            .eq('status', 'active')
            .order('name', { ascending: true });

        // Apply specialty filter
        if (specialtyFilter && specialtyFilter !== "all") {
            if (specialtyFilter === "osteopathe") {
                query = query.or('specialty.ilike.%ostéopathe%,specialty.ilike.%osteopathe%');
            } else if (specialtyFilter === "dentiste") {
                query = query.or('specialty.ilike.%dentiste%,specialty.ilike.%dentisterie%');
            } else if (specialtyFilter === "veterinaire") {
                query = query.or('specialty.ilike.%vétérinaire%,specialty.ilike.%veterinaire%');
            }
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        practitioners = data || [];
    } catch (e) {
        console.error("Error fetching practitioners:", e);
        error = e;
    }

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
                            Consultez les professionnels vérifiés intervenant dans la région {regionName}.
                            Equivio répertorie les praticiens dont la zone d'intervention a été validée pour vous offrir une vision fiable du maillage professionnel local.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-neutral-stone/40 shadow-premium reveal [animation-delay:200ms]">
                        <SearchBar />
                    </div>

                    {/* Specialty Filter Buttons */}
                    <div className="flex flex-wrap gap-3 reveal [animation-delay:250ms]">
                        {SPECIALTIES.map((spec) => {
                            const isActive = specialtyFilter === spec.key;
                            const Icon = spec.icon;
                            return (
                                <Link
                                    key={spec.key}
                                    href={`/regions/${resolvedParams.region}${spec.key !== "all" ? `?specialite=${spec.key}` : ""}`}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                                        transition-all duration-200 border
                                        ${isActive
                                            ? "bg-primary text-white border-primary shadow-md"
                                            : "bg-white text-neutral-charcoal/70 border-neutral-stone/40 hover:border-primary/40 hover:bg-primary/5"
                                        }
                                    `}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {spec.label}
                                </Link>
                            );
                        })}
                    </div>

                    <section className="space-y-10 reveal [animation-delay:300ms]">
                        <div className="flex justify-between items-center bg-stone-100/50 p-6 rounded-xl border border-neutral-stone/30">
                            <h2 className="font-bold text-primary uppercase tracking-[0.15em] text-xs flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-primary-soft" />
                                {practitioners.length} professionnel{practitioners.length > 1 ? "s" : ""} en {regionName}
                            </h2>
                            <span className="text-[10px] text-neutral-charcoal/40 font-bold uppercase tracking-[0.2em]">Réseau certifié</span>
                        </div>

                        {error ? (
                            <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center text-red-800">
                                Une erreur est survenue lors du chargement des praticiens. Veuillez réessayer plus tard.
                            </div>
                        ) : practitioners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {practitioners.map((p) => (
                                    <PractitionerCard
                                        key={p.id}
                                        id={p.id}
                                        name={p.name}
                                        specialty={p.specialty}
                                        city={p.city}
                                        address_full={p.address_full}
                                        slug_seo={p.slug_seo}
                                        phone_norm={p.phone_norm}
                                        isClaimed={p.is_claimed}
                                        isVerified={p.is_verified || p.status === 'active'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-2xl border border-dashed border-neutral-stone/40 text-center text-neutral-charcoal/40 italic">
                                Aucun praticien trouvé {specialtyFilter !== "all" ? "avec ce filtre" : "dans cette région"}.
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
                                La présence des professionnels affichée pour la région {regionName} est validée par notre algorithme de cohérence géographique et nos vérifications administratives.
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
