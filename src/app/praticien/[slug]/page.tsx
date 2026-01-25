"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AddInterventionModal } from "@/components/AddInterventionModal";
import { MapPin, Activity, Calendar, Info, ShieldCheck, ExternalLink, ChevronRight, Loader2 } from "lucide-react";
import { TransparencySeal } from "@/components/TransparencySeal";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Practitioner {
    id: string;
    name: string;
    specialty: string;
    region: string;
    slug: string;
    intervention_count: number;
    last_intervention: string | null;
}

interface Intervention {
    date: string;
    type: string;
    location: string;
}

export default function PractitionerProfile({ params }: { params: Promise<{ slug: string }> }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            setLoading(true);
            try {
                // Fetch practitioner details
                const { data: pData, error: pError } = await supabase
                    .from('practitioners')
                    .select('*')
                    .eq('slug', resolvedParams.slug)
                    .single();

                if (pError) throw pError;
                setPractitioner(pData);

                // Fetch interventions
                const { data: iData, error: iError } = await supabase
                    .from('interventions')
                    .select('date, type, location')
                    .eq('practitioner_id', pData.id)
                    .order('date', { ascending: false })
                    .limit(10);

                if (iError) throw iError;
                setInterventions(iData.map(i => ({
                    ...i,
                    date: new Date(i.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                })));
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!practitioner) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-6">
                    <h1 className="text-3xl font-bold text-primary">Praticien introuvable</h1>
                    <p className="text-neutral-charcoal/60">Nous n'avons trouvé aucun profil correspondant à cette adresse.</p>
                    <Link href="/search">
                        <Button>Retour à la recherche</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Recherche", href: "/search" },
        { label: practitioner.name },
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
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">{practitioner.name}</h1>
                                        <div className="flex gap-2">
                                            <Badge variant="claimed">Profil revendiqué</Badge>
                                            <Badge variant="verified">Profil vérifié</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold text-primary/80">{practitioner.specialty}</p>
                                        <div className="flex items-center gap-2 text-neutral-charcoal/60">
                                            <MapPin className="w-4 h-4" />
                                            <span>Intervient en {practitioner.region}</span>
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
                                            <span className="block text-2xl font-bold text-primary">{practitioner.intervention_count}</span>
                                            <span className="text-xs text-neutral-charcoal/50 uppercase font-bold tracking-wider">Interventions</span>
                                        </div>
                                        <div className="bg-neutral-offwhite p-4 rounded-xl border border-neutral-stone">
                                            <span className="block text-2xl font-bold text-primary">
                                                {practitioner.last_intervention ? new Date(practitioner.last_intervention).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : "—"}
                                            </span>
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
                                        Les diplômes et l'assurance RC Pro de ce praticien ont été vérifiés par nos soins.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8 reveal [animation-delay:200ms]">
                            <section className="bg-white rounded-2xl border border-neutral-stone/50 p-10 space-y-10 shadow-premium">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                    <h2 className="text-2xl font-extrabold tracking-tight">Historique des interventions</h2>
                                    <Button variant="outline" onClick={() => setIsModalOpen(true)} className="group">
                                        Je suis client <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>

                                <div className="space-y-0 divide-y divide-neutral-stone/20 border-t border-neutral-stone/20">
                                    {interventions.length > 0 ? interventions.map((item, idx) => (
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
                                    )) : (
                                        <div className="py-10 text-center text-neutral-charcoal/40 italic">Aucune intervention enregistrée récemment.</div>
                                    )}
                                </div>

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
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-primary text-white text-[9px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                                                    {Math.round(h * 1.5)} interventions
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-primary"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white rounded-2xl border border-neutral-stone p-8">
                                <h3 className="font-bold mb-4">Présentation professionnelle</h3>
                                <div className="prose prose-sm text-neutral-charcoal/80 leading-relaxed">
                                    <p>
                                        Spécialisé en {practitioner.specialty.toLowerCase()}, ce professionnel intervient dans la région {practitioner.region}. Son activité sur Equivio est certifiée par les interventions enregistrées par ses clients.
                                    </p>
                                </div>
                            </section>
                        </div>

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
                practitionerName={practitioner.name}
                practitionerId={practitioner.id}
            />
            <Footer />
        </div>
    );
}
