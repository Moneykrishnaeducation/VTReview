import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import type { ReviewModerationItem } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  UserCheck,
  Star,
  CornerDownRight,
  Eye,
  Search,
  Filter,
  X,
  Sparkles,
  Building2,
  Flag,
  ShieldAlert,
  Send,
  RotateCcw,
  Check,
  ChevronDown,
  Info,
  BadgeCheck,
  ExternalLink
} from "lucide-react";

export default function ReviewModeration() {
  const { reviews, moderateReview, setSelectedEvidenceModal, evidenceList, brokers, activeRoleDef } = useAdmin();

  // Filters state
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "evidence" | "risk" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerFilter, setBrokerFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  // Inline notes state per review
  const [moderatorNotesMap, setModeratorNotesMap] = useState<Record<string, string>>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Broker Options from catalog
  const brokerOptions = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach((r) => set.add(r.brokerName));
    return Array.from(set).sort();
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      // 1. Tab filter
      if (filterTab === "pending" && rev.status !== "pending" && rev.status !== "flagged") return false;
      if (filterTab === "evidence" && !rev.evidenceAttached) return false;
      if (filterTab === "risk" && rev.riskFlag === "none") return false;
      if (filterTab === "approved" && rev.status !== "approved") return false;
      if (filterTab === "rejected" && rev.status !== "rejected") return false;

      // 2. Broker filter
      if (brokerFilter !== "all" && rev.brokerName !== brokerFilter) return false;

      // 3. Rating filter
      if (ratingFilter === "5" && rev.rating < 4.5) return false;
      if (ratingFilter === "4" && (rev.rating < 3.5 || rev.rating >= 4.5)) return false;
      if (ratingFilter === "3" && (rev.rating < 2.5 || rev.rating >= 3.5)) return false;
      if (ratingFilter === "critical" && rev.rating > 2.5) return false;

      // 4. Risk filter
      if (riskFilter !== "all" && rev.riskFlag !== riskFilter) return false;

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rev.id.toLowerCase().includes(q) ||
          rev.userName.toLowerCase().includes(q) ||
          rev.userEmail.toLowerCase().includes(q) ||
          rev.brokerName.toLowerCase().includes(q) ||
          rev.title.toLowerCase().includes(q) ||
          rev.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reviews, filterTab, brokerFilter, ratingFilter, riskFilter, searchQuery]);

  // Executive Metrics
  const pendingCount = reviews.filter((r) => r.status === "pending" || r.status === "flagged").length;
  const evidenceCount = reviews.filter((r) => r.evidenceAttached).length;
  const riskCount = reviews.filter((r) => r.riskFlag !== "none").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;

  const handleAction = (id: string, action: "approve" | "reject" | "flag" | "needs_clarification") => {
    const note = moderatorNotesMap[id] || "";
    moderateReview(id, action, note);

    const actionTextMap = {
      approve: "Approved & Published to public community feed",
      reject: "Rejected and flagged as spam/ineligible",
      flag: "Flagged for senior compliance arbitration",
      needs_clarification: "Requested verified MT4/MT5 statement proof from trader",
    };

    setActionSuccess(`Review #${id}: ${actionTextMap[action]}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleResetFilters = () => {
    setFilterTab("all");
    setSearchQuery("");
    setBrokerFilter("all");
    setRatingFilter("all");
    setRiskFilter("all");
  };

  const getRiskFlagBadge = (risk: ReviewModerationItem["riskFlag"]) => {
    switch (risk) {
      case "suspected_bot":
        return { label: "Suspected Bot / Duplicate IP", color: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20" };
      case "abusive_language":
        return { label: "Profanity / Defamatory Language", color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20" };
      case "unverified_slippage_claim":
        return { label: "Unverified Execution Claim (Proof Required)", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" };
      case "promotional_spam":
        return { label: "Affiliate Link / Promotional Spam", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. WORKSPACE HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-mono text-[11px] mb-2 font-bold">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>COMMUNITY GOVERNANCE & PROOF TRIAGE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Trader Review Moderation & Proof Inspection
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authenticate trader MT4/MT5 trade statements, detect promotional spam/bots, and moderate official broker rebuttal responses.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-amber-800 dark:text-amber-400">
            <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Pending Triage</div>
            <div className="font-black text-base">{pendingCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-800 dark:text-emerald-400">
            <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">With Trade Proof</div>
            <div className="font-black text-base">{evidenceCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center text-rose-800 dark:text-rose-400">
            <div className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400">Risk Flagged</div>
            <div className="font-black text-base">{riskCount}</div>
          </div>
        </div>
      </div>

      {/* 2. ACTION SUCCESS BANNER */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-emerald-900 dark:text-emerald-200">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. MULTI-PARAM FILTER & SEARCH TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Top Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 dark:border-slate-800">
          {[
            { id: "pending", label: "Pending Triage", count: pendingCount },
            { id: "evidence", label: "With Trade Proof", count: evidenceCount },
            { id: "risk", label: "Risk Flagged", count: riskCount },
            { id: "approved", label: "Approved & Live", count: approvedCount },
            { id: "all", label: "All Reviews", count: reviews.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{tab.label}</span>
              <span className="font-mono text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Secondary Inputs: Search, Broker, Rating, Risk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search trader, email, broker, review text..."
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

          {/* Broker Filter Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={brokerFilter}
              onChange={(e) => setBrokerFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
            >
              <option value="all">🏢 All Target Brokers</option>
              {brokerOptions.map((broker) => (
                <option key={broker} value={broker}>
                  {broker}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
            >
              <option value="all">⭐ All Ratings</option>
              <option value="5">5.0 Stars (Positive)</option>
              <option value="4">4.0 - 4.9 Stars</option>
              <option value="3">3.0 - 3.9 Stars</option>
              <option value="critical">1 - 2 Stars (Negative)</option>
            </select>
          </div>

          {/* Risk Flag Dropdown */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
            >
              <option value="all">🛡️ All Risk Profiles</option>
              <option value="none">Clean (No Flag)</option>
              <option value="suspected_bot">Suspected Bot / Duplicate IP</option>
              <option value="abusive_language">Profanity / Defamatory</option>
              <option value="unverified_slippage_claim">Unverified Slippage</option>
              <option value="promotional_spam">Promotional / Affiliate Spam</option>
            </select>

            {(brokerFilter !== "all" || ratingFilter !== "all" || riskFilter !== "all" || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        
      </div>

      {/* 4. REVIEWS CARDS LIST OR EMPTY STATE */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4 text-xs font-sans">
          {filteredReviews.map((rev) => {
            const linkedEv = rev.evidenceIds?.[0] ? evidenceList.find((e) => e.id === rev.evidenceIds[0]) : null;
            const riskBadge = getRiskFlagBadge(rev.riskFlag);
            const currentNote = moderatorNotesMap[rev.id] || "";

            return (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Review Top Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-black text-slate-800 dark:text-slate-200 text-xs shadow-2xs">
                      {rev.userAvatar}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{rev.userName}</span>
                        <span className="text-slate-400 text-xs">({rev.userEmail})</span>
                        {rev.isVerifiedTrader && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="h-3 w-3 text-emerald-500" />
                            VERIFIED DEPOSITOR
                          </span>
                        )}
                        <StatusBadge status={rev.status} size="sm" />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Broker: <strong className="text-slate-800 dark:text-slate-200 font-bold">{rev.brokerName}</strong> •{" "}
                        {rev.tradeAccountType && <span className="text-slate-600 dark:text-slate-400 font-mono">Account: {rev.tradeAccountType} • </span>}
                        <span>Submitted {rev.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars Badge */}
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono font-black text-xs bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span>{rev.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                {/* AUTOMATED RISK FLAG WARNING BANNER */}
                {riskBadge && (
                  <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${riskBadge.color}`}>
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="font-bold">Automated Integrity Warning:</strong>
                      <span>{riskBadge.label}</span>
                    </div>
                  </div>
                )}

                {/* Review Headline & Text */}
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">{rev.title}</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
                    "{rev.content}"
                  </p>
                </div>

                {/* Attached Trade Proof & Statement Evidence */}
                {rev.evidenceAttached && linkedEv && (
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{linkedEv.title}</div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          File: {linkedEv.fileFormat} • SHA-256: {linkedEv.checksum.substring(0, 16)}... • Status: Verified
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEvidenceModal(linkedEv)}
                      className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Eye className="h-3.5 w-3.5 text-amber-500" />
                      <span>Inspect MT4/MT5 Trade Statement</span>
                    </button>
                  </div>
                )}

                {/* Official Broker Response Thread */}
                {rev.brokerResponse && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-1.5 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CornerDownRight className="h-3.5 w-3.5 text-amber-500" />
                      <strong className="text-slate-900 dark:text-slate-200 font-bold">{rev.brokerResponse.author}</strong>
                      <span className="text-[11px] text-slate-500">({rev.brokerResponse.officialRole})</span>
                      <span className="text-[10px] font-mono text-slate-400">• {rev.brokerResponse.submittedAt}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed italic pl-5">
                      "{rev.brokerResponse.content}"
                    </p>
                  </div>
                )}

                {/* MODERATOR DECISION & TRIAGE ACTIONS */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {/* Inline Moderator Notes */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add compliance note / reason for decision (optional)..."
                      value={currentNote}
                      onChange={(e) =>
                        setModeratorNotesMap((prev) => ({
                          ...prev,
                          [rev.id]: e.target.value,
                        }))
                      }
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-slate-500">
                      Moderator: <strong className="text-slate-800 dark:text-slate-200">{activeRoleDef.name}</strong> • Item ID: {rev.id}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleAction(rev.id, "reject")}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold rounded-xl border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject / Spam</span>
                      </button>

                      <button
                        onClick={() => handleAction(rev.id, "needs_clarification")}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Request Trade Proof</span>
                      </button>

                      <button
                        onClick={() => handleAction(rev.id, "flag")}
                        className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold rounded-xl border border-amber-500/20 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Flag className="h-3.5 w-3.5 text-amber-500" />
                        <span>Escalate to Lead</span>
                      </button>

                      <button
                        onClick={() => handleAction(rev.id, "approve")}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center mx-auto">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No review moderation items found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              There are currently no reviews matching the selected filter criteria ({filterTab}).
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
