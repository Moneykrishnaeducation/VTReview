import { Link } from "react-router";
import {
  Trophy,
  Crown,
  Medal,
  Star,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { RankedBroker } from "@/types/ranking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RankingPodiumProps {
  brokers: RankedBroker[];
  onQuickView: (broker: RankedBroker) => void;
  onToggleCompare: (broker: RankedBroker) => void;
  selectedCompareIds: string[];
}

export default function RankingPodium({
  brokers,
  onQuickView,
  onToggleCompare,
  selectedCompareIds,
}: RankingPodiumProps) {
  if (brokers.length < 3) return null;

  const first = brokers[0];
  const second = brokers[1];
  const third = brokers[2];

  const podiumItems = [
    { broker: second, rank: 2, place: "2nd", color: "silver", height: "md:h-[480px]" },
    { broker: first, rank: 1, place: "1st", color: "gold", height: "md:h-[530px]" },
    { broker: third, rank: 3, place: "3rd", color: "bronze", height: "md:h-[460px]" },
  ];

  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
          <Crown className="h-3.5 w-3.5 text-amber-400" /> PODIUM SPOTLIGHT 2026
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
          Top 3 Financial Broker Champions
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-1">
          Award-winning platforms holding the highest composite evaluation scores for safety, execution, and user ratings.
        </p>
      </div>

      {/* 3-Column Podium Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {podiumItems.map(({ broker, rank, place, color, height }) => {
          const isGold = rank === 1;
          const isSilver = rank === 2;
          const isBronze = rank === 3;
          const isSelectedForCompare = selectedCompareIds.includes(broker.id);

          return (
            <div
              key={broker.id}
              className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-6 ${height} ${
                isGold
                  ? "bg-gradient-to-b from-amber-500/15 via-card to-card border-amber-500/50 shadow-xl shadow-amber-500/10 order-1 md:order-2 md:-translate-y-4 ring-1 ring-amber-400/30"
                  : isSilver
                  ? "bg-gradient-to-b from-slate-400/10 via-card to-card border-slate-400/40 shadow-md order-2 md:order-1"
                  : "bg-gradient-to-b from-amber-700/10 via-card to-card border-amber-700/40 shadow-md order-3 md:order-3"
              }`}
            >
              {/* Top Podium Ribbon Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-md ${
                    isGold
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 ring-2 ring-amber-300"
                      : isSilver
                      ? "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950"
                      : "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
                  }`}
                >
                  {isGold ? (
                    <>
                      <Crown className="h-3.5 w-3.5 fill-slate-950" /> #1 Champion
                    </>
                  ) : isSilver ? (
                    <>
                      <Medal className="h-3.5 w-3.5" /> #2 Runner Up
                    </>
                  ) : (
                    <>
                      <Medal className="h-3.5 w-3.5" /> #3 Bronze
                    </>
                  )}
                </span>
              </div>

              {/* Top Broker Details */}
              <div className="pt-3 text-center">
                {/* Logo & Flag */}
                <div className="relative inline-block mb-3">
                  <div
                    className={`h-20 w-20 mx-auto rounded-2xl flex items-center justify-center font-extrabold text-3xl shadow-inner border ${
                      isGold
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/50 ring-4 ring-amber-500/10"
                        : "bg-muted text-foreground border-border"
                    }`}
                  >
                    {broker.logo}
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 text-xl drop-shadow"
                    title={broker.headquarters}
                  >
                    {broker.countryFlag}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-foreground mb-1">
                  {broker.name}
                </h3>
                <div className="text-xs text-muted-foreground font-medium mb-3">
                  {broker.bestFor}
                </div>

                {/* Score and Rating Pill */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <span>{broker.overallScore} / 10 Score</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({broker.reviewsCount} reviews)
                  </div>
                </div>

                {/* Regulation & Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-xl border border-border/40 mb-4 text-left">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Regulation:</span>
                    <span className="font-semibold text-emerald-400 truncate block">
                      {broker.regulators.slice(0, 2).join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">EUR/USD Spread:</span>
                    <span className="font-semibold text-foreground truncate block">
                      {broker.eurUsdSpread}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Min Deposit:</span>
                    <span className="font-semibold text-foreground truncate block">
                      ${broker.minDeposit}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Max Leverage:</span>
                    <span className="font-semibold text-foreground truncate block">
                      {broker.maxLeverage}
                    </span>
                  </div>
                </div>

                {/* Key Pro Highlights (Top 2) */}
                <ul className="text-left text-xs space-y-1.5 text-muted-foreground mb-4">
                  {broker.keyPros.slice(0, 2).map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="line-clamp-1">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions Footer */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex gap-2">
                  <Link
                    to={`/broker/${broker.slug}`}
                    className="flex-1"
                  >
                    <Button
                      variant={isGold ? "default" : "outline"}
                      className="w-full text-xs font-semibold h-10 gap-1"
                    >
                      <span>Full Review</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onQuickView(broker)}
                    className="text-xs h-10 px-3 text-muted-foreground hover:text-foreground"
                    title="Quick Specs"
                  >
                    Specs
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    onClick={() => onToggleCompare(broker)}
                    className={`text-[11px] font-medium transition-colors ${
                      isSelectedForCompare
                        ? "text-primary font-bold underline"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isSelectedForCompare ? "✓ Added to Compare" : "+ Add to Compare"}
                  </button>

                  <a
                    href={broker.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    Visit Site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
