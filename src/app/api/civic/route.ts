import { NextResponse } from "next/server";
import { generateCivicComplaint } from "@/services/government";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { resolveLocation } from "@/lib/locations";

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    const complaints = await prisma.civicComplaint.findMany({
      where: session?.userId ? { userId: session.userId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ complaints });
  } catch (error) {
    console.error("Civic complaints GET error:", error);
    return NextResponse.json({ error: "Failed to fetch civic complaints" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    const { category, title, description, address, reporterName, lat, lng } = await req.json();

    const loc = resolveLocation(address || "Connaught Place, New Delhi", lat, lng);

    const draft = generateCivicComplaint(
      category || "Pothole",
      title || "Road Maintenance Required",
      description || "Issue causing traffic congestion and hazard.",
      loc.name,
      reporterName || session?.name || "EcoRoute Commuter"
    );

    let saved = null;
    let targetUserId = session?.userId;
    if (!targetUserId) {
      const demoUser = await prisma.user.findFirst();
      targetUserId = demoUser?.id;
    }

    if (targetUserId) {
      saved = await prisma.civicComplaint.create({
        data: {
          userId: targetUserId,
          category: draft.department,
          title: title || "Civic Grievance",
          description: description || "Reported infrastructure issue",
          address: loc.name,
          lat: loc.lat,
          lng: loc.lng,
          department: draft.department,
          draftText: draft.formattedBody,
          referenceNo: draft.referenceNo,
          portalUrl: draft.portalUrl,
          status: "draft",
        },
      });
    }

    return NextResponse.json({
      ...draft,
      dbId: saved?.id,
      savedToDatabase: !!saved,
    });
  } catch (error) {
    console.error("Civic draft API error:", error);
    return NextResponse.json({ error: "Failed to generate civic complaint" }, { status: 500 });
  }
}
