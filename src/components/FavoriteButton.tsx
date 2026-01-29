"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { useState } from "react";

interface FavoriteButtonProps {
    practitionerId: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeConfig = {
    sm: { button: "w-8 h-8", icon: "w-4 h-4" },
    md: { button: "w-10 h-10", icon: "w-5 h-5" },
    lg: { button: "w-12 h-12", icon: "w-6 h-6" },
};

export function FavoriteButton({ practitionerId, size = "md", className = "" }: FavoriteButtonProps) {
    const { toggleFavorite, isFavorite, isLoaded } = useFavorites();
    const [isAnimating, setIsAnimating] = useState(false);

    const favorite = isFavorite(practitionerId);
    const config = sizeConfig[size];

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAnimating(true);
        toggleFavorite(practitionerId);

        // Reset animation after it completes
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Don't render anything during SSR or before hydration
    if (!isLoaded) {
        return (
            <button
                className={`${config.button} rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm border border-neutral-stone/30 text-neutral-charcoal/30 ${className}`}
                disabled
                aria-label="Chargement..."
            >
                <Heart className={config.icon} />
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`
                ${config.button}
                rounded-full
                flex items-center justify-center
                transition-all duration-200
                ${favorite
                    ? "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100"
                    : "bg-white/80 backdrop-blur-sm border-neutral-stone/30 text-neutral-charcoal/40 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                }
                border
                shadow-sm hover:shadow-md
                active:scale-95
                ${isAnimating ? "animate-favorite-pop" : ""}
                ${className}
            `}
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            <Heart
                className={`${config.icon} transition-transform duration-200 ${favorite ? "fill-current" : ""}`}
            />
        </button>
    );
}
