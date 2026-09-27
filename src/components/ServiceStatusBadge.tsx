"use client";

export type ServiceDataStatus = "LIVE" | "DEMO" | "EXTERNAL";

interface ServiceStatusBadgeProps {
  status: ServiceDataStatus;
  label?: string;
  className?: string;
}

export function ServiceStatusBadge({ status, label, className = "" }: ServiceStatusBadgeProps) {
  if (status === "LIVE") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-wide font-mono ${className}`}
        title="Verified real-time data returned from configured API"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        🟢 {label || "LIVE API"}
      </span>
    );
  }

  if (status === "EXTERNAL") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold tracking-wide font-mono ${className}`}
        title="Redirects or deep links to official provider / government portal"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        🔵 {label || "EXTERNAL PORTAL"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold tracking-wide font-mono ${className}`}
      title="Simulated data for demonstration — Connect API keys in .env.local to activate LIVE mode"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      🟡 {label || "DEMO SIMULATION"}
    </span>
  );
}
