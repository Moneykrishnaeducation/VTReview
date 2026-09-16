import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { JobQueueItem } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import { Server, Play, RotateCcw, XCircle, CheckCircle2, Clock, Activity } from "lucide-react";

export default function JobQueues() {
  const { jobQueues } = useAdmin();
  const [jobs, setJobs] = useState<JobQueueItem[]>(jobQueues);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleRetry = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: "running" as const, attempts: j.attempts + 1 } : j
      )
    );
    setActionNotice(`Job ${id} dispatched to active runner.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono text-[11px] mb-1">
            <Server className="h-3.5 w-3.5" />
            <span>BACKGROUND SYSTEM PROCESSORS & SYNC RUNNERS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Job Queues & API Data Synchronization
          </h1>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between font-bold text-white text-sm">
          <span>Active & Scheduled Background Jobs</span>
          <span className="text-[10px] text-slate-500 font-mono">AUTOMATED TELEMETRY</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold">{job.id}</span>
                  <span className="font-bold text-white text-sm">{job.jobName}</span>
                  <StatusBadge status={job.status} size="sm" />
                </div>

                <div className="text-slate-400 font-mono text-[11px]">
                  Type: {job.jobType} • Started: {job.startedAt}
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-[11px]">
                <div className="text-right">
                  <div className="text-slate-500 uppercase text-[10px] font-bold">Attempts</div>
                  <div className="text-slate-300">{job.attempts} / {job.maxAttempts}</div>
                </div>

                <div className="text-right">
                  <div className="text-slate-500 uppercase text-[10px] font-bold">Processed</div>
                  <div className="text-emerald-400 font-bold">{job.recordsProcessed?.toLocaleString() || "—"} recs</div>
                </div>

                {job.status === "failed" && (
                  <button
                    onClick={() => handleRetry(job.id)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retry Job</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
