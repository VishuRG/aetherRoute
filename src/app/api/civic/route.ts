import { NextResponse } from "next/server";
import { generateCivicComplaint } from "@/services/government";

export async function POST(req: Request) {
  try {
    const { category, title, description, address, reporterName } = await req.json();

    const draft = generateCivicComplaint(
      category || "Pothole",
      title || "Road Maintenance Required",
      description || "Issue causing traffic congestion and hazard.",
      address || "Connaught Place, New Delhi",
      reporterName || "EcoRoute User"
    );

    return NextResponse.json(draft);
  } catch (error) {
    console.error("Civic draft API error:", error);
    return NextResponse.json({ error: "Failed to generate civic complaint" }, { status: 500 });
  }
}
