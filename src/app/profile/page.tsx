"use client";

import { useState, useEffect } from "react";
import {
  User, MapPin, Car, ShieldCheck, Mail, Phone, Edit2, Plus, Sparkles,
  CheckCircle2, Save, Trash2, Heart, Briefcase, GraduationCap, Home
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { DELHI_NCR_LOCATIONS, resolveLocation } from "@/lib/locations";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Aarav Sharma",
    email: "commuter@ecoroute.in",
    mobile: "+91 98100 12345",
    bio: "Sustainable commuter across Delhi & Gurugram. Metro first, EV second.",
    city: "Delhi",
    homeAddress: "Connaught Place (Rajiv Chowk), New Delhi",
    workAddress: "DLF Cyber City, Phase 2, Gurugram",
    collegeAddress: "North Campus, Delhi University",
  });

  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // New location modal state
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocLabel, setNewLocLabel] = useState("Gym");
  const [newLocAddress, setNewLocAddress] = useState(DELHI_NCR_LOCATIONS[0].name);

  // Load real user profile from SQLite database
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          const u = data.user;
          setProfile({
            name: u.name || "Aarav Sharma",
            email: u.email || "commuter@ecoroute.in",
            mobile: u.mobile || "+91 98100 12345",
            bio: u.profile?.bio || "Sustainable commuter across Delhi & Gurugram.",
            city: u.profile?.city || "Delhi",
            homeAddress: u.profile?.homeAddress || "Connaught Place (Rajiv Chowk), New Delhi",
            workAddress: u.profile?.workAddress || "DLF Cyber City, Gurugram",
            collegeAddress: u.profile?.collegeAddress || "North Campus, Delhi University",
          });
          if (u.savedLocations?.length > 0) {
            setSavedPlaces(u.savedLocations);
          }
        }
      })
      .catch((err) => console.warn(err));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSaveMessage("Profile updated in SQLite database!");
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loc = resolveLocation(newLocAddress);
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: newLocLabel,
          name: loc.name,
          address: loc.name,
          lat: loc.lat,
          lng: loc.lng,
          icon: newLocLabel === "Home" ? "🏠" : newLocLabel === "Work" ? "💼" : "📍",
        }),
      });

      const data = await res.json();
      if (res.ok && data.location) {
        setSavedPlaces((prev) => [data.location, ...prev]);
        setShowAddLocation(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            User Profile & Saved Places <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal commute profile, saved NCR hubs, and registered vehicles
          </p>
        </div>
        <DemoBadge message="SQL User Profile Center" />
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-white/10 text-center space-y-4 shadow-2xl relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-black flex items-center justify-center font-black text-3xl mx-auto shadow-xl shadow-emerald-500/20">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">{profile.name}</h2>
            <p className="text-xs text-emerald-400 font-medium">Eco Commuter • Active Member</p>
          </div>

          <p className="text-xs text-slate-400 italic">"{profile.bio}"</p>

          <div className="space-y-2.5 text-left text-xs border-t border-white/8 pt-4 text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{profile.mobile}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{profile.city}, India</span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
            {editing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* Edit Form or Saved Places */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Edit Commute Profile
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="eco-input py-2.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Bio / Travel Note</label>
                  <input
                    type="text"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="eco-input py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={profile.mobile}
                    onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                    className="eco-input py-2.5 text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Home Address Hub</label>
                    <input
                      type="text"
                      value={profile.homeAddress}
                      onChange={(e) => setProfile({ ...profile, homeAddress: e.target.value })}
                      className="eco-input py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Work Address Hub</label>
                    <input
                      type="text"
                      value={profile.workAddress}
                      onChange={(e) => setProfile({ ...profile, workAddress: e.target.value })}
                      className="eco-input py-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-xs flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {loading ? "Saving..." : "Save to Database"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Saved Commute Locations
                </h2>
                <button
                  onClick={() => setShowAddLocation(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/25 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Location
                </button>
              </div>

              {/* Add Location Modal */}
              {showAddLocation && (
                <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-emerald-400 uppercase">Save New Commute Hub</div>
                  <form onSubmit={handleAddLocation} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Label</label>
                        <select
                          value={newLocLabel}
                          onChange={(e) => setNewLocLabel(e.target.value)}
                          className="eco-input py-2 text-xs"
                        >
                          <option value="Home">Home (🏠)</option>
                          <option value="Work">Work / Office (💼)</option>
                          <option value="College">College / Univ (🎓)</option>
                          <option value="Gym">Gym / Fitness (🏋️)</option>
                          <option value="Metro Station">Metro Station (🚇)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Delhi-NCR Hub</label>
                        <select
                          value={newLocAddress}
                          onChange={(e) => setNewLocAddress(e.target.value)}
                          className="eco-input py-2 text-xs"
                        >
                          {DELHI_NCR_LOCATIONS.map((loc) => (
                            <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                              {loc.name} ({loc.zone})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                      >
                        Save Location
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddLocation(false)}
                        className="px-3 py-2 rounded-xl bg-white/10 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {savedPlaces.map((sp, idx) => (
                  <div
                    key={sp.id || idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between hover:bg-white/8 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{sp.icon || "📍"}</span>
                      <div>
                        <div className="font-bold text-white text-xs">{sp.label}</div>
                        <div className="text-[11px] text-slate-400">{sp.address || sp.name}</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">
                      Lat: {sp.lat?.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle specs */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-400" /> Commute Footprint Baseline
            </h2>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚗</span>
                <div>
                  <div className="font-bold text-white">Private Petrol Hatchback Baseline</div>
                  <div className="text-slate-400">Delhi Average: 14.5 km/L • 171g CO₂/km</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                0.17 kg CO₂/km
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚇</span>
                <div>
                  <div className="font-bold text-emerald-400">Delhi Metro (DMRC Electric)</div>
                  <div className="text-slate-400">Solar + Wind powered grid • 41g CO₂/km</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                76% Lower CO₂
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
