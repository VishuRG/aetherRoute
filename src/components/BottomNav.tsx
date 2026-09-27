"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Bot, Receipt, AlertTriangle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/plan", label: "Plan", icon: Map },
  { href: "/ai", label: "AI", icon: Bot },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/emergency", label: "SOS", icon: AlertTriangle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" role="navigation" aria-label="Main navigation">
      <div className="glass-card border-t border-white/10 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const isSOS = item.href === "/emergency";

            return (
              <Link
                key={item.href}
                href={item.href}
                id={`bottom-nav-${item.label.toLowerCase()}`}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-3 rounded-xl transition-all duration-200 ${
                  isSOS
                    ? "bg-red-500/90 hover:bg-red-500 text-white rounded-xl"
                    : isActive
                    ? "text-emerald-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${isActive && !isSOS ? "scale-110" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-medium ${isSOS ? "" : isActive ? "text-emerald-400" : ""}`}>
                  {item.label}
                </span>
                {isActive && !isSOS && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
