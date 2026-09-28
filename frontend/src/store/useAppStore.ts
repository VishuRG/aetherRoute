// Global State Management for AetherRoute using Zustand
// Handles theme, routing, Range Guard, notifications, layers, and optimistic community actions

import { create } from "zustand";
import {
  VehicleType,
  RouteOption,
  RouteWaypoint,
  EVCharger,
  PetrolStation,
  RoadProblem,
  SmartAlert,
  VehicleProfile,
  FilterState,
  AlertPriority,
  User,
} from "@/types";
import { MOCK_CHARGERS, MOCK_PETROL_STATIONS, MOCK_LIVE_PROBLEMS, MOCK_ROUTES } from "@/data/mockData";
import { dbService } from "@/services/db";

export type ActiveDrawer =
  | "none"
  | "routeDetails"
  | "notificationCenter"
  | "reportProblem"
  | "alertPreferences";

interface AppState {
  // Theme & Accessibility
  theme: "light" | "dark" | "system";
  reducedMotion: boolean;
  bootCompleted: boolean;
  setTheme: (theme: "light" | "dark" | "system", eventCoords?: { x: number; y: number }) => void;
  setReducedMotion: (val: boolean) => void;
  setBootCompleted: (val: boolean) => void;

  // Route Planning State
  origin: string;
  destination: string;
  originCoords: [number, number]; // [lng, lat]
  destCoords: [number, number];
  waypoints: RouteWaypoint[];
  departureTime: string;
  vehicleType: VehicleType;
  selectedRouteId: string;
  routes: RouteOption[];
  isNavigating: boolean;

  setOrigin: (origin: string, coords?: [number, number]) => void;
  setDestination: (dest: string, coords?: [number, number]) => void;
  swapOriginDestination: () => void;
  addWaypoint: (waypoint: RouteWaypoint) => void;
  removeWaypoint: (id: string) => void;
  reorderWaypoints: (waypoints: RouteWaypoint[]) => void;
  setVehicleType: (type: VehicleType) => void;
  setSelectedRouteId: (id: string) => void;
  setIsNavigating: (val: boolean) => void;

  // Vehicle Profile (Range Guard & Fuel Gauge)
  vehicleProfile: VehicleProfile;
  updateVehicleProfile: (updates: Partial<VehicleProfile>) => void;

  // Map Entities & Layers
  chargers: EVCharger[];
  petrolStations: PetrolStation[];
  problems: RoadProblem[];
  filters: FilterState;
  selectedEntity: EVCharger | PetrolStation | RoadProblem | null;

  toggleLayer: (layer: keyof Pick<FilterState, "showChargers" | "showPetrolPumps" | "showLiveProblems">) => void;
  setFilters: (updates: Partial<FilterState>) => void;
  setSelectedEntity: (entity: EVCharger | PetrolStation | RoadProblem | null) => void;
  addStopToRoute: (entity: EVCharger | PetrolStation) => void;

  // Live Community Problems
  likeProblem: (id: string) => void;
  confirmProblem: (id: string) => void;
  reportClearedProblem: (id: string) => void;
  addNewProblem: (data: Partial<RoadProblem>) => void;

  // UI Drawers & Overlays
  activeDrawer: ActiveDrawer;
  setActiveDrawer: (drawer: ActiveDrawer) => void;

  // Smart Alerts & Notifications
  notifications: SmartAlert[];
  toasts: Array<{
    id: string;
    title: string;
    message: string;
    priority: AlertPriority;
    action?: { label: string; actionType: string; payload?: any };
    createdAt: number;
  }>;
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<AppState["toasts"][number], "id" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  snoozeNotification: (id: string, minutes: number) => void;

  // Saved Trips
  savedTrips: Array<{
    id: string;
    title: string;
    origin: string;
    destination: string;
    distanceKm: number;
    durationMin: number;
    vehicleType: VehicleType;
    savedAt: string;
  }>;
  saveCurrentTrip: () => void;
  removeSavedTrip: (id: string) => void;

  // Auth & Database User State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, mobile?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Theme initialization from localStorage
  theme: (typeof window !== "undefined" && (localStorage.getItem("aether-theme") as any)) || "system",
  reducedMotion: typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  bootCompleted: typeof window !== "undefined" && sessionStorage.getItem("aether_boot_done") === "true",

  setTheme: (newTheme, eventCoords) => {
    const isDark =
      newTheme === "dark" ||
      (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const updateDOM = () => {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("aether-theme", newTheme);
      set({ theme: newTheme });
    };

    // Circular Reveal View Transition API
    if (
      eventCoords &&
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const { x, y } = eventCoords;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        updateDOM();
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: isDark ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: isDark
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          }
        );
      });
    } else {
      updateDOM();
    }
  },

  setReducedMotion: (val) => set({ reducedMotion: val }),
  setBootCompleted: (val) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aether_boot_done", "true");
    }
    set({ bootCompleted: val });
  },

  // Routing State
  origin: "Connaught Place, New Delhi",
  destination: "DLF Cyber Hub, Gurugram",
  originCoords: [77.2197, 28.6328],
  destCoords: [77.0889, 28.4595],
  waypoints: [],
  departureTime: "Leave Now",
  vehicleType: "ev",
  selectedRouteId: "route-fastest",
  routes: MOCK_ROUTES,
  isNavigating: false,

  setOrigin: (origin, coords) => set({ origin, ...(coords && { originCoords: coords }) }),
  setDestination: (destination, coords) =>
    set({ destination, ...(coords && { destCoords: coords }) }),
  swapOriginDestination: () =>
    set((state) => ({
      origin: state.destination,
      destination: state.origin,
      originCoords: state.destCoords,
      destCoords: state.originCoords,
    })),
  addWaypoint: (waypoint) =>
    set((state) => ({
      waypoints: state.waypoints.length < 3 ? [...state.waypoints, waypoint] : state.waypoints,
    })),
  removeWaypoint: (id) =>
    set((state) => ({
      waypoints: state.waypoints.filter((w) => w.id !== id),
    })),
  reorderWaypoints: (waypoints) => set({ waypoints }),
  setVehicleType: (type) => set({ vehicleType: type }),
  setSelectedRouteId: (id) => set({ selectedRouteId: id }),
  setIsNavigating: (val) => set({ isNavigating: val }),

  // Vehicle Profile (Range Guard / Fuel)
  vehicleProfile: {
    type: "ev",
    modelName: "Tata Nexon EV Max",
    batteryCapacityKwh: 40.5,
    currentBatteryPercent: 78,
    currentRangeKm: 280,
    maxRangeKm: 437,
    efficiencyWhPerKm: 145,
    fuelTankCapacityL: 45,
    currentFuelLevelPercent: 65,
    fuelEfficiencyKmPerL: 18.5,
  },
  updateVehicleProfile: (updates) =>
    set((state) => ({ vehicleProfile: { ...state.vehicleProfile, ...updates } })),

  // Map Entities & Layers
  chargers: MOCK_CHARGERS,
  petrolStations: MOCK_PETROL_STATIONS,
  problems: MOCK_LIVE_PROBLEMS,
  filters: {
    showChargers: true,
    showPetrolPumps: true,
    showLiveProblems: true,
    chargerConnector: "all",
    minPowerKw: 0,
    maxDetourMinutes: 10,
    availableOnly: false,
    bestPriceOnly: false,
    amenityFilters: [],
  },
  selectedEntity: null,

  toggleLayer: (layer) =>
    set((state) => ({
      filters: { ...state.filters, [layer]: !state.filters[layer] },
    })),
  setFilters: (updates) =>
    set((state) => ({ filters: { ...state.filters, ...updates } })),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),

  addStopToRoute: (entity) => {
    const isCharger = "powerKw" in entity;
    const detourMin = entity.detourMinutes;

    set((state) => {
      const updatedRoutes = state.routes.map((r) => {
        if (r.id === state.selectedRouteId) {
          const newStep = {
            id: `stop-${Date.now()}`,
            instruction: isCharger
              ? `⚡ Charge stop at ${entity.name} (${entity.powerKw}kW)`
              : `⛽ Refuel stop at ${entity.name} (₹${entity.pricePerLiter}/L)`,
            distanceKm: 0.8,
            durationMin: detourMin + (isCharger ? 25 : 8),
            roadName: entity.address,
            type: (isCharger ? "charger" : "fuel") as any,
            iconName: isCharger ? "BatteryCharging" : "Fuel",
          };

          return {
            ...r,
            durationMin: r.durationMin + detourMin + (isCharger ? 25 : 8),
            distanceKm: parseFloat((r.distanceKm + 1.2).toFixed(1)),
            timeline: [
              ...r.timeline.slice(0, 3),
              newStep,
              ...r.timeline.slice(3),
            ],
          };
        }
        return r;
      });

      return {
        routes: updatedRoutes,
        toasts: [
          ...state.toasts,
          {
            id: `toast-${Date.now()}`,
            title: isCharger ? "Charging Stop Added" : "Fuel Stop Added",
            message: `${entity.name} added (+${detourMin} min detour). ETA recalculated.`,
            priority: "success",
            createdAt: Date.now(),
          },
        ],
      };
    });
  },

  // Community problem actions
  likeProblem: (id) => {
    set((state) => ({
      problems: state.problems.map((p) =>
        p.id === id
          ? {
              ...p,
              likes: p.userLiked ? p.likes - 1 : p.likes + 1,
              userLiked: !p.userLiked,
            }
          : p
      ),
    }));
  },

  confirmProblem: (id) => {
    set((state) => ({
      problems: state.problems.map((p) => {
        if (p.id === id && !p.userConfirmed) {
          const newCount = p.confirmCount + 1;
          return {
            ...p,
            confirmCount: newCount,
            userConfirmed: true,
            isVerified: newCount >= 3 || p.isVerified,
          };
        }
        return p;
      }),
      toasts: [
        ...state.toasts,
        {
          id: `toast-confirm-${Date.now()}`,
          title: "Status Confirmed",
          message: "Thank you for keeping fellow commuters informed!",
          priority: "success",
          createdAt: Date.now(),
        },
      ],
    }));
  },

  reportClearedProblem: (id) => {
    set((state) => ({
      problems: state.problems.map((p) =>
        p.id === id && !p.userReportedCleared
          ? {
              ...p,
              clearedCount: p.clearedCount + 1,
              userReportedCleared: true,
            }
          : p
      ),
      toasts: [
        ...state.toasts,
        {
          id: `toast-cleared-${Date.now()}`,
          title: "Clearance Logged",
          message: "Noted! Hazard will be marked cleared after 2 more confirmations.",
          priority: "info",
          createdAt: Date.now(),
        },
      ],
    }));
  },

  addNewProblem: (data) => {
    const newProblem: RoadProblem = {
      id: `prob-${Date.now()}`,
      type: data.type || "traffic_jam",
      title: data.title || "User reported road alert",
      description: data.description || "Live condition reported by community driver",
      location: data.location || { lat: 28.5391, lng: 77.1265 },
      distanceKm: 4.5,
      reportedTimeAgo: "Just now",
      timestamp: Date.now(),
      severity: data.severity || "moderate",
      likes: 1,
      confirmCount: 1,
      clearedCount: 0,
      userConfirmed: true,
      isVerified: false,
      expiresInMinutes: 45,
      photoUrl: data.photoUrl,
    };

    set((state) => ({
      problems: [newProblem, ...state.problems],
      activeDrawer: "none",
      toasts: [
        ...state.toasts,
        {
          id: `toast-new-${Date.now()}`,
          title: "Report Broadcasted",
          message: "Your hazard alert is now live for all drivers on this corridor.",
          priority: "success",
          createdAt: Date.now(),
        },
      ],
    }));
  },

  // Active Drawer UI
  activeDrawer: "none",
  setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),

  // Smart Alerts & Notifications
  notifications: [
    {
      id: "notif-1",
      title: "Battery Warning — Range Guard",
      message: "Battery will reach 14% before DLF Cyber Hub. We suggest a 6 min top-up at Tata Power EZ Charge.",
      category: "ev",
      priority: "urgent",
      timestamp: Date.now() - 3 * 60 * 1000,
      timeAgo: "3 min ago",
      read: false,
      action: { label: "Add 6 min stop", actionType: "add_stop" },
    },
    {
      id: "notif-2",
      title: "Cheaper Fuel Alert",
      message: "IndianOil COCO pump 1.8 km ahead is ₹1.40/L cheaper than upcoming stations. Save ₹63 on tank full.",
      category: "fuel",
      priority: "info",
      timestamp: Date.now() - 15 * 60 * 1000,
      timeAgo: "15 min ago",
      read: false,
      action: { label: "Reroute to pump", actionType: "reroute" },
    },
    {
      id: "notif-3",
      title: "Accident 6 km Ahead",
      message: "Mahipalpur Flyover collision reported. Rerouting via Vasant Kunj saves 14 minutes.",
      category: "route",
      priority: "warning",
      timestamp: Date.now() - 25 * 60 * 1000,
      timeAgo: "25 min ago",
      read: true,
      action: { label: "Accept Reroute", actionType: "reroute" },
    },
    {
      id: "notif-4",
      title: "Charger Status Update",
      message: "Statiq Superhub just freed up 2 CCS2 240kW ports. No wait time.",
      category: "ev",
      priority: "success",
      timestamp: Date.now() - 42 * 60 * 1000,
      timeAgo: "42 min ago",
      read: true,
    },
  ],

  toasts: [],
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast-${Date.now()}-${Math.random()}`, createdAt: Date.now() },
      ],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  snoozeNotification: (id, minutes) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id
          ? { ...n, snoozedUntil: Date.now() + minutes * 60 * 1000 }
          : n
      ),
    })),

  // Saved Trips
  savedTrips: [],

  saveCurrentTrip: () => {
    const state = get();
    const currentRoute = state.routes.find((r) => r.id === state.selectedRouteId);
    if (!currentRoute) return;

    const newTrip = {
      id: `trip-${Date.now()}`,
      title: `${state.origin.split(",")[0]} to ${state.destination.split(",")[0]}`,
      origin: state.origin,
      destination: state.destination,
      distanceKm: currentRoute.distanceKm,
      durationMin: currentRoute.durationMin,
      vehicleType: state.vehicleType,
      savedAt: "Just now",
    };

    set((s) => ({
      savedTrips: [newTrip, ...s.savedTrips],
      toasts: [
        ...s.toasts,
        {
          id: `toast-saved-${Date.now()}`,
          title: "Trip Saved",
          message: "Route saved to your Saved Trips collection.",
          priority: "success",
          createdAt: Date.now(),
        },
      ],
    }));
  },

  removeSavedTrip: (id) =>
    set((state) => ({
      savedTrips: state.savedTrips.filter((t) => t.id !== id),
    })),

  // Auth & Database User Implementation
  user:
    typeof window !== "undefined" && localStorage.getItem("aether_auth_user")
      ? JSON.parse(localStorage.getItem("aether_auth_user")!)
      : null,
  token: typeof window !== "undefined" ? localStorage.getItem("aether_auth_token") : null,
  isAuthenticated:
    typeof window !== "undefined" && !!localStorage.getItem("aether_auth_user"),
  authLoading: false,

  login: async (email, password) => {
    set({ authLoading: true });
    const res = await dbService.login(email, password);
    set({ authLoading: false });
    if (res.success && res.user) {
      set({ user: res.user, token: res.token || null, isAuthenticated: true });
      get().addToast({
        title: "Welcome Back!",
        message: `Logged in as ${res.user.name} (${res.user.email}).`,
        priority: "success",
      });
      return { success: true };
    }
    return { success: false, error: res.error || "Login failed" };
  },

  register: async (name, email, password, mobile) => {
    set({ authLoading: true });
    const res = await dbService.register(name, email, password, mobile);
    set({ authLoading: false });
    if (res.success && res.user) {
      set({ user: res.user, token: res.token || null, isAuthenticated: true });
      get().addToast({
        title: "Account Created",
        message: `Welcome to AetherRoute, ${res.user.name}! Your account has been saved to the database.`,
        priority: "success",
      });
      return { success: true };
    }
    return { success: false, error: res.error || "Registration failed" };
  },

  logout: async () => {
    await dbService.logout();
    set({ user: null, token: null, isAuthenticated: false });
    get().addToast({
      title: "Logged Out",
      message: "You have been signed out successfully.",
      priority: "info",
    });
  },

  checkAuth: async () => {
    const session = await dbService.getSession();
    if (session.user) {
      set({ user: session.user, token: session.token, isAuthenticated: true });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
