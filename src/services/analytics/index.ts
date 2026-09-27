// Analytics Service — Computes carbon footprints, travel costs, distance stats, and eco-streak trends

export interface AnalyticsSummary {
  totalTrips: number;
  totalDistanceKm: number;
  totalDurationMin: number;
  totalSpend: number;
  totalCo2Kg: number;
  co2SavedKg: number;
  treesEquivalent: number;
  modeBreakdown: { mode: string; count: number; percentage: number; color: string }[];
  weeklyTrend: { day: string; co2Saved: number; spend: number }[];
  ecoStreakDays: number;
}

export async function getUserAnalyticsData(): Promise<AnalyticsSummary> {
  return {
    totalTrips: 34,
    totalDistanceKm: 412.5,
    totalDurationMin: 980,
    totalSpend: 2340,
    totalCo2Kg: 18.4,
    co2SavedKg: 42.6,
    treesEquivalent: 2,
    modeBreakdown: [
      { mode: "Delhi Metro", count: 24, percentage: 70, color: "#10b981" },
      { mode: "DTC Bus", count: 5, percentage: 15, color: "#3b82f6" },
      { mode: "BluSmart EV", count: 3, percentage: 9, color: "#8b5cf6" },
      { mode: "Auto / Cab", count: 2, percentage: 6, color: "#f59e0b" },
    ],
    weeklyTrend: [
      { day: "Mon", co2Saved: 6.2, spend: 120 },
      { day: "Tue", co2Saved: 7.1, spend: 110 },
      { day: "Wed", co2Saved: 5.8, spend: 140 },
      { day: "Thu", co2Saved: 8.4, spend: 60 },
      { day: "Fri", co2Saved: 7.5, spend: 120 },
      { day: "Sat", co2Saved: 4.2, spend: 180 },
      { day: "Sun", co2Saved: 3.4, spend: 90 },
    ],
    ecoStreakDays: 7,
  };
}
