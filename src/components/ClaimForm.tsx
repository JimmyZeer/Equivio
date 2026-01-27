"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { ArrowRight, CheckCircle2, Loader2, MapPin, User, Mail, Phone, MessageSquare } from "lucide-react";

export function ClaimForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        region: "",
        city: "",
        zip: "",
        street: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        // Simulate API call
        setTimeout(() => {
            console.log("Form submitted:", formData);
            setStatus("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                region: "",
                city: "",
                zip: "",
                street: "",
                message: ""
            });
        }, 1500);
    };

    if (status === "success") {
        return (
            <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-xl text-center space-y-6 animate-reveal">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-neutral-charcoal">Demande envoyée</h3>
                    <p className="text-neutral-charcoal/70 leading-relaxed text-sm">
                        Merci pour votre message.<br />
                        L’équipe Equivio analysera les informations transmises et vous recontactera si nécessaire.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2 text-sm">
                    Retour au formulaire
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10 relative">
            {status === "loading" && (
                <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Envoi en cours...</span>
                    </div>
                </div>
            )}

            {/* 3. Identité (Obligatoire) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary border-b border-neutral-stone pb-2">
                    <User className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Identité</h3>
                </div>

                <div className="grid gap-5">
                    <div>
                        <label htmlFor="name" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                            Nom et prénom <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-neutral-charcoal/30"
                            placeholder="Ex: Jean Dupont"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                                Email pro <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-neutral-charcoal/30"
                                placeholder="jean@cabinet.fr"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                                Téléphone pro <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-neutral-charcoal/30"
                                placeholder="01 23 45 67 89"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Localisation (Facultatif) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary border-b border-neutral-stone pb-2">
                    <MapPin className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Localisation professionnelle</h3>
                </div>

                <p className="text-sm text-neutral-charcoal/60 italic">
                    Ces informations permettent d’améliorer la précision de votre fiche pour les propriétaires de chevaux.
                </p>

                <div className="grid gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="city" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                                Ville
                            </label>
                            <input
                                id="city"
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="zip" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                                Code Postal
                            </label>
                            <input
                                id="zip"
                                type="text"
                                value={formData.zip}
                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="region" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                            Région
                        </label>
                        <input
                            id="region"
                            type="text"
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                            Rue / Lieu-dit (Facultatif)
                        </label>
                        <input
                            id="street"
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* 5. Message Libre (Optionnel) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary border-b border-neutral-stone pb-2">
                    <MessageSquare className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Message complémentaire (optionnel)</h3>
                </div>

                <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm leading-relaxed"
                    placeholder="Correction d’erreur, précision d’activité, demande spécifique..."
                />
            </div>

            {/* CTA */}
            <div className="pt-4">
                <Button type="submit" className="w-full py-4 text-base font-bold shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                    Envoyer ma demande
                    {/* <ArrowRight className="w-4 h-4" /> */}
                </Button>
            </div>
        </form>
    );
}
