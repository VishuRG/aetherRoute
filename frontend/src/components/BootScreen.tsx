// Boot Animation Component
// Full-screen splash in active theme, SVG route drawing with traveling car,
// 0-100% counter, rotating status lines, and dual-curtain clip-path exit.

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Zap, Fuel, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STATUS_LINES = [
  "Warming up the engine...",
  "Finding chargers nearby...",
  "Checking fuel stations...",
  "Scanning road conditions...",
  "Optimizing multimodal paths...",
];

export const BootScreen: React.FC = () => {
  const bootCompleted = useAppStore((s) => s.bootCompleted);
  const setBootCompleted = useAppStore((s) => s.setBootCompleted);
  const { reducedMotion } = useReducedMotion();

  const [counter, setCounter] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (bootCompleted) return;

    // Show skip after 1 second
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    if (reducedMotion) {
      const quickTimer = setTimeout(() => {
        setBootCompleted(true);
      }, 600);
      return () => {
        clearTimeout(skipTimer);
        clearTimeout(quickTimer);
      };
    }

    // 0-100% progress counter over ~2.8s
    const start = Date.now();
    const duration = 2800;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setCounter(progress);

      const sIdx = Math.min(
        STATUS_LINES.length - 1,
        Math.floor((progress / 100) * STATUS_LINES.length)
      );
      setStatusIndex(sIdx);

      if (progress >= 100) {
        clearInterval(interval);
        setExiting(true);
        setTimeout(() => {
          setBootCompleted(true);
        }, 750);
      }
    }, 35);

    return () => {
      clearInterval(interval);
      clearTimeout(skipTimer);
    };
  }, [bootCompleted, reducedMotion, setBootCompleted]);

  if (bootCompleted) return null;

  const handleSkip = () => {
    setExiting(true);
    setTimeout(() => {
      setBootCompleted(true);
    }, 400);
  };

  return (
    <AnimatePresence>
      {!bootCompleted && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-cream dark:bg-dark-bg text-dark-bg dark:text-cream select-none">
          {/* Dual Panel Sliding Curtain Exit */}
          {exiting && (
            <>
              {/* Green Panel 1 */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-50 bg-forest"
              />
              {/* Yellow Panel 2 */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-40 bg-sun"
              />
            </>
          )}

          {/* Background Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-forest/10 dark:bg-forest/20 blur-3xl pointer-events-none" />

          {/* Skip Button */}
          {showSkip && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSkip}
              className="absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-warm-cream/80 dark:bg-dark-card/80 border border-cream-border dark:border-dark-border hover:bg-forest hover:text-white transition-all shadow-soft"
            >
              Skip Intro ⇥
            </motion.button>
          )}

          {/* Center Stage Animation */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Animated Route Line & Traveling Car SVG */}
            <div className="relative w-72 h-32 mb-8">
              <svg
                viewBox="0 0 288 128"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Background Track */}
                <path
                  d="M 24 96 C 80 96, 70 32, 144 32 C 218 32, 208 96, 264 96"
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Animated Drawing Route Line */}
                <motion.path
                  d="M 24 96 C 80 96, 70 32, 144 32 C 218 32, 208 96, 264 96"
                  stroke="#1E7F4F"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: counter / 100 }}
                  transition={{ ease: "linear" }}
                />

                {/* Origin Pin */}
                <circle cx="24" cy="96" r="6" fill="#1E7F4F" />
                <circle cx="24" cy="96" r="10" stroke="#1E7F4F" strokeWidth="2" opacity="0.4" />

                {/* Destination Pin */}
                <circle cx="264" cy="96" r="6" fill="#FF7A1A" />
                <circle cx="264" cy="96" r="10" stroke="#FF7A1A" strokeWidth="2" opacity="0.4" />
              </svg>

              {/* Dynamic Traveling Vehicle Badge */}
              <motion.div
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-forest dark:bg-forest-mint text-white flex items-center justify-center shadow-glowGreen text-xs"
                style={{
                  left: `${24 + (counter / 100) * 240}px`,
                  top: `${
                    counter < 50
                      ? 96 - (counter / 50) * 64
                      : 32 + ((counter - 50) / 50) * 64
                  }px`,
                }}
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🚗
              </motion.div>
            </div>

            {/* Brand Title */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-white shadow-soft">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight font-sora">
                Aether<span className="text-forest dark:text-forest-mint">Route</span>
              </h1>
            </motion.div>

            <p className="text-xs text-muted-dark dark:text-cream/70 font-medium mb-6">
              Precision Navigation • Live Road Intelligence
            </p>

            {/* Numerical Progress Indicator */}
            <div className="w-full bg-cream-border dark:bg-dark-border h-2 rounded-full overflow-hidden mb-3 p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-forest via-forest-mint to-sun rounded-full"
                style={{ width: `${counter}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-xs font-mono text-muted-dark dark:text-cream/60">
              <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                {statusIndex === 0 && <Compass className="w-3.5 h-3.5 text-forest" />}
                {statusIndex === 1 && <Zap className="w-3.5 h-3.5 text-forest-mint" />}
                {statusIndex === 2 && <Fuel className="w-3.5 h-3.5 text-vibrant-orange" />}
                {statusIndex >= 3 && <AlertTriangle className="w-3.5 h-3.5 text-sun" />}
                {STATUS_LINES[statusIndex]}
              </span>
              <span className="font-bold text-forest dark:text-forest-mint">
                {counter}%
              </span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
