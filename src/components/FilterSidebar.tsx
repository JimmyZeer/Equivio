"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export function FilterSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const categories = ["Ostéopathes", "Maréchaux-ferrants", "Dentistes", "Vétérinaires", "Praticiens bien-être"];

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
                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-xs">Catégories</h4>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-neutral-stone text-primary focus:ring-primary w-4 h-4" />
                                <span className="text-sm text-neutral-charcoal/80 group-hover:text-primary transition-colors">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-xs">Statut</h4>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="rounded border-neutral-stone text-primary focus:ring-primary w-4 h-4" />
                            <span className="text-sm text-neutral-charcoal/80 group-hover:text-primary transition-colors">Profil vérifié</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="rounded border-neutral-stone text-primary focus:ring-primary w-4 h-4" />
                            <span className="text-sm text-neutral-charcoal/80 group-hover:text-primary transition-colors">Profil revendiqué</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-xs">Trier par</h4>
                    <select className="w-full bg-white border border-neutral-stone rounded-md py-2 px-3 text-sm text-neutral-charcoal focus:ring-primary focus:border-primary">
                        <option>Activité récente</option>
                        <option>Nombre d'interventions</option>
                        <option>Ordre alphabétique</option>
                    </select>
                </div>
            </aside>
        </div>
    );
}
