import { NextResponse } from "next/server";
import { calculateRoutes } from "@/services/routing";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      originLat,
      originLng,
      originName,
      destLat,
      destLng,
      destName,
      modes,
      maxWalking,
      preferEco,
    } = body;

    const result = await calculateRoutes({
      originLat: typeof originLat === "number" ? originLat : undefined,
      originLng: typeof originLng === "number" ? originLng : undefined,
      originName: originName || "Connaught Place (Rajiv Chowk)",
      destLat: typeof destLat === "number" ? destLat : undefined,
      destLng: typeof destLng === "number" ? destLng : undefined,
      destName: destName || "DLF Cyber City, Gurugram",
      modes,
      maxWalking,
      preferEco,
    });

    return NextResponse.json({
      routes: result.routes,
      isDemo: result.isDemo,
      origin: result.routes[0]?.origin,
      destination: result.routes[0]?.destination,
    });
  } catch (error) {
    console.error("Route calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate routes" }, { status: 500 });
  }
}
