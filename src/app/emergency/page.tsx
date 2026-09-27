"use client";

import { useState } from "react";
import { ShieldAlert, Phone, MapPin, CheckCircle2, AlertTriangle, Users, Plus, Sparkles } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { DEMO_NEARBY } from "@/lib/demo-data";

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [contacts, setContacts] = useState([
    { id: "c1", name: "Sunita Sharma", relationship: "Mother", phone: "+91 98100 12345", isPrimary: true },
    { id: "c2", name: "Anit Kumar", relationship: "Brother", phone: "+91 98111 67890", isPrimary: false },
  ]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactRel, setNewContactRel] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const handleTriggerSOS = async () => {
    setSosActive(true);
    try {
      await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: 28.6328,
          lng: 77.2197,
          address: "Connaught Place, New Delhi",
          contacts,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    const nc = {
      id: `c_${Date.now()}`,
      name: newContactName,
      relationship: newContactRel || "Friend",
      phone: newContactPhone,
      isPrimary: false,
    };
    setContacts([...contacts, nc]);
    setShowAddContact(false);
    setNewContactName("");
    setNewContactRel("");
    setNewContactPhone("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Emergency SOS Control Center <Sparkles className="w-5 h-5 text-red-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Instant panic alert, live GPS broadcasting & emergency helpline network
          </p>
        </div>
        <DemoBadge message="Emergency Safety Protocol" />
      </div>

      {/* SOS Big Button Banner */}
      <div className="glass-card p-8 rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-500/10 via-[#060913] to-red-500/10 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500/40 flex items-center justify-center mx-auto shadow-xl shadow-red-500/20 animate-pulse">
          <button
            onClick={handleTriggerSOS}
            id="emergency-trigger-sos-btn"
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            SOS
          </button>
        </div>

        <div>
          <h2 className="text-xl font-black text-white">Tap SOS to Broadcast Live Location</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Sends an urgent SMS & Web Push notification with your live GPS location to your {contacts.length} emergency contacts and nearby Delhi police station.
          </p>
        </div>

        {sosActive && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-xs font-bold text-red-300 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-red-400">
              <ShieldAlert className="w-5 h-5 animate-bounce" /> EMERGENCY ALERT BROADCASTED!
            </div>
            <div>Notified: Sunita Sharma (+91 98100 12345) & Connaught Place Police Station</div>
          </div>
        )}
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Delhi Police SOS", phone: "112 / 100", icon: "👮" },
          { label: "Women Helpline", phone: "1091", icon: "👩" },
          { label: "Medical Ambulance", phone: "102", icon: "🚑" },
          { label: "DMRC Safety Helpline", phone: "155370", icon: "🚇" },
        ].map((h, idx) => (
          <a
            key={idx}
            href={`tel:${h.phone.split(" ")[0]}`}
            className="glass-card p-4 rounded-2xl border border-white/10 hover:border-red-500/30 text-center space-y-1 block transition-all"
          >
            <div className="text-2xl mb-1">{h.icon}</div>
            <div className="text-xs font-bold text-white">{h.label}</div>
            <div className="text-xs text-emerald-400 font-mono font-bold">{h.phone}</div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contacts List */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Emergency Contacts
            </h2>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              id="emergency-add-contact-btn"
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Contact
            </button>
          </div>

          {showAddContact && (
            <form onSubmit={handleAddContact} className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-3 text-xs">
              <input type="text" placeholder="Name" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} required className="eco-input py-2" />
              <input type="text" placeholder="Relationship (e.g. Mother, Spouse)" value={newContactRel} onChange={(e) => setNewContactRel(e.target.value)} className="eco-input py-2" />
              <input type="tel" placeholder="Phone Number (+91...)" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} required className="eco-input py-2" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddContact(false)} className="px-3 py-1.5 rounded-lg glass-card text-slate-300">Cancel</button>
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-400 text-black font-bold">Save Contact</button>
              </div>
            </form>
          )}

          <div className="divide-y divide-white/8">
            {contacts.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{c.name} ({c.relationship})</div>
                  <div className="text-slate-400 font-mono">{c.phone}</div>
                </div>
                {c.isPrimary && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    PRIMARY
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Hospitals & Police Stations */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" /> Nearby Emergency Facilities (Delhi NCR)
          </h2>

          <div className="space-y-3 text-xs">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Hospitals</div>
            {DEMO_NEARBY.hospitals.map((h, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{h.name}</div>
                  <div className="text-slate-400">{h.distance} km away</div>
                </div>
                <a href={`tel:${h.phone}`} className="text-emerald-400 font-mono font-bold hover:underline">
                  {h.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
