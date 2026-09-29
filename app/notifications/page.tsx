'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, AlertTriangle, CloudRain, Train, CheckCircle2,
  CheckCheck, Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'traffic' | 'transit' | 'weather' | 'accident' | 'hazard' | 'departure' | 'emergency';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  color: string;
  bg: string;
}

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'accident', title: 'Accident on your regular route', message: 'NH-48 near Gurgaon — one lane blocked. Your route is 12 min slower.', time: '5 min ago', read: false, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'n2', type: 'weather', title: 'Rain expected during your journey', message: 'Light rain expected at 3 PM. Consider metro route with less walking.', time: '20 min ago', read: false, icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'n3', type: 'transit', title: 'Metro delay detected', message: 'Blue Line experiencing 8 min delays. Plan accordingly.', time: '35 min ago', read: false, icon: Train, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'n4', type: 'traffic', title: 'Traffic congestion on Ring Road', message: 'Heavy traffic reported near Lajpat Nagar. Consider alternative route.', time: '1 hour ago', read: true, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'n5', type: 'departure', title: 'Departure reminder', message: 'Leave by 8:12 AM to reach office by 9:00 AM via metro.', time: '2 hours ago', read: true, icon: Train, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { id: 'n6', type: 'hazard', title: 'New road report near you', message: 'Pothole reported on Saket Main Road by 12 community members.', time: '3 hours ago', read: true, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleClear = () => {
    setNotifications([]);
    toast.info('All notifications cleared');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="h-6 w-6 text-emerald-500" /> Notifications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
              filter === 'all' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
              filter === 'unread' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !notif.read && handleMarkRead(notif.id)}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors',
                  notif.read ? 'border-border/40 bg-card' : 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
                )}
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0', notif.bg, notif.color)}>
                  <notif.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{notif.title}</span>
                    {!notif.read && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{notif.time}</p>
                </div>
                {notif.read && <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-border/40 p-12 text-center">
              <Bell className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications to show.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
