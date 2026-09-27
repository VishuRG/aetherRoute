import { NextResponse } from "next/server";
import { getCurrentWeather } from "@/services/weather";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "Delhi";
    const weather = await getCurrentWeather(city);
    return NextResponse.json(weather);
  } catch (error) {
    console.error("Weather API route error:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
