"use client";

import { useState } from "react";
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, Lock, ArrowRight, Sparkles } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export default function PaymentsPage() {
  const [method, setMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const amount = 65; // ₹60 fare + ₹5 green offset

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          description: "EcoRoute Metro Ticket & Carbon Offset",
          customerName: "Rahul Sharma",
          customerEmail: "rahul@example.com",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Razorpay Sandbox Checkout <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Secure Payment Gateway & instant digital transaction receipts
          </p>
        </div>
        <DemoBadge message="Razorpay Sandbox Mode" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          {/* Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Payment Gateway Option
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
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    method === m.id
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-white/5 border-white/8 text-slate-400"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleProcessPayment} className="space-y-4">
            {method === "UPI" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/8 text-center space-y-3">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ecoroute@razorpay&pn=EcoRoute&am=65"
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-slate-300">Scan using Google Pay, PhonePe, Paytm, or CRED</div>
              </div>
            )}

            {method === "Card" && (
              <div className="space-y-3">
                <input type="text" placeholder="Card Number (4000 0000 0000 0002)" className="eco-input text-xs py-3" defaultValue="4000 0000 0000 0002" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className="eco-input text-xs py-3" defaultValue="12/28" />
                  <input type="password" placeholder="CVV" className="eco-input text-xs py-3" defaultValue="123" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="payment-submit-btn"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-sm hover:opacity-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? "Authorizing Payment..." : `Pay ₹${amount} via Razorpay Sandbox`}
            </button>
          </form>
        </div>

        {/* Order Summary & Receipt Modal */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Order Summary</h2>
            <div className="space-y-2 text-xs border-b border-white/8 pb-4">
              <div className="flex justify-between text-slate-300">
                <span>DMRC Metro Token (Rajiv Chowk → Cyber City)</span>
                <span className="font-mono text-white">₹60.00</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Green Delhi Carbon Offset Fund</span>
                <span className="font-mono text-emerald-400">₹5.00</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-white">Total Amount Due</span>
              <span className="text-emerald-400 font-mono text-lg">₹{amount}.00</span>
            </div>
          </div>

          {receipt && (
            <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Transaction Success!
              </div>
              <div className="space-y-1 text-slate-300 font-mono">
                <div>Txn ID: {receipt.transactionId}</div>
                <div>Receipt: {receipt.receiptNumber}</div>
                <div>Status: VERIFIED</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
