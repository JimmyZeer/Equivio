import { supabase } from "@/lib/supabase";
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { DynamicPractitionerTemplate, PractitionerTemplateType } from "@/components/templates/DynamicPractitionerTemplate";
import { PractitionerUnavailable } from "@/components/templates/PractitionerUnavailable";

function normalizeSpecialty(specialty: string) {
    if (specialty === "Ostéopathe animalier") return "Ostéopathe équin";
    if (specialty === "Dentisterie équine") return "Dentiste équin";
    return specialty;
}

function getTemplateType(specialty: string): PractitionerTemplateType {
    const s = specialty.toLowerCase();
    if (s.includes("ostéopathe")) return 'osteo';
    if (s.includes("dentiste") || s.includes("dentisterie")) return 'dentist';
    if (s.includes("maréchal") || s.includes("marechal")) return 'farrier';
    return 'generic';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { data: practitioner } = await supabase
        .from('practitioners')
        .select('name, specialty, city, status, photo_url')
        .eq('slug_seo', resolvedParams.slug)
        .single();

    if (!practitioner || practitioner.status !== 'active') return { title: "Profil indisponible | Equivio" };

    const displaySpecialty = normalizeSpecialty(practitioner.specialty);

    // Default OG Image
    let ogImages = ["https://equivio.fr/og-image.png"];

    // Use practitioner photo if available
    if (practitioner.photo_url) {
        ogImages = [practitioner.photo_url];
    }

    return {
        title: `${practitioner.name}, ${displaySpecialty.toLowerCase()} à ${practitioner.city} | Equivio`,
        description: `Fiche professionnelle de ${practitioner.name}, ${displaySpecialty.toLowerCase()} exerçant à ${practitioner.city}. Coordonnées et informations vérifiées.`,
        alternates: {
            canonical: `/praticien/${resolvedParams.slug}`
        },
        openGraph: {
            images: ogImages
        }
    };
}

export default async function PractitionerProfile({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    // Fetch practitioner details with strict status check
    const { data: practitioner, error } = await supabase
        .from('practitioners')
        .select('*')
        .eq('slug_seo', resolvedParams.slug)
        .single();

    // 1. If not found or not active -> Show Friendly Unavailable Page
    if (error || !practitioner || practitioner.status !== 'active') {
        return <PractitionerUnavailable />;
    }

    const templateType = getTemplateType(practitioner.specialty);

    return (
        <DynamicPractitionerTemplate
            practitioner={practitioner}
            templateType={templateType}
        />
    );
}
