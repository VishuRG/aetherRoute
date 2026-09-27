"use client";

interface DemoBadgeProps {
  className?: string;
  size?: "sm" | "md";
  message?: string;
}

export function DemoBadge({ className = "", size = "md", message }: DemoBadgeProps) {
  return (
    <span
      className={`badge-demo ${className}`}
      title="This data is simulated for demonstration. Connect real API keys for live data."
    >
      <span className={size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"}>⚡</span>
      {message || "Demo Data"}
    </span>
  );
}

interface SimulationBannerProps {
  message?: string;
  className?: string;
}

export function SimulationBanner({ message, className = "" }: SimulationBannerProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/15 text-xs text-amber-400 ${className}`}>
      <span className="shrink-0">⚠️</span>
      <span>{message || "Simulation Mode — Connect API keys in .env.local for real-time data"}</span>
    </div>
  );
}
