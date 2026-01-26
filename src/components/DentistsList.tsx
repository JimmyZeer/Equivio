import { MapPin, Phone, Globe, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Practitioner {
    id: string;
    name: string;
    specialty: string;
    city?: string | null;
    address_full?: string | null;
    phone_norm?: string | null;
    website?: string | null;
    profile_url?: string | null;
    quality_score?: number | null;
    slug?: string | null; // fallbacks to slug_seo if needed
    slug_seo?: string | null;
}

interface DentistsListProps {
    practitioners: Practitioner[];
    error?: any;
}

export function DentistsList({ practitioners, error }: DentistsListProps) {
    if (error) {
        return (
            <div className="bg-red-50 p-8 rounded-xl border border-red-200 text-center text-red-800 flex flex-col items-center gap-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <p>Une erreur est survenue lors du chargement des dentistes. Veuillez réessayer.</p>
            </div>
        );
    }

    if (!practitioners || practitioners.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl border border-dashed border-neutral-stone/40 text-center text-neutral-charcoal/40 italic">
                Aucun dentiste équin trouvé pour le moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {practitioners.map((p) => {
                const address = p.address_full || p.city || "Adresse non renseignée";
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${address}`)}`;
                // Use profile_url if available, else standard internal link
                const profileLink = p.profile_url || (p.slug || p.slug_seo ? `/praticien/${p.slug || p.slug_seo}` : null);

                return (
                    <div
                        key={p.id}
                        className="bg-white rounded-xl border border-neutral-stone/60 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            {/* Main Info */}
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-xl font-bold text-primary mb-1">{p.name}</h3>
                                    <p className="text-sm font-medium text-neutral-charcoal/60">{p.specialty}</p>
                                </div>

                                <div className="space-y-2 text-sm text-neutral-charcoal/80">
                                    {/* Address */}
                                    {(p.address_full || p.city) && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                                            <div>
                                                <span className="block">{p.address_full || p.city}</span>
                                                <a
                                                    href={mapsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary text-xs hover:underline flex items-center gap-1 mt-1"
                                                >
                                                    Voir sur Google Maps <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {p.phone_norm && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-primary shrink-0" />
                                            <a href={`tel:${p.phone_norm}`} className="hover:text-primary transition-colors">
                                                {p.phone_norm}
                                            </a>
                                        </div>
                                    )}

                                    {/* Website */}
                                    {p.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-primary shrink-0" />
                                            <a
                                                href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary transition-colors truncate max-w-[250px]"
                                            >
                                                {p.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions / Score */}
                            <div className="flex flex-col gap-3 md:items-end justify-between border-t md:border-t-0 md:border-l border-neutral-stone/20 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                                {p.quality_score !== undefined && p.quality_score !== null && (
                                    <div className="text-xs font-mono text-neutral-charcoal/40 self-end" title="Quality Score">
                                        QS: {p.quality_score}
                                    </div>
                                )}

                                <div className="mt-auto w-full md:w-auto">
                                    {profileLink ? (
                                        <Link href={profileLink} className="block w-full">
                                            <Button className="w-full">Voir le profil</Button>
                                        </Link>
                                    ) : (
                                        <Button disabled variant="outline" className="w-full opacity-50">Profil indisponible</Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
