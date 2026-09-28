// Sign Up / Register Page Component for AetherRoute
// Saves new user account directly into the SQLite database with bcrypt hashing

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Database,
  Leaf,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const register = useAppStore((s) => s.register);
  const authLoading = useAppStore((s) => s.authLoading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeEco, setAgreeEco] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    const res = await register(name, email, password, mobile);
    if (res.success) {
      navigate("/plan");
    } else {
      setErrorMsg(res.error || "Account creation failed. Please try again.");
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
            Create Your Account
          </h1>
          <p className="text-xs text-muted-dark dark:text-cream/70">
            Join thousands of smart commuters navigating with zero hassle and minimum emissions
          </p>
        </div>

        {/* Database Badge */}
        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-forest/10 dark:bg-forest/20 text-forest dark:text-forest-mint border border-forest/30 text-[11px] font-mono font-bold mx-auto w-max">
          <Database className="w-3.5 h-3.5" />
          <span>Persistent SQLite Database Storage</span>
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-bold text-dark-bg dark:text-cream mb-1">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-muted-dark" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohit Sharma"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-warm/50 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream focus:outline-none focus:border-forest text-xs font-semibold"
              />
            </div>
          </div>

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
                placeholder="rohit@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-warm/50 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream focus:outline-none focus:border-forest text-xs font-semibold"
              />
            </div>
          </div>

          {/* Mobile Phone (Optional) */}
          <div>
            <label className="block font-bold text-dark-bg dark:text-cream mb-1">
              Mobile Number (Optional)
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 w-4 h-4 text-muted-dark" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98100 12345"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-warm/50 dark:bg-dark-bg/70 border border-cream-border dark:border-dark-border text-dark-bg dark:text-cream focus:outline-none focus:border-forest text-xs font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-bold text-dark-bg dark:text-cream mb-1">
              Password (min. 6 characters)
            </label>
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

          {/* Eco Pledge Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ecoPledge"
              checked={agreeEco}
              onChange={(e) => setAgreeEco(e.target.checked)}
              className="w-4 h-4 accent-forest cursor-pointer rounded"
            />
            <label htmlFor="ecoPledge" className="text-[11px] text-muted-dark dark:text-cream/80 cursor-pointer">
              I agree to receive eco-friendly route recommendations and live community alerts.
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 rounded-2xl font-bold font-sora text-sm bg-vibrant-orange hover:bg-vibrant-orangeHover text-white shadow-glowOrange flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
          >
            {authLoading ? (
              <span>Creating Account in Database...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-muted-dark dark:text-cream/70">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-bold text-forest dark:text-forest-mint hover:underline"
          >
            Sign in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
