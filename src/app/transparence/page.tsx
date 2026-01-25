export const runtime = 'edge';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Search, MapPin, Database, Lock, Eye, CheckCircle2, Shield } from "lucide-react";

export default function TransparencePage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Note de transparence" },
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
                            La transparence comme <span className="text-primary-soft">standard d'excellence</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-charcoal/60 leading-relaxed text-pretty max-w-3xl">
                            Parce que la confiance ne se décrète pas mais se prouve par les faits, Equivio s'appuie sur un protocole de données rigoureux.
                        </p>
                    </section>

                    {/* How it works */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start reveal [animation-delay:200ms]">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-primary tracking-tight">D'où viennent les données ?</h2>
                                <p className="text-lg text-neutral-charcoal/70 leading-relaxed">
                                    L'activité affichée sur Equivio provient de trois sources certifiées :
                                </p>
                                <ul className="space-y-6 pt-4">
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft/10 text-primary-soft flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-primary">Déclarations Propriétaires</span>
                                            <p className="text-neutral-charcoal/60 text-sm">Les propriétaires de chevaux enregistrent leurs interventions après chaque passage du professionnel.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft/10 text-primary-soft flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-primary">Données Partenaires</span>
                                            <p className="text-neutral-charcoal/60 text-sm">Nous collaborons avec des logiciels de gestion pour agréger les flux d'activité anonymisés.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft/10 text-primary-soft flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-primary">Preuves de Service</span>
                                            <p className="text-neutral-charcoal/60 text-sm">Les documents justificatifs (assurance RC Pro, diplômes) sont vérifiés manuellement par nos équipes.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-primary p-12 rounded-3xl text-white space-y-10 relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-grain opacity-5"></div>
                            <h3 className="text-2xl font-bold tracking-tight relative z-10">L'Algorithme de Cohérence</h3>
                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-6">
                                    <div className="bg-white/10 p-4 rounded-xl">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-leather-light">Analyse Géographique</h4>
                                        <p className="text-sm text-white/70 leading-relaxed">Vérification de la cohérence entre le domicile du praticien et ses zones de tournées enregistrées.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="bg-white/10 p-4 rounded-xl">
                                        <Database className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-leather-light">Détection d'Anomalies</h4>
                                        <p className="text-sm text-white/70 leading-relaxed">Identification automatique des déclarations multiples ou incohérentes pour garantir l'équité.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Section */}
                    <section className="bg-leather-light/20 p-12 md:p-20 rounded-[3rem] border border-leather-light border-dashed reveal [animation-delay:300ms]">
                        <div className="max-w-4xl mx-auto text-center space-y-10">
                            <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full border border-neutral-stone/40 shadow-sm">
                                <Lock className="w-4 h-4 text-primary" strokeWidth={2} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Confidentialité & RGPD</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-institutional italic font-bold text-primary tracking-tight leading-snug">
                                "La transparence pour le professionnel, l'anonymat pour le client."
                            </h2>
                            <p className="text-lg text-neutral-charcoal/60 leading-relaxed">
                                Equivio ne publie jamais le nom des propriétaires, les coordonnées des chevaux, ou le détail financier des interventions. Nous ne traitons que des flux d'activité : date, type de soin et localisation approximative (code postal).
                            </p>
                            <div className="flex flex-wrap justify-center gap-12 pt-8">
                                <div className="space-y-2">
                                    <Eye className="w-8 h-8 mx-auto text-primary/40" />
                                    <span className="block text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">Visualisation Neutre</span>
                                </div>
                                <div className="space-y-2">
                                    <Shield className="w-8 h-8 mx-auto text-primary/40" />
                                    <span className="block text-xs font-bold uppercase tracking-widest text-neutral-charcoal/40">Zéro Pistage</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
