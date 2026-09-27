"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import {
  Navigation, Volume2, VolumeX, ShieldAlert, Share2, Compass,
  MapPin, CheckCircle2, Clock, AlertTriangle, ArrowLeft
} from "lucide-react";
import { EcoMap } from "@/components/EcoMap";
import { DemoBadge } from "@/components/DemoBadge";

function NavigationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const origin = searchParams.get("origin") || "Connaught Place";
  const destination = searchParams.get("destination") || "DLF Cyber City";

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(24);
  const [etaMinutes, setEtaMinutes] = useState(38);
  const [shareLink, setShareLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  const steps = [
    { step: 1, text: "Walk 400m to Rajiv Chowk Metro Station Gate 2", mode: "Walk", dist: "0.4 km" },
    { step: 2, text: "Board Yellow Line Metro towards Samaypur Badli (Platform 2)", mode: "Metro", dist: "8.1 km" },
    { step: 3, text: "Interchange at Hauz Khas to Magenta Line towards Janakpuri West", mode: "Metro", dist: "7.5 km" },
    { step: 4, text: "De-board at Sikanderpur Metro Station and walk 200m to Cyber City", mode: "Walk", dist: "0.2 km" },
    { step: 5, text: "Arrived at destination: DLF Cyber City, Gurugram! 🌱", mode: "Arrived", dist: "0 km" },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setEtaMinutes((prev) => Math.max(0, prev - 8));
    }
  };

  const handleGenerateShareLink = async () => {
    try {
      const res = await fetch("/api/live-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationName: destination }),
      });
      const data = await res.json();
      setShareLink(data.shareUrl);
      setShowShareModal(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          id="nav-back-btn"
          className="px-3.5 py-2 rounded-xl glass-card border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Routes
        </button>
        <DemoBadge message="Live Navigation Simulation" />
      </div>

      {/* Main Navigation Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Prompt & Info Panel */}
        <div className="space-y-4">
          {/* Active Navigation Turn Banner */}
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5"><Navigation className="w-4 h-4 animate-pulse" /> Live Step {currentStep.step} / {steps.length}</span>
              <button
                onClick={() => setMuted(!muted)}
                id="nav-audio-toggle"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
              >
                {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            <div className="text-xl font-black text-white leading-snug">
              {currentStep.text}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/8 pt-3">
              <span>Distance: <strong className="text-white font-mono">{currentStep.dist}</strong></span>
              <span>Speed: <strong className="text-white font-mono">{speed} km/h</strong></span>
            </div>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === steps.length - 1}
              id="nav-next-step-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {currentStepIndex === steps.length - 1 ? "Journey Completed 🎉" : "Simulate Next Step Prompt"}
            </button>
          </div>

          {/* Navigation Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGenerateShareLink}
              id="nav-share-trip-btn"
              className="p-4 rounded-2xl glass-card border border-white/10 text-xs font-bold text-white hover:bg-white/5 flex flex-col items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-5 h-5 text-emerald-400" />
              <span>Share Live Trip</span>
            </button>

            <button
              onClick={() => router.push("/emergency")}
              id="nav-sos-btn"
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-300 hover:bg-red-500/20 flex flex-col items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>Emergency SOS</span>
            </button>
          </div>

          {/* Weather & Traffic Live Status */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/8 text-xs space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Transit Condition Notice
            </div>
            <p className="text-slate-300">
              Yellow line running smoothly. Rain probability 10%. Air Quality index in Hauz Khas is 135.
            </p>
          </div>
        </div>

        {/* Live Map Center */}
        <div className="lg:col-span-2 glass-card p-4 rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" /> Real-Time Location Tracker
            </div>
            <div className="text-xs text-emerald-400 font-mono font-bold">
              ETA: {etaMinutes} mins
            </div>
          </div>

          <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-white/10 relative">
            <EcoMap
              center={{ lat: 28.5800, lng: 77.1700 }}
              zoom={12}
              markers={[
                { id: "curr", position: { lat: 28.5800, lng: 77.1700 }, title: "Your Live Location (Delhi)" },
                { id: "dest", position: { lat: 28.4950, lng: 77.0889 }, title: destination },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 max-w-md w-full space-y-4">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" /> Share Live Trip Link
            </div>
            <p className="text-xs text-slate-300">
              Send this secure link to family or emergency contacts so they can track your live GPS position in real-time.
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-emerald-400 break-all">
              {shareLink || "http://localhost:3000/live-trip/live_demo_123"}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold glass-card text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink || "http://localhost:3000/live-trip/live_demo_123");
                  alert("Link copied to clipboard!");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-black hover:opacity-90"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NavigationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Navigation...</div>}>
      <NavigationContent />
    </Suspense>
  );
}
