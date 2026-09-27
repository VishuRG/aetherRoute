import { NextResponse } from "next/server";
import { fetchUserNotifications, fetchSystemAlerts } from "@/services/notifications";

export async function GET() {
  try {
    const notifications = await fetchUserNotifications();
    const alerts = await fetchSystemAlerts();
    return NextResponse.json({ notifications, alerts });
  } catch (error) {
    console.error("Notification API error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
