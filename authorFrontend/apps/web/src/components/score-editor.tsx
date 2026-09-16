import { useState } from "react";
import type { BrokerAdmin, RatingPillarBreakdown } from "../types/admin";
import { useAdmin } from "../context/admin-context";
import { Star, ShieldCheck, ArrowRight, FileText, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { StatusBadge } from "./status-badge";

interface ScoreEditorProps {
  broker: BrokerAdmin;
  onSuccess?: () => void;
}

export function ScoreEditor({ broker, onSuccess }: ScoreEditorProps) {
  const { submitRatingProposal, evidenceList, activeRoleDef } = useAdmin();

  // Local state for pillar scores
  const [pillarScores, setPillarScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    broker.pillars.forEach((p) => {
      initial[p.pillarId] = p.score;
    });
    return initial;
  });

  const [selectedPillarId, setSelectedPillarId] = useState<string>(broker.pillars[0]?.pillarId || "safety");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(evidenceList[0]?.id || "");
  const [reason, setReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Recalculate total 120-point / 100-point equivalent
  const calculateTotal = (scores: Record<string, number>) => {
    return Object.values(scores).reduce((sum, val) => sum + val, 0);
  };

  const currentTotal = broker.editorialScore;
  const proposedTotal = Number(calculateTotal(pillarScores).toFixed(1));
  const totalDelta = Number((proposedTotal - currentTotal).toFixed(1));

  const currentPillar = broker.pillars.find((p) => p.pillarId === selectedPillarId) || broker.pillars[0];
  const currentPillarScore = currentPillar.score;
  const proposedPillarScore = pillarScores[selectedPillarId] || currentPillarScore;
  const pillarDelta = Number((proposedPillarScore - currentPillarScore).toFixed(1));

  const handleScoreChange = (pillarId: string, newScore: number) => {
    const p = broker.pillars.find((item) => item.pillarId === pillarId);
    if (!p) return;
    const clamped = Math.max(0, Math.min(p.maxPoints, Number(newScore.toFixed(1))));
    setPillarScores((prev) => ({ ...prev, [pillarId]: clamped }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    submitRatingProposal({
      brokerId: broker.id,
      brokerName: broker.name,
      pillarId: selectedPillarId,
      pillarName: currentPillar.name,
      currentScore: currentPillarScore,
      proposedScore: proposedPillarScore,
      scoreDelta: pillarDelta,
      currentTotalRating: currentTotal,
      proposedTotalRating: proposedTotal,
      reason,
      evidenceId: selectedEvidenceId,
      proposedBy: activeRoleDef.name,
    });

    setIsSubmitted(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded text-[11px]">
              120-POINT FRAMEWORK
            </span>
            <span className="text-slate-400 font-medium">Weighted Editorial Audit</span>
          </div>
          <h3 className="text-base font-bold text-white">Score Calculation & Proposal Studio</h3>
        </div>

        {/* Live Score Comparison Card */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Score</div>
            <div className="font-mono text-base font-black text-slate-300">{currentTotal.toFixed(1)}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-600" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-amber-400">Proposed Score</div>
            <div className="font-mono text-base font-black text-amber-400">{proposedTotal.toFixed(1)}</div>
          </div>
          {totalDelta !== 0 && (
            <span
              className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                totalDelta > 0
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : "bg-rose-950 text-rose-300 border border-rose-800"
              }`}
            >
              {totalDelta > 0 ? `+${totalDelta}` : totalDelta} pts
            </span>
          )}
        </div>
      </div>

      {isSubmitted ? (
        <div className="p-6 text-center space-y-3 bg-emerald-950/30 border border-emerald-800/80 rounded-xl animate-in fade-in duration-200">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-emerald-200">Rating Change Proposal Dispatched</h4>
          <p className="text-slate-400 max-w-md mx-auto">
            The proposed score change has been submitted to the compliance verification queue and logged in the immutable audit registry.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg cursor-pointer"
          >
            Edit Another Score
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 5 Pillars Slider Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {broker.pillars.map((pillar) => {
              const score = pillarScores[pillar.pillarId] || pillar.score;
              const delta = Number((score - pillar.score).toFixed(1));
              const isSelected = selectedPillarId === pillar.pillarId;

              return (
                <div
                  key={pillar.pillarId}
                  onClick={() => setSelectedPillarId(pillar.pillarId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-950 border-amber-500/50 shadow-lg ring-1 ring-amber-500/20"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="font-bold text-slate-200">{pillar.name}</div>
                      <div className="text-[10px] text-slate-500">
                        Weight: {pillar.weightPercentage}% • Max: {pillar.maxPoints} pts
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-black text-amber-400">{score.toFixed(1)}</span>
                      <span className="text-slate-500 font-mono">/ {pillar.maxPoints}</span>
                      {delta !== 0 && (
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            delta > 0 ? "bg-emerald-950 text-emerald-300" : "bg-rose-950 text-rose-300"
                          }`}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Range Stepper */}
                  <input
                    type="range"
                    min="0"
                    max={pillar.maxPoints}
                    step="0.1"
                    value={score}
                    onChange={(e) => handleScoreChange(pillar.pillarId, parseFloat(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {/* Justification & Evidence Area */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Mandatory Rationale & Linked Evidence for Proposal</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Attach Supporting Evidence Vault Record *
                </label>
                <select
                  value={selectedEvidenceId}
                  onChange={(e) => setSelectedEvidenceId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-amber-500"
                >
                  {evidenceList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      [{ev.id}] {ev.title} ({ev.relatedEntityName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Selected Pillar to Formalize Delta *
                </label>
                <select
                  value={selectedPillarId}
                  onChange={(e) => setSelectedPillarId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-amber-500"
                >
                  {broker.pillars.map((p) => (
                    <option key={p.pillarId} value={p.pillarId}>
                      {p.name} (Current: {p.score} → Proposed: {pillarScores[p.pillarId] || p.score})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Audit Rationale & Methodological Justification *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the quantitative metrics or verified regulatory facts justifying this rating adjustment (e.g. 10,000 tick live account test confirmed spread narrowing to 0.1 pips)..."
                rows={3}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500">
                Proposer: <strong className="text-slate-300">{activeRoleDef.name}</strong> • Emits immutable audit log
              </div>

              <button
                type="submit"
                disabled={!reason.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>Submit Rating Proposal for Review</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
