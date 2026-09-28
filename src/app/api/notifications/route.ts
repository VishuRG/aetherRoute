import { NextResponse } from "next/server";
import { fetchSystemAlerts } from "@/services/notifications";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    let notifications: any[] = [];

    if (session?.userId) {
      const dbNotifs = await prisma.notification.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      });

      if (dbNotifs.length > 0) {
        notifications = dbNotifs.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          isRead: n.isRead,
          isCritical: n.isCritical,
          time: new Date(n.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          actionUrl: n.actionUrl,
        }));
      }
    }

    if (notifications.length === 0) {
      notifications = DEMO_NOTIFICATIONS;
    }

    const alerts = await fetchSystemAlerts();
    return NextResponse.json({ notifications, alerts });
  } catch (error) {
    console.error("Notification API error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
