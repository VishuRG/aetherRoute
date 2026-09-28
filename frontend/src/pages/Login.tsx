// Login Page Component for AetherRoute
// Connects to SQLite database via dbService with Apple Maps & Airbnb aesthetic

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Database,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const authLoading = useAppStore((s) => s.authLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate("/plan");
    } else {
      setErrorMsg(res.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 topo-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel shadow-layered space-y-6"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-forest text-white shadow-soft mx-auto mb-1">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sora text-dark-bg dark:text-cream">
            Welcome to AetherRoute
          </h1>
          <p className="text-xs text-muted-dark dark:text-cream/70">
            Sign in to access your saved corridors, EV Range Guard, and trip history
          </p>
        </div>

        {/* Database Badge */}
        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-forest/10 dark:bg-forest/20 text-forest dark:text-forest-mint border border-forest/30 text-[11px] font-mono font-bold mx-auto w-max">
          <Database className="w-3.5 h-3.5" />
          <span>Connected to SQL Database (SQLite)</span>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3.5 rounded-2xl bg-vibrant-orange/15 border border-vibrant-orange/30 text-vibrant-orange text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email */}
          <div>
            <label className="block font-bold text-dark-bg dark:text-cream mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-muted-dark" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-warm/50 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream focus:outline-none focus:border-forest text-xs font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-dark-bg dark:text-cream">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-muted-dark" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-cream-warm/50 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream focus:outline-none focus:border-forest text-xs font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-muted-dark hover:text-dark-bg dark:hover:text-cream"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 rounded-2xl font-bold font-sora text-sm bg-forest hover:bg-forest-deep text-white shadow-glowGreen flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
          >
            {authLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>


        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-muted-dark dark:text-cream/70">
          Don't have an account yet?{" "}
          <Link
            to="/signup"
            className="font-bold text-forest dark:text-forest-mint hover:underline"
          >
            Create free account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
