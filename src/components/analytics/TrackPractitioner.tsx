'use client';

import { useEffect } from 'react';
import { trackPractitionerView } from '@/lib/analytics';

interface TrackPractitionerProps {
    practitioner: {
        id: string;
        specialty: string;
        region?: string | null;
        city?: string | null;
    };
}

export function TrackPractitioner({ practitioner }: TrackPractitionerProps) {
    useEffect(() => {
        trackPractitionerView({
            id: practitioner.id,
            specialty: practitioner.specialty,
            region: practitioner.region || practitioner.city || 'unknown'
        });
    }, [practitioner.id]); // Only run on mount or id change

    return null;
}
