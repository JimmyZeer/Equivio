"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AddInterventionModal } from "@/components/AddInterventionModal";
import { MapPin, Activity, Calendar, Info, ShieldCheck, ExternalLink, ChevronRight } from "lucide-react";
import { TransparencySeal } from "@/components/TransparencySeal";
import Link from "next/link";

export default function PractitionerProfile({ params }: { params: { slug: string } }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Recherche", href: "/search" },
        { label: "Jean Dupont" },
    ];

    const interventions = [
        { date: "12 Jan 2026", type: "Ostéopathie", location: "Caen (14)" },
        { date: "10 Jan 2026", type: "Ostéopathie", location: "Bayeux (14)" },
        { date: "05 Jan 2026", type: "Urgence", location: "Lisieux (14)" },
        { date: "28 Dec 2025", type: "Ostéopathie", location: "Deauville (14)" },
        { date: "22 Dec 2025", type: "Contrôle", location: "Honfleur (14)" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-8 pb-20 px-4">
                <div className="max-w-5xl mx-auto space-y-8">
                    <Breadcrumb items={breadcrumbItems} />

                    {/* Header Profile */}
                    <section className="bg-white rounded-2xl border border-neutral-stone overflow-hidden shadow-sm">
                        <div className="p-8 md:p-12 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Jean Dupont</h1>
                                        <div className="flex gap-2">
                                            <Badge variant="claimed">Profil revendiqué</Badge>
                                            <Badge variant="verified">Profil vérifié</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold text-primary/80">Ostéopathe équin</p>
                                        <div className="flex items-center gap-2 text-neutral-charcoal/60">
                                            <MapPin className="w-4 h-4" />
                                            <span>Intervient en Normandie (Calvados, Eure, Manche)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <Button className="w-full md:px-12 py-4 text-base">Contacter par email</Button>
                                    <Button variant="outline" className="w-full">Voir le site web <ExternalLink className="w-4 h-4 ml-2" /></Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-neutral-stone">
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-primary-soft" />
                                        Résumé d'activité enregistrée
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-neutral-offwhite p-4 rounded-xl border border-neutral-stone">
                                            <span className="block text-2xl font-bold text-primary">142</span>
                                            <span className="text-xs text-neutral-charcoal/50 uppercase font-bold tracking-wider">Interventions</span>
                                        </div>
                                        <div className="bg-neutral-offwhite p-4 rounded-xl border border-neutral-stone">
                                            <span className="block text-2xl font-bold text-primary">12 Jan</span>
                                            <span className="text-xs text-neutral-charcoal/50 uppercase font-bold tracking-wider">Dernière activité</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-leather" />
                                        Vérification Equivio
                                    </h3>
                                    <p className="text-sm text-neutral-charcoal/70 leading-relaxed">
                                        Les diplômes et l'assurance RC Pro de ce praticien ont été vérifiés par nos soins en date du 15 Mars 2025.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Historical Activity — Reveal */}
                        <div className="lg:col-span-2 space-y-8 reveal [animation-delay:200ms]">
                            <section className="bg-white rounded-2xl border border-neutral-stone/50 p-10 space-y-10 shadow-premium">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                    <h2 className="text-2xl font-extrabold tracking-tight">Historique des interventions</h2>
                                    <Button variant="outline" onClick={() => setIsModalOpen(true)} className="group">
                                        Je suis client <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>

                                <div className="space-y-0 divide-y divide-neutral-stone/20 border-t border-neutral-stone/20">
                                    {interventions.map((item, idx) => (
                                        <div key={idx} className="py-5 flex justify-between items-center text-[0.9375rem] group/line hover:bg-neutral-offwhite/50 px-2 -mx-2 transition-colors duration-200">
                                            <div className="flex gap-6 items-center">
                                                <Calendar className="w-4 h-4 text-neutral-charcoal/20 group-hover/line:text-primary-soft transition-colors" strokeWidth={1.5} />
                                                <span className="font-bold text-primary/80">{item.date}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-neutral-charcoal/60">{item.type}</span>
                                                <div className="h-1 w-1 rounded-full bg-neutral-stone"></div>
                                                <span className="text-neutral-charcoal/40 font-medium">{item.location}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Refined activity graph with tooltips (CSS only) */}
                                <div className="pt-12 border-t border-neutral-stone/30">
                                    <div className="flex justify-between items-end mb-8">
                                        <h4 className="text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.2em]">Flux d'activité mensuel</h4>
                                        <TransparencySeal size="sm" />
                                    </div>
                                    <div className="flex items-end gap-3 h-32">
                                        {[40, 65, 30, 85, 45, 95, 70, 55, 80, 60, 40, 90].map((h, i) => (
                                            <div key={i} className="flex-1 bg-primary-soft/5 rounded-t-lg relative group cursor-pointer">
                                                <div
                                                    className="absolute bottom-0 w-full bg-primary-soft/30 group-hover:bg-primary-soft rounded-t-lg transition-all duration-500 ease-out"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-primary text-white text-[9px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                                                    {Math.round(h * 1.5)} interventions
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-primary"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-5 px-2 text-[10px] text-neutral-charcoal/20 uppercase font-bold tracking-[0.2em] opacity-60">
                                        <span>Janvier</span><span>Mars</span><span>Mai</span><span>Juillet</span><span>Septembre</span><span>Novembre</span>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white rounded-2xl border border-neutral-stone p-8">
                                <h3 className="font-bold mb-4">Présentation professionnelle</h3>
                                <div className="prose prose-sm text-neutral-charcoal/80 leading-relaxed">
                                    <p>
                                        Installé depuis 2018, mon approche se base sur une écoute attentive des besoins du cheval et de son cavalier. Spécialisé dans le suivi des chevaux de sport, j'interviens également pour le confort des chevaux de loisir et des retraités.
                                    </p>
                                    <p className="mt-4">
                                        Formation continue régulière pour garantir une pratique actualisée et respectueuse de la physiologie équine.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar info */}
                        <div className="space-y-6">
                            <section className="bg-leather-light/30 border border-leather-light p-6 rounded-2xl space-y-4">
                                <h4 className="font-bold text-primary">Vous êtes ce praticien ?</h4>
                                <p className="text-sm text-neutral-charcoal/70">
                                    Prenez le contrôle de votre fiche pour mettre à jour vos informations et valoriser votre activité.
                                </p>
                                <Link href="/revendiquer" className="block">
                                    <Button variant="secondary" className="w-full">Revendiquer cette fiche</Button>
                                </Link>
                            </section>

                            <section className="bg-white border border-neutral-stone p-6 rounded-2xl space-y-4">
                                <div className="flex items-start gap-2 text-neutral-charcoal/40">
                                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs italic leading-snug">
                                        Les données d'activité sont collectées de manière anonyme auprès des propriétaires et via des partenariats techniques. Aucune donnée nominative de client n'est affichée.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <AddInterventionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                practitionerName="Jean Dupont"
            />
            <Footer />
        </div>
    );
}
