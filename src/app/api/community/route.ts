import { NextResponse } from "next/server";
import { DEMO_COMMUNITY_REPORTS } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({ reports: DEMO_COMMUNITY_REPORTS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newReport = {
      id: `cr-${Date.now()}`,
      category: body.category || "Pothole",
      title: body.title || "Reported Issue",
      description: body.description || "",
      address: body.address || "Delhi NCR",
      lat: body.lat || 28.6328,
      lng: body.lng || 77.2197,
      upvotes: 1,
      status: "open",
      severity: body.severity || "medium",
      timeAgo: "Just now",
      userName: "You",
    };

    return NextResponse.json({ message: "Report submitted successfully", report: newReport });
  } catch (error) {
    console.error("Community report error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
