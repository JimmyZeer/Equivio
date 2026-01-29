"use client";

import { useState } from "react";
import { Share2, MessageCircle, Facebook, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
    className?: string;
    variant?: "horizontal" | "vertical";
}

export function ShareButtons({
    url,
    title,
    description,
    className,
    variant = "horizontal",
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const fullUrl = typeof window !== "undefined"
        ? `${window.location.origin}${url}`
        : `https://equivio.fr${url}`;

    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(description || title);

    const handleShare = async () => {
        // Use native share if available (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description || title,
                    url: fullUrl,
                });
                return;
            } catch (err) {
                // User cancelled or error, fall through to show menu
            }
        }
        // Toggle share menu on desktop
        setShowMenu(!showMenu);
    };

    const handleWhatsApp = () => {
        window.open(
            `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            "_blank",
            "noopener,noreferrer"
        );
        setShowMenu(false);
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
            "_blank",
            "noopener,noreferrer,width=600,height=400"
        );
        setShowMenu(false);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = fullUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        setShowMenu(false);
    };

    const isVertical = variant === "vertical";

    return (
        <div className={cn("relative", className)}>
            {/* Main Share Button */}
            <button
                onClick={handleShare}
                className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl",
                    "bg-neutral-stone/10 hover:bg-neutral-stone/20",
                    "text-neutral-charcoal/70 hover:text-neutral-charcoal",
                    "transition-all duration-200 text-sm font-medium",
                    "border border-neutral-stone/20 hover:border-neutral-stone/40"
                )}
                aria-label="Partager"
            >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
            </button>

            {/* Share Menu Dropdown */}
            {showMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Menu */}
                    <div
                        className={cn(
                            "absolute z-50 mt-2 p-2 rounded-xl",
                            "bg-white border border-neutral-stone/30 shadow-premium",
                            "min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200",
                            isVertical ? "left-0" : "right-0"
                        )}
                    >
                        <div className="space-y-1">
                            {/* WhatsApp */}
                            <button
                                onClick={handleWhatsApp}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                    "hover:bg-green-50 text-left transition-colors",
                                    "text-neutral-charcoal/80 hover:text-green-600"
                                )}
                            >
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-sm">WhatsApp</span>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={handleFacebook}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                    "hover:bg-blue-50 text-left transition-colors",
                                    "text-neutral-charcoal/80 hover:text-blue-600"
                                )}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Facebook className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-sm">Facebook</span>
                            </button>

                            {/* Divider */}
                            <div className="border-t border-neutral-stone/20 my-1" />

                            {/* Copy Link */}
                            <button
                                onClick={handleCopyLink}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                    "hover:bg-neutral-stone/10 text-left transition-colors",
                                    "text-neutral-charcoal/80"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                    copied ? "bg-green-500" : "bg-neutral-stone/30"
                                )}>
                                    {copied ? (
                                        <Check className="w-4 h-4 text-white" />
                                    ) : (
                                        <Link2 className="w-4 h-4 text-neutral-charcoal/60" />
                                    )}
                                </div>
                                <span className="font-medium text-sm">
                                    {copied ? "Copié !" : "Copier le lien"}
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Inline share buttons (no dropdown, direct icons)
 */
export function ShareButtonsInline({
    url,
    title,
    description,
    className,
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const fullUrl = typeof window !== "undefined"
        ? `${window.location.origin}${url}`
        : `https://equivio.fr${url}`;

    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedText = encodeURIComponent(description || title);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    const buttonClass = cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        "transition-all duration-200 hover:scale-110"
    );

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* WhatsApp */}
            <a
                href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonClass, "bg-green-500 hover:bg-green-600 text-white")}
                aria-label="Partager sur WhatsApp"
            >
                <MessageCircle className="w-5 h-5" />
            </a>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonClass, "bg-blue-600 hover:bg-blue-700 text-white")}
                aria-label="Partager sur Facebook"
            >
                <Facebook className="w-5 h-5" />
            </a>

            {/* Copy Link */}
            <button
                onClick={handleCopyLink}
                className={cn(
                    buttonClass,
                    copied
                        ? "bg-green-500 text-white"
                        : "bg-neutral-stone/20 hover:bg-neutral-stone/30 text-neutral-charcoal/60"
                )}
                aria-label="Copier le lien"
            >
                {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
            </button>
        </div>
    );
}
