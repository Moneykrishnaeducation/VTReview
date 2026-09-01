import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Trophy,
  Star,
  ShieldCheck,
  Search,
  Sparkles,
  RefreshCw,
  Award,
  ChevronRight,
  Zap,
} from "lucide-react";
import type { RankingCategoryId, RankedBroker } from "@/types/ranking";
import { RANKED_BROKERS, RANKING_CATEGORIES } from "@/data/rankings-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RankingCard from "@/components/rankings/ranking-card";
import RankingTableView from "@/components/rankings/ranking-table-view";
import RankingFilters from "@/components/rankings/ranking-filters";
import RankingQuickViewModal from "@/components/rankings/ranking-quick-view-modal";
import RankingCompareBar from "@/components/rankings/ranking-compare-bar";
import RankingMethodology from "@/components/rankings/ranking-methodology";
import RankingFAQ from "@/components/rankings/ranking-faq";

export default function Rankings() {
  const [selectedCategory, setSelectedCategory] = useState<RankingCategoryId>("top-rated");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "rating" | "reviews" | "deposit-low">("score");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [depositFilter, setDepositFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Selected broker for Quick View modal
  const [quickViewBroker, setQuickViewBroker] = useState<RankedBroker | null>(null);

  // Compare selection (up to 4 brokers)
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(["ic-markets", "exness"]);

  const toggleCompare = (broker: RankedBroker) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(broker.id)) {
        return prev.filter((id) => id !== broker.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), broker.id];
      }
      return [...prev, broker.id];
    });
  };

  const removeCompareBroker = (id: string) => {
    setSelectedCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const clearAllCompare = () => {
    setSelectedCompareIds([]);
  };

  // Filter & sort ranked brokers
  const filteredBrokers = useMemo(() => {
    return RANKED_BROKERS.filter((broker) => {
      // Category filter
      if (selectedCategory && !broker.categories.includes(selectedCategory)) {
        return false;
      }

      // Platform filter
      if (platformFilter !== "all" && !broker.tradingPlatforms.includes(platformFilter)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = broker.name.toLowerCase().includes(q);
        const matchesHq = broker.headquarters.toLowerCase().includes(q);
        const matchesTagline = broker.tagline.toLowerCase().includes(q);
        const matchesRegs = broker.regulators.some((r) => r.toLowerCase().includes(q));

        if (!matchesName && !matchesHq && !matchesTagline && !matchesRegs) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "reviews") {
        return b.reviewsCount - a.reviewsCount;
      }
      if (sortBy === "deposit-low") {
        return a.minDeposit - b.minDeposit;
      }
      return b.overallScore - a.overallScore; // Default Overall Score
    });
  }, [selectedCategory, searchQuery, sortBy, platformFilter]);

  const selectedCompareBrokers = useMemo(() => {
    return RANKED_BROKERS.filter((b) => selectedCompareIds.includes(b.id));
  }, [selectedCompareIds]);

  const resetFilters = () => {
    setSelectedCategory("top-rated");
    setSearchQuery("");
    setSortBy("score");
    setPlatformFilter("all");
    setDepositFilter("all");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8 lg:px-8 max-w-6xl flex-1">
        {/* Category Tabs, Search & Filter Controls */}
        <RankingFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
          depositFilter={depositFilter}
          onDepositFilterChange={setDepositFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* 4. Main Rankings Listings (Cards View or Table View) */}
        <section className="mb-14 space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b">
            <div>
              Displaying <span className="font-bold text-foreground">{filteredBrokers.length}</span>{" "}
              verified brokers
            </div>

            {(selectedCategory !== "top-rated" || searchQuery || platformFilter !== "all" || sortBy !== "score") && (
              <button
                onClick={resetFilters}
                className="text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="h-3 w-3" /> Reset Filters
              </button>
            )}
          </div>

          {filteredBrokers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border bg-card/40 space-y-4">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <h3 className="text-lg font-bold text-foreground">No brokers matched your criteria</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Try clearing your search query or selecting a different ranking category or trading platform.
              </p>
              <Button onClick={resetFilters} variant="outline" size="sm">
                Show All Top Rated Brokers
              </Button>
            </div>
          ) : viewMode === "cards" ? (
            <div className="space-y-4">
              {filteredBrokers.map((broker) => (
                <RankingCard
                  key={broker.id}
                  broker={broker}
                  onQuickView={(b) => setQuickViewBroker(b)}
                  onToggleCompare={toggleCompare}
                  isSelectedForCompare={selectedCompareIds.includes(broker.id)}
                />
              ))}
            </div>
          ) : (
            <RankingTableView
              brokers={filteredBrokers}
              onQuickView={(b) => setQuickViewBroker(b)}
              onToggleCompare={toggleCompare}
              selectedCompareIds={selectedCompareIds}
            />
          )}
        </section>

        {/* 5. Scientific Scoring Methodology Card */}
        <RankingMethodology />

        {/* 6. Frequently Asked Questions Accordion */}
        <RankingFAQ />

        {/* 7. Call To Action Footer Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-card border border-primary/30 p-8 md:p-12 text-center relative overflow-hidden shadow-lg mb-12">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Ready to find the ideal broker for your trading goals?
            </h3>
            <p className="text-sm text-muted-foreground">
              Compare spreads, leverage, and withdrawal conditions side-by-side or search our comprehensive regulatory database.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link to="/compare">
                <Button size="lg" className="rounded-xl font-bold shadow-md">
                  Compare Selected Brokers ({selectedCompareIds.length})
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="rounded-xl font-bold">
                  <Search className="mr-2 h-4 w-4" /> Search Broker Database
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Quick Specs Preview Modal */}
      <RankingQuickViewModal
        broker={quickViewBroker}
        onClose={() => setQuickViewBroker(null)}
        onToggleCompare={toggleCompare}
        isSelectedForCompare={
          quickViewBroker ? selectedCompareIds.includes(quickViewBroker.id) : false
        }
      />

      {/* Floating Bottom Compare Bar */}
      <RankingCompareBar
        selectedBrokers={selectedCompareBrokers}
        onRemoveBroker={removeCompareBroker}
        onClearAll={clearAllCompare}
      />
    </div>
  );
}
