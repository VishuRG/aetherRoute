'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { delhiLocations, DelhiLocation, demoReports, reportTypeMeta } from '@/lib/eco-data';

interface EcoMapProps {
  from?: DelhiLocation;
  to?: DelhiLocation;
  showAllMarkers?: boolean;
  className?: string;
  highlightRoute?: boolean;
}

const reportIcon = (emoji: string) =>
  L.divIcon({
    html: `<div style="font-size:18px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">${emoji}</div>`,
    className: 'eco-report-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const locationIcon = (active: boolean) =>
  L.divIcon({
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${
      active ? '#10b981' : '#64748b'
    };border:2px solid #fff;box-shadow:0 0 0 ${active ? '4px' : '0'} rgba(16,185,129,0.3)"></div>`,
    className: 'eco-location-marker',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

const fromIcon = L.divIcon({
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#10b981;border:3px solid #fff;box-shadow:0 0 0 5px rgba(16,185,129,0.25)"></div>',
  className: 'eco-from-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const toIcon = L.divIcon({
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#06b6d4;border:3px solid #fff;box-shadow:0 0 0 5px rgba(6,182,212,0.25)"></div>',
  className: 'eco-to-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({ from, to }: { from?: DelhiLocation; to?: DelhiLocation }) {
  const map = useMap();
  useEffect(() => {
    if (from && to) {
      map.fitBounds(
        [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ],
        { padding: [40, 40] }
      );
    } else {
      map.setView([28.59, 77.22], 11);
    }
  }, [from, to, map]);
  return null;
}

export default function EcoMapLeaflet({
  from,
  to,
  showAllMarkers = true,
  className = '',
  highlightRoute = false,
}: EcoMapProps) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!from || !to || !highlightRoute) {
      setRouteCoords([]);
      return;
    }
    let cancelled = false;
    setRouteLoading(true);
    setRouteCoords([]);

    const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
    fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.routes?.[0]?.geometry?.coordinates) return;
        const latlngs: [number, number][] = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        setRouteCoords(latlngs);
      })
      .catch(() => {
        if (cancelled) return;
        setRouteCoords([
          [from.lat, from.lng],
          [to.lat, to.lng],
        ]);
      })
      .finally(() => {
        if (!cancelled) setRouteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to, highlightRoute]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden rounded-xl ${className}`}>
      <MapContainer
        center={[28.59, 77.22]}
        zoom={11}
        scrollWheelZoom
        style={{ width: '100%', height: '100%', background: '#0f172a' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Dark-themed fallback: use CARTO dark tiles for a premium look
          // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitBounds from={from} to={to} />

        {showAllMarkers &&
          delhiLocations.map((loc) => {
            const isActive = from?.id === loc.id || to?.id === loc.id;
            return (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={locationIcon(isActive)}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{loc.name}</div>
                    <div className="text-xs text-slate-500">{loc.area}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {from && <Marker position={[from.lat, from.lng]} icon={fromIcon}><Popup><div className="font-semibold text-sm">{from.name}</div></Popup></Marker>}
        {to && <Marker position={[to.lat, to.lng]} icon={toIcon}><Popup><div className="font-semibold text-sm">{to.name}</div></Popup></Marker>}

        {highlightRoute && routeCoords.length > 0 && (
          <Polyline positions={routeCoords} pathOptions={{ color: '#10b981', weight: 4, opacity: 0.85 }} />
        )}

        {showAllMarkers &&
          demoReports
            .filter((r) => r.status === 'active')
            .map((report) => (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                icon={reportIcon(reportTypeMeta[report.type].icon)}
              >
                <Popup>
                  <div className="text-sm max-w-[180px]">
                    <div className="font-semibold">{reportTypeMeta[report.type].label}</div>
                    <div className="text-xs text-slate-500">{report.location}</div>
                    <div className="text-xs mt-1">{report.description}</div>
                    <div className="text-xs mt-1 font-medium text-emerald-600">{report.confirmations} confirmations</div>
                  </div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      {from && to && (
        <div className="absolute top-3 left-3 z-[400] rounded-lg bg-slate-900/85 px-3 py-2 border border-white/10 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-2 text-xs text-white/90">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {from.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/90 mt-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {to.name}
          </div>
        </div>
      )}

      {routeLoading && (
        <div className="absolute top-3 right-3 z-[400] rounded-lg bg-slate-900/85 px-3 py-1.5 border border-white/10 backdrop-blur-sm pointer-events-none">
          <span className="text-[11px] text-white/70 animate-pulse">Fetching live route…</span>
        </div>
      )}

      <div className="absolute bottom-3 right-3 z-[400] rounded-lg bg-slate-900/85 px-2.5 py-1.5 border border-white/10 backdrop-blur-sm pointer-events-none">
        <span className="text-[10px] text-white/50 font-mono">Live Map — Delhi NCR</span>
      </div>
    </div>
  );
}
