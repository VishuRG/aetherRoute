'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Phone, Hospital, Building2, Flame, Pill, MapPin,
  Siren, Navigation, Share2, AlertTriangle, CheckCircle2,
  Clock, Ambulance, Send, Car, Users, Heart, Zap,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EcoMap } from '@/components/eco/eco-map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type EmergencyMode = 'idle' | 'accident' | 'ambulance';

const emergencyNumbers = [
  { label: 'Police', number: '100', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Ambulance', number: '102', icon: Ambulance, color: 'text-red-500', bg: 'bg-red-500/10' },
  { label: 'Fire', number: '101', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { label: 'Emergency', number: '112', icon: Siren, color: 'text-red-600', bg: 'bg-red-600/10' },
];

const nearbyServices = [
  { type: 'Hospital', name: 'AIIMS Delhi', distance: '2.3 km', icon: Hospital, color: 'text-red-500', bg: 'bg-red-500/10' },
  { type: 'Hospital', name: 'Safdarjung Hospital', distance: '3.1 km', icon: Hospital, color: 'text-red-500', bg: 'bg-red-500/10' },
  { type: 'Police Station', name: 'Connaught Place PS', distance: '1.2 km', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { type: 'Fire Station', name: 'Central Fire Station', distance: '4.5 km', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { type: 'Pharmacy', name: 'Apollo Pharmacy', distance: '0.8 km', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { type: 'Pharmacy', name: 'MedPlus Store', distance: '1.1 km', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

export default function EmergencyPage() {
  const [mode, setMode] = useState<EmergencyMode>('idle');
  const [status, setStatus] = useState<'idle' | 'requested' | 'accepted' | 'on_the_way' | 'arrived'>('idle');

  const handleCall = (number: string, label: string) => {
    toast.success(`Initiating call to ${label} (${number})...`, {
      description: 'Demo Mode — no actual call will be placed',
    });
  };

  const handleModeSelect = (selected: EmergencyMode) => {
    setMode(selected);
    setStatus('requested');
    toast.info(selected === 'accident' ? 'Accident emergency alert sent — Demo Mode' : 'Ambulance request sent — Demo Mode');

    setTimeout(() => { setStatus('accepted'); toast.success(selected === 'accident' ? 'Emergency team notified and dispatched' : 'Ambulance request accepted'); }, 2000);
    setTimeout(() => { setStatus('on_the_way'); toast.info(selected === 'accident' ? 'Emergency team is on the way' : 'Ambulance is on the way'); }, 4000);
    setTimeout(() => { setStatus('arrived'); toast.success(selected === 'accident' ? 'Emergency team has arrived at the scene' : 'Ambulance has arrived at your location'); }, 7000);
  };

  const handleReset = () => {
    setMode('idle');
    setStatus('idle');
  };

  const handleShareLocation = () => {
    toast.success('Live location sharing link generated', {
      description: 'Temporary link expires in 2 hours',
    });
  };

  const statusSteps = mode === 'accident'
    ? [
        { key: 'requested', label: 'Accident Alert Sent', icon: AlertTriangle },
        { key: 'accepted', label: 'Emergency Team Dispatched', icon: Siren },
        { key: 'on_the_way', label: 'Team On The Way', icon: Car },
        { key: 'arrived', label: 'Team Arrived At Scene', icon: CheckCircle2 },
      ]
    : [
        { key: 'requested', label: 'Request Sent', icon: Send },
        { key: 'accepted', label: 'Request Accepted', icon: CheckCircle2 },
        { key: 'on_the_way', label: 'Ambulance On The Way', icon: Ambulance },
        { key: 'arrived', label: 'Ambulance Arrived', icon: Hospital },
      ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" /> Emergency & Safety
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Quick access to emergency services and safety features</p>
        </div>

        {/* Emergency call buttons */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {emergencyNumbers.map((num, i) => (
            <motion.button
              key={num.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleCall(num.number, num.label)}
              className="group rounded-xl border border-border/40 bg-card p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${num.bg} ${num.color} transition-transform group-hover:scale-110`}>
                <num.icon className="h-6 w-6" />
              </div>
              <div className="font-semibold text-sm">{num.label}</div>
              <div className="font-display text-lg font-bold mt-0.5">{num.number}</div>
            </motion.button>
          ))}
        </div>

        {/* Emergency Mode Selector */}
        <AnimatePresence mode="wait">
          {mode === 'idle' ? (
            <motion.div
              key="mode-selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-red-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Siren className="h-5 w-5 text-red-500" /> Raise Emergency
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Choose the type of emergency to quickly alert the right services</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModeSelect('accident')}
                      className="group relative overflow-hidden rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6 text-left transition-all hover:border-red-500/60 hover:bg-red-500/10"
                    >
                      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-500/10 blur-2xl transition-opacity group-hover:opacity-70" />
                      <div className="relative">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
                          <AlertTriangle className="h-7 w-7" />
                        </div>
                        <h3 className="font-display text-lg font-bold">Report Accident</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Alert emergency services about a road accident. Dispatches nearest team to the scene.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-600 dark:text-red-400">
                            <Zap className="h-3 w-3 mr-1" /> Quick Dispatch
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Users className="h-3 w-3 mr-1" /> Notify Community
                          </Badge>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModeSelect('ambulance')}
                      className="group relative overflow-hidden rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-6 text-left transition-all hover:border-rose-500/60 hover:bg-rose-500/10"
                    >
                      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl transition-opacity group-hover:opacity-70" />
                      <div className="relative">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
                          <Ambulance className="h-7 w-7" />
                        </div>
                        <h3 className="font-display text-lg font-bold">Request Ambulance</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Request an ambulance to your current location. Finds the nearest available medical service.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            <Heart className="h-3 w-3 mr-1" /> Medical Priority
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Clock className="h-3 w-3 mr-1" /> ETA ~8 min
                          </Badge>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="status-tracker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className={mode === 'accident' ? 'border-red-500/30' : 'border-rose-500/30'}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {mode === 'accident' ? (
                        <><AlertTriangle className="h-5 w-5 text-red-500" /> Accident Emergency</>
                      ) : (
                        <><Ambulance className="h-5 w-5 text-rose-500" /> Ambulance Request</>
                      )}
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={handleReset}>Cancel & Reset</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border/40 p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Location</span>
                      <span className="font-medium">Connaught Place, Delhi</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{mode === 'accident' ? 'Nearest Emergency Team' : 'Nearest Hospital'}</span>
                      <span className="font-medium">{mode === 'accident' ? 'CP Fire & Rescue (1.5 km)' : 'AIIMS Delhi (2.3 km)'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ETA</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-emerald-500" /> ~{mode === 'accident' ? '6' : '8'} minutes
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {statusSteps.map((step) => {
                      const statusOrder = ['requested', 'accepted', 'on_the_way', 'arrived'];
                      const currentIdx = statusOrder.indexOf(status);
                      const stepIdx = statusOrder.indexOf(step.key);
                      const isDone = stepIdx <= currentIdx;
                      return (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: isDone ? 1 : 0.4, x: 0 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                            <step.icon className="h-4 w-4" />
                          </div>
                          <span className={`text-sm font-medium ${isDone ? '' : 'text-muted-foreground'}`}>{step.label}</span>
                          {isDone && stepIdx === currentIdx && (
                            <Badge variant="secondary" className="text-xs ml-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Current
                            </Badge>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" onClick={() => handleCall('112', 'Emergency 112')}>
                      <Phone className="mr-2 h-4 w-4" /> Call 112
                    </Button>
                    <Button className="flex-1" onClick={handleShareLocation}>
                      <Share2 className="mr-2 h-4 w-4" /> Share Live Location
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground/60 text-center">
                    Demo Mode — Simulated {mode === 'accident' ? 'accident' : 'ambulance'} emergency flow
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map with emergency services */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" /> Nearby Emergency Services
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
              <EcoMap showAllMarkers />
            </CardContent>
          </Card>

          {/* Quick info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" /> Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Phone, title: 'Call 112 for all emergencies', desc: 'Single emergency number connects to Police, Ambulance & Fire' },
                { icon: Share2, title: 'Share your live location', desc: 'Generate a temporary tracking link for trusted contacts' },
                { icon: AlertTriangle, title: 'Report road hazards', desc: 'Help the community by reporting accidents and road conditions' },
                { icon: Navigation, title: 'Know nearby services', desc: 'Familiarize yourself with the closest hospitals and pharmacies' },
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 rounded-lg border border-border/40 p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500 shrink-0">
                    <tip.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{tip.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tip.desc}</div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Nearby services list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Nearby Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyServices.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-border/40 p-3 hover:shadow-sm transition-shadow"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${service.bg} ${service.color} shrink-0`}>
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{service.name}</div>
                    <div className="text-xs text-muted-foreground">{service.type} • {service.distance}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => toast.info(`Navigating to ${service.name}`)}>
                    <Navigation className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-red-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500 shrink-0">
                <Share2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Share Live Location</div>
                <div className="text-xs text-muted-foreground">Generate a temporary tracking link for trusted contacts</div>
              </div>
              <Button size="sm" onClick={handleShareLocation}>Share</Button>
            </CardContent>
          </Card>
          <Card className="border-amber-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Report Road Hazard</div>
                <div className="text-xs text-muted-foreground">Alert the community about a road condition</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.info('Redirecting to report form')}>Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
