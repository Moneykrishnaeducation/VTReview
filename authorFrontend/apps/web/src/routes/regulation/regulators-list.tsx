import React, { useState, useMemo, useEffect } from "react";
import { useAdmin } from "../../context/admin-context";
import type { RegulatorAdmin, RegulationTier } from "../../types/admin";
import { DataTable, type Column } from "../../components/data-table";
import { StatusBadge } from "../../components/status-badge";
import {
  Scale,
  ShieldCheck,
  ExternalLink,
  Building2,
  Plus,
  Download,
  Search,
  Filter,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  X,
  Globe,
  Coins,
  ShieldAlert,
  Calendar,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  BadgeCheck,
  Info,
  Loader2,
  Check
} from "lucide-react";

export default function RegulatorsList() {
  const { regulators, brokers, addRegulator } = useAdmin();
  const [selectedRegulator, setSelectedRegulator] = useState<RegulatorAdmin | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | RegulationTier>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Add Regulator Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form State for Add Regulator
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [flag, setFlag] = useState("🏛️");
  const [tier, setTier] = useState<RegulationTier>("Tier-1");
  const [status, setStatus] = useState<"active" | "warning" | "defunct">("active");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [registerSearchUrl, setRegisterSearchUrl] = useState("");
  const [compensationScheme, setCompensationScheme] = useState("");
  const [maxCoverageFormatted, setMaxCoverageFormatted] = useState("");
  const [description, setDescription] = useState("");
  const [powersInput, setPowersInput] = useState("Fines, Administrative suspension, License revocation");

  // Filtered list
  const filteredRegulators = useMemo(() => {
    return regulators.filter((reg) => {
      if (tierFilter !== "all" && reg.tier !== tierFilter) return false;
      if (statusFilter !== "all" && reg.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          reg.name.toLowerCase().includes(q) ||
          reg.code.toLowerCase().includes(q) ||
          reg.jurisdiction.toLowerCase().includes(q) ||
          reg.compensationScheme.toLowerCase().includes(q) ||
          reg.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [regulators, tierFilter, statusFilter, searchQuery]);

  // Statistics
  const tier1Count = regulators.filter((r) => r.tier === "Tier-1").length;
  const tier2Count = regulators.filter((r) => r.tier === "Tier-2").length;
  const totalBrokersCovered = regulators.reduce((sum, r) => sum + r.activeBrokersCount, 0);

  // Close modals on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAddModal) setShowAddModal(false);
        else if (selectedRegulator) setSelectedRegulator(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAddModal, selectedRegulator]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Code,Name,Jurisdiction,Tier,CompensationScheme,MaxCoverage,ActiveBrokers,OfficialWebsite\n";
    const rows = filteredRegulators
      .map(
        (r) =>
          `"${r.code}","${r.name}","${r.jurisdiction}","${r.tier}","${r.compensationScheme}","${r.maxCoverageFormatted}","${r.activeBrokersCount}","${r.officialWebsite}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `regulatory-authorities-registry-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Add Regulator
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const powersArray = powersInput
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    setTimeout(() => {
      const created = addRegulator({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        jurisdiction: jurisdiction.trim(),
        flag: flag.trim() || "🏛️",
        tier,
        status,
        officialWebsite: officialWebsite.trim() || "https://example.gov",
        registerSearchUrl: registerSearchUrl.trim() || officialWebsite.trim() || "https://example.gov",
        compensationScheme: compensationScheme.trim() || "No Statutory Scheme",
        maxCoverageFormatted: maxCoverageFormatted.trim() || "N/A",
        activeBrokersCount: 0,
        description: description.trim() || `Government financial conduct regulator for ${jurisdiction}.`,
        powers: powersArray.length > 0 ? powersArray : ["License revocation", "Fines", "Investor warnings"],
      });

      setIsSubmitting(false);
      setShowAddModal(false);
      setSuccessBanner(`Successfully registered ${created.code} (${created.jurisdiction}) into statutory database.`);

      // Reset form fields
      setCode("");
      setName("");
      setJurisdiction("");
      setFlag("🏛️");
      setOfficialWebsite("");
      setRegisterSearchUrl("");
      setCompensationScheme("");
      setMaxCoverageFormatted("");
      setDescription("");
      setPowersInput("Fines, Administrative suspension, License revocation");

      setTimeout(() => setSuccessBanner(null), 5000);
    }, 600);
  };

  // Table Columns
  const columns: Column<RegulatorAdmin>[] = [
    {
      header: "Regulator & Jurisdiction",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl drop-shadow-xs">{row.flag}</span>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{row.code}</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal text-xs">({row.name})</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.jurisdiction}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Tier Classification",
      accessorKey: "tier",
      sortable: true,
      cell: (row) => <StatusBadge status={row.tier} size="sm" />,
    },
    {
      header: "Compensation Protection",
      accessorKey: "compensationScheme",
      cell: (row) => (
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <div className="font-semibold text-slate-900 dark:text-slate-100">{row.compensationScheme}</div>
          <div className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mt-0.5">
            {row.maxCoverageFormatted}
          </div>
        </div>
      ),
    },
    {
      header: "Active Licensees",
      accessorKey: "activeBrokersCount",
      sortable: true,
      cell: (row) => (
        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-lg text-xs">
          <Building2 className="h-3 w-3" />
          <span>{row.activeBrokersCount} Verified</span>
        </span>
      ),
    },
    {
      header: "Last Audit & Auditor",
      accessorKey: "lastVerifiedDate",
      sortable: true,
      cell: (row) => (
        <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="font-bold text-slate-900 dark:text-slate-200">{row.lastVerifiedDate}</div>
          <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{row.verificationOwner}</div>
        </div>
      ),
    },
    {
      header: "Official Registry",
      cell: (row) => (
        <a
          href={row.registerSearchUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
        >
          <span>Search Portal</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
  ];

  // Helper to find brokers regulated by selected authority
  const getBrokersForAuthority = (authorityCode: string) => {
    return brokers.filter((b) => b.licenses?.some((lic) => lic.regulatorCode === authorityCode));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. HERO HEADER & REGULATORY SCOPE STATS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 font-mono text-[11px] mb-2 font-bold">
            <Scale className="h-3.5 w-3.5" />
            <span>GLOBAL STATUTORY REGISTRY ({regulators.length} Authorities)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Statutory Regulators & Compensation Schemes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global repository of government financial conduct authorities, investor compensation funds, and supervisory powers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Registry (.CSV)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Authority</span>
          </button>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION BANNER */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-emerald-900 dark:text-emerald-200">{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. EXECUTIVE METRICS TILES (4 CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Authorities Tracked</span>
            <Globe className="h-4 w-4 text-blue-500" />
          </div>
          <div className="font-mono text-2xl font-black text-slate-900 dark:text-white">{regulators.length}</div>
          <div className="text-[11px] text-slate-500">Across 24+ Tier 1/2 jurisdictions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Tier-1 Top Regulators</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">{tier1Count}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">FCA, ASIC, BaFin (Highest Protection)</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Tier-2 EU / Mid Hubs</span>
            <Coins className="h-4 w-4 text-amber-500" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400">{tier2Count}</div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">MiFID II Passporting Framework</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Verified Licensees</span>
            <Building2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="font-mono text-2xl font-black text-slate-900 dark:text-white">{totalBrokersCovered}+</div>
          <div className="text-[11px] text-slate-500">Active broker entities indexed</div>
        </div>
      </div>

      {/* 3. TOOLBAR CONTROLS (SEARCH, TIER TABS, VIEW SWITCHER) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search regulator code (FCA, ASIC), country, protection scheme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Tier Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              {[
                { id: "all", label: "All Tiers" },
                { id: "Tier-1", label: "Tier-1" },
                { id: "Tier-2", label: "Tier-2" },
                { id: "Tier-3", label: "Tier-3" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTierFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    tierFilter === tab.id
                      ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-2xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-2xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="High-Density Table View"
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        </div>

      {/* 4. MAIN CONTENT (CARDS GRID OR DATA TABLE) */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRegulators.map((reg) => (
            <div
              key={reg.id}
              onClick={() => setSelectedRegulator(reg)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 rounded-3xl p-5 text-xs space-y-4 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl drop-shadow-xs">{reg.flag}</span>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {reg.code}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {reg.jurisdiction}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={reg.tier} size="sm" />
                </div>

                <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">
                  {reg.name}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  {reg.description}
                </p>
              </div>

              {/* Card Footer Specs */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Compensation pill */}
                <div className="p-2 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{reg.compensationScheme}</span>
                  </div>
                  <div className="font-mono text-emerald-900 dark:text-emerald-300 font-black text-xs">
                    {reg.maxCoverageFormatted}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                    <Building2 className="h-3.5 w-3.5 text-amber-500" />
                    <span>{reg.activeBrokersCount} Verified Brokers</span>
                  </span>

                  <a
                    href={reg.registerSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-amber-600 dark:text-amber-400 transition-colors"
                    title="Open official registry search"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredRegulators}
          columns={columns}
          searchPlaceholder="Search regulator table..."
          searchKey="name"
          onRowClick={(row) => setSelectedRegulator(row)}
        />
      )}

      {/* 5. REGULATOR DETAIL INSPECTOR MODAL */}
      {selectedRegulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-xs space-y-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3.5">
                <span className="text-4xl drop-shadow-md">{selectedRegulator.flag}</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {selectedRegulator.name} ({selectedRegulator.code})
                    </h3>
                    <StatusBadge status={selectedRegulator.tier} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedRegulator.jurisdiction} • Statutory Financial Conduct Authority
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRegulator(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-500" />
                <span>Statutory Scope & Legal Authority Overview</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                {selectedRegulator.description}
              </p>
            </div>

            {/* 2-Column Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Compensation Protection Card */}
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 space-y-2 text-xs">
                <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Statutory Compensation Protection</span>
                </div>
                <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                  {selectedRegulator.compensationScheme}
                </div>
                <div className="font-mono text-emerald-600 dark:text-emerald-400 font-black text-sm">
                  {selectedRegulator.maxCoverageFormatted}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Guaranteed statutory compensation fund protecting eligible retail trader capital upon broker insolvency.
                </p>
              </div>

              {/* Statutory Enforcement Powers Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-amber-500" />
                  <span>Supervisory Enforcement Powers</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedRegulator.powers.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Metadata & Registered Brokers Preview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex flex-wrap items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Last Registry Sync: <strong className="text-slate-800 dark:text-slate-200">{selectedRegulator.lastVerifiedDate}</strong></span>
                <span>Auditor: <strong className="text-slate-800 dark:text-slate-200">{selectedRegulator.verificationOwner}</strong></span>
              </div>

              {/* Brokers active under this authority */}
              <div className="space-y-1.5 font-sans">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                  <span>Indexed Brokers Operating Under {selectedRegulator.code}:</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {getBrokersForAuthority(selectedRegulator.code).length} Entities
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getBrokersForAuthority(selectedRegulator.code).length > 0 ? (
                    getBrokersForAuthority(selectedRegulator.code).map((b) => (
                      <span
                        key={b.id}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-bold text-[11px]"
                      >
                        {b.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-[11px] italic">
                      {selectedRegulator.activeBrokersCount} authorized entities indexed on official register.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={selectedRegulator.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Visit Official Portal</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={selectedRegulator.registerSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open License Search Portal</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REGISTER NEW REGULATORY AUTHORITY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-xs space-y-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 font-mono text-[10px] font-bold">
                  <Scale className="h-3 w-3" />
                  <span>STATUTORY JURISDICTION CATALOG</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Register New Statutory Regulatory Authority
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Expand the compliance verification registry with a recognized financial conduct supervisor and statutory compensation scheme.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Code / Acronym */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Authority Acronym / Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. FINMA, NFA, MAS, DFSA"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold uppercase"
                  />
                </div>

                {/* Country Flag Emoji */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Flag Emoji
                  </label>
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="e.g. 🇨🇭, 🇸🇬, 🇺🇸, 🇦🇪"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-center text-lg"
                  />
                </div>

                {/* Full Statutory Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Full Legal Name of Authority *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Swiss Financial Market Supervisory Authority"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Jurisdiction / Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Jurisdiction / Sovereign State *
                  </label>
                  <input
                    type="text"
                    required
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    placeholder="e.g. Switzerland, Singapore, United States"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Tier Classification */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Regulatory Tier Classification *
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as RegulationTier)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="Tier-1">Tier-1 (Highest Supervision & Protection)</option>
                    <option value="Tier-2">Tier-2 (EU / MiFID II Regional Framework)</option>
                    <option value="Tier-3">Tier-3 (Offshore / Emerging Authority)</option>
                  </select>
                </div>

                {/* Compensation Scheme Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Statutory Compensation Scheme Name
                  </label>
                  <input
                    type="text"
                    value={compensationScheme}
                    onChange={(e) => setCompensationScheme(e.target.value)}
                    placeholder="e.g. esisuisse Deposit Guarantee / FSCS / ICF"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Max Coverage Formatted */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Maximum Claim Coverage Amount
                  </label>
                  <input
                    type="text"
                    value={maxCoverageFormatted}
                    onChange={(e) => setMaxCoverageFormatted(e.target.value)}
                    placeholder="e.g. CHF 100,000 per depositor / €20,000"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Official Website URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={officialWebsite}
                    onChange={(e) => setOfficialWebsite(e.target.value)}
                    placeholder="https://www.finma.ch"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Public Register Search URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Public License Search Portal URL
                  </label>
                  <input
                    type="url"
                    value={registerSearchUrl}
                    onChange={(e) => setRegisterSearchUrl(e.target.value)}
                    placeholder="https://www.finma.ch/en/finma-public/authorisation/"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Supervisory Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Regulatory Mandate & Scope Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe legal jurisdiction, statutory enforcement capabilities, and retail investor protection mandate..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium resize-none"
                  />
                </div>

                {/* Enforcement Powers */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Statutory Enforcement Powers (comma separated)
                  </label>
                  <input
                    type="text"
                    value={powersInput}
                    onChange={(e) => setPowersInput(e.target.value)}
                    placeholder="Fines, Administrative suspension, License revocation, Asset freezes"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Registering Authority...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Register Authority</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
