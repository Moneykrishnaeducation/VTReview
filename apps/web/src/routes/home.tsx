import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Star,
  AlertTriangle,
  Scale,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  Award,
  Globe,
  ArrowRight,
  ExternalLink,
  Users,
  Building2,
  Cpu,
  Coins,
  DollarSign,
  Lock,
  Clock,
  ThumbsUp,
  MessageSquare,
  Flame,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BrokerCard from "@/components/broker-card";
import { RANKED_BROKERS } from "@/data/rankings-data";
import { MARKET_TICKERS, NEWS_ARTICLES, REGULATORY_WARNINGS } from "@/data/news-data";

export default function Home() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");
  const [leaderboardTab, setLeaderboardTab] = useState<"top-rated" | "best-forex" | "safest" | "low-deposit" | "prop-firms">("top-rated");
  
  // Compare Launcher State
  const [compareBrokerA, setCompareBrokerA] = useState("ic-markets");
  const [compareBrokerB, setCompareBrokerB] = useState("exness");

  // Filter leaderboard brokers
  const leaderboardBrokers = useMemo(() => {
    return RANKED_BROKERS.filter((b) => b.categories.includes(leaderboardTab)).slice(0, 5);
  }, [leaderboardTab]);

  // Live search suggestions
  const searchSuggestions = useMemo(() => {
    if (!heroSearch.trim()) return [];
    const q = heroSearch.toLowerCase();
    return RANKED_BROKERS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.headquarters.toLowerCase().includes(q) ||
        b.regulators.some((r) => r.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [heroSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const brokerAData = RANKED_BROKERS.find((b) => b.id === compareBrokerA) || RANKED_BROKERS[0];
  const brokerBData = RANKED_BROKERS.find((b) => b.id === compareBrokerB) || RANKED_BROKERS[1];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Live Market Ticker Ribbon */}
      <div className="bg-muted/40 border-b overflow-hidden py-2 text-xs">
        <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-2 font-bold text-primary shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE MARKETS:
          </div>
          <div className="flex items-center gap-6 text-xs">
            {MARKET_TICKERS.map((ticker) => (
              <div key={ticker.symbol} className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{ticker.symbol}</span>
                <span className="font-mono">{ticker.price}</span>
                <span
                  className={`font-semibold ${
                    ticker.isPositive ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {ticker.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 glow-mesh border-b">
        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>The Global Authority on Forex & CFD Broker Intelligence</span>
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">2026 EDITION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
            Search. Verify. Compare. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              Trade with Absolute Confidence.
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Independent scientific rating engine, license cross-verification across 54 global financial regulators, and real trader exposure reports.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                type="search"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search by broker name, license (e.g. FCA, ASIC), or feature..."
                className="w-full h-15 pl-13 pr-32 text-sm sm:text-base rounded-2xl shadow-lg border-2 border-border/80 focus-visible:border-primary bg-card/90 backdrop-blur-md"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-2 h-11 rounded-xl px-6 text-sm font-bold shadow-md bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90"
              >
                Verify Broker
              </Button>
            </form>

            {/* Instant Search Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border shadow-xl p-2 z-30 text-left animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase px-3 py-1.5">
                  Matching Brokers
                </div>
                {searchSuggestions.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/broker/${b.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {b.logo}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">{b.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {b.countryFlag} {b.headquarters} • Reg: {b.regulators.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-500">Score {b.overallScore}/10</div>
                      <div className="text-[10px] text-muted-foreground">{b.regulatoryStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground mb-12">
            <span className="font-medium text-foreground">Popular:</span>
            {["IC Markets", "Exness", "TradingView Brokers", "Raw Spreads 0.0", "ASIC Regulated", "FTMO Prop Firm"].map((tag) => (
              <button
                key={tag}
                onClick={() => setHeroSearch(tag)}
                className="px-3 py-1 rounded-full bg-muted/60 hover:bg-muted text-foreground/80 hover:text-foreground border border-border/50 transition-colors font-medium text-xs flex items-center gap-1"
              >
                <TrendingUp className="h-3 w-3 text-primary" />
                {tag}
              </button>
            ))}
          </div>

          {/* Trust Matrix Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xs border border-border/40 text-center">
              <div className="text-2xl sm:text-3xl font-black text-foreground">50,000+</div>
              <div className="text-xs font-medium text-muted-foreground mt-1">Brokers Monitored</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xs border border-border/40 text-center">
              <div className="text-2xl sm:text-3xl font-black text-primary">54</div>
              <div className="text-xs font-medium text-muted-foreground mt-1">Global Regulators</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xs border border-border/40 text-center">
              <div className="text-2xl sm:text-3xl font-black text-foreground">$4.2B+</div>
              <div className="text-xs font-medium text-muted-foreground mt-1">Monthly Volume Tracked</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xs border border-border/40 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-500">250,000+</div>
              <div className="text-xs font-medium text-muted-foreground mt-1">Verified Trader Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Category Navigation */}
      <section className="py-12 bg-muted/20 border-b">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Explore Broker Categories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Filter platforms tailored to your specific trading methodology
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Building2, label: "Forex Brokers", count: "2,450+", color: "text-blue-500", cat: "top-rated" },
              { icon: Zap, label: "Raw Spreads (0.0)", count: "120+ ECN", color: "text-amber-500", cat: "best-forex" },
              { icon: ShieldCheck, label: "Tier-1 Regulated", count: "380+ Safe", color: "text-emerald-500", cat: "safest" },
              { icon: DollarSign, label: "Low Deposit ($5-$10)", count: "410+ Micro", color: "text-cyan-500", cat: "low-deposit" },
              { icon: Cpu, label: "Algo & Copy Trading", count: "290+ Systems", color: "text-purple-500", cat: "copy-trading" },
              { icon: Award, label: "Prop Trading Firms", count: "85+ Funded", color: "text-rose-500", cat: "prop-firms" },
            ].map((item, i) => (
              <Card
                key={i}
                onClick={() => {
                  navigate(`/rankings`);
                }}
                className="hover:border-primary hover:shadow-md cursor-pointer transition-all text-center group bg-card/70 backdrop-blur-xs p-4"
              >
                <div className={`h-11 w-11 rounded-xl bg-muted/60 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </h3>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  {item.count}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-24">
        
        {/* 4. Top Broker Leaderboard with Interactive Filter Tabs */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Flame className="h-3.5 w-3.5" /> 2026 Verified Leaderboard
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Top Rated Broker Rankings
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Scientifically tested for spreads, latency, license validity, and payout execution.
              </p>
            </div>

            <Link to="/rankings">
              <Button variant="outline" className="font-semibold text-xs rounded-xl gap-1">
                View All 50+ Ranked Brokers <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Leaderboard Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {[
              { id: "top-rated", label: "⭐ Best Overall" },
              { id: "best-forex", label: "📈 Lowest Raw Spreads" },
              { id: "safest", label: "🛡️ Safest (Tier-1)" },
              { id: "low-deposit", label: "💰 Low Deposit ($5-$10)" },
              { id: "prop-firms", label: "👑 Top Prop Firms" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLeaderboardTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  leaderboardTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Leaderboard Table & Cards */}
          <div className="space-y-3">
            {leaderboardBrokers.map((broker, idx) => (
              <div
                key={broker.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all gap-4"
              >
                {/* Left: Rank & Broker Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-xl sm:text-2xl font-black w-8 text-center text-muted-foreground shrink-0">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                  </div>

                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-base shrink-0">
                    {broker.logo}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/broker/${broker.id}`} className="font-bold text-base text-foreground hover:text-primary transition-colors">
                        {broker.name}
                      </Link>
                      <Badge variant="outline" className="text-[10px] py-0 h-4 text-emerald-500 border-emerald-500/30">
                        {broker.regulatoryStatus}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {broker.countryFlag} {broker.headquarters}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                      <span>Licenses: <strong className="text-foreground">{broker.regulators.join(", ")}</strong></span>
                      <span>•</span>
                      <span>Min Dep: <strong className="text-foreground">${broker.minDeposit}</strong></span>
                      <span>•</span>
                      <span>Spread: <strong className="text-emerald-500">{broker.eurUsdSpread}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Score & CTAs */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
                  <div className="text-left md:text-right">
                    <div className="inline-flex items-center gap-1 text-sm font-black text-emerald-500">
                      <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      {broker.overallScore}
                      <span className="text-xs font-normal text-muted-foreground">/10</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {broker.reviewsCount} verified reviews
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/broker/${broker.id}`}>
                      <Button size="sm" variant="outline" className="text-xs font-semibold rounded-lg h-9">
                        Review
                      </Button>
                    </Link>
                    <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="text-xs font-semibold rounded-lg h-9 gap-1 bg-gradient-to-r from-primary to-cyan-600">
                        Visit Site <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Four-Pillar Verification Process ("Check Before You Trade") */}
        <section className="rounded-3xl bg-gradient-to-b from-primary/5 via-card to-card border p-8 md:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30 mb-3 bg-primary/10">
              VTINDEX Shield™ Methodology
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground mb-3">
              How We Verify & Audit Every Broker
            </h2>
            <p className="text-sm text-muted-foreground">
              We execute real deposits, audit financial licenses directly with government registers, and monitor trader complaints 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              {
                step: "01",
                icon: ShieldCheck,
                title: "Regulatory License Audit",
                desc: "We verify license status directly on official FCA, ASIC, and CySEC registers to eliminate clone scams.",
              },
              {
                step: "02",
                icon: Lock,
                title: "Fund Segregation Check",
                desc: "Confirming client funds are held in Tier-1 custodian banks with negative balance protection enabled.",
              },
              {
                step: "03",
                icon: ShieldAlert,
                title: "Live Exposure & Complaints",
                desc: "Real-time trader dispute tracking and mediation to identify withdrawal freezes before they spread.",
              },
              {
                step: "04",
                icon: Zap,
                title: "Execution & Spread Testing",
                desc: "Live testing server latency, slippage during high-impact news, and hidden fee transparency.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-6 rounded-2xl bg-card border shadow-xs text-center relative group hover:border-primary transition-all"
              >
                <div className="absolute top-4 right-4 font-mono font-bold text-xs text-muted-foreground/50">
                  {step.step}
                </div>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Interactive Head-to-Head Broker Comparison Widget */}
        <section className="rounded-3xl bg-muted/30 border p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
              <Scale className="h-4 w-4" /> Head-to-Head Matchup
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
              Compare Two Brokers Side-by-Side
            </h2>
            <p className="text-sm text-muted-foreground">
              Instantly compare spreads, regulation, leverage, and deposit minimums to make the right choice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {/* Broker A Selector Card */}
            <Card className="p-6 border-2 border-primary/20">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Broker A
              </div>
              <select
                value={compareBrokerA}
                onChange={(e) => setCompareBrokerA(e.target.value)}
                className="w-full h-12 rounded-xl bg-background border border-input px-3 text-sm font-bold text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {RANKED_BROKERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.regulatoryStatus})
                  </option>
                ))}
              </select>

              <div className="space-y-2 text-xs pt-2 border-t">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Trust Score:</span>
                  <span className="font-bold text-emerald-500">{brokerAData.overallScore}/10</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">EUR/USD Spread:</span>
                  <span className="font-bold">{brokerAData.eurUsdSpread}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Min Deposit:</span>
                  <span className="font-bold">${brokerAData.minDeposit}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Max Leverage:</span>
                  <span className="font-bold">{brokerAData.maxLeverage}</span>
                </div>
              </div>
            </Card>

            {/* Broker B Selector Card */}
            <Card className="p-6 border-2 border-cyan-500/20">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Broker B
              </div>
              <select
                value={compareBrokerB}
                onChange={(e) => setCompareBrokerB(e.target.value)}
                className="w-full h-12 rounded-xl bg-background border border-input px-3 text-sm font-bold text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {RANKED_BROKERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.regulatoryStatus})
                  </option>
                ))}
              </select>

              <div className="space-y-2 text-xs pt-2 border-t">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Trust Score:</span>
                  <span className="font-bold text-emerald-500">{brokerBData.overallScore}/10</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">EUR/USD Spread:</span>
                  <span className="font-bold">{brokerBData.eurUsdSpread}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Min Deposit:</span>
                  <span className="font-bold">${brokerBData.minDeposit}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Max Leverage:</span>
                  <span className="font-bold">{brokerBData.maxLeverage}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Link to={`/compare`}>
              <Button size="lg" className="h-12 px-8 font-bold text-sm rounded-xl shadow-md bg-gradient-to-r from-primary to-cyan-600">
                Launch Full Head-to-Head Comparison <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* 7. Live Trader Complaints & Scam Warnings Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Recent Complaints */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  Recent Trader Exposure & Complaints
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real community disputes monitored for mediation
                </p>
              </div>
              <Link to="/news?category=Regulation+%26+Alerts">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  issue: "Withdrawal Delay over 14 Days",
                  broker: "QuantumFX Capital",
                  amount: "$3,450",
                  status: "Under Investigation",
                  statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
                  time: "3 hours ago",
                },
                {
                  issue: "Unauthorized Account Leverage Reduction",
                  broker: "FastTrade Global",
                  amount: "$1,200",
                  status: "Broker Responded",
                  statusColor: "text-sky-500 bg-sky-500/10 border-sky-500/20",
                  time: "1 day ago",
                },
                {
                  issue: "Disputed Stop-Out on Gold Flash Spike",
                  broker: "Apex Trade",
                  amount: "$8,900",
                  status: "Resolved & Refunded",
                  statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                  time: "2 days ago",
                },
              ].map((comp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-card border hover:border-border transition-colors flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-foreground">{comp.issue}</div>
                    <div className="text-xs text-muted-foreground">
                      Target: <strong className="text-foreground">{comp.broker}</strong> • Disputed: <strong className="text-foreground">{comp.amount}</strong>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{comp.time}</div>
                  </div>

                  <Badge variant="outline" className={`text-xs font-semibold ${comp.statusColor}`}>
                    {comp.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Official Regulatory Blacklist */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                  Official Regulatory Blacklist Alerts
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest warnings issued by FCA, ASIC, and SEC
                </p>
              </div>
              <Link to="/news">
                <Button variant="ghost" size="sm" className="text-xs">
                  Alerts Feed
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {REGULATORY_WARNINGS.slice(0, 3).map((warn) => (
                <div
                  key={warn.id}
                  className="p-4 rounded-xl bg-card border-l-4 border-l-rose-500 border hover:border-border transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                      <span>{warn.flag}</span>
                      <span>{warn.regulator} Warning:</span>
                      <span className="text-rose-500">{warn.brokerName}</span>
                    </div>
                    <Badge variant="destructive" className="text-[10px]">
                      {warn.warningType}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{warn.details}</p>
                  <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1">
                    <span>Domain: <code className="text-foreground">{warn.domain}</code></span>
                    <span>{warn.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Verified Trader Community Reviews */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Users className="h-3.5 w-3.5" /> Community Sentiment
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Verified Trader Reviews
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real feedback from active traders sharing withdrawal and platform experience.
              </p>
            </div>

            <Link to="/search">
              <Button variant="outline" className="font-semibold text-xs rounded-xl">
                Browse All Reviews
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                user: "Alexandre Moreau",
                avatar: "AM",
                country: "🇫🇷 France",
                broker: "IC Markets",
                rating: 5,
                date: "Yesterday",
                comment:
                  "Raw spreads on EUR/USD and gold are consistently 0.0-0.1 pips. CTrader execution is under 35ms. Withdrew $8,200 to my bank account in less than 3 hours.",
                helpful: 42,
              },
              {
                user: "Sarah Jenkins",
                avatar: "SJ",
                country: "🇬🇧 UK",
                broker: "Exness",
                rating: 5,
                date: "3 days ago",
                comment:
                  "Automated withdrawals are genuinely instant on weekends. Zero swap fees on major crypto pairs saved me a fortune on swing trades. Customer support answered in 1 minute.",
                helpful: 29,
              },
              {
                user: "Rajesh Sharma",
                avatar: "RS",
                country: "🇦🇺 Australia",
                broker: "Pepperstone",
                rating: 4.8,
                date: "5 days ago",
                comment:
                  "Direct TradingView chart trading is seamless. Tier-1 ASIC regulation gives full peace of mind for high-capital accounts. Highly recommended for day trading.",
                helpful: 35,
              },
            ].map((review, i) => (
              <Card key={i} className="p-6 flex flex-col justify-between bg-card hover:border-primary/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          {review.user}
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <div className="text-xs text-muted-foreground">{review.country}</div>
                      </div>
                    </div>

                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-primary mb-2">
                    Review for: <strong className="text-foreground">{review.broker}</strong>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed italic mb-4">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
                  <span>{review.date}</span>
                  <button className="flex items-center gap-1 hover:text-foreground font-semibold">
                    <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful})
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 9. Latest Financial News & Trader Education Center */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Latest News Feed */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Latest Market News & Intelligence
              </h3>
              <Link to="/news">
                <Button variant="ghost" size="sm" className="text-xs font-semibold">
                  View All News <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {NEWS_ARTICLES.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  to={`/news?article=${article.slug}`}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 transition-colors group"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full sm:w-36 h-28 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-semibold text-primary">
                          {article.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{article.publishedAt}</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {article.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Educational Guides */}
          <div className="lg:col-span-5 space-y-6">
            <div className="pb-3 border-b">
              <h3 className="text-xl font-bold text-foreground">
                Trader Education & Protection
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Essential guides to safeguard your trading capital
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "How to Verify an ASIC / FCA License Number",
                  desc: "Step-by-step guide to verifying official register databases and avoiding clone websites.",
                  tag: "Safety Guide",
                },
                {
                  title: "ECN vs. STP vs. Market Maker Brokers",
                  desc: "Understanding execution models, dealing desks, and raw spread commission structures.",
                  tag: "Execution",
                },
                {
                  title: "Top 5 Red Flags in Prop Trading Contracts",
                  desc: "Hidden drawdown calculation tricks, payout delay clauses, and slippage rules.",
                  tag: "Prop Firms",
                },
                {
                  title: "Negative Balance Protection Explained",
                  desc: "Why Tier-1 regulation prevents you from losing more capital than your deposit.",
                  tag: "Risk Management",
                },
              ].map((guide, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card border hover:border-primary/40 cursor-pointer transition-colors space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      {guide.tag}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{guide.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. High Conversion Final CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-primary via-cyan-600 to-slate-900 text-white p-8 md:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              100% Free • Independent • Unbiased
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Don't Risk Your Capital. <br />
              Verify Before You Trade.
            </h2>

            <p className="text-white/85 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Join over 250,000 active retail and institutional traders who check VTINDEX before depositing with any broker.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/search">
                <Button size="lg" variant="secondary" className="h-13 px-8 text-sm font-bold rounded-xl shadow-lg w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" /> Verify Any Broker Now
                </Button>
              </Link>
              <Link to="/rankings">
                <Button size="lg" variant="outline" className="h-13 px-8 text-sm font-bold rounded-xl bg-white/10 hover:bg-white hover:text-slate-900 text-white border-white/30 w-full sm:w-auto">
                  Explore Top 2026 Rankings
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

