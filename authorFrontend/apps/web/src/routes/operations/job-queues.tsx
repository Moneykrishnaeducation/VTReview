import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { JobQueueItem } from "../../types/admin";
import {
  Cpu,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
  Download,
  Filter,
  Search,
  X,
  RotateCcw,
} from "lucide-react";

export default function JobQueues() {
  const { jobQueues } = useAdmin();
  const [jobs, setJobs] = useState<JobQueueItem[]>(jobQueues);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredJobs = jobs.filter((j) => {
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        j.id.toLowerCase().includes(q) ||
        j.jobName.toLowerCase().includes(q) ||
        j.jobType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTriggerJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "running", startedAt: "Just now" } : j))
    );
    setToastMessage(`Job ${jobId} triggered successfully.`);
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: "completed", durationMs: 16400 } : j))
      );
    }, 2500);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 text-xs font-sans w-full pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-[11px] mb-1 font-semibold">
            <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>BACKGROUND WORKERS &amp; QUEUE RUNNERS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Automated Cron Jobs &amp; Ingestion Workers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Monitor and trigger real-time spread telemetry ingestion, regulator API registry crawlers, and cache purging jobs.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grid of Job Runners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => {
          const isRunning = job.status === "running";
          return (
            <div
              key={job.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 bg-white dark:bg-slate-900 shadow-xs ${
                isRunning
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400">
                      {job.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        job.status === "running"
                          ? "bg-blue-500 text-white animate-pulse"
                          : job.status === "completed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{job.jobName}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerJob(job.id)}
                  disabled={isRunning}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 disabled:opacity-50 shadow-xs"
                >
                  <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
                  <span>Run Now</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500 space-y-1.5">
                <div className="flex justify-between">
                  <span>Started:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{job.startedAt}</span>
                </div>
                {job.recordsProcessed !== undefined && (
                  <div className="flex justify-between">
                    <span>Records Processed:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {job.recordsProcessed.toLocaleString()} records
                    </span>
                  </div>
                )}
                {job.durationMs !== undefined && (
                  <div className="flex justify-between">
                    <span>Execution Duration:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {(job.durationMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
