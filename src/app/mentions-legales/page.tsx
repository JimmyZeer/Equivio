
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function MentionsLegalesPage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Mentions légales" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Mentions légales</h1>

                        <div className="prose prose-neutral max-w-none space-y-10 text-neutral-charcoal/80 leading-relaxed">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Éditeur du site</h2>
                                <p>
                                    Le site internet EQUIVIO est édité par la société EQUIVIO SAS, société par actions simplifiée au capital de 1 000 euros, immatriculée au Registre du Commerce et des Sociétés de Lisieux sous le numéro 123 456 789, dont le siège social est situé à Deauville.
                                </p>
                                <p>Email : contact@equivio.fr</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Direction de la publication</h2>
                                <p>Le directeur de la publication est Monsieur Jimmy Zeer, en sa qualité de Président.</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Hébergement</h2>
                                <p>
                                    Le site est hébergé par Cloudflare Inc., dont le siège social est situé 101 Townsend St, San Francisco, CA 94107, États-Unis.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Propriété intellectuelle</h2>
                                <p>
                                    L'intégralité du site EQUIVIO est protégée par les législations françaises et internationales relatives à la propriété intellectuelle. Tous les droits de reproduction sont réservés. Tous les textes, graphismes, icônes, logos, vidéos et sons constituant le site ne peuvent, conformément à l'article L122-4 du Code de la Propriété Intellectuelle, faire l'objet d'une quelconque représentation ou reproduction, intégrale ou partielle, sur quelque support que ce soit, sans l'autorisation expresse et préalable d'EQUIVIO SAS.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
