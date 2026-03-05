"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Types
interface MapPoint {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryDisplay: string;
  color: string;
  lat: number;
  lon: number;
  location: string;
  contact?: string;
  hours?: string;
  status?: string;
}

interface MapHighlight {
  name: string;
  lat: number;
  lon: number;
  category: string;
}

interface CityMapProps {
  activeLayers: Set<string>;
  highlights: MapHighlight[];
}

// We need to dynamically import because Leaflet needs window
function CityMapInner({ activeLayers, highlights }: CityMapProps) {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [L, setL] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  // Load Leaflet
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet.default);
      });
    }
  }, []);

  // Fetch map points
  useEffect(() => {
    fetch("/api/v1/map/points")
      .then((r) => r.json())
      .then(setPoints)
      .catch(() => {});
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [32.3792, -86.3077],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [L]);

  // Update markers when points or active layers change
  useEffect(() => {
    if (!L || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filteredPoints = points.filter((p) => activeLayers.has(p.category));

    filteredPoints.forEach((point) => {
      const isHighlighted = highlights.some(
        (h) =>
          Math.abs(h.lat - point.lat) < 0.001 &&
          Math.abs(h.lon - point.lon) < 0.001
      );

      const size = isHighlighted ? 16 : 10;
      const pulseClass = isHighlighted ? "marker-pulse" : "";

      const icon = L.divIcon({
        className: `${pulseClass}`,
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background: ${point.color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 ${isHighlighted ? "12" : "6"}px ${point.color};
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([point.lat, point.lon], { icon }).addTo(
        mapRef.current
      );

      marker.bindPopup(`
        <div style="min-width: 200px; font-family: Inter, sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${point.color};"></div>
            <span style="font-size: 11px; color: ${point.color}; text-transform: uppercase; letter-spacing: 1px;">${point.categoryDisplay}</span>
          </div>
          <h3 style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 6px;">${point.name}</h3>
          <p style="font-size: 12px; color: #aaa; line-height: 1.4; margin-bottom: 8px;">${point.description.substring(0, 120)}...</p>
          ${point.location ? `<p style="font-size: 11px; color: #888;">📍 ${point.location}</p>` : ""}
          ${point.contact ? `<p style="font-size: 11px; color: #888;">📞 ${point.contact}</p>` : ""}
          ${point.hours ? `<p style="font-size: 11px; color: #888;">🕐 ${point.hours}</p>` : ""}
        </div>
      `);

      markersRef.current.push(marker);
    });
  }, [L, points, activeLayers, highlights]);

  // Fly to highlighted points
  useEffect(() => {
    if (!mapRef.current || highlights.length === 0) return;
    const first = highlights[0];
    mapRef.current.flyTo([first.lat, first.lon], 14, { duration: 1.5 });
  }, [highlights]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  );
}

// Dynamic import wrapper to disable SSR
const CityMap = dynamic(() => Promise.resolve(CityMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-montgomery-card flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-montgomery-gold/30 border-t-montgomery-gold rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading Montgomery Map...</p>
      </div>
    </div>
  ),
});

export default CityMap;
