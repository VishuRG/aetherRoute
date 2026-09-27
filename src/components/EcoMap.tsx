"use client";

import React, { useEffect, useState } from "react";
import { Navigation, X } from "lucide-react";
import { DemoBadge } from "./DemoBadge";

export interface MapMarker {
  id: string;
  lat?: number;
  lng?: number;
  position?: { lat: number; lng: number };
  type?: "origin" | "destination" | "hazard" | "ev" | "hospital" | "police" | "community" | "alert" | "metro";
  title?: string;
  label?: string;
  color?: string;
}

interface EcoMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  showRoute?: boolean;
  originName?: string;
  destName?: string;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
}

// Simulated map using SVG + CSS — replaces Leaflet for CSR safety
export function EcoMap({
  center = { lat: 28.6139, lng: 77.209 },
  zoom = 12,
  markers = [],
  showRoute = false,
  originName,
  destName,
  className = "",
  interactive = true,
  showControls = true,
}: EcoMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMapLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleLocate = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setCurrentLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    }
  };

  // Convert lat/lng to SVG coords
  const toSVG = (lat: number, lng: number) => {
    const mapW = 800;
    const mapH = 500;
    const latRange = 0.3;
    const lngRange = 0.5;
    const x = ((lng - (center.lng - lngRange / 2)) / lngRange) * mapW;
    const y = mapH - ((lat - (center.lat - latRange / 2)) / latRange) * mapH;
    return { x, y };
  };

  const getMarkerColor = (type?: MapMarker["type"]) => {
    const colors: Record<string, string> = {
      origin: "#10b981",
      destination: "#f59e0b",
      hazard: "#ef4444",
      alert: "#ef4444",
      metro: "#10b981",
      ev: "#06b6d4",
      hospital: "#ec4899",
      police: "#3b82f6",
      community: "#f97316",
    };
    return (type && colors[type]) || "#10b981";
  };

  // Default demo markers for Delhi
  const defaultMarkers: MapMarker[] = [
    { id: "cp", lat: 28.6328, lng: 77.2197, type: "origin", label: "Connaught Place" },
    { id: "cc", lat: 28.495, lng: 77.0889, type: "destination", label: "Cyber City" },
    { id: "h1", lat: 28.5672, lng: 77.21, type: "hospital", label: "AIIMS Delhi" },
    { id: "ev1", lat: 28.633, lng: 77.2205, type: "ev", label: "EV Charger" },
    { id: "c1", lat: 28.629, lng: 77.2456, type: "community", label: "Pothole Report" },
  ];

  const allMarkers = markers.length > 0 ? markers : defaultMarkers;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ minHeight: 300 }}>
      {/* Map background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0f1a2e 0%, #0a1628 50%, #0d1f35 100%)",
        }}
      >
        {/* Grid lines (streets simulation) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4ade80" strokeWidth="0.5" />
            </pattern>
            <pattern id="bigGrid" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#4ade80" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#bigGrid)" />
        </svg>

        {/* Road network simulation */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
          {/* Major roads */}
          <g opacity="0.15" stroke="#94a3b8" fill="none">
            <path d="M 0 250 Q 200 230 400 260 Q 600 280 800 250" strokeWidth="8" />
            <path d="M 400 0 Q 420 150 400 250 Q 380 350 400 500" strokeWidth="8" />
            <path d="M 0 350 Q 300 330 600 360 Q 700 370 800 350" strokeWidth="5" />
            <path d="M 200 0 Q 220 200 200 500" strokeWidth="5" />
            <path d="M 600 0 Q 580 200 600 500" strokeWidth="5" />
            <path d="M 0 150 Q 400 160 800 150" strokeWidth="4" />
          </g>

          {/* Metro lines */}
          <g opacity="0.35" fill="none" strokeLinecap="round">
            {/* Yellow line */}
            <path d="M 400 80 L 405 250 L 410 420" stroke="#FDD900" strokeWidth="3" strokeDasharray="8,3" />
            {/* Blue line */}
            <path d="M 80 240 L 405 250 L 730 260" stroke="#0077C0" strokeWidth="3" strokeDasharray="8,3" />
            {/* Magenta line */}
            <path d="M 160 420 L 300 300 L 405 250 L 600 380" stroke="#AF145B" strokeWidth="3" strokeDasharray="8,3" />
          </g>

          {/* Route line if showing route */}
          {showRoute && (
            <path
              d="M 405 180 Q 400 250 300 350 Q 200 400 160 430"
              stroke="#10b981"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{ animation: "drawRoute 2s ease forwards" }}
              opacity="0.9"
            />
          )}

          {/* Markers */}
          {allMarkers.map((marker) => {
            const mLat = marker.lat ?? marker.position?.lat ?? 28.6139;
            const mLng = marker.lng ?? marker.position?.lng ?? 77.209;
            const mLabel = marker.label ?? marker.title;
            const { x, y } = toSVG(mLat, mLng);
            const color = getMarkerColor(marker.type);
            if (x < -20 || x > 820 || y < -20 || y > 520) return null;
            return (
              <g key={marker.id} onClick={() => setSelectedMarker(marker)} style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r="12" fill={color} opacity="0.2" />
                <circle cx={x} cy={y} r="6" fill={color} opacity="0.9" />
                <circle cx={x} cy={y} r="3" fill="white" />
                {mLabel && (
                  <text x={x + 10} y={y - 5} fontSize="9" fill="white" opacity="0.8" fontWeight="600">
                    {mLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* Current location */}
          {currentLocation && (
            <g>
              <circle cx={400} cy={250} r="16" fill="#10b981" opacity="0.15" />
              <circle cx={400} cy={250} r="8" fill="#10b981" opacity="0.6" />
              <circle cx={400} cy={250} r="4" fill="#10b981" />
              <circle cx={400} cy={250} r="3" fill="white" />
            </g>
          )}
        </svg>

        {/* Map overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
      </div>

      {/* Controls */}
      {showControls && mapLoaded && (
        <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleLocate}
            id="map-locate-btn"
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors"
            aria-label="Center on my location"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            id="map-zoom-in"
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white font-bold"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            id="map-zoom-out"
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white font-bold"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      )}

      {/* Marker popup */}
      {selectedMarker && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card-glow px-4 py-3 rounded-xl z-20 min-w-[160px] shadow-2xl">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: getMarkerColor(selectedMarker.type) }}
            />
            <span className="text-xs font-semibold text-white capitalize">{selectedMarker.type || "marker"}</span>
          </div>
          {(selectedMarker.label || selectedMarker.title) && (
            <p className="text-sm text-slate-300">{selectedMarker.label || selectedMarker.title}</p>
          )}
        </div>
      )}
    </div>
  );
}
