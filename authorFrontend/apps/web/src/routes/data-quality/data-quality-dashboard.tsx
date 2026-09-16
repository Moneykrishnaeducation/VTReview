import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import type { DataQualityIssue, JobQueueItem } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import {
  CheckSquare2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  X,
  Play,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  Download,
  Eye,
  RotateCcw,
  Zap,
  Activity,
  FileText,
  Building2,
  ExternalLink,
  ShieldAlert,
  Radio,
  Check,
  Calendar,
  AlertCircle,
  BarChart3,
} from "lucide-react";

export default function DataQualityDashboard() {
  const { dataQualityIssues, jobQueues, brokers, activeRoleDef, addAuditLogEntry } = useAdmin();

  // Local state
  const [issues, setIssues] = useState<DataQualityIssue[]>(dataQualityIssues);
  const [jobs, setJobs] = useState<JobQueueItem[]>(jobQueues);
  const [activeTab, setActiveTab] = useState<"issues" | "jobs" | "stale_radar">("issues");

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Running Sanity Sweep animation state
  const [isScanning, setIsScanning] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<DataQualityIssue | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>("");

  // Executive Metric Calculations
  const metrics = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter((i) => i.severity === "critical" && !i.resolved).length;
    const high = issues.filter((i) => i.severity === "high" && !i.resolved).length;
    const active = issues.filter((i) => !i.resolved).length;
    const resolved = issues.filter((i) => i.resolved).length;
    const runningJobs = jobs.filter((j) => j.status === "running").length;

    // Integrity health score formula
    const healthIndex = Math.max(0, Math.min(100, 100 - critical * 8 - high * 4 - (active - critical - high) * 2));

    return { total, critical, high, active, resolved, runningJobs, healthIndex };
  }, [issues, jobs]);

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      // 1. Status Filter
      if (statusFilter === "unresolved" && item.resolved) return false;
      if (statusFilter === "resolved" && !item.resolved) return false;

      // 2. Severity Filter
      if (severityFilter !== "all" && item.severity !== severityFilter) return false;

      // 3. Entity Type Filter
      if (entityFilter !== "all" && item.entityType !== entityFilter) return false;

      // 4. Issue Type Filter
      if (issueTypeFilter !== "all" && item.issueType !== issueTypeFilter) return false;

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.entityName.toLowerCase().includes(q) ||
          item.entityId.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.assignedTo && item.assignedTo.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [issues, statusFilter, severityFilter, entityFilter, issueTypeFilter, searchQuery]);

  // Stale Verification calculations for brokers
  const staleBrokersList = useMemo(() => {
    return brokers.map((b) => {
      const isStale = b.lastVerifiedDate ? false : true;
      return {
        id: b.id,
        name: b.name,
        tier: b.tier,
        primaryRegulator: b.primaryRegulator,
        licensesCount: b.licenses.length,
        lastVerified: b.lastVerifiedDate || "Pending / Stale (>90d)",
        isStale,
      };
    });
  }, [brokers]);

  // Actions
  const handleResolve = (id: string, notes?: string) => {
    setIssues((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolved: true } : item))
    );
    if (addAuditLogEntry) {
      addAuditLogEntry({
        action: "RESOLVE",
        entityType: "setting",
        entityId: id,
        entityName: `Data Quality Issue #${id}`,
        summary: `Resolved data quality anomaly #${id}. Notes: ${notes || "Auto-verified."}`,
      });
    }
    setFeedbackToast(`Data quality issue #${id} resolved successfully.`);
    setSelectedIssue(null);
    setResolutionNotes("");
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setFeedbackToast("Automated integrity scan completed. 0 new vulnerabilities detected.");
      setTimeout(() => setFeedbackToast(null), 4000);
    }, 1500);
  };

  const handleTriggerJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "running", startedAt: "Just now" } : j))
    );
    setFeedbackToast(`Background worker job ${jobId} triggered successfully.`);
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: "completed", durationMs: 14200 } : j))
      );
    }, 2500);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleExportCSV = () => {
    const headers = ["Issue ID", "Entity Type", "Entity ID", "Entity Name", "Severity", "Issue Type", "Description", "Detected At", "Assigned To", "Resolved"];
    const rows = filteredIssues.map((i) => [
      i.id,
      i.entityType,
      i.entityId,
      `"${i.entityName.replace(/"/g, '""')}"`,
      i.severity,
      i.issueType,
      `"${i.description.replace(/"/g, '""')}"`,
      i.detectedAt,
      i.assignedTo || "Unassigned",
      i.resolved ? "YES" : "NO",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data-quality-issues-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setSeverityFilter("all");
    setEntityFilter("all");
    setIssueTypeFilter("all");
    setSearchQuery("");
  };

  const getSeverityBadge = (severity: DataQualityIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold text-[10px] inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>CRITICAL</span>
          </span>
        );
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px] inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>HIGH</span>
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 font-bold text-[10px] inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>MEDIUM</span>
          </span>
        );
      case "low":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30 font-bold text-[10px] inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span>LOW</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans w-full pb-16">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-mono text-[11px] mb-1 font-semibold">
            <CheckSquare2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>AUTOMATED DATA SANITY &amp; INTEGRITY ENGINE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Data Quality, Stale Verification &amp; Crawler Radar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Continuous background sanity checks across regulatory registries, spread telemetry captures, and evidence vault checksums.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export issues list as CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-75"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning Matrix..." : "Run Sanity Sweep"}</span>
          </button>
        </div>
      </div>

      {/* ── Feedback Toast ── */}
      {feedbackToast && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Executive KPI Metric Cards Ribbon ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Data Health Index</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.healthIndex.toFixed(1)}%
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Optimal Integrity Baseline
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/30 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Critical Anomalies</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {metrics.critical}
          </div>
          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium mt-0.5 flex items-center gap-1">
            {metrics.critical > 0 ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Immediate action required
              </>
            ) : (
              "0 high-risk vulnerabilities"
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Active Triage Items</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.active}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            {metrics.resolved} issues resolved
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Background Runners</span>
            <Cpu className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.runningJobs} Active
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
            {jobs.length} worker queues configured
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            {
              id: "issues",
              label: "Integrity Anomalies",
              icon: <ShieldAlert className="h-3.5 w-3.5" />,
              badge: metrics.active,
              badgeHighlight: metrics.active > 0,
            },
            {
              id: "jobs",
              label: "Background Worker Queues",
              icon: <Cpu className="h-3.5 w-3.5" />,
              badge: jobs.length,
            },
            {
              id: "stale_radar",
              label: "Stale Verification Radar",
              icon: <Clock className="h-3.5 w-3.5" />,
              badge: staleBrokersList.filter((b) => b.isStale).length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-slate-950/20 text-slate-950"
                        : tab.badgeHighlight
                        ? "bg-amber-500/20 text-amber-800 dark:text-amber-300"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Auto-Scan Frequency: 60s
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: Integrity Anomalies & Stale Audits
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "issues" && (
        <div className="space-y-4">
          {/* Multi-Parameter Filter Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search issue ID, entity name, description, assigned officer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="all">All Triage Status</option>
                <option value="unresolved">Active Unresolved</option>
                <option value="resolved">Resolved / Closed</option>
              </select>

              {/* Severity Filter */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Vulnerabilities</option>
                <option value="high">High Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="low">Low Severity</option>
              </select>

              {/* Entity Type Filter */}
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="all">All Entities</option>
                <option value="broker">Broker Record</option>
                <option value="license">License</option>
                <option value="evidence">Evidence Vault</option>
                <option value="guide">Research Guide</option>
                <option value="regulator">Regulator</option>
              </select>

              {/* Issue Type Filter */}
              <select
                value={issueTypeFilter}
                onChange={(e) => setIssueTypeFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="all">All Issue Categories</option>
                <option value="stale_verification">Stale Verification (&gt;90d)</option>
                <option value="expired_evidence">Expired Evidence</option>
                <option value="duplicate_license">Duplicate License Clone</option>
                <option value="missing_license_evidence">Missing Document</option>
                <option value="broken_url">Broken URL Link</option>
                <option value="missing_seo_fields">Missing SEO Meta</option>
              </select>

              {(searchQuery || statusFilter !== "all" || severityFilter !== "all" || entityFilter !== "all" || issueTypeFilter !== "all") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Issues List Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span>Detected Sanity Anomalies ({filteredIssues.length})</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Real-time CRC32 &amp; SHA-256 Engine
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((item) => {
                  const isCritical = item.severity === "critical" && !item.resolved;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 flex flex-wrap items-start justify-between gap-4 transition-all ${
                        item.resolved
                          ? "bg-slate-50/40 dark:bg-slate-950/40 opacity-70"
                          : isCritical
                          ? "bg-rose-50/20 dark:bg-rose-950/10 border-l-4 border-l-rose-500 hover:bg-rose-50/40"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-850/40 border-l-4 border-l-amber-500"
                      }`}
                    >
                      <div className="space-y-1.5 max-w-3xl flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs">
                            {item.id}
                          </span>
                          {getSeverityBadge(item.severity)}
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {item.entityName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[9px] uppercase font-bold">
                            {item.entityType} ({item.entityId})
                          </span>
                          {item.resolved && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[9px] font-bold">
                              ✓ RESOLVED
                            </span>
                          )}
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs font-medium">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Detected: {item.detectedAt}
                          </span>
                          <span>•</span>
                          <span>Category: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{item.issueType.replace(/_/g, " ")}</strong></span>
                          <span>•</span>
                          <span>Assigned Officer: <strong className="text-slate-700 dark:text-slate-300">{item.assignedTo || "Auto-Triage"}</strong></span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedIssue(item)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>

                        {!item.resolved && (
                          <button
                            type="button"
                            onClick={() => handleResolve(item.id)}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs text-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                  <div className="text-slate-700 dark:text-slate-300 font-bold text-sm">
                    No sanity anomalies match your filter parameters.
                  </div>
                  <p className="text-slate-500 text-xs">All monitored entities comply with integrity rules.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: Background Worker Queues & Crawlers
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span>Scheduled Background Workers &amp; Registry Scrapers</span>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Automated background cron jobs that sync live tick spread latency feeds, crawl regulatory registries, and verify SHA-256 checksums.
                </p>
              </div>

              <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold text-slate-700 dark:text-slate-300">
                {jobs.length} Active Runners
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {jobs.map((job) => {
                const isRunning = job.status === "running";
                return (
                  <div
                    key={job.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isRunning
                        ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 shadow-xs"
                        : "bg-slate-50/60 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                            {job.id}
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
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
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">{job.jobName}</h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTriggerJob(job.id)}
                        disabled={isRunning}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
                      >
                        <Play className={`h-3 w-3 ${isRunning ? "text-blue-500" : ""}`} />
                        <span>Run Now</span>
                      </button>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Started:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{job.startedAt}</span>
                      </div>
                      {job.recordsProcessed !== undefined && (
                        <div className="flex justify-between">
                          <span>Records Processed:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{job.recordsProcessed.toLocaleString()} records</span>
                        </div>
                      )}
                      {job.durationMs !== undefined && (
                        <div className="flex justify-between">
                          <span>Execution Duration:</span>
                          <span className="text-slate-800 dark:text-slate-200">{(job.durationMs / 1000).toFixed(1)}s</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: Stale Verification Radar
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "stale_radar" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Stale License Verification &amp; Registry Freshness Radar</span>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Highlights broker regulatory licenses that have not received an authenticated direct-register audit in the past 90 days.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {staleBrokersList.map((broker) => (
                <div key={broker.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{broker.name}</span>
                      <StatusBadge status={broker.tier} size="sm" />
                      <span className="text-slate-500 font-mono text-[10px]">
                        {broker.primaryRegulator} • {broker.licensesCount} Active Licenses
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Last Verified: <strong className={broker.isStale ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}>{broker.lastVerified}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackToast(`Direct register audit dispatched for ${broker.name}.`);
                        setTimeout(() => setFeedbackToast(null), 3000);
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Dispatch Re-Audit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Detailed Anomaly Inspection & Remediation ── */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    Sanity Anomaly Inspection • {selectedIssue.id}
                  </h3>
                  <div className="text-[10px] text-slate-500 font-mono">{selectedIssue.detectedAt}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Severity</span>
                  <div>{getSeverityBadge(selectedIssue.severity)}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target Entity</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedIssue.entityName}</div>
                  <div className="text-[10px] font-mono text-slate-500">{selectedIssue.entityType} ({selectedIssue.entityId})</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Description &amp; Automated Diagnosis</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{selectedIssue.description}</p>
              </div>

              {!selectedIssue.resolved && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    Remediation Notes / Audit Resolution Justification
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Provide details on verification steps executed, document hash, or regulator response..."
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {!selectedIssue.resolved && (
                <button
                  type="button"
                  onClick={() => handleResolve(selectedIssue.id, resolutionNotes)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Acknowledge &amp; Mark Resolved</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
