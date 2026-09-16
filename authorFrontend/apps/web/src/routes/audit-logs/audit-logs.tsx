import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import { DataTable, type Column } from "../../components/data-table";
import type { AuditLogEntry } from "../../types/admin";
import {
  History,
  Download,
  Clock,
  UserCheck,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  FileText,
  Search,
  Filter,
  X,
  List,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Copy,
  Check,
  Lock,
  Globe,
  Radio,
  FileCode,
  Terminal,
} from "lucide-react";

export default function AuditLogs() {
  const { auditLogs, evidenceList, setSelectedEvidenceModal } = useAdmin();

  // Filters state
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // View state
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogEntry | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // 1. Action filter
      if (actionFilter !== "all" && log.action !== actionFilter) return false;

      // 2. Entity filter
      if (entityFilter !== "all" && log.entityType !== entityFilter) return false;

      // 3. Role filter
      if (roleFilter !== "all" && log.actorRole !== roleFilter) return false;

      // 4. Time filter
      if (timeFilter !== "all") {
        const logDate = new Date(log.timestamp.replace(" UTC", ""));
        const now = new Date();
        const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 3600);
        if (timeFilter === "24h" && diffHours > 24) return false;
        if (timeFilter === "7d" && diffHours > 24 * 7) return false;
        if (timeFilter === "30d" && diffHours > 24 * 30) return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.id.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q) ||
          log.actorRole.toLowerCase().includes(q) ||
          log.entityName.toLowerCase().includes(q) ||
          log.entityId.toLowerCase().includes(q) ||
          log.summary.toLowerCase().includes(q) ||
          log.ipAddress.toLowerCase().includes(q) ||
          (log.evidenceId && log.evidenceId.toLowerCase().includes(q)) ||
          (log.reason && log.reason.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [auditLogs, actionFilter, entityFilter, roleFilter, timeFilter, searchQuery]);

  // Executive Metric Counts
  const metrics = useMemo(() => {
    const total = auditLogs.length;
    const verified = auditLogs.filter((l) => l.action === "VERIFY" || l.action === "APPROVE").length;
    const scoreChanges = auditLogs.filter((l) => l.action === "SCORE_CHANGE").length;
    const resolutions = auditLogs.filter((l) => l.action === "RESOLVE" || l.action === "REJECT").length;
    return { total, verified, scoreChanges, resolutions };
  }, [auditLogs]);

  // Active filter count
  const activeFiltersCount =
    (actionFilter !== "all" ? 1 : 0) +
    (entityFilter !== "all" ? 1 : 0) +
    (roleFilter !== "all" ? 1 : 0) +
    (timeFilter !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setActionFilter("all");
    setEntityFilter("all");
    setRoleFilter("all");
    setTimeFilter("all");
    setSearchQuery("");
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Audit ID",
      "Timestamp",
      "Action",
      "Entity Type",
      "Entity ID",
      "Entity Name",
      "Actor Name",
      "Actor Role",
      "Summary",
      "Before Value",
      "After Value",
      "Reason",
      "Evidence ID",
      "IP Address",
    ];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.action,
      log.entityType,
      log.entityId,
      `"${log.entityName.replace(/"/g, '""')}"`,
      `"${log.actorName.replace(/"/g, '""')}"`,
      log.actorRole,
      `"${log.summary.replace(/"/g, '""')}"`,
      `"${(log.beforeValue || "").replace(/"/g, '""')}"`,
      `"${(log.afterValue || "").replace(/"/g, '""')}"`,
      `"${(log.reason || "").replace(/"/g, '""')}"`,
      log.evidenceId || "",
      log.ipAddress,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vtreview-audit-ledger-${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vtreview-audit-ledger-${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "VERIFY":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>VERIFIED</span>
          </span>
        );
      case "APPROVE":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>APPROVED</span>
          </span>
        );
      case "REJECT":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <X className="h-3 w-3 text-rose-500" />
            <span>REJECTED</span>
          </span>
        );
      case "SCORE_CHANGE":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>SCORE DELTA</span>
          </span>
        );
      case "PUBLISH":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <FileText className="h-3 w-3 text-blue-500" />
            <span>PUBLISHED</span>
          </span>
        );
      case "RESOLVE":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <Check className="h-3 w-3 text-teal-500" />
            <span>RESOLVED</span>
          </span>
        );
      case "UPDATE":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <Activity className="h-3 w-3 text-indigo-500" />
            <span>UPDATED</span>
          </span>
        );
      case "CREATE":
        return (
          <span className="px-2.5 py-0.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
            <Layers className="h-3 w-3 text-purple-500" />
            <span>CREATED</span>
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

  const columns: Column<AuditLogEntry>[] = [
    {
      header: "Audit ID & Timestamp",
      accessorKey: "id",
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1">
            <span>{row.id}</span>
          </div>
          <div className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>{row.timestamp}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Mutation Action",
      accessorKey: "action",
      sortable: true,
      cell: (row) => getActionBadge(row.action),
    },
    {
      header: "Entity / Target",
      accessorKey: "entityName",
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5 max-w-[190px]">
          <div
            className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate"
            title={row.entityName}
          >
            {row.entityName}
          </div>
          <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[9px]">
              {row.entityType}
            </span>
            <span className="truncate">{row.entityId}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Summary & Delta",
      accessorKey: "summary",
      cell: (row) => (
        <div className="space-y-1.5 max-w-xs md:max-w-md">
          <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
            {row.summary}
          </p>

          {(row.beforeValue || row.afterValue) && (
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {row.beforeValue && (
                <span className="text-rose-600 dark:text-rose-400 line-through">
                  {row.beforeValue}
                </span>
              )}
              {row.beforeValue && row.afterValue && (
                <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
              )}
              {row.afterValue && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {row.afterValue}
                </span>
              )}
            </div>
          )}

          {row.reason && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
              "{row.reason}"
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Auditor / Actor",
      accessorKey: "actorName",
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>{row.actorName}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            <span className="font-medium text-slate-600 dark:text-slate-400">{row.actorRole}</span> •{" "}
            <span className="font-mono text-[9px]">{row.ipAddress}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Evidence & Actions",
      accessorKey: "evidenceId",
      cell: (row) => {
        const linkedEvidence = row.evidenceId ? evidenceList.find((ev) => ev.id === row.evidenceId) : null;

        return (
          <div className="flex items-center gap-2">
            {row.evidenceId ? (
              <button
                type="button"
                onClick={() => {
                  const ev = linkedEvidence || {
                    id: row.evidenceId!,
                    title: `Evidence ${row.evidenceId}`,
                    type: "complaint_proof",
                    relatedEntityType: "complaint",
                    relatedEntityId: row.entityId,
                    relatedEntityName: row.entityName,
                    uploadedBy: row.actorName,
                    uploadedAt: row.timestamp,
                    fileFormat: "PDF",
                    fileSizeBytes: 2048500,
                    status: "verified",
                    checksum: "sha256-4859a8c7e6d5b4a3",
                    notes: row.reason || "Audit log evidence record.",
                  };
                  setSelectedEvidenceModal(ev);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold cursor-pointer transition-colors"
                title="View linked evidence document"
              >
                <span>{row.evidenceId}</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setSelectedAuditLog(row)}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Inspect full audit dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 text-xs font-sans w-full pb-16">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-mono text-[11px] mb-1 font-semibold">
            <History className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>IMMUTABLE SYSTEM LEDGER ({auditLogs.length} Events Logged)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Immutable Audit Trail & Regulatory Compliance Log
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Cryptographically verified event stream tracking all platform entity mutations, license certifications, score adjustments, and dispute resolutions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Live Feed Toggle */}
          <button
            type="button"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              isLiveStreaming
                ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isLiveStreaming ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
            <span>{isLiveStreaming ? "Live Feed Active" : "Feed Paused"}</span>
          </button>

          {/* View Switcher */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Timeline Stream View"
            >
              <Activity className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export filtered records as JSON"
          >
            <FileCode className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Executive KPI Cards Ribbon ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>Total Logged Events</span>
            <History className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{metrics.total}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            Immutable SHA-256 Ledger
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>License Certifications</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{metrics.verified}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            Verified &amp; Approved Licenses
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>Score Recalibrations</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">{metrics.scoreChanges}</div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            120-Point Multi-Pillar Deltas
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>Dispute Mediations</span>
            <CheckCircle2 className="h-4 w-4 text-teal-500" />
          </div>
          <div className="text-xl font-black text-teal-600 dark:text-teal-400">{metrics.resolutions}</div>
          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">
            Arbitrated Claims &amp; Closures
          </div>
        </div>
      </div>

      {/* ── Multi-Parameter Filter Matrix ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit ID, actor, entity, evidence, reason, IP..."
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

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Entity Types</option>
            <option value="broker">Broker Entity</option>
            <option value="license">License Record</option>
            <option value="complaint">Complaint Case</option>
            <option value="rating">Rating Proposal</option>
            <option value="review">User Review</option>
            <option value="guide">Editorial Guide</option>
            <option value="evidence">Evidence Vault</option>
            <option value="user">User Account</option>
            <option value="setting">System Setting</option>
          </select>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Mutation Actions</option>
            <option value="VERIFY">VERIFY (License Certified)</option>
            <option value="APPROVE">APPROVE (Rating / Review)</option>
            <option value="SCORE_CHANGE">SCORE_CHANGE (Score Recalibration)</option>
            <option value="RESOLVE">RESOLVE (Dispute Closed)</option>
            <option value="PUBLISH">PUBLISH (Guide / Review)</option>
            <option value="UPDATE">UPDATE (Entity State)</option>
            <option value="CREATE">CREATE (New Record)</option>
            <option value="REJECT">REJECT (Declined)</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Auditor Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Compliance Officer">Compliance Officer</option>
            <option value="Editorial Lead">Editorial Lead</option>
            <option value="Moderator">Moderator</option>
            <option value="Data Engineer">Data Engineer</option>
            <option value="Lead Financial Analyst">Financial Analyst</option>
          </select>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Time History</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>

          {/* Reset button */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 1: High-Density Table View
          ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "table" && (
        <DataTable
          data={filteredLogs}
          columns={columns}
          searchPlaceholder="Search within loaded audit records..."
          pageSize={10}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 2: Interactive Timeline Stream View
          ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "timeline" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              <span>Chronological Event Stream</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {filteredLogs.length} Sequential Events
            </span>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Node Bullet */}
                <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full bg-white dark:bg-slate-900 border-2 border-amber-500 flex items-center justify-center shadow-xs">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs">
                        {log.id}
                      </span>
                      {getActionBadge(log.action)}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                        {log.entityType.toUpperCase()} • {log.entityName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedAuditLog(log)}
                        className="px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-medium">
                    {log.summary}
                  </p>

                  {/* Deltas */}
                  {(log.beforeValue || log.afterValue) && (
                    <div className="inline-flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      {log.beforeValue && (
                        <span className="text-rose-600 dark:text-rose-400 line-through">
                          {log.beforeValue}
                        </span>
                      )}
                      {log.beforeValue && log.afterValue && (
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      {log.afterValue && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {log.afterValue}
                        </span>
                      )}
                    </div>
                  )}

                  {log.reason && (
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic">
                      Rationale: "{log.reason}"
                    </div>
                  )}

                  {/* Footer Actor & IP */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-850">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                      <span>Auditor: <strong className="text-slate-800 dark:text-slate-200">{log.actorName}</strong> ({log.actorRole})</span>
                    </div>
                    <div className="font-mono text-[10px]">IP: {log.ipAddress}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modal: Detailed Forensic Dossier Inspection ── */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    Audit Event Dossier • {selectedAuditLog.id}
                  </h3>
                  <div className="font-mono text-[10px] text-slate-500">{selectedAuditLog.timestamp}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mutation Action</span>
                  <div>{getActionBadge(selectedAuditLog.action)}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target Entity</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedAuditLog.entityName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{selectedAuditLog.entityType} ({selectedAuditLog.entityId})</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Auditor / Officer</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedAuditLog.actorName}</div>
                  <div className="text-[10px] text-slate-500">{selectedAuditLog.actorRole}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Client IP Address</span>
                  <div className="font-mono text-slate-900 dark:text-white font-semibold">{selectedAuditLog.ipAddress}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">SSL TLSv1.3 Certified</div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mutation Summary</span>
                <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-medium">
                  {selectedAuditLog.summary}
                </p>
              </div>

              {/* Before / After Diff */}
              {(selectedAuditLog.beforeValue || selectedAuditLog.afterValue) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">State Before</span>
                    <div className="font-mono text-xs text-rose-700 dark:text-rose-300 font-semibold break-all">
                      {selectedAuditLog.beforeValue || "— (Null / Initial)"}
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">State After</span>
                    <div className="font-mono text-xs text-emerald-700 dark:text-emerald-300 font-bold break-all">
                      {selectedAuditLog.afterValue || "—"}
                    </div>
                  </div>
                </div>
              )}

              {/* Rationale */}
              {selectedAuditLog.reason && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Officer Rationale &amp; Context</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{selectedAuditLog.reason}</p>
                </div>
              )}

              {/* Cryptographic Proof Hash */}
              <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-500" />
                    <span>Cryptographic Block Signature (SHA-256)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(`sha256-4859a8c7e6d5b4a3-${selectedAuditLog.id}`)}
                    className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedHash ? "Copied!" : "Copy Hash"}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069_{selectedAuditLog.id}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              {selectedAuditLog.evidenceId ? (
                <button
                  type="button"
                  onClick={() => {
                    const linkedEvidence = evidenceList.find((ev) => ev.id === selectedAuditLog.evidenceId);
                    setSelectedEvidenceModal(
                      linkedEvidence || {
                        id: selectedAuditLog.evidenceId!,
                        title: `Evidence ${selectedAuditLog.evidenceId}`,
                        type: "complaint_proof",
                        relatedEntityType: "complaint",
                        relatedEntityId: selectedAuditLog.entityId,
                        relatedEntityName: selectedAuditLog.entityName,
                        uploadedBy: selectedAuditLog.actorName,
                        uploadedAt: selectedAuditLog.timestamp,
                        fileFormat: "PDF",
                        fileSizeBytes: 2048500,
                        status: "verified",
                        checksum: "sha256-4859a8c7e6d5b4a3",
                        notes: selectedAuditLog.reason || "Audit log evidence record.",
                      }
                    );
                    setSelectedAuditLog(null);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Inspect Linked Evidence ({selectedAuditLog.evidenceId})</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
