// Sticky Responsive Navbar with Shrink & Blur on scroll, Yellow scroll-progress bar,
// Sliding pill active indicator, Notification Center trigger with badge, and ThemeToggle

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import {
  Compass,
  MapPin,
  AlertTriangle,
  Bell,
  Bookmark,
  Settings,
  PlusCircle,
  Menu,
  X,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAppStore } from "@/store/useAppStore";
import { useNotifications } from "@/hooks/useNotifications";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Compass },
  { path: "/plan", label: "Plan Route", icon: MapPin },
  { path: "/explore", label: "Live Map", icon: AlertTriangle },
  { path: "/saved", label: "Saved Trips", icon: Bookmark },
  { path: "/settings", label: "Preferences", icon: Settings },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { unreadCount } = useNotifications();
  const setActiveDrawer = useAppStore((s) => s.setActiveDrawer);
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const logout = useAppStore((s) => s.logout);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <>
      {/* Sun Yellow Scroll Progress Bar at very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-sun z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-nav py-2.5 shadow-layered"
            : "bg-transparent py-4 border-b border-cream-border/30 dark:border-dark-border/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="AetherRoute Home"
          >
            <div className="w-9 h-9 rounded-2xl bg-forest dark:bg-forest flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black font-sora tracking-tight leading-none">
                Aether<span className="text-forest dark:text-forest-mint">Route</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider text-muted-dark dark:text-cream/60 uppercase">
                Multimodal Prime
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items with Sliding Pill Indicator */}
          <nav
            role="navigation"
            aria-label="Primary"
            className="hidden md:flex items-center gap-1 p-1 rounded-full bg-cream-warm/60 dark:bg-dark-card/60 border border-cream-border dark:border-dark-border backdrop-blur-md"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "text-dark-bg font-bold"
                      : "text-muted-dark dark:text-cream/70 hover:text-dark-bg dark:hover:text-cream"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>

                  {/* Sliding Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-sun rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Auth / User Profile, Report Hazard, Notifications, ThemeToggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* User Account / Auth Actions */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pr-2.5 rounded-full bg-cream-warm/80 dark:bg-dark-card border border-cream-border dark:border-dark-border hover:border-forest text-xs font-bold transition-all shadow-soft"
                  title="Account details"
                >
                  <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden lg:inline text-dark-bg dark:text-cream truncate max-w-[90px]">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-forest/15 text-forest dark:text-forest-mint">
                    ⚡{user.ecoPoints || 100}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel shadow-layered border border-cream-border dark:border-dark-border p-2 space-y-1 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-cream-border/60 dark:border-dark-border/60">
                      <p className="font-bold text-dark-bg dark:text-cream truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-dark dark:text-cream/60 truncate font-mono">{user.email}</p>
                    </div>
                    <Link
                      to="/saved"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-forest/10 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-forest" />
                      <span>Saved Trips</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-forest/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-sun-dark" />
                      <span>Vehicle & Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-vibrant-orange/10 text-vibrant-orange transition-colors font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-dark-bg dark:text-cream hover:bg-cream-border/40 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-deep shadow-soft transition-transform active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Quick Report Hazard CTA Button */}
            <button
              onClick={() => setActiveDrawer("reportProblem")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-vibrant-orange text-white hover:bg-vibrant-orangeHover shadow-glowOrange transition-transform active:scale-95"
              title="Report road hazard or closure"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>

            {/* Notification Bell with Animated Badge */}
            <button
              onClick={() => setActiveDrawer("notificationCenter")}
              className="relative p-2 rounded-full bg-cream-warm/70 dark:bg-dark-card/70 border border-cream-border dark:border-dark-border hover:bg-forest/10 dark:hover:bg-forest/20 text-dark-bg dark:text-cream transition-colors"
              aria-label={`Notifications: ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-vibrant-orange text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-sm"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-cream-warm/70 dark:bg-dark-card/70 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass-panel border-b border-cream-border dark:border-dark-border px-4 py-4 space-y-2 mt-2"
          >
            {/* Mobile Auth User Profile or Login/Signup */}
            <div className="pb-2 border-b border-cream-border dark:border-dark-border">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-forest/10 dark:bg-forest/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark-bg dark:text-cream">{user.name}</p>
                      <p className="text-[10px] text-muted-dark dark:text-cream/60 font-mono">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="p-1.5 text-vibrant-orange hover:bg-vibrant-orange/10 rounded-lg text-xs font-bold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 rounded-xl text-center text-xs font-bold border border-cream-border dark:border-dark-border"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 rounded-xl text-center text-xs font-bold bg-forest text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-sun text-dark-bg"
                      : "text-muted-dark dark:text-cream/80 hover:bg-forest/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-cream-border dark:border-dark-border flex justify-between items-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveDrawer("reportProblem");
                }}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-vibrant-orange text-white flex items-center justify-center gap-2 shadow-soft"
              >
                <PlusCircle className="w-4 h-4" />
                Report Hazard
              </button>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
};
