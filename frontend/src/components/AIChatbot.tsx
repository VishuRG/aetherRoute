// Fixed Floating AI Journey Chatbot Component
// Positioned at the bottom-right corner, powered by Hugging Face (Llama 3.3 70B)
// Advises on destinations, multimodal journey plans, EV charging corridors, and petrol stops

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Send,
  X,
  RotateCcw,
  Navigation,
  Compass,
  Zap,
  Fuel,
  Maximize2,
  Minimize2,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedDestination?: string;
}

const QUICK_PROMPTS = [
  "⚡ Best EV stops Delhi to Jaipur?",
  "🚗 Fastest route to Cyber Hub?",
  "🌄 Weekend trip to Agra via Yamuna Expressway?",
  "⛽ Cheapest petrol pumps on NH-48?",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "msg-welcome",
  sender: "ai",
  text: "Hello! I am your **Aether Journey Copilot**, powered by Hugging Face & Llama 3.3.\n\nAsk me about any destination, fastest EV charging corridors, cheapest fuel stops, or scenic road trips!",
  timestamp: "Just now",
};

export const AIChatbot: React.FC = () => {
  const navigate = useNavigate();
  const setDestination = useAppStore((s) => s.setDestination);
  const setOrigin = useAppStore((s) => s.setOrigin);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 1. Call Hugging Face via our proxy / API endpoint
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.text || "Here is your journey plan advice.";

        // Detect if a prominent destination is mentioned for 1-click planner navigation
        let detectedDest: string | undefined;
        if (/jaipur/i.test(replyText)) detectedDest = "Amer Fort, Jaipur";
        else if (/cyber/i.test(replyText)) detectedDest = "DLF Cyber Hub, Gurugram";
        else if (/agra/i.test(replyText)) detectedDest = "Taj Mahal, Agra";
        else if (/noida/i.test(replyText)) detectedDest = "Noida Sector 62";

        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedDestination: detectedDest,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("API call failed");
      }
    } catch (err) {
      console.warn("Error getting AI response, falling back to smart travel answer:", err);
      // Smart travel fallback
      const fallbackReply = generateLocalTravelAdvice(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: fallbackReply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedDestination: fallbackReply.dest,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalTravelAdvice = (q: string): { text: string; dest?: string } => {
    const lower = q.toLowerCase();
    if (lower.includes("jaipur")) {
      return {
        text: `🚗 **Delhi to Jaipur Journey Plan**:
• **Distance**: 268 km | **Duration**: ~4h 15m via Delhi-Mumbai Expressway.
• **EV Fast Chargers**: Statiq Superhub (Manesar) & Tata Power 150kW (Neemrana).
• **Fuel Advice**: Lower fuel prices along Rajasthan border pumps.
• **Scenic Highlight**: Amer Fort & Sariska Tiger Reserve detour.`,
        dest: "Amer Fort, Jaipur",
      };
    } else if (lower.includes("agra")) {
      return {
        text: `🏛️ **Delhi to Agra Journey Plan**:
• **Distance**: 214 km | **Duration**: ~2h 45m via Yamuna Expressway.
• **Tolls**: ~₹435 (Yamuna Expressway fast track).
• **EV Fast Chargers**: 6 DC Hyperchargers at Food Plaza Milestones (Km 65 & Km 120).
• **Traffic**: Smooth steady 100 km/h cruising.`,
        dest: "Taj Mahal, Agra",
      };
    } else if (lower.includes("cyber") || lower.includes("gurgaon") || lower.includes("gurugram")) {
      return {
        text: `⚡ **Connaught Place to DLF Cyber Hub**:
• **Distance**: 29.4 km | **Duration**: ~38 min via NH-48 Express.
• **EV Hub**: Ambience Mall Tata Power 150kW (4 ports free).
• **Traffic Status**: Moderate near Mahipalpur Flyover.`,
        dest: "DLF Cyber Hub, Gurugram",
      };
    } else {
      return {
        text: `🗺️ **Multimodal Journey Tip**:
• Choose **Delhi Metro** for zero emissions & avoiding city congestion.
• For highway journeys, check **Range Guard™** in our Planner to reserve charging slots before departure.`,
        dest: "DLF Cyber Hub, Gurugram",
      };
    }
  };

  const handleApplyDestination = (dest: string) => {
    setDestination(dest);
    setIsOpen(false);
    navigate("/plan");
  };

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* 1. Expandable Glassmorphic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="w-[90vw] sm:w-96 max-h-[560px] h-[520px] rounded-3xl glass-panel shadow-layered border border-cream-border dark:border-dark-border flex flex-col overflow-hidden mb-3"
          >
            {/* Window Header */}
            <div className="p-4 border-b border-cream-border/70 dark:border-dark-border/70 bg-cream-warm/70 dark:bg-dark-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-2xl bg-forest text-white flex items-center justify-center shadow-soft">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-forest-mint border-2 border-white dark:border-dark-card animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-sora text-dark-bg dark:text-cream flex items-center gap-1.5">
                    <span>Aether Journey AI</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-sun/30 text-dark-bg dark:text-cream font-extrabold">
                      Llama 3.3
                    </span>
                  </h3>
                  <p className="text-[10px] text-muted-dark dark:text-cream/60 font-mono">
                    Hugging Face Inference Gateway
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-xl text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream hover:bg-cream-border/40 transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-muted-dark dark:text-cream/60 hover:text-dark-bg dark:hover:text-cream hover:bg-cream-border/40 transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-forest text-white rounded-br-sm shadow-soft"
                        : "bg-cream-warm/70 dark:bg-dark-bg/80 text-dark-bg dark:text-cream border border-cream-border/60 dark:border-dark-border/60 rounded-bl-sm"
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs">{msg.text}</div>

                    {/* 1-Click Action to Apply Destination to Planner */}
                    {msg.suggestedDestination && (
                      <div className="mt-2.5 pt-2 border-t border-cream-border/40 dark:border-dark-border/40">
                        <button
                          onClick={() => handleApplyDestination(msg.suggestedDestination!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sun hover:bg-sun-hover text-dark-bg font-bold font-sora text-[11px] shadow-sm transition-transform active:scale-95"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Plan Route to {msg.suggestedDestination.split(",")[0]}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-muted-dark dark:text-cream/50 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Animated Typing Indicator */}
              {loading && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-cream-warm/70 dark:bg-dark-bg/80 text-muted-dark w-max">
                  <span className="w-2 h-2 rounded-full bg-forest animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-forest-mint animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-sun animate-bounce [animation-delay:0.3s]" />
                  <span className="text-[10px] font-mono ml-1.5 text-forest">Consulting Llama 3.3...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-3 py-2 border-t border-cream-border/40 dark:border-dark-border/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-cream-warm/30 dark:bg-dark-card/30">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap bg-cream-card dark:bg-dark-bg border border-cream-border dark:border-dark-border text-muted-dark dark:text-cream/70 hover:border-forest hover:text-forest transition-colors shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-cream-border/60 dark:border-dark-border/60 bg-cream-card dark:bg-dark-card flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about journeys, EV stops, routes..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-cream-warm/50 dark:bg-dark-bg border border-cream-border dark:border-dark-border text-xs text-dark-bg dark:text-cream focus:outline-none focus:border-forest"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-2xl bg-forest text-white hover:bg-forest-deep disabled:opacity-40 transition-transform active:scale-95 shadow-soft"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Circular Trigger Button (Fixed Bottom Right) */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-full bg-gradient-to-tr from-forest to-forest-mint text-white shadow-glowGreen border-2 border-sun/60 flex items-center justify-center transition-all cursor-pointer"
        aria-label="Toggle AI Journey Chatbot"
      >
        {/* Pulsing Outer Glow */}
        <span className="absolute -inset-1 rounded-full bg-forest-mint/30 animate-ping pointer-events-none" />

        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sun border-2 border-forest" />
          </div>
        )}

        {/* Tooltip hint when closed */}
        {!isOpen && (
          <span className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-xl bg-dark-bg/90 dark:bg-cream/90 text-cream dark:text-dark-bg text-xs font-mono font-bold shadow-layered opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ✨ Ask Aether AI
          </span>
        )}
      </motion.button>
    </div>
  );
};
