"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Navigation, Leaf, Wallet, Clock, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, Zap, Sparkles, Filter, CheckCircle2, Ticket
} from "lucide-react";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";
import { RouteResult } from "@/services/routing";

function RouteComparisonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const origin = searchParams.get("origin") || "Connaught Place";
  const destination = searchParams.get("destination") || "DLF Cyber City";

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
        originName: origin,
        destName: destination,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data.routes || []);
        if (data.routes?.length > 0) {
          setExpandedId(data.routes[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [origin, destination]);

  const filteredRoutes = routes.filter((r) => {
    if (filter === "eco") return r.co2Kg < 1.0;
    if (filter === "cheapest") return r.totalFare <= 60;
    if (filter === "fastest") return r.totalDurationMin <= 40;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5" /> Route Results
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {origin} → {destination}
          </h1>
        </div>
        <ServiceStatusBadge status={routes[0]?.dataStatus || "DEMO"} label="Multimodal Optimization" />
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
          🌱 Lowest CO₂
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
          💰 Cheapest
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

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Computing live NCR traffic, AQI, and transit options...</p>
        </div>
      )}

      {/* Routes List */}
      {!loading && (
        <div className="space-y-4">
          {filteredRoutes.map((route) => {
            const isExpanded = expandedId === route.id;
            return (
              <div
                key={route.id}
                className={`glass-card rounded-3xl border transition-all ${
                  route.isRecommended
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-xl shadow-emerald-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Route Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : route.id)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                      {route.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h2 className="text-lg font-bold text-white">{route.label}</h2>
                        <ServiceStatusBadge status={route.dataStatus || "DEMO"} />
                        {route.isRecommended && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-black text-[10px] font-black tracking-wider uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{route.description}</p>
                    </div>
                  </div>

                  {/* Metrics Badge Group */}
                  <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-white/8 justify-between md:justify-end">
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Duration</div>
                      <div className="text-base font-black text-white font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {route.totalDurationMin} <span className="text-xs font-normal text-slate-400">min</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Fare</div>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        ₹{route.totalFare}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">CO₂ Footprint</div>
                      <div className="text-base font-black text-cyan-400 font-mono">
                        {route.co2Kg} <span className="text-xs font-normal text-slate-400">kg</span>
                      </div>
                    </div>

                    <div className="text-slate-400 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Itinerary Steps */}
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-white/8 space-y-6">
                    <div className="space-y-3 pt-4">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Step-by-step Itinerary
                      </h3>
                      {route.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3 text-xs">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-white">
                              {step.mode} — {step.from} → {step.to}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              {step.duration} min • {step.distance} km {step.line ? `• (${step.line})` : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={() => router.push(`/navigation/${route.id}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`)}
                        id={`routes-start-nav-${route.id}`}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                      >
                        <Navigation className="w-4 h-4" /> Start Turn-by-Turn Navigation
                      </button>

                      {route.mode === "Metro" && (
                        <button
                          onClick={() => router.push(`/tickets?type=Metro&from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&fare=${route.totalFare}`)}
                          id={`routes-book-ticket-${route.id}`}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl glass-card border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-500/10 flex items-center justify-center gap-2 transition-all"
                        >
                          <Ticket className="w-4 h-4 text-emerald-400" /> Book Metro Ticket (₹{route.totalFare})
                        </button>
                      )}

                      {route.mode === "Cab" && (
                        <button
                          onClick={() => router.push(`/bookings?provider=BluSmart&fare=${route.totalFare}&from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`)}
                          id={`routes-book-cab-${route.id}`}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl glass-card border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/10 flex items-center justify-center gap-2 transition-all"
                        >
                          <Zap className="w-4 h-4 text-cyan-400" /> Book BluSmart EV Cab
                        </button>
                      )}
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

export default function RouteComparisonPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading routes...</div>}>
      <RouteComparisonContent />
    </Suspense>
  );
}
