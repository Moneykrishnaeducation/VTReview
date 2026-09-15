import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  ShieldCheck,
  Sparkles,
  Scale,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Building,
  Award,
  Zap,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Calculator,
} from "lucide-react";
import { BROKERS, type Broker } from "@/data/broker-directory-data";
import { BrokerResultCard, UxAnnotation } from "@/components/ui/wireframe-components";
import { useComparison } from "@/lib/comparison-context";

export default function Home() {
  const [heroSearch, setHeroSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [compareBrokerA, setCompareBrokerA] = useState("pepperstone");
  const [compareBrokerB, setCompareBrokerB] = useState("ic-markets");
  const { addBroker } = useComparison();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/brokers?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/brokers");
    }
  };

  const handleLaunchCompare = () => {
    addBroker(compareBrokerA);
    addBroker(compareBrokerB);
    navigate("/compare");
  };

  const topBrokers = BROKERS.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 1.0 HERO SECTION */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 md:py-16 px-4">
        <div className="max-w-[1240px] mx-auto">
          <UxAnnotation tag="SCREEN 01 — HERO WIREFRAME">
            Hero immediately positions the platform as an <strong>Independent Research & Verification Authority</strong> rather than a promotional affiliate wall or trading terminal. Clear dual entry: Search/Filter for experienced traders, 60-second Finder Wizard for beginners.
          </UxAnnotation>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>INDEPENDENT FOREX RESEARCH & VERIFICATION PLATFORM</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Find the Safest, Lowest-Cost Broker for Your Trading Style
            </h1>

            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Objective ratings, real live account spread testing, and direct regulatory registry audits across 140+ international forex and CFD brokers.
            </p>

            {/* Large Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-5">
              <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-md">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search by broker name, license number (e.g. FCA 583261), or platform..."
                    className="w-full pl-10 pr-3 py-2.5 text-xs md:text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs md:text-sm font-bold rounded-md transition-colors"
                >
                  Search Directory
                </button>
              </div>
            </form>

            {/* Filter Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-400">Quick Filters:</span>
              <Link
                to="/brokers?reg=tier1"
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                🛡️ FCA Regulated
              </Link>
              <Link
                to="/brokers?spread=raw"
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                ⚡ Raw ECN Spreads
              </Link>
              <Link
                to="/brokers?platform=tradingview"
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 font-medium transition-colors text-blue-600 dark:text-blue-400"
              >
                📊 TradingView
              </Link>
              <Link
                to="/brokers?deposit=zero"
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                🔰 $0 Min Deposit
              </Link>
              <Link
                to="/brokers?style=scalping"
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                🎯 Scalping / EA
              </Link>
            </div>
          </div>

          {/* Guided Finder Banner */}
          <div className="mt-10 p-5 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-amber-400 text-slate-900 rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base">Unsure which broker suits your strategy?</h3>
                <p className="text-xs text-slate-300">
                  Take our 60-Second Guided Finder Wizard to receive unbiased algorithmic matches.
                </p>
              </div>
            </div>
            <Link
              to="/tools/broker-finder"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-lg transition-colors shrink-0"
            >
              <span>Launch Broker Finder Wizard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2.0 EDITORIAL SPOTLIGHT: TOP RATED BROKERS 2026 */}
      <section className="max-w-[1240px] mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              Editorial Benchmark
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Top Rated Forex Brokers (2026 Audit)
            </h2>
          </div>
          <Link
            to="/best-brokers/overall"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Ranked Leaderboard (Top 10)</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      <Link to={`/brokers/${broker.slug}`} className="hover:text-blue-600 transition-colors">{broker.name}</Link>
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                      <ShieldCheck className="h-3 w-3" />
                      {broker.primaryLicense}
                    </span>
                  </div>
                  <div className="text-right bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">★ {broker.editorialRating}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">{broker.editorialClass}</span>
                  </div>
                </div>

                {/* Specs Box */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 text-xs space-y-1.5 mb-3 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">EUR/USD:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{broker.eurUsdSpread} pips</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min Deposit:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{broker.minDepositFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Commission:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">${broker.commissionPerLot.toFixed(2)}/lot</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platforms:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                      {broker.platforms.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                    {broker.categoryBadges[0]}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <Link
                  to={`/brokers/${broker.slug}`}
                  className="block w-full text-center py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Read In-Depth Review
                </Link>
                <a
                  href={broker.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-lg shadow-xs transition-colors"
                >
                  Visit Broker ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.0 INTERACTIVE COMPARISON PREVIEW */}
      <section className="bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-12 px-4">
        <div className="max-w-[1240px] mx-auto">
          <UxAnnotation tag="SCREEN 01 — QUICK HEAD-TO-HEAD COMPARISON WIDGET">
            Direct interactive on-page comparison selector allowing users to immediately trigger the Side-by-Side Comparison engine from the homepage.
          </UxAnnotation>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                Head-to-Head Research
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                Compare Any Two Brokers Side-by-Side
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Evaluate exact audited spreads, regulatory license tiers, platform compatibility, and hidden inactivity fees in seconds.
              </p>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Highlight meaningful cost & regulation differences</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Supports up to 4 brokers simultaneously</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center mb-5">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Broker 1
                  </label>
                  <select
                    value={compareBrokerA}
                    onChange={(e) => setCompareBrokerA(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-xs font-bold"
                  >
                    {BROKERS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (★{b.editorialRating})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1 text-center font-black text-slate-400 text-sm">
                  VS
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Broker 2
                  </label>
                  <select
                    value={compareBrokerB}
                    onChange={(e) => setCompareBrokerB(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-xs font-bold"
                  >
                    {BROKERS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (★{b.editorialRating})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">
                  Popular: <span className="underline cursor-pointer" onClick={() => { setCompareBrokerA("pepperstone"); setCompareBrokerB("ic-markets"); }}>Pepperstone vs IC Markets</span>, <span className="underline cursor-pointer" onClick={() => { setCompareBrokerA("ig"); setCompareBrokerB("xm"); }}>IG vs XM</span>
                </div>
                <button
                  onClick={handleLaunchCompare}
                  className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Scale className="h-4 w-4" />
                  <span>Launch Side-by-Side Comparison →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.0 WHY TRUST OUR RESEARCH: THE INDEPENDENT EVALUATION FRAMEWORK */}
      <section className="max-w-[1240px] mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
            Trust & Methodology
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">
            Why Trust Our Research Framework
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            We operate strict editorial independence. Ratings are computed algorithmically from 120+ audited data points.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg">
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Tier-1 Regulation Check
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct API license status validation with FCA (UK), ASIC (Australia), and CySEC registries. We verify segregated client bank accounts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg">
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Live Account Testing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We deposit real capital to measure real-money execution speed, slippage on volatile news, and exact withdrawal turnaround times.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg">
            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center mb-3">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Audited Real Spreads
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We record real tick data to calculate total all-in trading costs per lot (spread + commission + rollover swap rates), not marketing slogans.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg">
            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-3">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              100% Unbiased Verdict
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rankings cannot be purchased. Commercial partnerships never alter our mathematical rating formulas or factual editorial conclusions.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/how-we-rate"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Read Our Complete 120-Point Rating Methodology Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
