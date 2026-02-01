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
    intervention_count?: number | null;
    region?: string | null;
    is_claimed?: boolean;
    claimed_at?: string | null;
    claimed_contact?: any | null; // Using any for JSONB, or could define a stricter type
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
    lat?: number;
    lng?: number;
    radius?: number;
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
    pageSize = 10,
    lat,
    lng,
    radius = 50
}: FetchPractitionersParams): Promise<FetchPractitionersResult> {
    const from = (page - 1) * pageSize;
    // const to = from + pageSize - 1; // Not needed for RPC limit/offset

    // 📍 GEOLOCATION SEARCH (RPC)
    if (lat && lng) {
        console.log("📍 Fetching nearby practitioners...", { lat, lng, radius });

        const { data, error } = await supabase.rpc('get_nearby_practitioners', {
            user_lat: lat,
            user_lng: lng,
            radius_km: radius,
            specialty_filter: typeof specialty === 'string' ? specialty : null, // RPC handles single string for now.
            search_query: query || null,
            limit_val: pageSize,
            offset_val: from
        });

        if (error) {
            console.error("RPC Error:", error);
            return { data: [], count: 0, error };
        }

        // RPC returns total_count in each row. We pick it from the first row.
        const count = data && data.length > 0 ? Number(data[0].total_count) : 0;

        return {
            data: (data as Practitioner[]) || [],
            count,
            error: null
        };
    }

    // 🔎 STANDARD SEARCH
    const to = from + pageSize - 1;

    let dbQuery = supabase
        .from('practitioners')
        // Selected fields: id, slug, slug_seo, name, specialty, city, address_full, phone_norm, website, profile_url, status
        // Removed quality_score as it does not exist in DB
        .select('id, slug, slug_seo, name, specialty, city, address_full, phone_norm, website, profile_url, status, intervention_count, region, lat, lng', { count: 'exact' });

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
