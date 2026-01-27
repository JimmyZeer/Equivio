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

        const bounds = L.latLngBounds(practitioners.map(p => [p.lat!, p.lng!] as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [practitioners, map]);

    return null;
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

            {validPractitioners.map((practitioner) => (
                <Marker
                    key={practitioner.id}
                    position={[practitioner.lat!, practitioner.lng!] as [number, number]}
                >
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
            ))}

            <MapBounds practitioners={validPractitioners} />
        </MapContainer>
    );
}
