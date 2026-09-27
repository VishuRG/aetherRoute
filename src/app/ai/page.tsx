"use client";

import { useState } from "react";
import { Bot, Send, User, Sparkles, Navigation, Ticket, Zap } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { useRouter } from "next/navigation";

export default function AIPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      sender: "ai",
      text: "Namaste! I am **EcoRoute AI**, your intelligent multimodal travel assistant for Delhi-NCR. Ask me about routes, traffic delays, weather advisories, metro fares, or CO₂ emissions!",
      timestamp: "Just now",
      quickActions: [
        { label: "Best route to Cyber City", prompt: "What is the best route to Cyber City right now?" },
        { label: "Metro status update", prompt: "Are there any delays on Delhi Metro Yellow Line?" },
        { label: "Compare EV Cab vs Metro", prompt: "Compare BluSmart EV Cab vs Delhi Metro cost and CO2" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === "book_metro") router.push("/tickets");
    else if (action === "book_cab") router.push("/bookings");
    else if (action === "view_map" || action === "reroute_metro") router.push("/routes");
    else if (action === "view_analytics") router.push("/analytics");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            EcoRoute AI Assistant <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Powered by Gemini 1.5 Flash & real-time NCR multimodal transit context
          </p>
        </div>
        <DemoBadge message="Gemini AI Multimodal Assistant" />
      </div>

      {/* Chat Container */}
      <div className="glass-card rounded-3xl border border-white/10 flex flex-col h-[520px] overflow-hidden shadow-2xl">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-black flex items-center justify-center font-bold shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 space-y-2 ${
                  msg.sender === "user"
                    ? "bg-emerald-500/20 text-white border border-emerald-500/30 rounded-tr-none"
                    : "glass-card text-slate-200 border border-white/10 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                {/* Quick Action Chips if any */}
                {msg.quickActions && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/8">
                    {msg.quickActions.map((qa: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() =>
                          qa.prompt
                            ? handleSendMessage(qa.prompt)
                            : handleActionClick(qa.action, qa.payload)
                        }
                        id={`ai-chip-${idx}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] transition-all"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-black flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="font-mono">EcoRoute AI is thinking...</div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/8 bg-black/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your Delhi-NCR commute..."
              id="ai-chat-input"
              className="eco-input flex-1 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              id="ai-chat-send-btn"
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
