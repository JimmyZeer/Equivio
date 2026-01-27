import { supabase } from "@/lib/supabase";

export interface Practitioner {
    id: string;
    slug?: string;
    slug_seo?: string;
    name: string;
    specialty: string;
    city?: string | null;
    address_full?: string | null;
    phone_norm?: string | null;
    website?: string | null;
    profile_url?: string | null;
    quality_score?: number | null;
    status?: string | null;
    lat?: number | null;
    lng?: number | null;
    // Add other fields as needed based on the select query
}

export interface FetchPractitionersParams {
    specialty?: string | string[];
    city?: string; // loosely matches location search
    query?: string; // name or specialty search
    verified?: boolean;
    claimed?: boolean;
    sort?: string; // 'pertinence' | 'alpha' | 'recent'
    page?: number;
    pageSize?: number;
}

export interface FetchPractitionersResult {
    data: Practitioner[];
    count: number;
    error: any;
}

export async function fetchPractitioners({
    specialty,
    city,
    query,
    verified,
    claimed,
    sort = 'pertinence',
    page = 1,
    pageSize = 10
}: FetchPractitionersParams): Promise<FetchPractitionersResult> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let dbQuery = supabase
        .from('practitioners')
        // Select all fields required by both pages. 
        // Search page used: id, name, specialty, city, address_full, slug_seo, status
        // Specialty page used: id, slug, name, specialty, city, address_full, phone_norm, website, profile_url, quality_score, status
        // Selected fields: id, slug, slug_seo, name, specialty, city, address_full, phone_norm, website, profile_url, status
        // Removed quality_score as it does not exist in DB
        .select('id, slug, slug_seo, name, specialty, city, address_full, phone_norm, website, profile_url, status, intervention_count, lat, lng', { count: 'exact' });

    // Status active filter
    dbQuery = dbQuery.eq('status', 'active');

    if (specialty) {
        dbQuery = dbQuery.eq('specialty', specialty);
    }

    if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,specialty.ilike.%${query}%`);
    }

    if (city) {
        dbQuery = dbQuery.ilike('city', `%${city}%`);
    }

    // Sorting
    if (sort === 'alpha') {
        dbQuery = dbQuery.order('name', { ascending: true });
    } else {
        // pertinence -> currently fallback to name as quality_score is missing
        // Could use intervention_count if populated in future
        dbQuery = dbQuery.order('intervention_count', { ascending: false, nullsFirst: false })
            .order('name', { ascending: true });
    }

    // Pagination
    dbQuery = dbQuery.range(from, to);

    const { data, error, count } = await dbQuery;

    if (error) {
        console.error("FetchPractitioners Error:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
    }

    return {
        data: (data as Practitioner[]) || [],
        count: count || 0,
        error
    };
}
