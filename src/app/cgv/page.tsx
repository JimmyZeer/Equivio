
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function CGVPage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "CGV / CGU" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">CGV / CGU</h1>

                        <div className="prose prose-neutral max-w-none space-y-10 text-neutral-charcoal/80 leading-relaxed font-medium">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">1. Objet</h2>
                                <p>
                                    Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition des services du site EQUIVIO et les conditions d'utilisation du service par l'Utilisateur.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">2. Accès au service</h2>
                                <p>
                                    Le service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les frais supportés par l'Utilisateur pour accéder au service (matériel informatique, logiciels, connexion internet, etc.) sont à sa charge.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">3. Responsabilité de l'Utilisateur</h2>
                                <p>
                                    L'Utilisateur est responsable des risques liés à l'utilisation de son identifiant de connexion et de son mot de passe. Tout usage du service par l'Utilisateur ayant directement ou indirectement pour conséquence des dommages doit faire l'objet d'une indemnisation au profit du site.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-primary">4. Données d'activité</h2>
                                <p>
                                    Le site permet aux Utilisateurs de déclarer des interventions. L'Utilisateur s'engage à fournir des informations exactes. EQUIVIO se réserve le droit de vérifier les informations fournies et de supprimer tout contenu jugé mensonger ou inapproprié.
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
