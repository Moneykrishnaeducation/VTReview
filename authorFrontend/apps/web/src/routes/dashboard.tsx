import React from "react";
import { Link } from "react-router";
import { useAdmin } from "../context/admin-context";
import { StatusBadge } from "../components/status-badge";
import { AuditTimeline } from "../components/audit-timeline";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Building2,
  FileText,
  Star,
  Activity,
  Server,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Flame,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const {
    brokers,
    verifications,
    ratingProposals,
    reviews,
    complaints,
    dataQualityIssues,
    jobQueues,
    auditLogs,
    pendingVerificationsCount,
    pendingReviewsCount,
    pendingComplaintsCount,
    pendingRatingsCount,
    criticalIssuesCount,
    activeRoleDef,
  } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Top Banner: Operational Mission & Current Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] font-bold">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>RESEARCH OPERATIONS CONSOLE</span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Financial Research, Regulatory Verification & Compliance Workspace
          </h1>

          <p className="text-xs text-slate-400 leading-relaxed">
            Active role: <strong className="text-slate-200">{activeRoleDef.name}</strong> ({activeRoleDef.description}). No critical public financial rating or regulatory license can be certified without verified register evidence.
          </p>
        </div>

        {/* Quick Summary Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <Link
            to="/regulation/verification"
            className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all group"
          >
            <div className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-emerald-400">
              Pending Licenses
            </div>
            <div className="font-mono text-xl font-black text-emerald-400 flex items-center justify-between mt-1">
              <span>{pendingVerificationsCount}</span>
              <ShieldCheck className="h-5 w-5 text-emerald-500/60" />
            </div>
          </Link>

          <Link
            to="/ratings"
            className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-amber-500/40 transition-all group"
          >
            <div className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-amber-400">
              Rating Proposals
            </div>
            <div className="font-mono text-xl font-black text-amber-400 flex items-center justify-between mt-1">
              <span>{pendingRatingsCount}</span>
              <Star className="h-5 w-5 text-amber-500/60" />
            </div>
          </Link>

          <Link
            to="/reviews"
            className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all group"
          >
            <div className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-cyan-400">
              Review Queue
            </div>
            <div className="font-mono text-xl font-black text-cyan-400 flex items-center justify-between mt-1">
              <span>{pendingReviewsCount}</span>
              <Clock className="h-5 w-5 text-cyan-500/60" />
            </div>
          </Link>

          <Link
            to="/complaints"
            className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-rose-500/40 transition-all group"
          >
            <div className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-rose-400">
              Active Disputes
            </div>
            <div className="font-mono text-xl font-black text-rose-400 flex items-center justify-between mt-1">
              <span>{pendingComplaintsCount}</span>
              <AlertTriangle className="h-5 w-5 text-rose-500/60" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main 3-Column Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Actionable Operational Queues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Regulatory Verification Queue Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Regulatory Verification Queue</span>
              </div>
              <Link to="/regulation/verification" className="text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                <span>View Full Queue ({pendingVerificationsCount})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80">
              {verifications.map((v) => (
                <div key={v.id} className="py-3 flex flex-wrap items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{v.brokerName}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                        {v.regulatorCode} #{v.licenseNumber}
                      </span>
                      <StatusBadge status={v.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{v.analystNotes}</div>
                  </div>

                  <Link
                    to="/regulation/verification"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
                  >
                    Inspect Register →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Community Moderation & Disputes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reviews Triage */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">Review Moderation</span>
                <Link to="/reviews" className="text-amber-400 hover:underline">
                  All ({reviews.length}) →
                </Link>
              </div>

              <div className="space-y-2">
                {reviews.slice(0, 2).map((r) => (
                  <div key={r.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 truncate">{r.userName}</span>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">"{r.title}"</p>
                    <div className="text-[10px] text-slate-500 font-mono">{r.brokerName} • {r.submittedAt}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispute Cases */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">Active Disputes</span>
                <Link to="/complaints" className="text-amber-400 hover:underline">
                  All ({complaints.length}) →
                </Link>
              </div>

              <div className="space-y-2">
                {complaints.slice(0, 2).map((c) => (
                  <div key={c.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold">{c.caseNumber}</span>
                      <span className="font-mono font-bold text-rose-400">${c.claimAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium truncate">{c.claimTitle}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{c.brokerName}</span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section C: Live Background Job Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                <Server className="h-4 w-4 text-cyan-400" />
                <span>Live Data Synchronization & Queues</span>
              </div>
              <Link to="/operations" className="text-amber-400 hover:underline">
                Job Monitors →
              </Link>
            </div>

            <div className="space-y-2">
              {jobQueues.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        job.status === "running"
                          ? "bg-amber-400 animate-ping"
                          : job.status === "completed"
                          ? "bg-emerald-400"
                          : "bg-rose-400"
                      }`}
                    />
                    <span className="font-bold text-slate-200">{job.jobName}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    {job.recordsProcessed && <span>{job.recordsProcessed.toLocaleString()} records</span>}
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Real-Time Audit Log Feed & Data Quality Alerts */}
        <div className="space-y-6">
          {/* Data Quality Warning Widget */}
          {criticalIssuesCount > 0 && (
            <div className="bg-rose-950/40 border border-rose-800 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <Flame className="h-4 w-4 text-rose-400 animate-pulse" />
                <span>{criticalIssuesCount} Critical Data Quality Alert</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Duplicate FCA license detected on unauthorized clone firm (Apex Trade Pro).
              </p>
              <Link
                to="/data-quality"
                className="inline-block pt-1 font-semibold text-rose-400 hover:text-rose-300 hover:underline text-[11px]"
              >
                Inspect in Data Quality Console →
              </Link>
            </div>
          )}

          {/* Immutable Audit Log Live Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-100 text-sm">Live Audit Feed</span>
              <Link to="/audit-logs" className="text-amber-400 hover:underline">
                Full Log ({auditLogs.length}) →
              </Link>
            </div>

            <AuditTimeline entries={auditLogs} limit={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
