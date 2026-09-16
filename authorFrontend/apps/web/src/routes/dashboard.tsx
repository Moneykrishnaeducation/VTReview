import React, { useState } from "react";
import { Link } from "react-router";
import { useAdmin } from "../context/admin-context";
import { StatusBadge } from "../components/status-badge";
import { AuditTimeline } from "../components/audit-timeline";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Star,
  Activity,
  Server,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Flame,
  Users,
  Search,
  RefreshCw,
  Sliders,
  DollarSign,
  FileCheck,
  Check,
  X,
  Lock,
  Layers,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function Dashboard() {
  const {
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
    verifyLicense,
    rejectLicense,
    approveRatingProposal,
    rejectRatingProposal,
    setIsSearchOpen,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<"all" | "verifications" | "ratings" | "disputes" | "jobs">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute total financial exposure claim amount from active disputes
  const totalClaimAmount = complaints.reduce((sum, c) => sum + (c.claimAmount || 0), 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage("Live operational queues refreshed from registry APIs.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

     

      {/* TOP KPI CARDS GRID (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/regulation/verification"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-xs transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Broker Directory
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white mb-1">
            {pendingVerificationsCount}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>FCA / ASIC audit priority</span>
          </div>
        </Link>

        {/* KPI 1: Pending Verifications */}
        <Link
          to="/regulation/verification"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-xs transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Pending Licenses
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white mb-1">
            {pendingVerificationsCount}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>FCA / ASIC audit priority</span>
          </div>
        </Link>

        {/* KPI 2: Rating Proposals */}
        <Link
          to="/ratings"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl shadow-xs transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Score Audits
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white mb-1">
            {pendingRatingsCount}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending compliance sign-off</span>
          </div>
        </Link>

        {/* KPI 3: Active Dispute Claims */}
        <Link
          to="/complaints"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 p-5 rounded-2xl shadow-xs transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Claim Exposure
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-rose-600 dark:text-rose-400 mb-1">
            ${(totalClaimAmount / 1000).toFixed(0)}k <span className="text-xs text-slate-500 font-normal">USD</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{pendingComplaintsCount} active dispute claims</span>
          </div>
        </Link>

        {/* KPI 4: Review Moderation */}
        <Link
          to="/reviews"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl shadow-xs transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              Review Queue
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white mb-1">
            {pendingReviewsCount}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
            <span>84% verified trader reviews</span>
          </div>
        </Link>

        {/* KPI 5: Data Quality Alerts */}
        <Link
          to="/data-quality"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl shadow-xs transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Risk & Quality
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white mb-1">
            {criticalIssuesCount}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-rose-500 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Critical alerts flagged</span>
          </div>
        </Link>
      </div>

      {/* WORKSPACE TAB FILTER BAR */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "all", label: "All Operations", icon: Layers },
            { id: "verifications", label: `Verifications (${pendingVerificationsCount})`, icon: ShieldCheck },
            { id: "ratings", label: `Score Audits (${pendingRatingsCount})`, icon: Star },
            { id: "disputes", label: `Disputes (${pendingComplaintsCount})`, icon: AlertTriangle },
            { id: "jobs", label: "Live System Sync", icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtered view</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID (2 COLUMNS: LEFT WORKSPACE 2/3, RIGHT AUDIT/INTELLIGENCE 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: OPERATIONAL QUEUES */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: REGULATORY VERIFICATION QUEUE */}
          {(activeTab === "all" || activeTab === "verifications") && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Regulatory Verification Queue
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cross-verify licensee records directly against official regulator databases
                    </p>
                  </div>
                </div>

                <Link
                  to="/regulation/verification"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Manage All ({verifications.length})</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {verifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {item.brokerName}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold">
                          {item.regulatorCode} #{item.licenseNumber}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        <strong className="text-slate-700 dark:text-slate-300">Entity:</strong> {item.licenseeEntity} • {item.jurisdiction}
                      </p>

                      <div className="text-[11px] text-slate-500 dark:text-slate-500 italic">
                        "{item.analystNotes}"
                      </div>
                    </div>

                    {/* Action Triggers */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "pending" && (
                        <>
                          <button
                            onClick={() => verifyLicense(item.id, "Verified via official registry search.")}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" /> Verify
                          </button>

                          <button
                            onClick={() => rejectLicense(item.id, "Discrepancy found in official register.")}
                            className="px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-600/20 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </button>
                        </>
                      )}

                      <a
                        href={item.officialRegisterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                        title="Open Official Regulator Register URL"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: RATING PROPOSALS MATRIX */}
          {(activeTab === "all" || activeTab === "ratings") && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Financial Rating Score Proposals
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Proposed scoring changes require compliance audit sign-off before publishing
                    </p>
                  </div>
                </div>

                <Link
                  to="/ratings"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Review Proposals ({ratingProposals.length})</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {ratingProposals.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {prop.brokerName}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold text-xs">
                          {prop.pillarName}
                        </span>

                        <span
                          className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${
                            prop.scoreDelta >= 0
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {prop.currentScore} → {prop.proposedScore} ({prop.scoreDelta >= 0 ? "+" : ""}{prop.scoreDelta} pts)
                        </span>

                        <StatusBadge status={prop.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        <strong>Reason:</strong> {prop.reason}
                      </p>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Proposed by {prop.proposedBy} • {prop.proposedAt}
                      </div>
                    </div>

                    {prop.status === "pending_review" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => approveRatingProposal(prop.id, "Compliance approval certified.")}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve Score
                        </button>

                        <button
                          onClick={() => rejectRatingProposal(prop.id, "Audit justification insufficient.")}
                          className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: COMMUNITY DISPUTES & CLAIMS */}
          {(activeTab === "all" || activeTab === "disputes") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reviews Triage Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <Users className="h-4 w-4 text-cyan-500" />
                    <span>Review Moderation Queue</span>
                  </div>
                  <Link to="/reviews" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {reviews.slice(0, 3).map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {rev.userName}
                        </span>
                        <StatusBadge status={rev.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                        "{rev.title}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                        <span>{rev.brokerName}</span>
                        <span>Rating: {"★".repeat(rev.rating)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Disputes Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    <span>Active Financial Claims</span>
                  </div>
                  <Link to="/complaints" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {complaints.slice(0, 3).map((cmp) => (
                    <div
                      key={cmp.id}
                      className="p-3.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                          {cmp.caseNumber}
                        </span>
                        <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                          ${cmp.claimAmount.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 font-bold truncate">
                        {cmp.claimTitle}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>{cmp.brokerName}</span>
                        <StatusBadge status={cmp.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: LIVE DATA SYNCHRONIZATION QUEUES */}
          {(activeTab === "all" || activeTab === "jobs") && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Live Data Sync & Crawler Monitors
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Automated background synchronization jobs & regulatory register scrapers
                    </p>
                  </div>
                </div>

                <Link to="/operations" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                  Job Console →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {jobQueues.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {job.jobName}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          job.status === "running"
                            ? "bg-amber-500 animate-ping"
                            : job.status === "completed"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <span>{job.recordsProcessed ? `${job.recordsProcessed.toLocaleString()} records` : "Queued"}</span>
                      <StatusBadge status={job.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DATA QUALITY & IMMUTABLE AUDIT STREAM */}
        <div className="space-y-6">
          {/* DATA QUALITY RISK ALERT WIDGET */}
          {criticalIssuesCount > 0 && (
            <div className="bg-rose-950/40 border border-rose-800/80 rounded-3xl p-5 text-xs space-y-3 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2.5 font-bold text-rose-400 text-sm">
                <Flame className="h-5 w-5 text-rose-500 animate-pulse shrink-0" />
                <span>{criticalIssuesCount} Critical Data Quality Alert</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Duplicate FCA regulatory license detected on unauthorized clone entity (<strong className="text-white">Apex Trade Pro</strong>). Immediate audit required.
              </p>

              <Link
                to="/data-quality"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md"
              >
                <span>Inspect in Quality Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* QUICK OPERATIONAL ACTION SHORTCUTS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Operations
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/regulation/verification"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 text-left transition-all group"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500">
                  Verify License
                </div>
                <div className="text-[10px] text-slate-500">FCA / ASIC Registers</div>
              </Link>

              <Link
                to="/ratings"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 text-left transition-all group"
              >
                <Star className="h-4 w-4 text-amber-500 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500">
                  Score Audit
                </div>
                <div className="text-[10px] text-slate-500">Pillar recalculation</div>
              </Link>

              <Link
                to="/evidence"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 text-left transition-all group"
              >
                <FileCheck className="h-4 w-4 text-cyan-500 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500">
                  Evidence Docs
                </div>
                <div className="text-[10px] text-slate-500">PDF & Screenshot Vault</div>
              </Link>

              <Link
                to="/users"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 text-left transition-all group"
              >
                <Users className="h-4 w-4 text-purple-500 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500">
                  RBAC Users
                </div>
                <div className="text-[10px] text-slate-500">Analyst Permissions</div>
              </Link>
            </div>
          </div>

          {/* REAL-TIME IMMUTABLE AUDIT STREAM */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Audit Ledger
                </h3>
                <p className="text-[11px] text-slate-500">
                  Immutable stream of compliance actions & score edits
                </p>
              </div>

              <Link to="/audit-logs" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                Full Log ({auditLogs.length}) →
              </Link>
            </div>

            <AuditTimeline entries={auditLogs} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
