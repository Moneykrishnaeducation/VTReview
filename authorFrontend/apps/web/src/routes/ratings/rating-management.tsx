import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import { ScoreEditor } from "../../components/score-editor";
import { StatusBadge } from "../../components/status-badge";
import { Star, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Eye, Sparkles } from "lucide-react";

export default function RatingManagement() {
  const {
    brokers,
    ratingProposals,
    approveRatingProposal,
    rejectRatingProposal,
    activeRoleDef,
  } = useAdmin();

  const [selectedBrokerId, setSelectedBrokerId] = useState<string>(brokers[0]?.id || "");
  const [complianceNote, setComplianceNote] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedBroker = brokers.find((b) => b.id === selectedBrokerId) || brokers[0];

  const handleApprove = (proposalId: string) => {
    approveRatingProposal(proposalId, complianceNote || "Compliance review certified quantitative proof.");
    setActionSuccess("Rating proposal approved! Public broker score updated in research database.");
    setTimeout(() => setActionSuccess(null), 4000);
    setComplianceNote("");
  };

  const handleReject = (proposalId: string) => {
    rejectRatingProposal(proposalId, complianceNote || "Insufficient empirical telemetry.");
    setActionSuccess("Rating proposal rejected.");
    setTimeout(() => setActionSuccess(null), 4000);
    setComplianceNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[11px] mb-1">
            <Star className="h-3.5 w-3.5" />
            <span>120-POINT METHODOLOGICAL CALCULATION WORKSPACE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Rating Governance & Score Proposals
          </h1>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Section 1: Pending Rating Proposals (Compliance Gate) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-xs space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <ShieldCheck className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <span>Rating Proposals Awaiting Compliance Sign-Off ({ratingProposals.filter((p) => p.status === "pending_review").length})</span>
          </div>
        </div>

        <div className="space-y-3">
          {ratingProposals.map((prop) => (
            <div
              key={prop.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                    {prop.id}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{prop.brokerName}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">({prop.pillarName})</span>
                  <StatusBadge status={prop.status} size="sm" />
                </div>

                {/* Score Delta Pill */}
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Total Score:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{prop.currentTotalRating.toFixed(1)}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                  <span className="text-amber-600 dark:text-amber-400 font-black">{prop.proposedTotalRating.toFixed(1)} pts</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      prop.scoreDelta > 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {prop.scoreDelta > 0 ? `+${prop.scoreDelta}` : prop.scoreDelta}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Analyst Justification:</strong> "{prop.reason}"
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500">
                <div>
                  Proposed by <strong className="text-slate-700 dark:text-slate-300">{prop.proposedBy}</strong> on {prop.proposedAt} • Linked Evidence: <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{prop.evidenceId}</span>
                </div>

                {prop.status === "pending_review" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(prop.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 font-bold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(prop.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve & Publish Score</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Interactive Broker Score Proposal Studio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Broker Rating Calculation Studio</h3>

          <select
            value={selectedBrokerId}
            onChange={(e) => setSelectedBrokerId(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 font-bold focus:ring-1 focus:ring-amber-500"
          >
            {brokers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} (Current: {b.editorialScore.toFixed(1)} pts)
              </option>
            ))}
          </select>
        </div>

        {selectedBroker && <ScoreEditor broker={selectedBroker} />}
      </div>
    </div>
  );
}
