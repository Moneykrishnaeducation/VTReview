import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAdmin } from "../../context/admin-context";
import type { BrokerAdmin } from "../../types/admin";
import { DataTable, type Column } from "../../components/data-table";
import { StatusBadge } from "../../components/status-badge";
import { BrokerLogo } from "../../components/broker-logo";
import {
  Building2,
  Plus,
  Download,
  Filter,
  Star,
  ExternalLink,
  ShieldCheck,
  Search,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  List,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  DollarSign,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  Check
} from "lucide-react";

export default function BrokerList() {
  const { brokers } = useAdmin();
  const navigate = useNavigate();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [executionFilter, setExecutionFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filtered Brokers
  const filteredBrokers = useMemo(() => {
    return brokers.filter((b) => {
      // 1. Tier Filter
      if (tierFilter !== "all" && b.tier !== tierFilter) return false;

      // 2. Status Filter
      if (statusFilter !== "all" && b.verificationStatus !== statusFilter) return false;

      // 3. Execution Model Filter
      if (executionFilter !== "all" && b.executionModel !== executionFilter) return false;

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.legalEntity.toLowerCase().includes(q) ||
          b.primaryRegulator.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q) ||
          b.platforms.some((p) => p.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [brokers, tierFilter, statusFilter, executionFilter, searchQuery]);

  // Executive Metrics
  const totalBrokers = brokers.length;
  const tier1Count = brokers.filter((b) => b.tier === "Tier-1").length;
  const verifiedCount = brokers.filter((b) => b.verificationStatus === "verified").length;
  const avgScore = totalBrokers > 0 ? (brokers.reduce((sum, b) => sum + b.editorialScore, 0) / totalBrokers).toFixed(1) : "0.0";
  const avgEurUsdSpread = totalBrokers > 0 ? (brokers.reduce((sum, b) => sum + b.eurUsdSpread, 0) / totalBrokers).toFixed(2) : "0.00";

  const handleExportCSV = () => {
    const headers = ["Broker Name", "Legal Entity", "Tier", "Primary Regulator", "Editorial Score", "EUR/USD Spread", "Commission/Lot", "Verification Status", "Last Verified"];
    const rows = filteredBrokers.map((b) => [
      `"${b.name}"`,
      `"${b.legalEntity}"`,
      b.tier,
      `"${b.primaryRegulator}"`,
      b.editorialScore,
      b.eurUsdSpread,
      b.commissionPerLot,
      b.verificationStatus,
      b.lastVerifiedDate,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wikifx-broker-directory-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccess(`Exported ${filteredBrokers.length} broker records to CSV.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTierFilter("all");
    setStatusFilter("all");
    setExecutionFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || tierFilter !== "all" || statusFilter !== "all" || executionFilter !== "all";

  const columns: Column<BrokerAdmin>[] = [
    {
      header: "Broker & Entity",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <BrokerLogo logo={row.logo} name={row.name} size="sm" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span>{row.name}</span>
              {row.verificationStatus === "verified" && (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-mono">{row.legalEntity}</div>
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
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{row.editorialScore.toFixed(1)}</span>
          <span className="text-[10px] text-slate-400">({row.starRating}★)</span>
        </div>
      ),
    },
    {
      header: "Spread / Comm",
      accessorKey: "eurUsdSpread",
      sortable: true,
      cell: (row) => (
        <div className="font-mono text-xs text-slate-700 dark:text-slate-300">
          <div>EUR/USD: <strong className="text-emerald-600 dark:text-emerald-400">{row.eurUsdSpread} p</strong></div>
          <div className="text-[10px] text-slate-500">${row.commissionPerLot}/lot • {row.executionModel}</div>
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
        <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="font-semibold">{row.lastVerifiedDate}</div>
          <div className="text-[10px] text-slate-500 truncate max-w-[110px]">{row.verifiedBy}</div>
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
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span>Manage</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-xs mb-1.5 font-bold">
            <Building2 className="h-3.5 w-3.5 text-amber-500" />
            <span>RESEARCH DATABASE ({brokers.length} TRACKED BROKERS)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Broker Profile & Governance Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Institutional 120-point audit profiles, live spread tests, statutory licenses, and forensic evidence links.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-indigo-500" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/brokers/new"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Broker Record</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Executive Broker Directory KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Tracked Broker Catalog</span>
            <Building2 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalBrokers}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-3 w-3" />
            <span>{verifiedCount} with verified audits</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Tier-1 Licensed Entities</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {tier1Count} <span className="text-xs text-slate-400 font-normal">Brokers</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>FCA / ASIC / BaFin coverage</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Avg. EUR/USD Spread</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            {avgEurUsdSpread} pips
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Raw ECN & STP telemetry</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Benchmark Index Score</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            {avgScore} / 100
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>120-point multi-pillar audit</span>
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Query Input */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search broker name, legal entity, regulator..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Tier Filter */}
          <div className="lg:col-span-3">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Regulation Tiers</option>
              <option value="Tier-1">Tier-1 (FCA / ASIC / BaFin)</option>
              <option value="Tier-2">Tier-2 (CySEC / FSCA)</option>
              <option value="Tier-3">Tier-3 (Offshore)</option>
            </select>
          </div>

          {/* Execution Model Filter */}
          <div className="lg:col-span-3">
            <select
              value={executionFilter}
              onChange={(e) => setExecutionFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Execution Models</option>
              <option value="ECN/STP">ECN / STP</option>
              <option value="STP">Straight Through Processing (STP)</option>
              <option value="Market Maker">Market Maker</option>
              <option value="DMA/ECN">Direct Market Access (DMA/ECN)</option>
            </select>
          </div>

          {/* View Mode Toggle & Reset */}
          <div className="lg:col-span-2 flex items-center justify-end gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid View */}
      {viewMode === "table" ? (
        <DataTable
          data={filteredBrokers}
          columns={columns}
          searchPlaceholder="Filter table rows..."
          searchKey="name"
          onRowClick={(row) => navigate(`/brokers/${row.slug}`)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBrokers.map((b) => (
            <div
              key={b.id}
              onClick={() => navigate(`/brokers/${b.slug}`)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs hover:border-amber-500/60 dark:hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BrokerLogo logo={b.logo} name={b.name} size="md" />
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      <span>{b.name}</span>
                      {b.verificationStatus === "verified" && (
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-mono">{b.legalEntity}</p>
                  </div>
                </div>

                <StatusBadge status={b.tier} size="sm" />
              </div>

              {/* Score & Spread Strip */}
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Editorial Rating</div>
                  <div className="font-black text-slate-900 dark:text-white flex items-center gap-1 text-sm mt-0.5">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>{b.editorialScore.toFixed(1)}</span>
                    <span className="text-[11px] text-slate-400 font-normal">/ 100</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">EUR/USD Spread</div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                    {b.eurUsdSpread} pips
                  </div>
                </div>
              </div>

              {/* Specs & Platform Badges */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono">
                  <span>Primary Authority:</span>
                  <strong className="text-slate-900 dark:text-slate-200">{b.primaryRegulator}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono">
                  <span>Execution Model:</span>
                  <strong className="text-slate-900 dark:text-slate-200">{b.executionModel}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono">
                  <span>Platforms:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{b.platforms.slice(0, 3).join(", ")}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <StatusBadge status={b.verificationStatus} size="sm" />
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect 120-pt Audit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
