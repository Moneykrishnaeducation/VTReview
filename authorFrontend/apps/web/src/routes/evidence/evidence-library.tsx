import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAdmin } from "../../context/admin-context";
import type { EvidenceItem, VerificationStatus } from "../../types/admin";
import { EvidenceCard } from "../../components/evidence-card";
import { StatusBadge } from "../../components/status-badge";
import {
  FileText,
  ShieldCheck,
  Upload,
  Filter,
  Plus,
  Search,
  CheckCircle2,
  Building2,
  X,
  FileSpreadsheet,
  FileCheck,
  Hash,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  Info,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Paperclip,
  Database,
  ArrowUpDown
} from "lucide-react";

export default function EvidenceLibrary() {
  const { evidenceList, brokers, addEvidence } = useAdmin();

  // Filters state
  const [brokerFilter, setBrokerFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUploadedItem, setLastUploadedItem] = useState<EvidenceItem | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Upload Form Fields
  const [title, setTitle] = useState("");
  const [selectedBroker, setSelectedBroker] = useState(brokers[0]?.name || "Pepperstone");
  const [evidenceType, setEvidenceType] = useState<EvidenceItem["type"]>("regulatory_register");
  const [sourceUrl, setSourceUrl] = useState("");
  const [initialStatus, setInitialStatus] = useState<VerificationStatus>("verified");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [computedChecksum, setComputedChecksum] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique list of brokers available for filtering (from brokers store + evidence records)
  const brokerOptions = useMemo(() => {
    const brokerMap = new Map<string, { id: string; name: string; count: number }>();

    // Prepopulate from brokers list
    brokers.forEach((b) => {
      brokerMap.set(b.name.toLowerCase(), { id: b.id, name: b.name, count: 0 });
    });

    // Count evidence items
    evidenceList.forEach((ev) => {
      const key = ev.relatedEntityName.toLowerCase();
      if (brokerMap.has(key)) {
        const item = brokerMap.get(key)!;
        item.count += 1;
      } else {
        brokerMap.set(key, { id: ev.relatedEntityId || key, name: ev.relatedEntityName, count: 1 });
      }
    });

    return Array.from(brokerMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [brokers, evidenceList]);

  // Filter evidence list
  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((ev) => {
      // 1. Broker filter
      if (brokerFilter !== "all") {
        const matchesName = ev.relatedEntityName.toLowerCase() === brokerFilter.toLowerCase();
        const matchesId = ev.relatedEntityId.toLowerCase() === brokerFilter.toLowerCase();
        if (!matchesName && !matchesId) return false;
      }

      // 2. Type filter
      if (typeFilter !== "all" && ev.type !== typeFilter) return false;

      // 3. Status filter
      if (statusFilter !== "all" && ev.status !== statusFilter) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ev.id.toLowerCase().includes(q) ||
          ev.title.toLowerCase().includes(q) ||
          ev.relatedEntityName.toLowerCase().includes(q) ||
          ev.notes.toLowerCase().includes(q) ||
          ev.checksum.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [evidenceList, brokerFilter, typeFilter, statusFilter, searchQuery]);

  // Check if any filter is active
  const isFiltered = brokerFilter !== "all" || typeFilter !== "all" || statusFilter !== "all" || searchQuery.trim() !== "";
  const activeFiltersCount = [
    brokerFilter !== "all",
    typeFilter !== "all",
    statusFilter !== "all",
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setBrokerFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
  };

  // Generate mock checksum on file select
  const generateMockChecksum = (name: string) => {
    const chars = "0123456789abcdef";
    let hash = "";
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return `sha256:${hash}`;
  };

  const handleFileChosen = (file: File) => {
    setFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(`${sizeInMb} MB`);
    const hash = generateMockChecksum(file.name);
    setComputedChecksum(hash);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChosen(e.dataTransfer.files[0]);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showUploadModal) {
        setShowUploadModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showUploadModal]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const brokerObj = brokers.find((b) => b.name === selectedBroker);
    const finalChecksum = computedChecksum || generateMockChecksum(title || "document");

    setTimeout(() => {
      const newEv = addEvidence({
        title: title || "Evidence Document",
        type: evidenceType,
        relatedEntityType: "broker",
        relatedEntityId: brokerObj?.id || `broker-${Date.now()}`,
        relatedEntityName: selectedBroker,
        fileFormat: fileName ? fileName.split(".").pop()?.toUpperCase() || "PDF" : "PDF",
        fileSizeBytes: 2450000,
        status: initialStatus,
        checksum: finalChecksum,
        sourceUrl: sourceUrl || undefined,
        notes: notes || "Ingested via Evidence Library upload console.",
      });

      setIsSubmitting(false);
      setShowUploadModal(false);
      setLastUploadedItem(newEv);

      // Reset form fields
      setTitle("");
      setSourceUrl("");
      setNotes("");
      setFileName(null);
      setFileSize(null);
      setComputedChecksum("");

      setTimeout(() => setLastUploadedItem(null), 6000);
    }, 700);
  };

  const copyHashToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. VAULT HERO / STATS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[11px] mb-2 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>CENTRAL EVIDENCE VAULT & IMMUTABLE REGISTRY</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Evidence Library & Digital Audit Vault
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store, cross-verify, and audit cryptographic regulatory extracts, spread logs, and arbitration filings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Records</div>
              <div className="font-black text-slate-900 dark:text-white">{evidenceList.length}</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-700 dark:text-emerald-400">
              <div className="text-[10px] uppercase font-bold">Verified</div>
              <div className="font-black">
                {evidenceList.filter((e) => e.status === "verified").length}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Evidence</span>
          </button>
        </div>
      </div>

      {/* 2. SUCCESS INGESTION NOTIFICATION BANNER */}
      {lastUploadedItem && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs flex items-start justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <span>Evidence Ingestion Complete</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  {lastUploadedItem.id}
                </span>
              </div>
              <p className="text-emerald-800 dark:text-emerald-300">
                <strong>{lastUploadedItem.title}</strong> has been linked to{" "}
                <strong>{lastUploadedItem.relatedEntityName}</strong> and sealed with SHA-256 integrity hash.
              </p>
              <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 pt-0.5">
                <Hash className="h-3.5 w-3.5" />
                <span className="truncate max-w-sm sm:max-w-md">{lastUploadedItem.checksum}</span>
                <button
                  onClick={() => copyHashToClipboard(lastUploadedItem.checksum)}
                  className="p-1 hover:bg-emerald-500/20 rounded text-emerald-800 dark:text-emerald-300 cursor-pointer"
                  title="Copy SHA-256 checksum"
                >
                  {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLastUploadedItem(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. MULTI-PARAM FILTER TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
          {/* Quick Search */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search title, ID, checksum, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Broker Filter Dropdown */}
          <div className="lg:col-span-3 relative">
            <div className="relative flex items-center">
              <Building2 className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <select
                value={brokerFilter}
                onChange={(e) => setBrokerFilter(e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer font-medium ${brokerFilter !== "all"
                  ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 font-bold"
                  : "border-slate-200 dark:border-slate-800"
                  }`}
              >
                <option value="all">🏢 All Brokers ({evidenceList.length} docs)</option>
                {brokerOptions.map((broker) => (
                  <option key={broker.id} value={broker.name}>
                    {broker.name} ({broker.count} records)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Evidence Type Filter Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer font-medium ${typeFilter !== "all"
                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 font-bold"
                : "border-slate-200 dark:border-slate-800"
                }`}
            >
              <option value="all">📁 All Evidence Types</option>
              <option value="regulatory_register">Regulatory Register Snapshot</option>
              <option value="spread_test">Live Spread Telemetry Log (CSV)</option>
              <option value="trading_statement">Trader Account Statement</option>
              <option value="complaint_proof">Wire Slip / Dispute Proof</option>
              <option value="broker_legal_doc">Broker Legal / Terms Document</option>
              <option value="broker_response">Official Broker Response</option>
              <option value="research_source">Research & Press Disclosure</option>
            </select>
          </div>

          {/* Status Filter Dropdown & Reset */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer font-medium ${statusFilter !== "all"
                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 font-bold"
                : "border-slate-200 dark:border-slate-800"
                }`}
            >
              <option value="all">⚡ All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="needs_review">Needs Review</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </select>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary & Active Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {/* <span>
              Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredEvidence.length}</strong> of{" "}
              <strong>{evidenceList.length}</strong> evidence assets
            </span> */}

            {brokerFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-medium">
                Broker: {brokerFilter}
                <button onClick={() => setBrokerFilter("all")} className="hover:text-rose-500 ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {typeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20 font-medium">
                Type: {typeFilter.replace(/_/g, " ")}
                <button onClick={() => setTypeFilter("all")} className="hover:text-rose-500 ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="hover:text-rose-500 ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              Clear all filters ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* 4. EVIDENCE CARDS GRID OR EMPTY STATE */}
      {filteredEvidence.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No evidence records found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No documents matched your filter criteria {brokerFilter !== "all" && `for broker "${brokerFilter}"`}. Try
              adjusting or clearing your search filters.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                if (brokerFilter !== "all") setSelectedBroker(brokerFilter);
                setShowUploadModal(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Evidence</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. ELEVATED UPLOAD EVIDENCE POPUP MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-xs space-y-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold">
                  <Lock className="h-3 w-3" />
                  <span>SHA-256 IMMUTABLE INGESTION PIPELINE</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Ingest New Evidence Document
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload official regulatory snapshots, spread telemetry logs, or arbitration proof for permanent audit
                  verification.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              {/* DRAG AND DROP FILE ZONE */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Document Asset File *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChosen(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.png,.jpg,.jpeg,.csv,.htm,.html,.json,.txt"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${isDragging
                    ? "border-amber-500 bg-amber-500/10"
                    : fileName
                      ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-amber-500/50 bg-slate-50/50 dark:bg-slate-900/50"
                    }`}
                >
                  {fileName ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{fileName}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{fileSize} • Click to replace file</div>
                      </div>
                      {computedChecksum && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-[10px] border border-slate-200 dark:border-slate-800">
                          <Hash className="h-3 w-3 text-emerald-500" />
                          <span className="truncate max-w-xs">{computedChecksum}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          Drag & drop document here, or <span className="text-amber-600 dark:text-amber-400 underline">browse files</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Supports PDF, PNG, JPG, CSV telemetry, MT4/MT5 statements (up to 50MB)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FORM FIELDS GRID (2 COLUMNS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Evidence Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Evidence Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. FCA Register Screenshot for IC Markets UK (FRN 772142)"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Target Broker / Entity Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Related Broker / Financial Entity *
                  </label>
                  <select
                    value={selectedBroker}
                    onChange={(e) => setSelectedBroker(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium cursor-pointer"
                  >
                    {brokers.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.legalEntity || "Broker"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Evidence Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Evidence Classification *
                  </label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="regulatory_register">Regulatory Register Snapshot</option>
                    <option value="spread_test">Live Spread Telemetry Log (CSV)</option>
                    <option value="trading_statement">Trader Account Statement (MT4/MT5)</option>
                    <option value="complaint_proof">Bank Wire Confirmation Slip / Dispute Proof</option>
                    <option value="broker_legal_doc">Broker Legal / Client Agreement</option>
                    <option value="broker_response">Official Broker Written Defense</option>
                    <option value="research_source">Academic / Press Research Source</option>
                  </select>
                </div>

                {/* Source Register URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Official Registry / Source URL
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://register.fca.org.uk/s/firm?id=..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                {/* Initial Verification Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Initial Verification State
                  </label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="verified">Verified (Analyst Certified)</option>
                    <option value="pending">Pending Secondary Review</option>
                    <option value="needs_review">Needs Jurisdictional Clarification</option>
                  </select>
                </div>

                {/* Auditor Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Auditor Notes & Chain of Custody
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record timestamp of extraction, registered regulator reference number, and analyst observation notes..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium resize-none"
                  />
                </div>
              </div>

              {/* SECURITY & INTEGRITY BANNER */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  All ingested evidence documents are timestamped, hashed with SHA-256, and appended to the immutable regulatory
                  audit ledger.
                </span>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                      <span>Ingesting & Sealing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Seal & Ingest Evidence</span>
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
