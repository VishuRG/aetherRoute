// Route Planner Main Application Page
// Desktop: Split view (panel left, map right)
// Mobile: Full-screen map + draggable bottom sheet
// Includes waypoints, vehicle selection, Range Guard / Fuel Gauge, Route Cards, and Slide to Start

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownUp,
  Plus,
  Trash2,
  Clock,
  Navigation,
  Compass,
  Zap,
  Fuel,
  Share2,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MapView } from "@/components/MapView";
import { RouteCard } from "@/components/RouteCard";
import { RangeGuard } from "@/components/RangeGuard";
import { FuelGauge } from "@/components/FuelGauge";
import { SlideToStart } from "@/components/SlideToStart";
import { Drawer } from "@/components/Drawer";
import { BottomSheet } from "@/components/BottomSheet";
import { VehicleType, RouteWaypoint } from "@/types";

export const Plan: React.FC = () => {
  const origin = useAppStore((s) => s.origin);
  const destination = useAppStore((s) => s.destination);
  const setOrigin = useAppStore((s) => s.setOrigin);
  const setDestination = useAppStore((s) => s.setDestination);
  const swapOriginDestination = useAppStore((s) => s.swapOriginDestination);
  const waypoints = useAppStore((s) => s.waypoints);
  const addWaypoint = useAppStore((s) => s.addWaypoint);
  const removeWaypoint = useAppStore((s) => s.removeWaypoint);
  const vehicleType = useAppStore((s) => s.vehicleType);
  const setVehicleType = useAppStore((s) => s.setVehicleType);
  const departureTime = useAppStore((s) => s.departureTime);
  const routes = useAppStore((s) => s.routes);
  const selectedRouteId = useAppStore((s) => s.selectedRouteId);
  const setSelectedRouteId = useAppStore((s) => s.setSelectedRouteId);
  const saveCurrentTrip = useAppStore((s) => s.saveCurrentTrip);

  const [timelineDrawerOpen, setTimelineDrawerOpen] = useState(false);
  const [newWaypointName, setNewWaypointName] = useState("");
  const [showAddWaypoint, setShowAddWaypoint] = useState(false);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleAddWaypoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaypointName) return;
    const wp: RouteWaypoint = {
      id: `wp-${Date.now()}`,
      name: newWaypointName,
      lat: 28.5355,
      lng: 77.1521,
    };
    addWaypoint(wp);
    setNewWaypointName("");
    setShowAddWaypoint(false);
  };

  // Reusable planner panel contents (used on desktop left panel & mobile bottom sheet)
  const PlannerControls = (
    <div className="space-y-5">
      {/* 1. Origin, Waypoints & Destination Inputs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-3">
        {/* Origin */}
        <div className="relative flex items-center">
          <span className="w-3 h-3 rounded-full bg-forest shrink-0 ml-1 mr-3" />
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Starting Point"
            className="w-full py-2 px-3 rounded-xl bg-cream-warm/60 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-xs font-semibold text-dark-bg dark:text-cream focus:outline-none focus:border-forest"
          />
        </div>

        {/* Reorderable Waypoints List (up to 3) */}
        {waypoints.map((wp, idx) => (
          <div key={wp.id} className="relative flex items-center pl-7">
            <span className="w-2 h-2 rounded-full bg-sun shrink-0 -ml-4 mr-2" />
            <input
              type="text"
              value={wp.name}
              readOnly
              className="w-full py-1.5 px-3 rounded-xl bg-cream-warm/40 dark:bg-dark-bg/50 border border-cream-border dark:border-dark-border text-xs text-dark-bg dark:text-cream"
            />
            <button
              onClick={() => removeWaypoint(wp.id)}
              className="p-1.5 ml-2 text-muted-dark hover:text-vibrant-orange transition-colors"
              title="Remove waypoint"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Add Waypoint Trigger */}
        {showAddWaypoint ? (
          <form onSubmit={handleAddWaypoint} className="flex items-center gap-2 pl-7">
            <input
              type="text"
              value={newWaypointName}
              onChange={(e) => setNewWaypointName(e.target.value)}
              placeholder="e.g. AeroCity Terminal, Dhaula Kuan..."
              className="flex-1 py-1.5 px-3 rounded-xl bg-cream-warm/60 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-bold"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddWaypoint(false)}
              className="px-2 py-1.5 text-xs text-muted-dark"
            >
              Cancel
            </button>
          </form>
        ) : (
          waypoints.length < 3 && (
            <div className="pl-7">
              <button
                type="button"
                onClick={() => setShowAddWaypoint(true)}
                className="text-[11px] font-mono font-bold text-forest dark:text-forest-mint hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Stop / Waypoint (up to 3)
              </button>
            </div>
          )
        )}

        {/* Destination & Swap Button */}
        <div className="relative flex items-center">
          <span className="w-3 h-3 rounded-full bg-vibrant-orange shrink-0 ml-1 mr-3" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="w-full py-2 px-3 rounded-xl bg-cream-warm/60 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-xs font-semibold text-dark-bg dark:text-cream focus:outline-none focus:border-forest"
          />
          <button
            type="button"
            onClick={swapOriginDestination}
            className="p-2 ml-2 rounded-xl bg-cream-warm dark:bg-dark-bg hover:bg-forest hover:text-white transition-colors text-muted-dark dark:text-cream"
            title="Swap Origin and Destination"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vehicle Type Row */}
        <div className="pt-2 border-t border-cream-border/60 dark:border-dark-border/60 flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase text-muted-dark dark:text-cream/60">
            Engine Mode
          </span>
          <div className="flex items-center gap-1">
            {(["ev", "petrol", "diesel", "cng"] as VehicleType[]).map((type) => (
              <button
                key={type}
                onClick={() => setVehicleType(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  vehicleType === type
                    ? type === "ev"
                      ? "bg-forest text-white"
                      : type === "petrol"
                      ? "bg-vibrant-orange text-white"
                      : "bg-sun text-dark-bg"
                    : "text-muted-dark dark:text-cream/60 hover:bg-cream-border/40"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Range Guard (EV) or Fuel Gauge (Petrol/Diesel) */}
      {vehicleType === "ev" ? <RangeGuard /> : <FuelGauge />}

      {/* 3. Route Options Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-sora text-dark-bg dark:text-cream">
          Recommended Routes ({routes.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={saveCurrentTrip}
            className="flex items-center gap-1 text-xs font-semibold text-muted-dark dark:text-cream/70 hover:text-forest transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Route</span>
          </button>
        </div>
      </div>

      {/* 4. Route Cards List */}
      <div className="space-y-3">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            isSelected={selectedRouteId === route.id}
            onSelect={() => setSelectedRouteId(route.id)}
            onOpenDetails={() => setTimelineDrawerOpen(true)}
          />
        ))}
      </div>

      {/* 5. Slide to Start Navigation Control */}
      <div className="pt-2">
        <SlideToStart />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Split View: Left Controls (40%), Right Map (60%) */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Route Cards */}
          <div className="md:col-span-5 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            {PlannerControls}
          </div>

          {/* Right Column: Full-Height MapView */}
          <div className="md:col-span-7 sticky top-24 h-[calc(100vh-7rem)]">
            <MapView className="w-full h-full shadow-layered border border-cream-border dark:border-dark-border" />
          </div>
        </div>

        {/* Mobile View: Full-Screen Map + Bottom Sheet */}
        <div className="md:hidden relative h-[calc(100vh-6rem)] rounded-3xl overflow-hidden">
          <MapView className="w-full h-full" />
          <BottomSheet title="Route Corridor & Preferences" peekHeight={140}>
            {PlannerControls}
          </BottomSheet>
        </div>
      </div>

      {/* Turn-by-Turn Timeline Drawer */}
      <Drawer
        isOpen={timelineDrawerOpen}
        onClose={() => setTimelineDrawerOpen(false)}
        title={activeRoute.title}
        subtitle={`${activeRoute.distanceKm} km • ${activeRoute.durationMin} minutes total`}
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-cream-warm/50 dark:bg-dark-bg/60 border border-cream-border dark:border-dark-border flex items-center justify-between text-xs font-mono">
            <span>Est. Cost: ₹{activeRoute.estimatedCost}</span>
            <span className="font-bold text-forest dark:text-forest-mint">
              CO₂ Saved: {activeRoute.co2SavedPercent}%
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-cream-border dark:before:bg-dark-border">
            {activeRoute.timeline.map((step, idx) => (
              <div key={step.id} className="relative flex items-start gap-3 pl-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white dark:border-dark-card flex items-center justify-center shrink-0 mt-0.5 z-10 ${
                    idx === 0
                      ? "bg-forest"
                      : idx === activeRoute.timeline.length - 1
                      ? "bg-vibrant-orange"
                      : "bg-sun"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-xs font-bold text-dark-bg dark:text-cream leading-tight">
                    {step.instruction}
                  </p>
                  <p className="text-[11px] font-mono text-muted-dark dark:text-cream/60 mt-0.5">
                    {step.roadName} • {step.distanceKm} km (~{step.durationMin}m)
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setTimelineDrawerOpen(false)}
            className="w-full py-3 rounded-xl bg-forest text-white font-bold text-xs shadow-soft"
          >
            Close Timeline
          </button>
        </div>
      </Drawer>
    </div>
  );
};
