"use client";

import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AddInterventionModalProps {
    isOpen: boolean;
    onClose: () => void;
    practitionerName: string;
    practitionerId: string; // Dynamic ID for Supabase
}

export function AddInterventionModal({ isOpen, onClose, practitionerName, practitionerId }: AddInterventionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: "",
        location: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.location) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('interventions')
                .insert([
                    {
                        practitioner_id: practitionerId,
                        date: formData.date,
                        type: formData.type,
                        location: formData.location
                    }
                ]);

            if (error) throw error;

            // Optionally update practitioner count (could also be a DB trigger)
            await supabase.rpc('increment_intervention_count', { practitioner_row_id: practitionerId });

            onClose();
            alert("Intervention ajoutée avec succès !");
        } catch (error) {
            console.error("Error adding intervention:", error);
            alert("Erreur lors de l'ajout. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-neutral-stone">
                <div className="px-6 py-4 border-b border-neutral-stone flex items-center justify-between bg-neutral-offwhite">
                    <h3 className="font-bold text-primary">Ajouter une intervention</h3>
                    <button onClick={onClose} className="p-1 hover:bg-neutral-stone rounded-full transition-colors">
                        <X className="w-5 h-5 text-neutral-charcoal/60" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="text-sm text-neutral-charcoal/60 bg-leather-light/20 p-4 rounded-lg border border-leather-light">
                        Vous déclarez une intervention effectuée par <strong>{practitionerName}</strong>.
                        Les données sont anonymisées et servent à alimenter l'activité réelle du praticien.
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-neutral-charcoal mb-1.5 uppercase tracking-wide">
                                Date de l'intervention
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-neutral-offwhite border border-neutral-stone rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-charcoal mb-1.5 uppercase tracking-wide">
                                Type de prestation
                            </label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-neutral-offwhite border border-neutral-stone rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Sélectionnez un type</option>
                                <option value="Consultation classique">Consultation classique</option>
                                <option value="Urgence">Urgence</option>
                                <option value="Suivi / Contrôle">Suivi / Contrôle</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-charcoal mb-1.5 uppercase tracking-wide">
                                Code Postal de l'intervention
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: 14000"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-neutral-offwhite border border-neutral-stone rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        {/* Placeholder for Cloudflare Turnstile */}
                        <div className="bg-neutral-stone/30 h-16 flex items-center justify-center rounded border border-neutral-stone border-dashed">
                            <span className="text-xs text-neutral-charcoal/40 font-medium">Turnstile Anti-spam intégré</span>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full py-3">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirmer l'intervention"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
