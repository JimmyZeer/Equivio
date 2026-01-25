"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function FilterSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const categories = [
        { label: "Ostéopathes", value: "osteopathes" },
        { label: "Maréchaux", value: "marechaux" },
        { label: "Dentistes", value: "dentistes" },
        { label: "Vétérinaires", value: "veterinaires" },
        { label: "Bien-être", value: "bien-etre" }
    ];

    const currentSpecialties = searchParams.get("specialties")?.split(",") || [];
    const isVerified = searchParams.get("verified") === "true";
    const isClaimed = searchParams.get("claimed") === "true";
    const sortBy = searchParams.get("sort") || "recent";

    const updateFilters = (key: string, value: string | boolean | string[]) => {
        const params = new URLSearchParams(searchParams.toString());

        if (key === "specialties") {
            const val = value as string[];
            if (val.length > 0) params.set(key, val.join(","));
            else params.delete(key);
        } else if (typeof value === "boolean") {
            if (value) params.set(key, "true");
            else params.delete(key);
        } else {
            params.set(key, value as string);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const toggleSpecialty = (val: string) => {
        const newSpecs = currentSpecialties.includes(val)
            ? currentSpecialties.filter(s => s !== val)
            : [...currentSpecialties, val];
        updateFilters("specialties", newSpecs);
    };

    const clearFilters = () => {
        router.push(pathname);
    };

    return (
        <div className="space-y-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-full flex items-center justify-between bg-primary text-white p-4 rounded-xl font-bold shadow-lg"
            >
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    <span>Filtres</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <aside className={`w-full lg:w-64 space-y-8 bg-leather-light/30 p-6 rounded-xl border border-leather-light lg:block ${isOpen ? "block" : "hidden"}`}>
                <div className="flex items-center justify-between lg:hidden mb-2">
                    <h3 className="font-bold text-primary">Filtres</h3>
                    <button onClick={clearFilters} className="text-xs text-primary/60 flex items-center gap-1 hover:text-primary">
                        <RotateCcw className="w-3 h-3" /> Effacer
                    </button>
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-xs flex items-center justify-between">
                        Catégories
                        <span className="lg:hidden text-[10px] bg-primary/10 text-primary px-1.5 rounded-full font-bold">
                            {currentSpecialties.length || ""}
                        </span>
                    </h4>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={currentSpecialties.includes(cat.value)}
                                    onChange={() => toggleSpecialty(cat.value)}
                                    className="rounded border-neutral-stone text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className={`text-sm transition-colors ${currentSpecialties.includes(cat.value) ? "text-primary font-bold" : "text-neutral-charcoal/80 group-hover:text-primary"}`}>
                                    {cat.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-xs">Statut</h4>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isVerified}
                                onChange={(e) => updateFilters("verified", e.target.checked)}
                                className="rounded border-neutral-stone text-primary focus:ring-primary w-4 h-4"
                            />
                            <span className={`text-sm transition-colors ${isVerified ? "text-primary font-bold" : "text-neutral-charcoal/80 group-hover:text-primary"}`}>
                                Profil vérifié
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isClaimed}
                                onChange={(e) => updateFilters("claimed", e.target.checked)}
                                className="rounded border-neutral-stone text-primary focus:ring-primary w-4 h-4"
                            />
                            <span className={`text-sm transition-colors ${isClaimed ? "text-primary font-bold" : "text-neutral-charcoal/80 group-hover:text-primary"}`}>
                                Profil revendiqué
                            </span>
                        </label>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-xs">Trier par</h4>
                    <select
                        value={sortBy}
                        onChange={(e) => updateFilters("sort", e.target.value)}
                        className="w-full bg-white border border-neutral-stone rounded-md py-2 px-3 text-sm text-neutral-charcoal focus:ring-primary focus:border-primary"
                    >
                        <option value="recent">Activité récente</option>
                        <option value="interventions">Nombre d'interventions</option>
                        <option value="alpha">Ordre alphabétique</option>
                    </select>
                </div>

                <button
                    onClick={clearFilters}
                    className="hidden lg:flex w-full items-center justify-center gap-2 py-3 border border-primary/20 rounded-xl text-xs font-bold text-primary/60 hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Réinitialiser les filtres
                </button>
            </aside>
        </div>
    );
}
