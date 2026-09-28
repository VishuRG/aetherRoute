"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Navigation, Leaf, Wallet, Clock, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, Zap, Sparkles, Filter, CheckCircle2, Ticket,
  MapPin, AlertCircle, ArrowLeft
} from "lucide-react";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";
import { EcoMap } from "@/components/EcoMap";
import { RouteResult } from "@/services/routing";
import { resolveLocation } from "@/lib/locations";

function RouteComparisonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const originParam = searchParams.get("origin") || "Connaught Place (Rajiv Chowk)";
  const destParam = searchParams.get("destination") || "DLF Cyber City, Gurugram";
  const originLatParam = searchParams.get("originLat");
  const originLngParam = searchParams.get("originLng");
  const destLatParam = searchParams.get("destLat");
  const destLngParam = searchParams.get("destLng");

  const originLoc = resolveLocation(
    originParam,
    originLatParam ? parseFloat(originLatParam) : undefined,
    originLngParam ? parseFloat(originLngParam) : undefined
  );
  const destLoc = resolveLocation(
    destParam,
    destLatParam ? parseFloat(destLatParam) : undefined,
    destLngParam ? parseFloat(destLngParam) : undefined
  );

  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "eco" | "cheapest" | "fastest">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originName: originLoc.name,
        originLat: originLoc.lat,
        originLng: originLoc.lng,
        destName: destLoc.name,
        destLat: destLoc.lat,
        destLng: destLoc.lng,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data.routes || []);
        if (data.routes?.length > 0) {
          setExpandedId(data.routes[0].id);
        }
      })
      .catch((err) => console.error("Error fetching routes:", err))
      .finally(() => setLoading(false));
  }, [originLoc.name, destLoc.name]);

  const filteredRoutes = routes.filter((r) => {
    if (filter === "eco") return r.mode === "Metro" || r.mode === "Bus";
    if (filter === "cheapest") return r.totalFare <= 60;
    if (filter === "fastest") return r.mode === "Cab" || r.totalDurationMin <= 45;
    return true;
  });

  const mapMarkers = [
    {
      id: "orig-m",
      lat: originLoc.lat,
      lng: originLoc.lng,
      label: `Start: ${originLoc.name.split(" ")[0]}`,
      type: "origin" as const,
    },
    {
      id: "dest-m",
      lat: destLoc.lat,
      lng: destLoc.lng,
      label: `End: ${destLoc.name.split(" ")[0]}`,
      type: "destination" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/plan")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Planner
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5" /> Multimodal Results
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {originLoc.name} → {destLoc.name}
          </h1>
        </div>
        <ServiceStatusBadge status="LIVE" label="Authentic DMRC & DTC Transit" />
      </div>

      {/* Mini Map View */}
      <div className="glass-card p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="h-56 sm:h-64 w-full rounded-2xl overflow-hidden border border-white/10 relative">
          <EcoMap
            markers={mapMarkers}
            showRoute={true}
            originName={originLoc.name}
            destName={destLoc.name}
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/8">
        <button
          onClick={() => setFilter("all")}
          id="routes-filter-all"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            filter === "all"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "glass-card text-slate-400 hover:text-white"
          }`}
        >
          All Routes ({routes.length})
        </button>
        <button
          onClick={() => setFilter("eco")}
          id="routes-filter-eco"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filter === "eco"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "glass-card text-slate-400 hover:text-white"
          }`}
        >
          🌱 Lowest Carbon
        </button>
        <button
          onClick={() => setFilter("cheapest")}
          id="routes-filter-cheapest"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filter === "cheapest"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "glass-card text-slate-400 hover:text-white"
          }`}
        >
          💰 Lowest Fare
        </button>
        <button
          onClick={() => setFilter("fastest")}
          id="routes-filter-fastest"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filter === "fastest"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "glass-card text-slate-400 hover:text-white"
          }`}
        >
          ⚡ Fastest
        </button>
      </div>

      {/* Routes List */}
      {loading ? (
        <div className="p-12 text-center glass-card rounded-3xl border border-white/10 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm font-bold text-white">Calculating Delhi-NCR Transit Matrix...</div>
          <div className="text-xs text-slate-400">Comparing Metro lines, DTC schedules, EV Cabs & traffic corridors</div>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-3xl border border-white/10 text-slate-400 text-sm">
          No routes matched your active filter. Try viewing all routes.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoutes.map((route) => {
            const isExpanded = expandedId === route.id;
            return (
              <div
                key={route.id}
                className={`glass-card rounded-3xl border transition-all overflow-hidden ${
                  route.isRecommended
                    ? "border-emerald-500/40 shadow-xl shadow-emerald-500/10"
                    : "border-white/10"
                }`}
              >
                {/* Header Row */}
                <div
                  className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : route.id)}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                      {route.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-white text-base sm:text-lg">{route.label}</span>
                        {route.isRecommended && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] tracking-wider uppercase border border-emerald-500/30">
                            ★ RECOMMENDED
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          {route.totalDistanceKm} km
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{route.description}</p>
                    </div>
                  </div>

                  {/* Badges / Metrics */}
                  <div className="flex items-center gap-4 sm:gap-6 self-end md:self-auto">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Duration</div>
                      <div className="text-base sm:text-lg font-black text-white font-mono flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> {route.totalDurationMin} min
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Estimated Fare</div>
                      <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                        ₹{route.totalFare}
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-slate-400 font-medium">Carbon</div>
                      <div className="text-base sm:text-lg font-black text-white font-mono">
                        {route.co2Kg.toFixed(2)} kg
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Turn Steps & Actions */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/8 space-y-5 bg-black/20">
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                        Turn-by-Turn Route Instructions
                      </h4>
                      <div className="space-y-3">
                        {route.steps.map((st) => (
                          <div
                            key={st.step}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/8 flex items-start gap-3 text-xs"
                          >
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                              {st.step}
                            </span>
                            <div className="flex-1">
                              <div className="font-bold text-white mb-0.5">{st.instructions}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>Mode: <strong className="text-slate-300">{st.mode}</strong></span>
                                <span>•</span>
                                <span>Distance: <strong className="text-slate-300">{st.distance} km</strong></span>
                                <span>•</span>
                                <span>Est: <strong className="text-slate-300">{st.duration} min</strong></span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Saves {route.co2SavedVsCarKg.toFixed(2)} kg CO₂ compared to a private car</span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {route.mode === "Metro" && (
                          <button
                            onClick={() =>
                              router.push(
                                `/tickets?from=${encodeURIComponent(originLoc.name)}&to=${encodeURIComponent(destLoc.name)}&fare=${route.totalFare}`
                              )
                            }
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                          >
                            <Ticket className="w-3.5 h-3.5 text-emerald-400" /> Book QR Ticket
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const params = new URLSearchParams({
                              origin: originLoc.name,
                              destination: destLoc.name,
                              mode: route.mode,
                              distance: route.totalDistanceKm.toString(),
                              duration: route.totalDurationMin.toString(),
                            });
                            router.push(`/navigation/${route.id}?${params.toString()}`);
                          }}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-black text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Start Live Navigation
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RoutesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading Route Results...</div>}>
      <RouteComparisonContent />
    </Suspense>
  );
}
