import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Mail, Share2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Bienvenue dans l'accès anticipé — Equivio Carnet",
    description: "Ton inscription est enregistrée. On te tient au courant dès qu'on ouvre les premières places.",
    robots: { index: false, follow: false },
};

export default function CarnetThanksPage() {
    const shareUrl = "https://equivio.fr/carnet";
    const shareText = "Je viens de m'inscrire à Equivio Carnet — un carnet de santé numérique pour mon cheval. Tu devrais regarder :";

    return (
        <div className="flex flex-col min-h-screen bg-neutral-offwhite">
            <Header />

            <main className="flex-grow flex items-center justify-center px-5 sm:px-6 py-16 lg:py-24">
                <div className="max-w-xl w-full mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 reveal">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-tight">
                        C'est noté.
                    </h1>
                    <p className="mt-4 text-lg text-neutral-charcoal/75 leading-relaxed">
                        Ton inscription est bien enregistrée. On t'écrit dès qu'on ouvre les premières places — et tu auras la priorité.
                    </p>

                    <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 shadow-card-rest border border-neutral-stone/40 text-left space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-bold text-primary text-base">Vérifie ta boîte mail</h2>
                                <p className="text-[15px] text-neutral-charcoal/70 leading-relaxed mt-1">
                                    Pas de mail tout de suite — on t'enverra des nouvelles importantes uniquement, pas du spam.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-leather/15 flex items-center justify-center flex-shrink-0">
                                <Share2 className="w-5 h-5 text-leather" />
                            </div>
                            <div className="w-full">
                                <h2 className="font-bold text-primary text-base">Aide-nous à avancer plus vite</h2>
                                <p className="text-[15px] text-neutral-charcoal/70 leading-relaxed mt-1 mb-3">
                                    Plus on est de testeurs au départ, mieux on construit. Partage à un ami cavalier&nbsp;:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-lg transition-colors press-effect min-h-[44px]"
                                    >
                                        WhatsApp
                                    </a>
                                    <a
                                        href={`sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-lg transition-colors press-effect min-h-[44px]"
                                    >
                                        SMS
                                    </a>
                                    <a
                                        href={`mailto:?subject=${encodeURIComponent("Equivio Carnet")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-lg transition-colors press-effect min-h-[44px]"
                                    >
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                        >
                            Découvrir l'annuaire des praticiens en attendant
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
