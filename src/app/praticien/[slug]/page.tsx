import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PhoneNumberReveal } from "@/components/PhoneNumberReveal";
import { TransparencyIndex } from "@/components/TransparencyIndex";
import { ContactButton } from "@/components/ContactButton";
import { ProfileFavoriteButton } from "@/components/ProfileFavoriteButton";
import { ShareButtons } from "@/components/ShareButtons";
import { LocalBusinessSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { MapPin, ShieldCheck, ExternalLink, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Link from "next/link";
import { OsteopathTemplate } from "@/components/templates/OsteopathTemplate";
import { DentistTemplate } from "@/components/templates/DentistTemplate";

function normalizeSpecialty(specialty: string) {
    if (specialty === "Ostéopathe animalier") return "Ostéopathe équin";
    if (specialty === "Dentisterie équine") return "Dentiste équin";
    return specialty;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { data: practitioner } = await supabase
        .from('practitioners')
        .select('name, specialty, city')
        .eq('slug_seo', resolvedParams.slug)
        .eq('status', 'active')
        .single();

    if (!practitioner) return { title: "Praticien non trouvé | Equivio" };

    const displaySpecialty = normalizeSpecialty(practitioner.specialty);

    return {
        title: `${practitioner.name}, ${displaySpecialty.toLowerCase()} à ${practitioner.city} | Equivio`,
        description: `Fiche professionnelle de ${practitioner.name}, ${displaySpecialty.toLowerCase()} exerçant à ${practitioner.city}. Coordonnées, zones d’intervention et informations vérifiées.`,
        alternates: {
            canonical: `/praticien/${resolvedParams.slug}`
        }
    };
}

export default async function PractitionerProfile({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    // Fetch practitioner details
    const { data: practitioner, error } = await supabase
        .from('practitioners')
        .select('*')
        .eq('slug_seo', resolvedParams.slug)
        .eq('status', 'active')
        .single();

    if (error || !practitioner) {
        notFound();
    }

    const displaySpecialty = normalizeSpecialty(practitioner.specialty);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${practitioner.address_full || practitioner.city}`)}`;

    if (displaySpecialty.toLowerCase().includes("ostéopathe")) {
        return <OsteopathTemplate practitioner={practitioner} />;
    }

    if (displaySpecialty.toLowerCase().includes("dentiste") || displaySpecialty.toLowerCase().includes("dentisterie")) {
        return <DentistTemplate practitioner={practitioner} />;
    }

    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Structured Data for SEO */}
            <LocalBusinessSchema
                name={practitioner.name}
                specialty={displaySpecialty}
                city={practitioner.city}
                region={practitioner.region}
                phone={practitioner.phone_norm}
                website={practitioner.website}
                slug={resolvedParams.slug}
                lat={practitioner.lat}
                lng={practitioner.lng}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Accueil", url: "https://equivio.fr" },
                    { name: "Praticiens", url: "https://equivio.fr/search" },
                    { name: practitioner.name, url: `https://equivio.fr/praticien/${resolvedParams.slug}` },
                ]}
            />

            <Header />

            <main className="flex-grow bg-[#F7F7F7] pt-8 sm:pt-12 pb-24 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto space-y-10">

                    {/* Bloc Identité (Above the fold) - Reskinned */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-10 bg-white p-8 sm:p-10 rounded-[32px] shadow-card-rest hover:shadow-card-hover transition-shadow duration-500 relative overflow-hidden">
                        {/* Decorative subtle header background */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-soft to-primary opacity-20" />

                        <div className="space-y-6 flex-1 relative z-10">
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
                                    {practitioner.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
                                    <span className="font-medium text-primary-soft bg-primary/5 px-3 py-1 rounded-full text-base">
                                        {displaySpecialty}
                                    </span>
                                    {practitioner.region && practitioner.region !== "unknown" && (
                                        <span className="text-neutral-500 flex items-center gap-1.5 text-base">
                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                                            {practitioner.region}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-neutral-charcoal/80 font-medium pt-2">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span className="text-lg">{practitioner.city || "Ville non renseignée"}</span>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <ShareButtons
                                    url={`/praticien/${resolvedParams.slug}`}
                                    title={`${practitioner.name} - ${displaySpecialty}`}
                                    description={`Découvrez ${practitioner.name}, ${displaySpecialty.toLowerCase()}${practitioner.city ? ` à ${practitioner.city}` : ''} sur Equivio`}
                                />
                                <div className="w-px h-6 bg-neutral-200" />
                                <div className="scale-110">
                                    <ProfileFavoriteButton practitionerId={practitioner.id} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-[280px] relative z-10 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100">
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1 mb-1">Contact</div>
                            {practitioner.phone_norm && (
                                <PhoneNumberReveal phoneNumber={practitioner.phone_norm} practitionerId={practitioner.id} />
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

                    {/* Bloc Statut & Confiance — With Transparency Index */}
                    <div className="flex flex-wrap gap-4 items-center px-2">
                        {/* Transparency Index Badge */}
                        <TransparencyIndex
                            isVerified={practitioner.status === 'active'}
                            hasPhone={!!practitioner.phone_norm}
                            hasRegion={!!practitioner.region && practitioner.region !== 'unknown'}
                            hasCity={!!practitioner.city}
                            hasWebsite={!!practitioner.website}
                            hasPhoto={false}
                            hasDiploma={false}
                        />

                        {/* Legacy badges for SEO/accessibility - Modernized containers */}
                        <div className="px-4 py-2 bg-white border border-primary/10 rounded-full flex items-center gap-2 text-primary font-bold text-sm shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            Profil vérifié
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                        <div className="md:col-span-2 space-y-8">
                            {/* Bloc Présentation (Facultatif mais recommandé) */}
                            <section className="bg-white p-8 rounded-[32px] shadow-card-rest space-y-6 border border-transparent hover:border-neutral-100 transition-colors">
                                <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary/20 rounded-full"></span>
                                    Présentation
                                </h2>
                                <p className="text-neutral-charcoal/80 leading-relaxed text-lg text-pretty font-light">
                                    <span className="font-medium text-primary">{practitioner.name}</span> est {displaySpecialty.toLowerCase()}{practitioner.region && practitioner.region !== "unknown" ? ` exerçant principalement en ${practitioner.region}` : ""}.
                                    Interventions possibles pour chevaux de sport et de loisir.
                                    {practitioner.city ? ` Basé à ${practitioner.city}.` : ""}
                                </p>
                            </section>

                            {/* Zones d'intervention - Only show if region is valid */}
                            {practitioner.region && practitioner.region !== "unknown" && (
                                <section className="bg-white p-8 rounded-[32px] shadow-card-rest space-y-6 border border-transparent hover:border-neutral-100 transition-colors">
                                    <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-3">
                                        <span className="w-8 h-1 bg-primary/20 rounded-full"></span>
                                        Zones d’intervention
                                    </h2>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <li className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 text-neutral-700 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                            {practitioner.region} (Principale)
                                        </li>
                                    </ul>
                                </section>
                            )}
                        </div>

                        <div className="space-y-8">
                            {/* Informations pratiques */}
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
                                                <a href={practitioner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline hover:text-emerald-700 transition-colors font-semibold text-base break-all block truncate">
                                                    Voir le site
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Claim CTA - Subtle */}
                            <div className="bg-transparent px-4 py-2 text-center opacity-60 hover:opacity-100 transition-opacity">
                                <p className="text-xs text-neutral-500 mb-2">Ce profil est le vôtre ?</p>
                                <Link href="/revendiquer" className="text-xs font-bold text-primary border-b border-primary/20 pb-0.5 hover:border-primary transition-colors">
                                    Modifier mes informations
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bloc Transparence (Signature Equivio) */}
                    <div className="border-t border-[#F0F0F0] pt-12 pb-8 text-center max-w-2xl mx-auto space-y-3">
                        <div className="w-8 h-1 bg-neutral-200 rounded-full mx-auto mb-4" />
                        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Transparence Equivio</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed max-w-lg mx-auto">
                            Cette fiche est issue de bases professionnelles publiques et d’un travail de recoupement manuel.
                            Equivio ne classe pas les praticiens, ne publie pas d’avis clients et n’influence pas leur visibilité.
                        </p>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
