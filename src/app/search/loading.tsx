import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-neutral-stone/30 p-6 animate-pulse">
            <div className="flex gap-6">
                {/* Avatar skeleton */}
                <div className="w-16 h-16 rounded-full bg-neutral-stone/30 shrink-0" />

                <div className="flex-1 space-y-3">
                    {/* Name */}
                    <div className="h-5 bg-neutral-stone/30 rounded-lg w-2/3" />
                    {/* Specialty */}
                    <div className="h-4 bg-neutral-stone/20 rounded-lg w-1/3" />
                    {/* Location */}
                    <div className="h-4 bg-neutral-stone/20 rounded-lg w-1/2" />
                </div>

                {/* Badge skeleton */}
                <div className="w-20 h-8 bg-neutral-stone/20 rounded-full shrink-0" />
            </div>
        </div>
    );
}

export default function Loading() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Recherche" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <Breadcrumb items={breadcrumbItems} />

                    {/* Search bar skeleton */}
                    <div className="bg-white p-8 rounded-2xl border border-neutral-stone/40 shadow-premium">
                        <div className="animate-pulse flex flex-col md:flex-row gap-4">
                            <div className="flex-1 h-14 bg-neutral-stone/20 rounded-xl" />
                            <div className="flex-1 h-14 bg-neutral-stone/20 rounded-xl" />
                            <div className="w-full md:w-40 h-14 bg-primary/20 rounded-xl" />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar skeleton */}
                        <div className="w-full lg:w-64 space-y-4 animate-pulse">
                            <div className="h-8 bg-neutral-stone/30 rounded-lg w-32" />
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-6 bg-neutral-stone/20 rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Results skeleton */}
                        <div className="flex-1 space-y-10">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-7 bg-neutral-stone/30 rounded-lg w-48" />
                                    <div className="h-4 bg-neutral-stone/20 rounded-lg w-64" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[...Array(5)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
