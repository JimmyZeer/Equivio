import Link from "next/link";
import { Button } from "./ui/Button";

export function Header() {
    return (
        <header className="bg-white border-b border-neutral-stone sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold group-hover:bg-primary-soft transition-colors text-sm">E</div>
                    <span className="text-xl font-bold text-primary tracking-tight">EQUIVIO</span>
                </Link>
                <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-neutral-charcoal/40 uppercase tracking-[0.12em]">
                    <Link href="/praticiens/osteopathes" className="hover:text-primary transition-colors">Ostéopathes</Link>
                    <Link href="/praticiens/marechaux" className="hover:text-primary transition-colors">Maréchaux</Link>
                    <Link href="/praticiens/dentistes" className="hover:text-primary transition-colors">Dentistes</Link>
                    <Link href="/praticiens/veterinaires" className="hover:text-primary transition-colors">Vétérinaires</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/revendiquer">
                        <Button variant="outline" className="hidden sm:inline-flex">Revendiquer ma fiche</Button>
                    </Link>
                    <Button>Rechercher</Button>
                </div>
            </div>
        </header>
    );
}
