import { NextResponse } from "next/server";
import { processPayment } from "@/services/payments";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processPayment(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment API route error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
