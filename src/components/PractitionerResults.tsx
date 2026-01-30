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
        <section className="space-y-8">
            <div className="sticky top-20 z-30 flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-[24px] shadow-float border border-white/50 gap-4 transition-all duration-300">
                <div className="space-y-1 w-full sm:w-auto text-left pl-2">
                    <h2 className="font-bold text-primary uppercase tracking-[0.15em] text-xs flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        {count} Praticiens trouvés
                    </h2>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <span className="text-[10px] text-neutral-charcoal/40 font-bold uppercase tracking-[0.2em] hidden md:inline-block">Données certifiées</span>

                    {/* iOS Segment Control */}
                    <div className="flex bg-neutral-100/80 p-1 rounded-full w-full sm:w-auto relative">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 z-10 ${viewMode === "list" ? "bg-white text-primary shadow-sm scale-100" : "text-neutral-500 hover:text-neutral-700"}`}
                        >
                            <List className="w-4 h-4" />
                            Liste
                        </button>
                        <button
                            onClick={() => setViewMode("map")}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 z-10 ${viewMode === "map" ? "bg-white text-primary shadow-sm scale-100" : "text-neutral-500 hover:text-neutral-700"}`}
                        >
                            <MapIcon className="w-4 h-4" />
                            Carte
                        </button>
                    </div>
                </div>
            </div>

            {/* Animated view container */}
            <div key={viewMode} className="animate-view-switch">
                {viewMode === "list" ? (
                    <PractitionersList practitioners={practitioners} error={error} />
                ) : (
                    <div className="h-[650px] w-full bg-neutral-100 border-4 border-white rounded-[32px] shadow-card-rest overflow-hidden relative">
                        <PractitionerMap practitioners={practitioners} />
                        {/* Internal shadow overlay for depth */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] rounded-[28px] z-[1000]" />
                    </div>
                )}
            </div>
        </section>
    );
}

