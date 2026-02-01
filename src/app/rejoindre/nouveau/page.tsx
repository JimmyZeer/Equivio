'use client';

import { useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { submitListingRequest } from '../actions';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/Button";

const SPECIALTIES = [
    "Ostéopathe animalier",
    "Dentisterie équine",
    "Maréchal-ferrant",
    "Pareur",
    "Shiatsu",
    "Saddle fitter",
    "Bit fitter",
    "Nutritionniste",
    "Masseur",
    "Algothérapeute",
    "Naturophate",
    "Comportementaliste"
];

export default function NewListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = await submitListingRequest(formData);

        if (result.success) {
            setSuccess(true);
            window.scrollTo(0, 0);
        } else {
            setError(result.error || "Une erreur est survenue");
        }
        setLoading(false);
    }

    if (success) {
        return (
            <div className="flex flex-col min-h-screen bg-neutral-offwhite">
                <Header />
                <main className="flex-grow flex items-center justify-center p-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center space-y-6 border border-neutral-stone/20">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-charcoal">Demande envoyée !</h1>
                        <p className="text-neutral-charcoal/60">
                            Merci de votre intérêt. Notre équipe va vérifier vos informations.
                            Vous recevrez un email sous 48h pour finaliser votre inscription.
                        </p>
                        <div className="pt-4">
                            <Link href="/">
                                <Button className="w-full">Retour à l'accueil</Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-neutral-offwhite">
            <Header />

            <main className="flex-grow py-12 px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <Link href="/rejoindre" className="inline-flex items-center gap-2 text-sm text-neutral-charcoal/50 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </Link>

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-neutral-charcoal">Créer ma fiche</h1>
                        <p className="text-neutral-charcoal/60">
                            Remplissez ce formulaire pour apparaître dans l'annuaire Equivio.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-stone/20">
                        <form action={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-charcoal mb-2">Nom complet / Structure</label>
                                    <input
                                        name="name"
                                        required
                                        placeholder="Ex: Écurie Dupont / Jean Martin"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neutral-charcoal mb-2">Spécialité</label>
                                    <select
                                        name="specialty"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="">Choisir...</option>
                                        {SPECIALTIES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-charcoal mb-2">Ville principale</label>
                                        <input
                                            name="city"
                                            required
                                            placeholder="Ex: Lyon"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-charcoal mb-2">Téléphone</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            placeholder="06..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neutral-charcoal mb-2">Email de contact</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Pour recevoir la confirmation..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Cet email ne sera pas publié publiquement.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neutral-charcoal mb-2">Note (Facultatif)</label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        placeholder="Site web, informations complémentaires..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-base font-bold bg-primary hover:bg-primary-dark transition-all press-effect"
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Envoyer la demande
                            </Button>

                            <p className="text-center text-xs text-gray-400">
                                En envoyant ce formulaire, vous acceptez que nous vérifiions l'existence de votre activité.
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
