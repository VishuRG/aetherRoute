"use client";

import { useEffect, useState } from "react";
import { BarChart2, TrendingDown, Leaf, Wallet, Flame, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { AnalyticsSummary } from "@/services/analytics";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e));
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-slate-400">Loading Analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Climate Tech & Eco Analytics <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track your personal carbon emission savings, travel spend, & environmental impact
          </p>
        </div>
        <DemoBadge message="Carbon Impact Analytics Engine" />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="text-xs text-slate-400 font-medium">Monthly CO₂ Saved</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{data.co2SavedKg} kg</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">≈ {data.treesEquivalent} Trees Planted 🌳</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
          <div className="text-xs text-slate-400 font-medium">Total Distance Traveled</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{data.totalDistanceKm} km</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 34 NCR Trips</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5">
          <div className="text-xs text-slate-400 font-medium">Total Transport Spend</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">₹{data.totalSpend}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Saved ₹480 vs Car Fuel</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-orange-500/30 bg-orange-500/5">
          <div className="text-xs text-slate-400 font-medium">Current Eco Streak</div>
          <div className="text-2xl font-black text-orange-400 font-mono mt-1">{data.ecoStreakDays} Days 🔥</div>
          <div className="text-[11px] text-slate-400 mt-1">Top 5% Eco Commuter</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transport Mode Breakdown */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" /> Transport Mode Share (This Month)
          </h2>

          <div className="space-y-4 text-xs">
            {data.modeBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-white">{item.mode}</span>
                  <span className="text-slate-400 font-mono">{item.percentage}% ({item.count} trips)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Savings Trend Chart */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" /> Weekly CO₂ Savings Trend (kg)
          </h2>

          <div className="flex items-end justify-between h-48 pt-4 px-2 border-b border-white/8 gap-2">
            {data.weeklyTrend.map((t, idx) => {
              const maxVal = 10;
              const heightPct = Math.round((t.co2Saved / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-emerald-400 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.co2Saved}kg
                  </div>
                  <div
                    className="w-full max-w-[28px] rounded-t-xl bg-gradient-to-t from-emerald-500 to-cyan-400 transition-all duration-300 group-hover:brightness-125"
                    style={{ height: `${heightPct}%` }}
                  />
                  <div className="text-[11px] text-slate-400 font-medium">{t.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" /> Climate Hero Badges & Milestones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="text-3xl">🌱</div>
            <div>
              <div className="text-xs font-bold text-white">Carbon Saver Level 2</div>
              <div className="text-[10px] text-emerald-400 font-medium">Saved &gt;40kg CO₂</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="text-3xl">🚇</div>
            <div>
              <div className="text-xs font-bold text-white">Metro Commuter Gold</div>
              <div className="text-[10px] text-cyan-400 font-medium">20+ Metro Journeys</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <div className="text-xs font-bold text-white">7-Day Streak Master</div>
              <div className="text-[10px] text-orange-400 font-medium">7 Consecutive Eco Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
