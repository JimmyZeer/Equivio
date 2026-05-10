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
        default: "Equivio — Le carnet de santé numérique de ton cheval",
        template: "%s | Equivio"
    },
    description: "Le carnet de santé numérique de ton cheval : vaccins, vermifuges, ferrures, ostéo, dentiste — tout au même endroit, dans ta poche, même sans réseau à l'écurie.",
    keywords: ["carnet santé cheval", "app cheval", "carnet vaccin cheval", "rappel vermifuge cheval", "carnet sanitaire FFE", "suivi cheval", "ostéopathe équin", "maréchal-ferrant", "dentiste équin", "annuaire équin"],
    openGraph: {
        title: "Equivio — Le carnet de santé numérique de ton cheval",
        description: "Vaccins, vermifuges, ferrures, ostéo : tout au même endroit, dans ta poche, même sans réseau à l'écurie.",
        url: "https://equivio.fr",
        siteName: "Equivio",
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: "https://equivio.fr/og-image.png",
                width: 1200,
                height: 630,
                alt: "Equivio — Le carnet de santé numérique de ton cheval",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Equivio — Carnet de santé du cheval",
        description: "Vaccins, vermifuges, ferrures, ostéo : tout au même endroit, dans ta poche.",
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

