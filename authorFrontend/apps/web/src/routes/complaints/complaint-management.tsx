import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import type { ComplaintAdmin } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Send,
  Eye,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  X,
  Building2,
  UserCheck,
  RotateCcw,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  Scale,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  FileCheck,
  BadgeAlert,
  ChevronRight
} from "lucide-react";

export default function ComplaintManagement() {
  const { complaints, updateComplaintStatus, setSelectedEvidenceModal, evidenceList, brokers, activeRoleDef } = useAdmin();

  // Selected case state
  const [selectedCaseId, setSelectedCaseId] = useState<string>(complaints[0]?.id || "");
  const [resolutionNote, setResolutionNote] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters state
  const [filterTab, setFilterTab] = useState<"all" | "active" | "under_review" | "broker_contacted" | "evidence_review" | "resolved" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerFilter, setBrokerFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Broker Options from complaints
  const brokerOptions = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach((c) => set.add(c.brokerName));
    return Array.from(set).sort();
  }, [complaints]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // 1. Tab filter
      if (filterTab === "active" && (c.status === "resolved" || c.status === "rejected" || c.status === "closed")) return false;
      if (filterTab === "under_review" && c.status !== "under_review" && c.status !== "submitted") return false;
      if (filterTab === "broker_contacted" && c.status !== "broker_contacted" && c.status !== "broker_responded") return false;
      if (filterTab === "evidence_review" && c.status !== "evidence_review") return false;
      if (filterTab === "resolved" && c.status !== "resolved") return false;
      if (filterTab === "closed" && c.status !== "closed" && c.status !== "rejected") return false;

      // 2. Broker filter
      if (brokerFilter !== "all" && c.brokerName !== brokerFilter) return false;

      // 3. Category filter
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.caseNumber.toLowerCase().includes(q) ||
          c.brokerName.toLowerCase().includes(q) ||
          c.userName.toLowerCase().includes(q) ||
          c.userEmail.toLowerCase().includes(q) ||
          c.claimTitle.toLowerCase().includes(q) ||
          c.claimDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complaints, filterTab, brokerFilter, categoryFilter, searchQuery]);

  // Selected case
  const selectedCase = complaints.find((c) => c.id === selectedCaseId) || filteredComplaints[0] || complaints[0];
  const linkedEvidence = selectedCase?.evidenceIds?.[0] ? evidenceList.find((e) => e.id === selectedCase.evidenceIds[0]) : null;

  // Executive Metrics
  const totalClaimExposure = useMemo(() => {
    return complaints.reduce((sum, c) => sum + (c.claimAmount || 0), 0);
  }, [complaints]);

  const activeCasesCount = useMemo(() => {
    return complaints.filter((c) => c.status !== "resolved" && c.status !== "closed" && c.status !== "rejected").length;
  }, [complaints]);

  const settledAmountTotal = useMemo(() => {
    return complaints.reduce((sum, c) => (c.status === "resolved" ? sum + (c.settledAmount || c.claimAmount || 0) : sum), 0);
  }, [complaints]);

  const resolvedCount = useMemo(() => {
    return complaints.filter((c) => c.status === "resolved").length;
  }, [complaints]);

  const resolutionRate = complaints.length > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 0;

  const handleCopyCase = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdate = (status: ComplaintAdmin["status"]) => {
    if (!selectedCase) return;
    const defaultNotes: Record<string, string> = {
      broker_contacted: "Formal dispute notification & inquiry dispatched to broker compliance desk.",
      evidence_review: "Case escalated to senior forensic auditor for Swift wire / statement verification.",
      under_review: "Under active multi-party mediation review.",
      resolved: "Dispute settled successfully. Client confirmed funds receipt or restitution agreement reached.",
      rejected: "Dispute rejected. Insufficient evidence or execution was compliant with standard broker TOS.",
      closed: "Case closed by arbitration administrator.",
    };

    const finalNote = resolutionNote.trim() || defaultNotes[status] || `Dispute status updated to ${status}.`;
    updateComplaintStatus(selectedCase.id, status, finalNote);
    setActionSuccess(`Case #${selectedCase.caseNumber} updated to ${status.replace("_", " ").toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 4500);
    setResolutionNote("");
  };

  const formatCategory = (cat: string) => {
    switch (cat) {
      case "delayed_withdrawal":
        return "Delayed Withdrawal";
      case "unauthorized_trade":
        return "Unauthorized Trade";
      case "excessive_slippage":
        return "Excessive Slippage";
      case "account_freeze":
        return "Account Freeze";
      case "misleading_bonus":
        return "Misleading Bonus Terms";
      default:
        return "General Dispute";
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "delayed_withdrawal":
        return "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900";
      case "excessive_slippage":
        return "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900";
      case "unauthorized_trade":
        return "text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900";
      case "account_freeze":
        return "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/60 border-red-200 dark:border-red-900";
      default:
        return "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900";
    }
  };

  const quickPresets = [
    "Intermediary correspondent bank held funds for AML check; SWIFT MT103 confirmation verified.",
    "Trader confirmed 100% receipt of disputed funds in designated bank account.",
    "Broker agreed to re-credit disputed slippage difference ($150) as trading credit.",
    "Order execution logs verify slippage occurred during high-impact market news release within contract specs.",
  ];

  const hasActiveFilters = searchQuery !== "" || brokerFilter !== "all" || categoryFilter !== "all" || filterTab !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setBrokerFilter("all");
    setCategoryFilter("all");
    setFilterTab("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-xs mb-1.5 font-bold">
            <Scale className="h-3.5 w-3.5 text-rose-500" />
            <span>DISPUTE ARBITRATION CONSOLE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Trader Complaints & Financial Dispute Mediation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Institutional multi-party dispute resolution engine for deposit delays, execution slippage, and fund reclamation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 dark:text-slate-400">Arbitration Desk:</span>
            <span className="font-bold text-slate-900 dark:text-white">{activeRoleDef.name}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Executive Financial Exposure & Dispute KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Total Claim Exposure</span>
            <DollarSign className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            ${totalClaimExposure.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-rose-600 dark:text-rose-400 font-bold">{complaints.length} cases</span> registered in ledger
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Active Disputes</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {activeCasesCount}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <Clock className="h-3 w-3" />
            <span>Mediation SLA &lt; 48 hrs</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Settled Funds Recovered</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            ${settledAmountTotal.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-3 w-3" />
            <span>{resolvedCount} resolved cases</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Mediation Recovery Rate</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            {resolutionRate}%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Institutional proof validation</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-xs">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: "all", label: "All Cases", count: complaints.length },
            { id: "active", label: "Active In Mediation", count: activeCasesCount },
            { id: "under_review", label: "Under Review", count: complaints.filter((c) => c.status === "under_review" || c.status === "submitted").length },
            { id: "broker_contacted", label: "Awaiting Broker", count: complaints.filter((c) => c.status === "broker_contacted" || c.status === "broker_responded").length },
            { id: "evidence_review", label: "Evidence Audit", count: complaints.filter((c) => c.status === "evidence_review").length },
            { id: "resolved", label: "Settled & Resolved", count: resolvedCount },
            { id: "closed", label: "Closed / Rejected", count: complaints.filter((c) => c.status === "closed" || c.status === "rejected").length },
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-rose-500 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Query Input */}
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case #, broker, trader, email, or keywords..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Target Broker Filter */}
          <div className="lg:col-span-3">
            <select
              value={brokerFilter}
              onChange={(e) => setBrokerFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="all">All Brokers</option>
              {brokerOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="all">All Categories</option>
              <option value="delayed_withdrawal">Delayed Withdrawal</option>
              <option value="excessive_slippage">Excessive Slippage</option>
              <option value="unauthorized_trade">Unauthorized Trade</option>
              <option value="account_freeze">Account Freeze</option>
              <option value="misleading_bonus">Misleading Bonus</option>
              <option value="other">Other Allegations</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Split-Pane Dispute Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Case Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span>Dispute Cases Queue</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                {filteredComplaints.length} shown
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Select to arbitrate</span>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <Scale className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900 dark:text-slate-200">No matching disputes found</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No complaint records matched your search query or filter criteria.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1 no-scrollbar">
              {filteredComplaints.map((c) => {
                const isSelected = c.id === selectedCase?.id;
                const hasEvidence = c.evidenceIds && c.evidenceIds.length > 0;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                      isSelected
                        ? "bg-rose-50/40 dark:bg-slate-900/90 border-rose-500 shadow-md ring-1 ring-rose-500/30"
                        : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                    }`}
                  >
                    {/* Top Row: Case # + Disputed Amount */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60">
                            {c.caseNumber}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(c.category)}`}>
                            {formatCategory(c.category)}
                          </span>
                        </div>
                        <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5 pt-0.5">
                          <Building2 className="h-3.5 w-3.5 text-amber-500" />
                          <span>{c.brokerName}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-black text-base text-rose-600 dark:text-rose-400">
                          {c.currency === "EUR" ? "€" : "$"}{c.claimAmount.toLocaleString()} <span className="text-[10px] text-slate-400">{c.currency}</span>
                        </div>
                        <div className="pt-0.5">
                          <StatusBadge status={c.status} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Claim Title */}
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {c.claimTitle}
                    </p>

                    {/* Bottom Metadata: Trader & Verification */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80 font-mono">
                      <div className="flex items-center gap-1 truncate max-w-[190px]">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{c.userName}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {hasEvidence && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            <FileCheck className="h-3 w-3" />
                            <span>Evidence</span>
                          </span>
                        )}
                        <span>{c.submittedAt.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Deep Dispute Arbitration Workspace */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
              {/* Workspace Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900/80 px-2.5 py-1 rounded-lg">
                      {selectedCase.caseNumber}
                    </span>
                    <button
                      onClick={() => handleCopyCase(selectedCase.caseNumber)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      title="Copy Case Number"
                    >
                      {copiedId === selectedCase.caseNumber ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(selectedCase.category)}`}>
                      {formatCategory(selectedCase.category)}
                    </span>
                    <StatusBadge status={selectedCase.status} size="sm" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedCase.claimTitle}
                  </h2>
                </div>

                <div className="text-right bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono shadow-xs shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Financial Claim Exposure</div>
                  <div className="text-xl font-black text-rose-600 dark:text-rose-400">
                    {selectedCase.currency === "EUR" ? "€" : "$"}{selectedCase.claimAmount.toLocaleString()} <span className="text-xs text-slate-500">{selectedCase.currency}</span>
                  </div>
                  {selectedCase.settledAmount && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      Settled: ${selectedCase.settledAmount.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Two-Party Disputation Dossier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Claimant Dossier */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                    <span>Claimant Profile</span>
                    {selectedCase.isVerifiedTrader && (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Trader
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-emerald-500" />
                    <span>{selectedCase.userName}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{selectedCase.userEmail}</div>
                  <div className="text-[10px] font-mono text-slate-400">User ID: {selectedCase.userId}</div>
                </div>

                {/* Accused Broker Dossier */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                    <span>Target Broker Entity</span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono">Entity ID: {selectedCase.brokerId}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    <span>{selectedCase.brokerName}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Opened: {selectedCase.submittedAt}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Last Ledger Update: {selectedCase.updatedAt}</div>
                </div>
              </div>

              {/* Allegation Breakdown Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    <span>Trader Allegation Details</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Category: {formatCategory(selectedCase.category)}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                  <p>{selectedCase.claimDescription}</p>
                </div>
              </div>

              {/* Attached Evidence & Swift Proof Preview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  <span>Forensic Evidence & Banking Slips</span>
                </h3>

                {linkedEvidence ? (
                  <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-700 dark:text-emerald-300">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{linkedEvidence.title}</div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          ID: {linkedEvidence.id} • SHA-256 Hash Verified • {linkedEvidence.fileFormat.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEvidenceModal(linkedEvidence)}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs cursor-pointer shadow-xs transition-colors shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5 text-amber-500" />
                      <span>Inspect Swift Proof</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    <span>No external SWIFT wire slips or MT statement files attached to this initial dispute submission.</span>
                  </div>
                )}
              </div>

              {/* Broker Settlement Response & Defense Thread */}
              {selectedCase.brokerResponse ? (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    <span>Official Broker Defense & Settlement Response</span>
                  </h3>
                  <div className="p-4 bg-amber-50/40 dark:bg-slate-950 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pb-2 border-b border-amber-200/60 dark:border-amber-900/40 font-mono">
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        Responder: {selectedCase.brokerResponse.contactPerson}
                      </span>
                      <span className="text-slate-500">{selectedCase.brokerResponse.submittedAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedCase.brokerResponse.content}
                    </p>

                    {selectedCase.brokerResponse.resolutionOffer && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Formal Settlement & Compensation Offer</span>
                        </div>
                        <p className="text-emerald-900 dark:text-emerald-200 font-medium">
                          {selectedCase.brokerResponse.resolutionOffer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/30 rounded-xl text-xs text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Awaiting official formal rebuttal & bank wire telemetry from {selectedCase.brokerName} compliance desk.</span>
                </div>
              )}

              {/* Dispute Case Timeline & Audit History */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Dispute Milestone Timeline ({selectedCase.timeline.length})</span>
                </h3>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {selectedCase.timeline.map((t, idx) => (
                    <div
                      key={t.id || idx}
                      className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{t.title}</span>
                        <span className="font-mono text-[10px] text-slate-500">{t.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-100 dark:border-slate-800/60">
                        <span>Actor: <strong className="text-slate-700 dark:text-slate-300">{t.actor}</strong></span>
                        <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px]">{t.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mediation & Arbitration Action Console */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-rose-500" />
                    <span>Mediation Action Console</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Audit Logging Active
                  </span>
                </div>

                {/* Quick Note Presets */}
                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Quick Statement Presets:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setResolutionNote(preset)}
                        className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        {preset.length > 45 ? preset.substring(0, 45) + "..." : preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution Textarea */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Arbitration Notes & Official Mediation Ruling *
                  </label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Enter formal mediation outcome, settlement notes, or instructions for broker/client..."
                    rows={3}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleUpdate("rejected")}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject Dispute</span>
                    </button>

                    <button
                      onClick={() => handleUpdate("evidence_review")}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <FileCheck className="h-3.5 w-3.5" />
                      <span>Escalate to Forensic Audit</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleUpdate("broker_contacted")}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Broker Notice</span>
                    </button>

                    <button
                      onClick={() => handleUpdate("resolved")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Mark Settled & Resolved</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <Scale className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200">No Case Selected</div>
              <p className="text-xs text-slate-500">Select a dispute case from the queue on the left to review details and arbitrate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
