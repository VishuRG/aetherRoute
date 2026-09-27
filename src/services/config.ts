// Central configuration — reads environment variables server-side only
// Never expose secrets to the client

export type ServiceDataStatus = "LIVE" | "DEMO" | "EXTERNAL";

export const ECO_CONFIG = {
  DEMO_MODE: process.env.DEMO_MODE === "true",

  // Maps
  GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  OPENROUTESERVICE_KEY: process.env.NEXT_PUBLIC_OPENROUTESERVICE_KEY || "",

  // Transit
  TRANSIT_API_KEY: process.env.TRANSIT_API_KEY || "",

  // Weather
  OPENWEATHER_KEY: process.env.OPENWEATHER_API_KEY || "",
  WEATHERAPI_KEY: process.env.WEATHERAPI_KEY || "",

  // Payments
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",

  // OCR
  AZURE_OCR_ENDPOINT: process.env.AZURE_OCR_ENDPOINT || "",
  AZURE_OCR_KEY: process.env.AZURE_OCR_KEY || "",
  GOOGLE_VISION_KEY: process.env.GOOGLE_VISION_KEY || "",

  // AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || "",

  // App
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-replace-in-prod",
  SITE_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
} as const;

// Helper — is a provider configured?
export function isConfigured(key: string): boolean {
  const val = (ECO_CONFIG as unknown as Record<string, string | boolean>)[key];
  return typeof val === "string" && val.length > 0;
}

export function getServiceStatus(key: string, isExternalRedirect = false): ServiceDataStatus {
  if (isExternalRedirect) return "EXTERNAL";
  if (isConfigured(key)) return "LIVE";
  return "DEMO";
}

export const DEMO_MODE = ECO_CONFIG.DEMO_MODE || true;
