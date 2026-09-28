"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Navigation, X, Layers, Compass, ZoomIn, ZoomOut, MapPin } from "lucide-react";

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

export function EcoMap({
  center = { lat: 28.6139, lng: 77.209 },
  zoom = 12,
  markers = [],
  showRoute = true,
  originName,
  destName,
  className = "",
  interactive = true,
  showControls = true,
}: EcoMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setMapLoaded(true), 250);
    return () => clearTimeout(t);
  }, []);

  const handleLocate = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setCurrentLocation({ lat: 28.6328, lng: 77.2197 });
        }
      );
    } else {
      setCurrentLocation({ lat: 28.6328, lng: 77.2197 });
    }
  };

  // Compute dynamic bounding box for markers so they ALWAYS fit inside the SVG view
  const { mapCenter, latRange, lngRange } = useMemo(() => {
    const validCoords = markers
      .map((m) => ({
        lat: m.lat ?? m.position?.lat,
        lng: m.lng ?? m.position?.lng,
      }))
      .filter((c): c is { lat: number; lng: number } => typeof c.lat === "number" && typeof c.lng === "number");

    if (validCoords.length >= 2) {
      const minLat = Math.min(...validCoords.map((c) => c.lat));
      const maxLat = Math.max(...validCoords.map((c) => c.lat));
      const minLng = Math.min(...validCoords.map((c) => c.lng));
      const maxLng = Math.max(...validCoords.map((c) => c.lng));

      const spanLat = Math.max(0.18, (maxLat - minLat) * 1.55);
      const spanLng = Math.max(0.28, (maxLng - minLng) * 1.55);

      return {
        mapCenter: {
          lat: (minLat + maxLat) / 2,
          lng: (minLng + maxLng) / 2,
        },
        latRange: spanLat / zoomLevel,
        lngRange: spanLng / zoomLevel,
      };
    }

    return {
      mapCenter: center,
      latRange: 0.32 / zoomLevel,
      lngRange: 0.52 / zoomLevel,
    };
  }, [markers, center, zoomLevel]);

  // Convert lat/lng to SVG coordinates (800x500 viewport)
  const toSVG = (lat: number, lng: number) => {
    const mapW = 800;
    const mapH = 500;
    const x = ((lng - (mapCenter.lng - lngRange / 2)) / lngRange) * mapW;
    const y = mapH - ((lat - (mapCenter.lat - latRange / 2)) / latRange) * mapH;
    return { x, y };
  };

  const getMarkerColor = (type?: MapMarker["type"]) => {
    const colors: Record<string, string> = {
      origin: "#10b981", // Emerald
      destination: "#06b6d4", // Cyan
      hazard: "#ef4444", // Red
      alert: "#ef4444",
      metro: "#10b981",
      ev: "#10b981",
      hospital: "#ec4899",
      police: "#3b82f6",
      community: "#f97316",
    };
    return (type && colors[type]) || "#10b981";
  };

  // Find origin and destination markers to draw connecting route line
  const originMarker = markers.find((m) => m.type === "origin") || markers[0];
  const destMarker = markers.find((m) => m.type === "destination") || markers[1];

  let routePathD = "";
  if (originMarker && destMarker && markers.length >= 2) {
    const oLat = originMarker.lat ?? originMarker.position?.lat ?? 28.6328;
    const oLng = originMarker.lng ?? originMarker.position?.lng ?? 77.2197;
    const dLat = destMarker.lat ?? destMarker.position?.lat ?? 28.495;
    const dLng = destMarker.lng ?? destMarker.position?.lng ?? 77.0889;

    const start = toSVG(oLat, oLng);
    const end = toSVG(dLat, dLng);

    // Calculate a curved control point for natural route alignment
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 25;
    routePathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  }

  const geoapifyKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY || "d8d036b886b041ada9f25b8c893cca95";
  const staticMapUrl = geoapifyKey
    ? `https://maps.geoapify.com/v1/staticmap?style=dark-matter-purple-roads&width=800&height=500&center=lonlat:${mapCenter.lng},${mapCenter.lat}&zoom=${Math.max(9, Math.min(14, Math.round(10.5 + Math.log2(zoomLevel))))}&apiKey=${geoapifyKey}`
    : "";

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`} style={{ minHeight: 320 }}>
      {/* Map Canvas Background */}
      <div
        className="absolute inset-0 select-none"
        style={{
          background: "radial-gradient(ellipse at center, #0f1c33 0%, #080f1d 75%, #050b14 100%)",
        }}
      >
        {/* Geoapify Live Dark-Matter Map Layer */}
        {staticMapUrl && (
          <img
            src={staticMapUrl}
            alt="Geoapify Real-Time Map"
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen pointer-events-none"
          />
        )}
        {/* Street Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ecoGridSmall" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38bdf8" strokeWidth="0.4" />
            </pattern>
            <pattern id="ecoGridMajor" width="150" height="150" patternUnits="userSpaceOnUse">
              <path d="M 150 0 L 0 0 0 150" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ecoGridSmall)" />
          <rect width="100%" height="100%" fill="url(#ecoGridMajor)" />
        </svg>

        {/* Scaled Route and Markers SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
          <defs>
            {/* Glowing route gradient */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Delhi Arterial Corridors (Ring Road, NH-48, Noida Expressway simulation) */}
          <g opacity="0.18" stroke="#94a3b8" fill="none" strokeLinecap="round">
            {/* Ring Road Loop */}
            <ellipse cx="400" cy="240" rx="190" ry="140" strokeWidth="4" />
            {/* Outer Ring Road */}
            <ellipse cx="400" cy="240" rx="280" ry="200" strokeWidth="3" strokeDasharray="6,4" />
            {/* NH-48 Delhi-Gurugram Expressway */}
            <path d="M 380 240 L 260 380 L 180 460" strokeWidth="6" />
            {/* DND Flyway & Noida Expressway */}
            <path d="M 430 260 L 580 320 L 720 440" strokeWidth="5" />
            {/* GT Karnal Road */}
            <path d="M 390 220 L 370 40" strokeWidth="5" />
          </g>

          {/* Delhi Metro Network Corridors */}
          <g opacity="0.32" fill="none" strokeLinecap="round">
            {/* Yellow Line (Samaypur Badli <-> Millennium City Centre Gurugram) */}
            <path d="M 390 50 L 400 240 L 290 380 L 240 450" stroke="#EAB308" strokeWidth="3.5" strokeDasharray="10,4" />
            {/* Blue Line (Dwarka 21 <-> Noida City Centre / Vaishali) */}
            <path d="M 120 320 L 400 240 L 680 290" stroke="#0284C7" strokeWidth="3.5" strokeDasharray="10,4" />
            {/* Magenta Line (Janakpuri West <-> Botanical Garden) */}
            <path d="M 160 310 L 320 380 L 520 360 L 640 310" stroke="#C026D3" strokeWidth="3" strokeDasharray="8,3" />
            {/* Violet Line (Kashmere Gate <-> Raja Nahar Singh Faridabad) */}
            <path d="M 410 160 L 420 280 L 490 470" stroke="#7C3AED" strokeWidth="3" strokeDasharray="8,3" />
          </g>

          {/* Active Calculated Route Polyline */}
          {showRoute && routePathD && (
            <g filter="url(#routeGlow)">
              {/* Route shadow/halo */}
              <path d={routePathD} stroke="#10b981" strokeWidth="12" fill="none" opacity="0.2" />
              {/* Route main core */}
              <path
                d={routePathD}
                stroke="url(#routeGradient)"
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8,4"
              />
            </g>
          )}

          {/* Interactive Markers */}
          {markers.map((marker) => {
            const mLat = marker.lat ?? marker.position?.lat ?? 28.6139;
            const mLng = marker.lng ?? marker.position?.lng ?? 77.209;
            const mLabel = marker.label ?? marker.title;
            const { x, y } = toSVG(mLat, mLng);
            const color = getMarkerColor(marker.type);
            const isOrigin = marker.type === "origin";
            const isDest = marker.type === "destination";

            return (
              <g
                key={marker.id}
                onClick={() => setSelectedMarker(marker)}
                style={{ cursor: "pointer" }}
                className="transition-transform duration-200 hover:scale-125"
              >
                {/* Outer radar pulse for origin/destination */}
                {(isOrigin || isDest) && (
                  <circle cx={x} cy={y} r="18" fill={color} opacity="0.2">
                    <animate attributeName="r" values="8;22;8" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Marker ring */}
                <circle cx={x} cy={y} r={isOrigin || isDest ? "9" : "7"} fill={color} opacity="0.9" />
                <circle cx={x} cy={y} r="3.5" fill="#ffffff" />

                {/* Marker text pill */}
                {mLabel && (
                  <g>
                    <rect
                      x={x + 12}
                      y={y - 12}
                      width={Math.min(160, mLabel.length * 6.5 + 16)}
                      height="20"
                      rx="6"
                      fill="#060913"
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.92"
                    />
                    <text
                      x={x + 18}
                      y={y + 2}
                      fontSize="9.5"
                      fill="#ffffff"
                      fontWeight="bold"
                    >
                      {mLabel.length > 22 ? mLabel.substring(0, 20) + "…" : mLabel}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Current GPS location pin */}
          {currentLocation && (
            <g>
              {(() => {
                const { x, y } = toSVG(currentLocation.lat, currentLocation.lng);
                return (
                  <>
                    <circle cx={x} cy={y} r="20" fill="#10b981" opacity="0.15" />
                    <circle cx={x} cy={y} r="8" fill="#10b981" opacity="0.8" />
                    <circle cx={x} cy={y} r="3" fill="white" />
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Delhi-NCR Map Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-[10px] text-emerald-400 font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>DELHI-NCR GPS VECTOR GRID</span>
        </div>
      </div>

      {/* Floating Controls */}
      {showControls && mapLoaded && (
        <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleLocate}
            id="map-locate-btn"
            className="w-9 h-9 rounded-xl glass-card border border-white/10 flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:bg-white/10 transition-colors shadow-lg"
            title="My GPS Location"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            id="map-zoom-in"
            className="w-9 h-9 rounded-xl glass-card border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 font-bold transition-colors shadow-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            id="map-zoom-out"
            className="w-9 h-9 rounded-xl glass-card border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 font-bold transition-colors shadow-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selected Marker Details Popup */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs glass-card-glow p-4 rounded-2xl border border-white/15 z-20 shadow-2xl animate-in fade-in">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: getMarkerColor(selectedMarker.type) }}
            />
            <span className="text-xs font-bold text-emerald-400 capitalize">
              {selectedMarker.type || "Transit Hub"}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {selectedMarker.label || selectedMarker.title || "Delhi Location"}
          </h4>
          <p className="text-[11px] text-slate-400 font-mono">
            Lat: {(selectedMarker.lat ?? selectedMarker.position?.lat ?? 28.6139).toFixed(4)} • Lng: {(selectedMarker.lng ?? selectedMarker.position?.lng ?? 77.209).toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}
