import { Practitioner } from "@/lib/practitioners";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PhoneNumberReveal } from "@/components/PhoneNumberReveal";
import { ContactButton } from "@/components/ContactButton";
import { ProfileFavoriteButton } from "@/components/ProfileFavoriteButton";
import { ShareButtons } from "@/components/ShareButtons";
import { LocalBusinessSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { MapPin, ShieldCheck, CheckCircle2, Clock, HelpCircle, Info } from "lucide-react";
import Link from "next/link";

interface FarrierTemplateProps {
    practitioner: Practitioner;
}

export function FarrierTemplate({ practitioner }: FarrierTemplateProps) {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Praticiens", href: "/search" },
        { label: "Maréchaux-ferrants", href: "/praticiens/marechaux-ferrants" },
        { label: practitioner.name },
    ];

    const displayRegion = practitioner.region && practitioner.region !== "unknown" ? practitioner.region : "votre région";
    const displayCity = practitioner.city || "Ville non renseignée";
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${practitioner.address_full || practitioner.city}`)}`;

    return (
        <div className="flex flex-col min-h-screen font-sans bg-[#FAFAFA]">
            {/* Structured Data */}
            <LocalBusinessSchema
                name={practitioner.name}
                specialty="Maréchal-ferrant"
                city={practitioner.city}
                region={practitioner.region}
                phone={practitioner.phone_norm}
                website={practitioner.website}
                slug={practitioner.slug_seo || ""}
                lat={practitioner.lat}
                lng={practitioner.lng}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Accueil", url: "https://equivio.fr" },
                    { name: "Praticiens", url: "https://equivio.fr/search" },
                    { name: "Maréchaux-ferrants", url: "https://equivio.fr/praticiens/marechaux-ferrants" },
                    { name: practitioner.name, url: `https://equivio.fr/praticien/${practitioner.slug_seo}` },
                ]}
            />

            <Header />

            <main className="flex-grow pt-8 sm:pt-12 pb-24 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto space-y-16">
                    {/* Breadcrumb */}
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    {/* 1. Header Dynamique */}
                    <header className="bg-white rounded-[32px] p-8 sm:p-10 shadow-sm border border-neutral-100 relative overflow-hidden reveal [animation-delay:100ms]">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <ShieldCheck className="w-32 h-32 text-primary" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 justify-between relative z-10">
                            <div className="space-y-6 flex-1">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100">
                                            Référencé sur Equivio
                                        </Badge>
                                        <span className="text-sm text-neutral-400 font-medium">Profil vérifié</span>
                                    </div>
                                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight leading-[1.1]">
                                        {practitioner.name}
                                    </h1>
                                    <p className="text-xl text-neutral-500 font-medium flex items-center gap-2">
                                        Maréchal-ferrant
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mx-2" />
                                        <span className="text-neutral-700">{displayRegion}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 text-neutral-600 font-medium">
                                    <MapPin className="w-5 h-5 text-neutral-400" />
                                    <span>{displayCity}</span>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <ShareButtons
                                        url={`/praticien/${practitioner.slug_seo}`}
                                        title={`${practitioner.name} - Maréchal-ferrant`}
                                        description={`Prenez rendez-vous avec ${practitioner.name}, maréchal-ferrant à ${displayCity}.`}
                                    />
                                    <div className="w-px h-6 bg-neutral-200" />
                                    <div className="scale-110">
                                        <ProfileFavoriteButton practitionerId={practitioner.id} />
                                    </div>
                                </div>
                            </div>

                            {/* Actions Card */}
                            <div className="w-full md:w-[320px] bg-neutral-50 rounded-2xl p-6 border border-neutral-100 space-y-4 shadow-sm">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Contact direct</p>
                                    <p className="text-sm text-neutral-500">Sans intermédiaire, ni commission.</p>
                                </div>

                                {practitioner.phone_norm ? (
                                    <PhoneNumberReveal phoneNumber={practitioner.phone_norm} practitionerId={practitioner.id} />
                                ) : (
                                    <div className="p-3 bg-neutral-100 rounded-lg text-center text-neutral-400 text-sm font-medium">
                                        Numéro non disponible
                                    </div>
                                )}

                                <ContactButton
                                    practitionerId={practitioner.id}
                                    practitionerName={practitioner.name}
                                    className="w-full justify-center h-12 text-base font-semibold shadow-sm hover:shadow-md transition-shadow"
                                />

                                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <Button variant="outline" className="w-full justify-center h-12 text-neutral-600 border-neutral-200 hover:border-primary/30 hover:text-primary transition-colors">
                                        Localiser sur la carte
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-16">
                            {/* 2. Bloc Présentation */}
                            <section className="space-y-6 reveal [animation-delay:200ms]">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                    <Info className="w-6 h-6 text-primary/40" />
                                    À propos de ce professionnel
                                </h2>
                                <div className="prose prose-neutral max-w-none text-lg text-neutral-charcoal/80 leading-relaxed">
                                    <p>
                                        <strong className="text-primary font-semibold">Ce professionnel</strong> est un spécialiste du pied du cheval, assurant le parage et la ferrure pour garantir le confort, l'équilibre et la performance de l'animal.
                                    </p>
                                    <p>
                                        Le maréchal-ferrant intervient dans une démarche fonctionnelle et préventive. Son rôle est d'adapter la protection du pied à l'activité du cheval (loisir, sport, élevage) et de corriger les éventuels défauts d'aplomb. Il collabore régulièrement avec les vétérinaires pour les suivis orthopédiques.
                                    </p>
                                    {practitioner.region && practitioner.region !== "unknown" ? (
                                        <p>
                                            Sa zone d’intervention principale couvre la région <span className="font-medium text-neutral-800">{practitioner.region}</span>, avec des déplacements possibles selon les secteurs et l’organisation des tournées.
                                        </p>
                                    ) : (
                                        <p>
                                            Sa zone d’intervention varie selon les demandes. Veuillez contacter le professionnel pour plus de détails.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* 3. Bloc "Quand consulter ?" */}
                            <section className="bg-white rounded-[24px] p-8 border border-neutral-100 space-y-6 shadow-sm reveal [animation-delay:300ms]">
                                <h2 className="text-xl font-bold text-primary">Quand faire intervenir un maréchal-ferrant ?</h2>
                                <p className="text-neutral-charcoal/70 leading-relaxed">
                                    Un suivi rigoureux des pieds est indispensable pour la santé locomotrice du cheval. Voici les principales raisons d'intervention :
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Entretien régulier du pied (toutes les 6 à 8 semaines)",
                                        "Renouvellement de ferrure ou parage physiologique",
                                        "Cheval déferré ou fer arraché",
                                        "Suivi orthopédique (sur prescription vétérinaire)",
                                        "Préparation aux compétitions ou randonnées",
                                        "Correction des aplombs chez le poulain"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-neutral-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* 4. Bloc Déroulement */}
                            <section className="space-y-6 reveal [animation-delay:400ms]">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-primary/40" />
                                    Déroulement d’une intervention
                                </h2>
                                <div className="space-y-6 relative border-l-2 border-neutral-200 ml-3 pl-8 py-2">
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-sm" />
                                        <h3 className="font-bold text-lg text-neutral-800 mb-2">Observation & Analyse</h3>
                                        <p className="text-neutral-600">
                                            Le maréchal observe le cheval à l'arrêt et en mouvement pour évaluer ses aplombs, sa locomotion et l'état de la corne avant toute intervention.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary/60 shadow-sm" />
                                        <h3 className="font-bold text-lg text-neutral-800 mb-2">Travail du pied</h3>
                                        <p className="text-neutral-600">
                                            Selon les besoins, il réalise un parage (taille de la corne) ou une ferrure (ajustage et pose de fers), en veillant à respecter l'équilibre naturel du cheval.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary/30 shadow-sm" />
                                        <h3 className="font-bold text-lg text-neutral-800 mb-2">Conseils d'entretien</h3>
                                        <p className="text-neutral-600">
                                            Il prodigue des conseils sur l'entretien des pieds (graissage, soins de fourchette) et définit la périodicité idéale pour le prochain passage.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 5. Zone d'intervention */}
                            <section className="bg-neutral-900 text-white rounded-[24px] p-8 space-y-6 reveal [animation-delay:500ms]">
                                <h2 className="text-xl font-bold text-white">Zone d’intervention</h2>
                                <p className="text-neutral-300 leading-relaxed">
                                    <strong className="text-white">{practitioner.name} – Maréchal-ferrant</strong> intervient principalement pour des tournées dans la région {displayRegion}.
                                </p>
                                {practitioner.region && practitioner.region !== "unknown" ? (
                                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                        <span className="font-medium text-emerald-50">Secteur : {displayRegion}</span>
                                    </div>
                                ) : null}
                                <p className="text-sm text-neutral-400 italic">
                                    Les modalités de déplacement peuvent varier selon la localisation, la fréquence des tournées et les regroupements de chevaux.
                                </p>
                            </section>

                            {/* 7. FAQ */}
                            <section className="space-y-8 reveal [animation-delay:600ms]">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                    <HelpCircle className="w-6 h-6 text-primary/40" />
                                    Questions fréquentes
                                </h2>
                                <div className="grid gap-4">
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                        <h3 className="font-bold text-neutral-800 mb-2">Quelle est la fréquence idéale de passage ?</h3>
                                        <p className="text-neutral-600">En moyenne, un cheval doit être vu toutes les 6 à 8 semaines. Ce délai peut varier selon la pousse de la corne, l'activité et le type de ferrure.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                        <h3 className="font-bold text-neutral-800 mb-2">Quelle différence entre parage et ferrure ?</h3>
                                        <p className="text-neutral-600">Le parage consiste à tailler la corne pour équilibrer un pied nu. La ferrure ajoute une protection métallique ou synthétique pour les chevaux sollicités ou nécessitant une correction orthopédique.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                        <h3 className="font-bold text-neutral-800 mb-2">Combien de temps dure l'intervention ?</h3>
                                        <p className="text-neutral-600">Comptez environ 30 minutes pour un parage simple et entre 1h et 1h15 pour une ferrure complète des 4 pieds.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* 6. Pourquoi ce pro (Transparence) */}
                            <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100 space-y-4">
                                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide">Transparence Equivio</h3>
                                <p className="text-sm text-blue-800/80 leading-relaxed">
                                    Cette fiche a été générée à partir de données publiques et professionnelles disponibles.
                                    Equivio ne classe pas les praticiens, ne vend pas de publicité et n’accepte aucun paiement pour modifier le référencement naturel.
                                </p>
                                <p className="text-sm text-blue-800/80 leading-relaxed">
                                    Notre mission est de fournir une information neutre, structurée et fiable aux propriétaires de chevaux.
                                </p>
                            </div>

                            {/* 8. CTA Praticien */}
                            <div className="bg-white p-6 rounded-[24px] border border-neutral-100 text-center space-y-4 shadow-sm">
                                <p className="font-bold text-neutral-800">Vous êtes ce professionnel ?</p>
                                <div className="text-sm text-neutral-500 text-left space-y-2">
                                    <p>Si vous êtes <strong>{practitioner.name} – Maréchal-ferrant</strong>, vous pouvez :</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>compléter ou corriger certaines informations</li>
                                        <li>ajouter une photo, vos diplômes ou vos zones de tournée</li>
                                    </ul>
                                </div>
                                <Link href="/revendiquer" className="block w-full pt-2">
                                    <Button variant="outline" className="w-full text-primary hover:bg-primary/5 hover:text-primary font-medium border-transparent">
                                        Revendiquer ce profil
                                    </Button>
                                </Link>
                                <p className="text-xs text-neutral-400 mt-4 leading-normal">
                                    👉 La revendication de fiche est gratuite et vise uniquement à garantir une information fidèle et à jour.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
