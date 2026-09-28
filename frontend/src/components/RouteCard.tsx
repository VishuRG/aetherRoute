// RouteCard Component with micro-interactions, badge chips, and timeline drawer trigger

import React from "react";
import { motion } from "framer-motion";
import { Clock, Navigation, IndianRupee, Leaf, ChevronRight, TrendingUp } from "lucide-react";
import { RouteOption } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
  onOpenDetails: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
  onOpenDetails,
}) => {
  const getTagBadge = () => {
    switch (route.tag) {
      case "fastest":
        return { label: "Fastest", bg: "bg-vibrant-orange text-white" };
      case "eco":
        return { label: "Eco-Optimized", bg: "bg-forest text-white" };
      case "cheapest":
        return { label: "Lowest Cost", bg: "bg-sun text-dark-bg font-extrabold" };
      case "scenic":
        return { label: "Scenic Corridor", bg: "bg-forest-mint text-dark-bg font-bold" };
    }
  };

  const badge = getTagBadge();

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "bg-cream-card dark:bg-dark-card border-forest dark:border-forest-mint shadow-glowGreen"
          : "bg-cream-card/70 dark:bg-dark-card/60 border-cream-border dark:border-dark-border hover:border-forest/40 hover:shadow-soft"
      }`}
    >
      {/* Top Header: Tag Badge + Traffic Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wide uppercase ${badge.bg}`}
        >
          {badge.label}
        </span>

        <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-muted-dark dark:text-cream/70">
          <span
            className={`w-2 h-2 rounded-full ${
              route.trafficLevel === "smooth"
                ? "bg-forest-mint"
                : route.trafficLevel === "moderate"
                ? "bg-sun"
                : "bg-vibrant-orange"
            }`}
          />
          <span className="capitalize">{route.trafficLevel} Traffic</span>
        </span>
      </div>

      {/* Main Title */}
      <h3 className="text-base font-bold font-sora text-dark-bg dark:text-cream leading-tight mb-2">
        {route.title}
      </h3>

      {/* Key Metrics Row (Time, Distance, Cost, CO2) */}
      <div className="grid grid-cols-4 gap-2 py-3 border-y border-cream-border/60 dark:border-dark-border/60 text-center">
        {/* Duration */}
        <div className="flex flex-col">
          <span className="text-lg font-black font-mono text-dark-bg dark:text-cream">
            {route.durationMin}
            <span className="text-xs font-normal ml-0.5">m</span>
          </span>
          <span className="text-[10px] text-muted-dark dark:text-cream/60 flex items-center justify-center gap-0.5">
            <Clock className="w-3 h-3" /> Time
          </span>
        </div>

        {/* Distance */}
        <div className="flex flex-col">
          <span className="text-lg font-black font-mono text-dark-bg dark:text-cream">
            {route.distanceKm}
            <span className="text-xs font-normal ml-0.5">km</span>
          </span>
          <span className="text-[10px] text-muted-dark dark:text-cream/60 flex items-center justify-center gap-0.5">
            <Navigation className="w-3 h-3" /> Dist
          </span>
        </div>

        {/* Cost */}
        <div className="flex flex-col">
          <span className="text-lg font-black font-mono text-dark-bg dark:text-cream">
            ₹{route.estimatedCost}
          </span>
          <span className="text-[10px] text-muted-dark dark:text-cream/60 flex items-center justify-center gap-0.5">
            <IndianRupee className="w-3 h-3" /> Cost
          </span>
        </div>

        {/* CO2 Saved */}
        <div className="flex flex-col">
          <span className="text-lg font-black font-mono text-forest dark:text-forest-mint">
            -{route.co2SavedPercent}%
          </span>
          <span className="text-[10px] text-muted-dark dark:text-cream/60 flex items-center justify-center gap-0.5">
            <Leaf className="w-3 h-3 text-forest" /> CO₂
          </span>
        </div>
      </div>

      {/* Bottom CTA Row: Timeline View Button */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-dark dark:text-cream/60 flex items-center gap-1 font-mono text-[11px]">
          <TrendingUp className="w-3.5 h-3.5" /> +{route.elevationGainMeters}m elevation
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="flex items-center gap-1 font-semibold text-forest dark:text-forest-mint hover:underline"
        >
          <span>View Steps</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
