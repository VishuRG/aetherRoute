// Live Corridor Explorer Page
// Interactive POI Grid (EV Chargers, Petrol Stations, Live Hazards) with filter tabs and reporting trigger

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Fuel,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MapView } from "@/components/MapView";
import { ChargerCard } from "@/components/ChargerCard";
import { FuelCard } from "@/components/FuelCard";
import { ProblemCard } from "@/components/ProblemCard";

type POITab = "all" | "chargers" | "fuel" | "problems";

export const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<POITab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const chargers = useAppStore((s) => s.chargers);
  const petrolStations = useAppStore((s) => s.petrolStations);
  const problems = useAppStore((s) => s.problems);
  const setActiveDrawer = useAppStore((s) => s.setActiveDrawer);

  const filteredChargers = chargers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFuel = petrolStations.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-16 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-sora text-dark-bg dark:text-cream">
              Live Corridor Explorer
            </h1>
            <p className="text-xs text-muted-dark dark:text-cream/70 mt-1">
              Active EV fast hubs, real-time petrol prices, and driver-reported road hazards
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-dark" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search station or road..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border text-xs text-dark-bg dark:text-cream focus:outline-none focus:border-forest"
              />
            </div>

            {/* Quick Report Hazard CTA */}
            <button
              onClick={() => setActiveDrawer("reportProblem")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-vibrant-orange text-white hover:bg-vibrant-orangeHover shadow-glowOrange whitespace-nowrap active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Hazard</span>
            </button>
          </div>
        </div>

        {/* Map Preview Layer */}
        <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-layered border border-cream-border dark:border-dark-border">
          <MapView className="w-full h-full" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-cream-border dark:border-dark-border pb-3">
          {(
            [
              { id: "all", label: "All POIs", count: chargers.length + petrolStations.length + problems.length },
              { id: "chargers", label: "⚡ EV Superchargers", count: filteredChargers.length },
              { id: "fuel", label: "⛽ Fuel Stations", count: filteredFuel.length },
              { id: "problems", label: "⚠️ Live Hazards", count: filteredProblems.length },
            ] as Array<{ id: POITab; label: string; count: number }>
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-forest text-white shadow-soft"
                  : "bg-cream-warm/70 dark:bg-dark-card text-muted-dark dark:text-cream/70 hover:bg-forest/10"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* POI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* EV Chargers */}
          {(activeTab === "all" || activeTab === "chargers") &&
            filteredChargers.map((ch) => <ChargerCard key={ch.id} charger={ch} />)}

          {/* Petrol Stations */}
          {(activeTab === "all" || activeTab === "fuel") &&
            filteredFuel.map((ps) => <FuelCard key={ps.id} station={ps} />)}

          {/* Live Problems */}
          {(activeTab === "all" || activeTab === "problems") &&
            filteredProblems.map((pr) => <ProblemCard key={pr.id} problem={pr} />)}
        </div>
      </div>
    </div>
  );
};
