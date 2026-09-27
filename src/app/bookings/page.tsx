"use client";

import { useEffect, useState } from "react";
import { Zap, Car, ShieldCheck, Phone, CheckCircle2, Clock, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";
import { fetchCabOptions, requestCabBooking, CabOption } from "@/services/cab";

export default function BookingsPage() {
  const [cabOptions, setCabOptions] = useState<CabOption[]>([]);
  const [bookingActive, setBookingActive] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCabOptions(28.6328, 77.2197, 28.4950, 77.0889, 18.2).then((opts) => setCabOptions(opts));
  }, []);

  const handleBookCab = async (option: CabOption) => {
    setLoading(true);
    try {
      const details = await requestCabBooking(
        option.provider,
        option.vehicleType,
        "Connaught Place",
        "DLF Cyber City",
        option.estimatedFare
      );
      setBookingActive({ ...details, option });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Instant Cab & Auto Booking <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Book BluSmart Electric, Uber, Ola Auto or Rapido Bike with zero surge transparency
          </p>
        </div>
        <ServiceStatusBadge status={cabOptions[0]?.dataStatus || "EXTERNAL"} label="Cab Ride Provider Adapter" />
      </div>

      {/* Active Booking Card if any */}
      {bookingActive && (
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
              <CheckCircle2 className="w-4 h-4" /> Driver Assigned & On The Way!
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-black font-black text-xs font-mono">
              OTP: {bookingActive.otp}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <div className="text-xs text-slate-400">Driver Name</div>
              <div className="text-base font-bold text-white">{bookingActive.driverName}</div>
              <div className="text-xs text-emerald-400 font-mono">{bookingActive.driverPhone}</div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Vehicle Number</div>
              <div className="text-base font-black text-white font-mono">{bookingActive.vehicleNumber}</div>
              <div className="text-xs text-slate-400">{bookingActive.provider} ({bookingActive.vehicleType})</div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Estimated Fare</div>
              <div className="text-xl font-black text-emerald-400 font-mono">₹{bookingActive.estimatedFare}</div>
              <div className="text-xs text-slate-300">ETA: {bookingActive.etaMinutes} mins</div>
            </div>
          </div>
        </div>
      )}

      {/* Cab Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cabOptions.map((opt) => (
          <div
            key={opt.id}
            className={`glass-card p-6 rounded-3xl border transition-all ${
              opt.isEV ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                  {opt.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{opt.displayName}</h3>
                    <ServiceStatusBadge status={opt.dataStatus} />
                  </div>
                  <div className="text-xs text-slate-400">{opt.provider} • Rating ⭐ {opt.driverRating}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-white font-mono">₹{opt.estimatedFare}</div>
                <div className="text-[11px] text-emerald-400 font-medium">ETA {opt.etaMinutes} mins</div>
              </div>
            </div>

            {opt.isEV && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                <span>⚡ 100% Zero Direct Carbon Emissions</span>
                <span className="font-bold font-mono">-{opt.co2SavedVsPetrolKg} kg CO₂</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBookCab(opt)}
                disabled={loading}
                id={`booking-ride-${opt.id}`}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? "Confirming..." : `Book ${opt.provider} Ride (₹${opt.estimatedFare})`}
              </button>

              <a
                href={opt.deepLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Official Provider App Deep Link"
                className="px-3.5 py-3 rounded-xl glass-card border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 shrink-0"
              >
                App <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
