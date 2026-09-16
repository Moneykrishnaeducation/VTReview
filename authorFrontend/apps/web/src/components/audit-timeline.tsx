import type { AuditLogEntry } from "../types/admin";
import { Clock, UserCheck, ArrowRight, ExternalLink } from "lucide-react";
import { useAdmin } from "../context/admin-context";

interface AuditTimelineProps {
  entries: AuditLogEntry[];
  entityIdFilter?: string;
  limit?: number;
  variant?: "3-column-table" | "timeline";
  threeDataOnly?: boolean;
}

export function AuditTimeline({
  entries,
  entityIdFilter,
  limit,
  variant = "timeline",
  threeDataOnly = false,
}: AuditTimelineProps) {
  const { setSelectedEvidenceModal, evidenceList } = useAdmin();

  let filtered = entityIdFilter
    ? entries.filter((e) => e.entityId === entityIdFilter)
    : entries;
  if (limit) filtered = filtered.slice(0, limit);

  if (filtered.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 bg-slate-100/50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800">
        No recorded audit events for this criteria.
      </div>
    );
  }

  const getActionBadge = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "VERIFY":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wide">
            VERIFIED
          </span>
        );
      case "REJECT":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-wide">
            REJECTED
          </span>
        );
      case "SCORE_CHANGE":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-wide">
            SCORE DELTA
          </span>
        );
      case "PUBLISH":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wide">
            PUBLISHED
          </span>
        );
      case "RESOLVE":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold tracking-wide">
            RESOLVED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold tracking-wide">
            {action}
          </span>
        );
    }
  };

  if (variant === "3-column-table") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <th className="pb-3 pr-4">AUDIT ID & TIMESTAMP</th>
              <th className="pb-3 px-4">MUTATION ACTION</th>
              <th className="pb-3 pl-4">ENTITY / TARGET</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition-colors"
              >
                {/* 1. AUDIT ID & TIMESTAMP */}
                <td className="py-3.5 pr-4 align-middle">
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                      {log.id}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </td>

                {/* 2. MUTATION ACTION */}
                <td className="py-3.5 px-4 align-middle">
                  {getActionBadge(log.action)}
                </td>

                {/* 3. ENTITY / TARGET */}
                <td className="py-3.5 pl-4 align-middle">
                  <div className="space-y-0.5">
                    <div
                      className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[260px]"
                      title={log.entityName}
                    >
                      {log.entityName}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {log.entityType} • {log.entityId}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
      {filtered.map((log) => {
        const linkedEvidence = log.evidenceId
          ? evidenceList.find((ev) => ev.id === log.evidenceId)
          : null;

        return (
          <div key={log.id} className="relative group">
            {/* Timeline bullet */}
            <div className="absolute -left-[27px] top-3 h-3.5 w-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-700 group-hover:border-amber-500 transition-colors" />

            <div className="p-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl text-xs space-y-2 transition-colors shadow-xs">
              {/* 1. Title / Entity Name & Status Badge */}
              <div className="flex flex-wrap items-center gap-2">
                {getActionBadge(log.action)}
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                  {log.entityName}
                </span>
              </div>

              {/* 2. Date & Time */}
              <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{log.timestamp}</span>
              </div>

              {/* 3. Status Transition / Value Box */}
              {(log.beforeValue || log.afterValue) && (
                <div className="flex items-center justify-between gap-2 font-mono text-[11px] p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200/80 dark:border-slate-800 my-1">
                  {log.beforeValue && (
                    <span className="text-rose-600 dark:text-rose-400 line-through font-medium">
                      {log.beforeValue}
                    </span>
                  )}
                  {log.beforeValue && log.afterValue && (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0 mx-1" />
                  )}
                  {log.afterValue && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {log.afterValue}
                    </span>
                  )}
                </div>
              )}

              {!threeDataOnly && (
                <>
                  {/* Summary */}
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-1">
                    {log.summary}
                  </p>

                  {/* Rationale */}
                  {log.reason && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic my-1">
                      Rationale: "{log.reason}"
                    </div>
                  )}

                  {/* Footer: Audited by & Evidence */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        Audited by{" "}
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">
                          {log.actorName}
                        </strong>{" "}
                        ({log.actorRole})
                      </span>
                    </div>

                    {log.evidenceId && (
                      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-bold">
                        <span>Evidence:</span>
                        <button
                          onClick={() => {
                            const ev = linkedEvidence || {
                              id: log.evidenceId!,
                              title: `Evidence ${log.evidenceId}`,
                              type: "complaint_proof",
                              relatedEntityType: "complaint",
                              relatedEntityId: log.entityId,
                              relatedEntityName: log.entityName,
                              uploadedBy: log.actorName,
                              uploadedAt: log.timestamp,
                              fileFormat: "PDF",
                              fileSizeBytes: 2048500,
                              status: "verified",
                              checksum: "sha256-4859a8c7e6d5b4a3",
                              notes: log.reason || "Audit log evidence record.",
                            };
                            setSelectedEvidenceModal(ev);
                          }}
                          className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <span>{log.evidenceId}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
