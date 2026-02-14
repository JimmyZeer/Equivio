"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Filter, Map as MapIcon, Layers, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

// Custom Equivio marker icon (Green)
const equivioIcon = L.divIcon({
    className: "leaflet-marker-equivio",
    html: `<svg width="24" height="32" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" fill="#1F3D2B"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="#3A6B4F"/>
    </svg>`,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32],
});

// Custom Cluster Icon
const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    let size = 30;
    let className = "bg-emerald-600 border-4 border-emerald-100/50 text-white";

    if (count >= 10) {
        size = 40;
        className = "bg-emerald-700 border-4 border-emerald-200/50 text-white font-bold";
    }
    if (count >= 50) {
        size = 50;
        className = "bg-emerald-800 border-4 border-emerald-300/50 text-white font-black";
    }

    return L.divIcon({
        html: `<div class="${className} rounded-full flex items-center justify-center shadow-lg" style="width: ${size}px; height: ${size}px;">${count}</div>`,
        className: "bg-transparent", // Remove default leaflet background
        iconSize: L.point(size, size, true),
    });
};

interface AdminMapData {
    id: string;
    lat: number;
    lng: number;
    name: string;
    specialty: string;
    region?: string | null;
    city?: string | null;
}

interface AdminMapProps {
    practitioners: AdminMapData[];
}

export function AdminMap({ practitioners }: AdminMapProps) {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");

    // 1. Filter Data
    const filteredPractitioners = useMemo(() => {
        if (selectedSpecialty === "all") return practitioners;
        return practitioners.filter(p => p.specialty === selectedSpecialty);
    }, [practitioners, selectedSpecialty]);

    // 2. Calculate Regional Stats
    const regionStats = useMemo(() => {
        const stats: Record<string, number> = {};

        filteredPractitioners.forEach(p => {
            if (p.region) {
                stats[p.region] = (stats[p.region] || 0) + 1;
            } else {
                stats["Inconnu"] = (stats["Inconnu"] || 0) + 1;
            }
        });

        const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);

        return {
            top: sorted.slice(0, 5),
            flop: sorted.filter(([_, count]) => count < 5 && count > 0).slice(0, 5) // Regions with < 5 practitioners
        };
    }, [filteredPractitioners]);

    // 3. Specialties List for Filter
    const specialties = useMemo(() => {
        const specs = new Set(practitioners.map(p => p.specialty));
        return Array.from(specs).sort();
    }, [practitioners]);

    return (
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[600px]">

            {/* Sidebar Controls & Stats */}
            <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <MapIcon className="w-5 h-5 text-gray-600" />
                        Carte Praticiens
                    </h2>
                    <p className="text-xs text-gray-500">Visualisation de la couverture territoriale.</p>
                </div>

                {/* Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Filter className="w-3 h-3" />
                        Filtrer par spécialité
                    </label>
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        <option value="all">Toutes spécialités</option>
                        {specialties.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Top Regions */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            Zones les plus denses
                        </label>
                    </div>
                    <div className="space-y-2">
                        {regionStats.top.map(([region, count], i) => (
                            <div key={region} className="flex justify-between items-center text-sm p-2 rounded-lg bg-emerald-50/50">
                                <span className="font-medium text-gray-700 truncate max-w-[160px]">{i + 1}. {region}</span>
                                <span className="font-bold text-emerald-700">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Flop Regions */}
                {regionStats.flop.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-2">
                                <TrendingDown className="w-3 h-3" />
                                Zones à développer
                                <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded ml-2">&lt; 5 prats.</span>
                            </label>
                        </div>
                        <div className="space-y-2">
                            {regionStats.flop.map(([region, count]) => (
                                <div key={region} className="flex justify-between items-center text-sm p-2 rounded-lg bg-orange-50/50">
                                    <span className="font-medium text-gray-700 truncate max-w-[160px]">{region}</span>
                                    <span className="font-bold text-orange-600">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Map Area */}
            <div className="flex-1 relative z-0">
                <MapContainer
                    center={[46.603354, 1.888334]}
                    zoom={6}
                    className="w-full h-full z-0"
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterCustomIcon}
                    >
                        {filteredPractitioners.filter(p => p.lat && p.lng).map((p) => (
                            <Marker
                                key={p.id}
                                position={[p.lat, p.lng]}
                                icon={equivioIcon}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <b className="text-sm block mb-1">{p.name}</b>
                                        <span className="text-xs text-gray-500 block mb-1">{p.specialty}</span>
                                        <span className="text-xs text-gray-400 block">{p.city}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                </MapContainer>

                {/* Floating summary */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-gray-200 z-[1000] text-xs font-bold text-gray-600">
                    {filteredPractitioners.length} résultats affichés
                </div>
            </div>
        </div>
    );
}
