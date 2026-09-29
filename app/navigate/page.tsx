'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation, MapPin, ArrowLeft, ArrowRight, ArrowUp,
  CornerUpRight, CornerUpLeft, Flag, CheckCircle2,
  Clock, IndianRupee, Leaf, Volume2, Pause, Play,
  Layers, Share2, LocateFixed, Radio,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  delhiLocations, generateRoutes, generateStreetSegments,
  transportIcons, trafficColors, StreetSegment,
} from '@/lib/eco-data';
import { cn } from '@/lib/utils';
import { useGeoLocation } from '@/hooks/use-geolocation';
import { WeatherWidget } from '@/components/weather-widget';
import { EcoMap } from '@/components/eco/eco-map';

type NavInstruction = {
  id: number;
  icon: typeof ArrowLeft;
  text: string;
  street: string;
  distance: string;
  isStart?: boolean;
  isEnd?: boolean;
};

function buildInstructions(segments: StreetSegment[], fromName: string, toName: string): NavInstruction[] {
  const icons = [ArrowUp, ArrowRight, ArrowLeft, CornerUpRight, CornerUpLeft, ArrowUp];
  const instructions: NavInstruction[] = [];

  instructions.push({
    id: 0,
    icon: Flag,
    text: `Start at ${fromName}`,
    street: fromName,
    distance: '',
    isStart: true,
  });

  segments.forEach((seg, i) => {
    instructions.push({
      id: i + 1,
      icon: icons[i % icons.length],
      text: i === segments.length - 1
        ? `Continue onto ${seg.name} toward ${toName}`
        : `Turn onto ${seg.name}`,
      street: seg.name,
      distance: `${seg.distanceKm} km`,
    });
  });

  instructions.push({
    id: segments.length + 1,
    icon: CheckCircle2,
    text: `Arrive at ${toName}`,
    street: toName,
    distance: '',
    isEnd: true,
  });

  return instructions;
}

export default function NavigationPage() {
  const [fromLoc] = useState(delhiLocations[0]);
  const [toLoc] = useState(delhiLocations[4]);
  const [activeStep, setActiveStep] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const geo = useGeoLocation();

  const routes = useMemo(() => generateRoutes(fromLoc.id, toLoc.id), [fromLoc, toLoc]);
  const selectedRoute = routes[0];
  const streetSegments = useMemo(() => generateStreetSegments(fromLoc.id, toLoc.id), [fromLoc, toLoc]);
  const instructions = useMemo(() => buildInstructions(streetSegments, fromLoc.name, toLoc.name), [streetSegments, fromLoc, toLoc]);

  const handleStart = () => {
    setNavigating(true);
    setActiveStep(0);
    geo.start();
    toast.success('Navigation started — tracking your live location');
  };

  const handleNext = () => {
    if (activeStep < instructions.length - 1) {
      setActiveStep(activeStep + 1);
      if (voiceOn) {
        toast.info(`Voice: ${instructions[activeStep + 1].text}`, { description: 'Spoken navigation — Demo' });
      }
    } else {
      setNavigating(false);
      toast.success('You have arrived at your destination!');
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleStop = () => {
    setNavigating(false);
    setActiveStep(0);
    geo.stop();
    toast.info('Navigation stopped — location tracking off');
  };

  const handleShareLocation = useCallback(async () => {
    if (!geo.lat || !geo.lng) {
      toast.error('Enable location sharing first to share your position');
      return;
    }
    const link = `${window.location.origin}/navigate?lat=${geo.lat.toFixed(6)}&lng=${geo.lng.toFixed(6)}&to=${encodeURIComponent(toLoc.name)}`;
    setShareLink(link);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My EcoRoute location', text: `Track my live location on EcoRoute`, url: link });
        toast.success('Location shared');
      } else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('Share link copied to clipboard');
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      toast.error('Could not share location');
    }
  }, [geo.lat, geo.lng, toLoc.name]);

  const handleEnableLocation = () => {
    geo.start();
    if (geo.error) toast.error(geo.error);
    else toast.success('Live location tracking enabled');
  };

  const toggleVoice = () => {
    setVoiceOn(!voiceOn);
    toast.success(voiceOn ? 'Voice navigation off' : 'Voice navigation on — Demo Mode');
  };

  const currentInstruction = instructions[activeStep];
  const progress = Math.round((activeStep / (instructions.length - 1)) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
              <Navigation className="h-6 w-6 text-emerald-500" /> Turn-by-Turn Navigation
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {fromLoc.name} → {toLoc.name}
            </p>
          </div>
          {navigating && (
            <Button variant="outline" size="sm" onClick={handleStop}>
              Stop Navigation
            </Button>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          {/* Map area */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 h-[400px] sm:h-[500px]">
              <EcoMap
                from={fromLoc}
                to={toLoc}
                showAllMarkers={false}
                highlightRoute
              />

              {/* Overlay info badges on top of the map */}
              <div className="absolute left-4 top-4 z-[500] flex flex-col gap-2">
                <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                  <Layers className="h-3 w-3 mr-1" /> {selectedRoute?.totalDistanceKm} km
                </Badge>
                <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                  <Clock className="h-3 w-3 mr-1" /> {selectedRoute?.totalTimeMin} min
                </Badge>
              </div>

              {/* Live position indicator overlay */}
              {navigating && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute z-[500]"
                  style={{
                    left: `${15 + (progress * 0.7)}%`,
                    top: `${75 - (progress * 0.55)}%`,
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/30" />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                      <Navigation className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Navigation panel */}
          <div className="space-y-4">
            {/* Current instruction */}
            <AnimatePresence mode="wait">
              {navigating ? (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-emerald-500/30">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500"
                        >
                          <currentInstruction.icon className="h-7 w-7" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">
                            Step {activeStep + 1} of {instructions.length}
                          </div>
                          <div className="font-display text-lg font-bold leading-tight">
                            {currentInstruction.text}
                          </div>
                          {currentInstruction.distance && (
                            <div className="text-sm text-muted-foreground mt-0.5">
                              Continue for {currentInstruction.distance}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full rounded-full bg-eco-gradient"
                          />
                        </div>
                      </div>

                      {/* Route stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { icon: Clock, label: 'ETA', value: `${Math.max(1, selectedRoute.totalTimeMin - Math.round(progress * selectedRoute.totalTimeMin / 100))} min` },
                          { icon: IndianRupee, label: 'Fare', value: `₹${selectedRoute.totalFare}` },
                          { icon: Leaf, label: 'CO₂', value: `${selectedRoute.totalCo2Kg} kg` },
                        ].map((stat) => (
                          <div key={stat.label} className="rounded-lg border border-border/40 p-2 text-center">
                            <stat.icon className="h-3.5 w-3.5 text-emerald-500 mx-auto mb-1" />
                            <div className="font-semibold text-sm">{stat.value}</div>
                            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrev} disabled={activeStep === 0} className="flex-1">
                          <ArrowLeft className="h-4 w-4" /> Prev
                        </Button>
                        <Button size="sm" onClick={handleNext} className="flex-1 bg-eco-gradient text-white hover:opacity-90">
                          {activeStep === instructions.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>

                      <button
                        onClick={toggleVoice}
                        className={cn(
                          'mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border/40 py-2 text-xs font-medium transition-colors',
                          voiceOn ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground hover:bg-accent'
                        )}
                      >
                        <Volume2 className="h-3.5 w-3.5" /> {voiceOn ? 'Voice On' : 'Voice Off'}
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-eco-gradient text-white"
                      >
                        <Navigation className="h-8 w-8" />
                      </motion.div>
                      <h3 className="font-display text-lg font-bold">Ready to Navigate</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {instructions.length} turn-by-turn directions from {fromLoc.name} to {toLoc.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: Clock, label: 'Time', value: `${selectedRoute.totalTimeMin} min` },
                        { icon: IndianRupee, label: 'Fare', value: `₹${selectedRoute.totalFare}` },
                        { icon: Leaf, label: 'CO₂', value: `${selectedRoute.totalCo2Kg} kg` },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg border border-border/40 p-2 text-center">
                          <stat.icon className="h-3.5 w-3.5 text-emerald-500 mx-auto mb-1" />
                          <div className="font-semibold text-sm">{stat.value}</div>
                          <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-eco-gradient text-white hover:opacity-90 h-11" onClick={handleStart}>
                      <Play className="mr-2 h-5 w-5" /> Start Navigation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>

            {/* All steps list */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-500" /> All Directions
                </h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {instructions.map((inst, i) => {
                    const isActive = navigating && i === activeStep;
                    const isDone = navigating && i < activeStep;
                    return (
                      <motion.div
                        key={inst.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          'flex items-start gap-3 rounded-lg p-2.5 transition-colors',
                          isActive ? 'bg-emerald-500/10 border border-emerald-500/30' : 'hover:bg-accent/30',
                          isDone && 'opacity-50',
                        )}
                      >
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                          isActive ? 'bg-emerald-500 text-white' : isDone ? 'bg-muted text-muted-foreground' : 'bg-muted/50 text-muted-foreground'
                        )}>
                          <inst.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn('text-sm font-medium', isActive && 'text-emerald-600 dark:text-emerald-400')}>
                            {inst.text}
                          </div>
                          {inst.distance && (
                            <div className="text-xs text-muted-foreground">{inst.street} • {inst.distance}</div>
                          )}
                        </div>
                        {isActive && (
                          <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                            Now
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Live Location Sharing */}
            <Card className={cn(geo.watching && 'border-emerald-500/30')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Radio className={cn('h-4 w-4', geo.watching ? 'text-emerald-500 animate-pulse' : 'text-muted-foreground')} />
                    Live Location
                  </h3>
                  <Badge variant={geo.watching ? 'secondary' : 'outline'} className={cn('text-xs', geo.watching && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400')}>
                    {geo.watching ? 'Tracking' : 'Off'}
                  </Badge>
                </div>

                {geo.error ? (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mb-3">
                    <p className="text-xs text-red-500">{geo.error}</p>
                  </div>
                ) : geo.lat !== null ? (
                  <div className="space-y-2 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-border/40 p-2.5">
                        <div className="text-[10px] text-muted-foreground">Latitude</div>
                        <div className="font-mono text-sm font-semibold">{geo.lat.toFixed(5)}</div>
                      </div>
                      <div className="rounded-lg border border-border/40 p-2.5">
                        <div className="text-[10px] text-muted-foreground">Longitude</div>
                        <div className="font-mono text-sm font-semibold">{geo.lng?.toFixed(5)}</div>
                      </div>
                    </div>
                    {geo.accuracy !== null && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <LocateFixed className="h-3.5 w-3.5" /> Accuracy
                        </span>
                        <span className="font-medium">±{Math.round(geo.accuracy)}m</span>
                      </div>
                    )}
                    {geo.speed !== null && geo.speed > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Navigation className="h-3.5 w-3.5" /> Speed
                        </span>
                        <span className="font-medium">{Math.round(geo.speed * 3.6)} km/h</span>
                      </div>
                    )}
                    {geo.heading !== null && geo.heading >= 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <ArrowUp className="h-3.5 w-3.5" /> Heading
                        </span>
                        <span className="font-medium">{Math.round(geo.heading)}°</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mb-3">
                    Enable location sharing to track your real-time position and share it with contacts.
                  </p>
                )}

                <div className="flex gap-2">
                  {!geo.watching ? (
                    <Button size="sm" className="flex-1 bg-eco-gradient text-white hover:opacity-90" onClick={handleEnableLocation}>
                      <LocateFixed className="mr-2 h-3.5 w-3.5" /> Enable
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { geo.stop(); toast.info('Location tracking stopped'); }}>
                      Stop tracking
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!geo.lat}
                    onClick={handleShareLocation}
                  >
                    <Share2 className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Share'}
                  </Button>
                </div>

                {shareLink && copied && (
                  <div className="mt-2 rounded-lg border border-border/40 bg-muted/20 p-2">
                    <p className="text-[10px] text-muted-foreground truncate font-mono">{shareLink}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weather during travel */}
            <WeatherWidget
              lat={geo.lat ?? fromLoc.lat}
              lng={geo.lng ?? fromLoc.lng}
              locationName={geo.lat ? 'Your location' : fromLoc.name}
              compact
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
