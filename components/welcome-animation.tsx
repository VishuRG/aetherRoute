'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

export default function WelcomeAnimation({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 700);
    }, 3400);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center overflow-hidden bg-[hsl(165_84%_8%)]"
        >
          {/* Ambient gradient orbs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/20 blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
            className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px]"
          />

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-grid opacity-[0.02]" />

          {/* Thin top progress line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 3.2, ease: 'easeInOut' }}
            className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500"
          />

          {/* Main content */}
          <div className="relative flex flex-col items-center">
            {/* Logo mark — elegant ring with leaf */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.15 }}
              className="relative mb-8"
            >
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 rounded-full border border-emerald-400/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-8 rounded-full border border-teal-400/10"
              />

              {/* Logo disc */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.3 }}
                >
                  <Leaf className="h-10 w-10 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Namaste — elegant typography */}
            <motion.div
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
                Namaste
              </h1>
            </motion.div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6, ease: 'easeOut' }}
              className="mt-5 h-px w-24 origin-center bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
            />

            {/* Welcome to EcoRoute */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-5 flex flex-col items-center gap-2"
            >
              <p className="text-sm font-light tracking-[0.3em] uppercase text-white/50">
                Welcome to
              </p>
              <div className="flex items-baseline gap-0.5">
                <span className="font-display text-3xl font-bold tracking-tight text-white">
                  Eco
                </span>
                <span className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Route
                </span>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="mt-6 text-sm font-light tracking-wide text-white/40"
            >
              Travel Smarter. Travel Greener.
            </motion.p>

            {/* Minimal loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mt-8 flex items-center gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400/70"
                />
              ))}
            </motion.div>
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            onClick={() => {
              setVisible(false);
              setTimeout(onComplete, 400);
            }}
            className="absolute bottom-8 right-8 text-xs font-light tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
