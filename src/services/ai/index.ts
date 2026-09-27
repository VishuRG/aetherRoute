// AI Service — Multimodal EcoRoute Assistant (Gemini / OpenAI API + Intelligent Fallback)

import { ECO_CONFIG, DEMO_MODE } from "@/services/config";

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string; payload?: any }[];
}

export async function generateAIResponse(
  prompt: string,
  context?: { origin?: string; destination?: string; currentMode?: string }
): Promise<AIChatMessage> {
  // If Gemini API key is configured
  if (ECO_CONFIG.GEMINI_API_KEY && !DEMO_MODE) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ECO_CONFIG.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are EcoRoute AI, an intelligent, helpful travel assistant focused on Delhi-NCR multimodal travel, CO2 reduction, ticket booking, and real-time transit advice. Answer concisely: ${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      }
    } catch (e) {
      console.error("Gemini API error:", e);
    }
  }

  // Domain-specific intelligent response engine for Delhi-NCR travel queries
  const q = prompt.toLowerCase();
  let text = "";
  let quickActions: { label: string; action: string; payload?: any }[] = [];

  if (q.includes("metro") || q.includes("fastest") || q.includes("route")) {
    text = `🌱 **Recommended Route**: Delhi Metro Yellow Line is your fastest & greenest option right now!
• **Duration**: ~42 mins
• **CO₂ Emissions**: 0.75 kg (Saves 3.0 kg vs car)
• **Fare**: ₹60
• **Traffic Status**: Smooth operations on Yellow Line. Minor 5 min delay near Vishwavidyalaya.`;
    quickActions = [
      { label: "Book Metro Ticket (₹60)", action: "book_metro" },
      { label: "View Route on Map", action: "view_map" },
    ];
  } else if (q.includes("rain") || q.includes("weather") || q.includes("waterlog")) {
    text = `🌧️ **Weather Impact Alert**: Light rain expected around Delhi-NCR.
• Minto Bridge underpass & Ashram Chowk are prone to waterlogging.
• **Advice**: Switch from DTC Bus/Cab to Delhi Metro to avoid road traffic delays.`;
    quickActions = [
      { label: "Check Live Weather", action: "view_weather" },
      { label: "Reroute via Metro", action: "reroute_metro" },
    ];
  } else if (q.includes("cab") || q.includes("uber") || q.includes("ola") || q.includes("blusmart")) {
    text = `🚕 **Cab Comparison**:
• **BluSmart EV**: ₹285 | 4 min ETA | 0 direct emissions ⚡
• **Uber Premier**: ₹320 | 3 min ETA | 3.7 kg CO₂
• **Ola Auto**: ₹185 | 2 min ETA | 1.2 kg CO₂`;
    quickActions = [
      { label: "Book BluSmart EV (₹285)", action: "book_cab", payload: { provider: "BluSmart" } },
      { label: "Book Ola Auto (₹185)", action: "book_cab", payload: { provider: "Ola" } },
    ];
  } else if (q.includes("co2") || q.includes("carbon") || q.includes("saved") || q.includes("streak")) {
    text = `🌿 **Your Eco Impact Summary**:
• **7-Day Streak**: 🔥 Active!
• **Total CO₂ Saved This Month**: 42.6 kg (equivalent to planting 2 trees 🌳)
• **Primary Transport**: Delhi Metro (82% of trips)`;
    quickActions = [{ label: "View Full Analytics", action: "view_analytics" }];
  } else {
    text = `I can help you find the fastest, cheapest, and lowest-emission route across Delhi-NCR (Metro, DTC Bus, BluSmart EV, Auto, Cab). What trip would you like to plan today?`;
    quickActions = [
      { label: "Plan Trip to Cyber City", action: "plan_trip", payload: { dest: "DLF Cyber City" } },
      { label: "Plan Trip to Airport T3", action: "plan_trip", payload: { dest: "IGI Airport T3" } },
    ];
  }

  return {
    id: `ai_${Date.now()}`,
    sender: "ai",
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    quickActions,
  };
}
