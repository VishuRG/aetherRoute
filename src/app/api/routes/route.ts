import { NextResponse } from "next/server";
import { calculateRoutes } from "@/services/routing";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { originLat, originLng, originName, destLat, destLng, destName } = body;

    const routes = await calculateRoutes({
      originLat: originLat || 28.6328,
      originLng: originLng || 77.2197,
      originName: originName || "Connaught Place",
      destLat: destLat || 28.4950,
      destLng: destLng || 77.0889,
      destName: destName || "DLF Cyber City",
    });

    return NextResponse.json({ routes, isDemo: true });
  } catch (error) {
    console.error("Route calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate routes" }, { status: 500 });
  }
}
