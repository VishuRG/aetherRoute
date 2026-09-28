// EV Charger Station Card Component with Animated Segmented Bar for Live Ports

import React from "react";
import { motion } from "framer-motion";
import { Zap, Star, Clock, Plus, Check, Wifi, Coffee, Shield } from "lucide-react";
import { EVCharger } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface ChargerCardProps {
  charger: EVCharger;
}

export const ChargerCard: React.FC<ChargerCardProps> = ({ charger }) => {
  const addStopToRoute = useAppStore((s) => s.addStopToRoute);

  const isAvailable = charger.status === "available";

  return (
    <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft flex flex-col justify-between space-y-3">
      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-forest/10 dark:bg-forest/20 text-forest dark:text-forest-mint">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <div>
              <h4 className="text-sm font-bold font-sora text-dark-bg dark:text-cream leading-tight">
                {charger.name}
              </h4>
              <span className="text-[11px] text-muted-dark dark:text-cream/60 font-mono">
                {charger.brand} • {charger.powerKw} kW Fast DC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sun/20 text-dark-bg dark:text-cream text-xs font-bold font-mono">
            <Star className="w-3 h-3 fill-sun text-sun" />
            <span>{charger.rating}</span>
          </div>
        </div>

        <p className="text-xs text-muted-dark dark:text-cream/60 truncate mt-1">
          {charger.address}
        </p>
      </div>

      {/* Live Ports Segmented Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-muted-dark dark:text-cream/70 font-medium">Live Port Availability</span>
          <span className={`font-bold ${isAvailable ? "text-forest dark:text-forest-mint" : "text-gray-400"}`}>
            {charger.availablePorts} of {charger.totalPorts} free
          </span>
        </div>

        {/* Segmented Bar */}
        <div className="flex items-center gap-1 w-full h-2">
          {Array.from({ length: charger.totalPorts }).map((_, idx) => {
            const isPortFree = idx < charger.availablePorts;
            return (
              <motion.div
                key={idx}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex-1 h-full rounded-sm ${
                  isPortFree
                    ? "bg-forest dark:bg-forest-mint"
                    : "bg-gray-300 dark:bg-dark-border"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Pricing & Detour Minutes */}
      <div className="flex items-center justify-between pt-2 border-t border-cream-border/60 dark:border-dark-border/60 text-xs">
        <div className="flex flex-col">
          <span className="text-xs font-mono font-bold text-dark-bg dark:text-cream">
            ₹{charger.pricePerKwh}/kWh
          </span>
          <span className="text-[10px] text-muted-dark dark:text-cream/60 flex items-center gap-1">
            <Clock className="w-3 h-3" /> +{charger.detourMinutes} min detour
          </span>
        </div>

        {/* Add to Route Action */}
        <button
          onClick={() => addStopToRoute(charger)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-forest text-white hover:bg-forest-deep shadow-soft active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to Route</span>
        </button>
      </div>
    </div>
  );
};
