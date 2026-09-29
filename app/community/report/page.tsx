'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, MapPin, FileText, Send } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { delhiLocations, reportTypeMeta } from '@/lib/eco-data';

export default function ReportIssuePage() {
  const router = useRouter();
  const [type, setType] = useState<string>('pothole');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handleSubmit = () => {
    if (!description.trim() || !location) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Report submitted successfully! The community can now see this issue.');
    router.push('/community');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/community')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Report Road Issue</h1>
            <p className="mt-1 text-sm text-muted-foreground">Help the community by reporting road problems</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Issue Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(reportTypeMeta).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.icon} {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {delhiLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>{loc.name} — {loc.area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Photo Evidence</Label>
              <button
                onClick={() => { setPhotoUploaded(true); toast.success('Photo uploaded'); }}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 p-8 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors"
              >
                {photoUploaded ? (
                  <>
                    <FileText className="h-8 w-8 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Photo uploaded</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload a photo</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Your report will be visible to all EcoRoute users. You can also submit this as a civic complaint to government portals.
              </p>
            </div>

            <Button
              className="w-full bg-eco-gradient text-white hover:opacity-90"
              onClick={handleSubmit}
            >
              <Send className="mr-2 h-4 w-4" /> Submit Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
