"use client";

import Link from "next/link";
import Image from "next/image";
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
            document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push("/#search-section");
        }
    };

    return (
        <>
            <header className="bg-white/95 backdrop-blur-md border-b border-neutral-stone sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/images/logo.png"
                            alt="Equivio"
                            width={160}
                            height={40}
                            className="h-9 w-auto group-hover:opacity-80 transition-opacity"
                            priority
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-neutral-charcoal/40 uppercase tracking-[0.12em]">
                        <Link href="/praticiens/osteopathes" className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Ostéopathes</Link>
                        <Link href="/praticiens/marechaux" className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Maréchaux</Link>
                        <Link href="/praticiens/dentistes" className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Dentistes</Link>
                        <Link href="/praticiens/veterinaires" className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Vétérinaires</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/revendiquer" className="hidden sm:inline-flex">
                            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all press-effect">
                                Revendiquer ma fiche
                            </Button>
                        </Link>
                        <Button onClick={handleSearchClick} className="hidden sm:inline-flex gap-2 press-effect">
                            <Search className="w-4 h-4" />
                            Rechercher
                        </Button>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-primary hover:bg-neutral-offwhite rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-6">
                                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                                <X className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay with backdrop */}
            <div
                className={`md:hidden fixed inset-0 bg-neutral-charcoal/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div className={`md:hidden fixed top-20 left-0 right-0 bg-white border-b border-neutral-stone z-50 transition-all duration-300 ease-out ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                <nav className="flex flex-col p-6 space-y-4">
                    <Link href="/praticiens/osteopathes" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-3 border-b border-neutral-stone/10 active:bg-neutral-offwhite transition-colors">Ostéopathes</Link>
                    <Link href="/praticiens/marechaux" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-3 border-b border-neutral-stone/10 active:bg-neutral-offwhite transition-colors">Maréchaux</Link>
                    <Link href="/praticiens/dentistes" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-3 border-b border-neutral-stone/10 active:bg-neutral-offwhite transition-colors">Dentistes</Link>
                    <Link href="/praticiens/veterinaires" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-primary py-3 border-b border-neutral-stone/10 active:bg-neutral-offwhite transition-colors">Vétérinaires</Link>
                    <div className="pt-4 flex flex-col gap-4">
                        <Link href="/revendiquer" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full py-6 text-base">Revendiquer ma fiche</Button>
                        </Link>
                        <Button onClick={() => { setIsMenuOpen(false); handleSearchClick(); }} className="w-full gap-2 py-6 text-base">
                            <Search className="w-5 h-5" />
                            Rechercher
                        </Button>
                    </div>
                </nav>
            </div>
        </>
    );
}

