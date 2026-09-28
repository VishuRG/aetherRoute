"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Map, Navigation, Ticket, Wallet, Bot, AlertTriangle, CloudSun,
  Flame, TrendingDown, Clock, ChevronRight, Zap, ShieldAlert, Sparkles,
  MapPin, ArrowLeftRight, CheckCircle2, ShieldCheck, User
} from "lucide-react";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";
import { EcoMap } from "@/components/EcoMap";
import { DELHI_NCR_LOCATIONS, resolveLocation } from "@/lib/locations";
import { DEMO_WEATHER, DEMO_ALERTS } from "@/lib/demo-data";

export default function DashboardPage() {
  const router = useRouter();
  const [origin, setOrigin] = useState("Connaught Place (Rajiv Chowk)");
  const [destination, setDestination] = useState("DLF Cyber City, Gurugram");
  const [weather, setWeather] = useState<any>(DEMO_WEATHER);
  const [user, setUser] = useState<any>(null);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    // Fetch live weather
    fetch("/api/weather?city=Delhi")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setWeather(data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoadingWeather(false));

    // Fetch user profile from SQLite
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
          if (data.user.tickets?.length > 0) {
            setRecentTickets(data.user.tickets);
          }
        }
      })
      .catch((err) => console.warn(err));

    // Fetch tickets
    fetch("/api/tickets")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.tickets?.length > 0) {
          setRecentTickets(data.tickets);
        }
      })
      .catch(() => {});
  }, []);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handlePlanTrip = () => {
    const oLoc = resolveLocation(origin);
    const dLoc = resolveLocation(destination);
    const params = new URLSearchParams({
      origin: oLoc.name,
      originLat: oLoc.lat.toString(),
      originLng: oLoc.lng.toString(),
      destination: dLoc.name,
      destLat: dLoc.lat.toString(),
      destLng: dLoc.lng.toString(),
    });
    router.push(`/routes?${params.toString()}`);
  };

  // Compute accurate map markers for selected origin & destination
  const originLoc = resolveLocation(origin);
  const destLoc = resolveLocation(destination);

  const activeMapMarkers = [
    {
      id: "origin-marker",
      lat: originLoc.lat,
      lng: originLoc.lng,
      title: originLoc.name,
      label: `Origin: ${originLoc.name.split(" ")[0]}`,
      type: "origin" as const,
    },
    {
      id: "dest-marker",
      lat: destLoc.lat,
      lng: destLoc.lng,
      title: destLoc.name,
      label: `Dest: ${destLoc.name.split(" ")[0]}`,
      type: "destination" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Delhi-NCR Multimodal Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Welcome, {user?.name || "Eco Commuter"}! <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare DMRC Metro, DTC Buses, BluSmart EV Cabs, and Auto-Rickshaws with live AQI & traffic
          </p>
        </div>

        <ServiceStatusBadge status={weather.dataStatus || "LIVE"} label="Weather & Transit Engine" />
      </div>

      {/* Critical Alert Bar */}
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Navigation className="w-4 h-4" /> Quick Journey Planner
          </div>
          <span className="text-xs text-slate-400 font-medium">35+ Verified Delhi-NCR Hubs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative mb-4">
          {/* Origin selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Starting From (Origin)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                id="dash-origin-select"
                className="eco-input pl-10 pr-4 py-3.5 text-xs sm:text-sm appearance-none cursor-pointer font-medium"
              >
                {DELHI_NCR_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                    📍 {loc.name} ({loc.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap button */}
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Origin and Destination"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex w-9 h-9 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 items-center justify-center hover:scale-110 hover:bg-emerald-500 hover:text-black transition-all z-10 shadow-lg shadow-black/50"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Destination selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Going To (Destination)
            </label>
            <div className="relative">
              <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cyan-400" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                id="dash-dest-select"
                className="eco-input pl-10 pr-4 py-3.5 text-xs sm:text-sm appearance-none cursor-pointer font-medium"
              >
                {DELHI_NCR_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                    🎯 {loc.name} ({loc.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Optimal DMRC Metro & DTC Green Fleet calculation enabled</span>
          </div>
          <button
            onClick={handlePlanTrip}
            id="dash-search-routes-btn"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-black text-sm hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            Find Optimized Routes <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row with Live Weather */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weather Card */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center gap-4 hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">{weather.city || "Delhi"} Weather</div>
            <div className="text-xl font-black text-white font-mono flex items-center gap-1.5">
              {weather.temperature}°C
              <span className="text-xs text-slate-400 font-normal">({weather.condition || "Clear"})</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              AQI: <span className="text-amber-400 font-bold font-mono">{weather.aqi || 142}</span> (Moderate)
            </div>
          </div>
        </div>

        {/* Eco Streak */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center gap-4 hover:border-orange-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 shadow-lg shadow-orange-500/10">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Eco Streak</div>
            <div className="text-xl font-black text-white font-mono">
              {user?.ecoStreaks?.currentDays || 7} Days 🔥
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">Top 5% in Delhi Commuters</div>
          </div>
        </div>

        {/* Monthly CO2 Saved */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center gap-4 hover:border-emerald-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">CO₂ Saved / Month</div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {user?.ecoStreaks?.totalCo2Saved || 42.6} kg
            </div>
            <div className="text-[11px] text-slate-400">≈ 2 Mature Trees Planted 🌳</div>
          </div>
        </div>

        {/* Monthly Commute Spend */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center gap-4 hover:border-cyan-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Avg Monthly Spend</div>
            <div className="text-xl font-black text-white font-mono">₹2,340</div>
            <div className="text-[11px] text-emerald-400 font-medium font-mono">Saves ₹1,850 vs Solo Car</div>
          </div>
        </div>
      </div>

      {/* Main Map + Recent Trips Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Vector Map */}
        <div className="lg:col-span-2 glass-card p-4 rounded-3xl border border-white/10 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Map className="w-4 h-4 text-emerald-400" />
              <span>Live Delhi-NCR Route Visualization</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {originLoc.name.split(" ")[0]} → {destLoc.name.split(" ")[0]}
            </span>
          </div>

          <div className="h-80 w-full rounded-2xl overflow-hidden border border-white/10 relative shadow-inner">
            <EcoMap
              markers={activeMapMarkers}
              showRoute={true}
              originName={originLoc.name}
              destName={destLoc.name}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/tickets"
              id="dash-quick-ticket"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group shadow-lg"
            >
              <Ticket className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">QR Ticket</div>
              <div className="text-[10px] text-slate-400">DMRC / DTC AFCS</div>
            </Link>

            <Link
              href="/bookings"
              id="dash-quick-cab"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group shadow-lg"
            >
              <Zap className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Book EV Cab</div>
              <div className="text-[10px] text-slate-400">BluSmart / Uber</div>
            </Link>

            <Link
              href="/expenses"
              id="dash-quick-expenses"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group shadow-lg"
            >
              <Wallet className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Scan Expense</div>
              <div className="text-[10px] text-slate-400">OCR Receipt Claim</div>
            </Link>

            <Link
              href="/ai"
              id="dash-quick-ai"
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group shadow-lg"
            >
              <Bot className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">AI Advisory</div>
              <div className="text-[10px] text-slate-400">Transit Assistant</div>
            </Link>
          </div>

          {/* Active Ticket Widget */}
          {recentTickets.length > 0 && (
            <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                <span>Active DMRC Ticket</span>
                <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">VALID TODAY</span>
              </div>
              <p className="text-xs text-white font-semibold">
                {recentTickets[0].fromStation} → {recentTickets[0].toStation}
              </p>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                <span>Fare: ₹{recentTickets[0].fare}</span>
                <Link href="/tickets" className="text-emerald-400 hover:underline font-bold">
                  View QR Code →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
