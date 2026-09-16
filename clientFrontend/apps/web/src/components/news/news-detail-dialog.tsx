import type * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  X,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  Flame,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldCheck,
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { NewsArticle, NewsComment } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NewsDetailDialogProps {
  article: NewsArticle | null;
  allArticles: NewsArticle[];
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onClose: () => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export default function NewsDetailDialog({
  article,
  allArticles,
  isBookmarked,
  onToggleBookmark,
  onClose,
  onSelectArticle,
}: NewsDetailDialogProps) {
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState({
    bullish: 142,
    bearish: 38,
    warning: 89,
  });

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<NewsComment[]>([]);

  useEffect(() => {
    if (article) {
      setLikesCount(article.likes);
      setHasLiked(false);
      setReaction(null);
      setComments(article.comments || []);
    }
  }, [article]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      toast.success("Thank you for your feedback!");
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleReaction = (type: "bullish" | "bearish" | "warning") => {
    if (reaction === type) {
      setReaction(null);
      setReactionCounts((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    } else {
      if (reaction) {
        setReactionCounts((prev) => ({
          ...prev,
          [reaction as "bullish" | "bearish" | "warning"]:
            prev[reaction as "bullish" | "bearish" | "warning"] - 1,
        }));
      }
      setReaction(type);
      setReactionCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      toast.success(`Voted ${type.toUpperCase()}!`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: NewsComment = {
      id: "comment-" + Date.now(),
      author: "Verified Trader",
      avatar: "VT",
      date: "Just now",
      content: commentText.trim(),
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    toast.success("Comment submitted successfully!");
  };

  // Find related articles
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some(t => article.tags.includes(t))))
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-background/80 backdrop-blur-md overflow-y-auto">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border rounded-2xl shadow-2xl flex flex-col no-scrollbar">
        {/* Sticky Top Header with Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-card/95 backdrop-blur border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {article.category}
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-full border transition-colors ${
                isBookmarked
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  : "hover:bg-muted text-muted-foreground border-border"
              }`}
              title="Save Article"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Share Link"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Close Reader"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Article Title & Subtitle */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge
                variant={
                  article.sentiment === "Bullish"
                    ? "success"
                    : article.sentiment === "Bearish"
                    ? "danger"
                    : article.sentiment === "High Alert"
                    ? "danger"
                    : "info"
                }
              >
                {article.sentiment === "High Alert" ? "🚨 Urgent Alert" : article.sentiment}
              </Badge>
              {article.isBreaking && (
                <Badge variant="danger" className="animate-pulse">
                  ⚡ Breaking
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-6">
              {article.subtitle}
            </p>

            {/* Author bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary text-sm">
                  {article.author.avatar}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">
                    {article.author.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {article.author.role} • VTINDEX Market Intelligence
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Published {article.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {article.views.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden border bg-muted">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
            {article.imageCaption && (
              <div className="p-3 text-xs text-muted-foreground bg-muted/50 border-t italic">
                Photo: {article.imageCaption}
              </div>
            )}
          </div>

          {/* Key Takeaways Box */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-3">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Key Market Takeaways
              </h3>
              <ul className="space-y-2 text-sm text-foreground/90">
                {article.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tagged Broker Profile Card */}
          {article.taggedBroker && (
            <div className="p-5 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-muted text-foreground flex items-center justify-center font-bold text-xl border">
                  {article.taggedBroker.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-foreground">
                      {article.taggedBroker.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <ShieldCheck className="h-3 w-3" /> {article.taggedBroker.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center text-yellow-400 font-medium">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 mr-1" />
                      {article.taggedBroker.rating} / 10 Score
                    </span>
                    <span>•</span>
                    <span>Verified Broker Profile</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to={`/broker/${article.taggedBroker.slug}`}
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  <Button size="sm" className="w-full">
                    View Broker Review <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Article Full Paragraphs */}
          <div className="space-y-5 text-foreground/90 leading-relaxed text-base">
            {article.contentParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-semibold mr-1">
              Tagged Topics:
            </span>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Trader Sentiment Voting Bar */}
          <div className="p-6 rounded-xl border bg-muted/20 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground">
                How do you view this development?
              </h4>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  hasLiked
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({likesCount})
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleReaction("bullish")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  reaction === "bullish"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                    : "hover:bg-muted/40 border-border text-muted-foreground"
                }`}
              >
                <div className="text-lg mb-1">🚀</div>
                <div className="text-xs font-semibold">Bullish</div>
                <div className="text-[11px] opacity-80">{reactionCounts.bullish} votes</div>
              </button>

              <button
                onClick={() => handleReaction("bearish")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  reaction === "bearish"
                    ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold"
                    : "hover:bg-muted/40 border-border text-muted-foreground"
                }`}
              >
                <div className="text-lg mb-1">📉</div>
                <div className="text-xs font-semibold">Bearish</div>
                <div className="text-[11px] opacity-80">{reactionCounts.bearish} votes</div>
              </button>

              <button
                onClick={() => handleReaction("warning")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  reaction === "warning"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "hover:bg-muted/40 border-border text-muted-foreground"
                }`}
              >
                <div className="text-lg mb-1">⚠️</div>
                <div className="text-xs font-semibold">High Risk</div>
                <div className="text-[11px] opacity-80">{reactionCounts.warning} votes</div>
              </button>
            </div>
          </div>

          {/* Related Articles Row */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t space-y-4">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500" /> Related Stories
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <Badge variant="outline" className="text-[10px] mb-2">
                      {rel.category}
                    </Badge>
                    <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {rel.title}
                    </h5>
                    <div className="text-xs text-muted-foreground flex items-center justify-between">
                      <span>{rel.publishedAt}</span>
                      <span className="text-primary font-medium flex items-center gap-0.5">
                        Read Story <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Discussion Section */}
          <div className="pt-6 border-t space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Trader Discussion ({comments.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Guidelines: Keep discussions respectful and informative
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your market analysis or experience with this broker..."
                rows={3}
                className="w-full rounded-xl border border-border/70 bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" className="gap-1.5" disabled={!commentText.trim()}>
                  <Send className="h-3.5 w-3.5" /> Post Comment
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  Be the first trader to join the discussion on this report!
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-muted/20 border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/20 font-bold text-primary flex items-center justify-center text-[10px]">
                          {c.avatar}
                        </div>
                        <span className="font-bold text-foreground">{c.author}</span>
                        <span className="text-muted-foreground">• {c.date}</span>
                      </div>
                      <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                        <ThumbsUp className="h-3 w-3" /> {c.likes}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 pl-9">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
