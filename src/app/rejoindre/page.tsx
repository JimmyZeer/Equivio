import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JoinSearch } from "@/components/JoinSearch";
import { CheckCircle2, Search, ArrowRight, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Rejoindre Equivio - Référencez votre activité",
    description: "Rejoignez le premier réseau neutre de praticiens équins. Vérifiez votre éligibilité et revendiquez votre fiche gratuitement.",
};

export default function JoinPage() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-offwhite">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="pt-16 pb-20 px-6 bg-gradient-to-b from-white to-neutral-offwhite relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-20 w-80 h-80 bg-leather/5 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            Réseau Certifié & Neutre
                        </span>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-charcoal leading-tight tracking-tight">
                            Votre expertise mérite <br />
                            <span className="text-primary bg-primary/5 px-4 rounded-2xl relative inline-block">
                                d'être visible
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-xl text-neutral-charcoal/60 max-w-2xl mx-auto leading-relaxed">
                            Equivio est le seul annuaire basé sur la <strong>réalité terrain</strong>. Pas de sponsor, pas d'abonnement pour apparaître. Juste vo.tre activité.
                        </p>

                        <div className="pt-8 max-w-xl mx-auto reveal">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-stone/20">
                                <h3 className="text-lg font-bold text-neutral-charcoal mb-4 flex items-center justify-center gap-2">
                                    <Search className="w-5 h-5 text-primary" />
                                    Vérifiez si vous êtes déjà référencé
                                </h3>
                                <JoinSearch />
                            </div>
                            <p className="text-sm text-neutral-charcoal/40 mt-4">
                                85% des professionnels actifs sont déjà dans notre base.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Value Props */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: TrendingUp,
                                    title: "SEO Automatisé",
                                    desc: "Profitez de notre référencement naturel pour apparaître en tête des recherches locales.",
                                    color: "text-blue-600 bg-blue-50"
                                },
                                {
                                    icon: Wallet,
                                    title: "100% Gratuit",
                                    desc: "L'inscription et la visibilité de base sont gratuites. Nous ne vendons pas votre place.",
                                    color: "text-emerald-600 bg-emerald-50"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Crédibilité",
                                    desc: "Un profil vérifié rassure les propriétaires. Montrez que vous êtes un professionnel actif.",
                                    color: "text-purple-600 bg-purple-50"
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center space-y-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} mb-2`}>
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-charcoal">{item.title}</h3>
                                    <p className="text-neutral-charcoal/60 leading-relaxed max-w-xs">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Steps */}
                <section className="py-20 bg-neutral-offwhite border-t border-neutral-stone/20">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-neutral-charcoal mb-16">Comment ça marche ?</h2>

                        <div className="space-y-12 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-200 md:left-1/2 md:-ml-px hidden md:block"></div>

                            {[
                                { step: "01", title: "Recherchez votre fiche", desc: "Tapez votre nom dans le module ci-dessus." },
                                { step: "02", title: "Revendiquez ou Créez", desc: "Si vous y êtes, cliquez sur 'C'est moi'. Sinon, créez votre fiche en 2 min." },
                                { step: "03", title: "Vérification", desc: "Notre équipe valide vos informations (SIRET, Diplômes) sous 48h." },
                                { step: "04", title: "C'est en ligne !", desc: "Vous recevez vos accès pour enrichir votre profil (photos, bio, zone)." }
                            ].map((item, idx) => (
                                <div key={idx} className={`relative flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className="flex-shrink-0 w-14 h-14 bg-white border-4 border-neutral-offwhite rounded-full flex items-center justify-center text-primary font-bold shadow-sm z-10 relative">
                                        {item.step}
                                    </div>
                                    <div className={`flex-grow bg-white p-6 rounded-2xl shadow-sm border border-neutral-stone/10 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                        <h3 className="text-lg font-bold text-neutral-charcoal mb-2">{item.title}</h3>
                                        <p className="text-neutral-charcoal/60">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
