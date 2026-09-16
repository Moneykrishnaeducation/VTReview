import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { ComplaintAdmin } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Send,
  Eye,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function ComplaintManagement() {
  const { complaints, updateComplaintStatus, setSelectedEvidenceModal, evidenceList, activeRoleDef } = useAdmin();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(complaints[0]?.id || "");
  const [resolutionNote, setResolutionNote] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedCase = complaints.find((c) => c.id === selectedCaseId) || complaints[0];
  const linkedEvidence = selectedCase?.evidenceIds?.[0] ? evidenceList.find((e) => e.id === selectedCase.evidenceIds[0]) : null;

  const handleUpdate = (status: ComplaintAdmin["status"]) => {
    if (!selectedCase) return;
    updateComplaintStatus(selectedCase.id, status, resolutionNote || `Case status updated to ${status}.`);
    setActionSuccess(`Case #${selectedCase.caseNumber} status updated to ${status.toUpperCase()}.`);
    setTimeout(() => setActionSuccess(null), 4000);
    setResolutionNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-[11px] mb-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>DISPUTE ARBITRATION CONSOLE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Trader Complaints & Financial Dispute Mediation
          </h1>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Split-Pane Dispute Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Col (5 cols): Dispute Cases List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between font-bold text-slate-200 pb-2 border-b border-slate-800">
            <span>Formal Dispute Cases ({complaints.length})</span>
            <span className="text-[10px] text-slate-500 font-mono">SELECT CASE</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto custom-scrollbar">
            {complaints.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-slate-950 border-rose-500/50 shadow-md ring-1 ring-rose-500/20"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-amber-400 text-[11px]">{c.caseNumber}</span>
                      <div className="font-bold text-white text-sm">{c.brokerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-rose-400">${c.claimAmount.toLocaleString()}</div>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                  </div>

                  <div className="text-slate-400 text-[11px] line-clamp-1">{c.claimTitle}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                    <span>Trader: {c.userName}</span>
                    <span>{c.submittedAt.split(" ")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Case Detail & Timeline */}
        {selectedCase ? (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                    {selectedCase.caseNumber}
                  </span>
                  <StatusBadge status={selectedCase.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-white">{selectedCase.claimTitle}</h3>
                <div className="text-slate-400 text-[11px]">
                  Claimant: <strong className="text-slate-200">{selectedCase.userName}</strong> ({selectedCase.userEmail}) vs <strong className="text-amber-400">{selectedCase.brokerName}</strong>
                </div>
              </div>

              <div className="text-right bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Disputed Amount</div>
                <div className="text-base font-black text-rose-400">${selectedCase.claimAmount.toLocaleString()} {selectedCase.currency}</div>
              </div>
            </div>

            {/* Claim Description Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-500">Allegation Summary</div>
              <p className="text-slate-300 leading-relaxed">{selectedCase.claimDescription}</p>
            </div>

            {/* Attached Evidence & Wire Confirmation */}
            {linkedEvidence && (
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-slate-200">{linkedEvidence.title}</span>
                    <div className="text-[10px] font-mono text-slate-500">
                      Record: {linkedEvidence.id} • SHA-256 Verified
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvidenceModal(linkedEvidence)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-amber-400" />
                  <span>Inspect Swift Proof</span>
                </button>
              </div>
            )}

            {/* Interactive Milestone Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs">Dispute Case Timeline & Actions</h4>
              <div className="space-y-2">
                {selectedCase.timeline.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{t.title}</span>
                      <span className="font-mono text-[10px] text-slate-500">{t.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{t.description}</p>
                    <div className="text-[10px] text-slate-500">Actor: {t.actor} ({t.role})</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arbitration Action Console */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs">Mediation Action Console</h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Resolution Notes / Official Mediation Statement *
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Record formal mediation outcome (e.g. Bank wire settled successfully; client confirmed receipt of funds in full)..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleUpdate("broker_contacted")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Dispatch Formal Broker Inquiry
                </button>

                <button
                  onClick={() => handleUpdate("resolved")}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark Case Resolved & Settled</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
