'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Award, Leaf, TrendingUp, Crown, Star, Zap,
  ArrowUp, ArrowDown, Minus, Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { demoLeaderboard, LeaderboardUser } from '@/lib/eco-data';

const podiumStyles = [
  { bg: 'from-amber-400 to-yellow-600', ring: 'ring-amber-400/40', icon: Crown, label: '1st' },
  { bg: 'from-slate-300 to-slate-500', ring: 'ring-slate-400/40', icon: Medal, label: '2nd' },
  { bg: 'from-orange-400 to-amber-700', ring: 'ring-orange-400/40', icon: Award, label: '3rd' },
];

const trendIcons: Record<string, { icon: typeof ArrowUp; color: string }> = {
  up: { icon: ArrowUp, color: 'text-emerald-500' },
  down: { icon: ArrowDown, color: 'text-red-500' },
  same: { icon: Minus, color: 'text-muted-foreground' },
};

const demoTrends: Record<number, 'up' | 'down' | 'same'> = {
  1: 'same', 2: 'up', 3: 'up', 4: 'down', 5: 'up', 6: 'same', 7: 'down', 8: 'up',
};

const demoBadges = [
  { icon: Leaf, label: 'Eco Warrior', desc: 'Saved 40+ kg CO₂', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { icon: Zap, label: 'Streak Master', desc: '7-day eco streak', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { icon: Star, label: 'Top 5%', desc: 'Among best travellers', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  { icon: TrendingUp, label: 'Rising Star', desc: '+15% this week', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
];

const timeFilters = ['This Week', 'This Month', 'All Time'] as const;

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<typeof timeFilters[number]>('This Week');

  const currentUser = {
    rank: 5,
    name: 'You',
    points: 4760,
    trips: 87,
    co2Saved: 24.3,
    avatar: 'YO',
  };

  const top3 = demoLeaderboard.slice(0, 3);
  const rest = demoLeaderboard.slice(3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" /> Eco Leaderboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Compete with fellow travellers and climb the ranks
            </p>
          </div>
          {/* Time filter */}
          <div className="flex gap-1 rounded-lg border border-border/40 bg-card/50 p-1">
            {timeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === f
                    ? 'bg-eco-gradient text-white'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Your rank card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="overflow-hidden border-emerald-500/20">
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-5 text-white">
              <div className="absolute inset-0 bg-grid opacity-[0.06]" />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-xl font-bold">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-70">Your Rank</div>
                    <div className="font-display text-3xl font-bold">#{currentUser.rank}</div>
                    <div className="text-xs opacity-80 mt-0.5">{currentUser.points.toLocaleString()} eco points</div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs">
                    <Leaf className="h-3 w-3" /> {currentUser.co2Saved} kg CO₂ saved
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs">
                    <TrendingUp className="h-3 w-3" /> {currentUser.trips} eco trips
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Podium — top 3 */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {top3.map((user, i) => {
            const style = podiumStyles[i];
            const PodiumIcon = style.icon;
            return (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
                className={cn(
                  'flex flex-col items-center',
                  i === 0 && 'sm:-mt-2'
                )}
              >
                <Card className={cn(
                  'w-full overflow-hidden ring-2 transition-shadow hover:shadow-lg',
                  style.ring,
                  i === 0 && 'sm:scale-105'
                )}>
                  <CardContent className="flex flex-col items-center p-4 sm:p-5">
                    {/* Avatar with medal */}
                    <div className="relative mb-3">
                      <div className={cn(
                        'flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br text-white font-bold text-lg sm:text-xl',
                        style.bg
                      )}>
                        {user.avatar}
                      </div>
                      <div className={cn(
                        'absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md',
                        style.bg
                      )}>
                        <PodiumIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-center truncate w-full">{user.name}</div>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      <span className="text-xs font-semibold">{user.points.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Leaf className="h-3 w-3" />{user.co2Saved}kg</span>
                      <span>·</span>
                      <span>{user.trips} trips</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Rankings table — rest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" /> Full Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_80px_60px] gap-3 border-b border-border/40 px-5 py-2 text-xs font-medium text-muted-foreground">
                <span>Rank</span>
                <span>Traveller</span>
                <span className="text-right">Points</span>
                <span className="text-right">Trips</span>
                <span className="text-right">CO₂ Saved</span>
                <span className="text-center">Trend</span>
              </div>
              <div className="divide-y divide-border/30">
                {rest.map((user, i) => {
                  const trend = demoTrends[user.rank] ?? 'same';
                  const TrendIcon = trendIcons[trend].icon;
                  return (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[60px_1fr_100px_80px_80px_60px] gap-3 items-center px-4 sm:px-5 py-3 hover:bg-accent/30 transition-colors"
                    >
                      {/* Rank */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-sm font-bold">
                        {user.rank}
                      </div>
                      {/* Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eco-gradient text-white text-xs font-bold">
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{user.name}</div>
                          <div className="sm:hidden text-xs text-muted-foreground">
                            {user.points.toLocaleString()} pts · {user.co2Saved}kg CO₂
                          </div>
                        </div>
                      </div>
                      {/* Points (desktop) */}
                      <div className="hidden sm:block text-right text-sm font-semibold">
                        {user.points.toLocaleString()}
                      </div>
                      {/* Trips (desktop) */}
                      <div className="hidden sm:block text-right text-sm text-muted-foreground">
                        {user.trips}
                      </div>
                      {/* CO₂ (desktop) */}
                      <div className="hidden sm:flex items-center justify-end gap-1 text-sm">
                        <Leaf className="h-3 w-3 text-emerald-500" />
                        <span>{user.co2Saved}</span>
                      </div>
                      {/* Trend (desktop) */}
                      <div className={cn('hidden sm:flex items-center justify-center', trendIcons[trend].color)}>
                        <TrendIcon className="h-4 w-4" />
                      </div>
                    </motion.div>
                  );
                })}

                {/* Current user row highlighted */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[60px_1fr_100px_80px_80px_60px] gap-3 items-center px-4 sm:px-5 py-3 bg-emerald-500/5 border-l-2 border-emerald-500"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {currentUser.rank}
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                      {currentUser.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">You</div>
                      <div className="sm:hidden text-xs text-muted-foreground">
                        {currentUser.points.toLocaleString()} pts · {currentUser.co2Saved}kg CO₂
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right text-sm font-semibold">
                    {currentUser.points.toLocaleString()}
                  </div>
                  <div className="hidden sm:block text-right text-sm text-muted-foreground">
                    {currentUser.trips}
                  </div>
                  <div className="hidden sm:flex items-center justify-end gap-1 text-sm">
                    <Leaf className="h-3 w-3 text-emerald-500" />
                    <span>{currentUser.co2Saved}</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-emerald-500">
                    <ArrowUp className="h-4 w-4" />
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {demoBadges.map((badge, i) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                    className="flex flex-col items-center text-center rounded-xl border border-border/40 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl mb-2', badge.color)}>
                      <badge.icon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-semibold">{badge.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{badge.desc}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How points work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> How to Earn Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Leaf, label: 'Eco Transport', points: '+50 pts/trip', desc: 'Choose metro, bus, or walk', color: 'text-emerald-500' },
                  { icon: TrendingUp, label: 'Daily Streak', points: '+20 pts/day', desc: 'Travel green consecutively', color: 'text-amber-500' },
                  { icon: Star, label: 'Community Report', points: '+30 pts/report', desc: 'Report road issues & hazards', color: 'text-violet-500' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/40 p-4">
                    <item.icon className={cn('h-5 w-5 mb-2', item.color)} />
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">{item.points}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
