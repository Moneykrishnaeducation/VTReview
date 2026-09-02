import { useState } from "react";
import { Link } from "react-router";
import {
  Scale,
  Search,
  ShieldCheck,
  Star,
  X,
  Plus,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Zap,
  Check,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RANKED_BROKERS } from "@/data/rankings-data";

export default function Compare() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "ic-markets",
    "exness",
    "pepperstone",
  ]);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addBrokerModalOpen, setAddBrokerModalOpen] = useState(false);

  const selectedBrokers = selectedIds
    .map((id) => RANKED_BROKERS.find((b) => b.id === id))
    .filter(Boolean) as typeof RANKED_BROKERS;

  const removeBroker = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const addBroker = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds((prev) => [...prev, id]);
      setAddBrokerModalOpen(false);
    }
  };

  const availableBrokersToAdd = RANKED_BROKERS.filter(
    (b) => !selectedIds.includes(b.id)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
          <Scale className="h-3.5 w-3.5" /> Side-by-Side Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Compare Trading Brokers
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Compare spreads, regulatory oversight, minimum deposits, and trading platforms across up to 4 brokers simultaneously.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            <span>Highlight Key Differences</span>
          </label>
        </div>
      </div>

      {/* Comparison Matrix */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-[760px] bg-card rounded-2xl border shadow-sm overflow-hidden">
          {/* Top Row: Brokers Header */}
          <div className="grid grid-cols-4 border-b bg-muted/20">
            <div className="p-6 flex flex-col justify-end border-r">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Broker Metrics
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Comparing {selectedBrokers.length} platforms
              </span>
            </div>

            {selectedBrokers.map((broker) => (
              <div key={broker.id} className="p-6 border-r last:border-r-0 relative flex flex-col items-center text-center">
                {selectedBrokers.length > 2 && (
                  <button
                    onClick={() => removeBroker(broker.id)}
                    className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Remove Broker"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-xl mb-3 shadow-xs">
                  {broker.logo}
                </div>
                <h3 className="font-bold text-base text-foreground mb-1">{broker.name}</h3>
                <div className="text-xs text-muted-foreground mb-2">
                  {broker.countryFlag} {broker.headquarters}
                </div>

                <Badge variant="outline" className="text-[10px] font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                  <Star className="h-3 w-3 fill-emerald-500 mr-1" />
                  Score {broker.overallScore}/10
                </Badge>
              </div>
            ))}

            {/* Empty Slot to Add Broker */}
            {selectedBrokers.length < 4 && (
              <div className="p-6 flex flex-col items-center justify-center text-center border-r last:border-r-0 bg-muted/10">
                <Button
                  onClick={() => setAddBrokerModalOpen(true)}
                  variant="outline"
                  className="rounded-xl border-dashed h-12 px-4 gap-1 text-xs font-bold"
                >
                  <Plus className="h-4 w-4" /> Add Broker
                </Button>
                <span className="text-[10px] text-muted-foreground mt-2">
                  Up to {4 - selectedBrokers.length} more
                </span>
              </div>
            )}
          </div>

          {/* Table Comparison Rows */}
          <div className="divide-y text-xs">
            {/* Regulatory Status */}
            <div className={`grid grid-cols-4 items-center ${highlightDifferences ? "bg-primary/5" : ""}`}>
              <div className="p-4 font-bold text-muted-foreground border-r">Regulatory Status</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-semibold text-emerald-500 border-r last:border-r-0 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>{b.regulatoryStatus}</span>
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* Licenses */}
            <div className="grid grid-cols-4 items-center">
              <div className="p-4 font-bold text-muted-foreground border-r">Active Licenses</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-medium border-r last:border-r-0">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {b.regulators.map((r) => (
                      <span key={r} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* Min Deposit */}
            <div className={`grid grid-cols-4 items-center ${highlightDifferences ? "bg-primary/5" : ""}`}>
              <div className="p-4 font-bold text-muted-foreground border-r">Min. Initial Deposit</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-black text-foreground border-r last:border-r-0 text-sm">
                  ${b.minDeposit}
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* Max Leverage */}
            <div className={`grid grid-cols-4 items-center ${highlightDifferences ? "bg-primary/5" : ""}`}>
              <div className="p-4 font-bold text-muted-foreground border-r">Max. Leverage</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-bold text-foreground border-r last:border-r-0">
                  {b.maxLeverage}
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* EUR/USD Spread */}
            <div className="grid grid-cols-4 items-center">
              <div className="p-4 font-bold text-muted-foreground border-r">EUR/USD Raw Spread</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-bold text-emerald-500 border-r last:border-r-0">
                  {b.eurUsdSpread}
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* Trading Platforms */}
            <div className="grid grid-cols-4 items-center">
              <div className="p-4 font-bold text-muted-foreground border-r">Trading Platforms</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-medium border-r last:border-r-0">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {b.tradingPlatforms.map((plat) => (
                      <span key={plat} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-semibold text-foreground">
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* Withdrawal Speed */}
            <div className="grid grid-cols-4 items-center">
              <div className="p-4 font-bold text-muted-foreground border-r">Withdrawal Speed</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-semibold text-foreground border-r last:border-r-0">
                  {b.withdrawalSpeed}
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* Best For */}
            <div className="grid grid-cols-4 items-center">
              <div className="p-4 font-bold text-muted-foreground border-r">Recommended For</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="p-4 text-center font-bold text-primary border-r last:border-r-0">
                  {b.bestFor}
                </div>
              ))}
              {selectedBrokers.length < 4 && <div className="p-4 border-r last:border-r-0"></div>}
            </div>

            {/* Bottom Actions Row */}
            <div className="grid grid-cols-4 items-center bg-muted/20 p-4">
              <div className="font-bold text-muted-foreground">Action</div>
              {selectedBrokers.map((b) => (
                <div key={b.id} className="text-center px-3 space-y-2">
                  <Link to={`/broker/${b.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg h-9">
                      View Review
                    </Button>
                  </Link>
                  <a href={b.websiteUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button size="sm" className="w-full text-xs font-bold rounded-lg h-9 bg-gradient-to-r from-primary to-cyan-600">
                      Visit Site <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </a>
                </div>
              ))}
              {selectedBrokers.length < 4 && <div></div>}
            </div>
          </div>
        </div>
      </div>

      {/* Add Broker Modal */}
      {addBrokerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Add Broker to Comparison</h3>
              <button
                onClick={() => setAddBrokerModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableBrokersToAdd.map((broker) => (
                <div
                  key={broker.id}
                  onClick={() => addBroker(broker.id)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {broker.logo}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{broker.name}</div>
                      <div className="text-[11px] text-muted-foreground">{broker.regulatoryStatus}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs font-bold text-primary">
                    + Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

