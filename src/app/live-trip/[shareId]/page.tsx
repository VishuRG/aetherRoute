"use client";

import { useParams } from "next/navigation";
import { Compass, MapPin, ShieldCheck, Clock, Navigation } from "lucide-react";
import { EcoMap } from "@/components/EcoMap";
import { DemoBadge } from "@/components/DemoBadge";

export default function PublicLiveTripPage() {
  const params = useParams();
  const shareId = params.shareId as string;

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 p-6 space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Trip Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Rahul's Live Trip to Cyber City</h1>
        </div>
        <DemoBadge message="Public Emergency Link" />
      </div>

      <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Destination</div>
            <div className="font-bold text-white text-sm">DLF Cyber City, Gurugram</div>
          </div>
          <div>
            <div className="text-slate-400">Status</div>
            <div className="font-bold text-emerald-400 text-sm">In Transit (Delhi Metro)</div>
          </div>
          <div>
            <div className="text-slate-400">Estimated Arrival (ETA)</div>
            <div className="font-bold text-white text-sm font-mono">38 mins</div>
          </div>
        </div>

        <div className="h-[380px] w-full rounded-2xl overflow-hidden border border-white/10 relative">
          <EcoMap
            center={{ lat: 28.5800, lng: 77.1700 }}
            zoom={12}
            markers={[
              { id: "curr", position: { lat: 28.5800, lng: 77.1700 }, title: "Rahul's Live GPS Position" },
              { id: "dest", position: { lat: 28.4950, lng: 77.0889 }, title: "DLF Cyber City" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
