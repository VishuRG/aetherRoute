// Alerts & Settings Page
// Vehicle Profile, Units & Currency, Smart Alert Preferences, and Accessibility Toggles

import React, { useState } from "react";
import {
  SlidersHorizontal,
  Car,
  Bell,
  Globe,
  Eye,
  ShieldCheck,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { APP_CONFIG } from "@/config/appConfig";

export const Settings: React.FC = () => {
  const vehicleProfile = useAppStore((s) => s.vehicleProfile);
  const updateVehicleProfile = useAppStore((s) => s.updateVehicleProfile);
  const addToast = useAppStore((s) => s.addToast);
  const { reducedMotion, setReducedMotion } = useReducedMotion();

  // Settings local state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [alertRadiusKm, setAlertRadiusKm] = useState(15);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  const [modelName, setModelName] = useState(vehicleProfile.modelName);
  const [batteryCap, setBatteryCap] = useState(vehicleProfile.batteryCapacityKwh);
  const [maxRange, setMaxRange] = useState(vehicleProfile.maxRangeKm);
  const [tankCap, setTankCap] = useState(vehicleProfile.fuelTankCapacityL);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateVehicleProfile({
      modelName,
      batteryCapacityKwh: Number(batteryCap),
      maxRangeKm: Number(maxRange),
      fuelTankCapacityL: Number(tankCap),
    });
    addToast({
      title: "Profile Saved",
      message: "Vehicle parameters and Range Guard thresholds updated.",
      priority: "success",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-sora text-dark-bg dark:text-cream">
            Preferences & Vehicle Profile
          </h1>
          <p className="text-xs text-muted-dark dark:text-cream/70 mt-1">
            Configure vehicle specs, Range Guard thresholds, smart notification rules, and accessibility
          </p>
        </div>

        {/* 1. Vehicle Specifications Form */}
        <section className="p-6 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-cream-border/60 dark:border-dark-border/60 pb-3">
            <Car className="w-5 h-5 text-forest" />
            <h2 className="text-base font-bold font-sora text-dark-bg dark:text-cream">
              Active Vehicle Profile
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-dark-bg dark:text-cream mb-1">
                Vehicle Model
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-cream-warm/40 dark:bg-dark-bg/60 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream"
              />
            </div>

            <div>
              <label className="block font-bold text-dark-bg dark:text-cream mb-1">
                Usable Battery Capacity (kWh)
              </label>
              <input
                type="number"
                value={batteryCap}
                onChange={(e) => setBatteryCap(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-cream-warm/40 dark:bg-dark-bg/60 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream"
              />
            </div>

            <div>
              <label className="block font-bold text-dark-bg dark:text-cream mb-1">
                Full-Charge Range (km)
              </label>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-cream-warm/40 dark:bg-dark-bg/60 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream"
              />
            </div>

            <div>
              <label className="block font-bold text-dark-bg dark:text-cream mb-1">
                Fuel Tank Capacity (Litres)
              </label>
              <input
                type="number"
                value={tankCap}
                onChange={(e) => setTankCap(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-cream-warm/40 dark:bg-dark-bg/60 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold bg-forest text-white hover:bg-forest-deep shadow-soft transition-all"
              >
                Save Vehicle Specs
              </button>
            </div>
          </form>
        </section>

        {/* 2. Notification Rules & Pre-Permission Screen */}
        <section className="p-6 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-cream-border/60 dark:border-dark-border/60 pb-3">
            <Bell className="w-5 h-5 text-vibrant-orange" />
            <h2 className="text-base font-bold font-sora text-dark-bg dark:text-cream">
              Smart Alerts Engine
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Audio chime toggle */}
            <div className="flex items-center justify-between py-2 border-b border-cream-border/40 dark:border-dark-border/40">
              <div>
                <span className="font-bold text-dark-bg dark:text-cream">Audio Hazard Chimes</span>
                <p className="text-[11px] text-muted-dark dark:text-cream/60">
                  Play gentle auditory cue when critical obstacle or charger free alert arrives
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl transition-colors ${
                  soundEnabled ? "bg-forest text-white" : "bg-cream-border text-muted-dark"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Alert Radius */}
            <div className="py-2 border-b border-cream-border/40 dark:border-dark-border/40 space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-dark-bg dark:text-cream">Hazard Alert Radius</span>
                <span className="font-bold text-forest dark:text-forest-mint">{alertRadiusKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={alertRadiusKm}
                onChange={(e) => setAlertRadiusKm(Number(e.target.value))}
                className="w-full h-2 bg-cream-border dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-forest"
              />
            </div>

            {/* Quiet Hours */}
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-bold text-dark-bg dark:text-cream">Quiet Hours (10 PM - 7 AM)</span>
                <p className="text-[11px] text-muted-dark dark:text-cream/60">
                  Silence non-critical fuel price alerts during night driving
                </p>
              </div>
              <input
                type="checkbox"
                checked={quietHours}
                onChange={(e) => setQuietHours(e.target.checked)}
                className="w-4 h-4 accent-forest cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* 3. Accessibility & Motion System */}
        <section className="p-6 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-cream-border/60 dark:border-dark-border/60 pb-3">
            <Eye className="w-5 h-5 text-sun-dark" />
            <h2 className="text-base font-bold font-sora text-dark-bg dark:text-cream">
              Accessibility & Motion
            </h2>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-dark-bg dark:text-cream">Reduce Motion</span>
              <p className="text-[11px] text-muted-dark dark:text-cream/60">
                Disables decorative route animations, particle bursts, and sliding transitions
              </p>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-4 h-4 accent-forest cursor-pointer"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
