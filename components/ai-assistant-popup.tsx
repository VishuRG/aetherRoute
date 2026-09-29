'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AIAssistantPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('ai-popup-dismissed') === 'true') {
      setDismissed(true);
      return;
    }

    let triggered = false;

    const showTimer = setTimeout(() => {
      if (!triggered) {
        triggered = true;
        setVisible(true);
      }
    }, 15000);

    const handleScroll = () => {
      if (triggered) return;
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        triggered = true;
        setVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('ai-popup-dismissed', 'true');
  };

  const handleTryNow = () => {
    handleClose();
    router.push('/ai');
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-[85] w-[300px] max-w-[calc(100vw-2rem)]"
        >
          <div className="relative flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-card p-3 shadow-2xl">
            <button
              onClick={handleClose}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600"
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>

            <div className="flex-1 min-w-0 pr-4">
              <div className="text-sm font-semibold leading-tight">AI Travel Assistant</div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                Ask anything about routes & fares
              </div>
            </div>

            <button
              onClick={handleTryNow}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-eco-gradient px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Try <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
