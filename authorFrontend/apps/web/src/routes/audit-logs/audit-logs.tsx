import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import { AuditTimeline } from "../../components/audit-timeline";
import { History, Search, Download, ShieldCheck, Filter } from "lucide-react";

export default function AuditLogs() {
  const { auditLogs } = useAdmin();
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== "all" && log.action !== actionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.id.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.entityName.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q) ||
        (log.evidenceId && log.evidenceId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-mono text-[11px] mb-1">
            <History className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>IMMUTABLE SYSTEM LEDGER ({auditLogs.length} Events)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Immutable Audit Trail & Compliance Log
          </h1>
        </div>

        <button className="px-3.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
          <Download className="h-3.5 w-3.5" />
          <span>Export Audit Ledger (JSON/CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search audit ID, actor, entity, evidence number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-amber-500 font-mono"
          >
            <option value="all">All Mutation Actions</option>
            <option value="VERIFY">VERIFY (License Certified)</option>
            <option value="SCORE_CHANGE">SCORE_CHANGE (Delta Proposed)</option>
            <option value="APPROVE">APPROVE (Rating Signed)</option>
            <option value="RESOLVE">RESOLVE (Dispute Closed)</option>
            <option value="PUBLISH">PUBLISH (Guide / Review)</option>
          </select>
        </div>
      </div>

      {/* Main Audit Timeline View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <AuditTimeline entries={filteredLogs} />
      </div>
    </div>
  );
}
