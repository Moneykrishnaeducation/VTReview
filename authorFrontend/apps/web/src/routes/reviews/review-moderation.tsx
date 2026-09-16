import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
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
} from "lucide-react";

export default function ReviewModeration() {
  const { reviews, moderateReview, setSelectedEvidenceModal, evidenceList } = useAdmin();
  const [filter, setFilter] = useState<string>("all");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return r.status === "pending" || r.status === "flagged";
    if (filter === "approved") return r.status === "approved";
    if (filter === "evidence") return r.evidenceAttached;
    return true;
  });

  const handleAction = (id: string, action: "approve" | "reject" | "flag" | "needs_clarification") => {
    moderateReview(id, action);
    setActionSuccess(`Review #${id} updated: ${action.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-mono text-[11px] mb-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>COMMUNITY GOVERNANCE WORKSPACE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Trader Review Moderation & Proof Inspection
          </h1>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 text-xs">
          {["all", "pending", "evidence", "approved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                filter === f
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {f} ({f === "all" ? reviews.length : reviews.filter((r) => (f === "pending" ? r.status === "pending" || r.status === "flagged" : f === "evidence" ? r.evidenceAttached : r.status === "approved")).length})
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Reviews Cards List */}
      <div className="space-y-4 text-xs">
        {filteredReviews.map((rev) => {
          const linkedEv = rev.evidenceIds?.[0] ? evidenceList.find((e) => e.id === rev.evidenceIds[0]) : null;

          return (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs"
            >
              {/* Review Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs">
                    {rev.userAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{rev.userName}</span>
                      {rev.isVerifiedTrader && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded">
                          <ShieldCheck className="h-3 w-3" />
                          VERIFIED TRADER
                        </span>
                      )}
                      <StatusBadge status={rev.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Target Broker: <strong className="text-amber-600 dark:text-amber-400">{rev.brokerName}</strong> • Submitted {rev.submittedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-bold text-sm bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>{rev.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rev.title}</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {rev.content}
                </p>
              </div>

              {/* Attached Evidence & Trade Proof */}
              {rev.evidenceAttached && linkedEv && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{linkedEv.title}</span>
                      <div className="text-[10px] font-mono text-slate-500">
                        Evidence Record: {linkedEv.id} • SHA-256 Verified
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEvidenceModal(linkedEv)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Inspect Statement Proof</span>
                  </button>
                </div>
              )}

              {/* Threaded Broker Response */}
              {rev.brokerResponse && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1.5 pl-4 border-l-2 border-l-amber-500">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <CornerDownRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <strong className="text-slate-900 dark:text-slate-200">{rev.brokerResponse.author}</strong> ({rev.brokerResponse.officialRole})
                    <span className="text-[10px] font-mono text-slate-500">{rev.brokerResponse.submittedAt}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed italic">
                    "{rev.brokerResponse.content}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">
                  Assigned Moderator: <strong className="text-slate-800 dark:text-slate-300">{rev.assignedModerator || "Unassigned"}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(rev.id, "reject")}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 font-bold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Reject / Spam</span>
                  </button>

                  <button
                    onClick={() => handleAction(rev.id, "needs_clarification")}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Request Trade Proof</span>
                  </button>

                  <button
                    onClick={() => handleAction(rev.id, "approve")}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
