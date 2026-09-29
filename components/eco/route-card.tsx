'use client';

import { motion } from 'framer-motion';
import { Clock, IndianRupee, Leaf, Footprints, ArrowLeftRight, Navigation } from 'lucide-react';
import { RouteOption, transportIcons, trafficColors } from '@/lib/eco-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RouteCardProps {
  route: RouteOption;
  onSelect?: (route: RouteOption) => void;
  selected?: boolean;
  index?: number;
}

export function RouteCard({ route, onSelect, selected, index = 0 }: RouteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onSelect?.(route)}
      className={cn(
        'group cursor-pointer rounded-xl border p-4 transition-all',
        selected
          ? 'border-emerald-500 bg-emerald-500/5 shadow-md'
          : 'border-border/40 bg-card hover:border-emerald-500/40 hover:shadow-sm'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{transportIcons[route.mode]}</span>
          <div>
            <div className="font-semibold text-sm">{route.label}</div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={cn('font-medium', trafficColors[route.trafficLevel])}>
                {route.trafficLevel} traffic
              </span>
            </div>
          </div>
        </div>
        {route.ecoScore > 70 && (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            <Leaf className="h-3 w-3 mr-1" /> Eco {route.ecoScore}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{route.totalTimeMin} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{route.totalFare}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Leaf className="h-4 w-4 text-emerald-500" />
          <span className="font-medium">{route.totalCo2Kg} kg</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{route.totalDistanceKm} km</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Footprints className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{route.totalWalkingM}m walk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{route.totalTransfers} transfer{route.totalTransfers !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {route.isDemo && (
        <div className="mt-3 text-xs text-muted-foreground/60">
          Demo Data — route estimate based on configured fare and emission factors
        </div>
      )}
    </motion.div>
  );
}
