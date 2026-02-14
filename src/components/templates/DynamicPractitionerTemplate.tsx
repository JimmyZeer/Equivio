'use client';
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
import { LocalBusinessSchema, BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { MapPin, ShieldCheck, CheckCircle2, Clock, HelpCircle, Info, ExternalLink } from "lucide-react";
import Link from "next/link";
import { TransparencyIndex } from "@/components/TransparencyIndex";
import { TrackPractitioner } from "@/components/analytics/TrackPractitioner";
import { ClaimButton } from "@/components/analytics/ClaimButton";
import { trackWebsiteClick } from "@/lib/analytics";

export type PractitionerTemplateType = 'osteo' | 'dentist' | 'farrier' | 'generic';

interface TemplateConfig {
    specialtyLabel: string;
    description: (name: string, region: string) => string;
    whoIsIt: (name: string) => string;
    roleDescription: string;
    whenToConsultTitle: string;
    whenToConsultPoints: string[];
    stepsTitle: string;
    steps: { title: string; desc: string }[];
    faq: { q: string; a: string }[];
}

const TEMPLATES: Record<PractitionerTemplateType, TemplateConfig> = {
    osteo: {
        specialtyLabel: "Ostéopathe équin",
        description: (name, region) => `${name} est ostéopathe équin${region ? ` exerçant principalement en ${region}` : ""}. Interventions pour chevaux de sport et de loisir.`,
        whoIsIt: (name) => `${name} – Ostéopathe pour animaux`,
        roleDescription: "L’ostéopathie animale repose sur une approche manuelle globale visant à évaluer et améliorer la mobilité fonctionnelle du corps de l’animal. Elle s’inscrit dans une démarche de confort et d’accompagnement.",
        whenToConsultTitle: "Quand consulter un ostéopathe équin ?",
        whenToConsultPoints: [
            "baisse de confort ou de performance inexpliquée",
            "raideurs, asymétries ou gêne locomotrice légère",
            "défenses au sanglage, au montoir ou au travail",
            "changement de comportement inhabituel",
            "suivi après un effort important ou un événement traumatique",
            "accompagnement de la croissance chez le poulain"
        ],
        stepsTitle: "Déroulement d’une séance type",
        steps: [
            { title: "Anamnèse & observation", desc: "Échange avec le propriétaire pour comprendre l’historique. Observation statique et dynamique pour identifier les restrictions." },
            { title: "Évaluation & techniques manuelles", desc: "Palpation et tests de mobilité. Utilisation de techniques manuelles adaptées (structurelles, tissulaires, viscérales)." },
            { title: "Conseils & suivi", desc: "Recommandations sur le repos, la reprise du travail et le suivi nécessaire." }
        ],
        faq: [
            { q: "Quelle est la durée moyenne d’une consultation ?", a: "Une séance dure en général entre 45 minutes et 1 heure." },
            { q: "Faut-il une ordonnance vétérinaire ?", a: "Non, l’ostéopathe peut être consulté sans ordonnance, sauf urgence médicale réservée au vétérinaire." },
            { q: "Combien coûte une séance ?", a: "Les tarifs varient selon le déplacement. Renseignez-vous lors de la prise de contact." }
        ]
    },
    dentist: {
        specialtyLabel: "Dentiste équin",
        description: (name, region) => `${name} est dentiste équin${region ? ` intervenant en ${region} et alentours` : ""}. Entretien de la table dentaire.`,
        whoIsIt: (name) => `${name} – Dentiste équin`,
        roleDescription: "Le dentiste équin joue un rôle clé dans la santé de l’animal. Son intervention vise à prévenir l’apparition de surdents, d’inconforts au mors ou de troubles digestifs.",
        whenToConsultTitle: "Quand consulter un dentiste équin ?",
        whenToConsultPoints: [
            "Suivi annuel de prévention (recommandé)",
            "Difficultés à la mastication (grains qui tombent)",
            "Amaigrissement inexpliqué",
            "Défenses ou gênes au travail (contact avec le mors)",
            "Encensement ou mouvements de tête anormaux",
            "Suivi du poulain (dents de lait)"
        ],
        stepsTitle: "Déroulement d’une intervention",
        steps: [
            { title: "Examen de la cavité buccale", desc: "Examen complet pour identifier surdents, pointes d'émail ou anomalies." },
            { title: "Soins & nivellement", desc: "Nivellement des dents (râpage) pour restaurer une table dentaire fonctionnelle." },
            { title: "Conseils de suivi", desc: "Recommandations sur l'alimentation et la fréquence des prochains passages." }
        ],
        faq: [
            { q: "À quelle fréquence faut-il consulter ?", a: "Un contrôle annuel est recommandé pour la majorité des chevaux adultes." },
            { q: "Quelle différence avec un vétérinaire ?", a: "Le technicien dentaire se focalise sur l'entretien courant. Le vétérinaire gère la chirurgie et la sédation." },
            { q: "Combien de temps dure l'intervention ?", a: "En moyenne 30 à 45 minutes pour un entretien classique." }
        ]
    },
    farrier: {
        specialtyLabel: "Maréchal-ferrant",
        description: (name, region) => `${name} est maréchal-ferrant${region ? ` disponible sur le secteur ${region}` : ""}. Parage et ferrure.`,
        whoIsIt: (name) => `${name} – Maréchal-ferrant`,
        roleDescription: "Le maréchal-ferrant assure l'entretien des pieds du cheval, par le parage et la ferrure, garantissant ainsi un bon fonctionnement locomoteur.",
        whenToConsultTitle: "Pourquoi faire appel à un maréchal-ferrant ?",
        whenToConsultPoints: [
            "Entretien régulier des pieds (toutes les 6 à 8 semaines)",
            "Renouvellement de ferrure",
            "Correction d'aplombs chez le poulain",
            "Suivi orthopédique (en collaboration avec le vétérinaire)",
            "Conseils en soins des pieds (seimes, fourchettes)"
        ],
        stepsTitle: "Types d'interventions",
        steps: [
            { title: "Parage", desc: "Entretien de la corne pour équilibrer le pied et respecter les aplombs." },
            { title: "Ferrure", desc: "Pose de fers adaptés à l'activité et aux besoins spécifiques du cheval." },
            { title: "Suivi orthopédique", desc: "Accompagnement de la correction de défauts d'aplomb ou pathologies." }
        ],
        faq: [
            { q: "À quelle fréquence parer/ferrer ?", a: "Toutes les 6 à 8 semaines en moyenne, selon la pousse de la corne." },
            { q: "Intervenez-vous sur les poulains ?", a: "Oui, le suivi des aplombs est crucial dès le plus jeune âge." },
            { q: "La ferrure est-elle obligatoire ?", a: "Non, cela dépend de l'activité, du terrain et de la sensibilité du cheval." }
        ]
    },
    generic: {
        specialtyLabel: "Praticien équin",
        description: (name, region) => `${name} est un professionnel du secteur équin${region ? ` basé en ${region}` : ""}.`,
        whoIsIt: (name) => `${name}`,
        roleDescription: "Ce professionnel intervient auprès des équidés pour assurer leur bien-être et leur santé.",
        whenToConsultTitle: "Pourquoi consulter ?",
        whenToConsultPoints: [
            "Suivi régulier",
            "Besoins spécifiques liés à l'activité",
            "Conseils professionnels"
        ],
        stepsTitle: "Prestations",
        steps: [
            { title: "Analyse des besoins", desc: "Évaluation de la situation et des besoins du cheval." },
            { title: "Intervention adaptée", desc: "Réalisation des soins ou prestations convenus." },
            { title: "Suivi", desc: "Conseils pour le maintien du bien-être de l'animal." }
        ],
        faq: []
    }
};

interface Props {
    practitioner: Practitioner;
    templateType: PractitionerTemplateType;
}

export function DynamicPractitionerTemplate({ practitioner, templateType }: Props) {
    const config = TEMPLATES[templateType];

    // Data Safety & Normalization
    const displayRegion = practitioner.region && practitioner.region !== "unknown" ? practitioner.region : null;
    const displayCity = practitioner.city || "Ville non renseignée"; // Fallback strictly defined
    const regionPhrase = displayRegion || "sa région et les alentours";

    // Breadcrumb
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Praticiens", href: "/search" },
        { label: config.specialtyLabel, href: `/praticiens/${templateType === 'generic' ? 'tous' : templateType === 'farrier' ? 'marechaux-ferrants' : templateType + 's'}` },
        { label: practitioner.name },
    ];

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${practitioner.address_full || practitioner.city}`)}`;

    return (
        <div className="flex flex-col min-h-screen font-sans bg-[#F7F7F7]">
            {/* Structured Data */}
            <LocalBusinessSchema
                name={practitioner.name}
                specialty={config.specialtyLabel}
                city={practitioner.city}
                region={practitioner.region}
                phone={practitioner.phone_norm}
                website={practitioner.website}
                slug={practitioner.slug_seo || ""}
                lat={practitioner.lat}
                lng={practitioner.lng}
            />
            <BreadcrumbSchema
                items={breadcrumbItems.map(item => ({ name: item.label, url: `https://equivio.fr${item.href}` }))}
            />
            {config.faq.length > 0 && (
                <FAQSchema questions={config.faq.map(q => ({ question: q.q, answer: q.a }))} />
            )}

            <Header />

            <main className="flex-grow pt-8 sm:pt-12 pb-24 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto space-y-10">
                    <Breadcrumb items={breadcrumbItems} />

                    {/* Bloc Identité (Reskinned) */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-10 bg-white p-8 sm:p-10 rounded-[32px] shadow-card-rest border border-transparent hover:shadow-card-hover transition-shadow duration-500 relative overflow-hidden">

                        {/* Decorative subtle header background */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-soft to-primary opacity-20" />

                        <div className="space-y-6 flex-1 relative z-10">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    {practitioner.status === 'active' && (
                                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100">
                                            Référencé sur Equivio
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
                                    {practitioner.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
                                    <span className="font-medium text-primary-soft bg-primary/5 px-3 py-1 rounded-full text-base">
                                        {config.specialtyLabel}
                                    </span>
                                    {displayRegion && (
                                        <span className="text-neutral-500 flex items-center gap-1.5 text-base">
                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                                            {displayRegion}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-neutral-charcoal/80 font-medium pt-2">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span className="text-lg">{displayCity}</span>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <ShareButtons
                                    url={`/praticien/${practitioner.slug_seo}`}
                                    title={`${practitioner.name} - ${config.specialtyLabel}`}
                                    description={`Découvrez ${practitioner.name}, ${config.specialtyLabel.toLowerCase()}${practitioner.city ? ` à ${practitioner.city}` : ''}.`}
                                />
                                <div className="w-px h-6 bg-neutral-200" />
                                <div className="scale-110">
                                    <ProfileFavoriteButton practitionerId={practitioner.id} />
                                </div>
                            </div>
                        </div>

                        {/* Actions Column */}
                        <div className="flex flex-col gap-3 w-full md:w-[280px] relative z-10 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100 shadow-sm">
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1 mb-1">Contact direct</div>

                            {practitioner.phone_norm ? (
                                <PhoneNumberReveal phoneNumber={practitioner.phone_norm} practitionerId={practitioner.id} />
                            ) : (
                                <div className="p-3 bg-neutral-100 rounded-lg text-center text-neutral-400 text-sm font-medium border border-neutral-200/50">
                                    Numéro non disponible
                                </div>
                            )}

                            <ContactButton
                                practitionerId={practitioner.id}
                                practitionerName={practitioner.name}
                                className="w-full justify-center h-12 rounded-xl text-base shadow-sm"
                            />

                            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button variant="outline" className="w-full justify-center h-12 rounded-xl text-neutral-600 border-neutral-200 hover:bg-white hover:text-primary hover:border-primary/30 transition-all">
                                    Voir sur la carte
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Trust Signals & Transparency */}
                    <div className="flex flex-wrap gap-4 items-center px-2">
                        <TransparencyIndex
                            isVerified={practitioner.status === 'active'}
                            hasPhone={!!practitioner.phone_norm}
                            hasRegion={!!practitioner.region && practitioner.region !== 'unknown'}
                            hasCity={!!practitioner.city}
                            hasWebsite={!!practitioner.website}
                            hasPhoto={false}
                            hasDiploma={false}
                        />

                        {practitioner.is_verified ? (
                            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2 text-emerald-700 font-bold text-sm shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Profil vérifié
                            </div>
                        ) : practitioner.is_claimed ? (
                            <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full flex items-center gap-2 text-blue-700 font-bold text-sm shadow-sm">
                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                Profil revendiqué
                            </div>
                        ) : (
                            <div className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-full flex items-center gap-2 text-neutral-500 font-bold text-sm shadow-sm">
                                <Info className="w-4 h-4 text-neutral-400" />
                                Informations publiques
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Présentation */}
                            <section className="bg-white p-8 rounded-[32px] shadow-card-rest space-y-6 border border-transparent hover:border-neutral-100 transition-colors">
                                <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary/20 rounded-full"></span>
                                    À propos
                                </h2>
                                <div className="prose prose-neutral max-w-none text-lg text-neutral-charcoal/80 leading-relaxed font-light">
                                    <p>
                                        <strong className="text-primary font-semibold">{config.whoIsIt(practitioner.name)}</strong>.
                                    </p>
                                    <p>{config.roleDescription}</p>
                                    <p>
                                        Sa zone d’intervention couvre principalement <span className="font-medium text-neutral-800">{regionPhrase}</span>.
                                    </p>
                                </div>
                            </section>

                            {/* Quand Consulter */}
                            <section className="bg-white rounded-[32px] p-8 border border-neutral-100 space-y-6 shadow-sm">
                                <h2 className="text-xl font-bold text-primary">{config.whenToConsultTitle}</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {config.whenToConsultPoints.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-neutral-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm text-neutral-500 italic border-t border-neutral-100 pt-4 mt-2">
                                    Les interventions sont réalisées dans le respect du bien-être animal. En cas d'urgence vitale, contactez toujours votre vétérinaire.
                                </p>
                            </section>

                            {/* Déroulement / Etapes */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-primary/40" />
                                    {config.stepsTitle}
                                </h2>
                                <div className="space-y-6 relative border-l-2 border-neutral-200 ml-3 pl-8 py-2">
                                    {config.steps.map((step, i) => (
                                        <div key={i} className="relative">
                                            <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 shadow-sm ${i === 0 ? 'border-primary' : i === 1 ? 'border-primary/60' : 'border-primary/30'}`} />
                                            <h3 className="font-bold text-lg text-neutral-800 mb-2">{step.title}</h3>
                                            <p className="text-neutral-600">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Zone Geo */}
                            {displayRegion && (
                                <section className="bg-neutral-900 text-white rounded-[24px] p-8 space-y-6">
                                    <h2 className="text-xl font-bold text-white">Zone d’intervention</h2>
                                    <p className="text-neutral-300 leading-relaxed">
                                        <strong className="text-white">{practitioner.name}</strong> intervient principalement en {displayRegion}.
                                    </p>
                                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                        <span className="font-medium text-emerald-50">Secteur : {displayRegion}</span>
                                    </div>
                                    <p className="text-sm text-neutral-400 italic">
                                        Sur devis pour les secteurs limitrophes ou tournées spécifiques.
                                    </p>
                                </section>
                            )}

                            {/* FAQ */}
                            {config.faq.length > 0 && (
                                <section className="space-y-8">
                                    <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                        <HelpCircle className="w-6 h-6 text-primary/40" />
                                        Questions fréquentes
                                    </h2>
                                    <div className="grid gap-4">
                                        {config.faq.map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                                <h3 className="font-bold text-neutral-800 mb-2">{item.q}</h3>
                                                <p className="text-neutral-600">{item.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                        </div>

                        {/* Sidebar Right */}
                        <div className="space-y-8">
                            {/* Informations Pratiques Box */}
                            <section className="bg-white p-8 rounded-[32px] border border-transparent shadow-card-rest space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <Info className="w-24 h-24 text-primary" />
                                </div>
                                <h2 className="font-bold text-primary text-lg relative z-10">Informations pratiques</h2>
                                <div className="space-y-5 text-sm relative z-10">
                                    <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-colors -mx-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-neutral-400 text-xs uppercase tracking-wider font-bold mb-0.5">Mode d'intervention</span>
                                            <span className="font-semibold text-neutral-800 text-base">À domicile / Écurie</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-colors -mx-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                            <Info className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-neutral-400 text-xs uppercase tracking-wider font-bold mb-0.5">Espèces</span>
                                            <span className="font-semibold text-neutral-800 text-base">Équin</span>
                                        </div>
                                    </div>

                                    {practitioner.website && (
                                        <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-colors -mx-3">
                                            <div className="mt-1 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="block text-neutral-400 text-xs uppercase tracking-wider font-bold mb-0.5">Site web</span>
                                                <a
                                                    href={practitioner.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => trackWebsiteClick(practitioner.id, practitioner.website!)}
                                                    className="text-primary hover:underline hover:text-emerald-700 transition-colors font-semibold text-base break-all block truncate"
                                                >
                                                    Voir le site
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Transparence Box */}
                            <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100 space-y-4">
                                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide">Transparence Equivio</h3>
                                <p className="text-sm text-blue-800/80 leading-relaxed">
                                    Cette fiche a été générée à partir de données publiques. Equivio ne classe pas les praticiens et ne vend pas de visibilité.
                                </p>
                            </div>

                            <TrackPractitioner practitioner={{
                                id: practitioner.id,
                                specialty: practitioner.specialty,
                                region: practitioner.region,
                                city: practitioner.city
                            }} />

                            {/* ... */}

                            {/* Claim CTA (Strictly with PID) */}
                            {!practitioner.is_claimed && (
                                <div className="bg-white p-6 rounded-[24px] border border-neutral-100 text-center space-y-4 shadow-sm">
                                    <p className="font-bold text-neutral-800">Vous êtes ce praticien ?</p>
                                    <div className="text-sm text-neutral-500 text-left space-y-2">
                                        <p>Si vous êtes <strong>{practitioner.name}</strong>, revendiquez cette fiche pour la mettre à jour.</p>
                                    </div>
                                    <ClaimButton
                                        practitionerId={practitioner.id}
                                        specialty={practitioner.specialty}
                                    />
                                    <p className="text-xs text-neutral-400 mt-4 leading-normal">
                                        Gratuit & sans engagement.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
