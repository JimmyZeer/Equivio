import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Conseils & Actualités Équines | Equivio",
    description: "Découvrez nos articles sur la santé équine, les soins vétérinaires, l'ostéopathie et la dentisterie pour chevaux. Conseils d'experts et actualités du monde équin.",
};

// Placeholder articles - in production, fetch from Supabase or MDX
const ARTICLES = [
    {
        slug: "comment-choisir-osteopathe-cheval",
        title: "Comment bien choisir un ostéopathe pour son cheval ?",
        excerpt: "Les critères essentiels pour sélectionner le bon praticien et garantir le bien-être de votre équidé.",
        category: "Ostéopathie",
        date: "2026-01-25",
        readTime: 5,
        image: null,
    },
    {
        slug: "signes-probleme-dentaire-cheval",
        title: "Les 7 signes qui montrent que votre cheval a un problème dentaire",
        excerpt: "Apprenez à reconnaître les symptômes d'un souci dentaire chez votre cheval avant qu'il ne s'aggrave.",
        category: "Dentisterie",
        date: "2026-01-20",
        readTime: 4,
        image: null,
    },
    {
        slug: "frequence-soins-equins-annuels",
        title: "La fréquence idéale des soins équins : le calendrier annuel",
        excerpt: "Vaccins, vermifuges, dentiste, ostéopathe, maréchal... À quelle fréquence consulter chaque praticien ?",
        category: "Conseils",
        date: "2026-01-15",
        readTime: 6,
        image: null,
    },
];

const CATEGORIES = [
    { name: "Tous", count: 3 },
    { name: "Ostéopathie", count: 1 },
    { name: "Dentisterie", count: 1 },
    { name: "Conseils", count: 1 },
];

export default function BlogPage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Blog" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="max-w-4xl space-y-6 reveal [animation-delay:100ms]">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight tracking-tight">
                            Blog <span className="text-primary-soft">Équivio</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-charcoal/60 leading-relaxed max-w-3xl">
                            Conseils d'experts, actualités du monde équin et guides pratiques pour prendre soin de votre cheval.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-8 reveal [animation-delay:200ms]">
                            <div className="bg-white p-6 rounded-2xl border border-neutral-stone/40 shadow-sm">
                                <h2 className="font-bold text-primary text-sm uppercase tracking-wider mb-4">Catégories</h2>
                                <ul className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <li key={cat.name}>
                                            <button className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-neutral-stone/10 transition-colors text-left">
                                                <span className="text-neutral-charcoal/80">{cat.name}</span>
                                                <span className="text-xs bg-neutral-stone/20 px-2 py-0.5 rounded-full text-neutral-charcoal/50">{cat.count}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                                <h2 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Newsletter</h2>
                                <p className="text-sm text-neutral-charcoal/60 mb-4">
                                    Recevez nos meilleurs articles chaque mois.
                                </p>
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="w-full px-4 py-2 rounded-lg border border-neutral-stone/40 text-sm mb-2"
                                />
                                <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                    S'inscrire
                                </button>
                            </div>
                        </aside>

                        {/* Articles Grid */}
                        <div className="lg:col-span-3 space-y-8 reveal [animation-delay:300ms]">
                            {ARTICLES.map((article, index) => (
                                <article
                                    key={article.slug}
                                    className="bg-white rounded-2xl border border-neutral-stone/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className="p-6 md:p-8">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                {article.category}
                                            </span>
                                            <div className="flex items-center gap-3 text-xs text-neutral-charcoal/50">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {article.readTime} min
                                                </span>
                                            </div>
                                        </div>

                                        <h2 className="text-xl md:text-2xl font-bold text-primary mb-3 group-hover:text-primary-soft transition-colors">
                                            <Link href={`/blog/${article.slug}`}>
                                                {article.title}
                                            </Link>
                                        </h2>

                                        <p className="text-neutral-charcoal/70 mb-6 leading-relaxed">
                                            {article.excerpt}
                                        </p>

                                        <Link
                                            href={`/blog/${article.slug}`}
                                            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                                        >
                                            Lire l'article
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
