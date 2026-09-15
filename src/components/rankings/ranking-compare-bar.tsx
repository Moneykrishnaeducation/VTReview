import { Link } from "react-router";
import { Scale, X, ArrowRight, ShieldCheck } from "lucide-react";
import type { RankedBroker } from "@/types/ranking";
import { Button } from "@/components/ui/button";

interface RankingCompareBarProps {
  selectedBrokers: RankedBroker[];
  onRemoveBroker: (id: string) => void;
  onClearAll: () => void;
}

export default function RankingCompareBar({
  selectedBrokers,
  onRemoveBroker,
  onClearAll,
}: RankingCompareBarProps) {
  if (selectedBrokers.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-md p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 ring-1 ring-primary/20">
        {/* Left: Selected Brokers Pill List */}
        <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <div className="flex items-center gap-2 text-primary font-extrabold text-xs shrink-0">
            <Scale className="h-4 w-4" />
            <span>Compare ({selectedBrokers.length}/4):</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedBrokers.map((broker) => (
              <div
                key={broker.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border text-xs font-bold text-foreground shrink-0 shadow-sm"
              >
                <div className="h-5 w-5 rounded bg-primary/20 text-primary text-[10px] flex items-center justify-center font-black">
                  {broker.logo}
                </div>
                <span>{broker.name}</span>
                <button
                  onClick={() => onRemoveBroker(broker.id)}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
          >
            Clear
          </button>

          <Link to={`/compare`}>
            <Button size="sm" className="gap-1.5 text-xs font-bold shadow-md">
              <span>Compare Brokers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
