"use client";

import { useState, useEffect } from "react";
import { Ticket, QrCode, CheckCircle2, ShieldCheck, Sparkles, Plus, Clock, MapPin, Zap } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { DELHI_NCR_LOCATIONS, calculateDMRCFare, calculateDTCFare, resolveLocation } from "@/lib/locations";
import { haversineDistance } from "@/lib/utils";

export default function TicketsPage() {
  const [activeTicket, setActiveTicket] = useState<any>({
    ticketNumber: "DMRC-849201",
    ticketType: "Metro",
    operator: "DMRC",
    fromStation: "Connaught Place (Rajiv Chowk)",
    toStation: "DLF Cyber City, Gurugram",
    passengerCount: 1,
    fare: 60,
    validUntil: new Date(Date.now() + 8 * 3600 * 1000).toLocaleString("en-IN"),
    status: "active",
    qrCodeData: "DMRC-TKT-LIVE-849201",
  });

  const [ticketList, setTicketList] = useState<any[]>([]);
  const [fromStation, setFromStation] = useState("Connaught Place (Rajiv Chowk)");
  const [toStation, setToStation] = useState("DLF Cyber City, Gurugram");
  const [ticketType, setTicketType] = useState<"Metro" | "Bus">("Metro");
  const [passengerCount, setPassengerCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Calculate live fare based on chosen stations
  const fromLoc = resolveLocation(fromStation);
  const toLoc = resolveLocation(toStation);
  const dist = Math.max(2, haversineDistance(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng) * 1.15);
  const unitFare = ticketType === "Bus" ? calculateDTCFare(dist, true) : calculateDMRCFare(dist);
  const totalFare = unitFare * passengerCount;

  // Load user tickets from SQLite database
  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.tickets?.length > 0) {
          setTicketList(data.tickets);
          setActiveTicket(data.tickets[0]);
        }
      })
      .catch((err) => console.warn(err));
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus("");

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketType,
          fromStation,
          toStation,
          fare: totalFare,
          passengerCount,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActiveTicket(data);
        setTicketList((prev) => [data, ...prev]);
        setSaveStatus("Ticket booked and saved to SQLite Database!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    activeTicket?.qrCode || activeTicket?.qrCodeData || activeTicket?.ticketNumber || "DMRC-TKT-LIVE"
  )}`;

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
        <DemoBadge message="AFCS Digital QR Wallet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Ticket Active Card View */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 to-[#060913] space-y-6 text-center shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {activeTicket.operator || (activeTicket.ticketType === "Bus" ? "DTC Electric" : "DMRC")} • {activeTicket.ticketType}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-3xl w-48 h-48 mx-auto shadow-2xl flex items-center justify-center border-4 border-emerald-400/20">
              <img
                src={qrImageUrl}
                alt="Digital QR Transit Ticket"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-left text-xs border-t border-white/8 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Ticket Ref:</span>
                <span className="font-mono text-emerald-400 font-bold">{activeTicket.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">From Station:</span>
                <span className="font-semibold text-white truncate max-w-[180px]">{activeTicket.fromStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To Station:</span>
                <span className="font-semibold text-white truncate max-w-[180px]">{activeTicket.toStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passengers:</span>
                <span className="font-semibold text-white">{activeTicket.passengerCount} Adult</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Fare:</span>
                <span className="font-black text-emerald-400 font-mono text-sm">₹{activeTicket.fare}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Scan at automated entry AFCS turnstile
            </div>
          </div>
        </div>

        {/* Generate / Book New Ticket Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="w-4.5 h-4.5 text-emerald-400" /> Book Digital Transit Ticket
              </h2>
              <span className="text-xs text-slate-400">Instant QR Generation</span>
            </div>

            {saveStatus && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{saveStatus}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-5">
              {/* Ticket Type Radio Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Transport Operator
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTicketType("Metro")}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      ticketType === "Metro"
                        ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                    }`}
                  >
                    <span className="text-2xl">🚇</span>
                    <div>
                      <div className="font-bold text-sm">Delhi Metro (DMRC)</div>
                      <div className="text-[11px] text-slate-400">Yellow, Blue, Magenta lines</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTicketType("Bus")}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      ticketType === "Bus"
                        ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10"
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                    }`}
                  >
                    <span className="text-2xl">🚌</span>
                    <div>
                      <div className="font-bold text-sm">DTC Electric Bus</div>
                      <div className="text-[11px] text-slate-400">AC green city fleet</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Station Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Origin Station
                  </label>
                  <select
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="eco-input py-3 text-xs sm:text-sm font-medium appearance-none cursor-pointer"
                  >
                    {DELHI_NCR_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                        📍 {loc.name} ({loc.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Destination Station
                  </label>
                  <select
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="eco-input py-3 text-xs sm:text-sm font-medium appearance-none cursor-pointer"
                  >
                    {DELHI_NCR_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                        🎯 {loc.name} ({loc.zone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Count & Fare preview */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Number of Passengers</label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPassengerCount(num)}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                          passengerCount === num
                            ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-white/8 pt-3 sm:pt-0">
                  <div className="text-xs text-slate-400">Total Calculated Fare</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">₹{totalFare}</div>
                  <div className="text-[10px] text-slate-400 font-mono">~{dist.toFixed(1)} km DMRC Fare</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="tickets-generate-btn"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-black text-base hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Generating Ticket & Saving to Database...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" /> Generate Instant QR Ticket (₹{totalFare})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Ticket History from Database */}
          {ticketList.length > 0 && (
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                My Booked Tickets (SQL Database)
              </h3>
              <div className="space-y-2.5">
                {ticketList.slice(0, 5).map((t, idx) => (
                  <div
                    key={t.id || idx}
                    onClick={() => setActiveTicket(t)}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {t.ticketType === "Bus" ? "🚌" : "🚇"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {t.fromStation.split(" ")[0]} → {t.toStation.split(" ")[0]}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{t.ticketNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400 font-mono">₹{t.fare}</div>
                      <div className="text-[10px] text-emerald-300 font-semibold">Active</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
