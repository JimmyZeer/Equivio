import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const baseUrl = 'https://equivio.fr'

// All specialty slugs for category pages
const SPECIALTIES = [
    'osteopathes',
    'marechaux-ferrants',
    'dentistes'
] as const

// French regions for regional pages
const REGIONS = [
    'ile-de-france',
    'provence-alpes-cote-d-azur',
    'auvergne-rhone-alpes',
    'nouvelle-aquitaine',
    'occitanie',
    'hauts-de-france',
    'grand-est',
    'pays-de-la-loire',
    'bretagne',
    'normandie',
    'bourgogne-franche-comte',
    'centre-val-de-loire',
    'corse'
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch all active practitioners with their slugs
    const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('slug_seo, created_at')
        .eq('status', 'active')
        .not('slug_seo', 'is', null)

    // Log for debugging
    if (error) {
        console.error('Sitemap: Error fetching practitioners:', error)
    }
    console.log(`Sitemap: Found ${practitioners?.length || 0} practitioners`)

    const now = new Date()

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/revendiquer`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/rejoindre`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/rejoindre/nouveau`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/a-propos`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/mentions-legales`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${baseUrl}/confidentialite`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${baseUrl}/cgv`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ]

    // Specialty category pages
    const specialtyPages: MetadataRoute.Sitemap = SPECIALTIES.map(specialty => ({
        url: `${baseUrl}/praticiens/${specialty}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.85,
    }))

    // Regional pages
    const regionPages: MetadataRoute.Sitemap = REGIONS.map(region => ({
        url: `${baseUrl}/regions/${region}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Individual practitioner pages
    const practitionerPages: MetadataRoute.Sitemap = (practitioners || []).map(p => ({
        url: `${baseUrl}/praticien/${p.slug_seo}`,
        lastModified: p.created_at ? new Date(p.created_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        ...staticPages,
        ...specialtyPages,
        ...regionPages,
        // ...practitionerPages, // TODO: Uncomment when ready to index all practitioners
    ]
}
