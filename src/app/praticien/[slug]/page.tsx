export const runtime = 'edge';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProfileInterventionClient } from "@/components/ProfileInterventionClient";
import { PhoneNumberReveal } from "@/components/PhoneNumberReveal";
import { MapPin, Activity, Calendar, Info, ShieldCheck, ExternalLink } from "lucide-react";
import { TransparencySeal } from "@/components/TransparencySeal";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { data: practitioner } = await supabase
        .from('practitioners')
        .select('name, specialty, city')
        .eq('slug_seo', resolvedParams.slug)
        .eq('status', 'active')
        .single();

    if (!practitioner) return { title: "Praticien non trouvé | Equivio" };

    const displaySpecialty = practitioner.specialty === "Ostéopathe animalier" ? "Ostéopathe équin" : practitioner.specialty;

    return {
        title: `${practitioner.name} - ${displaySpecialty} à ${practitioner.city} | Equivio`,
        description: `Profil certifié de ${practitioner.name}, ${displaySpecialty.toLowerCase()} intervenant à ${practitioner.city}. Profil vérifié par Equivio.`,
    };
}

export default async function PractitionerProfile({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    // Fetch practitioner details
    const { data: practitioner, error: pError } = await supabase
        .from('practitioners')
        .select('*')
        .eq('slug_seo', resolvedParams.slug)
        .eq('status', 'active')
        .single();

    if (pError || !practitioner) {
        notFound();
    }

    // Fetch interventions
    const { data: iData, error: iError } = await supabase
        .from('interventions')
        .select('date, type, location')
        .eq('practitioner_id', practitioner.id)
        .order('date', { ascending: false })
        .limit(10);

    const interventions = iData ? iData.map(i => ({
        ...i,
        date: (function () {
            try {
                return new Date(i.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
            } catch (e) {
                console.error("Error formatting intervention date:", e);
                return "—";
            }
        })()
    })) : [];

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Recherche", href: "/search" },
        { label: practitioner.name },
    ];

    // Terminology Normalization
    const displaySpecialty = practitioner.specialty === "Ostéopathe animalier" ? "Ostéopathe équin" : practitioner.specialty;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-8 pb-20 px-4">
                <div className="max-w-5xl mx-auto space-y-8">
                    <Breadcrumb items={[
                        { label: "Accueil", href: "/" },
                        { label: "Recherche", href: "/search" },
                        { label: practitioner.name },
                    ]} />

                    {/* Header Profile */}
                    <section className="bg-white rounded-2xl border border-neutral-stone overflow-hidden shadow-sm">
                        <div className="p-8 md:p-12 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">{practitioner.name}</h1>
                                        {/* Max 1 Badge Logic */}
                                        <div className="flex gap-2">
                                            <Badge variant="verified">Profil vérifié</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold text-primary/80">{displaySpecialty}</p>
                                        <div className="flex items-center gap-2 text-neutral-charcoal/60">
                                            <MapPin className="w-4 h-4" />
                                            <span>Intervient en {practitioner.region}</span>
                                        </div>
                                        {/* Phone Button instead of "Contacter par email" if phone exists */}
                                        {practitioner.phone_norm && (
                                            <div className="pt-2">
                                                <PhoneNumberReveal phoneNumber={practitioner.phone_norm} practitionerId={practitioner.id} />
                                            </div>
                                        )}
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
                                        Statut du profil
                                    </h3>
                                    <div className="bg-neutral-offwhite p-6 rounded-xl border border-neutral-stone flex items-center gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full text-primary">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-primary">Profil vérifié – présence terrain confirmée</span>
                                            <span className="text-xs text-neutral-charcoal/60">La zone d’intervention et l’activité professionnelle du praticien ont été vérifiées par Equivio.</span>
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
                                    <h2 className="text-2xl font-extrabold tracking-tight">Zone d'intervention</h2>
                                </div>

                                <div className="bg-neutral-offwhite p-8 rounded-xl border border-neutral-stone text-center space-y-4">
                                    <MapPin className="w-12 h-12 text-primary mx-auto opacity-20" />
                                    <p className="text-neutral-charcoal/60 italic font-medium">
                                        Ce praticien intervient principalement en région <span className="text-primary font-bold">{practitioner.region}</span>.
                                    </p>
                                    <p className="text-xs text-neutral-charcoal/40">
                                        L'activité professionnelle est confirmée sans affichage de données clients nominatives.
                                    </p>
                                </div>
                            </section>

                            <section className="bg-white rounded-2xl border border-neutral-stone p-8">
                                <h3 className="font-bold mb-4">Présentation professionnelle</h3>
                                <div className="prose prose-sm text-neutral-charcoal/80 leading-relaxed">
                                    <p>
                                        Spécialisé en {displaySpecialty.toLowerCase()}, ce professionnel intervient dans la région {practitioner.region}. Son activité professionnelle est vérifiée par Equivio.
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

            <Footer />
        </div>
    );
}
