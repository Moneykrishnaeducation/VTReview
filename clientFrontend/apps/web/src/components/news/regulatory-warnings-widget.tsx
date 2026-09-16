import { ShieldAlert, ExternalLink, AlertTriangle, ChevronRight } from "lucide-react";
import { REGULATORY_WARNINGS } from "@/data/news-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RegulatoryWarningsWidget() {
  return (
    <div className="rounded-xl border bg-card/60 p-5 shadow-sm border-l-4 border-l-rose-500">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-400" />
          <h3 className="font-bold text-base text-foreground">Regulator Blacklist</h3>
        </div>
        <Badge variant="danger" className="text-[10px] animate-pulse">
          Live Warnings
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Fresh enforcement notices and blacklist advisories issued by global Tier-1 authorities.
      </p>

      <div className="space-y-3">
        {REGULATORY_WARNINGS.map((warn) => (
          <div
            key={warn.id}
            className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span>{warn.flag}</span>
                <span className="font-bold text-xs text-rose-300">{warn.regulator}</span>
                <span className="text-[11px] text-muted-foreground">• {warn.date}</span>
              </div>
              <Badge variant="danger" className="text-[10px] py-0">
                {warn.warningType}
              </Badge>
            </div>

            <div className="font-bold text-xs text-foreground mb-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">{warn.brokerName}</span>
            </div>

            <div className="text-[11px] text-rose-200/80 mb-2 font-mono truncate">
              {warn.domain}
            </div>

            <p className="text-[11px] text-muted-foreground leading-snug">
              {warn.details}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs text-rose-400 hover:text-rose-300 justify-between">
          <span>Search Unregulated Broker DB</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
