import { NextResponse } from "next/server";
import { DELHI_NCR_LOCATIONS, findLocation, resolveLocation } from "@/lib/locations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({
        total: DELHI_NCR_LOCATIONS.length,
        locations: DELHI_NCR_LOCATIONS,
      });
    }

    const q = query.trim().toLowerCase();
    const filtered = DELHI_NCR_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.shortName.toLowerCase().includes(q) ||
        loc.zone.toLowerCase().includes(q) ||
        (loc.metroLine && loc.metroLine.toLowerCase().includes(q))
    );

    if (filtered.length === 0) {
      const { geocodeWithGeoapify } = await import("@/services/maps");
      const geoFeatures = await geocodeWithGeoapify(query);
      if (geoFeatures && geoFeatures.length > 0) {
        const geoLocations = geoFeatures.map((f: any, idx: number) => ({
          id: f.properties?.place_id || `geo-${idx}`,
          name: f.properties?.formatted || f.properties?.name || query,
          shortName: f.properties?.name || f.properties?.street || query,
          lat: f.geometry?.coordinates[1] ?? 28.6328,
          lng: f.geometry?.coordinates[0] ?? 77.2197,
          zone: f.properties?.city || f.properties?.district || "Delhi NCR",
          type: "hub" as const,
          isGeoapify: true,
        }));
        return NextResponse.json({
          query,
          count: geoLocations.length,
          locations: geoLocations,
          source: "geoapify",
        });
      }
    }

    return NextResponse.json({
      query,
      count: filtered.length,
      locations: filtered,
      source: "local",
    });
  } catch (error) {
    console.error("Locations API error:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, lat, lng } = await req.json();
    const resolved = resolveLocation(name, lat, lng);
    return NextResponse.json(resolved);
  } catch (error) {
    console.error("Resolve location error:", error);
    return NextResponse.json({ error: "Failed to resolve location" }, { status: 500 });
  }
}
