"use client";

import Link from "next/link";
import { Button } from "./ui/Button";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleSearchClick = () => {
        if (pathname === "/") {
            // On homepage: scroll to search section
            document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
        } else {
            // On other pages: navigate to homepage with hash
            router.push("/#search-section");
        }
    };

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
                    <Link href="/revendiquer" className="hidden sm:inline-flex">
                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all">
                            Revendiquer ma fiche
                        </Button>
                    </Link>
                    <Button onClick={handleSearchClick} className="hidden sm:inline-flex gap-2">
                        <Search className="w-4 h-4" />
                        Rechercher
                    </Button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-primary hover:bg-neutral-offwhite rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-neutral-stone animate-reveal z-40">
                    <nav className="flex flex-col p-6 space-y-4">
                        <Link href="/praticiens/osteopathes" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-2 border-b border-neutral-stone/10">Ostéopathes</Link>
                        <Link href="/praticiens/marechaux" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-2 border-b border-neutral-stone/10">Maréchaux</Link>
                        <Link href="/praticiens/dentistes" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-2 border-b border-neutral-stone/10">Dentistes</Link>
                        <Link href="/praticiens/veterinaires" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-2 border-b border-neutral-stone/10">Vétérinaires</Link>
                        <div className="pt-4 flex flex-col gap-4">
                            <Link href="/revendiquer" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" className="w-full">Revendiquer ma fiche</Button>
                            </Link>
                            <Button onClick={() => { setIsMenuOpen(false); handleSearchClick(); }} className="w-full gap-2">
                                <Search className="w-4 h-4" />
                                Rechercher
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
