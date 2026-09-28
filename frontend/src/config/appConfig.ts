// AetherRoute — Centralized Units, Currency & Provider Configuration
// Change units, currencies, and connector types here across the entire application

export interface AppConfig {
  brand: {
    name: string;
    tagline: string;
    version: string;
  };
  localization: {
    currencySymbol: string;
    currencyCode: string;
    distanceUnit: "km" | "mi";
    speedUnit: "km/h" | "mph";
    fuelUnit: "L" | "gal";
  };
  connectors: Array<{
    id: string;
    name: string;
    standard: string;
    maxPowerKw: number;
    popularIn: string;
  }>;
  fuelTypes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  mapTiles: {
    light: {
      style: string;
      tiles: string[];
      attribution: string;
    };
    dark: {
      style: string;
      tiles: string[];
      attribution: string;
    };
    defaultCenter: [number, number]; // [lng, lat]
    defaultZoom: number;
  };
}

export const APP_CONFIG: AppConfig = {
  brand: {
    name: "AetherRoute",
    tagline: "Apple Maps precision meets Airbnb hospitality for multimodal travel",
    version: "2.5.0-production",
  },
  localization: {
    currencySymbol: "₹",
    currencyCode: "INR",
    distanceUnit: "km",
    speedUnit: "km/h",
    fuelUnit: "L",
  },
  connectors: [
    { id: "ccs2", name: "CCS Type 2", standard: "IEC 62196-3", maxPowerKw: 350, popularIn: "Universal DC" },
    { id: "type2", name: "Type 2 (Mennekes)", standard: "IEC 62196-2", maxPowerKw: 22, popularIn: "AC Charging" },
    { id: "chademo", name: "CHAdeMO", standard: "JEVS G105", maxPowerKw: 100, popularIn: "Nissan/Older EVs" },
    { id: "gbt", name: "GB/T", standard: "GB/T 20234", maxPowerKw: 250, popularIn: "Indian Fleet Standards" },
  ],
  fuelTypes: [
    { id: "petrol", name: "Regular Petrol", color: "#FF7A1A" },
    { id: "speed", name: "Premium 95 Octane", color: "#FFC93C" },
    { id: "diesel", name: "Diesel", color: "#3FBF7F" },
    { id: "cng", name: "CNG", color: "#1E7F4F" },
  ],
  mapTiles: {
    light: {
      style: "carto-positron",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    },
    dark: {
      style: "carto-dark-matter",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    },
    defaultCenter: [77.2197, 28.6328], // Connaught Place, New Delhi
    defaultZoom: 12,
  },
};
