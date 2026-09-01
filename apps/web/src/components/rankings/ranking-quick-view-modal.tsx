import { useEffect } from "react";
import { Link } from "react-router";
import {
  X,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Calendar,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Building,
  Scale,
} from "lucide-react";
import type { RankedBroker } from "@/types/ranking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RankingQuickViewModalProps {
  broker: RankedBroker | null;
  onClose: () => void;
  onToggleCompare: (broker: RankedBroker) => void;
  isSelectedForCompare: boolean;
}

export default function RankingQuickViewModal({
  broker,
  onClose,
  onToggleCompare,
  isSelectedForCompare,
}: RankingQuickViewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!broker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border rounded-2xl shadow-2xl flex flex-col no-scrollbar">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-card/95 backdrop-blur border-b">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground font-black flex items-center justify-center text-sm">
              #{broker.rank}
            </span>
            <h3 className="font-extrabold text-lg text-foreground">
              {broker.name} Quick Specification Audit
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-muted/30 border">
            <div className="h-20 w-20 rounded-2xl bg-muted border flex items-center justify-center font-extrabold text-3xl text-foreground shrink-0 shadow-inner">
              {broker.logo}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-2xl font-black text-foreground">{broker.name}</h4>
                  <span className="text-xl">{broker.countryFlag}</span>
                </div>
                <Badge variant="success" className="self-center sm:self-auto gap-1">
                  <ShieldCheck className="h-3 w-3" /> {broker.regulatoryStatus}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                  <Star className="h-4 w-4 fill-yellow-400" /> {broker.overallScore} / 10
                </span>
                <span>•</span>
                <span>{broker.established}</span>
                <span>•</span>
                <span>{broker.headquarters}</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {broker.tagline}
              </p>
            </div>
          </div>

          {/* Dimension Scores Progress */}
          <div className="space-y-3 p-5 rounded-2xl bg-card border">
            <h5 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> Evaluation Dimension Breakdown
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                { label: "Safety & Regulation", score: broker.scores.safety, color: "bg-emerald-500" },
                { label: "Spreads & Trading Fees", score: broker.scores.fees, color: "bg-primary" },
                { label: "Platform Technology", score: broker.scores.platforms, color: "bg-sky-500" },
                { label: "Customer Support (24/7)", score: broker.scores.support, color: "bg-indigo-500" },
                { label: "Withdrawal Velocity", score: broker.scores.withdrawals, color: "bg-amber-500" },
              ].map((dim, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dim.label}</span>
                    <span className="font-bold text-foreground">{dim.score} / 10</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dim.color}`}
                      style={{ width: `${(dim.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground text-[11px] block">Min Deposit</span>
              <span className="font-bold text-base text-foreground">${broker.minDeposit}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground text-[11px] block">Max Leverage</span>
              <span className="font-bold text-base text-foreground">{broker.maxLeverage}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground text-[11px] block">EUR/USD Spread</span>
              <span className="font-bold text-base text-foreground">{broker.eurUsdSpread}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground text-[11px] block">Withdrawal Speed</span>
              <span className="font-bold text-base text-emerald-400">{broker.withdrawalSpeed}</span>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-sm text-foreground">Verified Broker Pros:</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {broker.keyPros.map((pro, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onToggleCompare(broker)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isSelectedForCompare
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>{isSelectedForCompare ? "Remove from Compare" : "Add to Compare Table"}</span>
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <Link to={`/broker/${broker.slug}`} onClick={onClose} className="flex-1 sm:flex-none">
                <Button className="w-full text-xs font-semibold gap-1">
                  <span>Full Review & Analysis</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <a
                href={broker.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button variant="outline" className="w-full text-xs font-semibold gap-1">
                  <span>Official Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
