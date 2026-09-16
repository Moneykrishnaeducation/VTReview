import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAdmin } from "../../context/admin-context";
import type { BrokerAdmin } from "../../types/admin";
import { DataTable, type Column } from "../../components/data-table";
import { StatusBadge } from "../../components/status-badge";
import { Building2, Plus, Download, Filter, Star, ExternalLink, ShieldCheck } from "lucide-react";

export default function BrokerList() {
  const { brokers } = useAdmin();
  const navigate = useNavigate();

  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBrokers = brokers.filter((b) => {
    if (tierFilter !== "all" && b.tier !== tierFilter) return false;
    if (statusFilter !== "all" && b.verificationStatus !== statusFilter) return false;
    return true;
  });

  const columns: Column<BrokerAdmin>[] = [
    {
      header: "Broker & Entity",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
            {row.logo}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{row.name}</span>
              {row.verificationStatus === "verified" && (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{row.legalEntity}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Regulation Tier",
      accessorKey: "tier",
      sortable: true,
      cell: (row) => <StatusBadge status={row.tier} size="sm" />,
    },
    {
      header: "Primary Regulator",
      accessorKey: "primaryRegulator",
      sortable: true,
      cell: (row) => <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{row.primaryRegulator}</span>,
    },
    {
      header: "Editorial Score",
      accessorKey: "editorialScore",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
          <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{row.editorialScore.toFixed(1)}</span>
          <span className="text-[10px] text-slate-500">({row.starRating}★)</span>
        </div>
      ),
    },
    {
      header: "Spread / Comm",
      accessorKey: "eurUsdSpread",
      sortable: true,
      cell: (row) => (
        <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
          <div>EUR/USD: <strong className="text-emerald-600 dark:text-emerald-400">{row.eurUsdSpread} p</strong></div>
          <div className="text-[10px] text-slate-500">${row.commissionPerLot}/lot</div>
        </div>
      ),
    },
    {
      header: "Verification",
      accessorKey: "verificationStatus",
      sortable: true,
      cell: (row) => <StatusBadge status={row.verificationStatus} size="sm" />,
    },
    {
      header: "Last Verified",
      accessorKey: "lastVerifiedDate",
      sortable: true,
      cell: (row) => (
        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <div>{row.lastVerifiedDate}</div>
          <div className="text-[10px] text-slate-500 truncate max-w-[100px]">{row.verifiedBy}</div>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/brokers/${row.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-semibold text-xs transition-colors"
          >
            Manage →
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-mono text-[11px] mb-1">
            <Building2 className="h-3 w-3 text-amber-500 dark:text-amber-400" />
            <span>RESEARCH DATABASE ({brokers.length} Verified Brokers)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Broker Profile & Governance Directory
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/brokers/new"
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Broker Research Record</span>
          </Link>
        </div>
      </div>

      {/* Main Table Component */}
      <DataTable
        data={filteredBrokers}
        columns={columns}
        searchPlaceholder="Search broker name, legal entity, license number, regulator..."
        searchKey="name"
        onRowClick={(row) => navigate(`/brokers/${row.slug}`)}
        filters={
          <div className="flex items-center gap-2">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Tiers</option>
              <option value="Tier-1">Tier-1 (FCA / ASIC / BaFin)</option>
              <option value="Tier-2">Tier-2 (CySEC / FSCA)</option>
              <option value="Tier-3">Tier-3 (Offshore)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending Audit</option>
              <option value="expired">Expired Audit</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
