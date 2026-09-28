// Interactive Map Component
// Powered by Leaflet & CARTO OSM tiles (Positron for Light, Dark Matter for Dark)
// Features animated flowing polyline, bouncing SVG markers, pulsing rings, and layer filters

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAppStore } from "@/store/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { Zap, Fuel, AlertTriangle, Layers, Navigation } from "lucide-react";

export const MapView: React.FC<{ className?: string }> = ({ className = "" }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  const { isDark } = useTheme();
  const routes = useAppStore((s) => s.routes);
  const selectedRouteId = useAppStore((s) => s.selectedRouteId);
  const chargers = useAppStore((s) => s.chargers);
  const petrolStations = useAppStore((s) => s.petrolStations);
  const problems = useAppStore((s) => s.problems);
  const filters = useAppStore((s) => s.filters);
  const toggleLayer = useAppStore((s) => s.toggleLayer);
  const setSelectedEntity = useAppStore((s) => s.setSelectedEntity);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.5495, 77.155],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
    });

    // Custom Top-Right Zoom Control
    L.control.zoom({ position: "topright" }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update CARTO Tiles when Theme Changes (Positron vs Dark Matter)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>';

    const newLayer = L.tileLayer(tileUrl, {
      subdomains: "abcd",
      maxZoom: 19,
      attribution,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [isDark]);

  // Update Route Polyline with flowing animation
  useEffect(() => {
    if (!mapInstanceRef.current || !activeRoute) return;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
    }

    // Convert [lng, lat] to Leaflet [lat, lng]
    const latLngs = activeRoute.polyline.map(([lng, lat]) => [lat, lng] as [number, number]);

    // Outer glow polyline
    const routeLine = L.polyline(latLngs, {
      color: activeRoute.color || "#1E7F4F",
      weight: 6,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
      dashArray: "12, 10",
      className: "animate-pulseSlow",
    }).addTo(mapInstanceRef.current);

    routeLayerRef.current = routeLine;

    // Fit map bounds to route
    mapInstanceRef.current.fitBounds(routeLine.getBounds(), {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [activeRoute]);

  // Update Markers (Chargers, Petrol, Problems)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Origin & Destination Markers
    if (activeRoute?.polyline?.length) {
      const origin = activeRoute.polyline[0];
      const dest = activeRoute.polyline[activeRoute.polyline.length - 1];

      // Origin Pin
      const originIcon = L.divIcon({
        className: "custom-pin",
        html: `<div class="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shadow-glowGreen border-2 border-white animate-bounce">A</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([origin[1], origin[0]], { icon: originIcon }).addTo(markersLayerRef.current);

      // Destination Pin
      const destIcon = L.divIcon({
        className: "custom-pin",
        html: `<div class="w-8 h-8 rounded-full bg-vibrant-orange text-white flex items-center justify-center font-bold text-xs shadow-glowOrange border-2 border-white animate-bounce">B</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([dest[1], dest[0]], { icon: destIcon }).addTo(markersLayerRef.current);
    }

    // 2. EV Chargers (Green Bolt with Pulsing Ring)
    if (filters.showChargers) {
      chargers.forEach((ch) => {
        const isAvail = ch.status === "available";
        const iconHtml = `
          <div class="relative cursor-pointer group">
            ${isAvail ? '<span class="absolute -inset-1 rounded-full bg-forest-mint animate-ping opacity-60"></span>' : ""}
            <div class="relative w-8 h-8 rounded-full ${
              isAvail ? "bg-forest text-white" : "bg-gray-500 text-gray-200"
            } flex items-center justify-center shadow-md border-2 border-white transform transition-transform group-hover:scale-125">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-dark-bg/90 text-cream text-[9px] font-mono font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              ${ch.powerKw}kW • ${ch.availablePorts}/${ch.totalPorts}
            </div>
          </div>
        `;
        const marker = L.marker([ch.location.lat, ch.location.lng], {
          icon: L.divIcon({ className: "custom-poi", html: iconHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
        });
        marker.on("click", () => setSelectedEntity(ch));
        marker.addTo(markersLayerRef.current!);
      });
    }

    // 3. Petrol Pumps (Orange Fuel Drop with Best Price Badge)
    if (filters.showPetrolPumps) {
      petrolStations.forEach((ps) => {
        const iconHtml = `
          <div class="relative cursor-pointer group">
            ${
              ps.isBestPrice
                ? '<span class="absolute -top-3 -right-2 px-1 rounded-sm bg-sun text-dark-bg font-extrabold text-[8px] shadow-sm z-10">BEST</span>'
                : ""
            }
            <div class="w-8 h-8 rounded-full bg-vibrant-orange text-white flex items-center justify-center shadow-md border-2 border-white transform transition-transform group-hover:scale-125">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22v-8.5a4.5 4.5 0 0 1 9 0V22"></path><path d="M18 22v-7a3 3 0 0 0-3-3h-3"></path><path d="M14 9V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path></svg>
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-dark-bg/90 text-cream text-[9px] font-mono font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              ₹${ps.pricePerLiter}/L
            </div>
          </div>
        `;
        const marker = L.marker([ps.location.lat, ps.location.lng], {
          icon: L.divIcon({ className: "custom-poi", html: iconHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
        });
        marker.on("click", () => setSelectedEntity(ps));
        marker.addTo(markersLayerRef.current!);
      });
    }

    // 4. Live Problems (Pulsing Orange with Hazard Stripe Accent)
    if (filters.showLiveProblems) {
      problems.forEach((prob) => {
        const iconHtml = `
          <div class="relative cursor-pointer group">
            <span class="absolute -inset-1 rounded-full bg-vibrant-orange animate-ping opacity-75"></span>
            <div class="relative w-8 h-8 rounded-full bg-vibrant-orange text-dark-bg flex items-center justify-center shadow-glowOrange border-2 border-sun transform transition-transform group-hover:scale-125" style="background: repeating-linear-gradient(45deg, #FF7A1A, #FF7A1A 6px, #FFC93C 6px, #FFC93C 12px);">
              <svg class="text-dark-bg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
            </div>
          </div>
        `;
        const marker = L.marker([prob.location.lat, prob.location.lng], {
          icon: L.divIcon({ className: "custom-poi", html: iconHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
        });
        marker.on("click", () => setSelectedEntity(prob));
        marker.addTo(markersLayerRef.current!);
      });
    }
  }, [chargers, petrolStations, problems, filters, activeRoute, setSelectedEntity]);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-3xl ${className}`}>
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Filter Overlay Toggle Bar */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1.5 rounded-2xl glass-panel shadow-layered">
        {/* EV Chargers Layer Toggle */}
        <button
          onClick={() => toggleLayer("showChargers")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filters.showChargers
              ? "bg-forest text-white shadow-soft"
              : "bg-cream-warm/70 dark:bg-dark-card/70 text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream"
          }`}
          title="Toggle EV Chargers on map"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Chargers</span>
        </button>

        {/* Petrol Stations Layer Toggle */}
        <button
          onClick={() => toggleLayer("showPetrolPumps")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filters.showPetrolPumps
              ? "bg-vibrant-orange text-white shadow-soft"
              : "bg-cream-warm/70 dark:bg-dark-card/70 text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream"
          }`}
          title="Toggle Fuel Pumps on map"
        >
          <Fuel className="w-3.5 h-3.5" />
          <span>Pumps</span>
        </button>

        {/* Live Problems Layer Toggle */}
        <button
          onClick={() => toggleLayer("showLiveProblems")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filters.showLiveProblems
              ? "bg-sun text-dark-bg shadow-soft"
              : "bg-cream-warm/70 dark:bg-dark-card/70 text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream"
          }`}
          title="Toggle Live Road Hazards on map"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Hazards</span>
        </button>
      </div>

      {/* Recenter Map Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current && routeLayerRef.current) {
            mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
              padding: [40, 40],
              maxZoom: 14,
            });
          }
        }}
        className="absolute bottom-6 right-6 z-30 p-3 rounded-2xl glass-panel text-dark-bg dark:text-cream shadow-layered hover:bg-forest hover:text-white transition-colors"
        title="Recenter route on map"
      >
        <Navigation className="w-5 h-5" />
      </button>
    </div>
  );
};
