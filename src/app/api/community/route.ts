import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DEMO_COMMUNITY_REPORTS } from "@/lib/demo-data";
import { resolveLocation } from "@/lib/locations";

export async function GET() {
  try {
    const dbReports = await prisma.communityReport.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
      take: 50,
    });

    if (dbReports.length > 0) {
      const formatted = dbReports.map((r) => ({
        id: r.id,
        category: r.category,
        title: r.title,
        description: r.description,
        address: r.address,
        lat: r.lat,
        lng: r.lng,
        photoUrl: r.photoUrl,
        severity: r.severity,
        status: r.status,
        upvotes: r.upvotes,
        isVerified: r.isVerified,
        timeAgo: new Date(r.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        userName: r.user?.name || "Community Commuter",
      }));
      return NextResponse.json({ reports: formatted });
    }

    return NextResponse.json({ reports: DEMO_COMMUNITY_REPORTS });
  } catch (error) {
    console.error("Community report GET error:", error);
    return NextResponse.json({ reports: DEMO_COMMUNITY_REPORTS });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    const body = await req.json();

    let targetUserId = session?.userId;
    if (!targetUserId) {
      const demoUser = await prisma.user.findFirst();
      targetUserId = demoUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "User session required to submit report" }, { status: 401 });
    }

    const loc = resolveLocation(body.address || "Delhi NCR", body.lat, body.lng);

    const created = await prisma.communityReport.create({
      data: {
        userId: targetUserId,
        category: body.category || "Pothole",
        title: body.title || "Reported Transit Hazard",
        description: body.description || "Reported by commuter",
        address: body.address || loc.name,
        lat: loc.lat,
        lng: loc.lng,
        severity: body.severity || "medium",
        status: "open",
        upvotes: 1,
        isVerified: false,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    const newReport = {
      id: created.id,
      category: created.category,
      title: created.title,
      description: created.description,
      address: created.address,
      lat: created.lat,
      lng: created.lng,
      severity: created.severity,
      status: created.status,
      upvotes: created.upvotes,
      isVerified: created.isVerified,
      timeAgo: "Just now",
      userName: created.user?.name || "You",
    };

    return NextResponse.json({
      message: "Report saved to database successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Community report POST error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
