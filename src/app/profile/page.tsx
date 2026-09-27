"use client";

import { useState } from "react";
import { User, MapPin, Car, ShieldCheck, Mail, Phone, Edit2, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul@ecoroute.in",
    phone: "+91 98765 43210",
    city: "New Delhi",
    homeAddress: "Connaught Place, New Delhi",
    workAddress: "DLF Cyber City, Gurugram",
  });

  const [savedPlaces, setSavedPlaces] = useState([
    { id: "1", label: "Home", address: "Connaught Place, New Delhi", icon: "🏠" },
    { id: "2", label: "Work / Office", address: "DLF Cyber City, Gurugram", icon: "💼" },
    { id: "3", label: "College", address: "North Campus, Delhi University", icon: "🎓" },
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            User Profile & Saved Places <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal commute profile, saved locations, and registered vehicles
          </p>
        </div>
        <DemoBadge message="User Profile Center" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-white/10 text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-black flex items-center justify-center font-black text-3xl mx-auto shadow-lg shadow-emerald-500/20">
            RS
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">{profile.name}</h2>
            <p className="text-xs text-emerald-400 font-medium">Eco Commuter • Gold Tier</p>
          </div>

          <div className="space-y-2 text-left text-xs border-t border-white/8 pt-4 text-slate-300">
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {profile.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {profile.phone}</div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {profile.city}</div>
          </div>
        </div>

        {/* Saved Places & Vehicles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Saved Commute Locations
              </h2>
            </div>

            <div className="space-y-3">
              {savedPlaces.map((sp) => (
                <div key={sp.id} className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sp.icon}</span>
                    <div>
                      <div className="font-bold text-white text-xs">{sp.label}</div>
                      <div className="text-[11px] text-slate-400">{sp.address}</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer">Edit</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-400" /> Registered Vehicles & Fuel Specs
            </h2>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚗</span>
                <div>
                  <div className="font-bold text-white">Hyundai i20 (Petrol)</div>
                  <div className="text-slate-400">Reg: DL 03 CC 4821 • Mileage: 16 km/L</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                0.17 kg CO₂/km
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
