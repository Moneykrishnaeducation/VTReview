import React from "react";
import { useAdmin } from "../context/admin-context";
import { StatusBadge } from "./status-badge";
import { X, ShieldCheck, Download, ExternalLink, Calendar, Hash, FileText, UserCheck, AlertTriangle } from "lucide-react";

export function EvidenceModal() {
  const { selectedEvidenceModal, setSelectedEvidenceModal } = useAdmin();

  if (!selectedEvidenceModal) return null;

  const ev = selectedEvidenceModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                {ev.id}
              </span>
              <StatusBadge status={ev.status} size="sm" />
            </div>
            <h3 className="text-base font-bold text-white leading-snug">{ev.title}</h3>
          </div>
          <button
            onClick={() => setSelectedEvidenceModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Mock Document Preview Box */}
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-mono text-[10px] rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>SHA-256 Verified Vault Record</span>
            </div>

            <FileText className="h-12 w-12 text-amber-500/80 mx-auto" />
            <div>
              <div className="font-bold text-slate-200 text-sm">{ev.title}</div>
              <div className="text-slate-500 font-mono text-[11px]">
                Format: {ev.fileFormat} • Size: {(ev.fileSizeBytes / 1024).toFixed(1)} KB
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-left font-mono text-[11px] text-slate-400 space-y-1">
              <div><strong>Entity:</strong> {ev.relatedEntityName} ({ev.relatedEntityType})</div>
              <div><strong>Checksum:</strong> {ev.checksum}</div>
              <div><strong>Uploaded by:</strong> {ev.uploadedBy} on {ev.uploadedAt}</div>
              {ev.reviewer && <div><strong>Audited by:</strong> {ev.reviewer} ({ev.reviewedAt})</div>}
              {ev.expiryDate && <div><strong>Validity Window:</strong> Valid until {ev.expiryDate}</div>}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Analyst Verification Notes</h4>
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg text-slate-300 leading-relaxed">
              {ev.notes}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-mono text-[11px]">
            Status: <strong className="text-slate-300 uppercase">{ev.status}</strong>
          </div>

          <div className="flex items-center gap-2">
            {ev.sourceUrl && (
              <a
                href={ev.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
                <span>Open Source Register</span>
              </a>
            )}
            <button
              onClick={() => setSelectedEvidenceModal(null)}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
