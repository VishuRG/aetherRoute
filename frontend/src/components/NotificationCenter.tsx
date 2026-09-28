// Slide-in Notification Center with filter chips, mark read, snooze, and action handlers

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Clock,
  Zap,
  Fuel,
  MapPin,
  AlertTriangle,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAppStore } from "@/store/useAppStore";
import { AlertCategory } from "@/types";

const CATEGORIES: Array<{ id: AlertCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "route", label: "Route" },
  { id: "ev", label: "EV" },
  { id: "fuel", label: "Fuel" },
  { id: "community", label: "Community" },
];

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    dismissNotification,
    snoozeNotification,
  } = useNotifications();

  const setActiveDrawer = useAppStore((s) => s.setActiveDrawer);
  const [selectedCat, setSelectedCat] = useState<AlertCategory | "all">("all");

  const filtered = notifications.filter(
    (n) => selectedCat === "all" || n.category === selectedCat
  );

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-4 border-vibrant-orange bg-vibrant-orange/5";
      case "warning":
        return "border-l-4 border-sun bg-sun/5";
      case "success":
        return "border-l-4 border-forest bg-forest/5";
      default:
        return "border-l-4 border-cream-border dark:border-dark-border";
    }
  };

  const getCategoryIcon = (cat: AlertCategory) => {
    switch (cat) {
      case "ev":
        return <Zap className="w-3.5 h-3.5 text-forest" />;
      case "fuel":
        return <Fuel className="w-3.5 h-3.5 text-vibrant-orange" />;
      case "route":
        return <MapPin className="w-3.5 h-3.5 text-sun-dark" />;
      case "community":
        return <AlertTriangle className="w-3.5 h-3.5 text-vibrant-orange" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-muted-dark" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-colors ${
              selectedCat === cat.id
                ? "bg-forest text-white shadow-soft font-bold"
                : "bg-cream-warm/70 dark:bg-dark-bg/60 text-muted-dark dark:text-cream/70 hover:bg-forest/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-dark dark:text-cream/60">
              <CheckCheck className="w-10 h-10 mx-auto mb-2 text-forest/40" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs mt-1">No active notifications in this category.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-3.5 rounded-2xl border border-cream-border dark:border-dark-border ${getPriorityStyle(
                  item.priority
                )} flex flex-col justify-between space-y-2`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-cream-warm dark:bg-dark-bg">
                      {getCategoryIcon(item.category)}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold font-sora text-dark-bg dark:text-cream">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-muted-dark dark:text-cream/60">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => dismissNotification(item.id)}
                    className="text-muted-dark dark:text-cream/40 hover:text-dark-bg dark:hover:text-cream p-1"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-muted-dark dark:text-cream/80 leading-relaxed">
                  {item.message}
                </p>

                {/* Actions & Snooze Row */}
                <div className="flex items-center justify-between pt-1 border-t border-cream-border/40 dark:border-dark-border/40 text-xs">
                  {item.action ? (
                    <button
                      onClick={() => {
                        markNotificationRead(item.id);
                        setActiveDrawer("none");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-forest text-white text-[11px] font-bold shadow-soft hover:bg-forest-deep transition-colors"
                    >
                      {item.action.label}
                    </button>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => snoozeNotification(item.id, 15)}
                      className="flex items-center gap-1 text-[11px] text-muted-dark dark:text-cream/60 hover:text-dark-bg font-mono"
                      title="Snooze for 15 minutes"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Snooze 15m</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Preferences shortcut */}
      <div className="pt-3 border-t border-cream-border dark:border-dark-border flex justify-end">
        <button
          onClick={() => setActiveDrawer("alertPreferences")}
          className="flex items-center gap-1.5 text-xs text-forest dark:text-forest-mint font-semibold hover:underline"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Notification Preferences</span>
        </button>
      </div>
    </div>
  );
};
