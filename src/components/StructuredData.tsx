"use client";

import Script from "next/script";

interface LocalBusinessSchemaProps {
    name: string;
    specialty: string;
    city?: string | null;
    region?: string | null;
    phone?: string | null;
    website?: string | null;
    slug: string;
    lat?: number | null;
    lng?: number | null;
}

/**
 * Generates LocalBusiness structured data for practitioner profiles
 * Helps Google understand this is a local service provider
 */
export function LocalBusinessSchema({
    name,
    specialty,
    city,
    region,
    phone,
    website,
    slug,
    lat,
    lng,
}: LocalBusinessSchemaProps) {
    // Map specialty to schema.org type
    const getBusinessType = (specialty: string): string => {
        const lower = specialty.toLowerCase();
        if (lower.includes("vétérinaire") || lower.includes("veterinaire")) {
            return "VeterinaryCare";
        }
        if (lower.includes("ostéopathe") || lower.includes("osteo")) {
            return "HealthAndBeautyBusiness";
        }
        if (lower.includes("dentiste") || lower.includes("dent")) {
            return "HealthAndBeautyBusiness";
        }
        if (lower.includes("maréchal") || lower.includes("ferrant")) {
            return "LocalBusiness";
        }
        return "LocalBusiness";
    };

    const schema = {
        "@context": "https://schema.org",
        "@type": getBusinessType(specialty),
        name: name,
        description: `${name} - ${specialty}${city ? ` à ${city}` : ""}`,
        url: `https://equivio.fr/praticien/${slug}`,
        ...(phone && { telephone: phone }),
        ...(website && { sameAs: [website] }),
        ...(city || region) && {
            address: {
                "@type": "PostalAddress",
                ...(city && { addressLocality: city }),
                ...(region && region !== "Non renseigné" && { addressRegion: region }),
                addressCountry: "FR",
            },
        },
        ...(lat && lng) && {
            geo: {
                "@type": "GeoCoordinates",
                latitude: lat,
                longitude: lng,
            },
        },
        // Service area for mobile practitioners
        areaServed: {
            "@type": "Country",
            name: "France",
        },
        // Indicate this is a verified listing
        isVerified: true,
    };

    return (
        <Script
            id="local-business-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BreadcrumbSchemaProps {
    items: Array<{
        name: string;
        url: string;
    }>;
}

/**
 * Generates BreadcrumbList structured data
 * Helps Google display breadcrumb trails in search results
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface FAQSchemaProps {
    questions: Array<{
        question: string;
        answer: string;
    }>;
}

/**
 * Generates FAQPage structured data
 * Enables FAQ rich snippets in Google search results
 */
export function FAQSchema({ questions }: FAQSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map(q => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: q.answer,
            },
        })),
    };

    return (
        <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface OrganizationSchemaProps {
    // Can add props later if needed
}

/**
 * Generates Organization structured data for the main site
 */
export function OrganizationSchema(_props: OrganizationSchemaProps = {}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Equivio",
        url: "https://equivio.fr",
        logo: "https://equivio.fr/logo.png",
        description: "Le réseau de confiance des praticiens équins. Annuaire premium basé sur l'activité réelle des experts de la santé équine.",
        sameAs: [
            // Add social media URLs when available
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["French"],
        },
    };

    return (
        <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface WebsiteSchemaProps {
    // Can add props later if needed
}

/**
 * Generates WebSite structured data with SearchAction
 * Enables sitelinks searchbox in Google
 */
export function WebsiteSchema(_props: WebsiteSchemaProps = {}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Equivio",
        url: "https://equivio.fr",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: "https://equivio.fr/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <Script
            id="website-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
