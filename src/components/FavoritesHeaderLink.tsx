"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import Link from "next/link";

interface FavoritesHeaderLinkProps {
    className?: string;
    showLabel?: boolean;
}

export function FavoritesHeaderLink({ className = "", showLabel = false }: FavoritesHeaderLinkProps) {
    const { favorites, isLoaded } = useFavorites();

    const count = favorites.length;

    return (
        <Link
            href="/favoris"
            className={`relative flex items-center gap-2 text-neutral-charcoal/60 hover:text-rose-500 transition-colors ${className}`}
            title="Mes favoris"
        >
            <div className="relative">
                <Heart className="w-5 h-5" />
                {isLoaded && count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </div>
            {showLabel && (
                <span className="font-semibold">Favoris</span>
            )}
        </Link>
    );
}
