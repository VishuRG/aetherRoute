'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Sun, Cloud, CloudSnow, CloudLightning, CloudFog, Wind, Droplets, Eye, Thermometer, Loader2 } from 'lucide-react';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  precipitation: number;
  visibility: number;
  cloudCover: number;
  isDay: boolean;
  uvIndex: number;
  hourly: {
    time: string;
    temp: number;
    code: number;
    precipitationProb: number;
  }[];
  daily: {
    date: string;
    tempMax: number;
    tempMin: number;
    code: number;
    precipitationProb: number;
    sunrise: string;
    sunset: string;
  }[];
}

interface WeatherWidgetProps {
  lat?: number;
  lng?: number;
  locationName?: string;
  compact?: boolean;
}

const DELHI_LAT = 28.59;
const DELHI_LNG = 77.22;

function weatherInfo(code: number, isDay: boolean = true) {
  const map: Record<number, { label: string; icon: typeof Sun; color: string }> = {
    0: { label: 'Clear sky', icon: Sun, color: 'text-amber-500' },
    1: { label: 'Mainly clear', icon: Sun, color: 'text-amber-500' },
    2: { label: 'Partly cloudy', icon: Cloud, color: 'text-slate-400' },
    3: { label: 'Overcast', icon: Cloud, color: 'text-slate-400' },
    45: { label: 'Foggy', icon: CloudFog, color: 'text-slate-400' },
    48: { label: 'Rime fog', icon: CloudFog, color: 'text-slate-400' },
    51: { label: 'Light drizzle', icon: CloudRain, color: 'text-blue-500' },
    53: { label: 'Drizzle', icon: CloudRain, color: 'text-blue-500' },
    55: { label: 'Heavy drizzle', icon: CloudRain, color: 'text-blue-500' },
    61: { label: 'Light rain', icon: CloudRain, color: 'text-blue-500' },
    63: { label: 'Rain', icon: CloudRain, color: 'text-blue-500' },
    65: { label: 'Heavy rain', icon: CloudRain, color: 'text-blue-600' },
    71: { label: 'Light snow', icon: CloudSnow, color: 'text-cyan-400' },
    73: { label: 'Snow', icon: CloudSnow, color: 'text-cyan-400' },
    75: { label: 'Heavy snow', icon: CloudSnow, color: 'text-cyan-400' },
    77: { label: 'Snow grains', icon: CloudSnow, color: 'text-cyan-400' },
    80: { label: 'Rain showers', icon: CloudRain, color: 'text-blue-500' },
    81: { label: 'Rain showers', icon: CloudRain, color: 'text-blue-500' },
    82: { label: 'Violent rain', icon: CloudRain, color: 'text-blue-600' },
    85: { label: 'Snow showers', icon: CloudSnow, color: 'text-cyan-400' },
    86: { label: 'Snow showers', icon: CloudSnow, color: 'text-cyan-400' },
    95: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-500' },
    96: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-500' },
    99: { label: 'Heavy thunderstorm', icon: CloudLightning, color: 'text-purple-600' },
  };
  const info = map[code] ?? { label: 'Unknown', icon: Cloud, color: 'text-slate-400' };
  if (code === 0 || code === 1 || code === 2) {
    if (!isDay) info.icon = Cloud;
  }
  return info;
}

function travelAdvice(data: WeatherData): { text: string; icon: typeof Sun; color: string } {
  const info = weatherInfo(data.weatherCode, data.isDay);
  if (data.precipitation > 5 || [61, 63, 65, 80, 81, 82].includes(data.weatherCode)) {
    return { text: 'Rain expected — metro recommended for less walking', icon: CloudRain, color: 'text-blue-500' };
  }
  if ([95, 96, 99].includes(data.weatherCode)) {
    return { text: 'Thunderstorm warning — avoid bikes and autos', icon: CloudLightning, color: 'text-purple-500' };
  }
  if (data.temperature > 38) {
    return { text: 'High heat — choose AC transport, stay hydrated', icon: Sun, color: 'text-amber-500' };
  }
  if (data.temperature < 8) {
    return { text: 'Cold weather — dress warm, metro is heated', icon: Thermometer, color: 'text-cyan-500' };
  }
  if ([45, 48].includes(data.weatherCode) || data.visibility < 1000) {
    return { text: 'Low visibility — drive carefully, allow extra time', icon: CloudFog, color: 'text-slate-400' };
  }
  if (data.windSpeed > 30) {
    return { text: 'Strong winds — two-wheelers not recommended', icon: Wind, color: 'text-slate-500' };
  }
  return { text: 'Good conditions for all transport modes', icon: info.icon, color: info.color };
}

export function WeatherWidget({ lat = DELHI_LAT, lng = DELHI_LNG, locationName = 'Delhi NCR', compact = false }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,is_day,visibility,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Asia%2FKolkata&forecast_days=3`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.current) return;
        const now = new Date();
        const currentHour = now.getHours();
        const hourlyData = (json.hourly?.time ?? []).slice(0, 12).map((time: string, i: number) => ({
          time,
          temp: Math.round(json.hourly.temperature_2m[i]),
          code: json.hourly.weather_code[i],
          precipitationProb: json.hourly.precipitation_probability?.[i] ?? 0,
        }));

        const dailyData = (json.daily?.time ?? []).slice(0, 3).map((date: string, i: number) => ({
          date,
          tempMax: Math.round(json.daily.temperature_2m_max[i]),
          tempMin: Math.round(json.daily.temperature_2m_min[i]),
          code: json.daily.weather_code[i],
          precipitationProb: json.daily.precipitation_probability_max?.[i] ?? 0,
          sunrise: json.daily.sunrise?.[i] ?? '',
          sunset: json.daily.sunset?.[i] ?? '',
        }));

        setData({
          temperature: Math.round(json.current.temperature_2m),
          feelsLike: Math.round(json.current.apparent_temperature),
          humidity: json.current.relative_humidity_2m,
          windSpeed: Math.round(json.current.wind_speed_10m),
          weatherCode: json.current.weather_code,
          precipitation: json.current.precipitation ?? 0,
          visibility: json.current.visibility ?? 10000,
          cloudCover: json.current.cloud_cover ?? 0,
          isDay: json.current.is_day === 1,
          uvIndex: json.current.uv_index ?? 0,
          hourly: hourlyData,
          daily: dailyData,
        });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Unable to load weather data');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-card p-6">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        <span className="text-sm text-muted-foreground">Loading live weather…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-border/40 bg-card p-6 text-center">
        <CloudFog className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{error ?? 'Weather unavailable'}</p>
      </div>
    );
  }

  const info = weatherInfo(data.weatherCode, data.isDay);
  const advice = travelAdvice(data);
  const currentHour = new Date().getHours();

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card p-3">
        <info.icon className={`h-8 w-8 ${info.color}`} />
        <div>
          <div className="font-display text-lg font-bold">{data.temperature}°C</div>
          <div className="text-xs text-muted-foreground">{info.label} · {locationName}</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Droplets className="h-3.5 w-3.5 text-blue-500" /> {data.humidity}%
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border/40 bg-card"
    >
      {/* Current weather hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-emerald-500/5 to-blue-500/10 p-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live weather · {locationName}
            </div>
            <div className="flex items-end gap-3">
              <info.icon className={`h-12 w-12 ${info.color}`} />
              <div>
                <div className="font-display text-4xl font-bold leading-none">{data.temperature}°C</div>
                <div className="text-sm text-muted-foreground mt-1">{info.label}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Feels like {data.feelsLike}°C</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Droplets className="h-3.5 w-3.5 text-blue-500" /> {data.humidity}%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wind className="h-3.5 w-3.5 text-slate-400" /> {data.windSpeed} km/h
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5 text-slate-400" /> {data.visibility < 1000 ? `${Math.round(data.visibility)}m` : `${Math.round(data.visibility / 1000)}km`}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Cloud className="h-3.5 w-3.5 text-slate-400" /> {data.cloudCover}%
            </div>
          </div>
        </div>

        {/* Travel advice */}
        <div className="relative mt-4 flex items-center gap-2 rounded-lg bg-background/60 p-2.5 backdrop-blur-sm">
          <advice.icon className={`h-4 w-4 shrink-0 ${advice.color}`} />
          <p className="text-xs font-medium">{advice.text}</p>
        </div>
      </div>

      {/* Hourly forecast */}
      <div className="border-t border-border/40 p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">Next 12 hours</h4>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {data.hourly.map((hour, i) => {
            const hourInfo = weatherInfo(hour.code, true);
            const time = new Date(hour.time);
            const h = time.getHours();
            const label = h === currentHour ? 'Now' : `${((h + 11) % 12) + 1}${h < 12 ? 'AM' : 'PM'}`;
            return (
              <div
                key={i}
                className="flex min-w-[52px] flex-col items-center gap-1 rounded-lg border border-border/30 bg-muted/20 p-2"
              >
                <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                <hourInfo.icon className={`h-5 w-5 ${hourInfo.color}`} />
                <span className="text-xs font-semibold">{hour.temp}°</span>
                {hour.precipitationProb > 20 && (
                  <span className="flex items-center gap-0.5 text-[9px] text-blue-500">
                    <Droplets className="h-2.5 w-2.5" />{hour.precipitationProb}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-day forecast */}
      <div className="border-t border-border/40 p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">3-day forecast</h4>
        <div className="space-y-2">
          {data.daily.map((day, i) => {
            const dayInfo = weatherInfo(day.code, true);
            const date = new Date(day.date);
            const dayLabel = i === 0 ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short' });
            const sunrise = day.sunrise ? new Date(day.sunrise).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '';
            const sunset = day.sunset ? new Date(day.sunset).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '';
            return (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/20 p-2.5">
                <span className="w-12 text-xs font-semibold">{dayLabel}</span>
                <dayInfo.icon className={`h-5 w-5 ${dayInfo.color}`} />
                <span className="flex-1 text-xs text-muted-foreground">{dayInfo.label}</span>
                {day.precipitationProb > 20 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-blue-500">
                    <Droplets className="h-3 w-3" />{day.precipitationProb}%
                  </span>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-500">{day.tempMin}°</span>
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-400 to-amber-400" />
                  <span className="text-amber-500">{day.tempMax}°</span>
                </div>
                {sunrise && i === 0 && (
                  <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Sun className="h-3 w-3 text-amber-400" /> {sunrise} - {sunset}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
