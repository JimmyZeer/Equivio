import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PractitionerCard } from "@/components/PractitionerCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/SearchBar";

export default function SearchPage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Recherche" },
    ];

    const practitioners = [
        {
            name: "Jean Dupont",
            specialty: "Ostéopathe équin",
            region: "Calvados (14)",
            isClaimed: true,
            isVerified: true,
            interventionCount: 142,
            lastIntervention: "12 Jan 2026",
            slug: "jean-dupont",
        },
        {
            name: "Marie Martin",
            specialty: "Maréchal-ferrant",
            region: "Eure (27)",
            isClaimed: true,
            isVerified: false,
            interventionCount: 89,
            lastIntervention: "20 Jan 2026",
            slug: "marie-martin",
        },
        {
            name: "Pierre Lefebvre",
            specialty: "Dentiste équin",
            region: "Seine-Maritime (76)",
            isClaimed: false,
            isVerified: false,
            interventionCount: 45,
            lastIntervention: "05 Jan 2026",
            slug: "pierre-lefebvre",
        },
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
                                        245 praticiens trouvés
                                    </h1>
                                    <p className="text-sm text-neutral-charcoal/50 font-medium">Basé sur l’activité réelle enregistrée en Normandie</p>
                                </div>

                                <div className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">
                                    Tri : <span className="text-primary">Activité récente</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {practitioners.map((p) => (
                                    <PractitionerCard key={p.slug} {...p} />
                                ))}
                            </div>

                            <div className="pt-8">
                                <Pagination currentPage={1} totalPages={12} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
