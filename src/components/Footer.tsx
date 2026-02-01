import Link from "next/link";
import { TransparencySeal } from "./TransparencySeal";

export function Footer() {
    const regions = [
        "Normandie", "Bretagne", "Nouvelle-Aquitaine", "Pays de la Loire", "Hauts-de-France", "Grand Est", "Occitanie", "Auvergne-Rhône-Alpes"
    ];

    return (
        <footer className="bg-leather-light py-20 px-6 border-t border-neutral-stone/30 relative">
            <div className="absolute inset-0 bg-grain opacity-[0.01]"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 text-sm text-neutral-charcoal/80 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-bold text-[10px]">E</div>
                        <span className="text-lg font-bold text-primary tracking-tight">EQUIVIO</span>
                    </div>
                    <p className="leading-relaxed opacity-70">
                        Le réseau de confiance des praticiens équins. Basé exclusivement sur l’activité réelle enregistrée.
                    </p>
                    <TransparencySeal className="pt-4" />
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider">Par région</h4>
                    <ul className="grid grid-cols-2 gap-2">
                        {regions.map((region) => (
                            <li key={region}>
                                <Link href={`/regions/${region.toLowerCase()}`} className="hover:text-primary transition-colors">
                                    {region}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider">L’Institution</h4>
                    <ul className="space-y-2">
                        <li><Link href="/a-propos" className="hover:text-primary transition-colors">À propos</Link></li>
                        <li><Link href="/transparence" className="hover:text-primary transition-colors">Note de transparence</Link></li>
                        <li><a href="mailto:contact@equivio.fr" className="hover:text-primary transition-colors">contact@equivio.fr</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-primary mb-4 uppercase tracking-wider">Légal</h4>
                    <ul className="space-y-2">
                        <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link></li>
                        <li><Link href="/cgv" className="hover:text-primary transition-colors">CGV / CGU</Link></li>
                        <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-charcoal/10 text-center text-xs opacity-60">
                © {new Date().getFullYear()} Equivio.fr — Tous droits réservés.
            </div>
        </footer>
    );
}
