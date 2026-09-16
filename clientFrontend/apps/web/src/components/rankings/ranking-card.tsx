import { Link } from "react-router";
import {
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Scale,
  Check,
} from "lucide-react";
import type { RankedBroker } from "@/types/ranking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RankingCardProps {
  broker: RankedBroker;
  onQuickView: (broker: RankedBroker) => void;
  onToggleCompare: (broker: RankedBroker) => void;
  isSelectedForCompare: boolean;
}

export default function RankingCard({
  broker,
  onQuickView,
  onToggleCompare,
  isSelectedForCompare,
}: RankingCardProps) {
  const isTopThree = broker.rank <= 3;

  return (
    <article
      className={`relative rounded-2xl border bg-card/70 overflow-hidden transition-all duration-300 hover:border-primary/60 hover:shadow-xl group ${
        broker.rank === 1
          ? "border-amber-500/40 ring-1 ring-amber-400/20"
          : broker.rank === 2
          ? "border-slate-400/30"
          : broker.rank === 3
          ? "border-amber-700/30"
          : "border-border/60"
      }`}
    >
      <div className="p-6 md:p-7 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Left Col: Rank & Brand Info */}
        <div className="flex items-start gap-4 sm:gap-6 flex-1">
          {/* Rank Badge */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div
              className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex flex-col items-center justify-center font-extrabold shadow-md border ${
                broker.rank === 1
                  ? "bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 border-amber-300 ring-2 ring-amber-400/40"
                  : broker.rank === 2
                  ? "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 border-slate-300"
                  : broker.rank === 3
                  ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white border-amber-500"
                  : "bg-muted/60 text-foreground border-border/80"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80 leading-none">
                Rank
              </span>
              <span className="text-xl sm:text-2xl font-black leading-tight">
                #{broker.rank}
              </span>
            </div>
            {broker.badgeLabel && (
              <span className="mt-1 text-[10px] font-bold text-amber-400 text-center max-w-[70px] leading-tight">
                {broker.badgeLabel.replace(/^[^\s]+ /, "")}
              </span>
            )}
          </div>

          {/* Broker Logo & Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-muted border flex items-center justify-center font-bold text-lg text-foreground shrink-0">
                {broker.logo}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {broker.name}
                  </h3>
                  <span className="text-base" title={broker.headquarters}>
                    {broker.countryFlag}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{broker.established}</span>
                  <span>•</span>
                  <span>{broker.headquarters}</span>
                </div>
              </div>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-2 ml-auto sm:ml-0 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20 text-xs">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-yellow-400">{broker.overallScore}</span>
                <span className="text-muted-foreground text-[11px]">
                  ({broker.reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Regulatory and Trust Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Badge variant="success" className="text-[11px] gap-1 py-0.5">
                <ShieldCheck className="h-3 w-3" /> {broker.regulatoryStatus}
              </Badge>
              {broker.regulators.map((reg) => (
                <Badge
                  key={reg}
                  variant="outline"
                  className="text-[11px] font-medium bg-muted/30"
                >
                  {reg}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">
                • Best for: <strong className="text-foreground/90">{broker.bestFor}</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed pt-1">
              {broker.tagline}
            </p>
          </div>
        </div>

        {/* Middle Col: Key Trading Specifications Matrix */}
        <div className="w-full lg:w-72 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-muted/30 border border-border/50 text-xs shrink-0">
          <div>
            <span className="text-muted-foreground text-[11px] block">EUR/USD Spread</span>
            <span className="font-bold text-foreground text-xs">{broker.eurUsdSpread}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-[11px] block">Min Deposit</span>
            <span className="font-bold text-foreground text-xs">${broker.minDeposit}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-[11px] block">Max Leverage</span>
            <span className="font-bold text-foreground text-xs">{broker.maxLeverage}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-[11px] block">Withdrawal Speed</span>
            <span className="font-bold text-emerald-400 text-xs flex items-center gap-0.5">
              <Zap className="h-3 w-3" /> {broker.withdrawalSpeed}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-4 lg:col-span-2 pt-1 border-t border-border/40 flex items-center gap-1.5 overflow-hidden">
            <span className="text-muted-foreground text-[11px] shrink-0">Platforms:</span>
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {broker.tradingPlatforms.map((plt) => (
                <span
                  key={plt}
                  className="px-1.5 py-0.2 rounded bg-background/80 text-[10px] font-medium border text-foreground/90"
                >
                  {plt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Score Meter & CTAs */}
        <div className="w-full lg:w-48 flex flex-col gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
          {/* Dimension Score Mini Bars */}
          <div className="space-y-1 text-[11px] bg-card p-2.5 rounded-xl border border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Safety & Trust</span>
              <span className="font-bold text-emerald-400">{broker.scores.safety}</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(broker.scores.safety / 10) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-muted-foreground">Spreads & Fees</span>
              <span className="font-bold text-primary">{broker.scores.fees}</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${(broker.scores.fees / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Link to={`/broker/${broker.slug}`} className="w-full">
              <Button className="w-full text-xs font-semibold h-9 gap-1 shadow-sm">
                <span>View Full Review</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuickView(broker)}
                className="flex-1 text-xs h-8"
              >
                Quick Specs
              </Button>

              <button
                onClick={() => onToggleCompare(broker)}
                className={`px-3 py-1 text-xs rounded-md border transition-all flex items-center justify-center gap-1 ${
                  isSelectedForCompare
                    ? "bg-primary text-primary-foreground border-primary font-bold"
                    : "hover:bg-muted text-muted-foreground border-border"
                }`}
                title={isSelectedForCompare ? "Remove from Compare" : "Add to Compare"}
              >
                <Scale className="h-3 w-3" />
                <span>{isSelectedForCompare ? "Added" : "Compare"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
