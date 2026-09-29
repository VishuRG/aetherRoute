# AetherRoute / EcoRoute — Multimodal Travel Intelligence Platform

🌱 **EcoRoute** is an intelligent multimodal travel intelligence platform designed for commuters across Delhi-NCR. It optimizes daily travel for speed, cost, and net carbon footprint reductions.

---

## 🌟 Key Features

* 🚇 **Multimodal Routing Engine**: Compares Metro, Bus, EV cabs, CNG autos, and bikes with live CO₂ calculations.
* 🚦 **Turn-by-Turn Navigation**: Real-time simulation mode with voice prompts and active ETA tracking.
* 🎫 **Digital Transit Tickets**: Contactless QR tickets for automated transit gates.
* 🌿 **Carbon Intelligence**: Live carbon savings metrics, eco-scores, and community leaderboards.
* 🤖 **AI Assistant**: Smart transit advisory, routing suggestions, and real-time updates.
* 🚨 **Emergency SOS & Safety**: 1-click panic alert and emergency broadcast features.

---

## 🛠️ Tech Stack

* **Framework**: Next.js (App Router) + React 18 + TypeScript
* **Styling**: Tailwind CSS + Radix UI / Lucide React
* **Database & Auth**: Supabase
* **Maps & Visualizations**: Leaflet / React-Leaflet + Recharts

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VishuRG/aetherRoute.git
   cd aetherRoute
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your Supabase URL and anonymous key.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.
