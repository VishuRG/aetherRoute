// ThemeToggle with Sun-Moon morph, sliding knob, and circular reveal integration

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle: React.FC = () => {
  const { theme, isDark, setTheme } = useTheme();

  const handleSelect = (mode: "light" | "dark" | "system", e: React.MouseEvent) => {
    const coords = { x: e.clientX, y: e.clientY };
    setTheme(mode, coords);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className="relative flex items-center p-1 rounded-full bg-cream-warm/80 dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft"
    >
      {/* Light Option */}
      <button
        onClick={(e) => handleSelect("light", e)}
        role="radio"
        aria-checked={theme === "light"}
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          theme === "light"
            ? "text-dark-bg font-bold"
            : "text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream"
        }`}
        title="Light theme"
      >
        <Sun className="w-4 h-4" />
      </button>

      {/* Dark Option */}
      <button
        onClick={(e) => handleSelect("dark", e)}
        role="radio"
        aria-checked={theme === "dark"}
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          theme === "dark"
            ? "text-cream font-bold"
            : "text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream"
        }`}
        title="Dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>

      {/* System Option */}
      <button
        onClick={(e) => handleSelect("system", e)}
        role="radio"
        aria-checked={theme === "system"}
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          theme === "system"
            ? isDark
              ? "text-cream font-bold"
              : "text-dark-bg font-bold"
            : "text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream"
        }`}
        title="Follow system theme"
      >
        <Laptop className="w-4 h-4" />
      </button>

      {/* Sliding Knob Indicator */}
      <motion.div
        layoutId="themeKnob"
        className="absolute top-1 bottom-1 w-8 rounded-full bg-sun text-dark-bg shadow-sm"
        style={{
          left:
            theme === "light"
              ? "4px"
              : theme === "dark"
              ? "36px"
              : "68px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
};
