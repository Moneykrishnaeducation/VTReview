import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Bell, Radio } from "lucide-react";
import { MARKET_TICKERS, BREAKING_ALERTS } from "@/data/news-data";

export default function NewsTicker() {
  const [alertIndex, setAlertIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAlertIndex((prev) => (prev + 1) % BREAKING_ALERTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full border-b bg-muted/20 text-xs">
      {/* Breaking Alert Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between">
        <div className="container mx-auto flex items-center gap-3 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500 text-white animate-pulse shrink-0">
            <Radio className="h-3 w-3" /> LIVE ALERTS
          </span>
          <div className="font-medium text-foreground/90 truncate transition-all duration-500 ease-in-out flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{BREAKING_ALERTS[alertIndex]}</span>
          </div>
        </div>
      </div>

      {/* Market Prices Ticker Bar */}
      <div className="container mx-auto px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 whitespace-nowrap min-w-max">
          <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
            Market Pulse:
          </span>
          {MARKET_TICKERS.map((ticker) => (
            <div
              key={ticker.symbol}
              className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <span className="font-bold text-foreground/90">{ticker.symbol}</span>
              <span className="text-muted-foreground">{ticker.price}</span>
              <span
                className={`flex items-center font-semibold text-[11px] ${
                  ticker.isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {ticker.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {ticker.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
