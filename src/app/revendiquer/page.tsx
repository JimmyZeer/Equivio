import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { TransparencySeal } from "@/components/TransparencySeal";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ClaimPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite">
                {/* Hero — Reveal */}
                <section className="py-32 px-6 bg-primary text-white text-center reveal relative overflow-hidden">
                    <div className="absolute inset-0 bg-grain opacity-5"></div>
                    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Vous êtes praticien ?</h1>
                        <p className="text-leather-light/80 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
                            Revendiquez votre profil institutionnel pour valoriser votre activité réelle et renforcer votre visibilité.
                        </p>
                    </div>
                </section>

                <section className="max-w-5xl mx-auto -mt-16 px-6 pb-32 reveal [animation-delay:200ms]">
                    <div className="bg-white rounded-2xl border border-neutral-stone/40 shadow-2xl overflow-hidden">
                        <div className="p-10 md:p-16 space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
                                        <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />
                                        Pourquoi revendiquer ?
                                    </h3>
                                    <ul className="space-y-6">
                                        {[
                                            "Complétez vos coordonnées professionnelles",
                                            "Ajoutez votre zone d'intervention précise",
                                            "Gérez l'affichage de votre activité historique",
                                            "Obtenez le badge 'Profil Revendiqué' pour rassurer",
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex gap-4 text-[0.9375rem] text-neutral-charcoal/70 leading-relaxed font-medium">
                                                <CheckCircle2 className="w-6 h-6 text-primary-soft flex-shrink-0" strokeWidth={1.5} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <form className="space-y-6 bg-neutral-offwhite/50 p-8 rounded-xl border border-neutral-stone/20">
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] mb-3">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Jean Dupont"
                                            className="w-full bg-white border border-neutral-stone/60 rounded-lg py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary transition-soft outline-none font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] mb-3">
                                            Email professionnel
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="jean.dupont@exemple.fr"
                                            className="w-full bg-white border border-neutral-stone/60 rounded-lg py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary transition-soft outline-none font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] mb-3">
                                            Numéro de SIRET
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123 456 789 00012"
                                            className="w-full bg-white border border-neutral-stone/60 rounded-lg py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary transition-soft outline-none font-medium"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <Button className="w-full py-5 text-lg flex items-center justify-center gap-3 group shadow-xl">
                                            Envoyer la demande
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" strokeWidth={2} />
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            <div className="pt-16 border-t border-neutral-stone/30 text-center space-y-6">
                                <TransparencySeal className="justify-center" />
                                <p className="mt-6 text-sm text-neutral-charcoal/50 max-w-2xl mx-auto leading-relaxed font-medium italic">
                                    Toutes les demandes font l'objet d'une vérification manuelle par l'équipe Equivio sous 48h ouvrées.
                                    Notre protocole garantit la stricte confidentialité de vos données personnelles.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
