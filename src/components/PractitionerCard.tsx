import Link from "next/link";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { MapPin, Calendar, Activity } from "lucide-react";

interface PractitionerCardProps {
    name: string;
    specialty: string;
    city: string;
    isClaimed?: boolean;
    isVerified?: boolean;
    interventionCount: number;
    lastIntervention: string;
    slug_seo: string;
}

export function PractitionerCard({
    name,
    specialty,
    city,
    isClaimed,
    isVerified,
    interventionCount,
    lastIntervention,
    slug_seo
}: PractitionerCardProps) {
    return (
        <div className="bg-white rounded-xl border border-neutral-stone/60 p-5 md:p-8 hover:shadow-premium-hover hover:border-primary-soft/20 hover:translate-y-[-2px] transition-soft group shadow-premium ring-0 hover:ring-1 hover:ring-primary-soft/5">
            <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight group-hover:text-primary-soft transition-colors duration-300">{name}</h3>
                        <div className="flex gap-2">
                            {isClaimed && <Badge variant="claimed">Profil revendiqué</Badge>}
                            {isVerified && <Badge variant="verified">Profil vérifié</Badge>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-bold text-neutral-charcoal">{specialty}</span>
                        <div className="flex items-center gap-2 text-neutral-charcoal/50">
                            <MapPin className="w-4 h-4 text-primary-soft/60" strokeWidth={1.5} />
                            <span className="font-medium">{city}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-center gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-neutral-stone/20 pt-5 md:pt-0 md:pl-8 mt-2 md:mt-0">
                    <div className="flex items-center gap-2.5 text-primary font-bold">
                        <Activity className="w-4 h-4 text-primary-soft" strokeWidth={2} />
                        <span className="text-base">{interventionCount} interventions</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] text-neutral-charcoal/40 uppercase font-bold tracking-[0.1em]">
                        <Calendar className="w-4 h-4 opacity-50" strokeWidth={1.5} />
                        <span>Activité : {lastIntervention}</span>
                    </div>
                </div>
            </div>
            <Link href={`/praticien/${slug_seo}`} className="w-full mt-2">
                <Button variant="outline" className="w-full py-2 hover:bg-primary hover:border-primary">Voir le profil</Button>
            </Link>
        </div>
    );
}
