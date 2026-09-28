// Hook for Theme management with View Transitions circular reveal

import { useAppStore } from "@/store/useAppStore";

export function useTheme() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = (e?: React.MouseEvent) => {
    let coords: { x: number; y: number } | undefined;
    if (e) {
      coords = { x: e.clientX, y: e.clientY };
    }
    const next = isDark ? "light" : "dark";
    setTheme(next, coords);
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
}
