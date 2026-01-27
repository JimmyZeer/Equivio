import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TransparencySeal } from "@/components/TransparencySeal";
import { ClaimForm } from "@/components/ClaimForm";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Revendiquer votre fiche professionnelle | Equivio",
    description: "Vous êtes praticien ? Confirmez votre identité et précisez votre zone d'exercice sur Equivio.",
};

export default function ClaimPage() {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />

            <main className="flex-grow bg-neutral-offwhite py-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-6">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                            Revendiquer votre fiche professionnelle
                        </h1>
                        <p className="text-lg text-neutral-charcoal/80 leading-relaxed max-w-2xl mx-auto">
                            Vous êtes le praticien concerné par cette fiche ?<br className="hidden sm:block" />
                            Vous pouvez confirmer votre identité et préciser vos informations professionnelles, notamment votre zone d'exercice.
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl border border-neutral-stone/60 shadow-xl overflow-hidden">
                        <div className="p-8 md:p-10">
                            <ClaimForm />
                        </div>

                        {/* Transparency Block inside the card or below? Prompt says "Bloc Transparence (Inchangé) Toujours afficher" */}
                        {/* Prompt structure implies it's a section "Comment fonctionne..." */}
                        <div className="bg-neutral-offwhite/50 border-t border-neutral-stone/40 p-8 space-y-4">
                            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Comment fonctionne la revendication ?</h3>
                            <ul className="space-y-3 text-sm text-neutral-charcoal/70">
                                <li className="flex gap-2">
                                    <span className="text-primary/60">•</span>
                                    La demande est étudiée manuellement par l’équipe Equivio
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary/60">•</span>
                                    Les informations fournies ne sont pas publiées sans validation
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary/60">•</span>
                                    La revendication n’implique aucun engagement commercial
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary/60">•</span>
                                    Equivio ne vend pas la visibilité des praticiens
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
