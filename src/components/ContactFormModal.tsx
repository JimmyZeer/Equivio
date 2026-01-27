"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Phone, Send, X, CheckCircle, User, Mail, MessageSquare } from "lucide-react";

interface ContactFormModalProps {
    practitionerId: string;
    practitionerName: string;
    onClose: () => void;
}

export function ContactFormModal({
    practitionerId,
    practitionerName,
    onClose
}: ContactFormModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Track the contact request for analytics
            if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("event", "contact_request", {
                    event_category: "conversion",
                    event_label: practitionerId,
                    practitioner_name: practitionerName,
                });
            }

            // Send to API endpoint
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    practitionerId,
                    practitionerName,
                    ...formData,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi");
            }

            setIsSuccess(true);
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-reveal">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-neutral-charcoal/40 hover:text-primary hover:bg-neutral-offwhite rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {isSuccess ? (
                    /* Success State */
                    <div className="text-center py-8 space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-primary">Demande envoyée !</h3>
                        <p className="text-neutral-charcoal/60 text-sm">
                            Votre demande a été transmise à <strong>{practitionerName}</strong>.
                            Vous recevrez une réponse dans les plus brefs délais.
                        </p>
                        <Button onClick={onClose} className="mt-4">
                            Fermer
                        </Button>
                    </div>
                ) : (
                    /* Form */
                    <>
                        <div className="space-y-2 mb-6">
                            <h3 className="text-xl font-bold text-primary">
                                Contacter {practitionerName}
                            </h3>
                            <p className="text-sm text-neutral-charcoal/60">
                                Envoyez une demande de contact directe. Le praticien sera notifié et pourra vous répondre.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    Votre nom
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-stone/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="Jean Dupont"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-stone/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="jean@exemple.fr"
                                />
                            </div>

                            {/* Phone (optional) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" />
                                    Téléphone <span className="text-neutral-charcoal/30">(facultatif)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-stone/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="06 12 34 56 78"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-charcoal/60 uppercase tracking-wider flex items-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-stone/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                                    placeholder="Bonjour, je souhaite prendre rendez-vous pour..."
                                />
                            </div>

                            {error && (
                                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 text-base font-bold gap-2"
                            >
                                {isSubmitting ? (
                                    <>Envoi en cours...</>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Envoyer ma demande
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] text-neutral-charcoal/40 text-center">
                                En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
                                Vos données sont uniquement transmises au praticien concerné.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
