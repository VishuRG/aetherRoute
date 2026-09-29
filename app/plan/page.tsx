'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Zap, IndianRupee, Leaf, Footprints,
  ArrowLeftRight, Scale, Navigation, Sparkles, CloudRain,
  Accessibility, AlertTriangle, ArrowRight, CheckCircle2,
  ExternalLink, Car, Star, Route as RoadIcon, TrafficCone, TrendingDown, Clock,
  Bookmark, Trash2, Plus,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EcoMap } from '@/components/eco/eco-map';
import { RouteCard } from '@/components/eco/route-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  delhiLocations, generateRoutes, RouteOption, DelhiLocation,
  transportIcons, trafficColors, cabProviders, calculateCabFare,
  localTransportProviders, calculateLocalFare, buildCabDeepLink,
  generateStreetSegments, StreetSegment,
} from '@/lib/eco-data';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/auth-provider';

interface SavedTrip {
  id: string;
  name: string;
  from_location: string;
  to_location: string;
  from_id: string;
  to_id: string;
  preferred_mode: string | null;
  notes: string | null;
}

type FilterKey = 'fastest' | 'cheapest' | 'greenest' | 'least_walking' | 'fewest_transfers' | 'balanced';

const filters: { key: FilterKey; label: string; icon: typeof Zap }[] = [
  { key: 'fastest', label: 'Fastest', icon: Zap },
  { key: 'cheapest', label: 'Cheapest', icon: IndianRupee },
  { key: 'greenest', label: 'Lower Emission', icon: Leaf },
  { key: 'least_walking', label: 'Less Walking', icon: Footprints },
  { key: 'fewest_transfers', label: 'Fewer Transfers', icon: ArrowLeftRight },
  { key: 'balanced', label: 'Balanced', icon: Scale },
];

const trafficColorsMap: Record<string, string> = {
  low: 'text-emerald-500 bg-emerald-500/10',
  moderate: 'text-amber-500 bg-amber-500/10',
  high: 'text-red-500 bg-red-500/10',
};

export default function PlanPage() {
  const { user } = useAuth();
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [tripName, setTripName] = useState('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromLoc, setFromLoc] = useState<DelhiLocation>(delhiLocations[0]);
  const [toLoc, setToLoc] = useState<DelhiLocation>(delhiLocations[4]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('balanced');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [searching, setSearching] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [maxWalking, setMaxWalking] = useState(1000);
  const [showCabComparison, setShowCabComparison] = useState(false);
  const [showStreetLevel, setShowStreetLevel] = useState(false);

  const routes = useMemo(() => {
    let r = generateRoutes(fromLoc.id, toLoc.id);
    if (showAccessibility) {
      r = r.filter((route) => route.totalWalkingM <= 500);
    }
    r = r.filter((route) => route.totalWalkingM <= maxWalking);

    switch (activeFilter) {
      case 'fastest': return [...r].sort((a, b) => a.totalTimeMin - b.totalTimeMin);
      case 'cheapest': return [...r].sort((a, b) => a.totalFare - b.totalFare);
      case 'greenest': return [...r].sort((a, b) => a.totalCo2Kg - b.totalCo2Kg);
      case 'least_walking': return [...r].sort((a, b) => a.totalWalkingM - b.totalWalkingM);
      case 'fewest_transfers': return [...r].sort((a, b) => a.totalTransfers - b.totalTransfers);
      case 'balanced': return [...r].sort((a, b) => b.ecoScore - a.ecoScore);
      default: return r;
    }
  }, [fromLoc, toLoc, activeFilter, showAccessibility, maxWalking]);

  const cabComparison = useMemo(() => {
    const distance = routes[0]?.totalDistanceKm ?? 10;
    return cabProviders
      .map((p) => ({ ...p, fare: calculateCabFare(p, distance) }))
      .sort((a, b) => a.fare - b.fare);
  }, [routes]);

  const cheapestCab = cabComparison[0];

  const localComparison = useMemo(() => {
    const distance = routes[0]?.totalDistanceKm ?? 10;
    return localTransportProviders
      .map((p) => ({ ...p, fare: calculateLocalFare(p, distance) }))
      .sort((a, b) => a.fare - b.fare);
  }, [routes]);

  const cheapestLocal = localComparison[0];

  const streetSegments = useMemo(() => {
    return generateStreetSegments(fromLoc.id, toLoc.id);
  }, [fromLoc, toLoc]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Failed to load saved trips:', error);
        return;
      }
      setSavedTrips(data ?? []);
    })();
  }, [user]);

  const handleSaveTrip = async () => {
    if (!user) {
      toast.error('Please sign in to save trips');
      return;
    }
    if (!tripName.trim()) {
      toast.error('Please enter a name for this trip');
      return;
    }
    const { data, error } = await supabase
      .from('saved_trips')
      .insert({
        name: tripName.trim(),
        from_location: fromLoc.name,
        to_location: toLoc.name,
        from_id: fromLoc.id,
        to_id: toLoc.id,
        preferred_mode: selectedRoute?.mode ?? null,
      })
      .select()
      .single();
    if (error) {
      toast.error('Failed to save trip');
      return;
    }
    setSavedTrips((prev) => [data, ...prev]);
    setTripName('');
    setShowSaveDialog(false);
    toast.success(`Saved "${data.name}" to your trips`);
  };

  const handleLoadTrip = (trip: SavedTrip) => {
    const from = delhiLocations.find((l) => l.id === trip.from_id);
    const to = delhiLocations.find((l) => l.id === trip.to_id);
    if (from) setFromLoc(from);
    if (to) setToLoc(to);
    toast.success(`Loaded trip: ${trip.name}`);
  };

  const handleDeleteTrip = async (tripId: string, name: string) => {
    const { error } = await supabase.from('saved_trips').delete().eq('id', tripId);
    if (error) {
      toast.error('Failed to delete trip');
      return;
    }
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
    toast.success(`Deleted "${name}"`);
  };

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      toast.success(`Found ${routes.length} routes from ${fromLoc.name} to ${toLoc.name}`);
    }, 1200);
  };

  const handleCabRedirect = (providerName: string, url: string) => {
    toast.success(`Opening ${providerName}...`, {
      description: `Booking ${fromLoc.name} → ${toLoc.name}`,
    });
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 800);
  };

  const fromSuggestions = fromQuery
    ? delhiLocations.filter((l) => l.name.toLowerCase().includes(fromQuery.toLowerCase())).slice(0, 5)
    : [];
  const toSuggestions = toQuery
    ? delhiLocations.filter((l) => l.name.toLowerCase().includes(toQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Plan Your Journey</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search and compare all transport modes across Delhi-NCR
          </p>
        </div>

        {/* Saved Trips */}
        {savedTrips.length > 0 && (
          <Card className="border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-emerald-500" /> Saved Trips
                </h3>
                <Badge variant="secondary" className="text-xs">{savedTrips.length} saved</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {savedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="group flex items-center gap-2 rounded-xl border border-border/40 bg-card px-3 py-2 transition-all hover:shadow-sm"
                  >
                    <button onClick={() => handleLoadTrip(trip)} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{transportIcons[trip.preferred_mode as keyof typeof transportIcons] ?? '🧭'}</span>
                      <div className="text-left">
                        <div className="font-medium text-xs">{trip.name}</div>
                        <div className="text-[10px] text-muted-foreground">{trip.from_location} → {trip.to_location}</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id, trip.name)}
                      className="text-muted-foreground/50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save current trip dialog */}
        <AnimatePresence>
          {showSaveDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowSaveDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-border/40 bg-card p-5 shadow-2xl"
              >
                <h3 className="font-display text-lg font-bold mb-1">Save This Trip</h3>
                <p className="text-sm text-muted-foreground mb-4">{fromLoc.name} → {toLoc.name}</p>
                <Input
                  placeholder="Trip name (e.g. Office Commute)"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTrip()}
                  className="mb-3"
                />
                <div className="flex gap-2">
                  <Button className="flex-1 bg-eco-gradient text-white hover:opacity-90" onClick={handleSaveTrip}>
                    <Plus className="mr-2 h-4 w-4" /> Save Trip
                  </Button>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search bar */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <div className="relative">
                <Label className="text-xs text-muted-foreground">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input
                    placeholder="Current location or search..."
                    value={fromQuery || fromLoc.name}
                    onChange={(e) => { setFromQuery(e.target.value); }}
                    onFocus={() => setFromQuery('')}
                    onBlur={() => setTimeout(() => setFromQuery(''), 200)}
                    className="pl-10"
                  />
                </div>
                {fromSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                    {fromSuggestions.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => { setFromLoc(loc); setFromQuery(''); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left"
                      >
                        <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-medium">{loc.name}</div>
                          <div className="text-xs text-muted-foreground">{loc.area}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <Label className="text-xs text-muted-foreground">To</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search destination..."
                    value={toQuery || toLoc.name}
                    onChange={(e) => setToQuery(e.target.value)}
                    onFocus={() => setToQuery('')}
                    onBlur={() => setTimeout(() => setToQuery(''), 200)}
                    className="pl-10"
                  />
                </div>
                {toSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                    {toSuggestions.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => { setToLoc(loc); setToQuery(''); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left"
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium">{loc.name}</div>
                          <div className="text-xs text-muted-foreground">{loc.area}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-end gap-2">
                <Button
                  onClick={handleSearch}
                  disabled={searching}
                  className="w-full bg-eco-gradient text-white hover:opacity-90 sm:w-auto"
                >
                  {searching ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Search</>}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(true)}
                  className="shrink-0"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Quick select:</span>
              {delhiLocations.slice(0, 6).map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setToLoc(loc)}
                  className="rounded-full border border-border/40 px-3 py-1 text-xs hover:bg-accent transition-colors"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                activeFilter === f.key
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
              )}
            >
              <f.icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Accessibility & extra toggles */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAccessibility(!showAccessibility)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
              showAccessibility
                ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
            )}
          >
            <Accessibility className="h-3.5 w-3.5" /> Accessibility mode
          </button>
          <button
            onClick={() => setShowCabComparison(!showCabComparison)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
              showCabComparison
                ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
            )}
          >
            <Car className="h-3.5 w-3.5" /> Compare Cabs
          </button>
          <button
            onClick={() => setShowStreetLevel(!showStreetLevel)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
              showStreetLevel
                ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
            )}
          >
            <RoadIcon className="h-3.5 w-3.5" /> Street-Level View
          </button>
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400">
            <CloudRain className="h-3.5 w-3.5" /> Rain expected — metro recommended
          </div>
        </div>

        {/* Cab Price Comparison */}
        <AnimatePresence>
          {showCabComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-yellow-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Car className="h-5 w-5 text-yellow-500" /> Cab Price Comparison
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                      {fromLoc.name} → {toLoc.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cabComparison.map((cab, i) => (
                      <motion.div
                        key={cab.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={cn(
                          'rounded-xl border-2 p-4 transition-all',
                          i === 0
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'border-border/40 bg-card'
                        )}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-sm', cab.bgColor)}>
                              {cab.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{cab.name}</div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {cab.rating}
                              </div>
                            </div>
                          </div>
                          {i === 0 && (
                            <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <TrendingDown className="h-3 w-3 mr-1" /> Cheapest
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <div className="font-display text-2xl font-bold">₹{cab.fare}</div>
                            <div className="text-xs text-muted-foreground">
                              {cab.surgeMultiplier > 1 ? (
                                <span className="text-amber-500">Surge {cab.surgeMultiplier}x</span>
                              ) : (
                                <span className="text-emerald-500">No surge</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">ETA</div>
                            <div className="font-medium text-sm flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {cab.eta}
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          size="sm"
                          variant={i === 0 ? 'default' : 'outline'}
                          onClick={() => handleCabRedirect(cab.name, buildCabDeepLink(cab, fromLoc, toLoc))}
                        >
                          Book {cab.name} <ExternalLink className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-lg bg-muted/30 p-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-emerald-500 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{cheapestCab?.name}</span> is the cheapest cab at <span className="font-semibold">₹{cheapestCab?.fare}</span> for this route. You save <span className="font-semibold">₹{(cabComparison[cabComparison.length - 1]?.fare ?? 0) - (cheapestCab?.fare ?? 0)}</span> compared to the most expensive option.
                    </p>
                  </div>

                  {/* Local transport prices */}
                  <div className="mt-4 border-t border-border/40 pt-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span className="text-base">🛺</span> Local Transport Prices
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {localComparison.map((local, i) => (
                        <motion.div
                          key={local.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className={cn(
                            'flex items-center justify-between rounded-xl border p-3 transition-all',
                            i === 0
                              ? 'border-emerald-500/40 bg-emerald-500/5'
                              : 'border-border/40 bg-card'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl shrink-0">{local.icon}</span>
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">{local.name}</div>
                              <div className="text-xs text-muted-foreground">{local.type}</div>
                              {local.nightSurcharge && new Date().getHours() >= 22 && (
                                <div className="text-[10px] text-amber-500 mt-0.5">Night surcharge 1.5x</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className={cn('font-bold text-base', i === 0 && 'text-emerald-600 dark:text-emerald-400')}>
                                ₹{local.fare}
                              </div>
                              {i === 0 && (
                                <div className="text-[10px] text-emerald-500">Cheapest</div>
                              )}
                            </div>
                            {local.webUrl ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2"
                                onClick={() => handleCabRedirect(local.name, local.webUrl)}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <div className="w-8 text-center text-[10px] text-muted-foreground">Hail</div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-3 rounded-lg bg-muted/30 p-3 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-emerald-500 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{cheapestLocal?.name}</span> is the cheapest local option at <span className="font-semibold">₹{cheapestLocal?.fare}</span>. Compare with the cheapest cab <span className="font-semibold">{cheapestCab?.name}</span> at <span className="font-semibold">₹{cheapestCab?.fare}</span> — save <span className="font-semibold">₹{(cheapestCab?.fare ?? 0) - (cheapestLocal?.fare ?? 0)}</span> by going local.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Street-Level View */}
        <AnimatePresence>
          {showStreetLevel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-sky-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <RoadIcon className="h-5 w-5 text-sky-500" /> Street-Level Route Breakdown
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      {streetSegments.length} segments
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {streetSegments.map((seg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 rounded-xl border border-border/40 p-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500 shrink-0 font-bold text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{seg.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {seg.fromPoint} → {seg.toPoint}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{seg.roadType}</span>
                            <span className="text-xs text-muted-foreground">• {seg.distanceKm} km</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', trafficColorsMap[seg.trafficLevel])}>
                            {seg.trafficLevel} traffic
                          </span>
                          {seg.trafficLevel === 'high' && (
                            <div className="flex items-center gap-1 text-xs text-red-500">
                              <TrafficCone className="h-3 w-3" /> Slow
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Navigation className="h-3.5 w-3.5" /> Total Distance
                      </span>
                      <span className="font-semibold">{routes[0]?.totalDistanceKm ?? 0} km</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> High-traffic segments
                      </span>
                      <span className="font-semibold text-amber-500">
                        {streetSegments.filter((s) => s.trafficLevel === 'high').length} of {streetSegments.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main layout: route list + map */}
        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
          {/* Route list */}
          <div className="space-y-3 lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto lg:pr-2">
            {searching ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-border/40 p-4">
                    <div className="shimmer h-6 w-24 rounded mb-3" />
                    <div className="shimmer h-4 w-full rounded mb-2" />
                    <div className="shimmer h-4 w-3/4 rounded" />
                  </div>
                ))}
                <div className="text-center text-sm text-muted-foreground">
                  <div className="animate-pulse">Finding the best routes...</div>
                </div>
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {routes.map((route, i) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      index={i}
                      selected={selectedRoute?.id === route.id}
                      onSelect={(r) => setSelectedRoute(r)}
                    />
                  ))}
                </AnimatePresence>
                {routes.length === 0 && (
                  <div className="rounded-xl border border-border/40 p-8 text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No routes match your filters. Try increasing walking distance or disabling accessibility mode.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map + selected route detail */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0 h-[300px] sm:h-[400px]">
                <EcoMap from={fromLoc} to={toLoc} highlightRoute showAllMarkers />
              </CardContent>
            </Card>

            {selectedRoute && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-2xl">{transportIcons[selectedRoute.mode]}</span>
                        {selectedRoute.label} Route Details
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <Leaf className="h-3 w-3 mr-1" /> Eco {selectedRoute.ecoScore}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { label: 'Time', value: `${selectedRoute.totalTimeMin} min`, icon: Zap },
                        { label: 'Fare', value: `₹${selectedRoute.totalFare}`, icon: IndianRupee },
                        { label: 'CO₂', value: `${selectedRoute.totalCo2Kg} kg`, icon: Leaf },
                        { label: 'Distance', value: `${selectedRoute.totalDistanceKm} km`, icon: Navigation },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg border border-border/40 p-3">
                          <stat.icon className="h-4 w-4 text-emerald-500 mb-1" />
                          <div className="font-semibold text-sm">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-border/40 p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Walking distance</span>
                        <span className="font-medium">{selectedRoute.totalWalkingM}m</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Transfers</span>
                        <span className="font-medium">{selectedRoute.totalTransfers}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Traffic</span>
                        <span className={cn('font-medium', trafficColors[selectedRoute.trafficLevel])}>
                          {selectedRoute.trafficLevel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Local fare estimate</span>
                        <span className="font-medium">₹{selectedRoute.totalFare} — ₹{Math.round(selectedRoute.totalFare * 1.15)}</span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Journey instructions</p>
                      {selectedRoute.segments.map((seg, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm mt-2">
                          <span className="text-lg">{transportIcons[seg.mode]}</span>
                          <div>
                            <p className="font-medium">{seg.label}</p>
                            <p className="text-xs text-muted-foreground">{seg.instructions}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="bg-eco-gradient text-white hover:opacity-90 flex-1"
                        onClick={() => toast.success(`Booked ${selectedRoute.label} ticket for ₹${selectedRoute.totalFare}`)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Book Ticket — ₹{selectedRoute.totalFare}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toast.info('Starting navigation...')}
                      >
                        <Navigation className="mr-2 h-4 w-4" /> Navigate
                      </Button>
                      {selectedRoute.mode === 'cab' && (
                        <Button
                          variant="outline"
                          onClick={() => setShowCabComparison(true)}
                        >
                          <Car className="mr-2 h-4 w-4" /> Compare Cabs
                        </Button>
                      )}
                    </div>

                    {selectedRoute.isDemo && (
                      <p className="text-xs text-muted-foreground/60 text-center">
                        Demo Data — estimates based on configured fares and emission factors
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
