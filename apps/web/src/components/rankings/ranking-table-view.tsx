import { Link } from "react-router";
import { Star, ShieldCheck, Zap, Scale, ExternalLink, ChevronRight } from "lucide-react";
import type { RankedBroker } from "@/types/ranking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RankingTableViewProps {
  brokers: RankedBroker[];
  onQuickView: (broker: RankedBroker) => void;
  onToggleCompare: (broker: RankedBroker) => void;
  selectedCompareIds: string[];
}

export default function RankingTableView({
  brokers,
  onQuickView,
  onToggleCompare,
  selectedCompareIds,
}: RankingTableViewProps) {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-4 text-center w-16">Rank</th>
              <th className="py-4 px-4 min-w-[200px]">Broker</th>
              <th className="py-4 px-3 text-center">Score</th>
              <th className="py-4 px-3">Regulation</th>
              <th className="py-4 px-3">EUR/USD Spread</th>
              <th className="py-4 px-3">Min Deposit</th>
              <th className="py-4 px-3">Max Leverage</th>
              <th className="py-4 px-3">Platforms</th>
              <th className="py-4 px-4 text-right min-w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {brokers.map((broker) => {
              const isSelected = selectedCompareIds.includes(broker.id);

              return (
                <tr
                  key={broker.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs ${
                        broker.rank === 1
                          ? "bg-amber-400 text-slate-950 ring-2 ring-amber-300"
                          : broker.rank === 2
                          ? "bg-slate-300 text-slate-950"
                          : broker.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      #{broker.rank}
                    </span>
                  </td>

                  {/* Broker Brand */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted border flex items-center justify-center font-bold text-sm text-foreground shrink-0">
                        {broker.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                            {broker.name}
                          </span>
                          <span>{broker.countryFlag}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                          {broker.bestFor}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Overall Score */}
                  <td className="py-4 px-3 text-center">
                    <div className="inline-flex items-center gap-1 font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                      <Star className="h-3 w-3 fill-yellow-400" />
                      <span>{broker.overallScore}</span>
                    </div>
                  </td>

                  {/* Regulation */}
                  <td className="py-4 px-3">
                    <div className="space-y-1">
                      <Badge variant="success" className="text-[10px] py-0">
                        {broker.regulatoryStatus}
                      </Badge>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                        {broker.regulators.join(", ")}
                      </div>
                    </div>
                  </td>

                  {/* Spread */}
                  <td className="py-4 px-3 font-semibold text-foreground">
                    {broker.eurUsdSpread}
                  </td>

                  {/* Deposit */}
                  <td className="py-4 px-3 font-semibold text-foreground">
                    ${broker.minDeposit}
                  </td>

                  {/* Leverage */}
                  <td className="py-4 px-3 font-semibold text-foreground">
                    {broker.maxLeverage}
                  </td>

                  {/* Platforms */}
                  <td className="py-4 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {broker.tradingPlatforms.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.2 rounded bg-muted/60 text-[10px] border"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onQuickView(broker)}
                        className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        Specs
                      </Button>

                      <button
                        onClick={() => onToggleCompare(broker)}
                        className={`h-8 px-2 rounded-md border text-xs flex items-center gap-1 transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary font-bold"
                            : "hover:bg-muted text-muted-foreground border-border"
                        }`}
                        title="Add to Compare"
                      >
                        <Scale className="h-3 w-3" />
                        <span>{isSelected ? "Added" : "Compare"}</span>
                      </button>

                      <Link to={`/broker/${broker.slug}`}>
                        <Button size="sm" className="h-8 text-xs font-semibold">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
