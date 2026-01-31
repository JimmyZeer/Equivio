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

interface OsteopathTemplateProps {
    practitioner: Practitioner;
}

export function OsteopathTemplate({ practitioner }: OsteopathTemplateProps) {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Praticiens", href: "/search" },
        { label: "Ostéopathes", href: "/praticiens/osteopathes" },
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
                specialty="Ostéopathe équin"
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
                    { name: "Ostéopathes", url: "https://equivio.fr/praticiens/osteopathes" },
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
                                        Ostéopathe pour animaux
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
                                        title={`${practitioner.name} - Ostéopathe équin`}
                                        description={`Prenez rendez-vous avec ${practitioner.name}, ostéopathe équin à ${displayCity}.`}
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
                                    À propos de ce praticien
                                </h2>
                                <div className="prose prose-neutral max-w-none text-lg text-neutral-charcoal/80 leading-relaxed">
                                    <p>
                                        <strong className="text-primary font-semibold">{practitioner.name}</strong> est un professionnel exerçant l'ostéopathie animale,
                                        basé à <span className="font-medium text-neutral-800">{displayCity}</span>.
                                    </p>
                                    <p>
                                        Spécialisé dans le suivi des équidés (chevaux de sport, loisir, élevage), ce praticien intervient pour
                                        prévenir et traiter les troubles fonctionnels du corps de l'animal. L'approche ostéopathique vise à
                                        restaurer la mobilité et l'équilibre tissulaire.
                                    </p>
                                    {practitioner.region && practitioner.region !== "unknown" && (
                                        <p>
                                            Sa zone d'intervention principale couvre la région <span className="font-medium text-neutral-800">{practitioner.region}</span> et ses alentours.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* 3. Bloc "Quand faire appel ?" (SEO Generic) */}
                            <section className="bg-white rounded-[24px] p-8 border border-neutral-100 space-y-6 shadow-sm reveal [animation-delay:300ms]">
                                <h2 className="text-xl font-bold text-primary">Quand consulter un ostéopathe équin ?</h2>
                                <p className="text-neutral-charcoal/70 leading-relaxed">
                                    L'ostéopathie est recommandée en préventif (check-up annuel) ou en curatif.
                                    Voici les signes fréquents nécessitant une consultation :
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Baisse de performance inexpliquée",
                                        "Raideur ou boiterie légère",
                                        "Défense au sanglage ou au montoir",
                                        "Changement de comportement soudain",
                                        "Après un traumatisme (chute, glissade)",
                                        "Suivi de croissance du poulain"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-neutral-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* 4. Bloc Déroulement (SEO Generic) */}
                            <section className="space-y-6 reveal [animation-delay:400ms]">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-primary/40" />
                                    Déroulement d'une séance type
                                </h2>
                                <div className="space-y-6 relative border-l-2 border-neutral-200 ml-3 pl-8 py-2">
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-sm" />
                                        <h3 className="font-bold text-lg text-neutral-800 mb-2">Anamnèse & Observation</h3>
                                        <p className="text-neutral-600">
                                            Échange sur l'historique du cheval, ses antécédents et le motif de consultation.
                                            Observation statique et dynamique (au pas, au trot) pour identifier les zones de tension.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary/60 shadow-sm" />
                                        <h3 className="font-bold text-lg text-neutral-800 mb-2">Tests & Manipulations</h3>
                                        <p className="text-neutral-600">
                                            Palpation précise de l'ensemble du corps. Le praticien utilise des techniques manuelles douces
                                            (structurelles, tissulaires, viscérales) pour libérer les blocages.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary/30 shadow-sm" />
                                        <h3 className="font-bold text-lg text-neutral-800 mb-2">Conseils & Repos</h3>
                                        <p className="text-neutral-600">
                                            Un repos de 48h à quelques jours est généralement préconisé après la séance.
                                            Le praticien partage des conseils de rééducation ou d'adaptation du travail.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 5. Zone d'intervention */}
                            <section className="bg-neutral-900 text-white rounded-[24px] p-8 space-y-6 reveal [animation-delay:500ms]">
                                <h2 className="text-xl font-bold text-white">Zone d'intervention</h2>
                                <p className="text-neutral-300 leading-relaxed">
                                    <strong className="text-white">{practitioner.name}</strong> se déplace principalement pour les consultations.
                                </p>
                                {practitioner.region && practitioner.region !== "unknown" ? (
                                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                        <span className="font-medium text-emerald-50">Secteur : {practitioner.region}</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-400 italic">
                                        Veuillez contacter le praticien pour confirmer s'il se déplace dans votre secteur.
                                    </p>
                                )}
                            </section>

                            {/* 7. FAQ (Generic) */}
                            <section className="space-y-8 reveal [animation-delay:600ms]">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                    <HelpCircle className="w-6 h-6 text-primary/40" />
                                    Questions fréquentes
                                </h2>
                                <div className="grid gap-4">
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                        <h3 className="font-bold text-neutral-800 mb-2">Quelle est la durée moyenne d'une consultation ?</h3>
                                        <p className="text-neutral-600">Une séance d'ostéopathie équine dure généralement entre 45 minutes et 1 heure, selon la complexité du cas et la coopération de l'animal.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                        <h3 className="font-bold text-neutral-800 mb-2">Faut-il une ordonnance vétérinaire ?</h3>
                                        <p className="text-neutral-600">Non, l'ostéopathe peut être consulté en première intention. Toutefois, en cas de pathologie aigüe ou d'urgence, l'avis du vétérinaire traitant reste prioritaire.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                        <h3 className="font-bold text-neutral-800 mb-2">Combien coûte une séance ?</h3>
                                        <p className="text-neutral-600">Les tarifs sont variables selon le praticien et les frais de déplacement. Il est recommandé de demander des précisions lors de la prise de rendez-vous.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* 6. Pourquoi ce pro (Methodology) */}
                            <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100 space-y-4">
                                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide">Transparence Equivio</h3>
                                <p className="text-sm text-blue-800/80 leading-relaxed">
                                    Cette fiche pratique a été générée à partir de données publiques et professionnelles vérifiées.
                                    Equivio ne classe pas les praticiens, ne vend pas de publicité et n'accepte pas de paiement pour modifier le référencement naturel.
                                </p>
                                <p className="text-sm text-blue-800/80 leading-relaxed">
                                    Notre mission est de vous fournir une information brute, neutre et fiable.
                                </p>
                            </div>

                            {/* 8. CTA Praticien */}
                            <div className="bg-white p-6 rounded-[24px] border border-neutral-100 text-center space-y-4 shadow-sm">
                                <p className="font-bold text-neutral-800">C'est vous, {practitioner.name} ?</p>
                                <p className="text-sm text-neutral-500">
                                    Prenez le contrôle de votre fiche gratuitement. Ajoutez une photo, vos diplômes et vos tarifs.
                                </p>
                                <Link href="/revendiquer" className="block w-full">
                                    <Button variant="outline" className="w-full text-primary hover:bg-primary/5 hover:text-primary font-medium border-transparent">
                                        Revendiquer ce profil
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
