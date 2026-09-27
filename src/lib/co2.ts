// CO2 emission factors (kg CO2 per passenger-km)
// Source: Based on IPCC/Indian transport emission data

export const CO2_FACTORS: Record<string, number> = {
  Metro: 0.041,      // Delhi Metro (partly renewable)
  Bus: 0.089,        // DTC Electric Bus avg
  "Electric Bus": 0.040,
  Car: 0.171,        // Average Indian car (petrol)
  "Electric Car": 0.050,
  Cab: 0.171,
  Auto: 0.065,       // CNG auto-rickshaw
  Bike: 0.063,       // Motorcycle (petrol)
  "Electric Bike": 0.020,
  Walk: 0.0,
  Cycle: 0.0,
  Train: 0.011,      // Indian Railways
};

export const TREE_ABSORPTION_PER_YEAR = 21; // kg CO2 per tree per year

// Calculate CO2 for a journey
export function calculateCO2(mode: string, distanceKm: number): number {
  const factor = CO2_FACTORS[mode] ?? CO2_FACTORS["Car"];
  return parseFloat((factor * distanceKm).toFixed(3));
}

// CO2 saved vs. car
export function co2SavedVsCar(mode: string, distanceKm: number): number {
  const carCO2 = CO2_FACTORS["Car"] * distanceKm;
  const modeCO2 = calculateCO2(mode, distanceKm);
  return parseFloat(Math.max(0, carCO2 - modeCO2).toFixed(3));
}

// Trees equivalent
export function treesEquivalent(co2Kg: number): number {
  return parseFloat((co2Kg / (TREE_ABSORPTION_PER_YEAR / 365)).toFixed(2));
}

// Eco score (0–100)
export function ecoScore(mode: string): number {
  const scores: Record<string, number> = {
    Walk: 100,
    Cycle: 100,
    Metro: 88,
    "Electric Bus": 86,
    Bus: 75,
    Train: 90,
    "Electric Bike": 80,
    "Electric Car": 65,
    Auto: 55,
    Bike: 50,
    Cab: 40,
    Car: 35,
  };
  return scores[mode] ?? 40;
}

// Format CO2 for display
export function formatCO2(kg: number): string {
  if (kg < 0.001) return "0g";
  if (kg < 1) return `${Math.round(kg * 1000)}g`;
  return `${kg.toFixed(2)}kg`;
}
