import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PhoneNumberReveal } from "@/components/PhoneNumberReveal";
import { TransparencyIndex } from "@/components/TransparencyIndex";
import { ContactButton } from "@/components/ContactButton";
import { ProfileFavoriteButton } from "@/components/ProfileFavoriteButton";
import { LocalBusinessSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { MapPin, ShieldCheck, ExternalLink, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Link from "next/link";

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

            <main className="flex-grow bg-neutral-offwhite pt-6 sm:pt-8 pb-24 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Bloc Identité (Above the fold) */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-5 sm:gap-8 bg-white p-5 sm:p-8 rounded-2xl border border-neutral-stone/60 shadow-sm">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight leading-tight">
                                    {practitioner.name} <span className="hidden sm:inline text-neutral-charcoal/40 font-light">–</span> <br className="sm:hidden" /><span className="text-primary-soft">{displaySpecialty}</span>
                                </h1>
                                <ProfileFavoriteButton practitionerId={practitioner.id} />
                            </div>
                            <div className="flex items-center gap-2 text-lg text-neutral-charcoal font-medium">
                                <MapPin className="w-5 h-5 text-neutral-charcoal/50" />
                                {practitioner.city || "Ville non renseignée"}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto md:min-w-[200px]">
                            {practitioner.phone_norm && (
                                <PhoneNumberReveal phoneNumber={practitioner.phone_norm} practitionerId={practitioner.id} />
                            )}
                            <ContactButton
                                practitionerId={practitioner.id}
                                practitionerName={practitioner.name}
                                className="w-full justify-center"
                            />
                            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button variant="outline" className="w-full justify-center">Voir sur la carte</Button>
                            </a>
                        </div>
                    </div>

                    {/* Bloc Statut & Confiance — With Transparency Index */}
                    <div className="flex flex-wrap gap-4 items-center">
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

                        {/* Legacy badges for SEO/accessibility */}
                        <div className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-full flex items-center gap-2 text-primary font-bold text-sm">
                            <ShieldCheck className="w-4 h-4" />
                            Profil vérifié
                        </div>
                        {practitioner.region && practitioner.region !== 'unknown' && (
                            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-2 text-emerald-700 font-bold text-sm">
                                <MapPin className="w-4 h-4" />
                                Présence terrain confirmée
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-12">
                            {/* Bloc Présentation (Facultatif mais recommandé) */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-primary border-b border-neutral-stone pb-2">Présentation</h2>
                                <p className="text-neutral-charcoal/80 leading-relaxed text-pretty">
                                    {displaySpecialty}{practitioner.region && practitioner.region !== "unknown" ? ` exerçant principalement en ${practitioner.region}` : ""}.
                                    Interventions possibles pour chevaux de sport et de loisir.
                                    {practitioner.city ? ` Basé à ${practitioner.city}.` : ""}
                                </p>
                            </section>

                            {/* Zones d'intervention - Only show if region is valid */}
                            {practitioner.region && practitioner.region !== "unknown" && (
                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-primary border-b border-neutral-stone pb-2">Zones d’intervention</h2>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-charcoal/80">
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                            {practitioner.region} (Principale)
                                        </li>
                                        {/* Future: Add list of departments if available */}
                                    </ul>
                                </section>
                            )}
                        </div>

                        <div className="space-y-8">
                            {/* Informations pratiques */}
                            <section className="bg-white p-6 rounded-xl border border-neutral-stone/60 shadow-sm space-y-6">
                                <h2 className="font-bold text-primary text-lg">Informations pratiques</h2>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <span className="block text-neutral-charcoal/50 text-xs uppercase tracking-wider font-bold mb-1">Mode d'intervention</span>
                                        <span className="font-medium">À domicile / Écurie</span>
                                    </div>
                                    <div>
                                        <span className="block text-neutral-charcoal/50 text-xs uppercase tracking-wider font-bold mb-1">Espèces</span>
                                        <span className="font-medium">Équin</span>
                                    </div>
                                    {practitioner.website && (
                                        <div>
                                            <span className="block text-neutral-charcoal/50 text-xs uppercase tracking-wider font-bold mb-1">Site web</span>
                                            <a href={practitioner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5 font-medium break-all">
                                                Voir le site <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Claim CTA - Subtle */}
                            <div className="bg-neutral-offwhite p-4 rounded-xl border border-dashed border-neutral-stone text-center">
                                <p className="text-xs text-neutral-charcoal/60 mb-3">Ce profil est le vôtre ?</p>
                                <Link href="/revendiquer">
                                    <Button variant="outline" className="w-full text-xs h-8 border-transparent hover:bg-neutral-stone/20 hover:text-primary hover:border-transparent text-neutral-charcoal/60">Modifier mes informations</Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bloc Transparence (Signature Equivio) */}
                    <div className="border-t border-neutral-stone pt-8 text-center max-w-2xl mx-auto space-y-2">
                        <h3 className="text-xs font-bold text-neutral-charcoal/40 uppercase tracking-widest">Transparence Equivio</h3>
                        <p className="text-xs text-neutral-charcoal/40 leading-relaxed max-w-lg mx-auto">
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
