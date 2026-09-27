// Weather Service — OpenWeatherMap API adapter with weather-aware routing & status indicator

import { ECO_CONFIG, isConfigured, getServiceStatus, ServiceDataStatus } from "@/services/config";
import { DEMO_WEATHER } from "@/lib/demo-data";

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: string;
  conditionCode: string;
  windSpeed: number;
  rainMm: number;
  visibility: number;
  aqi?: number;
  isRaining: boolean;
  hasAlert: boolean;
  alertMessage?: string;
  icon?: string;
  dataStatus: ServiceDataStatus;
}

export async function getCurrentWeather(city = "Delhi"): Promise<WeatherData> {
  const isKeyPresent = isConfigured("OPENWEATHER_KEY");
  const dataStatus = getServiceStatus("OPENWEATHER_KEY");

  if (isKeyPresent) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${ECO_CONFIG.OPENWEATHER_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        return {
          city: data.name,
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          condition: data.weather[0].description,
          conditionCode: data.weather[0].icon,
          windSpeed: Math.round(data.wind.speed * 3.6),
          rainMm: data.rain?.["1h"] || 0,
          visibility: (data.visibility || 10000) / 1000,
          isRaining: data.weather[0].main === "Rain",
          hasAlert: false,
          dataStatus: "LIVE",
        };
      }
    } catch (e) {
      console.error("Weather API error:", e);
    }
  }

  // Realistic Delhi weather fallback
  const hour = new Date().getHours();
  const isEvening = hour >= 17 && hour <= 21;
  const isMorning = hour >= 5 && hour <= 9;

  return {
    ...DEMO_WEATHER,
    temperature: isEvening ? 28 : isMorning ? 24 : 32,
    feelsLike: isEvening ? 31 : isMorning ? 26 : 36,
    dataStatus: "DEMO",
  };
}

export function getWeatherImpact(weather: WeatherData): { level: string; message: string } {
  if (weather.isRaining || weather.rainMm > 2) {
    return { level: "high", message: "Heavy rain — avoid walking routes, prefer Metro" };
  }
  if (weather.rainMm > 0) {
    return { level: "medium", message: "Light rain expected — carry umbrella" };
  }
  if (weather.temperature > 38) {
    return { level: "medium", message: "Very hot — stay hydrated, prefer AC Metro" };
  }
  if ((weather.aqi ?? 0) > 200) {
    return { level: "high", message: "Poor air quality — use mask during commute" };
  }
  return { level: "low", message: "Good weather for travel" };
}
