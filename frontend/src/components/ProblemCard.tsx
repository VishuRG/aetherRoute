// Live Road Problem Card with Optimistic Counters, Like, Confirm, and Verified Badge

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ThumbsUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RoadProblem } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface ProblemCardProps {
  problem: RoadProblem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const likeProblem = useAppStore((s) => s.likeProblem);
  const confirmProblem = useAppStore((s) => s.confirmProblem);
  const reportClearedProblem = useAppStore((s) => s.reportClearedProblem);

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!problem.userConfirmed) {
      // Trigger festive celebration burst
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ["#FF7A1A", "#FFC93C", "#1E7F4F"],
      });
      confirmProblem(problem.id);
    }
  };

  const getSeverityBadge = () => {
    switch (problem.severity) {
      case "critical":
        return "bg-vibrant-orange text-white";
      case "moderate":
        return "bg-sun text-dark-bg font-bold";
      case "low":
        return "bg-cream-border dark:bg-dark-border text-muted-dark dark:text-cream/80";
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft flex flex-col justify-between space-y-3">
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-vibrant-orange/15 text-vibrant-orange">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide ${getSeverityBadge()}`}
            >
              {problem.severity} severity
            </span>
          </div>

          {problem.isVerified && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-forest/15 text-forest dark:text-forest-mint border border-forest/30">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified ({problem.confirmCount})</span>
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold font-sora text-dark-bg dark:text-cream leading-snug">
          {problem.title}
        </h4>

        <p className="text-xs text-muted-dark dark:text-cream/70 mt-1 leading-relaxed">
          {problem.description}
        </p>

        {problem.photoUrl && (
          <div className="mt-2.5 rounded-xl overflow-hidden h-28 border border-cream-border/60 dark:border-dark-border/60">
            <img
              src={problem.photoUrl}
              alt="Hazard report preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Time & Distance Details */}
      <div className="flex items-center justify-between text-[11px] font-mono text-muted-dark dark:text-cream/60">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Reported {problem.reportedTimeAgo}
        </span>
        <span>{problem.distanceKm} km away</span>
      </div>

      {/* Community Action Buttons (Like / Still There / Cleared) */}
      <div className="flex items-center justify-between pt-2 border-t border-cream-border/60 dark:border-dark-border/60 text-xs">
        {/* Like Button */}
        <button
          onClick={() => likeProblem(problem.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
            problem.userLiked
              ? "text-forest dark:text-forest-mint font-bold bg-forest/10"
              : "text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${problem.userLiked ? "fill-current" : ""}`} />
          <span className="font-mono">{problem.likes}</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Still There Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={problem.userConfirmed}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              problem.userConfirmed
                ? "bg-forest/20 text-forest dark:text-forest-mint"
                : "bg-sun text-dark-bg hover:bg-sun-hover shadow-sm active:scale-95"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{problem.userConfirmed ? "Confirmed" : "Still There?"}</span>
          </button>

          {/* Cleared Button */}
          <button
            onClick={() => reportClearedProblem(problem.id)}
            disabled={problem.userReportedCleared}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs text-muted-dark dark:text-cream/60 hover:bg-cream-border/50 dark:hover:bg-dark-border transition-colors"
            title="Report this hazard as cleared"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cleared</span>
          </button>
        </div>
      </div>
    </div>
  );
};
