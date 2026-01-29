import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtonsInline } from "@/components/ShareButtons";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

// Placeholder articles database - in production, fetch from Supabase or MDX
const ARTICLES: Record<string, {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: string;
    readTime: number;
    author: string;
}> = {
    "comment-choisir-osteopathe-cheval": {
        title: "Comment bien choisir un ostéopathe pour son cheval ?",
        excerpt: "Les critères essentiels pour sélectionner le bon praticien et garantir le bien-être de votre équidé.",
        content: `
## Pourquoi consulter un ostéopathe équin ?

L'ostéopathie équine est une discipline qui vise à prévenir et traiter les troubles fonctionnels chez le cheval. Un ostéopathe compétent peut améliorer significativement la qualité de vie et les performances de votre animal.

## Les critères de choix essentiels

### 1. La formation et les certifications

Recherchez un praticien diplômé d'une école reconnue. En France, le registre national des ostéopathes animaliers (RNA) garantit un niveau de formation minimal.

### 2. L'expérience avec les équidés

Un ostéopathe spécialisé dans les chevaux aura une meilleure compréhension de leur biomécanique spécifique.

### 3. Les recommandations

N'hésitez pas à demander des références à votre vétérinaire ou à d'autres propriétaires de chevaux.

## Conclusion

Prendre le temps de bien choisir son ostéopathe est un investissement dans la santé à long terme de votre cheval.
        `,
        category: "Ostéopathie",
        date: "2026-01-25",
        readTime: 5,
        author: "Équipe Equivio",
    },
    "signes-probleme-dentaire-cheval": {
        title: "Les 7 signes qui montrent que votre cheval a un problème dentaire",
        excerpt: "Apprenez à reconnaître les symptômes d'un souci dentaire chez votre cheval avant qu'il ne s'aggrave.",
        content: `
## L'importance de la santé dentaire équine

Les problèmes dentaires chez le cheval sont fréquents et peuvent avoir des conséquences sérieuses sur sa santé globale et son bien-être.

## Les 7 signes à surveiller

### 1. Perte de poids inexpliquée
Un cheval qui a mal aux dents mange moins efficacement.

### 2. Mastication anormale
Observer des mouvements de mâchoire asymétriques ou du fourrage qui tombe de la bouche.

### 3. Mauvaise haleine
Une odeur désagréable peut indiquer une infection.

### 4. Résistance au mors
Un cheval qui secoue la tête ou refuse le contact peut avoir des douleurs dentaires.

### 5. Bave excessive
La salivation anormale est souvent signe d'inconfort.

### 6. Gonflement de la mâchoire
Peut indiquer un abcès ou une infection.

### 7. Rejet de certains aliments
Le refus de manger des aliments durs peut être significatif.

## Quand consulter ?

Idéalement, un contrôle dentaire annuel est recommandé pour tous les chevaux.
        `,
        category: "Dentisterie",
        date: "2026-01-20",
        readTime: 4,
        author: "Équipe Equivio",
    },
    "frequence-soins-equins-annuels": {
        title: "La fréquence idéale des soins équins : le calendrier annuel",
        excerpt: "Vaccins, vermifuges, dentiste, ostéopathe, maréchal... À quelle fréquence consulter chaque praticien ?",
        content: `
## Un calendrier de soins pour optimiser la santé de votre cheval

Planifier les soins de votre cheval est essentiel pour sa santé et votre budget.

## Le calendrier recommandé

### Tous les 6 à 8 semaines
- **Maréchal-ferrant**: Parage ou ferrage selon les besoins

### Tous les 3 à 4 mois  
- **Vermifugation**: Adaptée au poids et à la saison

### Tous les 6 mois
- **Ostéopathe**: Bilan et prévention
- **Dentiste équin**: Contrôle de routine

### Annuellement
- **Vétérinaire**: Vaccinations (grippe, tétanos, rhinopneumonie)
- **Bilan sanguin**: Pour les chevaux de plus de 15 ans

## Adapter selon votre cheval

Ce calendrier est indicatif. Les besoins varient selon l'âge, l'activité et l'état de santé de chaque cheval.
        `,
        category: "Conseils",
        date: "2026-01-15",
        readTime: 6,
        author: "Équipe Equivio",
    },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const article = ARTICLES[resolvedParams.slug];

    if (!article) {
        return { title: "Article non trouvé | Equivio" };
    }

    return {
        title: `${article.title} | Blog Equivio`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: "article",
            publishedTime: article.date,
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = ARTICLES[resolvedParams.slug];

    if (!article) {
        notFound();
    }

    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: article.title },
    ];

    // Article Schema for SEO
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        author: {
            "@type": "Organization",
            name: article.author,
        },
        publisher: {
            "@type": "Organization",
            name: "Equivio",
            logo: {
                "@type": "ImageObject",
                url: "https://equivio.fr/logo.png",
            },
        },
    };

    return (
        <div className="flex flex-col min-h-screen">
            <BreadcrumbSchema
                items={[
                    { name: "Accueil", url: "https://equivio.fr" },
                    { name: "Blog", url: "https://equivio.fr/blog" },
                    { name: article.title, url: `https://equivio.fr/blog/${resolvedParams.slug}` },
                ]}
            />
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <article className="max-w-3xl mx-auto space-y-12">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} className="mb-8" />
                    </div>

                    {/* Header */}
                    <header className="space-y-6 reveal [animation-delay:100ms]">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm text-neutral-charcoal/60 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour au blog
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                                {article.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary leading-tight tracking-tight">
                            {article.title}
                        </h1>

                        <p className="text-lg text-neutral-charcoal/70 leading-relaxed">
                            {article.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-stone/30">
                            <div className="flex items-center gap-2 text-sm text-neutral-charcoal/60">
                                <User className="w-4 h-4" />
                                {article.author}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-charcoal/60">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-charcoal/60">
                                <Clock className="w-4 h-4" />
                                {article.readTime} min de lecture
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none reveal [animation-delay:200ms]
                            prose-headings:text-primary prose-headings:font-bold
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-neutral-charcoal/80 prose-p:leading-relaxed
                            prose-li:text-neutral-charcoal/80
                            prose-strong:text-primary prose-strong:font-semibold
                        "
                        dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>').replace(/## /g, '</p><h2>').replace(/### /g, '</p><h3>').replace(/<\/h2>/g, '</h2><p>').replace(/<\/h3>/g, '</h3><p>') }}
                    />

                    {/* Share & CTA */}
                    <footer className="pt-12 border-t border-neutral-stone/30 space-y-8 reveal [animation-delay:300ms]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-charcoal/80 mb-2">Partager cet article</p>
                                <ShareButtonsInline
                                    url={`/blog/${resolvedParams.slug}`}
                                    title={article.title}
                                    description={article.excerpt}
                                />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 text-center">
                            <h3 className="text-xl font-bold text-primary mb-3">Besoin d'un praticien équin ?</h3>
                            <p className="text-neutral-charcoal/70 mb-6">
                                Trouvez les meilleurs ostéopathes, dentistes et vétérinaires équins près de chez vous.
                            </p>
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                            >
                                Rechercher un praticien
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>

            <Footer />
        </div>
    );
}
