// Range Guard Component
// Animated Battery Gauge, State-of-Charge (SoC) projection chart, and auto-suggest charger top-ups

import React from "react";
import { motion } from "framer-motion";
import { BatteryCharging, Zap, AlertTriangle, ShieldCheck, Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const RangeGuard: React.FC = () => {
  const vehicleProfile = useAppStore((s) => s.vehicleProfile);
  const updateVehicleProfile = useAppStore((s) => s.updateVehicleProfile);
  const routes = useAppStore((s) => s.routes);
  const selectedRouteId = useAppStore((s) => s.selectedRouteId);
  const chargers = useAppStore((s) => s.chargers);
  const addStopToRoute = useAppStore((s) => s.addStopToRoute);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const tripDistanceKm = activeRoute?.distanceKm || 30;

  // Calculate projected consumption
  // Total available range = (currentBatteryPercent / 100) * maxRangeKm
  const currentRange = Math.round(
    (vehicleProfile.currentBatteryPercent / 100) * vehicleProfile.maxRangeKm
  );
  const remainingRangeAfterTrip = Math.max(0, currentRange - tripDistanceKm);
  const projectedBatteryAtDest = Math.max(
    0,
    Math.round((remainingRangeAfterTrip / vehicleProfile.maxRangeKm) * 100)
  );

  const isLowBatteryRisk = projectedBatteryAtDest < 20;

  // Recommended charger along route
  const recommendedCharger = chargers[0];

  return (
    <div className="p-5 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-forest/15 text-forest dark:text-forest-mint">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sora text-dark-bg dark:text-cream">
              Range Guard™ Smart SoC
            </h3>
            <p className="text-[11px] text-muted-dark dark:text-cream/60">
              {vehicleProfile.modelName} • {vehicleProfile.batteryCapacityKwh} kWh
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
            isLowBatteryRisk
              ? "bg-vibrant-orange/15 text-vibrant-orange"
              : "bg-forest/15 text-forest dark:text-forest-mint"
          }`}
        >
          {isLowBatteryRisk ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" /> Stop Recommended
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" /> Safe Range Buffer
            </>
          )}
        </span>
      </div>

      {/* Battery % Slider Control */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-dark dark:text-cream/70 font-medium">
            Starting Battery Level:
          </span>
          <span className="font-extrabold text-forest dark:text-forest-mint">
            {vehicleProfile.currentBatteryPercent}% ({currentRange} km range)
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={vehicleProfile.currentBatteryPercent}
          onChange={(e) =>
            updateVehicleProfile({ currentBatteryPercent: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-cream-border dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-forest"
        />
      </div>

      {/* State-of-Charge (SoC) Projection Visualizer */}
      <div className="p-3.5 rounded-xl bg-cream-warm/50 dark:bg-dark-bg/60 border border-cream-border/60 dark:border-dark-border/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-dark dark:text-cream/70 font-medium">Trip Distance:</span>
          <span className="font-mono font-bold text-dark-bg dark:text-cream">
            {tripDistanceKm} km
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-dark dark:text-cream/70 font-medium">
            Projected Arrival Battery:
          </span>
          <span
            className={`font-mono font-bold ${
              projectedBatteryAtDest < 15
                ? "text-vibrant-orange"
                : projectedBatteryAtDest < 25
                ? "text-sun-dark dark:text-sun"
                : "text-forest dark:text-forest-mint"
            }`}
          >
            {projectedBatteryAtDest}% (~{remainingRangeAfterTrip} km left)
          </span>
        </div>

        {/* Animated Visual Gauge Bar */}
        <div className="w-full bg-cream-border dark:bg-dark-border h-2.5 rounded-full overflow-hidden p-0.5">
          <motion.div
            className={`h-full rounded-full ${
              projectedBatteryAtDest < 15
                ? "bg-vibrant-orange"
                : projectedBatteryAtDest < 25
                ? "bg-sun"
                : "bg-forest dark:bg-forest-mint"
            }`}
            animate={{ width: `${projectedBatteryAtDest}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </div>
      </div>

      {/* Low Battery Warning & Charger Suggestion */}
      {isLowBatteryRisk && recommendedCharger && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 rounded-xl bg-vibrant-orange/10 border border-vibrant-orange/20 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-vibrant-orange shrink-0" />
            <div>
              <p className="font-bold text-dark-bg dark:text-cream leading-tight">
                Suggest 10-min top up at {recommendedCharger.brand}
              </p>
              <p className="text-[11px] text-muted-dark dark:text-cream/70">
                Adds +85 km buffer • 2 min detour
              </p>
            </div>
          </div>

          <button
            onClick={() => addStopToRoute(recommendedCharger)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold bg-vibrant-orange text-white hover:bg-vibrant-orangeHover shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" /> Add Stop
          </button>
        </motion.div>
      )}
    </div>
  );
};
