import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { EvidenceItem } from "../../types/admin";
import { EvidenceCard } from "../../components/evidence-card";
import { StatusBadge } from "../../components/status-badge";
import { FileText, ShieldCheck, Upload, Filter, Plus, Search, CheckCircle2 } from "lucide-react";

export default function EvidenceLibrary() {
  const { evidenceList } = useAdmin();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filteredEvidence = evidenceList.filter((ev) => {
    if (typeFilter !== "all" && ev.type !== typeFilter) return false;
    if (statusFilter !== "all" && ev.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.title.toLowerCase().includes(q) ||
        ev.relatedEntityName.toLowerCase().includes(q) ||
        ev.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUploadModal(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono text-[11px] mb-1">
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            <span>CENTRAL EVIDENCE VAULT ({evidenceList.length} Verified Records)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Evidence Library & Digital Audit Vault
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Evidence</span>
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>New evidence record ingested and SHA-256 cryptographic hash calculated.</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search evidence ID, broker name, checksum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Evidence Types</option>
            <option value="regulatory_register">Regulatory Register Snapshot</option>
            <option value="spread_test">Spread Test Telemetry Log</option>
            <option value="trading_statement">Trader Trade Statement</option>
            <option value="complaint_proof">Wire Slip / Dispute Proof</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((ev) => (
          <EvidenceCard key={ev.id} evidence={ev} />
        ))}
      </div>

      {/* Upload Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-xs space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Ingest New Evidence Document</h3>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Evidence Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FCA Register Screenshot for IC Markets UK"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Evidence Type *</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200">
                  <option value="regulatory_register">Regulatory Register Snapshot</option>
                  <option value="spread_test">Live Spread Telemetry Log (CSV)</option>
                  <option value="trading_statement">Trader Trade Statement (MT4/MT5)</option>
                  <option value="complaint_proof">Bank Wire Confirmation Slip</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Related Entity *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IC Markets / Broker ID"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Notes & Source URL</label>
                <textarea
                  placeholder="Official URL, date accessed, and verification notes..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Calculate Hash & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
