'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, LayoutDashboard, Route as RouteIcon, Receipt, BarChart3,
  Navigation, Shield, Sparkles, Ticket, Users, Settings, Bell, Menu, X,
  LogOut, Home, Wallet, User as UserIcon, Search, Moon, Sun, Trophy,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plan', label: 'Plan Journey', icon: RouteIcon },
  { href: '/navigate', label: 'Navigate', icon: Navigation },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/emergency', label: 'Safety', icon: Shield },
  { href: '/ai', label: 'AI Assistant', icon: Sparkles },
];

const mobileNav = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/plan', label: 'Plan', icon: RouteIcon },
  { href: '/leaderboard', label: 'Ranks', icon: Trophy },
  { href: '/analytics', label: 'Stats', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border/40 bg-card/30 lg:flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-eco-gradient">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">
              Eco<span className="text-gradient">Route</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-eco-gradient text-white shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-border/40">
            <Link href="/settings" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/settings' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
              <Settings className="h-4 w-4 shrink-0" />
              Settings
            </Link>
          </div>
        </nav>

        <div className="border-t border-border/40 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-eco-gradient text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() ?? 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.email ?? 'demo@ecoroute.in'}</div>
              <button onClick={handleSignOut} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border/40 bg-card lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-eco-gradient">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-display text-lg font-bold">EcoRoute</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active ? 'bg-eco-gradient text-white' : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-border/40 p-3">
                <button onClick={handleSignOut} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent w-full">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative max-w-md flex-1 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search routes, places, expenses..."
                  className="pl-10 h-9 bg-card/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border/40 bg-card shadow-xl p-4 z-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        <Badge variant="secondary" className="text-xs">3 new</Badge>
                      </div>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {[
                          { icon: '⚠️', title: 'Accident on your regular route', time: '5 min ago' },
                          { icon: '🌧️', title: 'Rain expected during your journey', time: '20 min ago' },
                          { icon: '🚇', title: 'Metro delay detected on Blue Line', time: '35 min ago' },
                        ].map((n, i) => (
                          <div key={i} className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent/50">
                            <span className="text-lg">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-muted-foreground">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/profile">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-eco-gradient text-white text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                  {user?.email?.charAt(0).toUpperCase() ?? 'D'}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-6 pb-24 sm:px-6 lg:pb-6 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/40 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {mobileNav.map((item) => {
            const active = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/dashboard'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors ${
                  active ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
