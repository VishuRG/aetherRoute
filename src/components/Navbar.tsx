"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Zap, Bell, Menu, User, MapPin, Search, X,
} from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  // Don't show on auth pages
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-white/8 md:left-64">
      <div className="flex items-center gap-3 px-4 h-14">
        {/* Mobile menu button */}
        <button
          id="navbar-menu-btn"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile logo */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2" id="navbar-logo-mobile">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-white text-sm">EcoRoute</span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 hidden md:block">
          {showSearch ? (
            <div className="flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search destinations, routes..."
                  className="eco-input pl-9 py-2 text-sm"
                  autoFocus
                  id="navbar-search-input"
                />
              </div>
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white"
                id="navbar-search-close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
              id="navbar-search-btn"
            >
              <Search className="w-4 h-4" />
              <span>Search destinations...</span>
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Location indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Delhi NCR</span>
          </div>

          {/* Notifications */}
          <Link
            href="/notifications"
            id="navbar-notifications"
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            id="navbar-profile"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
            aria-label="Profile"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
