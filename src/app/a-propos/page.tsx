
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Shield, Users, BadgeCheck, Activity } from "lucide-react";

export default function AboutPage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "À propos" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    {/* Hero Section */}
                    <section className="max-w-4xl space-y-8 reveal [animation-delay:100ms]">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                            L'institution de confiance du <span className="text-primary-soft">monde équin</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-charcoal/60 leading-relaxed text-pretty max-w-3xl">
                            Equivio est né d'un constat simple : la difficulté pour les propriétaires de chevaux de trouver des professionnels fiables sur la base de faits et non de simples avis.
                        </p>
                    </section>

                    {/* Mission Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal [animation-delay:200ms]">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-primary tracking-tight">Notre mission</h2>
                            <p className="text-lg text-neutral-charcoal/70 leading-relaxed">
                                Nous créons un écosystème où la transparence est la norme. En répertoriant l'activité réelle et vérifiée des praticiens, nous valorisons le savoir-faire des professionnels et sécurisons le parcours de soin des chevaux.
                            </p>
                            <p className="text-lg text-neutral-charcoal/70 leading-relaxed">
                                Equivio ne vend pas de visibilité. Nous mettons en lumière la régularité, l'expertise territoriale et l'engagement des praticiens équins à travers toute la France.
                            </p>
                        </div>
                        <div className="bg-white p-12 rounded-3xl border border-neutral-stone/40 shadow-premium relative overflow-hidden">
                            <div className="absolute inset-0 bg-leather-light/10 opacity-50"></div>
                            <div className="relative z-10 grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="block text-4xl font-extrabold text-primary">100%</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">Activité vérifiée</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-4xl font-extrabold text-primary">0</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">Publicité payante</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-4xl font-extrabold text-primary">12k+</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">Interventions</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-4xl font-extrabold text-primary">800+</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">Praticiens</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <section className="space-y-12 reveal [animation-delay:300ms]">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold text-primary tracking-tight font-institutional italic">Nos piliers institutionnels</h2>
                            <div className="w-20 h-1 bg-leather mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-10 rounded-2xl border border-neutral-stone/30 space-y-6 hover:shadow-xl transition-all duration-500 group">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Intégrité des données</h3>
                                <p className="text-neutral-charcoal/60 leading-relaxed">
                                    Chaque donnée d'activité est soumise à notre protocole de vérification pour garantir sa véracité et sa pertinence.
                                </p>
                            </div>

                            <div className="bg-white p-10 rounded-2xl border border-neutral-stone/30 space-y-6 hover:shadow-xl transition-all duration-500 group">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Neutralité absolue</h3>
                                <p className="text-neutral-charcoal/60 leading-relaxed">
                                    Le classement des praticiens est dicté par l'activité réelle et la zone géographique, sans aucune influence commerciale.
                                </p>
                            </div>

                            <div className="bg-white p-10 rounded-2xl border border-neutral-stone/30 space-y-6 hover:shadow-xl transition-all duration-500 group">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <BadgeCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Expertise terrain</h3>
                                <p className="text-neutral-charcoal/60 leading-relaxed">
                                    Nous valorisons les professionnels qui sont au cœur du terrain, garantissant une réponse locale et efficace.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main >

            <Footer />
        </div >
    );
}
