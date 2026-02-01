import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { ShieldCheck, Database, Globe, Stethoscope, Hammer, Zap, Heart, Activity, GraduationCap, Lock, CheckCircle2, ArrowRight, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PractitionerCard } from "@/components/PractitionerCard";

export default async function Home() {
    // Fetch latest verified profiles
    const { data: latestPractitioners } = await supabase
        .from('practitioners')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(4);

    return (
        <div className="flex flex-col min-h-screen bg-neutral-offwhite">
            <Header />

            <main className="flex-grow pb-24 lg:pb-0">
                {/* 🏠 Hero Section — With Depth & Geolocation Badge */}
                <section className="pt-12 pb-10 lg:pt-20 lg:pb-16 px-6 bg-gradient-to-b from-white via-white to-neutral-offwhite relative overflow-hidden">
                    {/* Subtle gradient orbs for depth */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 right-0 w-64 h-64 bg-gradient-to-br from-primary-soft/10 to-transparent rounded-full blur-3xl" />

                    <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                        {/* Badge géolocalisation */}
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-card-rest border border-primary/20 reveal">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">📍 Recherche locale disponible</span>
                        </div>

                        <div className="space-y-4 reveal [animation-delay:100ms]">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight tracking-tight">
                                Trouvez le bon praticien équin
                            </h1>
                            <p className="text-base sm:text-lg text-neutral-charcoal/60 max-w-xl mx-auto">
                                Ostéopathes, maréchaux et dentistes <span className="text-primary font-semibold">vérifiés</span> près de chez vous.
                            </p>
                        </div>
                        <div className="pt-6 reveal [animation-delay:200ms]">
                            <SearchBar />
                        </div>
                    </div>
                </section>

                {/* 🐴 Categories — With Active Colors */}
                <section className="bg-white border-y border-neutral-stone/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <div className="max-w-7xl mx-auto px-6 relative">
                        <div className="flex items-center gap-10 overflow-x-auto py-5 scrollbar-hide">
                            {[
                                { name: "Ostéopathes", icon: Stethoscope, slug: "osteopathes", color: "from-primary to-primary-soft" },
                                { name: "Maréchaux", icon: Hammer, slug: "marechaux", color: "from-leather to-leather-light" },
                                { name: "Dentistes", icon: Zap, slug: "dentistes", color: "from-amber-500 to-amber-400" },
                                { name: "Bien-être", icon: Activity, slug: "bien-etre", color: "from-violet-500 to-violet-400" },
                            ].map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/praticiens/${cat.slug}`}
                                    className="group flex flex-col items-center gap-3 min-w-[90px] py-3 border-b-2 border-transparent hover:border-primary transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                                        <cat.icon className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-xs font-semibold text-neutral-charcoal/60 group-hover:text-primary transition-colors whitespace-nowrap">
                                        {cat.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                        {/* Fade-out indicator for scroll on mobile */}
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden" />
                    </div>
                </section>

                {/* ✨ Social Proof Section — Elevated Cards with Reveal */}
                {latestPractitioners && latestPractitioners.length > 0 && (
                    <section className="py-14 lg:py-20 reveal [animation-delay:100ms]">
                        <div className="max-w-7xl mx-auto px-6 space-y-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                                        Praticiens récemment vérifiés
                                    </h2>
                                    <p className="text-sm text-neutral-charcoal/50 mt-2">
                                        Derniers professionnels dont l'activité a été confirmée.
                                    </p>
                                </div>
                                <Link
                                    href="/search"
                                    className="text-sm font-semibold text-primary hover:text-primary-soft flex items-center gap-2 group"
                                >
                                    Voir tout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {latestPractitioners.map((practitioner, idx) => (
                                    <div key={practitioner.id} className="reveal" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <PractitionerCard {...practitioner} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 🛡 Trust Pillars — Elevated Style with Reveal */}
                <section className="py-14 lg:py-20 bg-white reveal [animation-delay:200ms]">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-12">
                            Notre engagement
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Database,
                                    title: "Présence vérifiée",
                                    desc: "Nous validons que le praticien intervient régulièrement dans votre secteur.",
                                    gradient: "from-primary to-primary-soft"
                                },
                                {
                                    icon: Globe,
                                    title: "Sans avis clients",
                                    desc: "La réputation ne s'achète pas. Seule la réalité du travail compte.",
                                    gradient: "from-leather to-leather-light"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Expertise certifiée",
                                    desc: "Diplômes contrôlés et statut professionnel validé.",
                                    gradient: "from-primary-soft to-primary"
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group p-8 bg-gradient-to-br from-white to-neutral-offwhite/60 rounded-3xl border border-neutral-stone/30 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(31,61,43,0.12)] hover:-translate-y-1 transition-all duration-300 reveal"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className="w-7 h-7" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-bold text-lg text-primary mb-3">{item.title}</h3>
                                    <p className="text-sm text-neutral-charcoal/60 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 👥 Dual Journey — Rich Split Section with Enhanced Visibility */}
                <section className="py-14 lg:py-24 bg-neutral-offwhite reveal [animation-delay:300ms]">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Propriétaires */}
                        <div className="bg-white rounded-3xl p-8 lg:p-12 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(31,61,43,0.1)] transition-all duration-300 border border-neutral-stone/20">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-primary-soft/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                    Propriétaires
                                </span>
                                <h2 className="text-2xl lg:text-3xl font-bold text-primary leading-tight">
                                    Trouvez les meilleurs experts à proximité
                                </h2>
                            </div>
                            <p className="text-neutral-charcoal/60">
                                Ne vous fiez plus au hasard. Accédez à un annuaire où chaque professionnel est présent pour sa pratique réelle.
                            </p>
                            <ul className="space-y-4">
                                {["Recherche par zone géographique", "Indicateurs de spécialisation"].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-center text-sm font-medium text-neutral-charcoal">
                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-soft group mt-4"
                            >
                                Lancer une recherche <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Praticiens — ENHANCED VISIBILITY */}
                        <div className="bg-gradient-to-br from-primary via-primary to-primary-soft rounded-3xl p-8 lg:p-12 space-y-6 text-white shadow-[0_12px_48px_rgba(31,61,43,0.4)] hover:shadow-[0_20px_64px_rgba(31,61,43,0.5)] transition-all duration-300 relative overflow-hidden ring-2 ring-white/20">
                            {/* Grain texture */}
                            <div className="absolute inset-0 bg-grain opacity-5" />

                            {/* Glow effect */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-white/15 text-white/90 text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
                                    Praticiens
                                </span>
                                {/* TITRE AMÉLIORÉ : Plus grand, shadow max, meilleur contraste */}
                                <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                    Votre visibilité dépend de votre activité
                                </h2>
                            </div>
                            <p className="text-white/90 relative z-10 text-base">
                                Fini le marketing payant. C'est votre travail quotidien qui construit votre réputation.
                            </p>
                            <ul className="space-y-4 relative z-10">
                                {["Pas d'algorithme payant", "Zone d'intervention valorisée"].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-center text-sm font-medium text-white/90">
                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 relative z-10">
                                <Link href="/rejoindre">
                                    <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all press-effect">
                                        Rejoindre le réseau
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pourquoi Equivio — Elevated Cards with Reveal */}
                <section className="py-14 lg:py-20 bg-white reveal [animation-delay:400ms]">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-14">
                            Pourquoi choisir Equivio ?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Expertise technique", desc: "Plateforme conçue par des experts du milieu équin.", icon: GraduationCap, color: "from-primary to-primary-soft" },
                                { title: "Données sécurisées", desc: "Protection selon les normes européennes.", icon: Lock, color: "from-neutral-charcoal to-neutral-charcoal/80" },
                                { title: "Réseau d'échange", desc: "Collaboration entre spécialités.", icon: Globe, color: "from-leather to-leather-light" },
                                { title: "Neutralité garantie", desc: "Aucune mise en avant payante.", icon: ShieldCheck, color: "from-primary-soft to-primary" },
                            ].map((pillar, idx) => (
                                <div
                                    key={idx}
                                    className="group text-center space-y-4 p-8 bg-gradient-to-br from-neutral-offwhite/50 to-white rounded-2xl border border-neutral-stone/20 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(31,61,43,0.1)] hover:-translate-y-1 transition-all duration-300 reveal"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <pillar.icon className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-bold text-neutral-charcoal">{pillar.title}</h3>
                                    <p className="text-sm text-neutral-charcoal/60">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Regions (SEO) — Minimal Footer Links */}
                <section className="py-12 bg-neutral-offwhite border-t border-neutral-stone/30 reveal [animation-delay:500ms]">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-charcoal/40 mb-6">
                            Trouver un expert par région
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-3">
                            {["Normandie", "Bretagne", "Nouvelle-Aquitaine", "Pays de la Loire", "Hauts-de-France", "Grand Est", "Auvergne-Rhône-Alpes", "Occitanie", "PACA", "Ile-de-France", "Corse"].map((region) => (
                                <Link
                                    key={region}
                                    href={`/regions/${region.toLowerCase()}`}
                                    className="text-sm text-neutral-charcoal/50 hover:text-primary hover:underline transition-colors"
                                >
                                    {region}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* CTA Sticky Praticiens (Mobile/Tablet) */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 reveal [animation-delay:600ms]">
                <Link href="/rejoindre">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary-soft text-white font-bold py-4 rounded-2xl shadow-[0_8px_24px_rgba(31,61,43,0.4)] hover:shadow-[0_12px_32px_rgba(31,61,43,0.5)] flex items-center justify-center gap-2 press-effect">
                        <Users className="w-5 h-5" />
                        Rejoindre Equivio
                    </Button>
                </Link>
            </div>

            <Footer />
        </div>
    );
}
