'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Bell, Shield, Moon, Sun, Monitor,
  Leaf, Volume2, Accessibility, Palette,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ThemeOption = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifTraffic, setNotifTraffic] = useState(true);
  const [notifTransit, setNotifTransit] = useState(true);
  const [notifWeather, setNotifWeather] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [voiceNav, setVoiceNav] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [accentColor, setAccentColor] = useState('emerald');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (value: ThemeOption) => {
    setTheme(value);
    toast.success(`Theme changed to ${value}`);
  };

  const handleAccentChange = (value: string) => {
    setAccentColor(value);
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');

    const accents: Record<string, {
      light: { primary: string; ring: string; accent: string; ecoGreen: string; ecoCyan: string; chart1: string };
      dark: { primary: string; ring: string; accent: string; ecoGreen: string; ecoCyan: string; chart1: string };
      swatch: string;
    }> = {
      emerald: {
        light: { primary: '158 84% 24%', ring: '158 84% 24%', accent: '188 95% 40%', ecoGreen: '158 84% 24%', ecoCyan: '188 95% 42%', chart1: '158 84% 30%' },
        dark: { primary: '158 84% 36%', ring: '158 84% 36%', accent: '188 90% 45%', ecoGreen: '158 84% 36%', ecoCyan: '188 90% 48%', chart1: '158 80% 40%' },
        swatch: 'bg-emerald-500',
      },
      teal: {
        light: { primary: '172 80% 22%', ring: '172 80% 22%', accent: '190 90% 38%', ecoGreen: '172 80% 22%', ecoCyan: '190 90% 38%', chart1: '172 80% 28%' },
        dark: { primary: '172 80% 34%', ring: '172 80% 34%', accent: '190 90% 45%', ecoGreen: '172 80% 34%', ecoCyan: '190 90% 45%', chart1: '172 80% 40%' },
        swatch: 'bg-teal-500',
      },
      green: {
        light: { primary: '140 70% 28%', ring: '140 70% 28%', accent: '180 85% 35%', ecoGreen: '140 70% 28%', ecoCyan: '180 85% 35%', chart1: '140 70% 34%' },
        dark: { primary: '140 70% 40%', ring: '140 70% 40%', accent: '180 85% 42%', ecoGreen: '140 70% 40%', ecoCyan: '180 85% 42%', chart1: '140 70% 44%' },
        swatch: 'bg-green-600',
      },
      blue: {
        light: { primary: '210 80% 30%', ring: '210 80% 30%', accent: '200 90% 42%', ecoGreen: '210 80% 30%', ecoCyan: '200 90% 42%', chart1: '210 80% 36%' },
        dark: { primary: '210 80% 42%', ring: '210 80% 42%', accent: '200 90% 50%', ecoGreen: '210 80% 42%', ecoCyan: '200 90% 50%', chart1: '210 80% 48%' },
        swatch: 'bg-blue-500',
      },
      cyan: {
        light: { primary: '190 85% 30%', ring: '190 85% 30%', accent: '195 90% 40%', ecoGreen: '190 85% 30%', ecoCyan: '195 90% 40%', chart1: '190 85% 36%' },
        dark: { primary: '190 85% 42%', ring: '190 85% 42%', accent: '195 90% 50%', ecoGreen: '190 85% 42%', ecoCyan: '195 90% 50%', chart1: '190 85% 48%' },
        swatch: 'bg-cyan-500',
      },
      sky: {
        light: { primary: '200 90% 32%', ring: '200 90% 32%', accent: '205 92% 42%', ecoGreen: '200 90% 32%', ecoCyan: '205 92% 42%', chart1: '200 90% 38%' },
        dark: { primary: '200 90% 44%', ring: '200 90% 44%', accent: '205 92% 52%', ecoGreen: '200 90% 44%', ecoCyan: '205 92% 52%', chart1: '200 90% 50%' },
        swatch: 'bg-sky-500',
      },
      orange: {
        light: { primary: '24 90% 34%', ring: '24 90% 34%', accent: '32 95% 42%', ecoGreen: '24 90% 34%', ecoCyan: '32 95% 42%', chart1: '24 90% 40%' },
        dark: { primary: '24 90% 46%', ring: '24 90% 46%', accent: '32 95% 52%', ecoGreen: '24 90% 46%', ecoCyan: '32 95% 52%', chart1: '24 90% 52%' },
        swatch: 'bg-orange-500',
      },
      rose: {
        light: { primary: '347 80% 34%', ring: '347 80% 34%', accent: '350 85% 42%', ecoGreen: '347 80% 34%', ecoCyan: '350 85% 42%', chart1: '347 80% 40%' },
        dark: { primary: '347 80% 46%', ring: '347 80% 46%', accent: '350 85% 52%', ecoGreen: '347 80% 46%', ecoCyan: '350 85% 52%', chart1: '347 80% 52%' },
        swatch: 'bg-rose-500',
      },
    };

    const accent = accents[value] || accents.emerald;
    const vals = isDark ? accent.dark : accent.light;

    root.style.setProperty('--primary', vals.primary);
    root.style.setProperty('--ring', vals.ring);
    root.style.setProperty('--accent', vals.accent);
    root.style.setProperty('--eco-green', vals.ecoGreen);
    root.style.setProperty('--eco-green-light', vals.ecoGreen);
    root.style.setProperty('--eco-cyan', vals.ecoCyan);
    root.style.setProperty('--chart-1', vals.chart1);

    toast.success(`Accent color changed to ${value}`);
  };

  const handleSave = () => {
    toast.success('Settings saved');
  };

  const themeOptions: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" /> Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Customize your EcoRoute experience</p>
        </div>

        {/* Theme & Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4 text-emerald-500" /> Theme & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Theme Mode</Label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => mounted && handleThemeChange(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                      mounted && theme === opt.value
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                        : 'border-border/40 bg-card hover:bg-accent/30 text-muted-foreground'
                    )}
                  >
                    <opt.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <Select value={accentColor} onValueChange={handleAccentChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="emerald">Emerald Green</SelectItem>
                  <SelectItem value="teal">Teal</SelectItem>
                  <SelectItem value="green">Forest Green</SelectItem>
                  <SelectItem value="blue">Ocean Blue</SelectItem>
                  <SelectItem value="cyan">Cyan</SelectItem>
                  <SelectItem value="sky">Sky Blue</SelectItem>
                  <SelectItem value="orange">Sunset Orange</SelectItem>
                  <SelectItem value="rose">Rose</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { name: 'emerald', color: 'bg-emerald-500' },
                  { name: 'teal', color: 'bg-teal-500' },
                  { name: 'green', color: 'bg-green-600' },
                  { name: 'blue', color: 'bg-blue-500' },
                  { name: 'cyan', color: 'bg-cyan-500' },
                  { name: 'sky', color: 'bg-sky-500' },
                  { name: 'orange', color: 'bg-orange-500' },
                  { name: 'rose', color: 'bg-rose-500' },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleAccentChange(c.name)}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-all',
                      c.color,
                      accentColor === c.name ? 'border-foreground scale-110' : 'border-transparent'
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Reduced Motion</div>
                  <div className="text-xs text-muted-foreground">Minimize animations</div>
                </div>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Voice Navigation</div>
                  <div className="text-xs text-muted-foreground">Spoken turn-by-turn directions</div>
                </div>
              </div>
              <Switch checked={voiceNav} onCheckedChange={setVoiceNav} />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="pa">Punjabi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-500" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Traffic Alerts', desc: 'Get notified about traffic on your routes', value: notifTraffic, setter: setNotifTraffic },
              { label: 'Transit Delays', desc: 'Metro and bus delay notifications', value: notifTransit, setter: setNotifTransit },
              { label: 'Weather Alerts', desc: 'Rain and extreme weather warnings', value: notifWeather, setter: setNotifWeather },
              { label: 'Community Reports', desc: 'New road reports in your area', value: notifCommunity, setter: setNotifCommunity },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Switch checked={item.value} onCheckedChange={item.setter} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" /> System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Demo Mode</div>
                  <div className="text-xs text-muted-foreground">Use simulated data when APIs are unavailable</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Active</Badge>
                <Switch checked={demoMode} onCheckedChange={setDemoMode} />
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Status</span>
                <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">All systems operational</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Database</span>
                <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Connected</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Realtime</span>
                <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-eco-gradient text-white hover:opacity-90 h-11" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </DashboardLayout>
  );
}
