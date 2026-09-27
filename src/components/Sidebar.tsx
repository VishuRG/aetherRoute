"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Wallet, BarChart2, Ticket,
  Users, Building2, AlertTriangle, Bot, Bell, Settings,
  User, Zap, LogOut, X,
} from "lucide-react";
import { useState } from "react";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plan", label: "Plan Journey", icon: Map },
  { href: "/ai", label: "EcoRoute AI", icon: Bot },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/tickets", label: "Tickets", icon: Ticket },
];

const MORE_NAV = [
  { href: "/community", label: "Community", icon: Users },
  { href: "/civic", label: "Civic Reports", icon: Building2 },
  { href: "/emergency", label: "Emergency", icon: AlertTriangle, danger: true },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const NavItem = ({
    href,
    label,
    icon: Icon,
    danger = false,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    danger?: boolean;
  }) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        id={`sidebar-nav-${label.toLowerCase().replace(/\s/g, "-")}`}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          danger
            ? isActive
              ? "bg-red-500/20 text-red-400"
              : "text-red-400 hover:bg-red-500/10"
            : isActive
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
        <span>{label}</span>
        {isActive && !danger && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 surface-2 border-r border-white/8 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto`}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/8">
          <Link href="/dashboard" className="flex items-center gap-2.5" id="sidebar-logo">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="font-black text-white text-base leading-none">EcoRoute</div>
              <div className="text-[10px] text-emerald-400/80 font-medium">Delhi-NCR</div>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="mb-4">
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Main</p>
            {MAIN_NAV.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">More</p>
            {MORE_NAV.map((item) => (
              <NavItem key={item.href} {...(item as { href: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; danger?: boolean })} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/8">
          <div className="eco-card p-3 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
              <span className="text-xs font-medium text-emerald-400">Demo Mode Active</span>
            </div>
            <p className="text-[11px] text-slate-400">Using simulated Indian data. Add API keys for real-time data.</p>
          </div>
          <Link
            href="/login"
            id="sidebar-logout"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
