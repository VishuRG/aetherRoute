# EcoRoute — Climate-Tech Multimodal Travel Intelligence (Delhi-NCR)

🌱 **EcoRoute** is a production-quality full-stack travel intelligence platform designed for commuters across **Delhi, Gurugram, Noida, Faridabad, and Ghaziabad**. It optimizes daily travel for speed, cost in ₹, and net carbon footprint reductions.

---

## 🌟 Key Features

* 🚇 **Multimodal Routing Engine**: Seamlessly compares Delhi Metro, DTC Buses, BluSmart EVs, CNG Autos, and Rapido Bikes with live CO₂ calculations.
* 🚦 **Turn-by-Turn Navigation**: Real-time simulation mode with voice turn prompts, active speed/ETA tracking, and shareable live GPS links.
* 🎫 **Digital Contactless QR Tickets**: Generated DMRC Metro & DTC Bus tickets valid at automated turnstile AFCS gates.
* 🚖 **Cab & Ride-Hailing Layer**: Integrated provider options with direct mobile app deep links (`uber://`, `olacabs://`, `rapido://`, `blusmart.in`).
* 📜 **Govt Civic Integration**: Auto-drafts formal grievance complaints formatted for **CPGRAMS**, **MCD 311**, and **Delhi Traffic Police** with mandatory user preview before submission.
* 💳 **Razorpay Sandbox Checkout**: PCI-compliant payment gateway supporting UPI QR codes, Debit/Credit Cards, and Net Banking without saving raw credentials.
* 📄 **OCR Receipt Scanner**: Drag-and-drop receipt scanner for fuel, tolls, and cab fares with user verification before saving to corporate reimbursement claims.
* 🤖 **EcoRoute AI Assistant**: Powered by Gemini 1.5 Flash for domain-aware transit advisories, route scoring, and weather alerts.
* 🛡️ **Emergency SOS Control**: 1-click panic alert broadcasting live location to emergency contacts and nearby police stations.

---

## 🛡️ Service Status Badges

EcoRoute uses provider-independent service adapters with explicit status indicators:
* 🟢 **LIVE** — Verified real-time data returned from configured API keys.
* 🟡 **DEMO** — Realistic seeded simulation mode when API keys are unconfigured.
* 🔵 **EXTERNAL** — Deep links or redirects to official provider apps and government portals.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router) + React + TypeScript
* **Styling**: Tailwind CSS + Custom Glassmorphism Theme
* **Database**: Prisma ORM + SQLite (`prisma/schema.prisma`)
* **State & Icons**: Lucide React + Tailwind Utilities

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VishuRG/ecoRoute.git
   cd ecoRoute
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open app**:
   Navigate to [http://localhost:3000](http://localhost:3000)
