import { NextResponse } from "next/server";
import { triggerSOS } from "@/services/emergency";
import { resolveLocation } from "@/lib/locations";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    const { lat, lng, address, contacts } = await req.json();

    const loc = resolveLocation(address || "Connaught Place, New Delhi", lat, lng);

    let emergencyContacts = contacts;
    if (!emergencyContacts || emergencyContacts.length === 0) {
      if (session?.userId) {
        emergencyContacts = await prisma.emergencyContact.findMany({
          where: { userId: session.userId },
        });
      }
    }

    const sosPayload = await triggerSOS(
      loc.lat,
      loc.lng,
      loc.name,
      emergencyContacts || []
    );

    // Save notification in database
    if (session?.userId) {
      await prisma.notification.create({
        data: {
          userId: session.userId,
          type: "emergency",
          title: "🚨 SOS Alert Broadcasted",
          message: `Emergency SOS triggered at ${loc.name}. Live coordinates (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}) sent to emergency contacts.`,
          isRead: false,
          isCritical: true,
        },
      });
    }

    return NextResponse.json(sosPayload);
  } catch (error) {
    console.error("Emergency SOS API error:", error);
    return NextResponse.json({ error: "Failed to trigger emergency SOS" }, { status: 500 });
  }
}
