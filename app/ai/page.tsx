'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Mic, Navigation, IndianRupee, Leaf,
  Clock, CloudRain, Train, Bus, Car, User,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  delhiLocations, generateRoutes, transportIcons,
  demoExpenses, demoTrips,
} from '@/lib/eco-data';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  routeCards?: { mode: string; time: number; fare: number; co2: number; label: string }[];
  expenseData?: { total: number; month: string };
  isDemo?: boolean;
}

const suggestedPrompts = [
  'Find the cheapest route to Noida Sector 62',
  'I need to reach office by 9 AM from Delhi University',
  'Find a low-emission route to Gurgaon',
  'How much did I spend on travel this month?',
  'What is the weather like for my commute?',
];

function processQuery(query: string): ChatMessage {
  const lower = query.toLowerCase();

  // Route search
  const findLocation = (text: string) => {
    return delhiLocations.find((l) =>
      l.name.toLowerCase().includes(text) || l.area.toLowerCase().includes(text)
    );
  };

  // Expense query
  if (lower.includes('spend') || lower.includes('expense') || lower.includes('cost') || lower.includes('month')) {
    const total = demoExpenses.reduce((s, e) => s + e.amount, 0);
    return {
      id: Date.now().toString(),
      role: 'ai',
      content: `This month you've spent ₹${total} on travel across ${demoExpenses.length} expense entries. Here's a quick breakdown:\n\n• Metro: ₹150\n• Auto: ₹120\n• Cab: ₹380\n• Bus: ₹25\n• Parking: ₹40\n• Fuel: ₹350\n\nYour highest single expense was ₹380 for a cab to IGI Airport. Consider metro routes where possible to reduce spending.`,
      expenseData: { total, month: 'September 2026' },
      isDemo: true,
    };
  }

  // Route queries
  let fromLoc = delhiLocations[0];
  let toLoc = delhiLocations[4];

  if (lower.includes('cheapest')) {
    const match = delhiLocations.find((l) => lower.includes(l.name.toLowerCase().split(' ')[0]));
    if (match) toLoc = match;
    const routes = generateRoutes(fromLoc.id, toLoc.id).sort((a, b) => a.totalFare - b.totalFare);
    const cheapest = routes[0];
    return {
      id: Date.now().toString(),
      role: 'ai',
      content: `The cheapest route from ${fromLoc.name} to ${toLoc.name} is ${cheapest.label} at ₹${cheapest.totalFare}. It takes ${cheapest.totalTimeMin} minutes with ${cheapest.totalCo2Kg} kg CO₂ emissions.`,
      routeCards: routes.slice(0, 3).map((r) => ({
        mode: r.mode, time: r.totalTimeMin, fare: r.totalFare, co2: r.totalCo2Kg, label: r.label,
      })),
      isDemo: true,
    };
  }

  if (lower.includes('low-emission') || lower.includes('green') || lower.includes('eco')) {
    const match = delhiLocations.find((l) => lower.includes(l.name.toLowerCase().split(' ')[0]));
    if (match) toLoc = match;
    const routes = generateRoutes(fromLoc.id, toLoc.id).sort((a, b) => a.totalCo2Kg - b.totalCo2Kg);
    return {
      id: Date.now().toString(),
      role: 'ai',
      content: `Here are the lowest-emission routes from ${fromLoc.name} to ${toLoc.name}. The ${routes[0].label} produces only ${routes[0].totalCo2Kg} kg CO₂ — that's ${((1 - routes[0].totalCo2Kg / routes[routes.length - 1].totalCo2Kg) * 100).toFixed(0)}% less than the highest-emission option.`,
      routeCards: routes.slice(0, 3).map((r) => ({
        mode: r.mode, time: r.totalTimeMin, fare: r.totalFare, co2: r.totalCo2Kg, label: r.label,
      })),
      isDemo: true,
    };
  }

  if (lower.includes('office') || lower.includes('9 am') || lower.includes('reach by')) {
    return {
      id: Date.now().toString(),
      role: 'ai',
      content: `Based on your usual commute from Delhi University to Noida Sector 62, the metro takes about 42 minutes. To reach by 9:00 AM, I recommend leaving by 8:12 AM. There's currently moderate traffic on the road route, so the metro is your most reliable option today.`,
      routeCards: [
        { mode: 'metro', time: 42, fare: 40, co2: 0.7, label: 'Metro' },
        { mode: 'bus', time: 55, fare: 25, co2: 1.2, label: 'Bus' },
      ],
      isDemo: true,
    };
  }

  if (lower.includes('weather') || lower.includes('rain')) {
    return {
      id: Date.now().toString(),
      role: 'ai',
      content: `Current weather in Delhi-NCR: 29°C with light rain expected in the afternoon. I recommend taking the metro route with only 300m walking, rather than bus routes that involve more outdoor waiting. The rain is expected to clear by 5 PM.`,
      isDemo: true,
    };
  }

  // Default route search
  for (const loc of delhiLocations) {
    if (lower.includes(loc.name.toLowerCase().split(' ')[0])) {
      toLoc = loc;
      break;
    }
  }
  const routes = generateRoutes(fromLoc.id, toLoc.id);
  return {
    id: Date.now().toString(),
    role: 'ai',
    content: `I found ${routes.length} route options from ${fromLoc.name} to ${toLoc.name}. Here are the best options based on time, cost and emissions:`,
    routeCards: routes.slice(0, 4).map((r) => ({
      mode: r.mode, time: r.totalTimeMin, fare: r.totalFare, co2: r.totalCo2Kg, label: r.label,
    })),
    isDemo: true,
  };
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'ai',
      content: "Hi! I'm your EcoRoute AI travel assistant. I can help you find routes, compare costs, check emissions, and analyze your travel spending. Try asking me something!",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (text?: string) => {
    const query = text || input.trim();
    if (!query) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const aiMsg = processQuery(query);
      setTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  const handleVoice = () => {
    setListening(!listening);
    if (!listening) {
      toast.info('Voice input activated — demo mode');
      setTimeout(() => {
        setListening(false);
        setInput('Find the cheapest route to Noida Sector 62');
        toast.success('Voice input received');
      }, 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-130px)]">
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-500" /> AI Travel Assistant
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask about routes, costs, emissions, weather and your travel history
          </p>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-eco-gradient text-white' : 'bg-muted'}`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-eco-gradient text-white' : 'bg-muted/50'}`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>

                    {/* Route cards inside chat */}
                    {msg.routeCards && (
                      <div className="mt-2 space-y-2">
                        {msg.routeCards.map((rc, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 rounded-xl border border-border/40 bg-card p-3"
                          >
                            <span className="text-2xl">{transportIcons[rc.mode as keyof typeof transportIcons]}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{rc.label}</div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {rc.time} min</span>
                                <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {rc.fare}</span>
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Leaf className="h-3 w-3" /> {rc.co2} kg</span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info(`Viewing ${rc.label} route details`)}>
                              View
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Expense data in chat */}
                    {msg.expenseData && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 rounded-xl border border-border/40 bg-card p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <IndianRupee className="h-5 w-5 text-amber-500" />
                          <span className="font-semibold">Expense Summary — {msg.expenseData.month}</span>
                        </div>
                        <div className="font-display text-2xl font-bold">₹{msg.expenseData.total}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total travel spending this month</div>
                      </motion.div>
                    )}

                    {msg.isDemo && (
                      <p className="mt-1 text-xs text-muted-foreground/60">Demo Data — AI responses use simulated route data</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="rounded-2xl bg-muted/50 p-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="h-2 w-2 rounded-full bg-emerald-500"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="border-t border-border/40 p-3">
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-border/40 bg-card px-3 py-1.5 text-xs hover:bg-accent transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border/40 p-3">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleVoice}
                className={listening ? 'bg-red-500/10 text-red-500' : ''}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Ask about routes, expenses, weather..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button
                size="icon"
                className="bg-eco-gradient text-white hover:opacity-90"
                onClick={() => handleSend()}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {listening && (
              <p className="mt-2 text-xs text-center text-muted-foreground animate-pulse">Listening...</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
