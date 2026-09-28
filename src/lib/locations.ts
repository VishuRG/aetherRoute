// Verified Delhi-NCR Hubs & Coordinates Registry
// Exact GPS coordinates for Delhi, Noida, Gurugram, Faridabad & Ghaziabad

export interface DelhiLocation {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  type: "Metro Station" | "Business District" | "Airport" | "Railway Station" | "ISBT" | "University" | "Residential" | "Hospital";
  metroLine?: string;
  zone: "Central Delhi" | "South Delhi" | "North Delhi" | "West Delhi" | "East Delhi" | "Gurugram" | "Noida" | "Ghaziabad" | "Faridabad";
}

export const DELHI_NCR_LOCATIONS: DelhiLocation[] = [
  // Central Delhi
  {
    id: "cp",
    name: "Connaught Place (Rajiv Chowk)",
    shortName: "Rajiv Chowk",
    lat: 28.6328,
    lng: 77.2197,
    type: "Metro Station",
    metroLine: "Yellow & Blue Line Interchange",
    zone: "Central Delhi",
  },
  {
    id: "ndls",
    name: "New Delhi Railway Station (NDLS)",
    shortName: "New Delhi Rly Stn",
    lat: 28.6431,
    lng: 77.2197,
    type: "Railway Station",
    metroLine: "Yellow Line & Airport Express",
    zone: "Central Delhi",
  },
  {
    id: "mandi-house",
    name: "Mandi House",
    shortName: "Mandi House",
    lat: 28.6258,
    lng: 77.2344,
    type: "Metro Station",
    metroLine: "Blue & Violet Line Interchange",
    zone: "Central Delhi",
  },
  {
    id: "central-sec",
    name: "Central Secretariat",
    shortName: "Central Sec",
    lat: 28.6146,
    lng: 77.2119,
    type: "Metro Station",
    metroLine: "Yellow & Violet Line Interchange",
    zone: "Central Delhi",
  },
  {
    id: "ito",
    name: "ITO Metro Station",
    shortName: "ITO",
    lat: 28.6310,
    lng: 77.2425,
    type: "Metro Station",
    metroLine: "Violet Line",
    zone: "Central Delhi",
  },

  // Gurugram
  {
    id: "cybercity",
    name: "DLF Cyber City, Gurugram",
    shortName: "Cyber City",
    lat: 28.4950,
    lng: 77.0889,
    type: "Business District",
    metroLine: "Rapid Metro (Cyber City)",
    zone: "Gurugram",
  },
  {
    id: "sikanderpur",
    name: "Sikanderpur Metro Station",
    shortName: "Sikanderpur",
    lat: 28.4819,
    lng: 77.0927,
    type: "Metro Station",
    metroLine: "Yellow Line & Rapid Metro Interchange",
    zone: "Gurugram",
  },
  {
    id: "iffco",
    name: "IFFCO Chowk, Gurugram",
    shortName: "IFFCO Chowk",
    lat: 28.4697,
    lng: 77.0781,
    type: "Metro Station",
    metroLine: "Yellow Line",
    zone: "Gurugram",
  },
  {
    id: "huda",
    name: "Millennium City Centre (Huda City Centre)",
    shortName: "Millennium City Centre",
    lat: 28.4595,
    lng: 77.0266,
    type: "Metro Station",
    metroLine: "Yellow Line Terminal",
    zone: "Gurugram",
  },
  {
    id: "golf-course",
    name: "Golf Course Road, Gurugram",
    shortName: "Golf Course Rd",
    lat: 28.4485,
    lng: 77.0991,
    type: "Business District",
    metroLine: "Rapid Metro (Sector 54 Chowk)",
    zone: "Gurugram",
  },

  // Noida & Greater Noida
  {
    id: "noida-city-centre",
    name: "Noida City Centre",
    shortName: "Noida City Ctr",
    lat: 28.5760,
    lng: 77.3573,
    type: "Business District",
    metroLine: "Blue Line",
    zone: "Noida",
  },
  {
    id: "botanical-garden",
    name: "Botanical Garden, Noida",
    shortName: "Botanical Garden",
    lat: 28.5645,
    lng: 77.3344,
    type: "Metro Station",
    metroLine: "Blue & Magenta Line Interchange",
    zone: "Noida",
  },
  {
    id: "sector-18-noida",
    name: "Sector 18 (Atta Market), Noida",
    shortName: "Noida Sec 18",
    lat: 28.5708,
    lng: 77.3261,
    type: "Business District",
    metroLine: "Blue Line",
    zone: "Noida",
  },
  {
    id: "noida-sec-62",
    name: "Noida Sector 62 (Electronic City)",
    shortName: "Noida Sec 62",
    lat: 28.6258,
    lng: 77.3653,
    type: "Business District",
    metroLine: "Blue Line Extension",
    zone: "Noida",
  },
  {
    id: "pari-chowk",
    name: "Pari Chowk, Greater Noida",
    shortName: "Pari Chowk",
    lat: 28.4682,
    lng: 77.5147,
    type: "Business District",
    metroLine: "Aqua Line",
    zone: "Noida",
  },

  // South Delhi
  {
    id: "hauz-khas",
    name: "Hauz Khas Metro Interchange",
    shortName: "Hauz Khas",
    lat: 28.5431,
    lng: 77.2065,
    type: "Metro Station",
    metroLine: "Yellow & Magenta Line Interchange",
    zone: "South Delhi",
  },
  {
    id: "aiims",
    name: "AIIMS New Delhi",
    shortName: "AIIMS",
    lat: 28.5672,
    lng: 77.2100,
    type: "Hospital",
    metroLine: "Yellow Line",
    zone: "South Delhi",
  },
  {
    id: "nehru-place",
    name: "Nehru Place IT Hub",
    shortName: "Nehru Place",
    lat: 28.5489,
    lng: 77.2517,
    type: "Business District",
    metroLine: "Violet & Magenta Line (Kalkaji Mandir)",
    zone: "South Delhi",
  },
  {
    id: "saket",
    name: "Saket (Select Citywalk)",
    shortName: "Saket",
    lat: 28.5245,
    lng: 77.2066,
    type: "Business District",
    metroLine: "Yellow Line",
    zone: "South Delhi",
  },
  {
    id: "lajpat-nagar",
    name: "Lajpat Nagar Central Market",
    shortName: "Lajpat Nagar",
    lat: 28.5698,
    lng: 77.2385,
    type: "Metro Station",
    metroLine: "Pink & Violet Line Interchange",
    zone: "South Delhi",
  },
  {
    id: "vasant-kunj",
    name: "Vasant Kunj Promenade",
    shortName: "Vasant Kunj",
    lat: 28.5224,
    lng: 77.1557,
    type: "Residential",
    metroLine: "Chhatarpur / Aerocity feeder",
    zone: "South Delhi",
  },
  {
    id: "iit-delhi",
    name: "IIT Delhi Campus",
    shortName: "IIT Delhi",
    lat: 28.5450,
    lng: 77.1926,
    type: "University",
    metroLine: "Magenta Line",
    zone: "South Delhi",
  },

  // West & South-West Delhi / Airport
  {
    id: "airport",
    name: "IGI Airport Terminal 3",
    shortName: "IGI Airport T3",
    lat: 28.5562,
    lng: 77.1000,
    type: "Airport",
    metroLine: "Airport Express Line",
    zone: "West Delhi",
  },
  {
    id: "airport-t1",
    name: "IGI Airport Terminal 1",
    shortName: "IGI Airport T1",
    lat: 28.5695,
    lng: 77.1186,
    type: "Airport",
    metroLine: "Magenta Line (Terminal 1-IGI Airport)",
    zone: "West Delhi",
  },
  {
    id: "dwarka-sec-21",
    name: "Dwarka Sector 21",
    shortName: "Dwarka Sec 21",
    lat: 28.5531,
    lng: 77.0594,
    type: "Metro Station",
    metroLine: "Blue Line & Airport Express Interchange",
    zone: "West Delhi",
  },
  {
    id: "karol-bagh",
    name: "Karol Bagh Metro Station",
    shortName: "Karol Bagh",
    lat: 28.6531,
    lng: 77.1909,
    type: "Metro Station",
    metroLine: "Blue Line",
    zone: "West Delhi",
  },
  {
    id: "janakpuri-west",
    name: "Janakpuri West",
    shortName: "Janakpuri West",
    lat: 28.6294,
    lng: 77.0778,
    type: "Metro Station",
    metroLine: "Blue & Magenta Line Interchange",
    zone: "West Delhi",
  },
  {
    id: "rajouri-garden",
    name: "Rajouri Garden",
    shortName: "Rajouri Garden",
    lat: 28.6493,
    lng: 77.1232,
    type: "Metro Station",
    metroLine: "Blue & Pink Line Interchange",
    zone: "West Delhi",
  },

  // North Delhi
  {
    id: "kashmere-gate",
    name: "Kashmere Gate ISBT",
    shortName: "Kashmere Gate",
    lat: 28.6666,
    lng: 77.2280,
    type: "ISBT",
    metroLine: "Red, Yellow & Violet Line Interchange",
    zone: "North Delhi",
  },
  {
    id: "du-north",
    name: "North Campus, Delhi University (Vishwavidyalaya)",
    shortName: "DU North Campus",
    lat: 28.6903,
    lng: 77.2072,
    type: "University",
    metroLine: "Yellow Line (Vishwavidyalaya)",
    zone: "North Delhi",
  },
  {
    id: "rohini-west",
    name: "Rohini West Metro Station",
    shortName: "Rohini West",
    lat: 28.7041,
    lng: 77.1105,
    type: "Residential",
    metroLine: "Red Line",
    zone: "North Delhi",
  },

  // East Delhi & Ghaziabad
  {
    id: "anand-vihar",
    name: "Anand Vihar ISBT & Railway Station",
    shortName: "Anand Vihar",
    lat: 28.6502,
    lng: 77.3155,
    type: "ISBT",
    metroLine: "Blue & Pink Line Interchange",
    zone: "East Delhi",
  },
  {
    id: "indirapuram",
    name: "Indirapuram, Ghaziabad",
    shortName: "Indirapuram",
    lat: 28.6415,
    lng: 77.3714,
    type: "Residential",
    metroLine: "Vaishali / Noida Sec 62 feeder",
    zone: "Ghaziabad",
  },
  {
    id: "vaishali",
    name: "Vaishali Metro Station, Ghaziabad",
    shortName: "Vaishali",
    lat: 28.6499,
    lng: 77.3396,
    type: "Metro Station",
    metroLine: "Blue Line Branch",
    zone: "Ghaziabad",
  },

  // Faridabad
  {
    id: "badarpur",
    name: "Badarpur Border",
    shortName: "Badarpur",
    lat: 28.5034,
    lng: 77.3047,
    type: "Metro Station",
    metroLine: "Violet Line",
    zone: "Faridabad",
  },
  {
    id: "faridabad-bata",
    name: "Bata Chowk, Faridabad",
    shortName: "Bata Chowk",
    lat: 28.3846,
    lng: 77.3142,
    type: "Metro Station",
    metroLine: "Violet Line",
    zone: "Faridabad",
  },
];

// Lookup location by name or id with fuzzy matching
export function findLocation(query: string): DelhiLocation | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();

  // Exact ID match
  const byId = DELHI_NCR_LOCATIONS.find((loc) => loc.id.toLowerCase() === q);
  if (byId) return byId;

  // Exact name or shortName match
  const exact = DELHI_NCR_LOCATIONS.find(
    (loc) => loc.name.toLowerCase() === q || loc.shortName.toLowerCase() === q
  );
  if (exact) return exact;

  // Substring inclusion
  return DELHI_NCR_LOCATIONS.find(
    (loc) => loc.name.toLowerCase().includes(q) || q.includes(loc.shortName.toLowerCase())
  );
}

// Resolve coordinates: prioritize explicit lat/lng, then registry lookup, fallback to Delhi center
export function resolveLocation(
  name: string,
  lat?: number | null,
  lng?: number | null
): { name: string; lat: number; lng: number; type: string } {
  // If valid coordinates are provided, use them
  if (lat && lng && lat > 27.5 && lat < 29.5 && lng > 76.0 && lng < 78.5) {
    const matched = findLocation(name);
    return {
      name: name || (matched ? matched.name : "Custom Location"),
      lat,
      lng,
      type: matched?.type || "Custom Location",
    };
  }

  // Look up in registry
  const found = findLocation(name);
  if (found) {
    return {
      name: found.name,
      lat: found.lat,
      lng: found.lng,
      type: found.type,
    };
  }

  // Default Central Delhi if unknown
  return {
    name: name || "Connaught Place (Rajiv Chowk)",
    lat: 28.6328,
    lng: 77.2197,
    type: "Metro Station",
  };
}

// Official DMRC Metro Fare Matrix (in ₹)
export function calculateDMRCFare(distanceKm: number): number {
  if (distanceKm <= 2) return 10;
  if (distanceKm <= 5) return 20;
  if (distanceKm <= 12) return 30;
  if (distanceKm <= 21) return 40;
  if (distanceKm <= 32) return 50;
  return 60;
}

// Official DTC Bus Fare (Non-AC: ₹5-15, AC Electric: ₹10-25)
export function calculateDTCFare(distanceKm: number, isAC = true): number {
  if (isAC) {
    if (distanceKm <= 4) return 10;
    if (distanceKm <= 8) return 15;
    if (distanceKm <= 12) return 20;
    return 25;
  }
  if (distanceKm <= 4) return 5;
  if (distanceKm <= 10) return 10;
  return 15;
}

// Delhi Govt CNG Auto Rickshaw tariff (₹30 first 1.5 km + ₹11/km)
export function calculateAutoFare(distanceKm: number): number {
  if (distanceKm <= 1.5) return 30;
  return Math.round(30 + (distanceKm - 1.5) * 11);
}

// Cab Fare (Base ₹50 + ₹14/km)
export function calculateCabFare(distanceKm: number, isEV = false): number {
  const ratePerKm = isEV ? 15 : 14;
  return Math.round(50 + distanceKm * ratePerKm);
}
