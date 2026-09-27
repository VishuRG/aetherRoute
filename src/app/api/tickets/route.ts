import { NextResponse } from "next/server";
import { generateTicket } from "@/services/tickets";

export async function POST(req: Request) {
  try {
    const { ticketType, fromStation, toStation, fare, passengerCount } = await req.json();

    const ticket = await generateTicket(
      ticketType || "Metro",
      fromStation || "Connaught Place",
      toStation || "DLF Cyber City",
      fare || 60,
      passengerCount || 1
    );

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Ticket API route error:", error);
    return NextResponse.json({ error: "Failed to generate ticket" }, { status: 500 });
  }
}
