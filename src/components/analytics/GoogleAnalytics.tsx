'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { GA_TRACKING_ID, pageview } from '@/lib/gtag';

export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [consent, setConsent] = useState<boolean | null>(null);

    // Initial consent check
    useEffect(() => {
        const storedConsent = localStorage.getItem('equivio_analytics_consent');
        if (storedConsent === 'true') {
            setConsent(true);
        } else if (storedConsent === 'false') {
            setConsent(false);
        }
    }, []);

    // Listen for consent changes from other components (e.g. CookieBanner)
    useEffect(() => {
        const handleConsentUpdate = (e: CustomEvent) => {
            setConsent(e.detail);
        };

        window.addEventListener('equivio-consent-update', handleConsentUpdate as EventListener);
        return () => window.removeEventListener('equivio-consent-update', handleConsentUpdate as EventListener);
    }, []);

    // Track page views
    useEffect(() => {
        if (!consent) return;

        const url = pathname + searchParams.toString();
        pageview(url);

    }, [pathname, searchParams, consent]);

    // Privacy Safe-guards
    if (pathname.startsWith('/admin')) return null;
    if (!consent) return null;
    if (!GA_TRACKING_ID) return null;

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                            anonymize_ip: true
                        });
                    `,
                }}
            />
        </>
    );
}
