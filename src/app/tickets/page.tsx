"use client";

import { useState } from "react";
import { Ticket, QrCode, CheckCircle2, ShieldCheck, Sparkles, Plus, Clock } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { DEMO_DELHI_LOCATIONS } from "@/lib/demo-data";

export default function TicketsPage() {
  const [activeTicket, setActiveTicket] = useState<any>({
    ticketNumber: "TKT-METRO-948201",
    ticketType: "Metro",
    operator: "DMRC",
    fromStation: "Connaught Place (Rajiv Chowk)",
    toStation: "DLF Cyber City, Gurugram",
    passengerCount: 1,
    fare: 60,
    validUntil: "2026-09-28 23:59 IST",
    status: "active",
    qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TKT-METRO-948201-DMRC-RAJI-CYBER",
  });

  const [fromStation, setFromStation] = useState("Connaught Place (Rajiv Chowk)");
  const [toStation, setToStation] = useState("DLF Cyber City, Gurugram");
  const [passengerCount, setPassengerCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketType: "Metro",
          fromStation,
          toStation,
          fare: 60 * passengerCount,
          passengerCount,
        }),
      });

      const data = await res.json();
      setActiveTicket({
        ...data,
        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.qrCodeData || data.ticketNumber)}`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Digital QR Transit Tickets <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Contactless DMRC Metro & DTC Bus tickets valid at automated AFCS gates
          </p>
        </div>
        <DemoBadge message="Contactless AFCS QR Wallet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Ticket Active Card View */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 to-[#060913] space-y-6 text-center shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {activeTicket.operator} • {activeTicket.ticketType}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto shadow-xl flex items-center justify-center">
              <img
                src={activeTicket.qrUrl}
                alt="Digital QR Ticket"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="space-y-2 text-left text-xs border-t border-white/8 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Ticket Ref:</span>
                <span className="font-mono text-white font-bold">{activeTicket.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">From:</span>
                <span className="text-white font-semibold">{activeTicket.fromStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To:</span>
                <span className="text-white font-semibold">{activeTicket.toStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passengers:</span>
                <span className="text-white font-bold">{activeTicket.passengerCount} Adult</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Fare Paid:</span>
                <span className="text-emerald-400 font-mono text-sm font-black">₹{activeTicket.fare}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-2 border-t border-white/8 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tap QR at Metro AFC Turnstile Gate
            </div>
          </div>
        </div>

        {/* Instant Ticket Generator Form */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" /> Book New Metro / Bus Ticket
          </h2>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Boarding Station</label>
                <select
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  id="ticket-from-select"
                  className="eco-input py-3 text-sm"
                >
                  {DEMO_DELHI_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Destination Station</label>
                <select
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  id="ticket-to-select"
                  className="eco-input py-3 text-sm"
                >
                  {DEMO_DELHI_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Number of Passengers</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setPassengerCount(count)}
                    id={`ticket-passengers-${count}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      passengerCount === count
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-white/5 border-white/8 text-slate-400"
                    }`}
                  >
                    {count} Passenger{count > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Calculated Fare:</span>
              <span className="text-emerald-400 font-mono text-base font-black">₹{60 * passengerCount}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="ticket-submit-btn"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-sm hover:opacity-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? "Generating Ticket..." : `Generate Digital Ticket (₹${60 * passengerCount})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
