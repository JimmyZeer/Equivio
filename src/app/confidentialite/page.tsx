
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function ConfidentialitePage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Confidentialité" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Politique de confidentialité</h1>

                        <div className="prose prose-neutral max-w-none space-y-10 text-neutral-charcoal/80 leading-relaxed">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Collecte de données</h2>
                                <p>
                                    EQUIVIO s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site equivio.fr, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Finalité du traitement</h2>
                                <p>
                                    Les données collectées sont utilisées pour :
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>La certification de l'activité réelle des praticiens équins.</li>
                                    <li>La gestion des demandes de revendication de profils.</li>
                                    <li>L'amélioration de l'expérience utilisateur sur la plateforme.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Vos droits</h2>
                                <p>
                                    Conformément à la réglementation européenne, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à l'adresse contact@equivio.fr.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">Cookies</h2>
                                <p>
                                    Le site EQUIVIO n'utilise que des cookies techniques nécessaires au bon fonctionnement de la plateforme. Aucun cookie de pistage publicitaire n'est déposé sur votre terminal.
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
