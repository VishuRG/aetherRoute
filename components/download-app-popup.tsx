'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DownloadAppPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setVisible(true), 3500);
    return () => window.clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/40 bg-card shadow-2xl"
          >
            <button
              onClick={handleClose}
              aria-label="Close download app popup"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-[0.08]" />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4"
              >
                <Smartphone className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="relative font-display text-2xl font-bold leading-tight">
                EcoRoute App — Coming Soon
              </h2>
              <p className="relative mt-2 text-sm text-white/80">
                We're building a native app so you can plan journeys, track expenses, and get live alerts on the go. Be the first to know when it launches.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {[
                  { icon: '🚇', title: 'Offline Route Planning', desc: 'Access saved routes without internet' },
                  { icon: '⚡', title: 'Instant Push Alerts', desc: 'Real-time transit and traffic notifications' },
                  { icon: '🌱', title: 'Eco Score Tracking', desc: 'Monitor your carbon savings on the go' },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Coming Soon to iOS &amp; Android</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-4 py-3 opacity-60">
                    <Smartphone className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-[10px] text-muted-foreground">Coming to</div>
                      <div className="text-xs font-semibold">App Store</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-4 py-3 opacity-60">
                    <Smartphone className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-[10px] text-muted-foreground">Coming to</div>
                      <div className="text-xs font-semibold">Google Play</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleClose}>
                  Maybe later
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
