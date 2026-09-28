"use client";

export type ServiceDataStatus = "LIVE" | "DEMO" | "EXTERNAL";

interface ServiceStatusBadgeProps {
  status?: ServiceDataStatus;
  label?: string;
  className?: string;
}

export function ServiceStatusBadge({ status = "LIVE", label, className = "" }: ServiceStatusBadgeProps) {
  if (status === "EXTERNAL") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-wide font-mono ${className}`}
        title="Official provider integration"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        {label || "OFFICIAL PORTAL"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-wide font-mono ${className}`}
      title="Verified live production transit feed"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      {label || "LIVE ENGINE"}
    </span>
  );
}
