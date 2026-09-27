import { NextResponse } from "next/server";
import { getUserAnalyticsData } from "@/services/analytics";

export async function GET() {
  try {
    const data = await getUserAnalyticsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
