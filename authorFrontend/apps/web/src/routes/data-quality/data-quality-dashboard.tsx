import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { DataQualityIssue } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import { CheckSquare2, Flame, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function DataQualityDashboard() {
  const { dataQualityIssues } = useAdmin();
  const [issues, setIssues] = useState<DataQualityIssue[]>(dataQualityIssues);
  const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);

  const handleResolve = (id: string) => {
    setIssues((prev) => prev.map((item) => (item.id === id ? { ...item, resolved: true } : item)));
    setResolvedMessage(`Data quality issue #${id} marked resolved.`);
    setTimeout(() => setResolvedMessage(null), 3000);
  };

  const criticalCount = issues.filter((i) => i.severity === "critical" && !i.resolved).length;
  const unresolvedCount = issues.filter((i) => !i.resolved).length;

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-300 font-mono text-[11px] mb-1">
            <CheckSquare2 className="h-3.5 w-3.5" />
            <span>AUTOMATED DATA SANITY & INTEGRITY ENGINE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Data Quality & Stale Verification Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
            {criticalCount} Critical
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
            {unresolvedCount} Active Alerts
          </span>
        </div>
      </div>

      {resolvedMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{resolvedMessage}</span>
        </div>
      )}

      {/* Issues Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
          <span>Integrity Alerts & Stale Audits</span>
          <span className="text-[10px] text-slate-500 font-mono">CONTINUOUS SANITY CHECK</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {issues.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex flex-wrap items-center justify-between gap-4 transition-colors ${
                item.resolved ? "bg-slate-50/50 dark:bg-slate-950/40 opacity-60" : "hover:bg-slate-50/80 dark:hover:bg-slate-850/40"
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{item.id}</span>
                  <StatusBadge status={item.severity} size="sm" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{item.entityName}</span>
                  <span className="text-slate-500 font-mono text-[10px]">({item.entityType})</span>
                  {item.resolved && (
                    <span className="px-2 py-0.2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                      RESOLVED
                    </span>
                  )}
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">{item.description}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Detected: {item.detectedAt} • Assigned: {item.assignedTo || "Auto-Triage"}
                </div>
              </div>

              {!item.resolved && (
                <button
                  onClick={() => handleResolve(item.id)}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Mark Resolved</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
