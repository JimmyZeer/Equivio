'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState, useRef } from 'react';
import { GA_TRACKING_ID, pageview } from '@/lib/gtag';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [consent, setConsent] = useState<boolean | null>(null);
    const initialized = useRef(false);

    // Initial consent check
    useEffect(() => {
        const storedConsent = localStorage.getItem('equivio_analytics_consent');
        if (storedConsent === 'true') {
            setConsent(true);
        } else if (storedConsent === 'false') {
            setConsent(false);
        }
    }, []);

    // Listen for consent changes
    useEffect(() => {
        const handleConsentUpdate = (e: CustomEvent) => {
            setConsent(e.detail);
        };

        window.addEventListener('equivio-consent-update', handleConsentUpdate as EventListener);
        return () => window.removeEventListener('equivio-consent-update', handleConsentUpdate as EventListener);
    }, []);

    // Explicit Initialization on Consent
    useEffect(() => {
        if (consent && GA_TRACKING_ID && !initialized.current) {
            // Ensure helper exists
            window.dataLayer = window.dataLayer || [];
            if (!window.gtag) {
                window.gtag = function () { window.dataLayer.push(arguments); };
            }

            // Init call
            window.gtag('js', new Date());
            window.gtag('config', GA_TRACKING_ID, {
                page_path: pathname,
                anonymize_ip: true,
            });

            initialized.current = true;
            console.log("✅ GA4 Initialized explicitly");
        }
    }, [consent, pathname]);

    // Track user navigation (subsequent page views)
    useEffect(() => {
        if (!consent || !initialized.current) return;

        const url = pathname + searchParams.toString();
        // Since config already sends a pageview on init, we might want to skip the first one if it matches?
        // But the pageview helper effectively does a config update.
        // To be safe and simple: just let the helper run. 
        // Note: standard GA setup often sends one PV on load, then PVs on route changes.
        // We just need to make sure we don't send Double PV on first load.
        // The init 'config' call above sends the first PV.

        // This effect runs on pathname change.
        // On mount/consent, pathname is stable, so this might run too if deps change.
        // Actually, let's allow the pageview helper to handle *updates*.

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
                        // REMOVED auto-config here.
                        // Initialization is now handled in the useEffect above.
                    `,
                }}
            />
        </>
    );
}

