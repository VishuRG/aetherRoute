'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Route as RouteIcon, IndianRupee, Leaf, Clock, TrendingDown,
  ArrowRight, Sparkles, Bell, Navigation, Train, Bus, Car,
  Footprints, Recycle, AlertTriangle, CloudRain, Trophy,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/eco/stat-card';
import { EcoMap } from '@/components/eco/eco-map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { delhiLocations, demoTrips, demoExpenses, demoReports, transportIcons, demoLeaderboard } from '@/lib/eco-data';
import { WeatherWidget } from '@/components/weather-widget';

export default function DashboardPage() {
  const totalExpense = demoExpenses.reduce((s, e) => s + e.amount, 0);
  const totalCo2 = demoTrips.reduce((s, t) => s + t.co2Kg, 0);
  const totalDistance = demoTrips.reduce((s, t) => s + t.distanceKm, 0);
  const totalTime = demoTrips.reduce((s, t) => s + t.durationMin, 0);
  const co2Avoided = demoTrips.reduce((s, t) => s + (t.mode === 'metro' || t.mode === 'bus' ? t.distanceKm * 0.15 : 0), 0);
  const todayTrips = 3;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting}! Let's plan your journey
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's your travel overview for today
            </p>
          </div>
          <Link href="/plan">
            <Button className="bg-eco-gradient text-white hover:opacity-90">
              <RouteIcon className="mr-2 h-4 w-4" /> Plan New Journey
            </Button>
          </Link>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={RouteIcon} label="Today's Trips" value={todayTrips} color="text-emerald-500" delay={0} />
          <StatCard icon={Navigation} label="Distance Today" value="24 km" sublabel="across 3 trips" color="text-cyan-500" delay={0.1} />
          <StatCard icon={IndianRupee} label="Expense Today" value="₹180" sublabel={`${totalExpense} this week`} color="text-amber-500" delay={0.2} />
          <StatCard icon={Leaf} label="CO₂ Today" value="1.4 kg" sublabel="2.8 kg avoided" trend="+12% eco" color="text-emerald-500" delay={0.3} />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { icon: Navigation, label: 'Plan Route', href: '/plan', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
            { icon: IndianRupee, label: 'Add Expense', href: '/expenses', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
            { icon: Sparkles, label: 'AI Assistant', href: '/ai', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
            { icon: Train, label: 'Book Ticket', href: '/tickets', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
            { icon: AlertTriangle, label: 'Report Issue', href: '/community/report', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
            { icon: Leaf, label: 'Eco Score', href: '/analytics', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
          ].map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={action.href}>
                <div className="group rounded-xl border border-border/40 bg-card p-3 text-center transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${action.color} transition-transform group-hover:scale-110`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Live Map — Delhi NCR</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[300px] sm:h-[400px]">
                <EcoMap showAllMarkers from={delhiLocations[0]} to={delhiLocations[4]} highlightRoute />
              </CardContent>
            </Card>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4 text-emerald-500" /> Smart Alerts
                  </CardTitle>
                  <Link href="/notifications" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">View all</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: AlertTriangle, title: 'Accident on NH-48', desc: 'Your regular route is 12 min slower', time: '5 min ago', color: 'text-red-500', bg: 'bg-red-500/10' },
                  { icon: CloudRain, title: 'Live weather feed', desc: 'See full forecast below for travel advice', time: 'Live', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { icon: Train, title: 'Metro delay — Blue Line', desc: 'Expect 8 min delay on Blue Line', time: '35 min ago', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((alert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 rounded-lg border border-border/40 p-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${alert.bg} ${alert.color}`}>
                      <alert.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{alert.time}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Weather Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Weather Forecast</h2>
            <Badge variant="secondary" className="text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" /> Live
            </Badge>
          </div>
          <WeatherWidget locationName="Delhi NCR" />
        </motion.div>

        {/* Recent trips + Weekly summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent trips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Trips</CardTitle>
                  <Link href="/analytics" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">View history</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {demoTrips.slice(0, 5).map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-lg shrink-0">
                      {transportIcons[trip.mode]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="truncate">{trip.fromName}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{trip.toName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{trip.durationMin} min</span>
                        <span>₹{trip.fare}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{trip.co2Kg} kg CO₂</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Eco summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Recycle className="h-4 w-4 text-emerald-500" /> Eco Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-eco-gradient p-4 text-white">
                  <div className="text-xs opacity-80">Your Eco Score</div>
                  <div className="font-display text-3xl font-bold mt-1">87</div>
                  <div className="text-xs opacity-80 mt-1">12% better than last week</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'CO₂ Emitted', value: `${totalCo2.toFixed(1)} kg`, icon: Leaf, color: 'text-emerald-500' },
                    { label: 'CO₂ Avoided', value: `${co2Avoided.toFixed(1)} kg`, icon: Recycle, color: 'text-cyan-500' },
                    { label: 'Total Distance', value: `${totalDistance.toFixed(1)} km`, icon: Navigation, color: 'text-blue-500' },
                    { label: 'Travel Time', value: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`, icon: Clock, color: 'text-amber-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        {stat.label}
                      </div>
                      <span className="text-sm font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingDown className="h-4 w-4" /> Eco Streak: 7 days
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You've chosen eco-friendly transport for 7 consecutive days!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Community reports + Leaderboard preview */}
        <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Community Road Reports</CardTitle>
                <Link href="/community" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="rounded-lg border border-border/40 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{report.type === 'pothole' ? '🟡' : report.type === 'waterlogging' ? '🔵' : report.type === 'accident' ? '🔴' : report.type === 'construction' ? '🟠' : '💡'}</span>
                      <span className="text-sm font-medium capitalize">{report.type}</span>
                      <Badge variant={report.status === 'active' ? 'destructive' : 'secondary'} className="ml-auto text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{report.description}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground/70">
                      <span>{report.location}</span>
                      <span>{report.confirmations} confirms</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" /> Eco Leaderboard
                </CardTitle>
                <Link href="/leaderboard" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {demoLeaderboard.slice(0, 5).map((user, i) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-3 rounded-lg border border-border/40 p-2.5 hover:bg-accent/30 transition-colors"
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    user.rank === 1 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                    user.rank === 2 ? 'bg-slate-400/15 text-slate-600 dark:text-slate-300' :
                    user.rank === 3 ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400' :
                    'bg-muted/50 text-muted-foreground'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-eco-gradient text-white text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.trips} trips · {user.co2Saved}kg CO₂</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold">{user.points.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">pts</div>
                  </div>
                </div>
              ))}
              <Link href="/leaderboard">
                <Button variant="outline" className="w-full mt-2" size="sm">
                  <Trophy className="mr-2 h-4 w-4 text-amber-500" /> See Full Rankings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
