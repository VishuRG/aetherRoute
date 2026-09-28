// Toast Notification Stack Component with auto-dismiss progress bar and action buttons

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Info, Zap } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAppStore } from "@/store/useAppStore";
import { AlertPriority } from "@/types";

export const ToastStack: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();
  const setActiveDrawer = useAppStore((s) => s.setActiveDrawer);

  return (
    <div
      aria-live="polite"
      className="fixed z-[9999] pointer-events-none top-20 right-4 sm:right-6 flex flex-col gap-2.5 max-w-sm w-full"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
            onAction={() => {
              dismissToast(toast.id);
              if (toast.action?.actionType === "add_stop") {
                setActiveDrawer("routeDetails");
              }
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{
  toast: any;
  onDismiss: () => void;
  onAction: () => void;
}> = ({ toast, onDismiss, onAction }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isPaused) return;

    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) {
          clearInterval(timer);
          setTimeout(onDismiss, 0);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, onDismiss]);

  const getPriorityStyle = (priority: AlertPriority) => {
    switch (priority) {
      case "urgent":
        return {
          border: "border-vibrant-orange shadow-glowOrange animate-pulseSlow",
          bg: "bg-cream-card dark:bg-dark-card",
          bar: "bg-vibrant-orange",
          icon: <AlertTriangle className="w-4 h-4 text-vibrant-orange" />,
        };
      case "warning":
        return {
          border: "border-sun shadow-glowYellow",
          bg: "bg-cream-card dark:bg-dark-card",
          bar: "bg-sun",
          icon: <AlertTriangle className="w-4 h-4 text-sun-dark" />,
        };
      case "success":
        return {
          border: "border-forest shadow-glowGreen",
          bg: "bg-cream-card dark:bg-dark-card",
          bar: "bg-forest",
          icon: <CheckCircle2 className="w-4 h-4 text-forest" />,
        };
      default:
        return {
          border: "border-cream-border dark:border-dark-border",
          bg: "bg-cream-card dark:bg-dark-card",
          bar: "bg-sun",
          icon: <Info className="w-4 h-4 text-muted-dark" />,
        };
    }
  };

  const style = getPriorityStyle(toast.priority);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-4 shadow-layered flex flex-col space-y-2`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {style.icon}
          <h5 className="text-xs font-bold font-sora text-dark-bg dark:text-cream">
            {toast.title}
          </h5>
        </div>
        <button
          onClick={onDismiss}
          className="text-muted-dark dark:text-cream/50 hover:text-dark-bg dark:hover:text-cream p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message */}
      <p className="text-xs text-muted-dark dark:text-cream/80 leading-relaxed">
        {toast.message}
      </p>

      {/* Action Button */}
      {toast.action && (
        <div className="pt-1 flex justify-end">
          <button
            onClick={onAction}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-forest text-white hover:bg-forest-deep shadow-sm transition-transform active:scale-95"
          >
            {toast.action.label}
          </button>
        </div>
      )}

      {/* Auto-Dismiss Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cream-border dark:bg-dark-border">
        <div
          className={`h-full ${style.bar} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
