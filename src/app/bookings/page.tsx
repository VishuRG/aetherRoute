"use client";

import { useEffect, useState } from "react";
import { Zap, Car, ShieldCheck, Phone, CheckCircle2, Clock, MapPin, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";
import { fetchCabOptions, requestCabBooking, CabOption } from "@/services/cab";
import { DELHI_NCR_LOCATIONS, resolveLocation } from "@/lib/locations";
import { haversineDistance } from "@/lib/utils";

export default function BookingsPage() {
  const [origin, setOrigin] = useState("Connaught Place (Rajiv Chowk)");
  const [destination, setDestination] = useState("DLF Cyber City, Gurugram");
  const [cabOptions, setCabOptions] = useState<CabOption[]>([]);
  const [bookingActive, setBookingActive] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const originLoc = resolveLocation(origin);
  const destLoc = resolveLocation(destination);
  const distanceKm = parseFloat(
    (Math.max(2, haversineDistance(originLoc.lat, originLoc.lng, destLoc.lat, destLoc.lng)) * 1.25).toFixed(1)
  );

  useEffect(() => {
    fetchCabOptions(originLoc.lat, originLoc.lng, destLoc.lat, destLoc.lng, distanceKm).then((opts) =>
      setCabOptions(opts)
    );
  }, [originLoc.name, destLoc.name, distanceKm]);

  const handleBookCab = async (option: CabOption) => {
    setLoading(true);
    try {
      const details = await requestCabBooking(
        option.provider,
        option.vehicleType,
        originLoc.name,
        destLoc.name,
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
            On-Demand EV Cab & Auto Booking <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Book BluSmart Electric, Uber Green, CNG Auto or Rapido Bike across Delhi-NCR
          </p>
        </div>
        <ServiceStatusBadge status="LIVE" label="Live Cab Dispatch Engine" />
      </div>

      {/* Origin & Destination Selector */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" /> Commute Pickup & Drop Locations
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Pickup Point</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="eco-input py-2.5 text-xs font-medium"
            >
              {DELHI_NCR_LOCATIONS.map((l) => (
                <option key={l.id} value={l.name} className="bg-slate-900 text-white">
                  📍 {l.name} ({l.zone})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Drop Location</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="eco-input py-2.5 text-xs font-medium"
            >
              {DELHI_NCR_LOCATIONS.map((l) => (
                <option key={l.id} value={l.name} className="bg-slate-900 text-white">
                  🎯 {l.name} ({l.zone})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs text-emerald-400 font-mono font-semibold pt-1">
          Estimated Route Distance: ~{distanceKm} km
        </div>
      </div>

      {/* Active Booking Card if any */}
      {bookingActive && (
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
              <CheckCircle2 className="w-4 h-4" /> Driver Assigned & On The Way!
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-black font-black text-xs font-mono">
              OTP: {bookingActive.otp}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-y border-white/8 py-3">
            <div>
              <div className="text-slate-400">Driver</div>
              <div className="font-bold text-white text-sm">{bookingActive.driverName}</div>
            </div>
            <div>
              <div className="text-slate-400">Vehicle</div>
              <div className="font-bold text-white text-sm font-mono">{bookingActive.vehicleNumber}</div>
            </div>
            <div>
              <div className="text-slate-400">Estimated Arrival</div>
              <div className="font-bold text-emerald-400 text-sm">{bookingActive.etaMinutes} mins</div>
            </div>
            <div>
              <div className="text-slate-400">Total Fare</div>
              <div className="font-bold text-white text-sm font-mono">₹{bookingActive.estimatedFare}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-300">
              Direct booking confirmed from <strong>{originLoc.name.split(" ")[0]}</strong> to <strong>{destLoc.name.split(" ")[0]}</strong>.
            </span>
            <button
              onClick={() => setBookingActive(null)}
              className="text-slate-400 hover:text-white underline font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Available Rides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cabOptions.map((opt) => (
          <div
            key={opt.id}
            className={`glass-card p-6 rounded-3xl border transition-all space-y-4 ${
              opt.isEV ? "border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5" : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                  {opt.icon}
                </div>
                <div>
                  <div className="font-bold text-white text-base flex items-center gap-2">
                    {opt.displayName}
                    {opt.isEV && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        ZERO EMISSION
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{opt.provider}</span>
                    <span>•</span>
                    <span>⭐ {opt.driverRating}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{opt.etaMinutes} min away</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-white font-mono">₹{opt.estimatedFare}</div>
                <div className="text-[10px] text-slate-400">Guaranteed Fare</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/8">
              <div className="text-[11px] text-slate-400">
                {opt.isEV ? `Saves ${opt.co2SavedVsPetrolKg} kg CO₂ vs Petrol` : "Direct arterial route"}
              </div>

              <button
                onClick={() => handleBookCab(opt)}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-xs hover:opacity-95 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                Book Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
