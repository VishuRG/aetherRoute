"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Zap, Bell, Menu, User, MapPin, Search, X, LogOut,
  Ticket, Navigation, CloudSun, ChevronDown
} from "lucide-react";
import { DELHI_NCR_LOCATIONS } from "@/lib/locations";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [weather, setWeather] = useState<{ temp: number; desc: string; city: string } | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch logged in user & live weather
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    fetch("/api/weather?city=Delhi")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.temperature !== undefined) {
          setWeather({
            temp: data.temperature,
            desc: data.condition || "Clear",
            city: data.city || "Delhi",
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setProfileDropdownOpen(false);
      router.push("/login");
    } catch (e) {
      console.error("Logout error:", e);
      router.push("/login");
    }
  };

  const filteredLocations = searchQuery.trim()
    ? DELHI_NCR_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.zone.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

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
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Zap className="w-3.5 h-3.5 text-black font-bold" />
          </div>
          <span className="font-black text-white text-sm">EcoRoute</span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 hidden md:block relative">
          {showSearch ? (
            <div className="flex items-center gap-2 max-w-md relative">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search 35+ Delhi-NCR hubs, metro stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="eco-input pl-9 pr-8 py-2 text-xs"
                  autoFocus
                  id="navbar-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white"
                id="navbar-search-close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Suggestions Dropdown */}
              {filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-10 mt-1.5 glass-card-glow rounded-2xl border border-white/10 shadow-2xl p-1.5 z-50">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        router.push(`/routes?destination=${encodeURIComponent(loc.name)}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-300 flex items-center justify-between text-xs text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">{loc.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                        {loc.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/5"
              id="navbar-search-btn"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Search Delhi-NCR hubs, Metro lines...</span>
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Live Weather Pill */}
          {weather && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
              <CloudSun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{weather.temp}°C {weather.city}</span>
            </div>
          )}

          {/* Location indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
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
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              id="navbar-user-btn"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all text-xs text-slate-200"
              aria-label="User Profile"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-black font-black flex items-center justify-center text-xs shadow-md shadow-emerald-500/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-black" />}
              </div>
              <span className="hidden md:inline font-semibold max-w-[100px] truncate">
                {user?.name || "Commuter"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden md:inline" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card-glow rounded-2xl border border-white/10 shadow-2xl p-2 z-50 text-xs">
                <div className="p-2 border-b border-white/8 mb-1">
                  <div className="font-bold text-white truncate">{user?.name || "Eco Commuter"}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email || "commuter@ecoroute.in"}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    🌱 Verified Commuter
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Profile & Locations</span>
                </Link>

                <Link
                  href="/tickets"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Digital QR Tickets</span>
                </Link>

                <Link
                  href="/plan"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Plan Journey</span>
                </Link>

                <div className="border-t border-white/8 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
