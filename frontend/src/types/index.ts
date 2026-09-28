// Core TypeScript Type Definitions for AetherRoute

export type VehicleType = "ev" | "petrol" | "diesel" | "cng";

export type RoutePreference = "fastest" | "eco" | "cheapest" | "scenic";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteWaypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface RouteTimelineStep {
  id: string;
  instruction: string;
  distanceKm: number;
  durationMin: number;
  roadName: string;
  type: "turn-left" | "turn-right" | "straight" | "roundabout" | "merge" | "charger" | "fuel" | "destination";
  iconName: string;
}

export interface RouteOption {
  id: string;
  title: string;
  tag: RoutePreference;
  durationMin: number;
  distanceKm: number;
  estimatedCost: number;
  co2Grams: number;
  co2SavedPercent: number;
  trafficLevel: "smooth" | "moderate" | "heavy";
  elevationGainMeters: number;
  recommended: boolean;
  color: string;
  polyline: [number, number][]; // [[lng, lat], ...]
  timeline: RouteTimelineStep[];
  suggestedChargers?: EVCharger[];
  suggestedFuelStops?: PetrolStation[];
}

export interface EVCharger {
  id: string;
  name: string;
  brand: string;
  address: string;
  location: LatLng;
  distanceKm: number;
  detourMinutes: number;
  powerKw: number;
  pricePerKwh: number;
  rating: number;
  reviewCount: number;
  totalPorts: number;
  availablePorts: number;
  connectors: string[]; // e.g. ["CCS2", "Type 2"]
  isFastCharger: boolean;
  status: "available" | "busy" | "offline";
  amenities: Array<"cafe" | "restroom" | "wifi" | "all_night" | "shopping">;
}

export interface PetrolStation {
  id: string;
  brand: "IndianOil" | "Bharat Petroleum" | "Shell" | "HP" | "Jio-bp";
  name: string;
  address: string;
  location: LatLng;
  detourMinutes: number;
  pricePerLiter: number;
  previousPrice: number;
  priceTrend: "down" | "up" | "stable";
  sparkline: number[]; // e.g. [94.5, 94.6, 94.4, 94.2, 93.9, 93.8]
  isBestPrice: boolean;
  queueLevel: "low" | "medium" | "high";
  queueWaitMinutes: number;
  fuelTypes: string[];
  amenities: Array<"air" | "restroom" | "atm" | "convenience" | "24x7">;
}

export type ProblemType =
  | "accident"
  | "traffic_jam"
  | "road_closure"
  | "roadwork"
  | "pothole"
  | "waterlogging"
  | "breakdown"
  | "charger_down"
  | "pump_dry";

export type ProblemSeverity = "low" | "moderate" | "critical";

export interface RoadProblem {
  id: string;
  type: ProblemType;
  title: string;
  description: string;
  location: LatLng;
  distanceKm: number;
  reportedTimeAgo: string;
  timestamp: number;
  severity: ProblemSeverity;
  likes: number;
  confirmCount: number;
  clearedCount: number;
  userConfirmed?: boolean;
  userLiked?: boolean;
  userReportedCleared?: boolean;
  isVerified: boolean; // Verified after 3+ confirms
  photoUrl?: string;
  expiresInMinutes: number;
}

export type AlertPriority = "info" | "success" | "warning" | "urgent";
export type AlertCategory = "route" | "ev" | "fuel" | "community" | "system";

export interface SmartAlert {
  id: string;
  title: string;
  message: string;
  category: AlertCategory;
  priority: AlertPriority;
  timestamp: number;
  timeAgo: string;
  read: boolean;
  snoozedUntil?: number;
  action?: {
    label: string;
    actionType: "reroute" | "add_stop" | "view" | "dismiss";
    payload?: any;
  };
}

export interface VehicleProfile {
  type: VehicleType;
  modelName: string;
  batteryCapacityKwh: number;
  currentBatteryPercent: number;
  currentRangeKm: number;
  maxRangeKm: number;
  efficiencyWhPerKm: number;
  fuelTankCapacityL: number;
  currentFuelLevelPercent: number;
  fuelEfficiencyKmPerL: number;
}

export interface FilterState {
  showChargers: boolean;
  showPetrolPumps: boolean;
  showLiveProblems: boolean;
  chargerConnector: string | "all";
  minPowerKw: number;
  maxDetourMinutes: number;
  availableOnly: boolean;
  bestPriceOnly: boolean;
  amenityFilters: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  mobile?: string | null;
  avatarUrl?: string | null;
  city?: string;
  role?: string;
  ecoPoints?: number;
  co2SavedKg?: number;
}

