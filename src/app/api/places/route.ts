import { NextResponse } from "next/server";
import { fetchNearbyPOIs } from "@/services/maps";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "28.6328");
    const lng = parseFloat(searchParams.get("lng") || "77.2197");
    const category = (searchParams.get("category") || "hospital") as
      | "hospital"
      | "police"
      | "pharmacy"
      | "ev"
      | "parking";

    const places = await fetchNearbyPOIs(lat, lng, category);

    return NextResponse.json({
      success: true,
      category,
      count: places.length,
      places,
    });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ error: "Failed to fetch nearby places" }, { status: 500 });
  }
}
