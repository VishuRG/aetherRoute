// Routing Service — computes multimodal routes for Delhi-NCR
// Uses real API when configured, falls back to realistic demo simulation

import { ECO_CONFIG, isConfigured, getServiceStatus, ServiceDataStatus } from "@/services/config";
import { DEMO_ROUTES } from "@/lib/demo-data";
import { calculateCO2, co2SavedVsCar } from "@/lib/co2";
import { haversineDistance } from "@/lib/utils";

export interface RouteSegment {
  step: number;
  mode: string;
  from: string;
  to: string;
  duration: number;
  distance: number;
  line?: string;
  instructions?: string;
}

export interface RouteResult {
  id: string;
  label: string;
  mode: string;
  icon: string;
  totalDurationMin: number;
  totalDistanceKm: number;
  totalFare: number;
  co2Kg: number;
  co2SavedVsCarKg: number;
  walkingMinutes: number;
  transfers: number;
  trafficLevel: "low" | "medium" | "high";
  weatherImpact?: string;
  accessibilityScore: number;
  isRecommended: boolean;
  description: string;
  steps: RouteSegment[];
  dataStatus: ServiceDataStatus;
}

export interface RouteQuery {
  originLat: number;
  originLng: number;
  originName: string;
  destLat: number;
  destLng: number;
  destName: string;
  departureTime?: Date;
  modes?: string[];
}

export async function calculateRoutes(query: RouteQuery): Promise<RouteResult[]> {
  const isORS = isConfigured("OPENROUTESERVICE_KEY");

  if (isORS) {
    try {
      const results = await fetchORSRoutes(query);
      if (results.length > 0) return results;
    } catch (e) {
      console.error("ORS routing error:", e);
    }
  }

  return generateDemoRoutes(query);
}

async function fetchORSRoutes(query: RouteQuery): Promise<RouteResult[]> {
  const baseUrl = "https://api.openrouteservice.org/v2/directions";
  const profiles = ["driving-car", "foot-walking", "cycling-regular"];
  const results: RouteResult[] = [];

  for (const profile of profiles) {
    const res = await fetch(`${baseUrl}/${profile}`, {
      method: "POST",
      headers: {
        Authorization: ECO_CONFIG.OPENROUTESERVICE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [query.originLng, query.originLat],
          [query.destLng, query.destLat],
        ],
      }),
    });
    const data = await res.json();
    if (data.routes?.[0]) {
      const route = data.routes[0];
      const dist = route.summary.distance / 1000;
      const dur = Math.round(route.summary.duration / 60);
      const mode = profile === "driving-car" ? "Car" : profile === "foot-walking" ? "Walk" : "Bike";
      results.push({
        id: `ors-${profile}`,
        label: mode,
        mode,
        icon: mode === "Car" ? "🚗" : mode === "Walk" ? "🚶" : "🚲",
        totalDurationMin: dur,
        totalDistanceKm: dist,
        totalFare: mode === "Car" ? Math.round(dist * 8) : 0,
        co2Kg: calculateCO2(mode, dist),
        co2SavedVsCarKg: co2SavedVsCar(mode, dist),
        walkingMinutes: mode === "Walk" ? dur : 5,
        transfers: 0,
        trafficLevel: "medium",
        accessibilityScore: 70,
        isRecommended: false,
        description: `Via OpenRouteService API (${profile})`,
        steps: [],
        dataStatus: "LIVE",
      });
    }
  }
  return results;
}

function generateDemoRoutes(query: RouteQuery): RouteResult[] {
  const dist = haversineDistance(query.originLat, query.originLng, query.destLat, query.destLng);
  const scaleFactor = dist / 18.2;
  const dataStatus = getServiceStatus("OPENROUTESERVICE_KEY");

  return DEMO_ROUTES.map((r, idx) => {
    const scaledDist = parseFloat((r.totalDistanceKm * scaleFactor).toFixed(1));
    const scaledDur = Math.round(r.totalDurationMin * scaleFactor);
    const scaledFare = Math.round(r.totalFare * Math.max(0.5, scaleFactor));
    const co2 = calculateCO2(r.mode, scaledDist);

    return {
      ...r,
      id: `demo-${r.id}-${idx}`,
      totalDistanceKm: scaledDist,
      totalDurationMin: scaledDur,
      totalFare: scaledFare,
      co2Kg: co2,
      co2SavedVsCarKg: co2SavedVsCar(r.mode, scaledDist),
      walkingMinutes: Math.round(r.walkingMinutes * Math.max(0.5, scaleFactor)),
      trafficLevel: r.trafficLevel as "low" | "medium" | "high",
      accessibilityScore: r.mode === "Metro" ? 80 : r.mode === "Walk" ? 90 : 50,
      dataStatus,
    };
  });
}
