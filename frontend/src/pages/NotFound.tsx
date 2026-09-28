// Playful 404 Lost-on-the-Road Animated Page

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, MapPin, ArrowLeft, RefreshCw } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-24 h-24 rounded-3xl bg-vibrant-orange/15 text-vibrant-orange flex items-center justify-center mb-6 shadow-glowOrange border-2 border-vibrant-orange"
      >
        <MapPin className="w-12 h-12" />
      </motion.div>

      <span className="text-xs font-mono font-bold tracking-widest uppercase text-vibrant-orange mb-2">
        Off The Grid • 404 Error
      </span>

      <h1 className="text-4xl sm:text-5xl font-extrabold font-sora text-dark-bg dark:text-cream tracking-tight mb-3">
        Looks like you took an uncharted exit.
      </h1>

      <p className="text-sm text-muted-dark dark:text-cream/70 max-w-md mb-8 leading-relaxed">
        The coordinates you entered don't correspond to any known highway or charging corridor in our
        multimodal database.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-forest text-white hover:bg-forest-deep shadow-soft text-xs transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Reroute to Home</span>
        </Link>

        <Link
          to="/plan"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream text-xs hover:border-forest transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Open Planner</span>
        </Link>
      </div>
    </div>
  );
};
