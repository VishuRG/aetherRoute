'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

const services = ['Maps', 'Routing', 'Weather', 'Transit', 'AI'];

export default function BootAnimation({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [checkedServices, setCheckedServices] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCheckedServices((prev) => {
        if (prev >= services.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[hsl(200_30%_5%)]"
        >
          <div className="absolute inset-0 bg-grid opacity-[0.03]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-gradient shadow-lg"
              >
                <Leaf className="h-7 w-7 text-white" />
              </motion.div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold tracking-tight text-white">
                  Eco
                </span>
                <span className="font-display text-4xl font-bold tracking-tight bg-eco-gradient bg-clip-text text-transparent">
                  Route
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: i * 0.2, duration: 0.4 }}
                  className="flex items-center gap-1"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  {i < 2 && <div className="h-0.5 w-8 bg-emerald-400/40" />}
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-white/40 tracking-wide"
            >
              Initializing Mobility Intelligence...
            </motion.p>

            <div className="mt-4 space-y-1.5">
              {services.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i < checkedServices ? 1 : 0.3, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center justify-between gap-4 text-xs font-mono w-40"
                >
                  <span className="text-white/60">{s}</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i < checkedServices ? 1 : 0 }}
                    className="text-emerald-400"
                  >
                    {i < checkedServices ? '✓' : '...'}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: checkedServices >= services.length ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                setVisible(false);
                setTimeout(onComplete, 400);
              }}
              className="mt-8 rounded-full border border-white/20 px-6 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              ENTER ECOROUTE
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
