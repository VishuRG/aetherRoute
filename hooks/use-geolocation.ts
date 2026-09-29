'use client';

import { useState, useEffect, useCallback } from 'react';

interface GeoLocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  error: string | null;
  loading: boolean;
  watching: boolean;
}

export function useGeoLocation() {
  const [state, setState] = useState<GeoLocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    heading: null,
    speed: null,
    error: null,
    loading: false,
    watching: false,
  });

  const watchIdRef = useState<number | null>(null);

  const start = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your device' }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          error: null,
          loading: false,
          watching: true,
        });
      },
      (err) => {
        let message = 'Unable to get your location';
        if (err.code === err.PERMISSION_DENIED) message = 'Location permission denied. Please enable it in your browser settings.';
        else if (err.code === err.POSITION_UNAVAILABLE) message = 'Location information is unavailable.';
        else if (err.code === err.TIMEOUT) message = 'Location request timed out.';
        setState((s) => ({ ...s, error: message, loading: false, watching: false }));
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    (watchIdRef as any).current = id;
  }, []);

  const stop = useCallback(() => {
    if ((watchIdRef as any).current !== null) {
      navigator.geolocation.clearWatch((watchIdRef as any).current);
      (watchIdRef as any).current = null;
    }
    setState((s) => ({ ...s, watching: false }));
  }, []);

  useEffect(() => {
    return () => {
      if ((watchIdRef as any).current !== null) {
        navigator.geolocation.clearWatch((watchIdRef as any).current);
      }
    };
  }, []);

  return { ...state, start, stop };
}
