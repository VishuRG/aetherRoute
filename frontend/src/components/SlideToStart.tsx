// Interactive "Slide to Start Navigation" Swipe-Confirm Control with spring physics

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Navigation, Check, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";
import { useAppStore } from "@/store/useAppStore";

export const SlideToStart: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const isNavigating = useAppStore((s) => s.isNavigating);
  const setIsNavigating = useAppStore((s) => s.setIsNavigating);
  const addToast = useAppStore((s) => s.addToast);

  const [confirmed, setConfirmed] = useState(isNavigating);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 180], [1, 0]);
  const bgWidth = useTransform(x, [0, 200], ["0%", "100%"]);

  const handleDragEnd = () => {
    if (x.get() > 160) {
      setConfirmed(true);
      setIsNavigating(true);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#1E7F4F", "#3FBF7F", "#FFC93C"],
      });
      addToast({
        title: "Navigation Active",
        message: "Live GPS guidance started. Road alerts and chargers monitored in real-time.",
        priority: "success",
      });
      if (onComplete) onComplete();
    } else {
      x.set(0);
    }
  };

  const handleStop = () => {
    setConfirmed(false);
    setIsNavigating(false);
    x.set(0);
    addToast({
      title: "Trip Ended",
      message: "Navigation stopped. Trip metrics saved.",
      priority: "info",
    });
  };

  if (confirmed) {
    return (
      <div className="w-full p-2.5 rounded-2xl bg-forest text-white flex items-center justify-between shadow-glowGreen">
        <div className="flex items-center gap-2 pl-3">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-mint animate-ping" />
          <span className="text-xs font-mono font-bold tracking-wide uppercase">
            Navigation In Progress
          </span>
        </div>
        <button
          onClick={handleStop}
          className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors"
        >
          End Route
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-14 rounded-2xl bg-cream-warm dark:bg-dark-card border border-cream-border dark:border-dark-border overflow-hidden select-none p-1 shadow-inner">
      {/* Dynamic Background Fill */}
      <motion.div
        className="absolute top-1 bottom-1 left-1 bg-forest rounded-xl"
        style={{ width: bgWidth }}
      />

      {/* Guide Label with Fade */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono font-bold text-muted-dark dark:text-cream/70 tracking-wider uppercase gap-1"
      >
        <span>Slide to Start Navigation</span>
        <ChevronRight className="w-4 h-4 animate-pulse" />
      </motion.div>

      {/* Draggable Knob */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 210 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 w-12 h-12 rounded-xl bg-vibrant-orange hover:bg-vibrant-orangeHover text-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-glowOrange transition-colors"
      >
        <Navigation className="w-5 h-5 fill-current" />
      </motion.div>
    </div>
  );
};
