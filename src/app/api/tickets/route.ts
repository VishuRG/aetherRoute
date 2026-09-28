import { NextResponse } from "next/server";
import { generateTicket } from "@/services/tickets";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { resolveLocation, calculateDMRCFare, calculateDTCFare } from "@/lib/locations";
import { haversineDistance } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    const userId = session?.userId;

    const tickets = await prisma.ticket.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    const body = await req.json();
    const { ticketType, fromStation, toStation, fare, passengerCount } = body;

    const from = fromStation || "Connaught Place (Rajiv Chowk)";
    const to = toStation || "DLF Cyber City, Gurugram";
    const passengers = Math.max(1, parseInt(passengerCount || "1", 10));

    // Resolve accurate locations and calculate authentic fare if not provided
    const fromLoc = resolveLocation(from);
    const toLoc = resolveLocation(to);
    const dist = Math.max(2, haversineDistance(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng) * 1.15);

    let calculatedFare = fare;
    if (!calculatedFare || calculatedFare <= 0) {
      if (ticketType === "Bus") {
        calculatedFare = calculateDTCFare(dist, true) * passengers;
      } else {
        calculatedFare = calculateDMRCFare(dist) * passengers;
      }
    }

    const ticketData = await generateTicket(
      ticketType || "Metro",
      fromLoc.name,
      toLoc.name,
      calculatedFare,
      passengers
    );

    // Save ticket in SQLite database
    let dbTicket = null;
    try {
      // Find a user to attach to
      let targetUserId = session?.userId;
      if (!targetUserId) {
        const demoUser = await prisma.user.findFirst();
        targetUserId = demoUser?.id;
      }

      if (targetUserId) {
        dbTicket = await prisma.ticket.create({
          data: {
            userId: targetUserId,
            ticketType: ticketData.ticketType,
            operator: ticketData.operator,
            fromStation: ticketData.fromStation,
            toStation: ticketData.toStation,
            passengerCount: ticketData.passengerCount,
            fare: ticketData.fare,
            ticketNumber: ticketData.ticketNumber,
            qrCode: ticketData.qrCodeData,
            status: "active",
            validFrom: new Date(ticketData.validFrom),
            validUntil: new Date(ticketData.validUntil),
            isDemo: false,
          },
        });
      }
    } catch (dbError) {
      console.warn("Could not persist ticket to database:", dbError);
    }

    return NextResponse.json({
      ...ticketData,
      id: dbTicket?.id || ticketData.id,
      savedToDatabase: !!dbTicket,
    });
  } catch (error) {
    console.error("Ticket API route error:", error);
    return NextResponse.json({ error: "Failed to generate ticket" }, { status: 500 });
  }
}
