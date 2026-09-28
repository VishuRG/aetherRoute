"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("commuter@ecoroute.in");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("commuter@ecoroute.in");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background radial glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-black font-black" />
            </div>
            <div className="text-left">
              <span className="font-black text-white text-2xl tracking-tight leading-none block">EcoRoute</span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-semibold">Delhi-NCR Transit</span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access your Delhi-NCR multimodal travel intelligence
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl relative">
          {error && (
            <div className="p-3.5 mb-6 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 mb-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Login successful! Opening dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="login-email-input"
                  className="eco-input pl-10 pr-4 py-3 text-sm focus:border-emerald-400"
                  placeholder="commuter@ecoroute.in"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Use Seed Credentials
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password-input"
                  className="eco-input pl-10 pr-10 py-3 text-sm focus:border-emerald-400 font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              id="login-submit-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-black text-sm hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying with SQLite Database...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Redirecting...
                </>
              ) : (
                <>
                  Sign In to EcoRoute <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill helper */}
          <div className="mt-5 p-3 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-white block">Pre-configured Demo Account:</span>
              <span className="font-mono text-emerald-400">commuter@ecoroute.in</span> / <span className="font-mono">password123</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/25 border border-emerald-500/30 transition-all shrink-0"
            >
              Fill Demo
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/8 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-400 font-bold hover:underline" id="login-register-link">
              Create a free account
            </Link>
          </div>
        </div>

        {/* Security & Database Status Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Connected to SQL SQLite database with bcrypt encryption</span>
        </div>
      </div>
    </div>
  );
}
