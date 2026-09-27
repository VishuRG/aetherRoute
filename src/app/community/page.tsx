"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ThumbsUp, AlertTriangle, Plus, MapPin, Building2, Sparkles } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { EcoMap } from "@/components/EcoMap";
import { DEMO_COMMUNITY_REPORTS } from "@/lib/demo-data";

export default function CommunityPage() {
  const [reports, setReports] = useState(DEMO_COMMUNITY_REPORTS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");

  const handleUpvote = (id: string) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep = {
      id: `cr-${Date.now()}`,
      category,
      title,
      description,
      address,
      lat: 28.6328,
      lng: 77.2197,
      upvotes: 1,
      status: "open",
      severity,
      timeAgo: "Just now",
      userName: "You",
    };
    setReports([newRep, ...reports]);
    setShowModal(false);
    setTitle("");
    setAddress("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Crowd Community Reports <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time pothole, waterlogging, & traffic hazard reports submitted by Delhi-NCR commuters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            id="community-report-hazard-btn"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Report Hazard
          </button>
          <DemoBadge message="Crowdsourced Hazard Network" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Feed */}
        <div className="lg:col-span-2 space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">
                      {rep.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.severity === "critical"
                          ? "bg-red-500/20 text-red-400"
                          : rep.severity === "high"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {rep.severity}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{rep.title}</h3>
                </div>

                <button
                  onClick={() => handleUpvote(rep.id)}
                  id={`community-upvote-${rep.id}`}
                  className="px-3 py-1.5 rounded-xl glass-card border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {rep.upvotes}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rep.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/8 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {rep.address}</span>
                <div className="flex items-center gap-3">
                  <span>Reported by <strong>{rep.userName}</strong> • {rep.timeAgo}</span>
                  <Link
                    href={`/civic?title=${encodeURIComponent(rep.title)}&address=${encodeURIComponent(rep.address)}&desc=${encodeURIComponent(rep.description)}`}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5" /> Escalate to CPGRAMS
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hazard Map Center */}
        <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Live Delhi-NCR Hazard Map
          </div>
          <div className="h-96 w-full rounded-2xl overflow-hidden border border-white/10">
            <EcoMap
              center={{ lat: 28.6328, lng: 77.2197 }}
              zoom={11}
              markers={reports.map((r) => ({
                id: r.id,
                position: { lat: r.lat, lng: r.lng },
                title: r.title,
                type: "alert",
              }))}
            />
          </div>
        </div>
      </div>

      {/* Modal for reporting hazard */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl border border-white/10 max-w-lg w-full space-y-4">
            <div className="text-lg font-bold text-white">Report New Road / Transit Hazard</div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Deep pothole near ITO flyover"
                  className="eco-input py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="eco-input py-2.5">
                    <option value="Pothole">Pothole</option>
                    <option value="Waterlogging">Waterlogging</option>
                    <option value="Signal">Broken Traffic Signal</option>
                    <option value="Construction">Unmarked Construction</option>
                    <option value="Streetlight">Dark Stretch / Streetlight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Severity</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="eco-input py-2.5">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Location Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="e.g. Ring Road near ITO, New Delhi"
                  className="eco-input py-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide context so authorities & commuters are informed..."
                  className="eco-input py-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl glass-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
