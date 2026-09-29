export type TransportMode =
  | 'metro'
  | 'bus'
  | 'cab'
  | 'auto'
  | 'car'
  | 'bike'
  | 'walk';

export interface DelhiLocation {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

export const delhiLocations: DelhiLocation[] = [
  { id: 'du', name: 'Delhi University', area: 'North Delhi', lat: 28.6575, lng: 77.1588 },
  { id: 'rc', name: 'Rajiv Chowk', area: 'Central Delhi', lat: 28.6328, lng: 77.2197 },
  { id: 'cp', name: 'Connaught Place', area: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: 'ndls', name: 'New Delhi Railway Station', area: 'Central Delhi', lat: 28.6428, lng: 77.2197 },
  { id: 'noida62', name: 'Noida Sector 62', area: 'Noida', lat: 28.6280, lng: 77.3535 },
  { id: 'gurgaon', name: 'Gurgaon Cyber City', area: 'Gurgaon', lat: 28.4949, lng: 77.0890 },
  { id: 'anand', name: 'Anand Vihar', area: 'East Delhi', lat: 28.6469, lng: 77.3154 },
  { id: 'airport', name: 'IGI Airport T3', area: 'South West Delhi', lat: 28.5562, lng: 77.1000 },
  { id: 'saket', name: 'Saket', area: 'South Delhi', lat: 28.5245, lng: 77.2066 },
  { id: 'dwarka', name: 'Dwarka Sector 21', area: 'South West Delhi', lat: 28.5708, lng: 77.0717 },
  { id: 'faridabad', name: 'Faridabad NIT', area: 'Faridabad', lat: 28.4089, lng: 77.3178 },
  { id: 'ghaziabad', name: 'Ghaziabad', area: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
  { id: 'karol', name: 'Karol Bagh', area: 'Central Delhi', lat: 28.6519, lng: 77.1909 },
  { id: 'lajpat', name: 'Lajpat Nagar', area: 'South Delhi', lat: 28.5677, lng: 77.2434 },
  { id: 'akshardham', name: 'Akshardham', area: 'East Delhi', lat: 28.6126, lng: 77.2773 },
];

export interface RouteSegment {
  mode: TransportMode;
  label: string;
  distanceKm: number;
  durationMin: number;
  fare: number;
  co2Kg: number;
  walkingM: number;
  transfers: number;
  instructions: string;
}

export interface RouteOption {
  id: string;
  mode: TransportMode;
  label: string;
  totalTimeMin: number;
  totalFare: number;
  totalCo2Kg: number;
  totalWalkingM: number;
  totalTransfers: number;
  totalDistanceKm: number;
  trafficLevel: 'low' | 'moderate' | 'high';
  segments: RouteSegment[];
  ecoScore: number;
  isDemo: boolean;
}

export const emissionFactors: Record<TransportMode, number> = {
  metro: 0.04,
  bus: 0.08,
  cab: 0.18,
  auto: 0.12,
  car: 0.17,
  bike: 0.06,
  walk: 0,
};

export const fareBaseRates: Record<TransportMode, { base: number; perKm: number }> = {
  metro: { base: 10, perKm: 3 },
  bus: { base: 5, perKm: 1.5 },
  cab: { base: 50, perKm: 14 },
  auto: { base: 30, perKm: 11 },
  car: { base: 0, perKm: 8 },
  bike: { base: 0, perKm: 3.5 },
  walk: { base: 0, perKm: 0 },
};

export const transportIcons: Record<TransportMode, string> = {
  metro: '🚇',
  bus: '🚌',
  cab: '🚕',
  auto: '🛺',
  car: '🚗',
  bike: '🏍️',
  walk: '🚶',
};

export const transportColors: Record<TransportMode, string> = {
  metro: 'text-violet-600',
  bus: 'text-orange-500',
  cab: 'text-yellow-600',
  auto: 'text-green-600',
  car: 'text-blue-600',
  bike: 'text-teal-600',
  walk: 'text-sky-500',
};

export const trafficColors: Record<string, string> = {
  low: 'text-emerald-500',
  moderate: 'text-amber-500',
  high: 'text-red-500',
};

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateFare(mode: TransportMode, distanceKm: number): number {
  const rate = fareBaseRates[mode];
  return Math.round(rate.base + rate.perKm * distanceKm);
}

export function calculateEmissions(mode: TransportMode, distanceKm: number): number {
  return Math.round(emissionFactors[mode] * distanceKm * 100) / 100;
}

export function generateRoutes(
  fromId: string,
  toId: string
): RouteOption[] {
  const from = delhiLocations.find((l) => l.id === fromId);
  const to = delhiLocations.find((l) => l.id === toId);
  if (!from || !to) return [];

  const distance = haversineDistance(from.lat, from.lng, to.lat, to.lng);
  const roadDistance = distance * 1.3;

  const modes: TransportMode[] = ['metro', 'bus', 'cab', 'auto', 'car', 'bike'];
  const trafficOptions: Array<'low' | 'moderate' | 'high'> = ['low', 'moderate', 'high'];

  return modes.map((mode, i) => {
    const fare = calculateFare(mode, roadDistance);
    const co2 = calculateEmissions(mode, roadDistance);
    const speedMap: Record<TransportMode, number> = {
      metro: 35, bus: 22, cab: 25, auto: 22, car: 28, bike: 30, walk: 5,
    };
    const traffic = trafficOptions[i % trafficOptions.length];
    const trafficMultiplier = traffic === 'low' ? 1 : traffic === 'moderate' ? 1.25 : 1.6;
    const time = Math.round((roadDistance / speedMap[mode]) * 60 * trafficMultiplier);
    const walking = mode === 'metro' ? 700 : mode === 'bus' ? 450 : 100;
    const transfers = mode === 'metro' ? 1 : mode === 'bus' ? 0 : 0;
    const ecoScore = Math.round(100 - (co2 / (roadDistance * 0.2)) * 100 + (mode === 'metro' || mode === 'bus' ? 20 : 0));

    return {
      id: `route-${mode}-${fromId}-${toId}`,
      mode,
      label: mode.charAt(0).toUpperCase() + mode.slice(1),
      totalTimeMin: Math.max(time, 8),
      totalFare: Math.max(fare, mode === 'walk' ? 0 : 10),
      totalCo2Kg: co2,
      totalWalkingM: walking,
      totalTransfers: transfers,
      totalDistanceKm: Math.round(roadDistance * 10) / 10,
      trafficLevel: traffic,
      ecoScore: Math.max(0, Math.min(100, ecoScore)),
      isDemo: true,
      segments: [
        {
          mode,
          label: `${mode.charAt(0).toUpperCase() + mode.slice(1)} from ${from.name}`,
          distanceKm: Math.round(roadDistance * 10) / 10,
          durationMin: Math.max(time, 8),
          fare,
          co2Kg: co2,
          walkingM: walking,
          transfers,
          instructions: `Board ${mode} at ${from.name}. Travel ${Math.round(roadDistance * 10) / 10} km to ${to.name}.`,
        },
      ],
    };
  }).sort((a, b) => a.totalTimeMin - b.totalTimeMin);
}

export interface JourneyRecord {
  id: string;
  userId: string;
  fromName: string;
  toName: string;
  mode: TransportMode;
  distanceKm: number;
  durationMin: number;
  fare: number;
  co2Kg: number;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface ExpenseRecord {
  id: string;
  userId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  journeyId?: string;
  status: 'logged' | 'submitted' | 'approved' | 'reimbursed';
}

export interface CommunityReport {
  id: string;
  type: 'pothole' | 'waterlogging' | 'construction' | 'accident' | 'signal' | 'closure' | 'streetlight';
  description: string;
  location: string;
  lat: number;
  lng: number;
  confirmations: number;
  status: 'active' | 'resolved';
  reportedAt: string;
}

export const demoTrips: JourneyRecord[] = [
  { id: 'j1', userId: 'demo', fromName: 'Delhi University', toName: 'Noida Sector 62', mode: 'metro', distanceKm: 24.2, durationMin: 42, fare: 40, co2Kg: 0.7, date: '2026-09-26T08:30:00Z', status: 'completed' },
  { id: 'j2', userId: 'demo', fromName: 'Rajiv Chowk', toName: 'Gurgaon Cyber City', mode: 'metro', distanceKm: 31.5, durationMin: 55, fare: 60, co2Kg: 0.9, date: '2026-09-25T09:15:00Z', status: 'completed' },
  { id: 'j3', userId: 'demo', fromName: 'Connaught Place', toName: 'Saket', mode: 'auto', distanceKm: 12.8, durationMin: 35, fare: 120, co2Kg: 1.5, date: '2026-09-24T19:00:00Z', status: 'completed' },
  { id: 'j4', userId: 'demo', fromName: 'Anand Vihar', toName: 'Rajiv Chowk', mode: 'metro', distanceKm: 18.3, durationMin: 38, fare: 50, co2Kg: 0.6, date: '2026-09-23T07:45:00Z', status: 'completed' },
  { id: 'j5', userId: 'demo', fromName: 'Saket', toName: 'IGI Airport T3', mode: 'cab', distanceKm: 22.1, durationMin: 48, fare: 380, co2Kg: 4.2, date: '2026-09-22T14:20:00Z', status: 'completed' },
  { id: 'j6', userId: 'demo', fromName: 'Karol Bagh', toName: 'Lajpat Nagar', mode: 'bus', distanceKm: 15.6, durationMin: 50, fare: 25, co2Kg: 1.2, date: '2026-09-21T11:10:00Z', status: 'completed' },
  { id: 'j7', userId: 'demo', fromName: 'Dwarka Sector 21', toName: 'Connaught Place', mode: 'metro', distanceKm: 25.4, durationMin: 48, fare: 50, co2Kg: 0.8, date: '2026-09-20T08:00:00Z', status: 'completed' },
];

export const demoExpenses: ExpenseRecord[] = [
  { id: 'e1', userId: 'demo', category: 'Metro', amount: 40, date: '2026-09-26', description: 'DU to Noida Sector 62', status: 'reimbursed' },
  { id: 'e2', userId: 'demo', category: 'Metro', amount: 60, date: '2026-09-25', description: 'Rajiv Chowk to Gurgaon', status: 'approved' },
  { id: 'e3', userId: 'demo', category: 'Auto', amount: 120, date: '2026-09-24', description: 'CP to Saket', status: 'submitted' },
  { id: 'e4', userId: 'demo', category: 'Metro', amount: 50, date: '2026-09-23', description: 'Anand Vihar to Rajiv Chowk', status: 'approved' },
  { id: 'e5', userId: 'demo', category: 'Cab', amount: 380, date: '2026-09-22', description: 'Saket to IGI Airport', status: 'logged' },
  { id: 'e6', userId: 'demo', category: 'Bus', amount: 25, date: '2026-09-21', description: 'Karol Bagh to Lajpat Nagar', status: 'submitted' },
  { id: 'e7', userId: 'demo', category: 'Parking', amount: 40, date: '2026-09-22', description: 'Airport parking', status: 'logged' },
  { id: 'e8', userId: 'demo', category: 'Fuel', amount: 350, date: '2026-09-20', description: 'Petrol refill', status: 'logged' },
];

export const demoReports: CommunityReport[] = [
  { id: 'r1', type: 'pothole', description: 'Large pothole near the bus stop, causing traffic slowdown', location: 'Saket Main Road', lat: 28.5245, lng: 77.2066, confirmations: 12, status: 'active', reportedAt: '2026-09-25T10:00:00Z' },
  { id: 'r2', type: 'waterlogging', description: 'Waterlogging after rain, vehicles struggling', location: 'Anand Vihar Flyover', lat: 28.6469, lng: 77.3154, confirmations: 8, status: 'active', reportedAt: '2026-09-24T16:30:00Z' },
  { id: 'r3', type: 'accident', description: 'Minor collision, one lane blocked', location: 'NH-48 near Gurgaon', lat: 28.4949, lng: 77.0890, confirmations: 5, status: 'active', reportedAt: '2026-09-26T08:00:00Z' },
  { id: 'r4', type: 'construction', description: 'Road construction, narrow lanes', location: 'Karol Bagh', lat: 28.6519, lng: 77.1909, confirmations: 3, status: 'active', reportedAt: '2026-09-23T09:00:00Z' },
  { id: 'r5', type: 'signal', description: 'Traffic signal not working at intersection', location: 'Lajpat Nagar Crossing', lat: 28.5677, lng: 77.2434, confirmations: 15, status: 'active', reportedAt: '2026-09-22T18:00:00Z' },
  { id: 'r6', type: 'streetlight', description: 'Streetlight out, dark stretch at night', location: 'Dwarka Sector 21', lat: 28.5708, lng: 77.0717, confirmations: 7, status: 'resolved', reportedAt: '2026-09-20T20:00:00Z' },
];

export const reportTypeMeta: Record<CommunityReport['type'], { label: string; color: string; icon: string }> = {
  pothole: { label: 'Pothole', color: 'text-amber-500', icon: '🟡' },
  waterlogging: { label: 'Waterlogging', color: 'text-blue-500', icon: '🔵' },
  construction: { label: 'Construction', color: 'text-orange-500', icon: '🟠' },
  accident: { label: 'Accident', color: 'text-red-500', icon: '🔴' },
  signal: { label: 'Broken Signal', color: 'text-purple-500', icon: '🟣' },
  closure: { label: 'Road Closure', color: 'text-red-600', icon: '⛔' },
  streetlight: { label: 'Streetlight', color: 'text-yellow-500', icon: '💡' },
};

export interface CabProvider {
  id: string;
  name: string;
  base: number;
  perKm: number;
  surgeMultiplier: number;
  color: string;
  bgColor: string;
  deeplink: string;
  webUrl: string;
  eta: string;
  rating: number;
}

export const cabProviders: CabProvider[] = [
  { id: 'uber', name: 'Uber', base: 45, perKm: 13, surgeMultiplier: 1.0, color: 'text-neutral-900 dark:text-white', bgColor: 'bg-neutral-900 dark:bg-neutral-100', deeplink: 'https://m.uber.com/ul/', webUrl: 'https://m.uber.com/looking/', eta: '4 min', rating: 4.6 },
  { id: 'ola', name: 'Ola', base: 40, perKm: 12.5, surgeMultiplier: 1.1, color: 'text-lime-600', bgColor: 'bg-lime-500', deeplink: 'olacabs://book', webUrl: 'https://www.olacabs.com/', eta: '3 min', rating: 4.4 },
  { id: 'rapido', name: 'Rapido', base: 35, perKm: 10, surgeMultiplier: 0.9, color: 'text-yellow-600', bgColor: 'bg-yellow-400', deeplink: 'rapido://book', webUrl: 'https://www.rapido.bike/', eta: '2 min', rating: 4.5 },
  { id: 'bluSmart', name: 'BluSmart', base: 50, perKm: 15, surgeMultiplier: 1.0, color: 'text-blue-600', bgColor: 'bg-blue-500', deeplink: 'https://blu-smart.com/', webUrl: 'https://blu-smart.com/', eta: '6 min', rating: 4.7 },
  { id: 'meru', name: 'Meru', base: 42, perKm: 14, surgeMultiplier: 1.05, color: 'text-emerald-600', bgColor: 'bg-emerald-500', deeplink: 'meru://book', webUrl: 'https://www.meru.in/', eta: '5 min', rating: 4.3 },
];

export function calculateCabFare(provider: CabProvider, distanceKm: number): number {
  return Math.round((provider.base + provider.perKm * distanceKm) * provider.surgeMultiplier);
}

export interface LocalTransportProvider {
  id: string;
  name: string;
  type: string;
  base: number;
  perKm: number;
  nightSurcharge: boolean;
  icon: string;
  color: string;
  bgColor: string;
  webUrl: string;
}

export const localTransportProviders: LocalTransportProvider[] = [
  { id: 'auto', name: 'Auto-Rickshaw', type: 'Metered Auto', base: 30, perKm: 11, nightSurcharge: true, icon: '🛺', color: 'text-green-600', bgColor: 'bg-green-500', webUrl: 'https://www.olacabs.com/' },
  { id: 'bikeTaxi', name: 'Bike Taxi', type: 'Rapido Bike', base: 25, perKm: 7, nightSurcharge: false, icon: '🏍️', color: 'text-yellow-600', bgColor: 'bg-yellow-400', webUrl: 'https://www.rapido.bike/' },
  { id: 'erickshaw', name: 'E-Rickshaw', type: 'Electric', base: 20, perKm: 8, nightSurcharge: false, icon: '🛺', color: 'text-emerald-600', bgColor: 'bg-emerald-500', webUrl: '' },
  { id: 'grameenAuto', name: 'Gramin Auto', type: 'Shared Auto', base: 15, perKm: 6, nightSurcharge: false, icon: '🛺', color: 'text-orange-600', bgColor: 'bg-orange-500', webUrl: '' },
];

export function calculateLocalFare(provider: LocalTransportProvider, distanceKm: number): number {
  const baseFare = Math.round(provider.base + provider.perKm * distanceKm);
  const nightMultiplier = provider.nightSurcharge && new Date().getHours() >= 22 ? 1.5 : 1;
  return Math.round(baseFare * nightMultiplier);
}

export function buildCabDeepLink(
  provider: CabProvider,
  from: DelhiLocation,
  to: DelhiLocation
): string {
  const fromStr = `${from.lat},${from.lng}`;
  const toStr = `${to.lat},${to.lng}`;
  const fromName = encodeURIComponent(from.name);
  const toName = encodeURIComponent(to.name);

  switch (provider.id) {
    case 'uber':
      return `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${from.lat}&pickup[longitude]=${from.lng}&pickup[nickname]=${fromName}&dropoff[latitude]=${to.lat}&dropoff[longitude]=${to.lng}&dropoff[nickname]=${toName}`;
    case 'ola':
      return `https://book.olacabs.com/?pickup_lat=${from.lat}&pickup_lng=${from.lng}&drop_lat=${to.lat}&drop_lng=${to.lng}&pickup_name=${fromName}&drop_name=${toName}`;
    case 'rapido':
      return `https://www.rapido.bike/booking?pickup=${fromStr}&drop=${toStr}&pickup_name=${fromName}&drop_name=${toName}`;
    case 'bluSmart':
      return `https://blu-smart.com/booking?pickup_lat=${from.lat}&pickup_lng=${from.lng}&drop_lat=${to.lat}&drop_lng=${to.lng}`;
    case 'meru':
      return `https://www.meru.in/booking?pickup_lat=${from.lat}&pickup_lng=${from.lng}&drop_lat=${to.lat}&drop_lng=${to.lng}`;
    default:
      return provider.webUrl;
  }
}

export interface StreetSegment {
  name: string;
  fromPoint: string;
  toPoint: string;
  distanceKm: number;
  trafficLevel: 'low' | 'moderate' | 'high';
  roadType: string;
}

export function generateStreetSegments(fromId: string, toId: string): StreetSegment[] {
  const from = delhiLocations.find((l) => l.id === fromId);
  const to = delhiLocations.find((l) => l.id === toId);
  if (!from || !to) return [];

  const totalDistance = haversineDistance(from.lat, from.lng, to.lat, to.lng) * 1.3;
  const trafficOptions: Array<'low' | 'moderate' | 'high'> = ['low', 'moderate', 'high'];
  const roadTypes = ['Arterial Road', 'Ring Road', 'Expressway', 'City Road', 'Flyover', 'Local Street'];
  const streetNames = [
    'Vikas Marg', 'Mahatma Gandhi Road', 'Outer Ring Road', 'Barapulla Flyover',
    'Sardar Patel Marg', 'Janpath Road', 'Akshardham Flyover', 'Noida Link Road',
    'Rao Tula Ram Marg', 'Nelson Mandela Marg', 'Arunchal Marg', 'Connaught Place Circus',
  ];

  const numSegments = Math.min(Math.max(Math.ceil(totalDistance / 3), 2), 5);
  const segDistance = totalDistance / numSegments;
  const segments: StreetSegment[] = [];

  for (let i = 0; i < numSegments; i++) {
    const traffic = trafficOptions[(i + Math.floor(from.lat * 10)) % 3];
    const roadIdx = (i + Math.floor(from.lng * 10)) % roadTypes.length;
    const nameIdx = (i * 2 + Math.floor(from.lat * 5)) % streetNames.length;

    if (i === 0) {
      segments.push({
        name: streetNames[nameIdx],
        fromPoint: from.name,
        toPoint: streetNames[(nameIdx + 1) % streetNames.length],
        distanceKm: Math.round(segDistance * 10) / 10,
        trafficLevel: traffic,
        roadType: roadTypes[roadIdx],
      });
    } else if (i === numSegments - 1) {
      segments.push({
        name: streetNames[nameIdx],
        fromPoint: segments[i - 1].toPoint,
        toPoint: to.name,
        distanceKm: Math.round(segDistance * 10) / 10,
        trafficLevel: traffic,
        roadType: roadTypes[roadIdx],
      });
    } else {
      segments.push({
        name: streetNames[nameIdx],
        fromPoint: segments[i - 1].toPoint,
        toPoint: streetNames[(nameIdx + 1) % streetNames.length],
        distanceKm: Math.round(segDistance * 10) / 10,
        trafficLevel: traffic,
        roadType: roadTypes[roadIdx],
      });
    }
  }

  return segments;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  trips: number;
  co2Saved: number;
  avatar: string;
}

export const demoLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Priya Sharma', points: 8420, trips: 156, co2Saved: 42.5, avatar: 'PS' },
  { rank: 2, name: 'Arjun Mehta', points: 7680, trips: 142, co2Saved: 38.2, avatar: 'AM' },
  { rank: 3, name: 'Sneha Gupta', points: 6920, trips: 128, co2Saved: 34.8, avatar: 'SG' },
  { rank: 4, name: 'Rahul Verma', points: 5340, trips: 98, co2Saved: 28.1, avatar: 'RV' },
  { rank: 5, name: 'Ananya Singh', points: 4760, trips: 87, co2Saved: 24.3, avatar: 'AS' },
  { rank: 6, name: 'Karan Malhotra', points: 3920, trips: 72, co2Saved: 19.7, avatar: 'KM' },
  { rank: 7, name: 'Divya Reddy', points: 3180, trips: 61, co2Saved: 16.2, avatar: 'DR' },
  { rank: 8, name: 'Vikram Joshi', points: 2640, trips: 49, co2Saved: 13.4, avatar: 'VJ' },
];
