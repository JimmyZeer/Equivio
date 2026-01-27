"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Practitioner } from "@/lib/practitioners";
import Link from "next/link";
import { Button } from "./ui/Button";

// Fix Leaflet Default Icon
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PractitionerMapProps {
    practitioners: Practitioner[];
}

function MapBounds({ practitioners }: { practitioners: Practitioner[] }) {
    const map = useMap();

    useEffect(() => {
        if (practitioners.length === 0) return;

        const bounds = L.latLngBounds(practitioners.map(p => {
            // Mock coordinates if missing (Real implementation needs lat/lng in DB)
            // For this demo, I'll generate mock coords around France if not present
            // Wait, do I have coords? The schema doesn't show lat/lat.
            // I will mock them deterministically based on ID to avoid jumping.
            // Actually, without lat/lng, the map is useless.
            // BUT user prompt implies "adding a map". 
            // I will assume for now I should use a geocoding service OR mock for the demo.
            // Given "Equivio" is a demo/prototype, I'll use deterministic mock coords near Paris/France centers for now
            // until real geocoding is added.

            // Pseudo-random lat/lng for demo purposes
            // Paris center: 48.8566, 2.3522
            const pseudoLat = 46.0 + (p.id.charCodeAt(0) % 5) + Math.random();
            const pseudoLng = 2.0 + (p.id.charCodeAt(p.id.length - 1) % 5) + Math.random();

            return [pseudoLat, pseudoLng] as [number, number];
        }));

        map.fitBounds(bounds, { padding: [50, 50] });
    }, [practitioners, map]);

    return null;
}

export default function PractitionerMap({ practitioners }: PractitionerMapProps) {
    // Filter practitioners with valid location (mocked here effectively always true)
    // In real app: practitioners.filter(p => p.lat && p.lng)

    // Deterministic mock coords function
    const getCoords = (p: Practitioner): [number, number] => {
        // Use quality_score or other number seeds
        const seed1 = p.id.charCodeAt(0);
        const seed2 = p.id.charCodeAt(p.id.length - 1);

        // Spread around France (Lat 43-50, Lng -4 - 7)
        // Center roughly 46.5, 2.5
        const lat = 44 + (seed1 % 6) + (seed2 * 0.01 % 1);
        const lng = 0 + (seed2 % 6) + (seed1 * 0.01 % 1);

        return [lat, lng];
    };

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

            {practitioners.map((practitioner) => {
                const position = getCoords(practitioner);
                return (
                    <Marker key={practitioner.id} position={position}>
                        <Popup>
                            <div className="p-1 space-y-2 text-center min-w-[200px]">
                                <h3 className="font-bold text-primary text-base">{practitioner.name}</h3>
                                <p className="text-sm text-neutral-charcoal">{practitioner.city}</p>
                                <div className="pt-2">
                                    <Link href={`/praticien/${practitioner.slug_seo}`} className="block w-full">
                                        <Button className="w-full text-xs h-8">Voir le profil</Button>
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}

            <MapBounds practitioners={practitioners} />
        </MapContainer>
    );
}
