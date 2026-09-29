'use client';

import dynamic from 'next/dynamic';
import type { DelhiLocation } from '@/lib/eco-data';

interface EcoMapProps {
  from?: DelhiLocation;
  to?: DelhiLocation;
  showAllMarkers?: boolean;
  className?: string;
  highlightRoute?: boolean;
}

const EcoMapLeaflet = dynamic(() => import('./eco-map-leaflet'), {
  ssr: false,
  loading: () => (
    <div className="flex w-full h-full items-center justify-center rounded-xl bg-slate-900">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <span className="text-xs text-muted-foreground">Loading live map…</span>
      </div>
    </div>
  ),
});

export function EcoMap(props: EcoMapProps) {
  return <EcoMapLeaflet {...props} />;
}
