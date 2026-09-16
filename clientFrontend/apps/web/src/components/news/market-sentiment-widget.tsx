import { Activity, Gauge, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MarketSentimentWidget() {
  const sentimentScore = 68; // Greed (0-100)

  return (
    <div className="rounded-xl border bg-card/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-base text-foreground">Market Sentiment</h3>
        </div>
        <Badge variant="success" className="text-[10px]">
          Risk-On
        </Badge>
      </div>

      {/* Fear & Greed Gauge Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" /> Fear & Greed Index
          </span>
          <span className="font-bold text-emerald-400">
            {sentimentScore} / 100 (Greed)
          </span>
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
          <div className="h-full bg-rose-500 w-1/4" title="Extreme Fear" />
          <div className="h-full bg-amber-500 w-1/4" title="Fear" />
          <div className="h-full bg-sky-500 w-1/4" title="Neutral" />
          <div className="h-full bg-emerald-500 w-1/4" title="Greed" />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>0 (Extreme Fear)</span>
          <span>50 (Neutral)</span>
          <span>100 (Extreme Greed)</span>
        </div>
      </div>

      {/* Top Movers */}
      <div>
        <div className="text-xs font-semibold text-foreground mb-2">
          24h Top Forex & Commodity Movers:
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <span className="font-medium text-foreground">XAU/USD (Gold)</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +1.25%
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <span className="font-medium text-foreground">BTC/USD (Bitcoin)</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +4.12%
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <span className="font-medium text-foreground">Brent Crude Oil</span>
            <span className="text-rose-400 font-semibold flex items-center gap-0.5">
              <TrendingDown className="h-3 w-3" /> -0.92%
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <span className="font-medium text-foreground">USD/JPY</span>
            <span className="text-rose-400 font-semibold flex items-center gap-0.5">
              <TrendingDown className="h-3 w-3" /> -0.45%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
