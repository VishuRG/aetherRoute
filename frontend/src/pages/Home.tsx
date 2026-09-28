// Home Page Component
// Hero with animated contour pattern, search widget, live stats, destination carousel, popular routes marquee, and features

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  MapPin,
  ArrowRight,
  ArrowDownUp,
  Zap,
  Fuel,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { POPULAR_ROUTES } from "@/data/mockData";
import { VehicleType } from "@/types";

const HERO_DESTINATIONS = [
  {
    id: "dest-1",
    title: "DLF Cyber Hub",
    location: "Gurugram, Haryana",
    distance: "29.4 km",
    duration: "38 min",
    chargers: 14,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80",
    tag: "High-Speed EV Corridor",
  },
  {
    id: "dest-2",
    title: "Taj Expressway & Heritage",
    location: "Agra Corridor, UP",
    distance: "214 km",
    duration: "2h 45m",
    chargers: 22,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
    tag: "Scenic Weekend Drive",
  },
  {
    id: "dest-3",
    title: "AeroCity Global Hospitality",
    location: "IGI Airport, New Delhi",
    distance: "14.2 km",
    duration: "22 min",
    chargers: 18,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    tag: "Airport Fast Track",
  },
  {
    id: "dest-4",
    title: "Aravalli Biodiversity Retreat",
    location: "Sohna Hills, Haryana",
    distance: "48.5 km",
    duration: "52 min",
    chargers: 8,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    tag: "Zero-Emission Trail",
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const origin = useAppStore((s) => s.origin);
  const destination = useAppStore((s) => s.destination);
  const setOrigin = useAppStore((s) => s.setOrigin);
  const setDestination = useAppStore((s) => s.setDestination);
  const swapOriginDestination = useAppStore((s) => s.swapOriginDestination);
  const vehicleType = useAppStore((s) => s.vehicleType);
  const setVehicleType = useAppStore((s) => s.setVehicleType);

  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/plan");
  };

  return (
    <div className="min-h-screen pt-20 pb-16 space-y-24">
      {/* 1. HERO SECTION WITH TOPOGRAPHIC CONTOUR PATTERN */}
      <section className="relative overflow-hidden topo-pattern py-16 sm:py-24 border-b border-cream-border/60 dark:border-dark-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/15 text-forest dark:text-forest-mint border border-forest/30 text-xs font-mono font-bold tracking-wide"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Multi-Modal Routing for Clean Transit</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-extrabold font-sora text-dark-bg dark:text-cream tracking-tight leading-[1.1]"
              >
                Apple Maps precision.
                <br />
                <span className="text-forest dark:text-forest-mint">
                  Airbnb hospitality.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-muted-dark dark:text-cream/80 max-w-xl leading-relaxed"
              >
                Intelligent route planning with live EV Range Guard™, real-time fuel price sparklines,
                and community-verified hazard reporting.
              </motion.p>

              {/* Quick Vehicle Type Selector */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-mono font-bold uppercase text-muted-dark dark:text-cream/60">
                  Vehicle:
                </span>
                {(
                  [
                    { id: "ev", label: "⚡ EV", color: "bg-forest text-white" },
                    { id: "petrol", label: "⛽ Petrol", color: "bg-vibrant-orange text-white" },
                    { id: "diesel", label: "🚛 Diesel", color: "bg-forest-mint text-dark-bg font-bold" },
                    { id: "cng", label: "🍃 CNG", color: "bg-sun text-dark-bg font-bold" },
                  ] as Array<{ id: VehicleType; label: string; color: string }>
                ).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVehicleType(v.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                      vehicleType === v.id
                        ? `${v.color} shadow-soft`
                        : "bg-cream-warm/70 dark:bg-dark-card text-dark-bg dark:text-cream border border-cream-border dark:border-dark-border"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Interactive Search Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-5"
            >
              <form
                onSubmit={handlePlanSubmit}
                className="p-6 sm:p-8 rounded-3xl glass-panel shadow-layered space-y-4"
              >
                <div className="flex items-center justify-between border-b border-cream-border/60 dark:border-dark-border/60 pb-3">
                  <h2 className="text-base font-bold font-sora text-dark-bg dark:text-cream flex items-center gap-2">
                    <Compass className="w-4 h-4 text-forest" /> Quick Corridor Search
                  </h2>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sun text-dark-bg font-extrabold">
                    Live Data
                  </span>
                </div>

                {/* Origin Input */}
                <div className="relative">
                  <label className="block text-[11px] font-mono font-bold uppercase text-muted-dark dark:text-cream/60 mb-1">
                    From
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 w-3 h-3 rounded-full bg-forest" />
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-cream-warm/60 dark:bg-dark-bg/80 border border-cream-border dark:border-dark-border text-xs font-semibold text-dark-bg dark:text-cream focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    type="button"
                    onClick={swapOriginDestination}
                    className="p-2 rounded-full bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border hover:bg-forest hover:text-white transition-colors shadow-soft"
                    title="Swap starting point and destination"
                  >
                    <ArrowDownUp className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination Input */}
                <div className="relative">
                  <label className="block text-[11px] font-mono font-bold uppercase text-muted-dark dark:text-cream/60 mb-1">
                    To
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 w-3 h-3 rounded-full bg-vibrant-orange" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-cream-warm/60 dark:bg-dark-bg/80 border border-cream-border dark:border-dark-border text-xs font-semibold text-dark-bg dark:text-cream focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-bold font-sora text-sm bg-vibrant-orange hover:bg-vibrant-orangeHover text-white shadow-glowOrange flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <span>Calculate Intelligent Routes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. LIVE COMMUNITY STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-cream-warm/50 dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-forest dark:text-forest-mint">
              1.4M+
            </span>
            <p className="text-xs text-muted-dark dark:text-cream/70 font-medium">
              Kg CO₂ Emissions Avoided
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-vibrant-orange">
              4,820+
            </span>
            <p className="text-xs text-muted-dark dark:text-cream/70 font-medium">
              Live DC Superchargers
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-sun-dark dark:text-sun">
              99.2%
            </span>
            <p className="text-xs text-muted-dark dark:text-cream/70 font-medium">
              Hazard Warning Accuracy
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-dark-bg dark:text-cream">
              18 min
            </span>
            <p className="text-xs text-muted-dark dark:text-cream/70 font-medium">
              Average Detour Time Saved
            </p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR ROUTES CONTINUOUS MARQUEE */}
      <section className="space-y-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h2 className="text-xl font-bold font-sora text-dark-bg dark:text-cream flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sun" /> Trending Golden Corridors
          </h2>
          <span className="text-xs font-mono text-muted-dark dark:text-cream/60">
            Real-Time Speed & Detours
          </span>
        </div>

        {/* Marquee Track */}
        <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused] py-2">
          {[...POPULAR_ROUTES, ...POPULAR_ROUTES].map((item, idx) => (
            <Link
              key={idx}
              to="/plan"
              onClick={() => {
                setOrigin(item.from);
                setDestination(item.to);
              }}
              className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft w-72 flex flex-col justify-between hover:border-forest transition-colors"
            >
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-forest/15 text-forest dark:text-forest-mint">
                  {item.type}
                </span>
                <p className="font-bold text-sm font-sora text-dark-bg dark:text-cream mt-2 leading-tight">
                  {item.from.split(",")[0]} → {item.to.split(",")[0]}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-cream-border/60 dark:border-dark-border/60 text-xs font-mono text-muted-dark dark:text-cream/70">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.time}
                </span>
                <span className="font-bold text-forest dark:text-forest-mint">
                  {item.co2Saved}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. DESTINATION CAROUSEL WITH SWIPE & SNAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-sora text-dark-bg dark:text-cream">
              Curated Travel Corridors
            </h2>
            <p className="text-xs text-muted-dark dark:text-cream/70 mt-1">
              Top-rated road destinations with verified EV fast charging & fuel stations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setActiveCarouselIdx((prev) =>
                  prev === 0 ? HERO_DESTINATIONS.length - 1 : prev - 1
                )
              }
              className="p-2 rounded-xl bg-cream-warm dark:bg-dark-card border border-cream-border dark:border-dark-border hover:bg-forest hover:text-white transition-colors"
              aria-label="Previous destination"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setActiveCarouselIdx((prev) =>
                  prev === HERO_DESTINATIONS.length - 1 ? 0 : prev + 1
                )
              }
              className="p-2 rounded-xl bg-cream-warm dark:bg-dark-card border border-cream-border dark:border-dark-border hover:bg-forest hover:text-white transition-colors"
              aria-label="Next destination"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HERO_DESTINATIONS.map((dest, idx) => (
            <motion.div
              key={dest.id}
              whileHover={{ y: -4 }}
              className={`rounded-3xl overflow-hidden bg-cream-card dark:bg-dark-card border transition-all ${
                activeCarouselIdx === idx
                  ? "border-forest shadow-layered"
                  : "border-cream-border dark:border-dark-border shadow-soft"
              } flex flex-col`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-dark-bg/80 text-cream backdrop-blur-md">
                  {dest.tag}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold font-sora text-dark-bg dark:text-cream leading-tight">
                    {dest.title}
                  </h3>
                  <p className="text-xs text-muted-dark dark:text-cream/60 mt-0.5">
                    {dest.location}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-cream-border/60 dark:border-dark-border/60 text-muted-dark dark:text-cream/70">
                  <span>{dest.distance}</span>
                  <span className="font-bold text-forest dark:text-forest-mint">
                    ⚡ {dest.chargers} Chargers
                  </span>
                </div>

                <Link
                  to="/plan"
                  onClick={() => setDestination(dest.title)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-forest/10 hover:bg-forest hover:text-white text-forest dark:text-forest-mint text-center transition-colors"
                >
                  Plan Route Here
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (STAGGERED 3-STEP REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sun/20 text-dark-bg dark:text-cream">
            Effortless Mobility
          </span>
          <h2 className="text-3xl font-extrabold font-sora text-dark-bg dark:text-cream mt-2">
            How AetherRoute Outsmarts Traditional Maps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-bold font-mono text-sm shadow-soft">
              01
            </div>
            <h3 className="text-lg font-bold font-sora text-dark-bg dark:text-cream">
              Multimodal Highway Matrix
            </h3>
            <p className="text-xs text-muted-dark dark:text-cream/70 leading-relaxed">
              We calculate fastest, eco-regenerative, and cheapest toll routes simultaneously with accurate
              elevation data.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-vibrant-orange text-white flex items-center justify-center font-bold font-mono text-sm shadow-soft">
              02
            </div>
            <h3 className="text-lg font-bold font-sora text-dark-bg dark:text-cream">
              Range Guard™ & Fuel Sparkline
            </h3>
            <p className="text-xs text-muted-dark dark:text-cream/70 leading-relaxed">
              Predicts your exact battery SoC or fuel consumption and dynamically recommends the cheapest,
              shortest-detour stops.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sun text-dark-bg flex items-center justify-center font-bold font-mono text-sm shadow-soft">
              03
            </div>
            <h3 className="text-lg font-bold font-sora text-dark-bg dark:text-cream">
              Live Verified Road Hazards
            </h3>
            <p className="text-xs text-muted-dark dark:text-cream/70 leading-relaxed">
              Driver reports are verified after 3 confirmations. Avoid sudden accidents, waterlogging, or broken
              chargers before you arrive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
