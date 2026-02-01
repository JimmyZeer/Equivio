"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { ArrowRight, CheckCircle2, Loader2, MapPin, User, Mail, Phone, MessageSquare, ShieldAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function ClaimForm() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");

    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // Practitioner data if found
    const [practitionerName, setPractitionerName] = useState<string | null>(null);
    const [practitionerId, setPractitionerId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        website: "", // Added distinct field for verifying identity via website
        message: "",
        transparencyConsent: false
    });

    useEffect(() => {
        if (slug) {
            // Fetch practitioner name to confirm context
            const fetchPractitioner = async () => {
                const { data } = await supabase
                    .from('practitioners')
                    .select('id, name')
                    .eq('slug_seo', slug)
                    .single();

                if (data) {
                    setPractitionerName(data.name);
                    setPractitionerId(data.id);
                }
            };
            fetchPractitioner();
        }
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            setStep(2);
            return;
        }

        if (!formData.transparencyConsent) {
            setErrorMessage("Vous devez accepter les conditions de transparence pour continuer.");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            // Find practitioner by slug if ID not already set (fallback)
            let targetId = practitionerId;
            if (!targetId && slug) {
                const { data } = await supabase
                    .from('practitioners')
                    .select('id')
                    .eq('slug_seo', slug)
                    .single();
                if (data) targetId = data.id;
            }

            if (!targetId) {
                // Determine if this is a general contact or specific claim
                // ideally we should require it.
                setErrorMessage("Impossible de retrouver la fiche concernée. Veuillez réessayer depuis la fiche du praticien.");
                setStatus("error");
                return;
            }

            const { error } = await supabase
                .from('practitioners')
                .update({
                    claimed_contact: {
                        claimer_name: formData.name,
                        claimer_email: formData.email,
                        claimer_phone: formData.phone,
                        claimer_website: formData.website,
                        claimer_message: formData.message,
                        consent: true
                    },
                    claimed_at: new Date().toISOString(),
                    // is_claimed remains false until admin validation
                })
                .eq('id', targetId);

            if (error) throw error;

            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");
            setErrorMessage("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-xl text-center space-y-6 animate-reveal">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-neutral-charcoal">Demande transmise avec succès</h3>
                    <div className="text-neutral-charcoal/70 text-sm space-y-2">
                        <p>Votre demande de revendication pour <strong>{practitionerName || "cette fiche"}</strong> a bien été enregistrée.</p>
                        <p>Une vérification manuelle sera effectuée par notre équipe sous 48h.</p>
                        <p>Vous recevrez une confirmation par email à <strong>{formData.email}</strong> dès validation.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="mt-4 text-sm">
                    Retour à l'accueil
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 relative">
            {status === "loading" && (
                <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Envoi en cours...</span>
                    </div>
                </div>
            )}

            {/* Context Header */}
            {practitionerName && (
                <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold shadow-sm">
                        {practitionerName.charAt(0)}
                    </div>
                    <div>
                        <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Vous revendiquez la fiche :</div>
                        <div className="text-lg font-bold text-primary">{practitionerName}</div>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="space-y-8 animate-reveal">
                    {/* Step 1: Identification */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary border-b border-neutral-stone pb-2">
                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
                            <h3 className="font-bold text-lg">Identification du praticien</h3>
                        </div>

                        <p className="text-sm text-neutral-charcoal/60 italic">
                            Pour valider votre identité, merci de fournir au moins un moyen de vérification (email pro ou site web).
                        </p>

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
                                        Email professionnel <span className="text-red-500">*</span>
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
                                        Téléphone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-neutral-charcoal/30"
                                        placeholder="06 12 34 56 78"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                                    Site web ou page professionnelle (Facultatif)
                                </label>
                                <input
                                    id="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-neutral-charcoal/30"
                                    placeholder="https://www.mon-cabinet.fr"
                                />
                                <p className="text-[10px] text-neutral-400 mt-1">Aide à accélérer la vérification de votre identité.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full py-4 text-base font-bold flex items-center justify-center gap-2">
                            Continuer
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-reveal">
                    {/* Step 2: Transparency & Confirmation */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary border-b border-neutral-stone pb-2">
                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                            <h3 className="font-bold text-lg">Transparence et Validation</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Message Libre */}
                            <div>
                                <label htmlFor="message" className="block text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider mb-2">
                                    Message complémentaire (Corrections à apporter...)
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-neutral-offwhite/50 border border-neutral-stone rounded-lg p-3 text-neutral-charcoal focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm leading-relaxed"
                                    placeholder="Indiquez ici les corrections ou ajouts souhaités sur votre fiche..."
                                />
                            </div>

                            {/* Transparency Commit */}
                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl space-y-4">
                                <div className="flex items-start gap-3">
                                    <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800 leading-relaxed">
                                        <p className="font-bold mb-1">Important : Neutralité Equivio</p>
                                        <p>La revendication permet uniquement de garantir l’exactitude des informations.</p>
                                        <p><strong>Equivio ne classe pas les praticiens, n’affiche pas d’avis, et n’accorde aucun avantage de visibilité.</strong></p>
                                    </div>
                                </div>
                                <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:border-blue-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.transparencyConsent}
                                        onChange={(e) => setFormData({ ...formData, transparencyConsent: e.target.checked })}
                                        className="mt-1 w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary"
                                    />
                                    <span className="text-xs text-neutral-600 font-medium">
                                        Je comprends que la revendication n’implique aucun classement ni mise en avant publicitaire.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
                            Retour
                        </Button>
                        <Button type="submit" className="w-2/3 py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg">
                            Confirmer ma demande
                            <CheckCircle2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
