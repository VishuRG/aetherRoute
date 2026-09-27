"use client";

import { useEffect, useState } from "react";
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Filter } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export default function NotificationsPage() {
  const [data, setData] = useState<any>({ notifications: [], alerts: [] });

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Transit Alerts & Notifications <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time DMRC metro status updates, traffic congestion warnings, & eco milestones
          </p>
        </div>
        <DemoBadge message="Live Push Alert Feed" />
      </div>

      {/* Critical System Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> High Priority Transit Advisories
          </h2>
          {data.alerts.map((alt: any) => (
            <div
              key={alt.id}
              className="glass-card p-5 rounded-3xl border border-amber-500/40 bg-amber-500/10 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{alt.title}</h3>
                  <span className="text-[10px] text-amber-400 font-mono">{alt.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{alt.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-app Notifications */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" /> Recent Notifications
        </h2>

        <div className="divide-y divide-white/8">
          {data.notifications &&
            data.notifications.map((n: any) => (
              <div key={n.id} className="py-4 flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                  {n.type === "transit" ? "🚇" : n.type === "traffic" ? "🚗" : "🌱"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                  </div>
                  <p className="text-slate-300 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
