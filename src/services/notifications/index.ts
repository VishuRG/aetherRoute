// Notification Service — Manages in-app & web push notifications

import { DEMO_NOTIFICATIONS, DEMO_ALERTS } from "@/lib/demo-data";

export interface AppNotification {
  id: string;
  type: "traffic" | "transit" | "weather" | "eco" | "expense" | "booking" | "emergency";
  title: string;
  message: string;
  isRead: boolean;
  isCritical: boolean;
  time: string;
  actionUrl?: string;
}

export async function fetchUserNotifications(): Promise<AppNotification[]> {
  return DEMO_NOTIFICATIONS as AppNotification[];
}

export async function fetchSystemAlerts() {
  return DEMO_ALERTS;
}

export function sendLocalWebPush(title: string, body: string, icon = "/icons/icon-192x192.png") {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon });
    }
  }
}
