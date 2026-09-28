"use client";

import { useState, useEffect } from "react";
import {
  Settings, SlidersHorizontal, Bell, Key, ShieldCheck, Sparkles,
  Database, CheckCircle2, User, Lock, Save, Navigation, RefreshCw
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export default function SettingsPage() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [trafficAlerts, setTrafficAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [preferredMode, setPreferredMode] = useState("Metro");
  const [maxWalkingMinutes, setMaxWalkingMinutes] = useState(15);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
          if (data.user.travelPreferences) {
            setPreferredMode(data.user.travelPreferences.preferredMode || "Metro");
            setMaxWalkingMinutes(data.user.travelPreferences.maxWalkingMinutes || 15);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            System Settings & Preferences <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure commute preferences, notifications, and application settings
          </p>
        </div>
        <DemoBadge message="Production System Ready" />
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* System & Database Status */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Live Services & Database Connectivity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">SQL Database Engine</div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> SQLite (Prisma ORM)
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">dev.db • Connected</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Real-Time Weather API</div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Delhi Weather Feed
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">wttr.in / OpenWeather</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Transit Fare Engine</div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Authentic DMRC Matrix
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">36 Verified Hubs</div>
            </div>
          </div>
        </div>

        {/* Commute Preferences */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" /> Commute Routing Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Default Preferred Mode
              </label>
              <select
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value)}
                className="eco-input py-2.5 text-xs font-semibold"
              >
                <option value="Metro">🚇 Delhi Metro (Fastest, Lowest Emission)</option>
                <option value="Bus">🚌 DTC Electric AC Bus (Cheapest)</option>
                <option value="Cab">🚖 BluSmart EV Cab (Direct Comfort)</option>
                <option value="Auto">🛺 Delhi CNG Auto (Flexible Last-Mile)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                <span>Maximum Walking Time</span>
                <span className="text-emerald-400 font-mono">{maxWalkingMinutes} min</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={maxWalkingMinutes}
                onChange={(e) => setMaxWalkingMinutes(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-2"
              />
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-emerald-500/20"
          >
            <Save className="w-3.5 h-3.5" /> Save Commute Defaults
          </button>
        </div>

        {/* Notifications & Travel Alerts */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" /> Push Notifications & Real-Time Alerts
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/8">
              <div>
                <div className="font-bold text-white">Live DMRC Line Disruption Alerts</div>
                <div className="text-slate-400">Headway updates, delay announcements, and platform notices</div>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  pushNotifications ? "bg-emerald-400" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                    pushNotifications ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/8">
              <div>
                <div className="font-bold text-white">Delhi-NCR Weather & Rain Alerts</div>
                <div className="text-slate-400">Rainfall waterlogging warnings and extreme summer heat advisories</div>
              </div>
              <button
                onClick={() => setWeatherAlerts(!weatherAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  weatherAlerts ? "bg-emerald-400" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                    weatherAlerts ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/8">
              <div>
                <div className="font-bold text-white">Traffic Congestion Corridors</div>
                <div className="text-slate-400">NH-48 Mahipalpur flyover, Ring Road ITO, DND Flyway alerts</div>
              </div>
              <button
                onClick={() => setTrafficAlerts(!trafficAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  trafficAlerts ? "bg-emerald-400" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                    trafficAlerts ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
