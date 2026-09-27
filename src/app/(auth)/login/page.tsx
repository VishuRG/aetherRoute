"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, Phone, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = Router();
  const [email, setEmail] = useState("commuter@ecoroute.in");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  function Router() {
    return useRouter();
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="font-black text-white text-2xl tracking-tight">EcoRoute</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to access your Delhi-NCR travel intelligence</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
          {error && (
            <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="login-email-input"
                  className="eco-input pl-10 py-3 text-sm"
                  placeholder="commuter@ecoroute.in"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-emerald-400 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password-input"
                  className="eco-input pl-10 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all mt-6"
            >
              {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Or continue with</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              id="login-google-btn"
              className="py-2.5 px-3 rounded-xl glass-card border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              id="login-phone-btn"
              className="py-2.5 px-3 rounded-xl glass-card border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> OTP
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/8 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-400 font-bold hover:underline" id="login-register-link">
              Create account
            </Link>
          </div>
        </div>

        {/* Demo notification badge */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Demo credentials pre-filled for immediate testing
        </div>
      </div>
    </div>
  );
}
