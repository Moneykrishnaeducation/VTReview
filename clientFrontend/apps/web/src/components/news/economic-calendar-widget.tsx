import { CalendarDays, AlertCircle, ChevronRight } from "lucide-react";
import { ECONOMIC_CALENDAR } from "@/data/news-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EconomicCalendarWidget() {
  return (
    <div className="rounded-xl border bg-card/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-base text-foreground">Economic Calendar</h3>
        </div>
        <Badge variant="info" className="text-[10px]">
          Today (GMT)
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Key macroeconomic indicators impacting currency pairs and commodity volatility today.
      </p>

      <div className="space-y-3">
        {ECONOMIC_CALENDAR.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-muted/30 border border-border/40 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{item.flag}</span>
                <span className="font-bold text-xs text-foreground">{item.currency}</span>
                <span className="text-xs text-muted-foreground">• {item.time}</span>
              </div>
              <Badge
                variant={
                  item.impact === "High"
                    ? "danger"
                    : item.impact === "Medium"
                    ? "warning"
                    : "outline"
                }
                className="text-[10px] px-1.5 py-0"
              >
                {item.impact === "High" && <AlertCircle className="h-2.5 w-2.5 mr-1" />}
                {item.impact}
              </Badge>
            </div>

            <div className="text-xs font-semibold text-foreground/90 line-clamp-1 mb-2">
              {item.event}
            </div>

            <div className="grid grid-cols-2 text-[11px] gap-2 pt-1.5 border-t border-border/30 text-muted-foreground">
              <div>
                <span>Forecast: </span>
                <span className="font-semibold text-foreground">{item.forecast}</span>
              </div>
              <div>
                <span>Previous: </span>
                <span className="font-semibold text-foreground">{item.previous}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs text-primary justify-between">
          <span>Full Economic Calendar</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
