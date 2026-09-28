// Petrol Pump Station Card Component with Price Sparkline, Trend Arrow, and Queue Status

import React from "react";
import { Fuel, Clock, Plus, TrendingDown, TrendingUp, Minus, Users } from "lucide-react";
import { PetrolStation } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface FuelCardProps {
  station: PetrolStation;
}

export const FuelCard: React.FC<FuelCardProps> = ({ station }) => {
  const addStopToRoute = useAppStore((s) => s.addStopToRoute);

  const getQueueColor = () => {
    switch (station.queueLevel) {
      case "low":
        return "text-forest dark:text-forest-mint bg-forest/10";
      case "medium":
        return "text-sun-dark dark:text-sun bg-sun/20";
      case "high":
        return "text-vibrant-orange bg-vibrant-orange/15";
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft flex flex-col justify-between space-y-3">
      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-vibrant-orange/10 text-vibrant-orange">
              <Fuel className="w-4 h-4 fill-current" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold font-sora text-dark-bg dark:text-cream leading-tight">
                  {station.name}
                </h4>
                {station.isBestPrice && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold bg-sun text-dark-bg">
                    BEST PRICE
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-dark dark:text-cream/60 font-mono">
                {station.brand} • {station.fuelTypes.join(", ")}
              </span>
            </div>
          </div>

          {/* Queue Wait Level Badge */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold capitalize ${getQueueColor()}`}
          >
            <Users className="w-3 h-3" />
            <span>{station.queueLevel} wait (~{station.queueWaitMinutes}m)</span>
          </div>
        </div>

        <p className="text-xs text-muted-dark dark:text-cream/60 truncate mt-1">
          {station.address}
        </p>
      </div>

      {/* Price & Sparkline Graphic */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-warm/50 dark:bg-dark-card/40 border border-cream-border/60 dark:border-dark-border/60">
        <div className="flex items-center gap-2">
          <span className="text-base font-black font-mono text-dark-bg dark:text-cream">
            ₹{station.pricePerLiter.toFixed(2)}/L
          </span>

          <span
            className={`flex items-center text-xs font-mono font-bold ${
              station.priceTrend === "down"
                ? "text-forest dark:text-forest-mint"
                : station.priceTrend === "up"
                ? "text-vibrant-orange"
                : "text-muted-dark dark:text-cream/60"
            }`}
          >
            {station.priceTrend === "down" ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : station.priceTrend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            {Math.abs(station.pricePerLiter - station.previousPrice).toFixed(2)}
          </span>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-20 h-6">
          <svg viewBox="0 0 80 24" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke="#FF7A1A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={station.sparkline
                .map((val, idx) => {
                  const min = Math.min(...station.sparkline);
                  const max = Math.max(...station.sparkline) || min + 1;
                  const x = (idx / (station.sparkline.length - 1)) * 80;
                  const y = 20 - ((val - min) / (max - min)) * 16;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
          </svg>
        </div>
      </div>

      {/* Footer & Add Stop Button */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-[10px] text-muted-dark dark:text-cream/60 flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" /> +{station.detourMinutes} min detour
        </span>

        <button
          onClick={() => addStopToRoute(station)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-vibrant-orange text-white hover:bg-vibrant-orangeHover shadow-soft active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Fuel Stop</span>
        </button>
      </div>
    </div>
  );
};
