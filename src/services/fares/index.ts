// Fare Service — Calculates transport fares across Delhi-NCR modes

export interface FareCalculation {
  mode: string;
  distanceKm: number;
  baseFare: number;
  totalFare: number;
  breakdown: { label: string; amount: number }[];
  isDemo: boolean;
}

// Delhi Metro Fare Rules
export function calculateMetroFare(distanceKm: number): number {
  if (distanceKm <= 2) return 10;
  if (distanceKm <= 5) return 20;
  if (distanceKm <= 12) return 30;
  if (distanceKm <= 21) return 40;
  if (distanceKm <= 32) return 50;
  return 60;
}

// DTC Bus Fare Rules (AC vs Non-AC)
export function calculateBusFare(distanceKm: number, isAC = true): number {
  if (isAC) {
    if (distanceKm <= 4) return 10;
    if (distanceKm <= 8) return 15;
    if (distanceKm <= 12) return 20;
    return 25;
  } else {
    if (distanceKm <= 4) return 5;
    if (distanceKm <= 10) return 10;
    return 15;
  }
}

// Auto Rickshaw Fare Rules (Delhi Govt Tariff)
export function calculateAutoFare(distanceKm: number, waitingMinutes = 0): number {
  // Base fare ₹30 for first 1.5 km, ₹11/km after
  if (distanceKm <= 1.5) return 30;
  const extraDist = distanceKm - 1.5;
  const fare = 30 + extraDist * 11 + waitingMinutes * 1;
  return Math.round(fare);
}

// Cab Fare Estimation (Ola / Uber / BluSmart)
export function calculateCabFare(
  distanceKm: number,
  durationMin: number,
  provider: "Ola" | "Uber" | "BluSmart" | "Rapido" = "Uber",
  vehicleType: "Auto" | "Mini" | "Sedan" | "SUV" | "EV" = "Sedan"
): number {
  let base = 50;
  let perKm = 14;
  let perMin = 2;

  if (vehicleType === "EV") {
    base = 60;
    perKm = 13; // Electric incentive
  } else if (vehicleType === "SUV") {
    base = 90;
    perKm = 20;
    perMin = 3.5;
  } else if (vehicleType === "Mini") {
    base = 40;
    perKm = 11;
  } else if (vehicleType === "Auto") {
    return calculateAutoFare(distanceKm);
  }

  const raw = base + distanceKm * perKm + durationMin * perMin;
  return Math.round(raw);
}

export function getFareDetails(mode: string, distanceKm: number, durationMin = 30): FareCalculation {
  const normMode = mode.toLowerCase();
  let baseFare = 0;
  let totalFare = 0;
  let breakdown: { label: string; amount: number }[] = [];

  if (normMode.includes("metro")) {
    totalFare = calculateMetroFare(distanceKm);
    baseFare = totalFare;
    breakdown = [{ label: "DMRC Token/Smartcard Fare", amount: totalFare }];
  } else if (normMode.includes("bus")) {
    totalFare = calculateBusFare(distanceKm, true);
    baseFare = totalFare;
    breakdown = [{ label: "DTC AC Bus Ticket", amount: totalFare }];
  } else if (normMode.includes("auto")) {
    totalFare = calculateAutoFare(distanceKm);
    baseFare = 30;
    breakdown = [
      { label: "Base Fare (first 1.5 km)", amount: 30 },
      { label: `Distance (${Math.max(0, distanceKm - 1.5).toFixed(1)} km @ ₹11/km)`, amount: totalFare - 30 },
    ];
  } else if (normMode.includes("cab") || normMode.includes("car")) {
    totalFare = calculateCabFare(distanceKm, durationMin, "Uber", "Sedan");
    baseFare = 50;
    breakdown = [
      { label: "Base Fare", amount: 50 },
      { label: `Distance Charge (${distanceKm.toFixed(1)} km)`, amount: Math.round(distanceKm * 14) },
      { label: `Time Charge (${durationMin} min)`, amount: Math.round(durationMin * 2) },
    ];
  } else {
    totalFare = 0;
    baseFare = 0;
    breakdown = [{ label: "Free / Pedestrian", amount: 0 }];
  }

  return {
    mode,
    distanceKm,
    baseFare,
    totalFare,
    breakdown,
    isDemo: true,
  };
}
