"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Map, Navigation, Ticket, Wallet, Bot, AlertTriangle, CloudSun,
  Flame, TrendingDown, Clock, ChevronRight, Zap, ShieldAlert, Sparkles, MapPin
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { EcoMap } from "@/components/EcoMap";
import { DEMO_DELHI_LOCATIONS, DEMO_JOURNEY_HISTORY, DEMO_WEATHER, DEMO_ALERTS } from "@/lib/demo-data";

export default function DashboardPage() {
  const router = useRouter();
  const [origin, setOrigin] = useState("Connaught Place (Rajiv Chowk)");
  const [destination, setDestination] = useState("DLF Cyber City, Gurugram");
  const [weather, setWeather] = useState(DEMO_WEATHER);

  useEffect(() => {
    fetch("/api/weather?city=Delhi")
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => {});
  }, []);

  const handlePlanTrip = () => {
    const params = new URLSearchParams({
      origin,
      destination,
    });
    router.push(`/routes?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Demo Mode Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Delhi-NCR Commute Hub <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multimodal travel, carbon metrics, & transit status
          </p>
        </div>
        <DemoBadge message="Simulated Live Transit Feed" />
      </div>

      {/* Critical Alert Bar if any */}
      {DEMO_ALERTS.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border border-amber-500/30 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-300 mr-2">{DEMO_ALERTS[0].title}:</span>
            <span className="text-slate-300">{DEMO_ALERTS[0].message}</span>
          </div>
          <Link
            href="/notifications"
            className="text-xs font-bold text-amber-400 hover:underline shrink-0"
          >
            View Alerts
          </Link>
        </div>
      )}

      {/* Quick Trip Planner Widget */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Navigation className="w-4 h-4" /> Quick Journey Planner
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Starting From</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                id="dash-origin-select"
                className="eco-input pl-10 py-3 text-sm appearance-none cursor-pointer"
              >
                {DEMO_DELHI_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Going To</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                id="dash-dest-select"
                className="eco-input pl-10 py-3 text-sm appearance-none cursor-pointer"
              >
                {DEMO_DELHI_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live traffic, AQI & weather optimization enabled
          </div>
          <button
            onClick={handlePlanTrip}
            id="dash-search-routes-btn"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
          >
            Find Optimized Routes <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weather Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">{weather.city} Weather</div>
            <div className="text-xl font-black text-white font-mono">{weather.temperature}°C</div>
            <div className="text-[11px] text-slate-400">
              AQI: <span className="text-amber-400 font-bold">{weather.aqi || 142}</span> (Moderate)
            </div>
          </div>
        </div>

        {/* Eco Streak */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Eco Streak</div>
            <div className="text-xl font-black text-white font-mono">7 Days 🔥</div>
            <div className="text-[11px] text-emerald-400 font-medium">Top 5% in Delhi</div>
          </div>
        </div>

        {/* Monthly CO2 Saved */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">CO₂ Saved This Month</div>
            <div className="text-xl font-black text-emerald-400 font-mono">42.6 kg</div>
            <div className="text-[11px] text-slate-400">≈ 2 Trees Planted 🌳</div>
          </div>
        </div>

        {/* Monthly Spend */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Monthly Travel Spend</div>
            <div className="text-xl font-black text-white font-mono">₹2,340</div>
            <div className="text-[11px] text-emerald-400 font-medium font-mono">Saves ₹480 vs last mo</div>
          </div>
        </div>
      </div>

      {/* Main Map + Recent Trips Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Preview */}
        <div className="lg:col-span-2 glass-card p-4 rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Map className="w-4 h-4 text-emerald-400" /> Live Delhi-NCR Transit & Incident Map
            </div>
            <Link href="/plan" className="text-xs text-emerald-400 hover:underline">Full Map</Link>
          </div>
          <div className="h-72 w-full rounded-2xl overflow-hidden border border-white/10 relative">
            <EcoMap
              center={{ lat: 28.6328, lng: 77.2197 }}
              zoom={11}
              markers={[
                { id: "1", position: { lat: 28.6328, lng: 77.2197 }, title: "Connaught Place", type: "metro" },
                { id: "2", position: { lat: 28.4950, lng: 77.0889 }, title: "DLF Cyber City", type: "metro" },
                { id: "3", position: { lat: 28.6290, lng: 77.2456 }, title: "Pothole Alert (ITO)", type: "alert" },
              ]}
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/tickets"
              id="dash-quick-ticket"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
            >
              <Ticket className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">QR Ticket</div>
              <div className="text-[10px] text-slate-400">Metro / DTC Bus</div>
            </Link>

            <Link
              href="/bookings"
              id="dash-quick-cab"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group"
            >
              <Zap className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Book EV Cab</div>
              <div className="text-[10px] text-slate-400">BluSmart / Uber</div>
            </Link>

            <Link
              href="/expenses"
              id="dash-quick-expense"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group"
            >
              <Wallet className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Scan Expense</div>
              <div className="text-[10px] text-slate-400">OCR Receipt</div>
            </Link>

            <Link
              href="/ai"
              id="dash-quick-ai"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group"
            >
              <Bot className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Ask AI</div>
              <div className="text-[10px] text-slate-400">Travel Assistant</div>
            </Link>
          </div>

          {/* Emergency SOS Banner */}
          <Link
            href="/emergency"
            id="dash-emergency-banner"
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between hover:bg-red-500/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-300">1-Click Emergency SOS</div>
                <div className="text-[10px] text-slate-400">Broadcast location to police & contacts</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </Link>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Recent Trips & Saved Journeys
          </h2>
          <Link href="/analytics" className="text-xs text-emerald-400 hover:underline">View History</Link>
        </div>

        <div className="divide-y divide-white/8">
          {DEMO_JOURNEY_HISTORY.map((j) => (
            <div key={j.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  {j.mode === "Metro" ? "🚇" : j.mode === "Bus" ? "🚌" : "🚖"}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{j.from} → {j.to}</div>
                  <div className="text-slate-400 text-[11px]">{j.date} • {j.duration} mins • {j.distance} km</div>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-center">
                <div className="text-right">
                  <div className="font-bold text-emerald-400 font-mono">₹{j.cost}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{j.co2Kg} kg CO₂</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase">
                  {j.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
