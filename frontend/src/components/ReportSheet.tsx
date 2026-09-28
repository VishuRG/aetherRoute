// Live Hazard Report Form Component
// Icon grid of hazard types, severity selector, photo upload preview, and instant community submission

import React, { useState } from "react";
import {
  AlertTriangle,
  Flame,
  Truck,
  Cone,
  Droplets,
  Wrench,
  ZapOff,
  Fuel,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ProblemType, ProblemSeverity } from "@/types";

const PROBLEM_TYPES: Array<{ id: ProblemType; label: string; icon: any }> = [
  { id: "accident", label: "Accident", icon: Flame },
  { id: "traffic_jam", label: "Traffic Jam", icon: Truck },
  { id: "roadwork", label: "Roadwork", icon: Cone },
  { id: "waterlogging", label: "Waterlogging", icon: Droplets },
  { id: "pothole", label: "Pothole", icon: AlertTriangle },
  { id: "breakdown", label: "Breakdown", icon: Wrench },
  { id: "charger_down", label: "Charger Down", icon: ZapOff },
  { id: "pump_dry", label: "No Fuel", icon: Fuel },
];

export const ReportSheet: React.FC = () => {
  const addNewProblem = useAppStore((s) => s.addNewProblem);
  const setActiveDrawer = useAppStore((s) => s.setActiveDrawer);

  const [selectedType, setSelectedType] = useState<ProblemType>("traffic_jam");
  const [severity, setSeverity] = useState<ProblemSeverity>("moderate");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewProblem({
      type: selectedType,
      title: title || `${selectedType.replace("_", " ").toUpperCase()} Reported`,
      description: description || "Live hazard reported on active route corridor.",
      severity,
      photoUrl: photoPreview || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {/* 1. Category Icon Grid */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase text-muted-dark dark:text-cream/70 mb-2">
          Select Incident Type
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PROBLEM_TYPES.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedType(item.id)}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all text-center ${
                  isSelected
                    ? "bg-vibrant-orange text-white border-vibrant-orange shadow-glowOrange font-bold"
                    : "bg-cream-warm/40 dark:bg-dark-bg/60 border-cream-border dark:border-dark-border text-dark-bg dark:text-cream hover:bg-forest/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Severity Level Selection */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase text-muted-dark dark:text-cream/70 mb-2">
          Severity Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["low", "moderate", "critical"] as ProblemSeverity[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSeverity(lvl)}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold capitalize border transition-all ${
                severity === lvl
                  ? lvl === "critical"
                    ? "bg-vibrant-orange text-white border-vibrant-orange"
                    : lvl === "moderate"
                    ? "bg-sun text-dark-bg border-sun"
                    : "bg-forest text-white border-forest"
                  : "bg-cream-warm/40 dark:bg-dark-bg/60 border-cream-border dark:border-dark-border text-muted-dark dark:text-cream/70"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Title & Description Inputs */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-dark-bg dark:text-cream mb-1">
            Short Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mahipalpur Flyover lane blocked"
            className="w-full px-3.5 py-2.5 rounded-xl bg-cream-warm/40 dark:bg-dark-bg/60 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream focus:outline-none focus:border-forest text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-dark-bg dark:text-cream mb-1">
            Additional Details & Detour Advice
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain which lanes are blocked, vehicle types involved, or suggested alternative exits..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-cream-warm/40 dark:bg-dark-bg/60 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream focus:outline-none focus:border-forest text-xs"
          />
        </div>
      </div>

      {/* 4. Optional Photo Upload Preview */}
      <div>
        <label className="block text-xs font-bold text-dark-bg dark:text-cream mb-1">
          Attach Photo (Optional)
        </label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cream-warm/70 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border cursor-pointer hover:bg-forest/10 text-xs text-muted-dark dark:text-cream/70">
            <Upload className="w-4 h-4 text-forest" />
            <span>Choose File</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setPhotoPreview(url);
                }
              }}
            />
          </label>
          {photoPreview && (
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-cream-border">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-cream-border dark:border-dark-border flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setActiveDrawer("none")}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-dark dark:text-cream/70 hover:bg-cream-border/50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-vibrant-orange text-white hover:bg-vibrant-orangeHover shadow-glowOrange transition-transform active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Broadcast Report</span>
        </button>
      </div>
    </form>
  );
};
