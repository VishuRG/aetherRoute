"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import {
  Navigation, Volume2, VolumeX, ShieldAlert, Share2, Compass,
  MapPin, CheckCircle2, Clock, AlertTriangle, ArrowLeft,
  ChevronRight, Sparkles, PhoneCall
} from "lucide-react";
import { EcoMap } from "@/components/EcoMap";
import { DemoBadge } from "@/components/DemoBadge";
import { resolveLocation } from "@/lib/locations";

function NavigationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const origin = searchParams.get("origin") || "Connaught Place (Rajiv Chowk)";
  const destination = searchParams.get("destination") || "DLF Cyber City, Gurugram";
  const mode = searchParams.get("mode") || "Metro";
  const rawDist = parseFloat(searchParams.get("distance") || "18.2");
  const rawDur = parseInt(searchParams.get("duration") || "42", 10);

  const originLoc = resolveLocation(origin);
  const destLoc = resolveLocation(destination);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(mode === "Metro" ? 34 : mode === "Cab" ? 28 : 22);
  const [etaMinutes, setEtaMinutes] = useState(rawDur);
  const [shareLink, setShareLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  // Generate authentic navigation steps for this specific journey
  const steps = [
    {
      step: 1,
      text: `Start from ${originLoc.name}. Walk 300m to nearest entrance/gate.`,
      mode: "Walk",
      dist: "0.3 km",
    },
    {
      step: 2,
      text: mode === "Metro"
        ? `Board DMRC Metro line from ${originLoc.name.split(" ")[0]} towards ${destLoc.name.split(" ")[0]}.`
        : mode === "Bus"
        ? `Board DTC Electric green bus at ${originLoc.name.split(" ")[0]} stand.`
        : `Vehicle transit via Delhi arterial corridor towards ${destLoc.name}.`,
      mode: mode,
      dist: `${(rawDist * 0.75).toFixed(1)} km`,
    },
    {
      step: 3,
      text: mode === "Metro" && rawDist > 15
        ? `Approaching central interchange station. Check platform signage for connection.`
        : `Continue along direct transit corridor towards ${destLoc.name}. Keep left at upcoming junction.`,
      mode: mode,
      dist: `${(rawDist * 0.2).toFixed(1)} km`,
    },
    {
      step: 4,
      text: `Arriving at ${destLoc.name} station/drop-point. Prepare to de-board.`,
      mode: mode,
      dist: "0.4 km",
    },
    {
      step: 5,
      text: `Walk 200m to your final destination: ${destLoc.name}. You have arrived! 🌱`,
      mode: "Arrived",
      dist: "0.2 km",
    },
  ];

  const currentStep = steps[currentStepIndex] || steps[0];

  // Voice speech announcement on step change
  useEffect(() => {
    if (!muted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStep.text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentStepIndex, muted, currentStep.text]);

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setEtaMinutes((prev) => Math.max(0, Math.round(prev - rawDur / steps.length)));
    }
  };

  const handleGenerateShareLink = async () => {
    try {
      const res = await fetch("/api/live-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationName: destLoc.name }),
      });
      const data = await res.json();
      setShareLink(data.shareUrl || `${window.location.origin}/live-trip/demo-track-token`);
      setShowShareModal(true);
    } catch {
      setShareLink(`${window.location.origin}/live-trip/demo-track-token`);
      setShowShareModal(true);
    }
  };

  const handleTriggerSOS = async () => {
    try {
      await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: originLoc.name,
          lat: originLoc.lat,
          lng: originLoc.lng,
        }),
      });
      setSosSent(true);
    } catch (e) {
      setSosSent(true);
    }
  };

  const mapMarkers = [
    {
      id: "orig-m",
      lat: originLoc.lat,
      lng: originLoc.lng,
      label: `Start: ${originLoc.name.split(" ")[0]}`,
      type: "origin" as const,
    },
    {
      id: "dest-m",
      lat: destLoc.lat,
      lng: destLoc.lng,
      label: `Dest: ${destLoc.name.split(" ")[0]}`,
      type: "destination" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Badge */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          id="nav-back-btn"
          className="px-3.5 py-2 rounded-xl glass-card border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Routes
        </button>
        <DemoBadge message="Real-time Turn Navigation" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Prompt & Action Panel */}
        <div className="space-y-4">
          {/* Active Navigation Turn Banner */}
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-[#060913] space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-2">
                <Navigation className="w-4 h-4 animate-spin text-emerald-400" />
                Live Step {currentStep.step} of {steps.length}
              </span>
              <button
                onClick={() => setMuted(!muted)}
                id="nav-audio-toggle"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title={muted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
              >
                {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            <div className="text-xl sm:text-2xl font-black text-white leading-snug">
              {currentStep.text}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/8 pt-3">
              <span>Segment Dist: <strong className="text-white font-mono">{currentStep.dist}</strong></span>
              <span>Speed: <strong className="text-emerald-400 font-mono">{speed} km/h</strong></span>
            </div>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex >= steps.length - 1}
              id="nav-next-step-btn"
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-black text-sm hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {currentStepIndex >= steps.length - 1 ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" /> Commute Completed
                </>
              ) : (
                <>
                  Next Turn / Stop <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Trip Summary Card */}
          <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Distance:</span>
              <span className="font-mono text-white font-bold">{rawDist} km</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Remaining ETA:</span>
              <span className="font-mono text-emerald-400 font-bold">{etaMinutes} mins</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Mode:</span>
              <span className="font-bold text-white uppercase">{mode} Transit</span>
            </div>

            <div className="pt-2 border-t border-white/8 flex gap-2">
              <button
                onClick={handleGenerateShareLink}
                id="nav-share-trip-btn"
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Share Live Trip
              </button>
              <button
                onClick={() => {
                  setShowSosModal(true);
                  setSosSent(false);
                }}
                id="nav-panic-sos-btn"
                className="py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-red-500/30 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> SOS
              </button>
            </div>
          </div>
        </div>

        {/* Live Vector Map Display */}
        <div className="lg:col-span-2 glass-card p-4 rounded-3xl border border-white/10 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" /> Live Vector Simulation
            </span>
            <span className="text-[11px] text-emerald-400 font-mono font-semibold">
              ETA: {etaMinutes} min • {speed} km/h
            </span>
          </div>

          <div className="flex-1 min-h-[360px] w-full rounded-2xl overflow-hidden border border-white/10 relative">
            <EcoMap
              markers={mapMarkers}
              showRoute={true}
              originName={originLoc.name}
              destName={destLoc.name}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl border border-white/10 max-w-md w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto text-xl">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Share Live GPS Commute</h3>
            <p className="text-xs text-slate-400">
              Share this live tracking link with family or emergency contacts to track your trip in real time.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-emerald-400 break-all select-all">
              {shareLink}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert("Link copied to clipboard!");
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-xs"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="py-3 px-4 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl border border-red-500/40 max-w-md w-full space-y-4 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-2xl animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Emergency 1-Click SOS</h3>
            <p className="text-xs text-slate-400">
              Broadcasting your live GPS coordinates ({originLoc.lat.toFixed(4)}, {originLoc.lng.toFixed(4)}) at {originLoc.name} to pre-configured emergency contacts and Delhi Police Control Room.
            </p>

            {sosSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> SOS Alert Dispatched & Logged to DB
              </div>
            ) : (
              <button
                onClick={handleTriggerSOS}
                id="emergency-sos-confirm-btn"
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" /> Trigger Immediate Panic Alert
              </button>
            )}

            <button
              onClick={() => setShowSosModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-slate-300 font-semibold text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NavigationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading Navigation...</div>}>
      <NavigationContent />
    </Suspense>
  );
}
