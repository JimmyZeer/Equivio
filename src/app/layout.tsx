import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import { FavoritesProvider } from "@/lib/favorites";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieConsent from "@/components/analytics/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Equivio | Le réseau de confiance des praticiens équins",
        template: "%s | Equivio"
    },
    description: "Découvrez les praticiens équins basés sur leur activité réelle enregistrée. Aucune note, aucun avis subjectif, uniquement la traçabilité de l'expertise par l'intervention.",
    keywords: ["équitation", "vétérinaire équin", "ostéopathe équin", "maréchal-ferrant", "dentiste équin", "praticien équin", "activité réelle", "annuaire équin"],
    openGraph: {
        title: "Equivio | Le réseau de confiance des praticiens équins",
        description: "Le premier annuaire premium basé sur l'activité réelle des experts de la santé équine.",
        url: "https://equivio.fr",
        siteName: "Equivio",
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: "https://equivio.fr/og-image.png",
                width: 1200,
                height: 630,
                alt: "Equivio - Le réseau de confiance des praticiens équins",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Equivio | Réseau de confiance équin",
        description: "Activité réelle, traçabilité, neutralité.",
        images: ["https://equivio.fr/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
    verification: {
        google: "google-site-verification=PLACEHOLDER", // TODO: Replace with actual code from Search Console
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={`${inter.className} bg-neutral-offwhite text-neutral-charcoal antialiased`}>
                <FavoritesProvider>
                    <Suspense fallback={null}>
                        <GoogleAnalytics />
                    </Suspense>
                    <CookieConsent />
                    {/* Global Structured Data */}
                    <OrganizationSchema />
                    <WebsiteSchema />

                    <div className="fixed inset-0 bg-grain pointer-events-none z-[9999]"></div>
                    <main className="min-h-screen">
                        {children}
                    </main>
                </FavoritesProvider>
            </body>
        </html>
    );
}

