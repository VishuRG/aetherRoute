"use client";

import { useState, useEffect } from "react";
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, Lock, ArrowRight, Sparkles, User, Wallet } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export default function PaymentsPage() {
  const [method, setMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const amount = 65; // ₹60 ticket fare + ₹5 carbon offset

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          description: "EcoRoute Transit Pass & Verified Carbon Offset",
          customerName: user?.name || "Aarav Sharma",
          customerEmail: user?.email || "commuter@ecoroute.in",
          method,
        }),
      });

      const data = await res.json();
      setReceipt(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Secure Transit Checkout <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            PCI-DSS compliant payment gateway with instant digital receipts & QR passes
          </p>
        </div>
        <DemoBadge message="Secure Payment Gateway" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          {/* Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "UPI", label: "UPI (GPay / PhonePe)", icon: "📲" },
                { id: "Card", label: "Debit / Credit Card", icon: "💳" },
                { id: "NetBanking", label: "Net Banking", icon: "🏦" },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  id={`payment-method-${m.id.toLowerCase()}`}
                  className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    method === m.id
                      ? "bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                      : "bg-white/5 border-white/8 text-slate-400 hover:border-white/10"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-center">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleProcessPayment} className="space-y-4">
            {method === "UPI" && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/8 text-center space-y-3">
                <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center border-4 border-emerald-400/20 shadow-xl">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ecoroute@razorpay&pn=EcoRoute%20Transit&am=65"
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-white font-semibold">Scan with Google Pay, PhonePe, Paytm or CRED</div>
                <div className="text-[11px] text-slate-400 font-mono">UPI ID: ecoroute@razorpay</div>
              </div>
            )}

            {method === "Card" && (
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/8">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8901"
                    className="eco-input py-2.5 text-xs font-mono"
                    defaultValue="4532 8901 2345 6789"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="eco-input py-2.5 text-xs font-mono" defaultValue="12/28" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">CVV</label>
                    <input type="password" placeholder="•••" maxLength={3} className="eco-input py-2.5 text-xs font-mono" defaultValue="123" />
                  </div>
                </div>
              </div>
            )}

            {method === "NetBanking" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/8">
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Bank</label>
                <select className="eco-input py-2.5 text-xs font-medium">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="payment-submit-btn"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-black text-sm hover:opacity-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay ₹{amount} Securely
                </>
              )}
            </button>
          </form>

          {/* Receipt Confirmation */}
          {receipt && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Payment Successful!
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 pt-2 border-t border-white/8">
                <div>Transaction ID: <span className="font-mono text-white">{receipt.transactionId}</span></div>
                <div>Receipt: <span className="font-mono text-white">{receipt.receiptNumber}</span></div>
                <div>Amount Paid: <span className="font-mono text-emerald-400 font-bold">₹{receipt.amount}</span></div>
                <div>Status: <span className="text-emerald-400 font-semibold uppercase">{receipt.status}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary & Security */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Commute Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>DMRC Metro Digital Pass:</span>
                <span className="font-mono text-white font-semibold">₹60.00</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Carbon Offset Contribution:</span>
                <span className="font-mono text-emerald-400 font-semibold">₹5.00</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 border-t border-white/8 pt-2.5">
                <span>Subtotal:</span>
                <span className="font-mono text-white font-bold">₹65.00</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white border-t border-white/8 pt-2.5">
                <span>Total Payable:</span>
                <span className="font-mono text-emerald-400">₹65.00</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/8 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL Encrypted
              </div>
              <p>Zero credentials stored on servers. Compliant with RBI card tokenization guidelines.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
