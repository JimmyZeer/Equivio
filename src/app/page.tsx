import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { ShieldCheck, Database, Search as SearchIcon, MapPin, ChevronRight, Stethoscope, Hammer, Zap, Heart, Activity, Globe, Lock, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import { TransparencySeal } from "@/components/TransparencySeal";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow">
                {/* 🏇 Hero Section Upgrade — Split Layout */}
                <section className="bg-neutral-offwhite pt-20 pb-40 px-6 reveal overflow-hidden relative">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12 relative z-10">
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight">
                                    Le réseau de <span className="text-primary-soft">confiance</span> des praticiens équins
                                </h1>
                                <p className="text-lg md:text-xl text-neutral-charcoal/60 leading-relaxed max-w-2xl">
                                    Une sélection basée sur l'activité réelle, pas sur des avis subjectifs. Trouvez l'expert certifié adapté à votre cheval.
                                </p>
                            </div>
                            <div className="pt-4">
                                <SearchBar />
                            </div>
                        </div>
                        <div className="relative group hidden lg:block">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <Image
                                    src="/images/hero_horse.png"
                                    alt="Hero Horse Portrait"
                                    width={800}
                                    height={800}
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🛡 3 Pillars of Trust (Reference Design) */}
                <section className="py-24 bg-white reveal [animation-delay:200ms]">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-6 p-10 rounded-3xl bg-neutral-offwhite/50 border border-neutral-stone/30 group hover:bg-white hover:shadow-premium transition-all duration-300">
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-soft">
                                <Database className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Données vérifiées</h3>
                            <p className="text-neutral-charcoal/60 leading-relaxed text-sm">
                                L'activité est tracée et certifiée par notre protocole technique exclusif, garantissant une pratique réelle.
                            </p>
                        </div>
                        <div className="space-y-6 p-10 rounded-3xl bg-neutral-offwhite/50 border border-neutral-stone/30 group hover:bg-white hover:shadow-premium transition-all duration-300">
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-soft">
                                <Globe className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Transparence totale</h3>
                            <p className="text-neutral-charcoal/60 leading-relaxed text-sm">
                                Accédez aux indicateurs réels de performance et de disponibilité, sans filtres marketing ou avis trompeurs.
                            </p>
                        </div>
                        <div className="space-y-6 p-10 rounded-3xl bg-neutral-offwhite/50 border border-neutral-stone/30 group hover:bg-white hover:shadow-premium transition-all duration-300">
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-soft">
                                <Database className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Réseau métier</h3>
                            <p className="text-neutral-charcoal/60 leading-relaxed text-sm">
                                Rejoignez un cercle de praticiens engagés pour l'excellence et le bien-être équin.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Categories Section — Icon-based Grid */}
                <section className="py-32 bg-neutral-offwhite reveal [animation-delay:400ms]">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="space-y-4 mb-20">
                            <h2 className="text-4xl font-extrabold tracking-tight">Parcourir par spécialité</h2>
                            <div className="w-12 h-1 bg-primary-soft mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                            {[
                                { name: "Ostéopathe", icon: Stethoscope, slug: "osteopathes" },
                                { name: "Maréchal", icon: Hammer, slug: "marechaux" },
                                { name: "Dentiste", icon: Zap, slug: "dentistes" },
                                { name: "Vétérinaire", icon: Heart, slug: "veterinaires" },
                                { name: "Masseur", icon: Activity, slug: "masseurs" },
                            ].map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/praticiens/${cat.slug}`}
                                    className="group flex flex-col items-center gap-6"
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-premium flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all scale-100 group-hover:scale-110">
                                        <cat.icon className="w-10 h-10" />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-widest text-neutral-charcoal/60 group-hover:text-primary transition-colors">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 👥 Dual Journey (Split Propriétaires / Praticiens) */}
                <section className="py-40 bg-white reveal [animation-delay:200ms]">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Propriétaires */}
                        <div className="bg-neutral-offwhite/40 border border-neutral-stone/20 rounded-[40px] p-12 md:p-16 space-y-10 flex flex-col h-full">
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-primary-soft uppercase tracking-widest">Propriétaires de chevaux</p>
                                <h2 className="text-4xl font-extrabold tracking-tight leading-tight">Trouvez les meilleurs experts à proximité</h2>
                                <div className="w-12 h-1 bg-primary-soft rounded-full"></div>
                            </div>
                            <p className="text-neutral-charcoal/60 leading-relaxed text-lg">
                                Ne vous fiez plus au hasard ou aux avis anonymes. Accédez à un annuaire certifié où chaque professionnel est présent pour sa pratique réelle et constatée sur le terrain.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {["Recherche par zone géographique précise", "Indicateurs de spécialisation réelle"].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 items-center font-bold text-primary">
                                        <CheckCircle2 className="w-6 h-6 text-primary-soft" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-8 mt-auto">
                                <Link href="/search" className="inline-flex items-center gap-3 font-extrabold text-primary-soft hover:gap-5 transition-all">
                                    Lancer une recherche <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Praticiens */}
                        <div className="bg-primary rounded-[40px] p-12 md:p-16 space-y-10 flex flex-col h-full text-white card-grain relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grain opacity-5"></div>
                            <div className="space-y-4 relative z-10">
                                <p className="text-xs font-bold text-leather-light uppercase tracking-widest">Praticiens & Professionnels</p>
                                <h2 className="text-4xl font-extrabold tracking-tight leading-tight">Valorisez votre activité réelle</h2>
                                <div className="w-12 h-1 bg-leather rounded-full"></div>
                            </div>
                            <p className="text-white/70 leading-relaxed text-lg relative z-10">
                                Rejoignez le premier réseau professionnel qui met en avant votre expertise de terrain. Transformez votre volume de travail en gage de confiance institutionnel.
                            </p>
                            <ul className="space-y-4 pt-4 relative z-10">
                                {["Tableau de bord de suivi d'activité", "Badge de certification Equivio"].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 items-center font-bold text-white">
                                        <CheckCircle2 className="w-6 h-6 text-leather" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-8 mt-auto relative z-10">
                                <Button className="w-full bg-neutral-charcoal py-8 rounded-2xl text-lg font-bold hover:bg-neutral-charcoal/80 transition-soft active:scale-95">
                                    Rejoindre le réseau
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pourquoi choisir Equivio ? (4-Pillar Grid) */}
                <section className="py-40 bg-neutral-offwhite reveal [animation-delay:300ms]">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl font-extrabold text-center mb-24 tracking-tight">Pourquoi choisir Equivio ?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                            {[
                                { title: "Expertise technique", desc: "Une plateforme conçue par des experts du milieu équin pour répondre aux besoins réels du terrain.", icon: GraduationCap },
                                { title: "Sécurité des données", desc: "Vos données d'activité sont cryptées et protégées selon les normes européennes les plus strictes.", icon: Lock },
                                { title: "Réseau d'échange", desc: "Favorise la collaboration entre professionnels de différentes spécialités pour un suivi global.", icon: Globe },
                                { title: "Neutralité garantie", desc: "Aucun algorithme de mise en avant payante. Seule l'activité réelle détermine votre visibilité.", icon: ShieldCheck },
                            ].map((pillar, idx) => (
                                <div key={idx} className="flex gap-8 group">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-premium flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-soft shrink-0">
                                        <pillar.icon className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold tracking-tight">{pillar.title}</h3>
                                        <p className="text-neutral-charcoal/60 leading-relaxed">{pillar.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Regions (SEO) */}
                <section className="py-32 bg-white border-t border-neutral-stone/20">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-charcoal/40 mb-10">Trouver un expert par région</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-4">
                            {["Normandie", "Bretagne", "Nouvelle-Aquitaine", "Pays de la Loire", "Hauts-de-France", "Grand Est", "Auvergne-Rhône-Alpes", "Occitanie", "PACA", "Ile-de-France", "Corse"].map((region) => (
                                <Link key={region} href={`/regions/${region.toLowerCase()}`} className="text-neutral-charcoal/60 hover:text-primary transition-colors text-sm font-medium">
                                    {region}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
