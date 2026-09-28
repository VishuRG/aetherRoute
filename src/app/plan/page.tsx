"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Navigation, SlidersHorizontal, Clock, Zap, Leaf,
  Bus, Car, Bike, Sparkles, Check, Accessibility, ArrowLeftRight
} from "lucide-react";
import { EcoMap } from "@/components/EcoMap";
import { DemoBadge } from "@/components/DemoBadge";
import { DELHI_NCR_LOCATIONS, resolveLocation } from "@/lib/locations";
import { haversineDistance } from "@/lib/utils";

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
      if (selectedModes.length > 1) {
        setSelectedModes(selectedModes.filter((m) => m !== mode));
      }
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const originLoc = resolveLocation(origin);
  const destLoc = resolveLocation(destination);
  const estDistanceKm = parseFloat(
    (Math.max(1.8, haversineDistance(originLoc.lat, originLoc.lng, destLoc.lat, destLoc.lng)) * 1.2).toFixed(1)
  );

  const activeMarkers = [
    {
      id: "orig",
      lat: originLoc.lat,
      lng: originLoc.lng,
      label: `Start: ${originLoc.name.split(" ")[0]}`,
      title: originLoc.name,
      type: "origin" as const,
    },
    {
      id: "dest",
      lat: destLoc.lat,
      lng: destLoc.lng,
      label: `End: ${destLoc.name.split(" ")[0]}`,
      title: destLoc.name,
      type: "destination" as const,
    },
  ];

  const handleCalculateRoutes = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      origin: originLoc.name,
      originLat: originLoc.lat.toString(),
      originLng: originLoc.lng.toString(),
      destination: destLoc.name,
      destLat: destLoc.lat.toString(),
      destLng: destLoc.lng.toString(),
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
            Compare Metro, Bus, Cab & Auto routes with accurate GPS coordinates & authentic DMRC fares
          </p>
        </div>
        <DemoBadge message="Interactive NCR Route Planner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planner Form */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <form onSubmit={handleCalculateRoutes} className="space-y-6">
            {/* Origin & Destination with Swap button */}
            <div className="space-y-4 relative">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Starting Point (Origin)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    id="plan-origin-select"
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

              {/* Swap Button */}
              <div className="flex justify-center -my-2">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="px-3 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Origin & Destination
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Destination Point
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cyan-400" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    id="plan-dest-select"
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

            {/* Transport Modes Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Select Allowed Transport Modes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "Metro", label: "Delhi Metro", icon: "🚇" },
                  { id: "Bus", label: "DTC Bus", icon: "🚌" },
                  { id: "Cab", label: "Cab / EV", icon: "🚖" },
                  { id: "Auto", label: "CNG Auto", icon: "🛺" },
                ].map((mode) => {
                  const isSelected = selectedModes.includes(mode.id);
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => toggleMode(mode.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                          : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                      }`}
                    >
                      <span className="text-xl">{mode.icon}</span>
                      <div>
                        <div className="font-bold text-xs">{mode.label}</div>
                        <div className="text-[10px] text-slate-400">{isSelected ? "Enabled" : "Off"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel Preferences Sliders */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4" /> Preferences & Constraints
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Maximum Walking Tolerance:</span>
                  <span className="text-emerald-400 font-mono">{maxWalking} minutes</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={maxWalking}
                  onChange={(e) => setMaxWalking(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={preferEco}
                    onChange={(e) => setPreferEco(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-white/20 text-emerald-400 focus:ring-0"
                  />
                  <span>Prioritize Lowest Emission Routes</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={wheelchair}
                    onChange={(e) => setWheelchair(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-white/20 text-emerald-400 focus:ring-0"
                  />
                  <span>Wheelchair & Ramp Accessibility</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              id="plan-submit-btn"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-black text-base hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5" /> Calculate Optimized Routes
            </button>
          </form>
        </div>

        {/* Live Vector Map & Distance Summary */}
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Live Route Preview</span>
              <span className="text-xs font-mono font-bold text-emerald-400">~{estDistanceKm} km</span>
            </div>

            <div className="h-72 w-full rounded-2xl overflow-hidden border border-white/10">
              <EcoMap
                markers={activeMarkers}
                showRoute={true}
                originName={originLoc.name}
                destName={destLoc.name}
                className="h-full w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-xs text-slate-400 space-y-1">
              <div>From: <strong className="text-white">{originLoc.name}</strong></div>
              <div>To: <strong className="text-white">{destLoc.name}</strong></div>
              <div className="text-[11px] text-emerald-400 pt-1 border-t border-white/8">
                Estimated Transit Distance: <strong className="font-mono">{estDistanceKm} km</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
