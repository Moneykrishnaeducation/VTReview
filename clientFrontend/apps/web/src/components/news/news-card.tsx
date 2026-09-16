import type * as React from "react";
import { Clock, Eye, MessageSquare, Bookmark, Share2, Star, ShieldCheck, ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NewsCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export default function NewsCard({
  article,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
}: NewsCardProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/news#${article.slug}`);
      toast.success("Link copied to clipboard!", {
        description: `Share "${article.title.substring(0, 40)}..." with fellow traders.`,
      });
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(article.id);
    if (!isBookmarked) {
      toast.success("Article saved to your reading list!");
    } else {
      toast.info("Removed from saved articles.");
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return <Badge variant="success">Bullish ▲</Badge>;
      case "Bearish":
        return <Badge variant="danger">Bearish ▼</Badge>;
      case "High Alert":
        return <Badge variant="danger">⚠️ High Alert</Badge>;
      default:
        return <Badge variant="info">Neutral ─</Badge>;
    }
  };

  return (
    <article
      onClick={() => onSelectArticle(article)}
      className="group relative flex flex-col justify-between rounded-xl border bg-card/60 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
    >
      {/* Thumbnail & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30" />

        {/* Top floaters: Category & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <Badge variant="secondary" className="backdrop-blur bg-background/80 font-medium">
            {article.category}
          </Badge>
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur rounded-full p-1 border border-border/40">
            <button
              onClick={handleBookmark}
              title={isBookmarked ? "Remove Bookmark" : "Save Article"}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked
                  ? "text-amber-400 hover:text-amber-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-400" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              title="Share Story"
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom floaters over image: Sentiment & Broker Mention */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5">
            {getSentimentBadge(article.sentiment)}
          </div>
          {article.taggedBroker && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-background/90 text-xs font-semibold backdrop-blur border border-border/40 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{article.taggedBroker.name}</span>
              <span className="text-yellow-400 flex items-center text-[11px]">
                <Star className="h-3 w-3 fill-yellow-400 mr-0.5" />
                {article.taggedBroker.rating}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.publishedAt}
            </span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h3 className="font-bold text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>

          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-primary/90 bg-primary/10 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Card Footer: Author & Engagement stats */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-[10px]">
              {article.author.avatar}
            </div>
            <span className="font-medium text-foreground truncate max-w-[120px]">
              {article.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Views">
              <Eye className="h-3.5 w-3.5" /> {article.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1" title="Comments">
              <MessageSquare className="h-3.5 w-3.5" /> {article.commentsCount}
            </span>
            <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform ml-1">
              Read <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
