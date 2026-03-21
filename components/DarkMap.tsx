"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DarkMapProps {
    lat: number;
    lng: number;
    zoom?: number;
}

export default function DarkMap({ lat, lng, zoom = 12 }: DarkMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
            center: [lat, lng],
            zoom,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            maxZoom: 19,
        }).addTo(map);

        // Pulse animation only
        const pulseIcon = L.divIcon({
            className: "map-pulse-container",
            html: `<div class="map-pulse-ring"></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });
        L.marker([1.4871, 124.8453], { icon: pulseIcon, interactive: false }).addTo(map);

        mapInstance.current = map;

        // ResizeObserver to keep map centered when window resizes
        const ro = new ResizeObserver(() => {
            map.invalidateSize();
            map.setView([lat, lng], zoom);
        });
        ro.observe(mapRef.current);

        return () => {
            ro.disconnect();
            map.remove();
            mapInstance.current = null;
        };
    }, [lat, lng, zoom]);

    return (
        <div
            ref={mapRef}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                overflow: "hidden",
            }}
        />
    );
}
