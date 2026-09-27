import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EcoRoute — Smarter Commutes. Zero Carbon Guilt.",
    template: "%s | EcoRoute",
  },
  description:
    "Real-time multimodal travel intelligence for Delhi-NCR. Compare Metro, Bus, Cab, Auto routes with CO₂ tracking, live alerts, and smart expense management.",
  keywords: ["Delhi Metro", "DTC Bus", "travel planner", "route comparison", "carbon footprint", "Delhi-NCR commute", "EcoRoute"],
  authors: [{ name: "EcoRoute Team" }],
  creator: "EcoRoute",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ecoroute.app",
    siteName: "EcoRoute",
    title: "EcoRoute — Smarter Commutes. Zero Carbon Guilt.",
    description: "India's premium climate-tech travel intelligence platform for Delhi-NCR commuters.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoRoute — Smarter Commutes. Zero Carbon Guilt.",
    description: "Real-time multimodal travel intelligence for Delhi-NCR.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased bg-[#060913]`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
