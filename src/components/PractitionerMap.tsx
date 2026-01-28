"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Practitioner } from "@/lib/practitioners";
import Link from "next/link";
import { Button } from "./ui/Button";
import { MapPin, Stethoscope, Hammer, Zap, Heart, Activity } from "lucide-react";

// Custom Equivio marker icon (green)
const equivioIcon = L.divIcon({
    className: "leaflet-marker-equivio",
    html: `<svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" fill="#1F3D2B"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="#3A6B4F"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
});

// Custom cluster icon with Equivio styling
const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    let size = 40;
    if (count >= 10) size = 50;
    if (count >= 50) size = 60;

    return L.divIcon({
        html: `<div class="leaflet-cluster-custom" style="width: ${size}px; height: ${size}px;">${count}</div>`,
        className: "",
        iconSize: L.point(size, size, true),
    });
};

interface PractitionerMapProps {
    practitioners: Practitioner[];
}

function MapBounds({ practitioners }: { practitioners: Practitioner[] }) {
    const map = useMap();

    useEffect(() => {
        if (practitioners.length === 0) return;

        const bounds = L.latLngBounds(practitioners.map(p => [p.lat!, p.lng!] as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }, [practitioners, map]);

    return null;
}

// Get icon for specialty
function getSpecialtyIcon(specialty: string) {
    const iconMap: Record<string, React.ReactNode> = {
        "Ostéopathe animalier": <Stethoscope className="w-4 h-4" />,
        "Maréchal-ferrant": <Hammer className="w-4 h-4" />,
        "Dentisterie équine": <Zap className="w-4 h-4" />,
        "Vétérinaire équin": <Heart className="w-4 h-4" />,
        "Praticien bien-être": <Activity className="w-4 h-4" />,
    };
    return iconMap[specialty] || <MapPin className="w-4 h-4" />;
}

export default function PractitionerMap({ practitioners }: PractitionerMapProps) {
    // Filter practitioners with valid location
    const validPractitioners = useMemo(() => {
        return practitioners.filter(p => p.lat && p.lng);
    }, [practitioners]);

    return (
        <MapContainer
            center={[46.603354, 1.888334]}
            zoom={6}
            className="w-full h-full rounded-2xl z-0"
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterCustomIcon}
                maxClusterRadius={60}
                spiderfyOnMaxZoom
                showCoverageOnHover={false}
                animate
            >
                {validPractitioners.map((practitioner) => (
                    <Marker
                        key={practitioner.id}
                        position={[practitioner.lat!, practitioner.lng!] as [number, number]}
                        icon={equivioIcon}
                    >
                        <Popup className="equivio-popup">
                            <div className="p-2 space-y-3 min-w-[220px]">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        {getSpecialtyIcon(practitioner.specialty || "")}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-primary text-base leading-tight">{practitioner.name}</h3>
                                        <p className="text-xs text-neutral-charcoal/60">{practitioner.specialty}</p>
                                    </div>
                                </div>

                                {practitioner.city && (
                                    <div className="flex items-center gap-2 text-sm text-neutral-charcoal/80">
                                        <MapPin className="w-3.5 h-3.5 text-primary-soft" />
                                        <span>{practitioner.city}</span>
                                    </div>
                                )}

                                <Link href={`/praticien/${practitioner.slug_seo}`} className="block w-full">
                                    <Button className="w-full text-xs h-9 press-effect">
                                        Voir le profil
                                    </Button>
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

            <MapBounds practitioners={validPractitioners} />
        </MapContainer>
    );
}
