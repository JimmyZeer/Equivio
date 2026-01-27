"use client";

import { useState } from "react";
import { Practitioner } from "@/lib/practitioners";
import { PractitionersList } from "./PractitionersList";
import { Button } from "./ui/Button";
import { List, Map as MapIcon, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const PractitionerMap = dynamic(() => import("@/components/PractitionerMap"), {
    loading: () => <div className="h-[500px] w-full bg-neutral-offwhite animate-pulse rounded-2xl flex items-center justify-center"><Loader2 className="animate-spin text-primary/20 w-8 h-8" /></div>,
    ssr: false
});

interface PractitionerResultsProps {
    practitioners: Practitioner[];
    count: number;
    error?: any;
}

export function PractitionerResults({ practitioners, count, error }: PractitionerResultsProps) {
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-stone-100/50 p-4 sm:p-6 rounded-xl border border-neutral-stone/30 gap-4">
                <div className="space-y-1 w-full sm:w-auto text-left">
                    <h2 className="font-bold text-primary uppercase tracking-[0.15em] text-xs flex items-center gap-3">
                        <span className="w-2 h-2 bg-primary-soft rounded-full animate-pulse shadow-[0_0_8px_rgba(58,107,79,0.5)]"></span>
                        {count} Praticiens trouvés
                    </h2>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-[10px] text-neutral-charcoal/40 font-bold uppercase tracking-[0.2em] hidden md:inline-block mr-4">Données certifiées</span>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-neutral-stone/50 shadow-sm w-full sm:w-auto">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === "list" ? "bg-primary text-white shadow-sm" : "text-neutral-charcoal/60 hover:bg-neutral-offwhite"}`}
                        >
                            <List className="w-4 h-4" />
                            Liste
                        </button>
                        <button
                            onClick={() => setViewMode("map")}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === "map" ? "bg-primary text-white shadow-sm" : "text-neutral-charcoal/60 hover:bg-neutral-offwhite"}`}
                        >
                            <MapIcon className="w-4 h-4" />
                            Carte
                        </button>
                    </div>
                </div>
            </div>

            <div className="transition-all duration-300">
                {viewMode === "list" ? (
                    <PractitionersList practitioners={practitioners} error={error} />
                ) : (
                    <div className="h-[600px] w-full border border-neutral-stone/40 rounded-2xl shadow-premium overflow-hidden">
                        <PractitionerMap practitioners={practitioners} />
                    </div>
                )}
            </div>
        </section>
    );
}
