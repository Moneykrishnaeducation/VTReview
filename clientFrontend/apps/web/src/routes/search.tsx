import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import {
  Search as SearchIcon,
  Filter,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  RefreshCw,
  LayoutGrid,
  List,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BrokerCard from "@/components/broker-card";
import { RANKED_BROKERS } from "@/data/rankings-data";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedRegulation, setSelectedRegulation] = useState<string>("all");
  const [selectedDeposit, setSelectedDeposit] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "deposit" | "reviews" | "name">("score");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const nextParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      nextParams.set("q", val);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const filteredBrokers = useMemo(() => {
    return RANKED_BROKERS.filter((broker) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = broker.name.toLowerCase().includes(q);
        const matchHq = broker.headquarters.toLowerCase().includes(q);
        const matchReg = broker.regulators.some((r) => r.toLowerCase().includes(q));
        const matchTagline = broker.tagline.toLowerCase().includes(q);
        if (!matchName && !matchHq && !matchReg && !matchTagline) return false;
      }

      // Regulation filter
      if (selectedRegulation !== "all" && broker.regulatoryStatus !== selectedRegulation) {
        return false;
      }

      // Deposit filter
      if (selectedDeposit !== "all") {
        if (selectedDeposit === "under-50" && broker.minDeposit > 50) return false;
        if (selectedDeposit === "50-100" && (broker.minDeposit < 50 || broker.minDeposit > 100)) return false;
        if (selectedDeposit === "over-100" && broker.minDeposit <= 100) return false;
      }

      // Platform filter
      if (selectedPlatform !== "all" && !broker.tradingPlatforms.includes(selectedPlatform)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "deposit") return a.minDeposit - b.minDeposit;
      if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.overallScore - a.overallScore;
    });
  }, [query, selectedRegulation, selectedDeposit, selectedPlatform, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setSelectedRegulation("all");
    setSelectedDeposit("all");
    setSelectedPlatform("all");
    setSortBy("score");
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Sparkles className="h-3 w-3" /> Global Directory
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Broker Search & Directory</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Search, filter, and review regulated financial brokers worldwide.
          </p>
        </div>

        {/* Top Search Input */}
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            placeholder="Search broker, license (FCA/ASIC), country..."
            className="pl-10 h-11 text-xs sm:text-sm rounded-xl"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-6 p-5 rounded-2xl bg-card border">
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter Brokers
            </h3>
            {(selectedRegulation !== "all" || selectedDeposit !== "all" || selectedPlatform !== "all" || query) && (
              <button
                onClick={resetFilters}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Regulation Status */}
          <div>
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
              Regulation Tier
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { id: "all", label: "All Regulations" },
                { id: "Tier-1 Regulated", label: "Tier-1 Regulated Only" },
                { id: "Multi-Regulated", label: "Multi-Regulated" },
                { id: "Verified", label: "Verified & Audited" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors text-foreground font-medium"
                >
                  <input
                    type="radio"
                    name="reg"
                    checked={selectedRegulation === item.id}
                    onChange={() => setSelectedRegulation(item.id)}
                    className="text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Deposit */}
          <div className="pt-3 border-t">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
              Minimum Deposit
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { id: "all", label: "Any Minimum Deposit" },
                { id: "under-50", label: "Low Deposit (< $50)" },
                { id: "50-100", label: "$50 - $100" },
                { id: "over-100", label: "$100+" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors text-foreground font-medium"
                >
                  <input
                    type="radio"
                    name="deposit"
                    checked={selectedDeposit === item.id}
                    onChange={() => setSelectedDeposit(item.id)}
                    className="text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="pt-3 border-t">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
              Trading Platform
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { id: "all", label: "All Platforms" },
                { id: "TradingView", label: "TradingView Charts" },
                { id: "cTrader", label: "cTrader ECN" },
                { id: "MT5", label: "MetaTrader 5" },
                { id: "MT4", label: "MetaTrader 4" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors text-foreground font-medium"
                >
                  <input
                    type="radio"
                    name="platform"
                    checked={selectedPlatform === item.id}
                    onChange={() => setSelectedPlatform(item.id)}
                    className="text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Main Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Controls Bar: Sort + View Toggle + Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-card border text-xs">
            <div className="text-muted-foreground font-medium">
              Displaying <strong className="text-foreground">{filteredBrokers.length}</strong> brokers
              {query && (
                <span>
                  {" "}matching "<strong className="text-primary">{query}</strong>"
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-8 rounded-lg bg-muted border border-input px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="score">Highest VT Score</option>
                  <option value="deposit">Lowest Deposit</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Broker Name (A-Z)</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-card text-primary shadow-2xs" : "text-muted-foreground"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-card text-primary shadow-2xs" : "text-muted-foreground"
                  }`}
                  title="List View"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Listings */}
          {filteredBrokers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border bg-card/60 space-y-4">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <h3 className="text-lg font-bold text-foreground">No brokers matched your criteria</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Try loosening your filters or searching for broker brands like "IC Markets", "Exness", or "Pepperstone".
              </p>
              <Button onClick={resetFilters} variant="outline" size="sm">
                Reset All Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBrokers.map((broker) => (
                <BrokerCard key={broker.id} broker={broker} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBrokers.map((broker) => (
                <div
                  key={broker.id}
                  className="p-4 rounded-2xl bg-card border hover:border-primary/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-sm shrink-0">
                      {broker.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link to={`/broker/${broker.id}`} className="font-bold text-base text-foreground hover:text-primary transition-colors">
                          {broker.name}
                        </Link>
                        <Badge variant="outline" className="text-[10px] py-0 h-4 text-emerald-500 border-emerald-500/30">
                          {broker.regulatoryStatus}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {broker.countryFlag} {broker.headquarters} • Min Dep: ${broker.minDeposit} • Spread: {broker.eurUsdSpread}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 sm:justify-end">
                        <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                        {broker.overallScore}/10
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {broker.reviewsCount} reviews
                      </div>
                    </div>

                    <Link to={`/broker/${broker.id}`}>
                      <Button size="sm" variant="outline" className="text-xs font-bold rounded-lg h-9">
                        Review <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

