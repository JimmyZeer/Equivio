import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function PractitionerUnavailable() {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-[#F7F7F7]">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 py-20">
                <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-[32px] shadow-card-rest border border-neutral-100">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                        <Search className="w-10 h-10" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-primary">Profil indisponible</h1>
                        <p className="text-neutral-charcoal/70 leading-relaxed">
                            Ce profil n’est plus accessible sur Equivio. Il est possible que le praticien ait cessé son activité ou que la fiche ait été retirée.
                        </p>
                    </div>
                    <Link href="/search" className="block">
                        <Button className="w-full py-4 text-base font-bold shadow-lg shadow-primary/20">
                            Rechercher un autre praticien
                        </Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
