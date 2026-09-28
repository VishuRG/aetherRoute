// Smart Alert Engine Hook
// Evaluates rules on navigation and triggers realistic, throttled alerts with action handlers

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { SmartAlert } from "@/types";

export function useNotifications() {
  const notifications = useAppStore((s) => s.notifications);
  const toasts = useAppStore((s) => s.toasts);
  const addToast = useAppStore((s) => s.addToast);
  const dismissToast = useAppStore((s) => s.dismissToast);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const dismissNotification = useAppStore((s) => s.dismissNotification);
  const snoozeNotification = useAppStore((s) => s.snoozeNotification);
  const isNavigating = useAppStore((s) => s.isNavigating);
  const vehicleType = useAppStore((s) => s.vehicleType);
  const vehicleProfile = useAppStore((s) => s.vehicleProfile);

  const firedAlerts = useRef<Set<string>>(new Set());

  // Background smart alert engine
  useEffect(() => {
    const alertRules = [
      {
        id: "rule-battery-low",
        condition: () => vehicleType === "ev" && vehicleProfile.currentBatteryPercent <= 25,
        alert: {
          title: "Critical Range Alert",
          message: "Battery will drop to 12% before your destination. Add a fast-charger stop?",
          priority: "urgent" as const,
          action: { label: "Add Charger", actionType: "add_stop" },
        },
      },
      {
        id: "rule-traffic-accident",
        condition: () => isNavigating,
        alert: {
          title: "Accident 6 km Ahead",
          message: "Mahipalpur Flyover lanes blocked. Rerouting via Vasant Kunj saves 14 min.",
          priority: "warning" as const,
          action: { label: "Reroute (-14m)", actionType: "reroute" },
        },
      },
      {
        id: "rule-fuel-cheaper",
        condition: () => vehicleType !== "ev",
        alert: {
          title: "Cheaper Fuel Nearby",
          message: "IndianOil COCO pump 3 km ahead is ₹94.72/L (saves ₹1.40/L vs route avg).",
          priority: "info" as const,
          action: { label: "View Pump", actionType: "view" },
        },
      },
    ];

    // Trigger timer for realistic smart alert demonstration
    const timer = setTimeout(() => {
      alertRules.forEach((rule) => {
        if (!firedAlerts.current.has(rule.id) && rule.condition()) {
          firedAlerts.current.add(rule.id);
          addToast(rule.alert);
        }
      });
    }, 4500);

    return () => clearTimeout(timer);
  }, [isNavigating, vehicleType, vehicleProfile.currentBatteryPercent, addToast]);

  const unreadCount = notifications.filter(
    (n) => !n.read && (!n.snoozedUntil || n.snoozedUntil < Date.now())
  ).length;

  return {
    notifications: notifications.filter(
      (n) => !n.snoozedUntil || n.snoozedUntil < Date.now()
    ),
    unreadCount,
    toasts,
    addToast,
    dismissToast,
    markNotificationRead,
    dismissNotification,
    snoozeNotification,
  };
}
