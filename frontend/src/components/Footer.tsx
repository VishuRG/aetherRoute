// Branded Footer Component with keyboard shortcuts, links, and copyright

import React from "react";
import { Link } from "react-router-dom";
import { Compass, ShieldCheck, Heart, MapPin, Zap, Fuel, AlertTriangle } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-cream-border dark:border-dark-border bg-cream-warm/40 dark:bg-dark-card/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-white shadow-soft">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black font-sora tracking-tight">
                Aether<span className="text-forest dark:text-forest-mint">Route</span>
              </span>
            </Link>
            <p className="text-xs text-muted-dark dark:text-cream/70 leading-relaxed">
              Apple Maps precision meets Airbnb hospitality. Intelligent multimodal navigation,
              live community hazards, and smart EV Range Guard.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-forest dark:text-forest-mint font-bold">
              <span className="w-2 h-2 rounded-full bg-forest-mint animate-pulse" />
              <span>All Systems Operational • Delhi-NCR Corridor</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono font-bold uppercase text-dark-bg dark:text-cream tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-muted-dark dark:text-cream/70">
              <li>
                <Link to="/plan" className="hover:text-forest transition-colors">
                  Multi-Modal Route Planner
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-forest transition-colors">
                  Live Hazard Map & POIs
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-forest transition-colors">
                  Saved Trips & Corridors
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-forest transition-colors">
                  Vehicle Profiles & Range Guard
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono font-bold uppercase text-dark-bg dark:text-cream tracking-wider">
              Core Capabilities
            </h4>
            <ul className="space-y-1.5 text-muted-dark dark:text-cream/70">
              <li className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-forest" />
                <span>EV Superhub Availability (CCS2/Type 2)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-vibrant-orange" />
                <span>Real-Time Fuel Sparkline & Best Price</span>
              </li>
              <li className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-sun-dark" />
                <span>Community Hazard Reporting & Verification</span>
              </li>
            </ul>
          </div>

          {/* Shortcuts & WCAG */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono font-bold uppercase text-dark-bg dark:text-cream tracking-wider">
              Accessibility & Ethics
            </h4>
            <p className="text-muted-dark dark:text-cream/70 leading-relaxed text-[11px]">
              Full WCAG AA compliant contrast in both light and dark modes. Respects prefers-reduced-motion.
              Zero user tracking. Powered by OpenStreetMap contributors & CARTO.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cream-border/60 dark:bg-dark-border text-dark-bg dark:text-cream">
                Press Esc to close drawers
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-cream-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-dark dark:text-cream/60">
          <p>© {new Date().getFullYear()} AetherRoute Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>v2.5.0-production</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-vibrant-orange fill-current" /> for clean mobility
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
