import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import type { NewsCategory, MarketSentiment } from "@/types/news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRENDING_TAGS } from "@/data/news-data";

const CATEGORIES: NewsCategory[] = [
  "All",
  "Forex",
  "Crypto",
  "Stocks & Indices",
  "Commodities",
  "Regulation & Alerts",
  "Broker Investigations",
  "Central Banks & Economy",
];

interface NewsFiltersProps {
  selectedCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSentiment: string;
  onSelectSentiment: (sentiment: string) => void;
  sortBy: "latest" | "popular" | "trending";
  onSortChange: (sort: "latest" | "popular" | "trending") => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function NewsFilters({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedSentiment,
  onSelectSentiment,
  sortBy,
  onSortChange,
  selectedTag,
  onSelectTag,
}: NewsFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search and Secondary Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search news, brokers, pairs (e.g., Exness, EUR/USD, FCA)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 bg-card/80 text-sm rounded-xl border-border/60 focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort and Sentiment Filter toggles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40 text-xs">
            <span className="text-muted-foreground px-2 font-medium hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" /> Sort:
            </span>
            <button
              onClick={() => onSortChange("latest")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                sortBy === "latest"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => onSortChange("popular")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                sortBy === "popular"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => onSortChange("trending")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                sortBy === "trending"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Trending
            </button>
          </div>

          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40 text-xs">
            {["All", "Bullish", "Bearish", "High Alert"].map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => onSelectSentiment(sentiment)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedSentiment === sentiment
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sentiment === "High Alert" ? "🚨 Alerts" : sentiment}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(category)}
            className="rounded-full text-xs font-semibold px-4 whitespace-nowrap transition-all duration-200"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Trending Hashtags row */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs text-muted-foreground no-scrollbar">
        <span className="flex items-center gap-1 font-semibold text-foreground/80 shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Trending Topics:
        </span>
        {TRENDING_TAGS.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(isSelected ? null : tag)}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 border-border/60 hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          );
        })}
        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            <X className="h-3 w-3" /> Clear #{selectedTag.replace("#", "")}
          </button>
        )}
      </div>
    </div>
  );
}
