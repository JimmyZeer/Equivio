import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailCaptureForm } from "@/components/carnet/EmailCaptureForm";
import { AppMockup, AppMockupTrio, MockupSparkles } from "@/components/carnet/AppMockup";
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
    Lock,
    Globe,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Equivio — Le carnet de santé numérique de ton cheval",
    description:
        "Tous les soins de ton cheval réunis dans une seule app mobile : vaccins, vermifuges, ferrures, ostéo, dentiste. Rappels intelligents, historique partageable, fonctionne hors-ligne dans ton écurie. Inscris-toi à l'accès anticipé.",
    alternates: {
        canonical: "https://equivio.fr/",
    },
    openGraph: {
        title: "Equivio — Le carnet de santé numérique de ton cheval",
        description:
            "Vaccins, vermifuges, ferrures, ostéo : tout au même endroit, dans ta poche, même sans réseau à l'écurie.",
        url: "https://equivio.fr/",
        type: "website",
    },
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
        accent: "primary" as const,
    },
    {
        icon: BellRing,
        title: "Rappels intelligents",
        body: "On connaît les protocoles (grippe/tétanos tous les 6 mois, vermifuge selon coproscopie). Tu reçois la bonne notification au bon moment.",
        accent: "leather" as const,
    },
    {
        icon: Share2,
        title: "Partage en 1 tap",
        body: "Envoie l'historique complet à ton véto, à l'acheteur, à l'écurie de pension. PDF propre, prêt à imprimer.",
        accent: "primary" as const,
    },
    {
        icon: WifiOff,
        title: "Marche sans réseau",
        body: "Saisie offline-first. Tu notes la ferrure dans le manège sans 4G, ça se synchronise dès que tu sors.",
        accent: "leather" as const,
    },
    {
        icon: Calendar,
        title: "Carnet sanitaire FFE export",
        body: "Génère le carnet sanitaire conforme pour les concours et compétitions, en PDF, sans recopier à la main.",
        accent: "primary" as const,
    },
    {
        icon: Smartphone,
        title: "100% mobile",
        body: "Pensé pour la poche, à une main, dans la poussière de l'écurie. Pas un site qu'on bricole sur ordi.",
        accent: "leather" as const,
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
        q: "Je cherche juste un praticien équin, c'est encore possible ?",
        a: "Bien sûr. L'annuaire Equivio est toujours là : ostéopathes, dentistes, maréchaux référencés par région et spécialité. C'est notre point de départ et il continue de vivre.",
    },
];

const TRUST_BADGES = [
    { icon: Lock, label: "RGPD" },
    { icon: Globe, label: "Hébergement EU" },
    { icon: ShieldCheck, label: "Données chiffrées" },
    { icon: Heart, label: "Made in France" },
];

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-offwhite">
            <Header />

            <main className="flex-grow pb-28 lg:pb-0">
                {/* ========================== HERO ========================== */}
                <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-28 px-5 sm:px-6 bg-gradient-to-b from-white via-neutral-offwhite to-neutral-offwhite">
                    {/* Background ambience */}
                    <div className="absolute -top-40 -left-32 w-[28rem] h-[28rem] bg-gradient-to-br from-primary/12 via-primary/4 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-20 -right-24 w-[24rem] h-[24rem] bg-gradient-to-br from-leather/15 via-leather/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 w-[20rem] h-[20rem] bg-gradient-to-br from-primary-soft/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-16 items-center">
                            {/* === Left: text + form === */}
                            <div className="max-w-xl mx-auto lg:mx-0 w-full">
                                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm pl-2 pr-3.5 py-1.5 rounded-full shadow-card-rest border border-primary/15 reveal">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <span className="text-[11px] font-bold text-primary uppercase tracking-[0.18em]">
                                        Accès anticipé · Bientôt sur iOS & Android
                                    </span>
                                </div>

                                <h1 className="mt-7 text-[2.5rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold text-primary leading-[1.02] tracking-[-0.025em]">
                                    Tous les soins<br className="hidden sm:block" /> de ton cheval,
                                    <span className="block bg-gradient-to-r from-primary-soft via-primary to-leather bg-clip-text text-transparent mt-2">
                                        dans ta poche.
                                    </span>
                                </h1>

                                <p className="mt-6 text-lg sm:text-xl text-neutral-charcoal/70 leading-relaxed max-w-xl">
                                    Vaccins, vermifuges, ferrures, ostéo, dentiste : un seul carnet, des rappels
                                    intelligents, et qui marche même sans réseau à l'écurie.
                                </p>

                                <div id="early-access" className="mt-8 lg:mt-10 scroll-mt-24">
                                    <EmailCaptureForm placement="hero" />
                                </div>

                                <div className="mt-6 space-y-3">
                                    <p className="text-sm text-neutral-charcoal/55 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary-soft flex-shrink-0" />
                                        Les 100 premiers inscrits auront 3 mois Premium offerts au lancement.
                                    </p>
                                    <p className="text-sm text-neutral-charcoal/55">
                                        Tu cherches un praticien équin tout de suite ?{" "}
                                        <Link
                                            href="/annuaire"
                                            className="text-primary font-semibold underline underline-offset-2 hover:text-primary-soft transition-colors"
                                        >
                                            Va sur l'annuaire Equivio →
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* === Right: phone mockup === */}
                            <div className="relative flex justify-center lg:justify-end pt-6 lg:pt-0">
                                {/* Soft glow halo behind phone */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    aria-hidden
                                >
                                    <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary/15 via-leather/10 to-transparent blur-3xl" />
                                </div>

                                <div className="relative">
                                    <MockupSparkles />
                                    <AppMockup variant="home" widthClass="w-60 sm:w-64 lg:w-72" floating />
                                </div>
                            </div>
                        </div>

                        {/* Trust badges row */}
                        <div className="mt-14 lg:mt-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 reveal">
                            {TRUST_BADGES.map((b) => (
                                <div key={b.label} className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-charcoal/45 uppercase tracking-[0.14em]">
                                    <b.icon className="w-4 h-4" strokeWidth={2} />
                                    {b.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================== APP PREVIEW ========================== */}
                <section className="relative overflow-hidden px-5 sm:px-6 py-16 lg:py-28 bg-gradient-to-b from-neutral-offwhite via-white to-neutral-offwhite border-y border-neutral-stone/40">
                    <div className="absolute -top-20 left-1/4 w-[24rem] h-[24rem] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 right-1/4 w-[24rem] h-[24rem] bg-leather/8 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative max-w-6xl mx-auto">
                        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
                            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-soft uppercase tracking-[0.2em] mb-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                L'app, en avant-première
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
                                Pensée écurie. Construite mobile.
                            </h2>
                            <p className="mt-5 text-base sm:text-lg text-neutral-charcoal/70 leading-relaxed">
                                Un design pensé pour la vraie vie d'un cavalier : à une main, en plein soleil, avec des bottes pleines de boue et 3% de batterie.
                            </p>
                        </div>

                        <AppMockupTrio />

                        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
                            <div>
                                <p className="text-sm font-bold text-primary mb-1">Tableau de bord</p>
                                <p className="text-xs text-neutral-charcoal/60 leading-relaxed">Tes chevaux, tes rappels, ton agenda en un coup d'œil.</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary mb-1">Historique des soins</p>
                                <p className="text-xs text-neutral-charcoal/60 leading-relaxed">Filtré par type, partageable, exportable.</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary mb-1">Rappels actionnables</p>
                                <p className="text-xs text-neutral-charcoal/60 leading-relaxed">Reçois la notif, prends rendez-vous, c'est fait.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================== PROBLEMS ========================== */}
                <section className="px-5 sm:px-6 py-16 lg:py-24 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12 lg:mb-16">
                            <p className="text-xs font-bold text-leather uppercase tracking-[0.2em] mb-3">
                                Le quotidien d'un proprio
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
                                Tu te reconnais ?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {PROBLEMS.map((p, idx) => (
                                <div
                                    key={p.title}
                                    className="relative bg-gradient-to-br from-white to-leather-light/30 rounded-3xl p-7 shadow-card-rest border border-neutral-stone/40 hover-lift hover:shadow-card-hover transition-soft reveal"
                                    style={{ animationDelay: `${idx * 80}ms` }}
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-leather/5 rounded-bl-3xl rounded-tr-3xl pointer-events-none" />
                                    <div className="relative w-12 h-12 rounded-2xl bg-leather/10 flex items-center justify-center mb-5 ring-1 ring-leather/15">
                                        <p.icon className="w-5 h-5 text-leather" strokeWidth={2.2} />
                                    </div>
                                    <h3 className="relative text-lg font-bold text-primary mb-2 leading-tight">
                                        {p.title}
                                    </h3>
                                    <p className="relative text-[15px] text-neutral-charcoal/70 leading-relaxed">
                                        {p.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================== FEATURES ========================== */}
                <section className="px-5 sm:px-6 py-16 lg:py-24 bg-neutral-offwhite">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
                            <p className="text-xs font-bold text-primary-soft uppercase tracking-[0.2em] mb-3">
                                Ce que tu vas pouvoir faire
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
                                Le carnet pensé pour de vrais cavaliers.
                            </h2>
                            <p className="mt-5 text-base sm:text-lg text-neutral-charcoal/70 leading-relaxed">
                                Pas un Excel déguisé. Pensé mobile, pensé écurie, pensé pour la vraie vie d'un cheval.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {FEATURES.map((f, idx) => {
                                const accentBg = f.accent === "primary" ? "bg-primary/10 ring-primary/15" : "bg-leather/12 ring-leather/15";
                                const accentText = f.accent === "primary" ? "text-primary" : "text-leather";
                                return (
                                    <div
                                        key={f.title}
                                        className="group relative bg-white rounded-3xl p-7 shadow-card-rest border border-neutral-stone/40 hover-lift hover:shadow-card-hover transition-soft overflow-hidden reveal"
                                        style={{ animationDelay: `${idx * 60}ms` }}
                                    >
                                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${f.accent === "primary" ? "bg-primary/5" : "bg-leather/8"} blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500`} />

                                        <div className={`relative w-12 h-12 rounded-2xl ${accentBg} flex items-center justify-center mb-5 ring-1 group-hover:scale-110 transition-transform duration-300`}>
                                            <f.icon className={`w-5 h-5 ${accentText}`} strokeWidth={2.2} />
                                        </div>
                                        <h3 className="relative text-lg font-bold text-primary mb-2 leading-tight">
                                            {f.title}
                                        </h3>
                                        <p className="relative text-[15px] text-neutral-charcoal/70 leading-relaxed">
                                            {f.body}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ========================== FOR WHO ========================== */}
                <section className="px-5 sm:px-6 py-16 lg:py-24 bg-leather-light/30 border-y border-neutral-stone/40 relative overflow-hidden">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-leather/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
                                Tu es...
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="group bg-white rounded-3xl p-7 sm:p-9 shadow-card-rest border border-neutral-stone/40 hover-lift hover:shadow-card-hover transition-soft">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="w-6 h-6 text-primary" strokeWidth={2.2} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-primary-soft uppercase tracking-[0.18em]">Pour toi</p>
                                        <h3 className="text-2xl font-bold text-primary leading-tight">Propriétaire</h3>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-[15px] text-neutral-charcoal/80">
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Suivi complet de chaque cheval, du poulain au retraité.</span>
                                    </li>
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Rappels personnalisés par cheval (vaccin, vermifuge, ferrure).</span>
                                    </li>
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Partage du carnet avec écurie, demi-pension, acheteur.</span>
                                    </li>
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Export carnet sanitaire FFE pour les concours.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="group bg-white rounded-3xl p-7 sm:p-9 shadow-card-rest border border-neutral-stone/40 hover-lift hover:shadow-card-hover transition-soft">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-leather/20 to-leather/5 ring-1 ring-leather/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <ShieldCheck className="w-6 h-6 text-leather" strokeWidth={2.2} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-leather uppercase tracking-[0.18em]">Pour toi</p>
                                        <h3 className="text-2xl font-bold text-primary leading-tight">Professionnel</h3>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-[15px] text-neutral-charcoal/80">
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Saisie d'un compte-rendu en 30 secondes après la visite.</span>
                                    </li>
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Base clients propre, agenda, rappels pour les chevaux suivis.</span>
                                    </li>
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>
                                            Profil pro visible sur{" "}
                                            <Link href="/annuaire" className="text-primary underline underline-offset-2 hover:text-primary-soft">
                                                l'annuaire Equivio
                                            </Link>.
                                        </span>
                                    </li>
                                    <li className="flex gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-primary-soft flex-shrink-0 mt-0.5" />
                                        <span>Tu fais gagner du temps à tes clients, ils restent.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================== FAQ ========================== */}
                <section className="px-5 sm:px-6 py-16 lg:py-24 bg-white">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
                                Questions fréquentes
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {FAQ.map((item) => (
                                <details
                                    key={item.q}
                                    className="group bg-neutral-offwhite rounded-2xl border border-neutral-stone/50 shadow-card-rest overflow-hidden hover:shadow-card-hover transition-shadow"
                                >
                                    <summary className="cursor-pointer list-none px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 min-h-[64px] press-effect">
                                        <span className="text-base sm:text-lg font-semibold text-primary leading-snug">
                                            {item.q}
                                        </span>
                                        <span className="w-8 h-8 rounded-full bg-white shadow-card-rest flex items-center justify-center flex-shrink-0 group-open:rotate-90 transition-transform duration-300">
                                            <ArrowRight className="w-4 h-4 text-primary" strokeWidth={2.5} />
                                        </span>
                                    </summary>
                                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-[15px] text-neutral-charcoal/75 leading-relaxed">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================== FINAL CTA ========================== */}
                <section className="relative overflow-hidden px-5 sm:px-6 py-20 lg:py-28">
                    {/* Rich gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-soft" />
                    <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" />
                    <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-leather/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-10 lg:gap-16 items-center">
                            {/* Phone mockup */}
                            <div className="hidden lg:flex justify-center order-2 lg:order-1">
                                <div className="relative">
                                    <div className="absolute inset-0 -m-8 bg-white/10 rounded-full blur-3xl" />
                                    <AppMockup variant="rappel" widthClass="w-64" floating tiltDeg={-4} />
                                </div>
                            </div>

                            <div className="order-1 lg:order-2 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 mb-5">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.18em]">
                                        100 premiers · 3 mois Premium offerts
                                    </span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight !text-white">
                                    Sois parmi les premiers à l'avoir.
                                </h2>
                                <p className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    On lance progressivement. Inscris-toi pour recevoir l'invitation et l'offre des 100 premiers cavaliers.
                                </p>

                                <div className="mt-8 bg-white rounded-2xl p-5 sm:p-6 shadow-float">
                                    <EmailCaptureForm placement="footer-cta" />
                                </div>

                                <p className="mt-6 text-sm text-white/70">
                                    Tu cherches un praticien dès maintenant ?{" "}
                                    <Link
                                        href="/annuaire"
                                        className="underline underline-offset-2 hover:text-white text-white/90 font-semibold"
                                    >
                                        Va sur l'annuaire Equivio
                                    </Link>
                                </p>
                            </div>
                        </div>
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
