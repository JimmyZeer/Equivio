"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function ClaimForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        siret: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        // Simulate API call to Supabase or Email service
        setTimeout(() => {
            console.log("Form submitted:", formData);
            setStatus("success");
            setFormData({ name: "", email: "", siret: "" });
        }, 1500);
    };

    if (status === "success") {
        return (
            <div className="bg-primary/5 border border-primary/20 p-10 rounded-2xl text-center space-y-6 animate-reveal">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-primary tracking-tight">Demande envoyée !</h3>
                    <p className="text-neutral-charcoal/60 leading-relaxed font-medium">
                        Merci pour votre confiance. Notre équipe va vérifier vos informations et reviendra vers vous sous 48h par email.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setStatus("idle")} className="mt-4">
                    Envoyer une autre demande
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-offwhite/50 p-8 rounded-xl border border-neutral-stone/20 overflow-hidden relative">
            {status === "loading" && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Traitement en cours...</span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] mb-3">
                        Nom complet
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Jean Dupont"
                        className="w-full bg-white border border-neutral-stone/60 rounded-lg py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary transition-soft outline-none font-medium text-neutral-charcoal"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] mb-3">
                        Email professionnel
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jean.dupont@exemple.fr"
                        className="w-full bg-white border border-neutral-stone/60 rounded-lg py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary transition-soft outline-none font-medium text-neutral-charcoal"
                    />
                </div>
                <div>
                    <label htmlFor="siret" className="block text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] mb-3">
                        Numéro de SIRET
                    </label>
                    <input
                        id="siret"
                        type="text"
                        required
                        value={formData.siret}
                        onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                        placeholder="123 456 789 00012"
                        className="w-full bg-white border border-neutral-stone/60 rounded-lg py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary transition-soft outline-none font-medium text-neutral-charcoal"
                    />
                </div>
            </div>

            <div className="pt-6">
                <Button type="submit" className="w-full py-5 text-lg flex items-center justify-center gap-3 group shadow-xl active:scale-95 transition-all">
                    Envoyer la demande
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" strokeWidth={2} />
                </Button>
            </div>
        </form>
    );
}
