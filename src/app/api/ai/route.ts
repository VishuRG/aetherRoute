import { NextResponse } from "next/server";
import { generateAIResponse } from "@/services/ai";

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const aiMessage = await generateAIResponse(prompt, context);
    return NextResponse.json(aiMessage);
  } catch (error) {
    console.error("AI API route error:", error);
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
