"use client";

import { X } from "lucide-react";
import { Button } from "./ui/Button";

interface AddInterventionModalProps {
    isOpen: boolean;
    onClose: () => void;
    practitionerName: string;
}

export function AddInterventionModal({ isOpen, onClose, practitionerName }: AddInterventionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-neutral-stone">
                <div className="px-6 py-4 border-b border-neutral-stone flex items-center justify-between bg-neutral-offwhite">
                    <h3 className="font-bold text-primary">Ajouter une intervention</h3>
                    <button onClick={onClose} className="p-1 hover:bg-neutral-stone rounded-full transition-colors">
                        <X className="w-5 h-5 text-neutral-charcoal/60" />
                    </button>
                </div>

                <form className="p-6 space-y-6">
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
                                className="w-full bg-neutral-offwhite border border-neutral-stone rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-charcoal mb-1.5 uppercase tracking-wide">
                                Type de prestation
                            </label>
                            <select className="w-full bg-neutral-offwhite border border-neutral-stone rounded-md py-2 px-3 focus:ring-primary focus:border-primary">
                                <option>Sélectionnez un type</option>
                                <option>Consultation classique</option>
                                <option>Urgence</option>
                                <option>Suivi / Contrôle</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-charcoal mb-1.5 uppercase tracking-wide">
                                Code Postal de l'intervention
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: 14000"
                                className="w-full bg-neutral-offwhite border border-neutral-stone rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        {/* Placeholder for Cloudflare Turnstile */}
                        <div className="bg-neutral-stone/30 h-16 flex items-center justify-center rounded border border-neutral-stone border-dashed">
                            <span className="text-xs text-neutral-charcoal/40 font-medium">Turnstile Anti-spam intégré</span>
                        </div>

                        <Button className="w-full py-3">Confirmer l'intervention</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
