import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailCaptureForm } from "@/components/carnet/EmailCaptureForm";
import {
    BellRing,
    Calendar,
    FileText,
    Share2,
    ShieldCheck,
    Sparkles,
    Heart,
    AlertCircle,
    History,
    ArrowRight,
    CheckCircle2,
    Smartphone,
    WifiOff,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Le carnet de santé numérique de ton cheval — Equivio",
    description:
        "Tous les soins de ton cheval réunis dans une seule app mobile : vaccins, vermifuges, ferrures, ostéo, dentiste. Rappels intelligents, historique partageable, fonctionne hors-ligne dans ton écurie. Inscris-toi à l'accès anticipé.",
    alternates: {
        canonical: "https://equivio.fr/carnet",
    },
    openGraph: {
        title: "Le carnet de santé numérique de ton cheval",
        description:
            "Vaccins, vermifuges, ferrures, ostéo : tout au même endroit, dans ta poche, même sans réseau à l'écurie.",
        url: "https://equivio.fr/carnet",
        type: "website",
    },
    robots: { index: true, follow: true },
};

const PROBLEMS = [
    {
        icon: AlertCircle,
        title: "Le livret papier qui se perd",
        body: "SIRE, vaccins, ordonnances : 5 documents éparpillés, illisibles, jamais à jour quand le véto te le demande.",
    },
    {
        icon: BellRing,
        title: "Les rappels qui passent à la trappe",
        body: "Vermifuge en retard de 3 mois, vaccin grippe oublié, dentiste qu'on n'a pas vu depuis 2 ans : on ne s'en rend compte qu'au pire moment.",
    },
    {
        icon: History,
        title: "L'historique qui disparaît",
        body: "Quand tu changes d'écurie ou que tu vends ton cheval, l'historique des soins reste dans la tête de l'ancien proprio. Plus jamais.",
    },
];

const FEATURES = [
    {
        icon: FileText,
        title: "Tous les soins, un seul carnet",
        body: "Vaccins, vermifuges, ferrures, ostéo, dentiste, parage, visites véto. Avec photos d'ordonnances et factures.",
    },
    {
        icon: BellRing,
        title: "Rappels intelligents",
        body: "On connaît les protocoles (grippe/tétanos tous les 6 mois, vermifuge selon coproscopie). Tu reçois la bonne notification au bon moment.",
    },
    {
        icon: Share2,
        title: "Partage en 1 tap",
        body: "Envoie l'historique complet à ton véto, à l'acheteur, à l'écurie de pension. PDF propre, prêt à imprimer.",
    },
    {
        icon: WifiOff,
        title: "Marche sans réseau",
        body: "Saisie offline-first. Tu notes la ferrure dans le manège sans 4G, ça se synchronise dès que tu sors.",
    },
    {
        icon: Calendar,
        title: "Carnet sanitaire FFE export",
        body: "Génère le carnet sanitaire conforme pour les concours et compétitions, en PDF, sans recopier à la main.",
    },
    {
        icon: Smartphone,
        title: "100% mobile",
        body: "Pensé pour la poche, à une main, dans la poussière de l'écurie. Pas un site qu'on bricole sur ordi.",
    },
];

const FAQ = [
    {
        q: "C'est gratuit ?",
        a: "Pour 1 cheval avec les fonctions de base : oui, totalement gratuit. Si tu en as plusieurs ou si tu veux les rappels SMS, l'export PDF concours et le partage avec ton écurie, ce sera 4,99 €/mois ou 49 €/an au lancement.",
    },
    {
        q: "C'est dispo quand ?",
        a: "On construit le MVP. En t'inscrivant en accès anticipé, tu recevras une invitation prioritaire avant l'ouverture publique, prévue dans les prochains mois. Tu auras aussi 3 mois Premium offerts si tu fais partie des 100 premiers inscrits.",
    },
    {
        q: "Et mes données ?",
        a: "Hébergement européen (Cloudflare + Supabase EU), conformité RGPD, export complet sur demande, suppression en 1 clic. Tes données t'appartiennent : à aucun moment on ne les vend ou on ne les partage avec des partenaires.",
    },
    {
        q: "Mon ostéo / véto pourra l'utiliser aussi ?",
        a: "Oui. Les pros auront leur propre espace pour ajouter directement leurs comptes-rendus de visite sur la fiche du cheval, après que tu les aies autorisés. Plus de papier, plus d'oubli, plus de retranscription.",
    },
    {
        q: "Pourquoi Equivio fait ça ?",
        a: "On a démarré avec l'annuaire des praticiens équins. En discutant avec proprios et pros, le vrai pain point qui revient c'est : il manque un endroit unique pour suivre la santé d'un cheval. Le carnet, c'est la suite logique.",
    },
];

export default function CarnetLandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-offwhite">
            <Header />

            <main className="flex-grow pb-28 lg:pb-0">
                {/* Hero — mobile-first, vertical-centric, big touch targets */}
                <section className="relative overflow-hidden pt-10 pb-14 lg:pt-20 lg:pb-24 px-5 sm:px-6">
                    <div className="absolute -top-32 -left-20 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-gradient-to-br from-leather/15 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-3xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-card-rest border border-primary/20 reveal">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Accès anticipé
                            </span>
                        </div>

                        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.05] tracking-tight">
                            Tous les soins de ton cheval,
                            <span className="block text-primary-soft mt-2">dans ta poche.</span>
                        </h1>

                        <p className="mt-5 text-lg sm:text-xl text-neutral-charcoal/70 leading-relaxed max-w-2xl">
                            Vaccins, vermifuges, ferrures, ostéo, dentiste : un seul carnet, des rappels
                            intelligents, et qui marche même sans réseau à l'écurie.
                        </p>

                        <div id="early-access" className="mt-8 lg:mt-10 scroll-mt-24">
                            <EmailCaptureForm placement="hero" />
                        </div>

                        <p className="mt-6 text-sm text-neutral-charcoal/50 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary-soft flex-shrink-0" />
                            Les 100 premiers inscrits auront 3 mois Premium offerts au lancement.
                        </p>
                    </div>
                </section>

                {/* Problem section */}
                <section className="px-5 sm:px-6 py-14 lg:py-20 bg-white border-y border-neutral-stone/60">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-10 lg:mb-14">
                            <p className="text-xs font-bold text-leather uppercase tracking-[0.2em] mb-3">
                                Le quotidien d'un proprio
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                                Tu te reconnais ?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {PROBLEMS.map((p) => (
                                <div
                                    key={p.title}
                                    className="bg-neutral-offwhite rounded-2xl p-6 shadow-card-rest border border-neutral-stone/40"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-leather/10 flex items-center justify-center mb-4">
                                        <p.icon className="w-5 h-5 text-leather" />
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-2 leading-tight">
                                        {p.title}
                                    </h3>
                                    <p className="text-[15px] text-neutral-charcoal/70 leading-relaxed">
                                        {p.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features section */}
                <section className="px-5 sm:px-6 py-14 lg:py-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-10 lg:mb-14">
                            <p className="text-xs font-bold text-primary-soft uppercase tracking-[0.2em] mb-3">
                                Ce que tu vas pouvoir faire
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                                Le carnet pensé pour de vrais cavaliers
                            </h2>
                            <p className="mt-4 text-neutral-charcoal/70 max-w-2xl mx-auto text-base sm:text-lg">
                                Pas un Excel déguisé. Pensé mobile, pensé écurie, pensé pour la vraie vie d'un cheval.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    className="bg-white rounded-2xl p-6 shadow-card-rest border border-neutral-stone/40 hover-lift hover:shadow-card-hover"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <f.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-2 leading-tight">
                                        {f.title}
                                    </h3>
                                    <p className="text-[15px] text-neutral-charcoal/70 leading-relaxed">
                                        {f.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* For who — split owner / pro */}
                <section className="px-5 sm:px-6 py-14 lg:py-20 bg-leather-light/40 border-y border-neutral-stone/60">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                                Tu es...
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card-rest border border-neutral-stone/40">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Heart className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary">Propriétaire</h3>
                                </div>
                                <ul className="space-y-3 text-[15px] text-neutral-charcoal/80">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Suivi complet de chaque cheval, du poulain au retraité.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Rappels personnalisés par cheval (vaccin, vermifuge, ferrure).</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Partage du carnet avec écurie, demi-pension, acheteur.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Export carnet sanitaire FFE pour les concours.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card-rest border border-neutral-stone/40">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-leather/15 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-leather" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary">Professionnel</h3>
                                </div>
                                <ul className="space-y-3 text-[15px] text-neutral-charcoal/80">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Saisie d'un compte-rendu en 30 secondes après la visite.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Base clients propre, agenda, rappels pour les chevaux suivis.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Profil pro visible sur l'annuaire Equivio (3 000+ visites/mois).</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Tu fais gagner du temps à tes clients, ils restent.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="px-5 sm:px-6 py-14 lg:py-20">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                                Questions fréquentes
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {FAQ.map((item) => (
                                <details
                                    key={item.q}
                                    className="group bg-white rounded-2xl border border-neutral-stone/50 shadow-card-rest overflow-hidden"
                                >
                                    <summary className="cursor-pointer list-none px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 min-h-[64px] press-effect">
                                        <span className="text-base sm:text-lg font-semibold text-primary leading-snug">
                                            {item.q}
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-primary-soft flex-shrink-0 transition-transform duration-300 group-open:rotate-90" />
                                    </summary>
                                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-[15px] text-neutral-charcoal/75 leading-relaxed">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="px-5 sm:px-6 py-14 lg:py-20 bg-gradient-to-b from-primary to-primary-soft text-white">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight !text-white">
                            Sois parmi les premiers à l'avoir.
                        </h2>
                        <p className="mt-4 text-white/80 text-base sm:text-lg">
                            On lance progressivement. Inscris-toi pour recevoir l'invitation et l'offre des 100 premiers.
                        </p>
                        <div className="mt-8 bg-white rounded-2xl p-5 sm:p-6 shadow-float">
                            <EmailCaptureForm placement="footer-cta" />
                        </div>
                        <p className="mt-6 text-sm text-white/60">
                            Tu cherches un praticien dès maintenant ?{" "}
                            <Link
                                href="/"
                                className="underline underline-offset-2 hover:text-white"
                            >
                                Va sur l'annuaire Equivio
                            </Link>
                        </p>
                    </div>
                </section>
            </main>

            {/* Mobile sticky CTA */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-stone shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.06)]">
                <a
                    href="#early-access"
                    className="flex items-center justify-center gap-2 bg-primary text-white font-semibold text-base mx-4 my-3 py-4 rounded-xl shadow-card-rest press-effect min-h-[52px]"
                >
                    Rejoindre l'accès anticipé
                    <ArrowRight className="w-5 h-5" />
                </a>
            </div>

            <Footer />
        </div>
    );
}
