'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { X, Cookie } from "lucide-react";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('equivio_analytics_consent');
        if (consent === null) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('equivio_analytics_consent', 'true');
        window.dispatchEvent(new CustomEvent('equivio-consent-update', { detail: true }));
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('equivio_analytics_consent', 'false');
        window.dispatchEvent(new CustomEvent('equivio-consent-update', { detail: false }));
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white p-6 rounded-2xl shadow-2xl border border-neutral-100 z-[10000] animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                    <Cookie className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                    <h3 className="font-bold text-neutral-charcoal">Vie privée</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Nous n'utilisons aucun cookie publicitaire. Uniquement un outil statistique anonyme pour comprendre l'usage du site (Google Analytics 4).
                        <br />
                        <span className="text-xs text-neutral-400">Respect du RGPD & CNIL.</span>
                    </p>
                    <div className="flex gap-3 pt-1">
                        <Button
                            onClick={handleAccept}
                            className="bg-primary hover:bg-primary-dark text-white text-sm py-2 h-auto rounded-lg flex-1"
                        >
                            Accepter
                        </Button>
                        <Button
                            onClick={handleDecline}
                            variant="outline"
                            className="text-neutral-600 border-neutral-200 hover:bg-neutral-50 text-sm py-2 h-auto rounded-lg flex-1"
                        >
                            Refuser
                        </Button>
                    </div>
                </div>
                <button
                    onClick={handleDecline}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
