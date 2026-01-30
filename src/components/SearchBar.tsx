"use client";

import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);

        if (coords && location === "📍 Ma position") {
            params.set("lat", coords.lat.toString());
            params.set("lng", coords.lng.toString());
            params.set("radius", "50");
        } else if (location) {
            params.set("l", location);
        }

        router.push(`/search?${params.toString()}`);
    };

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocation("📍 Ma position");
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Impossible de récupérer votre position. Vérifiez vos paramètres.");
                setIsLocating(false);
            }
        );
    };

    return (
        <div
            id="search-section"
            className={`
                w-full max-w-3xl mx-auto
                bg-white rounded-full
                border-2 border-neutral-stone/60
                flex items-center
                transition-all duration-300 ease-out
                ${isFocused
                    ? 'shadow-[0_8px_30px_rgba(31,61,43,0.18),0_4px_12px_rgba(0,0,0,0.08)] scale-[1.02] border-primary/40'
                    : 'shadow-[0_3px_12px_rgba(0,0,0,0.1),0_8px_24px_rgba(31,61,43,0.12)] hover:shadow-[0_6px_20px_rgba(31,61,43,0.2),0_12px_32px_rgba(0,0,0,0.1)] hover:border-primary/30'
                }
            `}
        >
            {/* Specialty Field */}
            <div
                className="flex-1 flex items-center gap-3 px-6 py-5 border-r-2 border-neutral-stone/40 hover:bg-primary/5 transition-colors rounded-l-full"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary-soft/20 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-neutral-charcoal/50 uppercase tracking-wider mb-0.5">
                        Spécialité
                    </label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ostéopathe, Dentiste..."
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-neutral-charcoal placeholder:text-neutral-charcoal/40 text-sm font-semibold"
                    />
                </div>
            </div>

            {/* Location Field */}
            <div
                className="flex-1 flex items-center gap-3 px-6 py-5 hover:bg-primary/5 transition-colors"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <div className="w-8 h-8 bg-gradient-to-br from-leather/10 to-leather-light/30 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-leather" strokeWidth={2} />
                </div>
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-neutral-charcoal/50 uppercase tracking-wider mb-0.5">
                        Localisation
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            if (e.target.value !== "📍 Ma position") setCoords(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Région, ville ou CP"
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-neutral-charcoal placeholder:text-neutral-charcoal/40 text-sm font-semibold"
                    />
                </div>
                <button
                    onClick={handleGeolocation}
                    title="Autour de moi"
                    className={`p-2 rounded-full hover:bg-leather/10 transition-all ${isLocating ? 'animate-pulse text-primary' : 'text-neutral-charcoal/40 hover:text-leather'}`}
                >
                    <MapPin className="w-4 h-4" />
                </button>
            </div>

            {/* Search Button */}
            <button
                onClick={handleSearch}
                className="
                    m-2 p-4
                    bg-gradient-to-br from-primary via-primary to-primary-soft
                    text-white rounded-full
                    transition-all duration-300
                    hover:scale-110 active:scale-95
                    shadow-[0_4px_14px_rgba(31,61,43,0.4)] hover:shadow-[0_8px_24px_rgba(31,61,43,0.5)]
                "
                aria-label="Rechercher"
            >
                <Search className="w-5 h-5" strokeWidth={2.5} />
            </button>
        </div>
    );
}
