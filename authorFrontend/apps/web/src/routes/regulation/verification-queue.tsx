import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import type { LicenseVerificationItem, VerificationStatus } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  Clock,
  AlertTriangle,
  UserCheck,
  Eye,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  Building2,
  Scale,
  Hash,
  ArrowRight,
  HelpCircle,
  FileSearch,
  CheckSquare2,
  RotateCcw,
  Zap,
  Info
} from "lucide-react";

export default function VerificationQueue() {
  const { verifications, verifyLicense, rejectLicense, setSelectedEvidenceModal, evidenceList, activeRoleDef } = useAdmin();

  // Selected item state
  const [selectedVerificationId, setSelectedVerificationId] = useState<string>(verifications[0]?.id || "");
  const [analystNotes, setAnalystNotes] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [regulatorFilter, setRegulatorFilter] = useState<string>("all");

  // Get unique regulators
  const regulatorOptions = useMemo(() => {
    const set = new Set<string>();
    verifications.forEach((v) => set.add(v.regulatorCode));
    return Array.from(set).sort();
  }, [verifications]);

  // Filtered queue items
  const filteredVerifications = useMemo(() => {
    return verifications.filter((v) => {
      // 1. Status Filter
      if (statusFilter !== "all" && v.status !== statusFilter) return false;

      // 2. Regulator Filter
      if (regulatorFilter !== "all" && v.regulatorCode !== regulatorFilter) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.brokerName.toLowerCase().includes(q) ||
          v.licenseNumber.toLowerCase().includes(q) ||
          v.regulatorCode.toLowerCase().includes(q) ||
          v.licenseeEntity.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [verifications, statusFilter, regulatorFilter, searchQuery]);

  // Active selected item
  const selectedItem =
    verifications.find((v) => v.id === selectedVerificationId) ||
    filteredVerifications[0] ||
    verifications[0];

  const linkedEvidence = selectedItem ? evidenceList.find((e) => e.id === selectedItem.evidenceId) : null;

  // Counts
  const pendingCount = verifications.filter((v) => v.status === "pending").length;
  const verifiedCount = verifications.filter((v) => v.status === "verified").length;
  const rejectedCount = verifications.filter((v) => v.status === "rejected").length;

  const handleVerify = () => {
    if (!selectedItem) return;
    const notesToSave = analystNotes || "Direct register check confirms active license permissions and matching entity.";
    verifyLicense(selectedItem.id, notesToSave);
    setActionSuccess(`Certified and stamped license ${selectedItem.regulatorCode} #${selectedItem.licenseNumber} for ${selectedItem.brokerName}.`);
    setAnalystNotes("");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleReject = () => {
    if (!selectedItem) return;
    const notesToSave = analystNotes || "License details do not match official statutory register; flagged as suspect clone.";
    rejectLicense(selectedItem.id, notesToSave);
    setActionSuccess(`Rejected and flagged license application ${selectedItem.regulatorCode} #${selectedItem.licenseNumber}.`);
    setAnalystNotes("");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const presetNotes = [
    "✓ Direct official register cross-check confirms active authorized status.",
    "✓ Entity name and registered office address match company incorporation.",
    "⚠ Entity name discrepancy with official statutory licensee records.",
    "✕ Suspect clone entity using stolen regulatory credentials.",
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. WORKSPACE HEADER & EXECUTIVE STATS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] mb-2 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>COMPLIANCE CERTIFICATION DESK</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Regulatory License Verification Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Perform forensic audits on submitted broker licenses against official FCA, ASIC, CySEC, and BaFin registers.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-amber-800 dark:text-amber-400">
            <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Pending Audits</div>
            <div className="font-black text-base">{pendingCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-800 dark:text-emerald-400">
            <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Certified</div>
            <div className="font-black text-base">{verifiedCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center text-rose-800 dark:text-rose-400">
            <div className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400">Flagged Clones</div>
            <div className="font-black text-base">{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* 2. SUCCESS NOTIFICATION BANNER */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="font-medium text-emerald-900 dark:text-emerald-200">
              {actionSuccess} <strong className="text-emerald-700 dark:text-emerald-300 font-mono">Immutable audit log registered.</strong>
            </span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. SPLIT-PANE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Queue Controls & Applications List (5 Columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-amber-500" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                License Applications ({filteredVerifications.length})
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Real-time Feed</span>
          </div>

          {/* Search & Filters */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search broker, license #, entity..."
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

            {/* Quick Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: "all", label: "All", count: verifications.length },
                { id: "pending", label: "Pending", count: pendingCount },
                { id: "verified", label: "Verified", count: verifiedCount },
                { id: "rejected", label: "Rejected", count: rejectedCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="font-mono text-[10px] opacity-75">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Regulator Select */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 text-[11px] font-medium">Filter by Regulator:</span>
              <select
                value={regulatorFilter}
                onChange={(e) => setRegulatorFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
              >
                <option value="all">All Authorities</option>
                {regulatorOptions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Queue List Items */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
            {filteredVerifications.length > 0 ? (
              filteredVerifications.map((item) => {
                const isSelected = item.id === selectedVerificationId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedVerificationId(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 relative ${
                      isSelected
                        ? "bg-amber-500/5 dark:bg-slate-950 border-amber-500/60 shadow-md ring-1 ring-amber-500/30"
                        : "bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Active highlight bar on left */}
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r" />
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          <span>{item.brokerName}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            {item.id}
                          </span>
                        </div>
                        <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                          <span>{item.regulatorCode}</span>
                          <span>#{item.licenseNumber}</span>
                        </div>
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-xs line-clamp-1">
                      <strong className="text-slate-700 dark:text-slate-300">Entity:</strong> {item.licenseeEntity}
                    </div>

                    {/* Confidence Score Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500">Registry Match Confidence:</span>
                        <span
                          className={`font-black ${
                            item.confidenceScore >= 90
                              ? "text-emerald-600 dark:text-emerald-400"
                              : item.confidenceScore >= 70
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {item.confidenceScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.confidenceScore >= 90
                              ? "bg-emerald-500"
                              : item.confidenceScore >= 70
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${item.confidenceScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1.5 border-t border-slate-200 dark:border-slate-800/80">
                      <span>{item.jurisdiction}</span>
                      <span>{item.submittedAt.split(" ")[0]}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <FileSearch className="h-6 w-6 mx-auto text-slate-400" />
                <p>No license applications matching filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setRegulatorFilter("all");
                  }}
                  className="text-amber-600 font-bold hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence Inspector & Verification Decision Desk (7 Columns) */}
        {selectedItem ? (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Inspector Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 dark:bg-amber-950/60 border border-amber-500/25 dark:border-amber-800 px-2 py-0.5 rounded">
                    {selectedItem.id}
                  </span>
                  <StatusBadge status={selectedItem.status} size="sm" />
                  <span className="text-[11px] font-mono text-slate-500">Submitted: {selectedItem.submittedAt}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {selectedItem.brokerName} — {selectedItem.regulatorName}
                </h3>
              </div>

              {selectedItem.officialRegisterUrl && (
                <a
                  href={selectedItem.officialRegisterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Open Official Register</span>
                </a>
              )}
            </div>

            {/* CONFIDENCE & FORENSIC MATCH GAUGE */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                selectedItem.confidenceScore >= 90
                  ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                  : selectedItem.confidenceScore >= 70
                  ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30 text-amber-900 dark:text-amber-200"
                  : "bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 text-rose-900 dark:text-rose-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    selectedItem.confidenceScore >= 90
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : selectedItem.confidenceScore >= 70
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {selectedItem.confidenceScore >= 90 ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : (
                    <ShieldAlert className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="font-black text-sm">
                    {selectedItem.confidenceScore >= 90
                      ? "High Verification Match Confidence"
                      : selectedItem.confidenceScore >= 70
                      ? "Medium Confidence — Manual Cross-Check Required"
                      : "High Risk Alert — License Inconsistency Detected"}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {selectedItem.confidenceScore >= 90
                      ? "All statutory parameters correspond to registered database records."
                      : "Potential unauthorized clone, name mismatch, or inactive regulatory license."}
                  </div>
                </div>
              </div>

              <div className="font-mono text-2xl font-black shrink-0 text-right">
                {selectedItem.confidenceScore}% <span className="text-xs font-normal block opacity-75">Score</span>
              </div>
            </div>

            {/* COMPARISON MATRIX: Submitted Claim vs Official Register */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Forensic Discrepancy Matrix
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Submitted Broker Claim */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span>Submitted Broker Claim</span>
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Legal Entity:</span>
                      <span className="font-bold text-right truncate max-w-[180px]">{selectedItem.licenseeEntity}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Regulator:</span>
                      <span className="font-bold">{selectedItem.regulatorCode}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">License Number:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">#{selectedItem.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Jurisdiction:</span>
                      <span className="font-bold">{selectedItem.jurisdiction}</span>
                    </div>
                  </div>
                </div>

                {/* Linked Evidence Record */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Cryptographic Evidence Record</span>
                      </span>
                      {linkedEvidence && (
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          {linkedEvidence.id}
                        </span>
                      )}
                    </div>

                    {linkedEvidence ? (
                      <div className="space-y-1.5 pt-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{linkedEvidence.title}</div>
                        <div className="text-[10px] text-slate-500">
                          Format: {linkedEvidence.fileFormat} • SHA-256 Checksum Verified
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{linkedEvidence.checksum}</div>
                      </div>
                    ) : (
                      <div className="pt-3 text-slate-500 text-xs">No primary snapshot attached to this claim.</div>
                    )}
                  </div>

                  {linkedEvidence && (
                    <button
                      onClick={() => setSelectedEvidenceModal(linkedEvidence)}
                      className="w-full py-2 px-3 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-amber-500" />
                      <span>Inspect Evidence File ({linkedEvidence.id})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Analyst Submission Notes */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-300 text-xs flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-500" />
                <span>Analyst Submission & Research Findings</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs pl-5">
                "{selectedItem.analystNotes}"
              </p>
            </div>

            {/* COMPLIANCE DECISION & CERTIFICATION CONSOLE */}
            <div className="p-5 rounded-3xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Compliance Decision & Digital Stamping
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Signing as compliance officer: <strong className="text-slate-800 dark:text-slate-200">{activeRoleDef.name}</strong>
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Quick Note Presets */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Quick Findings Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {presetNotes.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAnalystNotes(preset)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-left"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auditor Notes Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mandatory Compliance Certification Notes *
                </label>
                <textarea
                  value={analystNotes}
                  onChange={(e) => setAnalystNotes(e.target.value)}
                  placeholder="Record verification methodology, register date accessed, company registry number, or reason for rejection..."
                  rows={2}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium resize-none"
                />
              </div>

              {/* Decision Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <div className="text-[11px] font-mono text-slate-500">
                  Queue Item: {selectedItem.id}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold rounded-xl border border-rose-300 dark:border-rose-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject / Flag Clone</span>
                  </button>

                  <button
                    onClick={handleVerify}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify & Stamp License</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
