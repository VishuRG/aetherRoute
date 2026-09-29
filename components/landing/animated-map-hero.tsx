'use client';

import { motion } from 'framer-motion';
import { delhiLocations } from '@/lib/eco-data';

export function AnimatedMapHero() {
  const points = delhiLocations.slice(0, 8);
  const routes = [
    { from: 0, to: 4 },
    { from: 1, to: 5 },
    { from: 2, to: 7 },
    { from: 3, to: 6 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl border border-border/40 glass">
      <div className="absolute inset-0 bg-grid opacity-[0.08]" />
      <div className="absolute inset-0 bg-eco-radial" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(158 84% 36%)" />
            <stop offset="100%" stopColor="hsl(188 95% 45%)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {routes.map((route, i) => {
          const from = points[route.from];
          const to = points[route.to];
          const x1 = 40 + (from.lng - 77.0) * 200;
          const y1 = 20 + (28.70 - from.lat) * 200;
          const x2 = 40 + (to.lng - 77.0) * 200;
          const y2 = 20 + (28.70 - to.lat) * 200;
          const mx = (x1 + x2) / 2 + (i % 2 === 0 ? 30 : -30);
          const my = (y1 + y2) / 2 + (i % 2 === 0 ? -20 : 20);

          return (
            <g key={i}>
              <motion.path
                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                stroke="url(#routeGrad)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, delay: i * 0.3 }}
              />
              <motion.circle
                r="3"
                fill="hsl(158 84% 36%)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.3 }}
              >
                <animateMotion
                  dur={`${4 + i}s`}
                  repeatCount="indefinite"
                  path={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                />
              </motion.circle>
            </g>
          );
        })}

        {points.map((p, i) => {
          const x = 40 + (p.lng - 77.0) * 200;
          const y = 20 + (28.70 - p.lat) * 200;
          return (
            <motion.g key={p.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
              <circle cx={x} cy={y} r="4" fill="hsl(158 84% 36%)" opacity="0.8" />
              <circle cx={x} cy={y} r="8" fill="none" stroke="hsl(158 84% 36%)" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="4;12;4" dur="3s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
            </motion.g>
          );
        })}
      </svg>

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        {['🚇 Metro', '🚌 Bus', '🚕 Cab', '🛺 Auto', '🚶 Walk'].map((label, i) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + i * 0.1 }}
            className="rounded-full glass px-3 py-1 text-xs font-medium text-foreground/80 border border-border/40"
          >
            {label}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute top-4 right-4 rounded-xl glass px-3 py-2 border border-border/40"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-foreground/80">Live • Delhi NCR</span>
        </div>
      </motion.div>
    </div>
  );
}
