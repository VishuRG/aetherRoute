'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Bell, Route, CloudRain, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_LINK = 'https://whatsapp.com/channel/0029Vb92xmxIXnlrRFt0oN1V';

const benefits = [
  { icon: Route, title: 'Route alerts', desc: 'Know before your commute changes' },
  { icon: CloudRain, title: 'Weather updates', desc: 'Plan around rain and traffic' },
  { icon: Leaf, title: 'Eco tips', desc: 'Make every trip count' },
];

export function WhatsAppPopup() {
  const [visible, setVisible] = useState(false);
  const [floatingVisible, setFloatingVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setVisible(false);
    setFloatingVisible(true);
  };

  const joinChannel = () => {
    window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer');
    closePopup();
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={closePopup}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl"
            >
              <button
                type="button"
                onClick={closePopup}
                aria-label="Close WhatsApp channel popup"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-7 text-white sm:p-8">
                <div className="absolute inset-0 bg-grid opacity-[0.08]" />
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                <div className="relative flex items-start gap-4 pr-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <MessageCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
                      <Bell className="h-3 w-3" /> EcoRoute community
                    </div>
                    <h2 className="font-display text-2xl font-bold leading-tight">Join our WhatsApp channel</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">Get useful Delhi-NCR travel alerts, route updates, and eco tips directly on your phone.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-7">
                <div className="grid gap-3 sm:grid-cols-3">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="rounded-2xl border border-border/50 bg-muted/25 p-3">
                      <benefit.icon className="h-5 w-5 text-emerald-500" />
                      <div className="mt-2 text-xs font-semibold">{benefit.title}</div>
                      <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{benefit.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button onClick={joinChannel} className="h-11 flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90">
                    <MessageCircle className="mr-2 h-5 w-5" /> Join WhatsApp channel
                  </Button>
                  <Button variant="outline" className="h-11 sm:px-5" onClick={closePopup}>Maybe later</Button>
                </div>
                <p className="text-center text-[11px] text-muted-foreground">No spam. Leave the channel anytime.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {floatingVisible && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={joinChannel}
            className="fixed bottom-4 left-4 z-[80] flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-white shadow-xl shadow-emerald-500/25"
            aria-label="Join EcoRoute WhatsApp channel"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Join WhatsApp</span>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-background" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
