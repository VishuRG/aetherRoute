"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Navigation, SlidersHorizontal, Clock, Zap, Leaf,
  Bus, Car, Bike, Sparkles, Check, Accessibility
} from "lucide-react";
import { EcoMap } from "@/components/EcoMap";
import { DemoBadge } from "@/components/DemoBadge";
import { DEMO_DELHI_LOCATIONS } from "@/lib/demo-data";

export default function PlanJourneyPage() {
  const router = useRouter();
  const [origin, setOrigin] = useState("Connaught Place (Rajiv Chowk)");
  const [destination, setDestination] = useState("DLF Cyber City, Gurugram");
  const [maxWalking, setMaxWalking] = useState(15);
  const [preferEco, setPreferEco] = useState(true);
  const [wheelchair, setWheelchair] = useState(false);
  const [avoidTraffic, setAvoidTraffic] = useState(true);
  const [selectedModes, setSelectedModes] = useState<string[]>(["Metro", "Bus", "Cab", "Auto"]);

  const toggleMode = (mode: string) => {
    if (selectedModes.includes(mode)) {
      setSelectedModes(selectedModes.filter((m) => m !== mode));
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  const handleCalculateRoutes = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      origin,
      destination,
      maxWalking: maxWalking.toString(),
      preferEco: preferEco.toString(),
      wheelchair: wheelchair.toString(),
      modes: selectedModes.join(","),
    });
    router.push(`/routes?${query.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Multimodal Journey Planner <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare Metro, Bus, Cab & Auto routes optimized for Delhi-NCR emissions and traffic
          </p>
        </div>
        <DemoBadge message="Interactive NCR Route Planner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planner Form */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <form onSubmit={handleCalculateRoutes} className="space-y-6">
            {/* Origin & Destination */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Starting Point (Origin)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    id="plan-origin-select"
                    className="eco-input pl-10 py-3.5 text-sm appearance-none cursor-pointer"
                  >
                    {DEMO_DELHI_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                        📍 {loc.name} ({loc.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Destination
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cyan-400" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    id="plan-dest-select"
                    className="eco-input pl-10 py-3.5 text-sm appearance-none cursor-pointer"
                  >
                    {DEMO_DELHI_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                        🎯 {loc.name} ({loc.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Allowed Modes Selectors */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Select Transport Modes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "Metro", label: "Delhi Metro", icon: "🚇" },
                  { id: "Bus", label: "DTC Bus", icon: "🚌" },
                  { id: "Cab", label: "Cab / EV", icon: "🚖" },
                  { id: "Auto", label: "Auto Rickshaw", icon: "🛺" },
                ].map((mode) => {
                  const isSelected = selectedModes.includes(mode.id);
                  return (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={() => toggleMode(mode.id)}
                      id={`plan-mode-${mode.id.toLowerCase()}`}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500/40 text-white"
                          : "bg-white/5 border-white/8 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{mode.icon}</span>
                      <span>{mode.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferences Section */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Commute Preferences</span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-400">Max Walking Distance:</span>
                  <span className="text-emerald-400 font-mono font-bold">{maxWalking} mins</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={maxWalking}
                  onChange={(e) => setMaxWalking(Number(e.target.value))}
                  id="plan-walking-slider"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreferEco(!preferEco)}
                  id="plan-pref-eco"
                  className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                    preferEco
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-white/5 border-white/8 text-slate-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5" /> Lowest CO₂</span>
                  <div className={`w-3.5 h-3.5 rounded-full ${preferEco ? "bg-emerald-400" : "bg-slate-700"}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setAvoidTraffic(!avoidTraffic)}
                  id="plan-pref-traffic"
                  className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                    avoidTraffic
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-white/5 border-white/8 text-slate-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Avoid Traffic</span>
                  <div className={`w-3.5 h-3.5 rounded-full ${avoidTraffic ? "bg-cyan-400" : "bg-slate-700"}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setWheelchair(!wheelchair)}
                  id="plan-pref-wheelchair"
                  className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                    wheelchair
                      ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                      : "bg-white/5 border-white/8 text-slate-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Accessibility className="w-3.5 h-3.5" /> Wheelchair</span>
                  <div className={`w-3.5 h-3.5 rounded-full ${wheelchair ? "bg-purple-400" : "bg-slate-700"}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="plan-submit-btn"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-base hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Calculate Optimized Multimodal Routes
            </button>
          </form>
        </div>

        {/* Map Preview & Details */}
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Route Coordinates Map
            </div>
            <div className="h-64 w-full rounded-2xl overflow-hidden border border-white/10">
              <EcoMap
                center={{ lat: 28.5639, lng: 77.1543 }}
                zoom={10}
                markers={[
                  { id: "org", position: { lat: 28.6328, lng: 77.2197 }, title: origin },
                  { id: "dst", position: { lat: 28.4950, lng: 77.0889 }, title: destination },
                ]}
              />
            </div>
            <div className="text-[11px] text-slate-400 px-1">
              Estimated Distance: <strong className="text-slate-200">18.2 km</strong> (Connaught Place → Cyber City)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> Eco Advice for this Corridor
            </div>
            <p className="text-slate-300 leading-relaxed">
              Taking Delhi Metro (Yellow Line → Magenta Line) avoids heavy congestion on NH-48 and reduces your carbon footprint by 80% compared to a petrol cab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
