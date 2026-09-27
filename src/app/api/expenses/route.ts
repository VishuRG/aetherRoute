import { NextResponse } from "next/server";
import { processReceiptOCR } from "@/services/ocr";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("receipt") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No receipt file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const parsed = await processReceiptOCR(buffer, file.name);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Expense OCR API error:", error);
    return NextResponse.json({ error: "Failed to process receipt" }, { status: 500 });
  }
}
