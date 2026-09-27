"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap, Map, Leaf, Shield, Wallet, ArrowRight, TrendingDown,
  Navigation, Users, Bot, Bell, CheckCircle2, Sparkles, Activity
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export default function Home() {
  const [distance, setDistance] = useState<number>(18);
  const metroCo2 = (distance * 0.041).toFixed(2);
  const carCo2 = (distance * 0.171).toFixed(2);
  const co2Saved = (parseFloat(carCo2) - parseFloat(metroCo2)).toFixed(2);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/8 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" id="landing-logo">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-black font-bold" />
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-tight">EcoRoute</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded ml-2 font-mono">DELHI-NCR</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">Carbon Calculator</a>
            <a href="#impact" className="hover:text-emerald-400 transition-colors">NCR Transit</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              id="landing-login-btn"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              id="landing-app-btn"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 text-black hover:opacity-95 shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/20 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Real-Time Multimodal Travel Intelligence for Delhi-NCR
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Travel Faster. Save Money.<br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
              Cut Carbon Footprint.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Intelligent routing across <strong className="text-slate-200">Delhi Metro, DTC Buses, BluSmart EVs, Cabs, and Auto-Rickshaws</strong>. Optimized for live NCR traffic, AQI, weather, and fare comparison.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/plan"
              id="hero-plan-btn"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 text-black hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
            >
              <Navigation className="w-5 h-5" />
              Plan Eco Journey
            </Link>
            <Link
              href="/dashboard"
              id="hero-dashboard-btn"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold glass-card border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
            >
              Explore Live Dashboard
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto glass-card p-6 rounded-2xl border border-white/10 text-left">
            <div>
              <div className="text-2xl font-black text-white">42.6 kg</div>
              <div className="text-xs text-slate-400 font-medium">Avg CO₂ Saved / User / Mo</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">₹2,340</div>
              <div className="text-xs text-slate-400 font-medium">Avg Monthly Commute Savings</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400">286+</div>
              <div className="text-xs text-slate-400 font-medium">Delhi Metro Stations Live</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Transparent Emission Stats</div>
            </div>
          </div>
        </div>
      </section>

      {/* Carbon Calculator Preview Section */}
      <section id="calculator" className="py-20 px-6 bg-slate-950/60 border-y border-white/5 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Delhi-NCR Emission Savings Calculator</h2>
            <p className="text-slate-400">See how much carbon you save by taking Delhi Metro vs Private Car</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3 text-sm font-semibold">
                <span className="text-slate-300">Daily Commute Distance:</span>
                <span className="text-emerald-400 font-mono text-lg">{distance} km</span>
              </div>
              <input
                type="range"
                min={2}
                max={60}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                id="landing-distance-slider"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>CP to Karol Bagh (5 km)</span>
                <span>CP to Cyber City (22 km)</span>
                <span>Noida to Gurgaon (45 km)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/8">
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="text-xs font-semibold text-red-400 mb-1">Private Petrol Car</div>
                <div className="text-3xl font-black text-white font-mono">{carCo2} <span className="text-sm font-normal text-slate-400">kg CO₂</span></div>
                <div className="text-xs text-slate-400 mt-2">₹180 Estimated Fuel Cost</div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs font-semibold text-emerald-400 mb-1">Delhi Metro</div>
                <div className="text-3xl font-black text-white font-mono">{metroCo2} <span className="text-sm font-normal text-slate-400">kg CO₂</span></div>
                <div className="text-xs text-slate-400 mt-2">₹50 Metro Smartcard Fare</div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                <div className="text-xs font-semibold text-emerald-300 mb-1">Your Net Carbon Saved</div>
                <div className="text-3xl font-black text-emerald-400 font-mono">+{co2Saved} <span className="text-sm font-normal text-emerald-200">kg CO₂</span></div>
                <div className="text-xs text-emerald-300/80 mt-2 font-medium">Saves ₹130 per single trip! 🌱</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Complete Multimodal Intelligence</h2>
          <p className="text-slate-400 text-base">Built specifically for the unique transit challenges of Delhi, Gurugram, Noida, and Faridabad.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/8 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multimodal Routing Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Combines Metro, DTC Buses, BluSmart EVs, Rapido Bikes, and Autos into optimized turn-by-turn routes.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/8 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">EcoRoute AI Assistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Context-aware AI assistant that alerts you to metro delays, rain waterlogging, and budget travel advice.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/8 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">OCR Expense Manager</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Scan receipts for fuel, tolls, and cab fares. Auto-generates corporate reimbursement reports in 1 click.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/8 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Crowd Community Alerts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Live updates on potholes, waterlogged underpasses, and broken traffic signals reported by fellow commuters.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/8 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">1-Click SOS Emergency</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant panic alert broadcasting live GPS location to emergency contacts and nearby Delhi police stations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/8 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Climate Tech Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track carbon footprint reductions, tree equivalents, eco streaks, and monthly travel expense analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/8 bg-gradient-to-b from-slate-950 to-[#060913]">
        <div className="max-w-4xl mx-auto glass-card p-12 rounded-3xl border border-emerald-500/30 text-center relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Smarter Commuting Today</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Join thousands of Delhi-NCR commuters making sustainable, cost-effective transport choices every day.</p>
          <Link
            href="/dashboard"
            id="cta-launch-btn"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 text-black hover:opacity-95 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-1"
          >
            Launch EcoRoute App <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-300">EcoRoute Delhi-NCR</span> — Real-Time Multimodal Intelligence
          </div>
          <div>Built for sustainable climate-tech travel in India.</div>
        </div>
      </footer>
    </div>
  );
}
