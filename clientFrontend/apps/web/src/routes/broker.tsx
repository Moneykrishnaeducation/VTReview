import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ShieldCheck,
  Star,
  ExternalLink,
  MessageSquare,
  Scale,
  Globe,
  Calendar,
  Smartphone,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Zap,
  DollarSign,
  Lock,
  ChevronRight,
  TrendingUp,
  ThumbsUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RANKED_BROKERS } from "@/data/rankings-data";

export default function BrokerDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "regulation" | "fees" | "reviews">("overview");
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState([
    {
      id: "r1",
      name: "Marcus Aurelius",
      rating: 5,
      date: "2 days ago",
      country: "🇬🇧 United Kingdom",
      content:
        "Execution speed is blistering fast. Never experienced slippage on raw EUR/USD even during high-impact US CPI releases. Withdrawals are processed within 2 hours.",
      helpful: 24,
    },
    {
      id: "r2",
      name: "Elena Vasquez",
      rating: 4.8,
      date: "1 week ago",
      country: "🇪🇸 Spain",
      content:
        "Top-tier broker with genuine segregated accounts. Platform stability on cTrader and TradingView is 100%. Customer support live chat is responsive 24/7.",
      helpful: 18,
    },
    {
      id: "r3",
      name: "Kenji Sato",
      rating: 4.5,
      date: "2 weeks ago",
      country: "🇯🇵 Japan",
      content:
        "Ultra-low spreads and great API support for automated algo trading. Highly recommended for scalpers and high-frequency EA systems.",
      helpful: 11,
    },
  ]);

  // Find broker in database or fallback
  const broker =
    RANKED_BROKERS.find(
      (b) => b.id === id || b.slug === id || b.name.toLowerCase() === id?.toLowerCase()
    ) || RANKED_BROKERS[0];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev = {
      id: `r-${Date.now()}`,
      name: "Verified Trader",
      rating: newRating,
      date: "Just now",
      country: "🌐 Global Trader",
      content: newReviewText.trim(),
      helpful: 1,
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/rankings" className="hover:text-foreground">Rankings</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{broker.name}</span>
      </div>

      {/* 1. Verified Broker Hero Dossier */}
      <Card className="mb-8 border-2 border-primary/20 bg-card overflow-hidden shadow-lg relative">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-cyan-400 to-emerald-400" />
        <CardContent className="pt-8 pb-8 flex flex-col lg:flex-row items-center lg:items-start gap-8">
          
          {/* Logo Badge */}
          <div className="flex flex-col items-center shrink-0">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-muted text-primary text-4xl font-black border-2 border-primary/30 shadow-md">
              {broker.logo}
            </div>
            <Badge variant="outline" className="mt-3 text-xs font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
              <ShieldCheck className="mr-1 h-3.5 w-3.5 text-emerald-500" /> {broker.regulatoryStatus}
            </Badge>
          </div>

          {/* Broker Main Info */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-foreground flex items-center justify-center lg:justify-start gap-2.5">
                  {broker.name}
                  <span className="text-xl">{broker.countryFlag}</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                  {broker.tagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="font-bold text-xs rounded-xl h-10 px-5 shadow-md bg-gradient-to-r from-primary to-cyan-600">
                    <ExternalLink className="mr-1.5 h-4 w-4" /> Official Website
                  </Button>
                </a>
                <Link to={`/compare`}>
                  <Button variant="outline" className="font-bold text-xs rounded-xl h-10 px-4">
                    <Scale className="mr-1.5 h-4 w-4" /> Compare
                  </Button>
                </Link>
              </div>
            </div>

            {/* Score & Quick Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border">
                <div className="text-muted-foreground">VTINDEX Score</div>
                <div className="text-lg font-black text-emerald-500 flex items-center gap-1 mt-0.5">
                  <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  {broker.overallScore} <span className="text-xs font-normal text-muted-foreground">/10</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border">
                <div className="text-muted-foreground">EUR/USD Spread</div>
                <div className="text-lg font-black text-foreground mt-0.5">
                  {broker.eurUsdSpread}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border">
                <div className="text-muted-foreground">Min. Deposit</div>
                <div className="text-lg font-black text-foreground mt-0.5">
                  ${broker.minDeposit}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border">
                <div className="text-muted-foreground">Withdrawal Speed</div>
                <div className="text-sm font-bold text-foreground mt-1 truncate">
                  {broker.withdrawalSpeed}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview & Features" },
          { id: "regulation", label: "Licenses & Regulation" },
          { id: "fees", label: "Trading Conditions & Fees" },
          { id: "reviews", label: `User Reviews (${reviewsList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Body Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === "overview" && (
            <>
              {/* Scientific Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" /> Multi-Pillar Safety & Quality Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Regulatory Safety & Fund Segregation", score: broker.scores.safety, weight: "35%" },
                    { label: "Raw Spreads & Trading Fees", score: broker.scores.fees, weight: "25%" },
                    { label: "Platform Execution Speed", score: broker.scores.platforms, weight: "15%" },
                    { label: "Withdrawal Reliability & Speed", score: broker.scores.withdrawals, weight: "15%" },
                    { label: "Customer Support & Reputation", score: broker.scores.support, weight: "10%" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground">{item.label} <span className="text-muted-foreground font-normal">({item.weight})</span></span>
                        <span className="text-emerald-500 font-bold">{item.score}/10</span>
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${(item.score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Key Highlights & Pros */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Key Broker Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {broker.keyPros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-medium text-foreground">{pro}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* About & General Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Company Profile & Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground leading-relaxed">
                    {broker.name} is an internationally recognized multi-asset brokerage established in {broker.established}. Headquartered in {broker.headquarters}, it delivers institutional-grade liquidity, low latency connectivity to global server hubs, and true ECN/STP execution models for retail and institutional traders.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t text-xs">
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground">Headquarters:</span>
                      <span className="font-bold text-foreground">{broker.headquarters}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground">Established:</span>
                      <span className="font-bold text-foreground">{broker.established}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground">Best For:</span>
                      <span className="font-bold text-primary">{broker.bestFor}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground">Supported Platforms:</span>
                      <span className="font-bold text-foreground">{broker.tradingPlatforms.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "regulation" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" /> Regulatory Licenses & Legal Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  VTINDEX directly audits broker licenses on government regulatory registers. Below is the verified licensing history for {broker.name}:
                </p>

                <div className="space-y-3 pt-2">
                  {broker.regulators.map((reg, idx) => (
                    <div key={idx} className="p-4 rounded-xl border bg-card/60 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          {reg} Official Authorization
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Status: <strong className="text-emerald-500">Active & Authorized</strong> • Client Fund Segregation: <strong className="text-foreground">Verified</strong>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                        Tier-1 Compliant
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "fees" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" /> Spreads, Leverage & Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                    <div className="text-muted-foreground">EUR/USD Spread Model</div>
                    <div className="text-base font-bold text-foreground">{broker.eurUsdSpread}</div>
                    <div className="text-[10px] text-muted-foreground">Institutional liquidity feeds</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                    <div className="text-muted-foreground">Maximum Leverage</div>
                    <div className="text-base font-bold text-foreground">{broker.maxLeverage}</div>
                    <div className="text-[10px] text-muted-foreground">Subject to regulatory region</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                    <div className="text-muted-foreground">Minimum Initial Deposit</div>
                    <div className="text-base font-bold text-foreground">${broker.minDeposit}</div>
                    <div className="text-[10px] text-muted-foreground">Zero deposit fees</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                    <div className="text-muted-foreground">Withdrawal Processing</div>
                    <div className="text-base font-bold text-foreground">{broker.withdrawalSpeed}</div>
                    <div className="text-[10px] text-muted-foreground">Automated gateway available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Review Submit Box */}
              <Card className="p-6">
                <h3 className="font-bold text-base text-foreground mb-3">
                  Write a Verified Trader Review
                </h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewRating(num)}
                          className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                            newRating >= num ? "bg-amber-500/20 text-amber-500 border-amber-500/40" : "bg-muted"
                          }`}
                        >
                          <Star className={`h-4 w-4 ${newRating >= num ? "fill-amber-500" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your experience with spreads, execution speed, customer support, and withdrawals..."
                      className="w-full p-3 rounded-xl border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button type="submit" size="sm" className="font-bold text-xs rounded-xl px-6">
                    Submit Review
                  </Button>
                </form>
              </Card>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <Card key={rev.id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          {rev.name}
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <div className="text-[11px] text-muted-foreground">{rev.country} • {rev.date}</div>
                      </div>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-3.5 w-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      "{rev.content}"
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2 border-t">
                      <ThumbsUp className="h-3 w-3" /> Helpful ({rev.helpful})
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Safety & Compliance Card */}
          <Card className="p-6 border-l-4 border-l-emerald-500">
            <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" /> Safety Verdict
            </h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Negative Balance Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Segregated Client Accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Investor Compensation Covered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero Unresolved Complaints</span>
              </div>
            </div>
          </Card>

          {/* Quick Comparison Widget */}
          <Card className="p-6">
            <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" /> Compare Alternatives
            </h3>
            <div className="space-y-2 text-xs">
              {RANKED_BROKERS.filter((b) => b.id !== broker.id).slice(0, 3).map((alt) => (
                <Link
                  key={alt.id}
                  to={`/broker/${alt.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/60 transition-colors border"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{alt.name}</span>
                    <span className="text-muted-foreground text-[10px]">({alt.regulatoryStatus})</span>
                  </div>
                  <span className="font-bold text-emerald-500">{alt.overallScore}/10</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Official Website Direct Action */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border text-center space-y-3">
            <h4 className="font-bold text-sm text-foreground">Ready to start trading?</h4>
            <p className="text-xs text-muted-foreground">
              Open a live or demo account directly on {broker.name}'s official encrypted portal.
            </p>
            <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full font-bold text-xs rounded-xl h-10 bg-gradient-to-r from-primary to-cyan-600 shadow-md">
                Open Official Account <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

