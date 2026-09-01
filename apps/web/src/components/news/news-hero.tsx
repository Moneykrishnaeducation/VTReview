import { Clock, Eye, MessageSquare, ArrowUpRight, Flame, ShieldAlert, Sparkles } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsHeroProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export default function NewsHero({ articles, onSelectArticle }: NewsHeroProps) {
  const featured = articles.find((a) => a.isFeatured) || articles[0];
  const sideArticles = articles.filter((a) => a.id !== featured?.id).slice(0, 2);

  if (!featured) return null;

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hero Featured Article */}
        <div
          onClick={() => onSelectArticle(featured)}
          className="lg:col-span-8 group relative rounded-2xl overflow-hidden border bg-card/60 hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-sm flex flex-col justify-end min-h-[420px] md:min-h-[480px]"
        >
          {/* Background image & gradient overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src={featured.imageUrl}
              alt={featured.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          </div>

          {/* Badges & Top meta */}
          <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="danger" className="font-bold flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> FEATURED INVESTIGATION
              </Badge>
              <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                {featured.category}
              </Badge>
              <Badge
                variant={
                  featured.sentiment === "Bullish"
                    ? "success"
                    : featured.sentiment === "Bearish"
                    ? "danger"
                    : featured.sentiment === "High Alert"
                    ? "danger"
                    : "info"
                }
              >
                {featured.sentiment === "High Alert" ? "⚠️ Urgent Warning" : featured.sentiment}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors">
              {featured.title}
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl">
              {featured.summary}
            </p>

            {/* Author and Action footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary text-xs">
                  {featured.author.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{featured.author.name}</div>
                  <div className="text-muted-foreground text-xs">{featured.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {featured.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {featured.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> {featured.commentsCount}
                </span>
                <Button size="sm" className="ml-2 gap-1 rounded-full group-hover:bg-primary">
                  Read Full Story <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Trending Columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" /> Trending Market Reports
            </h2>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Curated
            </span>
          </div>

          {sideArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group flex-1 rounded-xl border bg-card/60 p-5 hover:border-primary/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {article.publishedAt}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>

                <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                  {article.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-border/40 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{article.author.name}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <span className="text-primary font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Read <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
