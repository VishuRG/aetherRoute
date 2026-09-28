// Fuel Gauge Component
// Animated Fuel tank gauge, projected consumption, and cheapest petrol stop suggestion

import React from "react";
import { motion } from "framer-motion";
import { Fuel, AlertTriangle, ShieldCheck, Plus, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const FuelGauge: React.FC = () => {
  const vehicleProfile = useAppStore((s) => s.vehicleProfile);
  const updateVehicleProfile = useAppStore((s) => s.updateVehicleProfile);
  const routes = useAppStore((s) => s.routes);
  const selectedRouteId = useAppStore((s) => s.selectedRouteId);
  const petrolStations = useAppStore((s) => s.petrolStations);
  const addStopToRoute = useAppStore((s) => s.addStopToRoute);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const tripDistanceKm = activeRoute?.distanceKm || 30;

  // Consumption calculation
  // Fuel needed (L) = tripDistanceKm / fuelEfficiencyKmPerL
  const fuelNeededL = parseFloat((tripDistanceKm / vehicleProfile.fuelEfficiencyKmPerL).toFixed(1));
  const currentFuelL = parseFloat(
    ((vehicleProfile.currentFuelLevelPercent / 100) * vehicleProfile.fuelTankCapacityL).toFixed(1)
  );
  const remainingFuelL = Math.max(0, parseFloat((currentFuelL - fuelNeededL).toFixed(1)));
  const projectedPercentAtDest = Math.max(
    0,
    Math.round((remainingFuelL / vehicleProfile.fuelTankCapacityL) * 100)
  );

  const isLowFuel = projectedPercentAtDest < 20;

  // Best price pump on route
  const bestPump = petrolStations.find((p) => p.isBestPrice) || petrolStations[0];

  return (
    <div className="p-5 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-vibrant-orange/15 text-vibrant-orange">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sora text-dark-bg dark:text-cream">
              Fuel Tank Projection
            </h3>
            <p className="text-[11px] text-muted-dark dark:text-cream/60">
              {vehicleProfile.fuelTankCapacityL}L Tank • {vehicleProfile.fuelEfficiencyKmPerL} km/L avg
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
            isLowFuel
              ? "bg-vibrant-orange/15 text-vibrant-orange"
              : "bg-forest/15 text-forest dark:text-forest-mint"
          }`}
        >
          {isLowFuel ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" /> Refuel Needed
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" /> Adequate Fuel
            </>
          )}
        </span>
      </div>

      {/* Fuel Level Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-dark dark:text-cream/70 font-medium">Current Tank Level:</span>
          <span className="font-extrabold text-vibrant-orange">
            {vehicleProfile.currentFuelLevelPercent}% ({currentFuelL} Litres)
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={vehicleProfile.currentFuelLevelPercent}
          onChange={(e) =>
            updateVehicleProfile({ currentFuelLevelPercent: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-cream-border dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-vibrant-orange"
        />
      </div>

      {/* Projection Summary Card */}
      <div className="p-3.5 rounded-xl bg-cream-warm/50 dark:bg-dark-bg/60 border border-cream-border/60 dark:border-dark-border/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-dark dark:text-cream/70 font-medium">Estimated Fuel Burn:</span>
          <span className="font-mono font-bold text-dark-bg dark:text-cream">
            {fuelNeededL} L (~₹{Math.round(fuelNeededL * 94.7)})
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-dark dark:text-cream/70 font-medium">Arrival Tank Level:</span>
          <span
            className={`font-mono font-bold ${
              projectedPercentAtDest < 15
                ? "text-vibrant-orange"
                : projectedPercentAtDest < 25
                ? "text-sun-dark dark:text-sun"
                : "text-forest dark:text-forest-mint"
            }`}
          >
            {projectedPercentAtDest}% ({remainingFuelL} L remaining)
          </span>
        </div>

        {/* Animated Fuel Bar */}
        <div className="w-full bg-cream-border dark:bg-dark-border h-2.5 rounded-full overflow-hidden p-0.5">
          <motion.div
            className={`h-full rounded-full ${
              projectedPercentAtDest < 15
                ? "bg-vibrant-orange"
                : projectedPercentAtDest < 25
                ? "bg-sun"
                : "bg-forest dark:bg-forest-mint"
            }`}
            animate={{ width: `${projectedPercentAtDest}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </div>
      </div>

      {/* Best Fuel Stop Suggestion */}
      {bestPump && (
        <div className="p-3 rounded-xl bg-sun/15 border border-sun/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-dark-bg dark:text-sun shrink-0" />
            <div>
              <p className="font-bold text-dark-bg dark:text-cream leading-tight">
                {bestPump.name} (₹{bestPump.pricePerLiter}/L)
              </p>
              <p className="text-[11px] text-muted-dark dark:text-cream/70">
                Cheapest on corridor • {bestPump.queueLevel} wait (~{bestPump.queueWaitMinutes}m)
              </p>
            </div>
          </div>

          <button
            onClick={() => addStopToRoute(bestPump)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold bg-vibrant-orange text-white hover:bg-vibrant-orangeHover shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" /> Add Stop
          </button>
        </div>
      )}
    </div>
  );
};
