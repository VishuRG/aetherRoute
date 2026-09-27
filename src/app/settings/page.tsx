"use client";

import { useState } from "react";
import { Settings, SlidersHorizontal, Bell, Key, ShieldCheck, Sparkles } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export default function SettingsPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [trafficAlerts, setTrafficAlerts] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            System Settings & Preferences <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure application defaults, notifications, and API credentials
          </p>
        </div>
        <DemoBadge message="System Preferences" />
      </div>

      <div className="space-y-6">
        {/* Environment & Demo Mode Settings */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" /> Demo Mode & External API Providers
          </h2>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> DEMO_MODE Active (Indian Simulated Data)
            </div>
            <p className="text-slate-300">
              EcoRoute is running with realistic Indian simulated data. To connect live OpenStreetMap / Razorpay Sandbox / Gemini AI keys, edit your <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-400 font-mono">.env.local</code> file.
            </p>
          </div>
        </div>

        {/* Notifications & Preferences */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" /> Push Notifications & Travel Alerts
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/8">
              <div>
                <div className="font-bold text-white">Live Push Notifications</div>
                <div className="text-slate-400">Receive alerts for metro delays & rain waterlogging</div>
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

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/8">
              <div>
                <div className="font-bold text-white">Traffic & Congestion Advisories</div>
                <div className="text-slate-400 font-mono">NH-48, Ring Road, Dhaula Kuan alerts</div>
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
