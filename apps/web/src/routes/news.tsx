import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  Newspaper,
  ShieldAlert,
  TrendingUp,
  Bookmark,
  Sparkles,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import type { NewsArticle, NewsCategory } from "@/types/news";
import { NEWS_ARTICLES } from "@/data/news-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NewsTicker from "@/components/news/news-ticker";
import NewsHero from "@/components/news/news-hero";
import NewsCard from "@/components/news/news-card";
import NewsFilters from "@/components/news/news-filters";
import EconomicCalendarWidget from "@/components/news/economic-calendar-widget";
import RegulatoryWarningsWidget from "@/components/news/regulatory-warnings-widget";
import MarketSentimentWidget from "@/components/news/market-sentiment-widget";
import NewsNewsletterCard from "@/components/news/news-newsletter-card";
import NewsDetailDialog from "@/components/news/news-detail-dialog";

type ViewTab = "all" | "warnings" | "analysis" | "bookmarks";

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ViewTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("latest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Bookmarks state (in-memory, initialized from localStorage if available)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vt_news_bookmarks");
      return saved ? JSON.parse(saved) : ["fca-crackdown-clone-brokers-2026"];
    } catch {
      return ["fca-crackdown-clone-brokers-2026"];
    }
  });

  // Selected article for modal reader
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Pagination / Load more state
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Check URL query for initial article
  useEffect(() => {
    const articleSlug = searchParams.get("article");
    if (articleSlug) {
      const found = NEWS_ARTICLES.find(
        (a) => a.slug === articleSlug || a.id === articleSlug,
      );
      if (found) {
        setSelectedArticle(found);
      }
    }
  }, [searchParams]);

  // Sync bookmarks to localStorage
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("vt_news_bookmarks", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter((article) => {
      // Tab filter
      if (activeTab === "warnings") {
        if (article.category !== "Regulation & Alerts" && article.sentiment !== "High Alert") {
          return false;
        }
      } else if (activeTab === "analysis") {
        if (article.category !== "Forex" && article.category !== "Commodities" && article.category !== "Stocks & Indices") {
          return false;
        }
      } else if (activeTab === "bookmarks") {
        if (!bookmarkedIds.includes(article.id)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All" && article.category !== selectedCategory) {
        return false;
      }

      // Sentiment filter
      if (selectedSentiment !== "All" && article.sentiment !== selectedSentiment) {
        return false;
      }

      // Tag filter
      if (selectedTag && !article.tags.includes(selectedTag)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesSummary = article.summary.toLowerCase().includes(q);
        const matchesAuthor = article.author.name.toLowerCase().includes(q);
        const matchesBroker = article.taggedBroker?.name.toLowerCase().includes(q);
        const matchesTags = article.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesSummary && !matchesAuthor && !matchesBroker && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "popular") {
        return b.views - a.views;
      }
      if (sortBy === "trending") {
        return b.likes - a.likes;
      }
      return 0; // Default latest order
    });
  }, [
    activeTab,
    selectedCategory,
    selectedSentiment,
    selectedTag,
    searchQuery,
    sortBy,
    bookmarkedIds,
  ]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleSelectArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    if (searchParams.get("article")) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("article");
      setSearchParams(nextParams);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSentiment("All");
    setSelectedTag(null);
    setSearchQuery("");
    setActiveTab("all");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Live Market & Breaking Alerts Ticker */}
      <NewsTicker />

      <main className="container mx-auto px-4 py-8 lg:px-8 flex-1">
        {/* 2. Page Header & View Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> VTINDEX Market Intelligence
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
              Forex & Market News
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
              Real-time financial market analysis, central bank policies, broker investigation reports, and regulatory safety alerts.
            </p>
          </div>

          {/* View Tab Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/50 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Newspaper className="h-4 w-4" /> All News
            </button>
            <button
              onClick={() => setActiveTab("warnings")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "warnings"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-rose-400"
              }`}
            >
              <ShieldAlert className="h-4 w-4" /> Scam & Alerts
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "analysis"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-4 w-4" /> Analysis
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "bookmarks"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-amber-400"
              }`}
            >
              <Bookmark className="h-4 w-4" /> Saved ({bookmarkedIds.length})
            </button>
          </div>
        </div>

        {/* 3. Hero Feature Section (Only on "all" tab and when no active search) */}
        {activeTab === "all" && !searchQuery && selectedCategory === "All" && !selectedTag && (
          <NewsHero
            articles={NEWS_ARTICLES}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {/* 4. Filter & Search Controls */}
        <NewsFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSentiment={selectedSentiment}
          onSelectSentiment={setSelectedSentiment}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        {/* 5. Main Content Layout (Feed + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main News Feed (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Filters Bar / Results Count */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b">
              <div>
                Showing <span className="font-bold text-foreground">{filteredArticles.length}</span>{" "}
                articles
                {selectedCategory !== "All" && (
                  <span>
                    {" "}in <span className="font-semibold text-primary">{selectedCategory}</span>
                  </span>
                )}
                {selectedTag && (
                  <span>
                    {" "}tagged <span className="font-semibold text-primary">{selectedTag}</span>
                  </span>
                )}
              </div>

              {(selectedCategory !== "All" || selectedTag || searchQuery || selectedSentiment !== "All" || activeTab !== "all") && (
                <button
                  onClick={resetFilters}
                  className="text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="h-3 w-3" /> Reset All Filters
                </button>
              )}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border bg-card/40 space-y-4">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-foreground">No articles match your criteria</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search terms, changing the category filter, or exploring trending topics.
                </p>
                <Button onClick={resetFilters} variant="outline" size="sm">
                  View All News
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.slice(0, visibleCount).map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      isBookmarked={bookmarkedIds.includes(article.id)}
                      onToggleBookmark={toggleBookmark}
                      onSelectArticle={handleSelectArticle}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredArticles.length && (
                  <div className="pt-6 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      variant="outline"
                      size="lg"
                      className="px-8 rounded-full shadow-sm gap-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          Loading latest articles...
                        </>
                      ) : (
                        `Load More Stories (${filteredArticles.length - visibleCount} remaining)`
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar Widgets (4 cols on lg) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-20">
            {/* Economic Calendar Widget */}
            <EconomicCalendarWidget />

            {/* Regulatory Blacklist & Scam Alerts Widget */}
            <RegulatoryWarningsWidget />

            {/* Market Sentiment & Top Movers Widget */}
            <MarketSentimentWidget />

            {/* Newsletter Subscription Box */}
            <NewsNewsletterCard />
          </aside>
        </div>
      </main>

      {/* 6. Article Detail Modal / Reader View */}
      <NewsDetailDialog
        article={selectedArticle}
        allArticles={NEWS_ARTICLES}
        isBookmarked={selectedArticle ? bookmarkedIds.includes(selectedArticle.id) : false}
        onToggleBookmark={toggleBookmark}
        onClose={handleCloseModal}
        onSelectArticle={handleSelectArticle}
      />
    </div>
  );
}
