# AetherRoute — Intelligent Multimodal Route Planning & Live Road Intelligence

> **Apple Maps meets Airbnb.** A production-grade frontend built with React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lenis, and MapLibre/Leaflet CARTO OSM tiles.

---

## ⚡ Quick Start

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Start the Vite development server
npm run dev

# 3. Open in your browser
http://localhost:5173
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 🎨 Brand & Color Tokens

| Token | Hex | Role & Meaning |
| :--- | :--- | :--- |
| **Forest Green** | `#1E7F4F` | Primary brand, EV routes, eco-optimization, success |
| **Deep Green** | `#0E4D2F` | Deep brand contrasts, text, headers |
| **Mint** | `#3FBF7F` | High-contrast accents in dark mode, active indicators |
| **Sun Yellow** | `#FFC93C` | Info, caution, ratings, best price badges |
| **Vibrant Orange** | `#FF7A1A` | Petrol, live road problems, urgent alerts, main CTAs |
| **Cream** | `#FFF8E7` | Light background surface, dark mode text |
| **Warm Cream** | `#F5EBD0` | Card borders, secondary surfaces |
| **Dark Background** | `#0B1A13` | Deep forest dark mode background |
| **Dark Card** | `#14281E` | Glassmorphic dark card surface |

- **Typography**: `Sora` (Headings), `Inter` (Body), `JetBrains Mono` (Numbers, ETAs, Fares).
- **Accessibility**: 100% WCAG AA contrast ratio in both Light & Dark modes.

---

## 🚀 Key Features & Motion System

### 1. Boot Animation (Skippable, Once per Session)
- Full-screen splash in active theme.
- SVG route line draws dynamically between two pins while a vehicle travels along the path.
- 0–100% counter with rotating status lines (*"Warming up the engine..."*, *"Scanning road conditions..."*).
- Two-panel curtain exit (Green, then Sun Yellow) sliding up via clip-path.

### 2. View Transitions Circular Reveal
- Animated navbar toggle with Sun, Moon, and System states.
- Click triggers circular clip-path expansion radiating from the cursor coordinate using the native View Transitions API.
- Zero-flash inline script ensures instant theme persistence from `localStorage`.

### 3. Core Multimodal Route Planner
- Inputs: From, To, up to 3 reorderable waypoints, departure time, and vehicle selector (`EV`, `Petrol`, `Diesel`, `CNG`).
- 4 route options: **Fastest**, **Eco-Optimized**, **Lowest Cost**, and **Scenic Corridor**.
- **Desktop**: 40/60 Split view (planner on left, map on right).
- **Mobile**: Full-screen map with draggable bottom sheet (peek, half, and full snap points).
- **"Slide to Start Navigation"** swipe control with spring physics.

### 4. EV Range Guard™
- Interactive battery % slider and current range estimator.
- Dynamic State-of-Charge (SoC) projection across trip distance.
- Auto-suggests fast charging stops along the route if projected battery at destination drops below 20%.

### 5. Petrol Station Sparklines & Best Price
- Live fuel price trend with change arrows and SVG price sparklines.
- Queue wait levels (`Low`, `Medium`, `High`).
- Yellow **"BEST PRICE"** badge for the cheapest station on the corridor.

### 6. Live Road Hazards & Community Verification
- Report flow with icon grid (Accident, Jam, Roadwork, Waterlogging, Charger Down, etc.).
- Like / "Still There?" / "Cleared" buttons with optimistic counters and confetti celebration.
- Hazards gain a **"Verified"** badge automatically once confirmed by 3 commuters.

### 7. Smart Alerts & Notification Center
- Slide-over notification drawer grouped by Route, EV, Fuel, and Community.
- Auto-dismiss toast stack with pause-on-hover and action buttons (*"Add Stop"*, *"Reroute"*).
- Smart alert rules engine evaluating range, bottlenecks, and cheaper fuel opportunities.

---

## 📁 Project Architecture

```
frontend/
├── index.html                  # Anti-flash theme script & Google Fonts
├── tailwind.config.js          # Design tokens & 8pt grid
├── postcss.config.js           # PostCSS configuration
├── tsconfig.app.json           # Path alias @/ resolution
├── src/
│   ├── config/
│   │   └── appConfig.ts        # Currency (₹), units (km, km/h), connector types
│   ├── types/
│   │   └── index.ts            # TypeScript definitions for routes, POIs, alerts
│   ├── store/
│   │   └── useAppStore.ts      # Zustand global state & optimistic handlers
│   ├── hooks/
│   │   ├── useTheme.ts         # Circular reveal View Transitions
│   │   ├── useNotifications.ts # Throttled smart alerts engine
│   │   └── useReducedMotion.ts # prefers-reduced-motion detector
│   ├── data/
│   │   └── mockData.ts         # Realistic chargers, petrol, problems, routes
│   ├── components/
│   │   ├── BootScreen.tsx      # SVG route drawing & dual-curtain exit
│   │   ├── Navbar.tsx          # Sticky blur, yellow scroll bar, sliding pill
│   │   ├── ThemeToggle.tsx     # Sun-moon morph & sliding knob
│   │   ├── MapView.tsx         # Leaflet + CARTO tiles (Positron & Dark Matter)
│   │   ├── RouteCard.tsx       # Route metrics, traffic, elevation, cost
│   │   ├── ChargerCard.tsx     # Segmented live ports bar
│   │   ├── FuelCard.tsx        # Sparkline price trend & queue wait
│   │   ├── ProblemCard.tsx     # Optimistic like, confirm & confetti burst
│   │   ├── ReportSheet.tsx     # Hazard report modal with icon grid
│   │   ├── RangeGuard.tsx      # SoC battery projection & smart stop suggestions
│   │   ├── FuelGauge.tsx       # Tank level consumption projection
│   │   ├── SlideToStart.tsx    # Swipe-to-confirm navigation control
│   │   ├── Drawer.tsx          # Right-side spring slide-over
│   │   ├── BottomSheet.tsx     # Mobile draggable bottom sheet
│   │   ├── NotificationCenter.tsx # Grouped notification panel
│   │   ├── ToastStack.tsx      # Auto-dismiss toasts with progress bar
│   │   ├── PageTransition.tsx  # Slide-fade transitions
│   │   └── Footer.tsx          # Branded footer with shortcuts & WCAG info
│   ├── pages/
│   │   ├── Home.tsx            # Hero contour, search, marquee, carousel
│   │   ├── Plan.tsx            # Split-view & mobile bottom sheet planner
│   │   ├── Explore.tsx         # Live map explorer & POI grid
│   │   ├── SavedTrips.tsx      # Bookmarked routes & rerun simulations
│   │   ├── Settings.tsx        # Vehicle profile & alert preferences
│   │   └── NotFound.tsx        # 404 animated lost-on-road page
│   ├── App.tsx                 # Lenis smooth scroll & router configuration
│   ├── main.tsx                # React root mount
│   └── index.css               # Design tokens, glassmorphism, contour pattern
```
