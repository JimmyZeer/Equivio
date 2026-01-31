import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function AboutPage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "À propos" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <article className="max-w-3xl mx-auto space-y-16 reveal [animation-delay:100ms]">
                        {/* Header Section */}
                        <header className="space-y-8">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                                Pourquoi Equivio existe
                            </h1>

                            <div className="space-y-6 text-lg text-neutral-charcoal/80 leading-relaxed">
                                <h2 className="text-2xl font-bold text-primary-soft">
                                    Une évidence née du terrain
                                </h2>
                                <p>
                                    Trouver un <strong className="font-semibold text-primary">praticien équin compétent</strong>, disponible et fiable reste aujourd’hui étonnamment complexe.
                                    Entre le bouche-à-oreille limité, les informations éparpillées et les profils incomplets sur les moteurs de recherche, de nombreux propriétaires de chevaux perdent du temps… et parfois prennent de mauvaises décisions.
                                </p>
                                <p>
                                    Equivio est né de ce constat simple : <br />
                                    <span className="block mt-4 pl-4 border-l-4 border-primary/20 italic text-neutral-charcoal">
                                        👉 il manquait un annuaire clair, structuré et digne de confiance dédié aux professionnels du monde équin en France.
                                    </span>
                                </p>
                            </div>
                        </header>

                        {/* Divider */}
                        <div className="w-20 h-1 bg-neutral-stone/30 rounded-full"></div>

                        {/* Main Content Sections */}
                        <section className="space-y-6 text-lg text-neutral-charcoal/80 leading-relaxed">
                            <h2 className="text-3xl font-bold text-primary tracking-tight">
                                Un annuaire indépendant, pensé pour la fiabilité
                            </h2>
                            <p>
                                Equivio n’est ni une plateforme publicitaire, ni un comparateur sponsorisé.
                            </p>
                            <p>
                                Notre objectif est simple :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                                <li>centraliser les praticiens équins</li>
                                <li>structurer l’information</li>
                                <li>rendre la recherche plus fiable et plus transparente</li>
                            </ul>
                            <p className="pt-2">
                                Chaque fiche est conçue pour répondre à une question précise : <br />
                                <em className="text-primary font-medium">“Puis-je faire confiance à ce professionnel pour mon cheval ?”</em>
                            </p>
                        </section>

                        <section className="space-y-6 text-lg text-neutral-charcoal/80 leading-relaxed">
                            <h2 className="text-3xl font-bold text-primary tracking-tight">
                                Comment les praticiens sont référencés
                            </h2>
                            <p>
                                Nous privilégions la <strong>qualité des données</strong> plutôt que la quantité brute.
                            </p>
                            <p>
                                Les praticiens présents sur Equivio sont :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                                <li>identifiés à partir de sources publiques, professionnelles ou spécialisées</li>
                                <li>classés par spécialité (dentisterie équine, ostéopathie, maréchalerie, vétérinaire, etc.)</li>
                                <li>localisés par zone d’intervention réelle lorsque l’information est disponible</li>
                            </ul>
                            <p>
                                Lorsque certaines données ne peuvent pas être vérifiées avec certitude, elles sont volontairement non affichées.
                            </p>
                            <p className="font-medium text-primary-soft">
                                👉 Aucune information n’est inventée ou extrapolée.
                            </p>
                        </section>

                        <section className="space-y-6 text-lg text-neutral-charcoal/80 leading-relaxed">
                            <h2 className="text-3xl font-bold text-primary tracking-tight">
                                Ce que nous refusons volontairement
                            </h2>
                            <p>
                                Pour préserver la crédibilité de la plateforme, Equivio fait le choix de refuser :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-primary/60">
                                <li>les fiches sur-optimisées sans fond réel</li>
                                <li>les faux avis ou notations artificielles</li>
                                <li>les mises en avant payantes non signalées</li>
                                <li>les données approximatives ou trompeuses</li>
                            </ul>
                            <p className="italic text-neutral-charcoal/70 border-l-4 border-neutral-stone/30 pl-4 py-1">
                                La confiance se construit dans le temps, pas à coup de badges marketing.
                            </p>
                        </section>

                        {/* Divider */}
                        <div className="w-20 h-1 bg-neutral-stone/30 rounded-full"></div>

                        <section className="space-y-6 text-lg text-neutral-charcoal/80 leading-relaxed">
                            <h2 className="text-3xl font-bold text-primary tracking-tight">
                                Une plateforme en évolution continue
                            </h2>
                            <p>
                                Equivio est un projet vivant.
                            </p>
                            <p>
                                La base de praticiens s’enrichit progressivement, les fiches sont améliorées au fil du temps, et de nouvelles fonctionnalités seront ajoutées uniquement lorsqu’elles apportent une vraie valeur :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                                <li>meilleure lisibilité</li>
                                <li>meilleure mise en relation</li>
                                <li>meilleure compréhension des métiers équins</li>
                            </ul>
                            <div className="bg-primary/5 p-6 rounded-2xl mt-8">
                                <p className="font-medium text-primary">
                                    Notre priorité reste la même : <br />
                                    <span className="font-normal text-neutral-charcoal/90">mettre en relation des propriétaires de chevaux avec des professionnels sérieux, sur des bases saines et transparentes.</span>
                                </p>
                            </div>
                        </section>

                        <section className="space-y-6 text-lg text-neutral-charcoal/80 leading-relaxed pt-8">
                            <h2 className="text-2xl font-bold text-primary tracking-tight">
                                Vous êtes praticien équin ?
                            </h2>
                            <p>
                                Si vous êtes praticien et que vous souhaitez :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                                <li>corriger une information</li>
                                <li>enrichir votre fiche</li>
                                <li>ou revendiquer votre présence sur Equivio</li>
                            </ul>
                            <p>
                                Une démarche dédiée sera prochainement disponible.
                                <br />
                                <span className="text-sm text-neutral-charcoal/60 mt-2 block">
                                    L’objectif n’est pas de vendre une vitrine, mais de garantir une information juste.
                                </span>
                            </p>
                        </section>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
