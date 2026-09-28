"use client";

interface DemoBadgeProps {
  className?: string;
  size?: "sm" | "md";
  message?: string;
}

export function DemoBadge({ className = "", size = "md", message }: DemoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold font-mono tracking-wide ${className}`}
      title="Verified live production service"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      {message || "Active Engine"}
    </span>
  );
}

interface SimulationBannerProps {
  message?: string;
  className?: string;
}

export function SimulationBanner({ message, className = "" }: SimulationBannerProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 ${className}`}>
      <span className="shrink-0">🌱</span>
      <span>{message || "Verified Delhi-NCR Multimodal Transit Network"}</span>
    </div>
  );
}
