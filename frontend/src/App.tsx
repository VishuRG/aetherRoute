// App Root Component
// Configures React Router, Lenis smooth scrolling, global Drawers, Toast Stack, and Boot Screen

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";

import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import { BootScreen } from "@/components/BootScreen";
import { Navbar } from "@/components/Navbar";
import { ToastStack } from "@/components/ToastStack";
import { Drawer } from "@/components/Drawer";
import { ReportSheet } from "@/components/ReportSheet";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { AIChatbot } from "@/components/AIChatbot";

import { Home } from "@/pages/Home";
import { Plan } from "@/pages/Plan";
import { Explore } from "@/pages/Explore";
import { SavedTrips } from "@/pages/SavedTrips";
import { Settings } from "@/pages/Settings";
import { NotFound } from "@/pages/NotFound";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/plan"
          element={
            <PageTransition>
              <Plan />
            </PageTransition>
          }
        />
        <Route
          path="/explore"
          element={
            <PageTransition>
              <Explore />
            </PageTransition>
          }
        />
        <Route
          path="/saved"
          element={
            <PageTransition>
              <SavedTrips />
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <Settings />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  const activeDrawer = useAppStore((s) => s.activeDrawer);
  const setActiveDrawer = useAppStore((s) => s.setActiveDrawer);
  const { reducedMotion } = useReducedMotion();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return (
    <BrowserRouter>
      {/* 1. First-Load Boot Animation Splash */}
      <BootScreen />

      {/* 2. Global Toast Notification Stack */}
      <ToastStack />

      {/* 3. Global Navbar */}
      <Navbar />

      {/* 4. Page Routing Content */}
      <main className="min-h-screen">
        <AnimatedRoutes />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Fixed Floating AI Journey Chatbot (Bottom Right) */}
      <AIChatbot />

      {/* 7. Global Right-side Drawers */}
      {/* Notification Center Drawer */}
      <Drawer
        isOpen={activeDrawer === "notificationCenter"}
        onClose={() => setActiveDrawer("none")}
        title="Notification Center"
        subtitle="Real-time route alerts, chargers & fuel updates"
      >
        <NotificationCenter />
      </Drawer>

      {/* Report Hazard Drawer */}
      <Drawer
        isOpen={activeDrawer === "reportProblem"}
        onClose={() => setActiveDrawer("none")}
        title="Report Road Hazard"
        subtitle="Broadcast live conditions to fellow commuters"
      >
        <ReportSheet />
      </Drawer>

      {/* Alert Preferences Drawer */}
      <Drawer
        isOpen={activeDrawer === "alertPreferences"}
        onClose={() => setActiveDrawer("none")}
        title="Notification Preferences"
        subtitle="Manage quiet hours, radius and sound triggers"
      >
        <div className="space-y-4 text-xs">
          <p className="text-muted-dark dark:text-cream/70">
            Customize which alerts are pushed to your screen during active navigation.
          </p>
          <div className="p-4 rounded-2xl bg-cream-warm dark:bg-dark-bg space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span>Battery Range Guard</span>
              <span className="text-forest">Always On</span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span>Accident Rerouting</span>
              <span className="text-forest">Always On</span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span>Fuel Price Savings</span>
              <span className="text-forest">Enabled</span>
            </div>
          </div>
          <button
            onClick={() => setActiveDrawer("none")}
            className="w-full py-2.5 rounded-xl bg-forest text-white font-bold"
          >
            Done
          </button>
        </div>
      </Drawer>
    </BrowserRouter>
  );
}

export default App;
