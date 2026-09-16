import type { AuditLogEntry } from "../types/admin";
import { History, ShieldCheck, UserCheck, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { useAdmin } from "../context/admin-context";

interface AuditTimelineProps {
  entries: AuditLogEntry[];
  entityIdFilter?: string;
  limit?: number;
}

export function AuditTimeline({ entries, entityIdFilter, limit }: AuditTimelineProps) {
  const { setSelectedEvidenceModal, evidenceList } = useAdmin();

  let filtered = entityIdFilter ? entries.filter((e) => e.entityId === entityIdFilter) : entries;
  if (limit) filtered = filtered.slice(0, limit);

  if (filtered.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/30 rounded-lg border border-slate-800">
        No recorded audit events for this criteria.
      </div>
    );
  }

  const getActionBadge = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "VERIFY":
        return <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">VERIFIED</span>;
      case "REJECT":
        return <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">REJECTED</span>;
      case "SCORE_CHANGE":
        return <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">SCORE DELTA</span>;
      case "PUBLISH":
        return <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">PUBLISHED</span>;
      case "RESOLVE":
        return <span className="px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold">RESOLVED</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">{action}</span>;
    }
  };

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
      {filtered.map((log) => {
        const linkedEvidence = log.evidenceId ? evidenceList.find((ev) => ev.id === log.evidenceId) : null;

        return (
          <div key={log.id} className="relative group">
            {/* Timeline bullet */}
            <div className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-amber-500 transition-colors" />

            <div className="p-3.5 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-lg text-xs space-y-2 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getActionBadge(log.action)}
                  <span className="font-bold text-slate-200">{log.entityName}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
              </div>

              <p className="text-slate-300 leading-relaxed">{log.summary}</p>

              {(log.beforeValue || log.afterValue) && (
                <div className="flex items-center gap-2 font-mono text-[11px] p-2 bg-slate-950 rounded border border-slate-800/80">
                  {log.beforeValue && <span className="text-rose-400/90 line-through">{log.beforeValue}</span>}
                  {log.beforeValue && log.afterValue && <ArrowRight className="h-3 w-3 text-slate-500 shrink-0" />}
                  {log.afterValue && <span className="text-emerald-400 font-bold">{log.afterValue}</span>}
                </div>
              )}

              {log.reason && (
                <div className="text-[11px] text-slate-400 italic">
                  Rationale: "{log.reason}"
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    Audited by <strong className="text-slate-300">{log.actorName}</strong> ({log.actorRole})
                  </span>
                </div>

                {linkedEvidence && (
                  <button
                    onClick={() => setSelectedEvidenceModal(linkedEvidence)}
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-mono font-medium hover:underline cursor-pointer"
                  >
                    <span>Evidence: {linkedEvidence.id}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
