"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PractitionerCard } from "@/components/PractitionerCard";
import { Button } from "@/components/ui/Button";
import { useFavorites } from "@/lib/favorites";
import { supabase } from "@/lib/supabase";
import { Heart, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Practitioner } from "@/lib/practitioners";

export default function FavorisPage() {
    const { favorites, isLoaded } = useFavorites();
    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFavorites() {
            if (!isLoaded) return;

            if (favorites.length === 0) {
                setPractitioners([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from("practitioners")
                .select("id, slug, slug_seo, name, specialty, city, address_full, phone_norm, website, profile_url, status, intervention_count, region, lat, lng")
                .in("id", favorites)
                .eq("status", "active");

            if (error) {
                console.error("Error fetching favorites:", error);
                setPractitioners([]);
            } else if (data) {
                // Maintain the order of favorites
                const orderedData = favorites
                    .map((id) => data.find((p) => p.id === id))
                    .filter((p): p is NonNullable<typeof p> => p !== undefined) as Practitioner[];
                setPractitioners(orderedData);
            }
            setLoading(false);
        }

        fetchFavorites();
    }, [favorites, isLoaded]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite py-12 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-4">
                            <Heart className="w-8 h-8 text-rose-500" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                            Mes favoris
                        </h1>
                        <p className="text-neutral-charcoal/60 max-w-lg mx-auto">
                            Retrouvez tous les praticiens que vous avez sauvegardés. Vos favoris sont stockés localement sur cet appareil.
                        </p>
                    </div>

                    {/* Content */}
                    {!isLoaded || loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : practitioners.length === 0 ? (
                        <div className="text-center py-16 space-y-6">
                            <div className="w-24 h-24 mx-auto bg-neutral-stone/30 rounded-full flex items-center justify-center">
                                <Heart className="w-10 h-10 text-neutral-charcoal/30" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-neutral-charcoal">
                                    Aucun favori pour le moment
                                </h2>
                                <p className="text-neutral-charcoal/60 max-w-md mx-auto">
                                    Explorez notre annuaire et cliquez sur l'icône cœur pour sauvegarder vos praticiens préférés.
                                </p>
                            </div>
                            <Link href="/search">
                                <Button className="gap-2 px-8">
                                    <Search className="w-4 h-4" />
                                    Explorer les praticiens
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-sm text-neutral-charcoal/50 font-medium">
                                {practitioners.length} praticien{practitioners.length > 1 ? "s" : ""} sauvegardé{practitioners.length > 1 ? "s" : ""}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {practitioners.map((practitioner) => (
                                    <PractitionerCard
                                        key={practitioner.id}
                                        {...practitioner}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
