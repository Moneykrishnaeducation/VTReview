import React, { useState } from "react";
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
} from "lucide-react";

export default function AuditLogs() {
  const { auditLogs, evidenceList, setSelectedEvidenceModal } = useAdmin();
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== "all" && log.action !== actionFilter) return false;
    if (entityFilter !== "all" && log.entityType !== entityFilter) return false;
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
      `audit-logs-${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "VERIFY":
        return (
          <span className="px-2 py-0.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wide">
            VERIFIED
          </span>
        );
      case "REJECT":
        return (
          <span className="px-2 py-0.5 rounded-md border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-wide">
            REJECTED
          </span>
        );
      case "SCORE_CHANGE":
        return (
          <span className="px-2 py-0.5 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-wide">
            SCORE DELTA
          </span>
        );
      case "PUBLISH":
        return (
          <span className="px-2 py-0.5 rounded-md border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wide">
            PUBLISHED
          </span>
        );
      case "RESOLVE":
        return (
          <span className="px-2 py-0.5 rounded-md border border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold tracking-wide">
            RESOLVED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md border border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold tracking-wide">
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
          <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
            {row.id}
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
        <div className="space-y-0.5 max-w-[200px]">
          <div
            className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate"
            title={row.entityName}
          >
            {row.entityName}
          </div>
          <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
            {row.entityType} • {row.entityId}
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
            <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{row.actorName}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {row.actorRole} • <span className="font-mono">{row.ipAddress}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Evidence Record",
      accessorKey: "evidenceId",
      cell: (row) => {
        if (!row.evidenceId)
          return <span className="text-slate-400 italic text-[11px]">—</span>;
        const linkedEvidence = evidenceList.find(
          (ev) => ev.id === row.evidenceId
        );

        return (
          <button
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
            className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-mono text-xs font-bold cursor-pointer"
          >
            <span>{row.evidenceId}</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 text-xs font-sans">
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

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Main Table View */}
      <DataTable
        data={filteredLogs}
        columns={columns}
        searchPlaceholder="Search audit ID, actor, entity, evidence number..."
        pageSize={10}
        filters={
          <div className="flex items-center gap-2">
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-amber-500 font-mono"
            >
              <option value="all">All Entity Types</option>
              <option value="broker">Broker Entity</option>
              <option value="license">License Record</option>
              <option value="complaint">Complaint Case</option>
              <option value="rating">Rating Score</option>
              <option value="review">User Review</option>
              <option value="evidence">Evidence Doc</option>
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-amber-500 font-mono"
            >
              <option value="all">All Mutation Actions</option>
              <option value="VERIFY">VERIFY (License Certified)</option>
              <option value="SCORE_CHANGE">SCORE_CHANGE (Delta Proposed)</option>
              <option value="APPROVE">APPROVE (Rating Signed)</option>
              <option value="RESOLVE">RESOLVE (Dispute Closed)</option>
              <option value="PUBLISH">PUBLISH (Guide / Review)</option>
              <option value="REJECT">REJECT (Declined)</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
