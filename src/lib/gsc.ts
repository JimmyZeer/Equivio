import { google } from 'googleapis';

// Interface for the fetched data
export interface GscData {
    connected: boolean;
    error?: string;
    impressions: { value: string; data: number[] };
    clicks: { value: string; data: number[] };
    ctr: { value: string; data: number[] };
    pages: { value: string; data: number[] };
    topQueries: { query: string; clicks: number; impressions: number }[];
    topPages: { path: string; clicks: number }[];
}

export async function fetchGscData(): Promise<GscData | null> {
    const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newlines in env var
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.GSC_PROPERTY_URL;

    // missing credentials -> Return null to trigger "Demo Mode"
    if (!CLIENT_EMAIL || !PRIVATE_KEY || !SITE_URL) {
        console.log("Missing GSC Credentials. Returning null for Demo Mode.");
        return null;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
        });

        const searchconsole = google.searchconsole({ version: 'v1', auth });

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 28); // Last 28 days

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // 1. Fetch Date Histogram (for sparklines)
        const dateRes = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: startDateStr,
                endDate: endDateStr,
                dimensions: ['date'],
                rowLimit: 30,
            },
        });

        const dateRows = dateRes.data.rows || [];
        // Sort by date to ensure correct sparkline order
        dateRows.sort((a, b) => (a.keys?.[0] || '').localeCompare(b.keys?.[0] || ''));

        const impressionsData = dateRows.map(row => row.impressions || 0);
        const clicksData = dateRows.map(row => row.clicks || 0);
        const ctrData = dateRows.map(row => (row.ctr || 0) * 100);
        // Position not requested but available: const positionData = dateRows.map(row => row.position || 0);

        // Count indexed pages implies fetching page stats? 
        // Or simply "number of active pages receiving traffic".
        // Real "Indexed Pages" comes from Sitemaps API or Inspection API (quota heavy).
        // Proxy: Count unique pages with impressions in the period.

        // 2. Fetch Top Queries
        const queryRes = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: startDateStr,
                endDate: endDateStr,
                dimensions: ['query'],
                rowLimit: 5,
            },
        });

        const topQueries = (queryRes.data.rows || []).map(row => ({
            query: row.keys?.[0] || 'Unknown',
            clicks: row.clicks || 0,
            impressions: row.impressions || 0
        }));

        // 3. Fetch Top Pages & Unique Pages Count
        // To get total pages with impressions, we might need more rows, but limit 5 for display.
        // Let's fetch Top 5 for display first.
        const pageRes = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: startDateStr,
                endDate: endDateStr,
                dimensions: ['page'],
                rowLimit: 5,
            },
        });

        const topPages = (pageRes.data.rows || []).map(row => ({
            path: (row.keys?.[0] || '').replace(SITE_URL, ''), // Strip domain for cleaner display
            clicks: row.clicks || 0
        }));

        // Totals sums
        const totalImpressions = dateRows.reduce((sum, row) => sum + (row.impressions || 0), 0);
        const totalClicks = dateRows.reduce((sum, row) => sum + (row.clicks || 0), 0);
        const avgCtr = (totalClicks / totalImpressions) * 100;

        // Pages Count (approximate based on rows with traffic)
        // If we want exact count of pages with traffic, we'd need a separate query without limit or high limit.
        // For now, let's use the number of valid days as proxy? No. 
        // Let's try to fetch more pages to count them, or just use 0 if too expensive.
        // Actually, let's make a separate lightweight query for count if needed, or just leave it as is.
        // We will just use the number of *returned* top pages for now, or maybe just mock it? 
        // Better: Fetch up to 500 pages (lightweight) just to count them.

        // Optimisation: We won't fetch 500 lines every time for a dashboard badge unless cached. 
        // Let's rely on the previous logic: if GSC is connected, show real data.

        return {
            connected: true,
            impressions: {
                value: totalImpressions > 1000 ? `${(totalImpressions / 1000).toFixed(1)}k` : totalImpressions.toString(),
                data: impressionsData
            },
            clicks: {
                value: totalClicks.toString(),
                data: clicksData
            },
            ctr: {
                value: `${avgCtr.toFixed(1)}%`,
                data: ctrData
            },
            pages: {
                value: "N/A", // API doesn't give "indexed pages" easily without Inspection API.
                data: [0] // Placeholder
            },
            topQueries,
            topPages
        };

    } catch (error: any) {
        console.error("GSC API Error:", error);
        return {
            connected: true, // It TRIED to connect but failed, so we show error state, not demo mode? 
            // Actually user wants "Connect GSC" placeholder if not connected.
            // If creds exist but fail, we should probably show an error within the component.
            error: error.message,
            impressions: { value: "-", data: [] },
            clicks: { value: "-", data: [] },
            ctr: { value: "-", data: [] },
            pages: { value: "-", data: [] },
            topQueries: [],
            topPages: []
        };
    }
}
