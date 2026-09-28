// Hook for reduced motion detection and user override

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useReducedMotion() {
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const setReducedMotion = useAppStore((s) => s.setReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [setReducedMotion]);

  return {
    reducedMotion,
    setReducedMotion,
  };
}
