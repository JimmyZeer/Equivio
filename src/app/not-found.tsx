import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow flex items-center justify-center px-6 py-20">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    {/* Decorative 404 */}
                    <div className="relative">
                        <h1 className="text-[180px] md:text-[240px] font-black text-primary/5 leading-none select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl md:text-8xl animate-float">🐴</div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-primary">
                            Cette page a pris le galop...
                        </h2>
                        <p className="text-neutral-charcoal/60 text-lg max-w-md mx-auto">
                            La page que vous recherchez n'existe pas ou a été déplacée.
                            Pas d'inquiétude, retrouvez votre chemin ci-dessous.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-soft transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            <Home className="w-5 h-5" />
                            Retour à l'accueil
                        </Link>
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary/20 text-primary font-semibold rounded-xl hover:bg-primary/5 transition-all"
                        >
                            <Search className="w-5 h-5" />
                            Rechercher un praticien
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
