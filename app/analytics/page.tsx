'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from 'recharts';
import {
  Navigation, IndianRupee, Leaf, Clock, Train, Bus, Car,
  Footprints, Recycle, TrendingDown, Trophy, Flame,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/eco/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoTrips, demoExpenses } from '@/lib/eco-data';

const monthlyDistance = [
  { month: 'Apr', distance: 180, cost: 1200, co2: 12.5 },
  { month: 'May', distance: 210, cost: 1450, co2: 14.2 },
  { month: 'Jun', distance: 195, cost: 1100, co2: 11.8 },
  { month: 'Jul', distance: 240, cost: 1650, co2: 15.1 },
  { month: 'Aug', distance: 220, cost: 1380, co2: 13.6 },
  { month: 'Sep', distance: 242, cost: 1545, co2: 14.8 },
];

const transportUsage = [
  { name: 'Metro', value: 4, color: 'hsl(262 70% 56%)' },
  { name: 'Bus', value: 1, color: 'hsl(24 90% 50%)' },
  { name: 'Cab', value: 1, color: 'hsl(42 90% 50%)' },
  { name: 'Auto', value: 1, color: 'hsl(158 80% 40%)' },
];

const expenseVsActual = [
  { trip: 'DU→Noida', estimated: 40, actual: 40 },
  { trip: 'RC→Gurgaon', estimated: 60, actual: 65 },
  { trip: 'CP→Saket', estimated: 100, actual: 120 },
  { trip: 'AV→RC', estimated: 50, actual: 50 },
  { trip: 'Saket→Airport', estimated: 350, actual: 380 },
  { trip: 'KB→Lajpat', estimated: 25, actual: 25 },
];

export default function AnalyticsPage() {
  const totalDistance = demoTrips.reduce((s, t) => s + t.distanceKm, 0);
  const totalCost = demoTrips.reduce((s, t) => s + t.fare, 0);
  const totalCo2 = demoTrips.reduce((s, t) => s + t.co2Kg, 0);
  const totalTime = demoTrips.reduce((s, t) => s + t.durationMin, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Travel Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your travel patterns, spending and environmental impact
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={Navigation} label="Total Distance" value={`${totalDistance.toFixed(1)} km`} delay={0} color="text-cyan-500" />
          <StatCard icon={IndianRupee} label="Total Spend" value={`₹${totalCost}`} delay={0.1} color="text-amber-500" />
          <StatCard icon={Leaf} label="Total CO₂" value={`${totalCo2.toFixed(1)} kg`} delay={0.2} color="text-emerald-500" />
          <StatCard icon={Clock} label="Travel Time" value={`${Math.floor(totalTime / 60)}h ${totalTime % 60}m`} delay={0.3} color="text-blue-500" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly distance chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Monthly Distance & Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyDistance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <RTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="distance" fill="hsl(158 80% 40%)" radius={[4, 4, 0, 0]} name="Distance (km)" />
                    <Bar dataKey="cost" fill="hsl(188 90% 45%)" radius={[4, 4, 0, 0]} name="Cost (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transport usage pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Transport Mode Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={transportUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {transportUsage.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* CO₂ trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" /> CO₂ Emissions Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyDistance}>
                    <defs>
                      <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(158 80% 40%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(158 80% 40%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <RTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="co2"
                      stroke="hsl(158 80% 40%)"
                      strokeWidth={2}
                      fill="url(#co2Grad)"
                      name="CO₂ (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estimated vs actual */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Estimated vs Actual Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={expenseVsActual}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="trip" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <RTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="estimated" fill="hsl(188 90% 50%)" radius={[4, 4, 0, 0]} name="Estimated (₹)" />
                    <Bar dataKey="actual" fill="hsl(42 90% 50%)" radius={[4, 4, 0, 0]} name="Actual (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Eco achievements */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-eco-gradient text-white border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Recycle className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">This Month</Badge>
                </div>
                <div className="font-display text-3xl font-bold">2.8 kg</div>
                <div className="text-sm opacity-80 mt-1">CO₂ avoided by choosing public transport</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Flame className="h-5 w-5 text-amber-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="font-display text-3xl font-bold">7 days</div>
                <div className="text-sm text-muted-foreground mt-1">Eco travel streak — keep it going!</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                    <Trophy className="h-5 w-5 text-violet-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Eco Score</Badge>
                </div>
                <div className="font-display text-3xl font-bold">87</div>
                <div className="text-sm text-muted-foreground mt-1">12% better than last month</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Transport mode breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Transport Mode Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Train, label: 'Metro', trips: 4, distance: 99.4, co2: 3.0, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                { icon: Bus, label: 'Bus', trips: 1, distance: 15.6, co2: 1.2, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { icon: Car, label: 'Cab', trips: 1, distance: 22.1, co2: 4.2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { icon: Footprints, label: 'Walking', trips: 7, distance: 3.5, co2: 0, color: 'text-sky-500', bg: 'bg-sky-500/10' },
              ].map((mode, i) => (
                <motion.div
                  key={mode.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border/40 p-4"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${mode.bg} ${mode.color} mb-3`}>
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold text-sm">{mode.label}</div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Trips</span><span className="font-medium text-foreground">{mode.trips}</span></div>
                    <div className="flex justify-between"><span>Distance</span><span className="font-medium text-foreground">{mode.distance} km</span></div>
                    <div className="flex justify-between"><span>CO₂</span><span className="font-medium text-foreground">{mode.co2} kg</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
