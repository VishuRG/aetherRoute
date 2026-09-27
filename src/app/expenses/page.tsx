"use client";

import { useState } from "react";
import {
  Wallet, Upload, FileText, CheckCircle2, DollarSign, ArrowUpRight,
  Sparkles, Fuel, Car, Ticket, Calendar, ShieldCheck, AlertCircle
} from "lucide-react";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";

export default function ExpensesPage() {
  const [uploading, setUploading] = useState(false);
  const [scannedExpense, setScannedExpense] = useState<any>(null);
  const [expenses, setExpenses] = useState([
    { id: "e1", vendor: "DMRC Metro Ticket", amount: 60, date: "2026-09-27", category: "Transport", reimbursable: true, confirmed: true },
    { id: "e2", vendor: "Indian Oil Corporation, CP", amount: 1250, date: "2026-09-25", category: "Fuel", reimbursable: true, confirmed: true },
    { id: "e3", vendor: "Uber Premier (CP -> Cyber City)", amount: 320, date: "2026-09-24", category: "Transport", reimbursable: true, confirmed: true },
    { id: "e4", vendor: "DLF Parking Plaza", amount: 100, date: "2026-09-22", category: "Parking", reimbursable: false, confirmed: true },
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setScannedExpense(data);
    } catch (err) {
      console.error("Receipt upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmOCRResult = () => {
    if (!scannedExpense) return;
    const newExp = {
      id: `e_${Date.now()}`,
      vendor: scannedExpense.vendor,
      amount: scannedExpense.amount,
      date: scannedExpense.date,
      category: scannedExpense.category,
      reimbursable: true,
      confirmed: true,
    };
    setExpenses([newExp, ...expenses]);
    setScannedExpense(null);
    alert("OCR Expense details verified and saved to ledger!");
  };

  const totalSpend = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const reimbursableTotal = expenses.filter((e) => e.reimbursable).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Expense & OCR Scanner <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated receipt scanning & corporate reimbursement management
          </p>
        </div>
        <ServiceStatusBadge status={scannedExpense?.dataStatus || "DEMO"} label="Computer Vision OCR Engine" />
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Tracked Spend</div>
            <div className="text-2xl font-black text-white font-mono">₹{totalSpend}</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Reimbursable Spend</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">₹{reimbursableTotal}</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Approved Claims</div>
            <div className="text-2xl font-black text-white font-mono">{expenses.length} Receipts</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OCR Uploader Panel */}
        <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-400" /> Scan Travel Receipt
          </h2>

          <div className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-8 text-center space-y-3 transition-colors relative cursor-pointer group">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              id="expense-file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Click or Drag & Drop Receipt</div>
              <div className="text-[11px] text-slate-400">Supports JPG, PNG, PDF (Fuel, Tolls, Cabs, Metro)</div>
            </div>
          </div>

          {uploading && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-center space-y-2">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="font-bold text-emerald-300">Extracting receipt fields via OCR...</div>
            </div>
          )}

          {/* Scanned Result Review Modal */}
          {scannedExpense && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-xs space-y-3">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> OCR Extracted Details</span>
                <ServiceStatusBadge status={scannedExpense.dataStatus} />
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/8 space-y-1.5 text-slate-200">
                <div>Vendor: <input type="text" value={scannedExpense.vendor} onChange={(e) => setScannedExpense({ ...scannedExpense, vendor: e.target.value })} className="eco-input py-1 text-xs font-bold text-white" /></div>
                <div>Amount (₹): <input type="number" value={scannedExpense.amount} onChange={(e) => setScannedExpense({ ...scannedExpense, amount: Number(e.target.value) })} className="eco-input py-1 text-xs font-bold text-emerald-400 font-mono" /></div>
                <div>Category: <input type="text" value={scannedExpense.category} onChange={(e) => setScannedExpense({ ...scannedExpense, category: e.target.value })} className="eco-input py-1 text-xs font-bold text-white" /></div>
              </div>

              <div className="p-2 rounded bg-amber-500/10 text-amber-300 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> User verification required before saving
              </div>

              <button
                onClick={handleConfirmOCRResult}
                id="expense-confirm-ocr-btn"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-xs hover:opacity-95 shadow-md flex items-center justify-center gap-1.5"
              >
                Confirm & Save Expense Entry
              </button>
            </div>
          )}
        </div>

        {/* Expense History List & Batch Claim Button */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Verified Expense Ledger
            </h2>

            <button
              onClick={() => alert(`Batch Reimbursement Claim submitted for ₹${reimbursableTotal}!`)}
              id="expense-reimburse-btn"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              Submit Reimbursement Claim (₹{reimbursableTotal}) <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-white/8">
            {expenses.map((exp) => (
              <div key={exp.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg text-emerald-400 shrink-0">
                    {exp.category === "Fuel" ? "⛽" : exp.category === "Parking" ? "🅿️" : "🚕"}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{exp.vendor}</div>
                    <div className="text-slate-400 text-[11px]">{exp.date} • {exp.category}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-sm font-mono">₹{exp.amount}</div>
                  {exp.reimbursable ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                      Reimbursable
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                      Personal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
