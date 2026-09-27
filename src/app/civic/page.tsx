"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, FileText, CheckCircle2, ExternalLink, Copy, Sparkles, Send } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

function CivicContent() {
  const searchParams = useSearchParams();
  const initTitle = searchParams.get("title") || "Severe Pothole on Ring Road near ITO";
  const initAddress = searchParams.get("address") || "Ring Road near ITO Flyover, New Delhi";
  const initDesc = searchParams.get("desc") || "Large pothole causing vehicle damage and traffic slowdown.";

  const [category, setCategory] = useState("Pothole");
  const [title, setTitle] = useState(initTitle);
  const [address, setAddress] = useState(initAddress);
  const [description, setDescription] = useState(initDesc);
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/civic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, description, address, reporterName: "Rahul Sharma" }),
      });
      const data = await res.json();
      setDraft(data);
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
            Govt Civic Integration Hub <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Auto-generate formal CPGRAMS, MCD & Delhi Traffic Police grievance complaints
          </p>
        </div>
        <DemoBadge message="Govt Portal Drafting Engine" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" /> Draft Grievance Details
          </h2>

          <form onSubmit={handleGenerateDraft} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Issue Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="eco-input py-2.5">
                <option value="Pothole">Pothole / Road Maintenance (PWD)</option>
                <option value="Waterlogging">Waterlogging (MCD / PWD)</option>
                <option value="Signal">Traffic Signal Failure (Delhi Police)</option>
                <option value="Streetlight">Streetlight Defect (MCD / DGVCL)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Subject Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="eco-input py-2.5" />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Location Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="eco-input py-2.5" />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Issue Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="eco-input py-2.5" />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="civic-generate-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? "Drafting Complaint..." : "Generate Official Grievance Draft"}
            </button>
          </form>
        </div>

        {/* Draft Result View */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Formatted Official Grievance Letter
            </h2>
            {draft && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                Ref: {draft.referenceNo}
              </span>
            )}
          </div>

          {draft ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/8 text-xs space-y-1">
                <div>Target Govt Department: <strong className="text-emerald-400">{draft.department}</strong></div>
                <div>Target Portal: <strong className="text-white">{draft.portalName}</strong></div>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                {draft.formattedBody}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(draft.formattedBody);
                    alert("Official complaint text copied to clipboard!");
                  }}
                  id="civic-copy-text-btn"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-card border border-white/10 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4 text-emerald-400" /> Copy Official Text
                </button>

                <a
                  href={draft.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="civic-portal-link"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  Submit on Official Govt Portal <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs space-y-2">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
              <div>Fill out the form on the left to auto-draft a formal government grievance letter.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CivicPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Civic Portal...</div>}>
      <CivicContent />
    </Suspense>
  );
}
