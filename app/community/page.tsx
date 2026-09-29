'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, MapPin, ThumbsUp, AlertTriangle, CheckCircle2,
  Filter, Users, ArrowLeft,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EcoMap } from '@/components/eco/eco-map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { demoReports, reportTypeMeta, CommunityReport } from '@/lib/eco-data';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const [reports, setReports] = useState<CommunityReport[]>(demoReports);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? reports : reports.filter((r) => r.type === filter);

  const handleConfirm = (id: string) => {
    setReports(reports.map((r) => r.id === id ? { ...r, confirmations: r.confirmations + 1 } : r));
    toast.success('Report confirmed');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Community Reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">Road hazards and infrastructure issues reported by the community</p>
          </div>
          <Link href="/community/report">
            <Button className="bg-eco-gradient text-white hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" /> Report Issue
            </Button>
          </Link>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 h-[300px]">
            <EcoMap showAllMarkers />
          </CardContent>
        </Card>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              filter === 'all' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
            )}
          >
            <Filter className="h-3.5 w-3.5" /> All
          </button>
          {Object.entries(reportTypeMeta).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                filter === key ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border/40 bg-card text-muted-foreground hover:bg-accent'
              )}
            >
              <span>{meta.icon}</span> {meta.label}
            </button>
          ))}
        </div>

        {/* Reports grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report, i) => {
            const meta = reportTypeMeta[report.type];
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{meta.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{meta.label}</div>
                          <div className="text-xs text-muted-foreground">{report.location}</div>
                        </div>
                      </div>
                      <Badge variant={report.status === 'active' ? 'destructive' : 'secondary'} className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {report.lat.toFixed(2)}, {report.lng.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleConfirm(report.id)}
                        className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <ThumbsUp className="h-3 w-3" /> {report.confirmations}
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground/60">
                      {new Date(report.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
