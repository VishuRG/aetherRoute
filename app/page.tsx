'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Leaf, ArrowRight, Train, Bus, Car, Navigation,
  TrendingDown, Shield, Sparkles, Route as RouteIcon,
  MapPin, Zap, Recycle, BarChart3, Clock, IndianRupee,
  CloudRain, Accessibility, Bell, MessageSquare, Moon, Sun,
  Trophy, Gift, Crown, Medal, MessageCircle,
  Phone, Mail, ExternalLink, Instagram, Linkedin, Youtube, Headphones,
} from 'lucide-react';
import BootAnimation from '@/components/boot-animation';
import WelcomeAnimation from '@/components/welcome-animation';
import { AnimatedMapHero } from '@/components/landing/animated-map-hero';
import { Button } from '@/components/ui/button';
import { demoLeaderboard } from '@/lib/eco-data';

export default function LandingPage() {
  const [booted, setBooted] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (!booted) {
    return <BootAnimation onComplete={() => setBooted(true)} />;
  }

  if (!welcomed) {
    return <WelcomeAnimation onComplete={() => setWelcomed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 glass border-b border-border/40"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-eco-gradient">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Eco<span className="text-gradient">Route</span>
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
            <Link href="/#sustainability" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sustainability</Link>
            <Link href="/#rewards" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Rewards</Link>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-eco-gradient text-white hover:opacity-90">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute inset-0 bg-eco-radial" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Real-time multimodal travel intelligence for Delhi-NCR
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Travel Smarter.
              <br />
              <span className="text-gradient">Travel Greener.</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              One intelligent platform to compare routes, costs, emissions and
              real-time travel conditions across every mode of transport.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-eco-gradient text-white hover:opacity-90 h-12 px-8 text-base">
                  Plan My Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Explore EcoRoute
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { icon: RouteIcon, label: '7+ transport modes' },
                { icon: Recycle, label: 'CO₂ tracking' },
                { icon: Zap, label: 'Real-time updates' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-emerald-500" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[350px] sm:h-[450px] lg:h-[520px]"
          >
            <AnimatedMapHero />
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border/40 bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4">
          {[
            { value: '15+', label: 'Delhi-NCR locations' },
            { value: '7', label: 'Transport modes compared' },
            { value: '₹0', label: 'Cheapest route finder' },
            { value: '100%', label: 'Eco-score transparency' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to move smarter
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            From route planning to expense tracking, EcoRoute brings every aspect of
            urban travel into one connected platform.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Navigation, title: 'Multimodal Route Planning', desc: 'Compare Metro, Bus, Cab, Auto, Car, Bike and Walking side by side with live traffic and fares.' },
            { icon: Recycle, title: 'CO₂ Emissions Tracking', desc: 'See the carbon footprint of every journey and track your CO₂ savings over time.' },
            { icon: IndianRupee, title: 'Expense Management', desc: 'Log travel costs, upload receipts, and track estimated vs actual spending with OCR.' },
            { icon: Sparkles, title: 'AI Travel Assistant', desc: 'Ask in natural language: "Find the cheapest route to Noida" — get real route results.' },
            { icon: Shield, title: 'Safety & Emergency', desc: 'Find nearby hospitals, police, and pharmacies. One-tap emergency calls and live location sharing.' },
            { icon: CloudRain, title: 'Weather-Aware Travel', desc: 'Get route recommendations based on live weather — less walking during rain, metro when hot.' },
            { icon: TrendingDown, title: 'Smart Analytics', desc: 'Visualize your travel patterns: distance, cost, time, transport mode usage and emissions.' },
            { icon: Bell, title: 'Smart Alerts', desc: 'Traffic, transit delays, weather, road hazards and departure reminders — all in real time.' },
            { icon: Accessibility, title: 'Accessibility Mode', desc: 'Wheelchair-friendly routes, fewer stairs, less walking, and senior-friendly journey options.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border/40 bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-eco-gradient/10 border border-emerald-500/20 transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-border/40 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Search → Compare → Book → Navigate → Analyze
            </h2>
            <p className="mt-3 text-muted-foreground">
              One seamless flow from planning to completion
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-5">
            {[
              { icon: MapPin, step: '1', title: 'Search', desc: 'Enter source & destination' },
              { icon: RouteIcon, step: '2', title: 'Compare', desc: 'View all modes side by side' },
              { icon: IndianRupee, step: '3', title: 'Book & Pay', desc: 'Tickets, cabs, payments' },
              { icon: Navigation, step: '4', title: 'Navigate', desc: 'Live directions & alerts' },
              { icon: BarChart3, step: '5', title: 'Analyze', desc: 'Track expenses & CO₂' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border/40 bg-background p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-eco-gradient text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-emerald-500 mb-1">STEP {item.step}</div>
                <h3 className="font-display font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Recycle className="h-3.5 w-3.5" /> Sustainability
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Every trip has an impact.
              <br />
              <span className="text-gradient">Make it count.</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              EcoRoute calculates the CO₂ emissions of every route option so you can
              choose the greener path. Track your environmental impact over time and
              see how much carbon you've saved by choosing public transport over
              private vehicles.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { icon: Train, value: '0.04', unit: 'kg/km', label: 'Metro' },
                { icon: Bus, value: '0.08', unit: 'kg/km', label: 'Bus' },
                { icon: Car, value: '0.17', unit: 'kg/km', label: 'Car' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/40 bg-card p-4 text-center">
                  <item.icon className="mx-auto h-6 w-6 text-emerald-500 mb-2" />
                  <div className="font-display text-xl font-bold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.unit}</div>
                  <div className="mt-1 text-xs font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl border border-border/40 bg-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg">Eco Score Impact</h3>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">This Month</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Metro trips', value: 12, percent: 70, color: 'bg-violet-500' },
                  { label: 'Bus trips', value: 8, percent: 50, color: 'bg-orange-500' },
                  { label: 'Walking', value: 15, percent: 85, color: 'bg-sky-500' },
                  { label: 'Cab trips', value: 3, percent: 20, color: 'bg-amber-500' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, width: 0 }}
                    whileInView={{ opacity: 1, width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-medium">{stat.value} trips</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${stat.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-eco-gradient p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs opacity-80">CO₂ avoided this month</div>
                    <div className="font-display text-2xl font-bold">2.8 kg</div>
                  </div>
                  <Recycle className="h-10 w-10 opacity-80" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Rewards & Leaderboard */}
      <section id="rewards" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Gift className="h-3.5 w-3.5" /> Rewards Program
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Join our WhatsApp. Climb the leaderboard.
            <br />
            <span className="text-gradient">Win exclusive rewards.</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Top contributors on our community leaderboard win prizes every month. Report road hazards, share eco tips, and help fellow travelers to earn points.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Join card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-8 text-white"
          >
            <div className="absolute inset-0 bg-grid opacity-[0.08]" />
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4"
              >
                <MessageCircle className="h-7 w-7 text-white" />
              </motion.div>
              <h3 className="font-display text-xl font-bold">Join WhatsApp Channel</h3>
              <p className="mt-2 text-sm text-white/80">
                Get real-time travel alerts, eco tips, and route updates. Be part of a growing community of 12,000+ travelers.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Trophy, text: 'Monthly prizes for top 3 contributors' },
                  { icon: Gift, text: 'Exclusive eco-merch for active members' },
                  { icon: Bell, text: 'Instant alerts for your saved routes' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <item.icon className="h-4 w-4 text-amber-300 shrink-0" />
                    <span className="text-white/90">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                className="mt-6 w-full bg-white text-emerald-700 hover:bg-white/90 h-11"
                onClick={() => window.open('https://whatsapp.com/channel/0029Vb92xmxIXnlrRFt0oN1V', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" /> Join Now — It's Free
              </Button>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-3xl border border-border/40 bg-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" /> Top Contributors
                </h3>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  This Month
                </span>
              </div>

              {/* Podium for top 3 */}
              <div className="mb-5 grid grid-cols-3 gap-3">
                {demoLeaderboard.slice(0, 3).map((user, i) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={`rounded-2xl border p-4 text-center ${
                      i === 0
                        ? 'border-amber-500/40 bg-amber-500/5 order-2'
                        : i === 1
                        ? 'border-slate-400/40 bg-slate-400/5 order-1'
                        : 'border-orange-600/40 bg-orange-600/5 order-3'
                    }`}
                  >
                    <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full font-bold text-sm ${
                      i === 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : i === 1 ? 'bg-slate-400/20 text-slate-500'
                      : 'bg-orange-600/20 text-orange-600'
                    }`}>
                      {user.avatar}
                    </div>
                    {i === 0 && <Crown className="mx-auto h-4 w-4 text-amber-500 mb-1" />}
                    <div className="font-medium text-sm truncate">{user.name}</div>
                    <div className="font-display text-lg font-bold mt-1">{user.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </motion.div>
                ))}
              </div>

              {/* Rest of leaderboard */}
              <div className="space-y-2">
                {demoLeaderboard.slice(3).map((user, i) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border border-border/40 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground shrink-0">
                      {user.rank}
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eco-gradient text-white text-xs font-semibold shrink-0">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.trips} trips • {user.co2Saved} kg CO₂ saved</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-sm">{user.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/30 p-3">
                <Medal className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Earn points by reporting road hazards, sharing eco-friendly routes, and helping the community. Top 3 win prizes every month!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EcoRoute Story */}
      <section id="story" className="border-t border-border/40 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Leaf className="h-3.5 w-3.5" /> Our Story
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Why we built EcoRoute
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Delhi moves 60 million people every day. We started EcoRoute to make every one of those journeys smarter, cheaper, and greener.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                phase: 'The Problem',
                icon: TrendingDown,
                title: 'Fragmented Travel',
                desc: 'Delhi has 7+ transport modes with no unified comparison. Commuters waste time and money choosing blindly between metro, bus, cab, auto, and more.',
                stat: '2.5 hrs',
                statLabel: 'avg daily commute',
              },
              {
                phase: 'Our Mission',
                icon: Recycle,
                title: 'One Platform, Every Mode',
                desc: 'EcoRoute unifies all transport options into a single intelligent interface — comparing time, cost, emissions, traffic, and weather in real time.',
                stat: '7 modes',
                statLabel: 'compared instantly',
              },
              {
                phase: 'The Impact',
                icon: Leaf,
                title: 'Greener Cities',
                desc: 'Every metro trip saves 0.13 kg of CO₂ vs a car. By making green choices visible and rewarding, we help reduce urban emissions one trip at a time.',
                stat: '2.8 kg',
                statLabel: 'CO₂ saved per user/month',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative overflow-hidden rounded-2xl border border-border/40 bg-background p-6"
              >
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-500/5 blur-2xl" />
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-gradient text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide text-emerald-500">{item.phase}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className="mt-4 flex items-baseline gap-2 border-t border-border/40 pt-3">
                    <span className="font-display text-2xl font-bold text-gradient">{item.stat}</span>
                    <span className="text-xs text-muted-foreground">{item.statLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: MapPin, label: '15+ locations mapped', sub: 'Across Delhi-NCR' },
              { icon: RouteIcon, label: '50+ route combinations', sub: 'Multimodal journeys' },
              { icon: IndianRupee, label: '₹0 cheapest finder', sub: 'Always free to compare' },
              { icon: Shield, label: 'Safety-first design', sub: 'Emergency support built in' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-card p-4"
              >
                <item.icon className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-card/30 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to travel smarter?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join EcoRoute and start planning efficient, eco-friendly journeys across Delhi-NCR.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-eco-gradient text-white hover:opacity-90 h-12 px-8 text-base">
                Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-eco-gradient">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold">
                  Eco<span className="text-gradient">Route</span>
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Real-time multimodal travel intelligence for Delhi-NCR. Compare routes, save money, and reduce your carbon footprint.
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: MessageCircle, label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029Vb92xmxIXnlrRFt0oN1V' },
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhinav-vishwakarma-av' },
                  { icon: Youtube, label: 'YouTube', href: '#' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-background text-muted-foreground transition-colors hover:border-emerald-500/40 hover:text-emerald-500"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold">Platform</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  { label: 'Route Planner', href: '/plan' },
                  { label: 'AI Assistant', href: '/ai' },
                  { label: 'Expense Tracker', href: '/expenses' },
                  { label: 'Analytics', href: '/analytics' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-foreground">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold">Community</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  { label: 'Report a Hazard', href: '/community/report' },
                  { label: 'Leaderboard', href: '/#rewards' },
                  { label: 'Safety Center', href: '/emergency' },
                  { label: 'Notifications', href: '/notifications' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-foreground">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold">Get in touch</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href="tel:+919718630954" className="transition-colors hover:text-foreground">+91 97186 30954</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href="tel:+919140077178" className="transition-colors hover:text-foreground">+91 91400 77178</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href="mailto:xtremeelitecoderdev@gmail.com" className="transition-colors hover:text-foreground">xtremeelitecoderdev@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href="https://www.linkedin.com/in/abhinav-vishwakarma-av" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">Abhinav Vishwakarma</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} EcoRoute. Travel smarter, travel greener.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/settings" className="transition-colors hover:text-foreground">Settings</Link>
              <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
              <a href="#" className="transition-colors hover:text-foreground">Terms</a>
              <a
                href="https://whatsapp.com/channel/0029Vb92xmxIXnlrRFt0oN1V"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 transition-colors hover:underline"
              >
                WhatsApp <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
