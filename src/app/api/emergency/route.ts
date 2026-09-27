import { NextResponse } from "next/server";
import { triggerSOS } from "@/services/emergency";

export async function POST(req: Request) {
  try {
    const { lat, lng, address, contacts } = await req.json();

    const sosPayload = await triggerSOS(
      lat || 28.6328,
      lng || 77.2197,
      address || "Connaught Place, New Delhi",
      contacts || []
    );

    return NextResponse.json(sosPayload);
  } catch (error) {
    console.error("Emergency SOS API error:", error);
    return NextResponse.json({ error: "Failed to trigger emergency SOS" }, { status: 500 });
  }
}
