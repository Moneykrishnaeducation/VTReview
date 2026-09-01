import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  ChevronRight,
  Command,
  ArrowRight,
  Filter,
} from "lucide-react";
import type { RankingCategoryId, RankedBroker } from "@/types/ranking";
import { RANKING_CATEGORIES, RANKED_BROKERS } from "@/data/rankings-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface RankingFiltersProps {
  selectedCategory: RankingCategoryId;
  onSelectCategory: (id: RankingCategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: "score" | "rating" | "reviews" | "deposit-low";
  onSortChange: (sort: "score" | "rating" | "reviews" | "deposit-low") => void;
  platformFilter: string;
  onPlatformFilterChange: (p: string) => void;
  depositFilter: string;
  onDepositFilterChange: (d: string) => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  onSelectBrokerQuickView?: (broker: RankedBroker) => void;
}

const POPULAR_QUICK_TAGS = [
  { label: "0.0 Raw Spreads", query: "0.0 pips", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20" },
  { label: "FCA Regulated", query: "FCA", color: "border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20" },
  { label: "Instant Payout", query: "Instant", color: "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20" },
  { label: "TradingView", query: "TradingView", color: "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20" },
  { label: "$10 Low Deposit", query: "$10", color: "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20" },
  { label: "Prop Firms", query: "FTMO", color: "border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20" },
];

export default function RankingFilters({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  platformFilter,
  onPlatformFilterChange,
  depositFilter,
  onDepositFilterChange,
  viewMode,
  onViewModeChange,
}: RankingFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCategoryObj = RANKING_CATEGORIES.find(
    (c) => c.id === selectedCategory,
  );

  // Live autocomplete results
  const liveMatchingBrokers = RANKED_BROKERS.filter((broker) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      broker.name.toLowerCase().includes(q) ||
      broker.headquarters.toLowerCase().includes(q) ||
      broker.tagline.toLowerCase().includes(q) ||
      broker.regulators.some((r) => r.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut '/' or 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && document.activeElement !== inputRef.current) ||
        ((e.metaKey || e.ctrlKey) && e.key === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsDropdownOpen(true);
      } else if (e.key === "Escape") {
        setIsDropdownOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectTag = (query: string) => {
    onSearchChange(query);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-5 mb-8 pt-2">
      {/* 1. SINGLE-ROW SLEEK & VIBRANT SEARCH CONTAINER */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/40 p-2 sm:p-2.5 shadow-xl shadow-primary/5 backdrop-blur-lg ring-1 ring-primary/20">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          {/* Search Input Section */}
          <div ref={searchContainerRef} className="relative flex-1">
            <div className="relative flex items-center">
              {/* Colorful Search Badge Icon */}
              <div className="absolute left-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-400 text-slate-950 font-bold shadow-md shadow-primary/20">
                <Search className="h-4 w-4" />
              </div>

              <Input
                ref={inputRef}
                type="search"
                placeholder="Search broker name, country, or regulation (e.g., IC Markets, FCA, Exness)..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="pl-12 pr-20 h-11 bg-background/90 text-xs sm:text-sm rounded-xl border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-medium placeholder:text-muted-foreground/75"
              />

              {/* Clear & Keyboard shortcut hints */}
              <div className="absolute right-3 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    onClick={() => {
                      onSearchChange("");
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground bg-muted/70 border border-border/60 rounded">
                    <Command className="h-2.5 w-2.5" /> K
                  </kbd>
                )}
              </div>
            </div>

            {/* Smart Live Results Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-primary/30 bg-card/98 backdrop-blur-xl p-4 shadow-2xl space-y-3 animate-in fade-in-50 zoom-in-95 duration-150">
                {searchQuery.trim() && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-bold mb-2 pb-1 border-b">
                      <span>Matching Verified Brokers ({liveMatchingBrokers.length})</span>
                      <span className="text-[10px] font-normal">Press Esc to close</span>
                    </div>

                    {liveMatchingBrokers.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-2 text-center">
                        No direct broker names matching "{searchQuery}". Showing global directory results.
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {liveMatchingBrokers.map((broker) => (
                          <div
                            key={broker.id}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                            onClick={() => {
                              onSearchChange(broker.name);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="h-6 w-6 rounded-lg bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">
                                #{broker.rank}
                              </span>
                              <div className="h-7 w-7 rounded-lg bg-muted border flex items-center justify-center font-bold text-xs text-foreground">
                                {broker.logo}
                              </div>
                              <div>
                                <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                                  <span>{broker.name}</span>
                                  <span>{broker.countryFlag}</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate max-w-[220px]">
                                  {broker.regulatoryStatus} • {broker.eurUsdSpread}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-yellow-400 flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-yellow-400" />
                                {broker.overallScore}
                              </span>
                              <Link
                                to={`/broker/${broker.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                              >
                                Review <ChevronRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Popular Quick Suggestions Tags */}
                <div>
                  <div className="text-xs text-muted-foreground font-bold mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Popular Shortcuts
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_QUICK_TAGS.map((tag) => (
                      <button
                        key={tag.label}
                        onClick={() => handleSelectTag(tag.query)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${tag.color}`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Search Terms */}
                <div className="pt-2 border-t text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 font-semibold text-foreground/80">
                    <TrendingUp className="h-3 w-3 text-emerald-400" /> Trending:
                  </span>
                  {["IC Markets", "Exness", "Pepperstone", "FTMO", "XM"].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectTag(term)}
                      className="hover:text-primary hover:underline text-[11px]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Mode Toggle on the right of the search row */}
          <div className="flex items-center gap-1 bg-background/80 p-1 rounded-xl border border-border/60 shrink-0">
            <button
              onClick={() => onViewModeChange("cards")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "cards"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Detailed Cards View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Comparison Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar py-0.5">
        <span className="text-muted-foreground font-semibold text-[11px] shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> Quick Tags:
        </span>
        {POPULAR_QUICK_TAGS.map((tag) => {
          const isActive = searchQuery === tag.query;
          return (
            <button
              key={tag.label}
              onClick={() => onSearchChange(isActive ? "" : tag.query)}
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : tag.color
              }`}
            >
              {tag.label}
            </button>
          );
        })}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-rose-400 hover:underline text-[11px] font-semibold flex items-center gap-0.5 ml-auto shrink-0"
          >
            <X className="h-3 w-3" /> Clear "{searchQuery}"
          </button>
        )}
      </div>

      {/* 2. CATEGORY TABS SCROLLABLE RIBBON */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {RANKING_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? "bg-gradient-to-r from-primary to-sky-400 text-slate-950 border-primary shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-card/70 border-border/70 text-foreground/80 hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CATEGORY DESCRIPTION BANNER */}
      {currentCategoryObj && (
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl sm:text-3xl p-2 rounded-xl bg-primary/20 shrink-0">
              {currentCategoryObj.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-foreground">
                  {currentCategoryObj.name}
                </h3>
                <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {currentCategoryObj.badgeText}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                {currentCategoryObj.description}
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-medium shrink-0 self-end sm:self-center">
            Updated Daily with Verified Audits
          </div>
        </div>
      )}
    </div>
  );
}
