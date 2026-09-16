import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { LicenseVerificationItem } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  Clock,
  AlertTriangle,
  UserCheck,
  Eye,
} from "lucide-react";

export default function VerificationQueue() {
  const { verifications, verifyLicense, rejectLicense, setSelectedEvidenceModal, evidenceList, activeRoleDef } = useAdmin();

  const [selectedVerificationId, setSelectedVerificationId] = useState<string>(verifications[0]?.id || "");
  const [analystNotes, setAnalystNotes] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedItem = verifications.find((v) => v.id === selectedVerificationId) || verifications[0];
  const linkedEvidence = selectedItem ? evidenceList.find((e) => e.id === selectedItem.evidenceId) : null;

  const handleVerify = () => {
    if (!selectedItem) return;
    verifyLicense(selectedItem.id, analystNotes || "Direct register check confirms active license permissions.");
    setActionSuccess(`Certified and stamped license ${selectedItem.regulatorCode} #${selectedItem.licenseNumber}.`);
    setTimeout(() => setActionSuccess(null), 4000);
    setAnalystNotes("");
  };

  const handleReject = () => {
    if (!selectedItem) return;
    rejectLicense(selectedItem.id, analystNotes || "License details do not match official regulator register.");
    setActionSuccess(`Rejected license verification ${selectedItem.regulatorCode} #${selectedItem.licenseNumber}.`);
    setTimeout(() => setActionSuccess(null), 4000);
    setAnalystNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>COMPLIANCE CERTIFICATION WORKSPACE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Regulatory License Verification Queue
          </h1>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Pending Audits: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{verifications.filter((v) => v.status === "pending").length}</strong>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionSuccess} Immutable audit log registered.</span>
        </div>
      )}

      {/* Split-Pane Verification Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Col (5 cols): Queue List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span>License Applications ({verifications.length})</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Select to Inspect</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto custom-scrollbar">
            {verifications.map((item) => {
              const isSelected = item.id === selectedVerificationId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedVerificationId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-emerald-500/5 dark:bg-slate-950 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20"
                      : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{item.brokerName}</div>
                      <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        {item.regulatorCode} #{item.licenseNumber}
                      </div>
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <div className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-1">{item.licenseeEntity}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-800/80">
                    <span>{item.jurisdiction}</span>
                    <span>{item.submittedAt.split(" ")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Evidence Inspector & Verification Decision */}
        {selectedItem ? (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 dark:bg-amber-950/60 border border-amber-500/25 dark:border-amber-800 px-2 py-0.5 rounded">
                    {selectedItem.id}
                  </span>
                  <StatusBadge status={selectedItem.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedItem.brokerName} — {selectedItem.regulatorName}
                </h3>
              </div>

              {selectedItem.officialRegisterUrl && (
                <a
                  href={selectedItem.officialRegisterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Open Official Register</span>
                </a>
              )}
            </div>

            {/* Comparison Grid: Public Claim vs Official Register */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Submitted Broker Claim</div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <div><strong>Entity:</strong> {selectedItem.licenseeEntity}</div>
                  <div><strong>Regulator:</strong> {selectedItem.regulatorCode} ({selectedItem.jurisdiction})</div>
                  <div><strong>License:</strong> {selectedItem.licenseNumber}</div>
                  <div><strong>Confidence:</strong> {selectedItem.confidenceScore}%</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Linked Evidence Vault Record</span>
                </div>
                {linkedEvidence ? (
                  <div className="space-y-2">
                    <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">{linkedEvidence.title}</div>
                    <button
                      onClick={() => setSelectedEvidenceModal(linkedEvidence)}
                      className="w-full py-1 px-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-400 font-semibold rounded text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Inspect Evidence File ({linkedEvidence.id})</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px]">No snapshot attached.</div>
                )}
              </div>
            </div>

            {/* Analyst Notes */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-300 text-[11px]">Analyst Submission Notes</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedItem.analystNotes}</p>
            </div>

            {/* Compliance Decision Actions */}
            <div className="p-4 bg-slate-50/90 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Compliance Audit Decision</h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Verification Certification Notes *
                </label>
                <textarea
                  value={analystNotes}
                  onChange={(e) => setAnalystNotes(e.target.value)}
                  placeholder="Record mandatory verification details (e.g. Verified active status on ASIC connect register; company ACN 142 901 verified matching license holder)..."
                  rows={2}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500">
                  Auditor: <strong className="text-slate-800 dark:text-slate-300">{activeRoleDef.name}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 font-bold rounded-lg border border-rose-300 dark:border-rose-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject / Flag Clone</span>
                  </button>

                  <button
                    onClick={handleVerify}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify & Stamp License</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
