"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);

        // Priority to exact coordinates if available and location text matches "Ma position"
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
        <div id="search-section" className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-premium border border-neutral-stone/50 overflow-hidden p-3 flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 flex flex-col px-6 py-2 gap-1.5 border-b md:border-b-0 md:border-r border-neutral-stone/20 group/input hover:bg-primary/5 transition-soft rounded-xl">
                <label className="text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] flex items-center gap-2">
                    <Search className="w-3.5 h-3.5" strokeWidth={2} />
                    Cœur de métier
                </label>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="ex: Ostéopathe, Dentiste..."
                    className="w-full bg-transparent border-none focus:ring-0 text-neutral-charcoal placeholder:text-neutral-charcoal/40 font-semibold py-1 px-0 text-lg"
                />
            </div>
            <div className="flex-1 flex flex-col px-6 py-2 gap-1.5 group/input hover:bg-primary/5 transition-soft rounded-xl relative">
                <label className="text-[10px] font-bold text-neutral-charcoal/40 uppercase tracking-[0.15em] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                    Localisation
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            if (e.target.value !== "📍 Ma position") setCoords(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Région, ville ou CP"
                        className="w-full bg-transparent border-none focus:ring-0 text-neutral-charcoal placeholder:text-neutral-charcoal/40 font-semibold py-1 px-0 text-lg"
                    />
                    <button
                        onClick={handleGeolocation}
                        title="Autour de moi"
                        className={`p-2 rounded-full hover:bg-neutral-stone/20 transition-colors ${isLocating ? 'animate-pulse text-primary' : 'text-neutral-charcoal/40'}`}
                    >
                        <MapPin className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <Button
                onClick={handleSearch}
                className="px-10 py-5 rounded-xl text-lg font-bold shadow-xl active:scale-[0.97] transition-all whitespace-nowrap"
            >
                Rechercher
            </Button>
        </div>
    );
}
