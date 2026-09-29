'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: string;
  color?: string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, sublabel, trend, color = 'text-emerald-500', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-border/40 bg-card p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50', color)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{trend}</span>
        )}
      </div>
      <div className="font-display text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      {sublabel && <div className="mt-0.5 text-xs text-muted-foreground/70">{sublabel}</div>}
    </motion.div>
  );
}
