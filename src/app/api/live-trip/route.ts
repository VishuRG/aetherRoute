import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { destinationName, lat, lng } = await req.json();

    const shareId = `live_${Date.now().toString(36)}`;
    const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/live-trip/${shareId}`;

    return NextResponse.json({
      shareId,
      shareUrl,
      status: "active",
      destinationName: destinationName || "DLF Cyber City, Gurugram",
      currentLat: lat || 28.6328,
      currentLng: lng || 77.2197,
      eta: "38 mins",
    });
  } catch (error) {
    console.error("Live trip API error:", error);
    return NextResponse.json({ error: "Failed to create live trip share link" }, { status: 500 });
  }
}
