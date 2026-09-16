import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Scale,
  Calendar,
  Building,
  MapPin,
  Clock,
  Layers,
  Award,
  Zap,
  TrendingDown,
  ChevronRight,
  Info,
  ThumbsUp,
  Flag,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { BROKERS, type Broker } from "@/data/broker-directory-data";
import {
  RatingBreakdownBars,
  ProsConsGrid,
  FaqAccordion,
  UxAnnotation,
  ScoreCardDual,
  TrustBadge,
  SampleDataNotice,
} from "@/components/ui/wireframe-components";
import { useComparison } from "@/lib/comparison-context";

export default function BrokerReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isBrokerSelected, addBroker, removeBroker } = useComparison();

  const broker: Broker = BROKERS.find((b) => b.slug === id || b.id === id) || BROKERS[0];
  const selected = isBrokerSelected(broker.id);

  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 03 — BROKER REVIEW (BENCHMARK DESIGN SYSTEM TEMPLATE)">
          The core institutional evaluation benchmark. <strong>8:4 desktop split</strong> with a sticky research summary sidebar. Strictly separates editorial scoring from user ratings, and features verified regulatory registers, audited real spreads, and independent evidence.
        </UxAnnotation>

        {/* Breadcrumb Navigation */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link to="/brokers" className="hover:underline">Brokers</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{broker.name} Review</span>
        </div>

        {/* 1.0 ABOVE THE FOLD: BROKER SUMMARY & AUDIT BADGE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Identity & Badges */}
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-1 shrink-0 shadow-xs">
                <Building className="h-6 w-6 text-slate-600 mb-0.5" />
                <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
                  {broker.logoText.split(" ")[0]}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {broker.name} Review
                  </h1>
                  <TrustBadge variant="verified" label={`Verified License ${broker.primaryLicense}`} />
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> HQ: {broker.hq}
                  </span>
                  <span>•</span>
                  <span>Founded: {broker.founded}</span>
                  <span>•</span>
                  <span>Parent: {broker.parentCompany}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Last Fact-Checked: {broker.factCheckedDate}
                  </span>
                </div>

                {/* Trust Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
                  <TrustBadge variant="tier1" label="Triple Tier-1 Regulated" />
                  <TrustBadge variant="tested" label={`Audited Real Spreads (${broker.eurUsdSpread} p)`} />
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md font-medium">
                    🔬 Live Account Tested
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Explicit DUAL SCORE Presentation & Direct CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
              <ScoreCardDual
                editorialRating={broker.editorialRating}
                editorialClass={broker.editorialClass}
                userRating={broker.userRating}
                reviewCount={broker.reviewCount}
              />

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (selected) removeBroker(broker.id);
                    else addBroker(broker.id);
                  }}
                  className={`px-3.5 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selected
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>{selected ? "✓ Added to Compare" : "+ Add to Compare"}</span>
                </button>

                <a
                  href={broker.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Verified Account</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Mandatory Risk Warning Banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <strong>Risk Warning:</strong> 74% to 82% of retail investor accounts lose money when trading CFDs with this provider. Consider whether you understand how CFDs work before investing capital.
          </div>
        </div>

        {/* 2.0 QUICK SPECS MATRIX (6-Column Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
          <div className="border-r last:border-r-0 border-slate-100 dark:border-slate-800 pr-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Min Deposit</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">{broker.minDepositFormatted}</span>
            <span className="text-[10px] text-slate-500 block">Zero Funding Fees</span>
          </div>

          <div className="border-r last:border-r-0 border-slate-100 dark:border-slate-800 pr-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">EUR/USD Spread</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">{broker.eurUsdSpread} pips</span>
            <span className="text-[10px] text-slate-500 block">Raw ECN Spread</span>
          </div>

          <div className="border-r last:border-r-0 border-slate-100 dark:border-slate-800 pr-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Commission</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">${broker.commissionPerLot.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 block">Per Lot / Side</span>
          </div>

          <div className="border-r last:border-r-0 border-slate-100 dark:border-slate-800 pr-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Leverage</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">{broker.maxLeverageRetail}</span>
            <span className="text-[10px] text-slate-500 block">Pro: {broker.maxLeveragePro}</span>
          </div>

          <div className="border-r last:border-r-0 border-slate-100 dark:border-slate-800 pr-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Platforms</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100 truncate block">
              {broker.platforms.join(", ")}
            </span>
            <span className="text-[10px] text-blue-600 font-medium block">TradingView Sync</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tradable Mkts</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">{broker.tradableMarketsCount}+</span>
            <span className="text-[10px] text-slate-500 block">FX, Indices, Metals</span>
          </div>
        </div>

        {/* 3.0 IN-PAGE STICKY NAVIGATION */}
        <div className="sticky top-[78px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 rounded-md shadow-xs mb-6 overflow-x-auto">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
            <button
              onClick={() => scrollToSection("verdict")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "verdict" ? "text-blue-600" : ""}`}
            >
              Editorial Verdict
            </button>
            <button
              onClick={() => scrollToSection("ratings")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "ratings" ? "text-blue-600" : ""}`}
            >
              Rating Breakdown
            </button>
            <button
              onClick={() => scrollToSection("regulation")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "regulation" ? "text-blue-600" : ""}`}
            >
              Regulation Audit
            </button>
            <button
              onClick={() => scrollToSection("costs")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "costs" ? "text-blue-600" : ""}`}
            >
              Trading Costs & Spreads
            </button>
            <button
              onClick={() => scrollToSection("platforms")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "platforms" ? "text-blue-600" : ""}`}
            >
              Platforms & Execution
            </button>
            <button
              onClick={() => scrollToSection("accounts")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "accounts" ? "text-blue-600" : ""}`}
            >
              Account Types
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "reviews" ? "text-blue-600" : ""}`}
            >
              User Reviews ({broker.reviewCount})
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${activeSection === "faq" ? "text-blue-600" : ""}`}
            >
              FAQ
            </button>
          </div>
        </div>

        {/* 4.0 MAIN CONTENT (8-Cols) + STICKY SIDEBAR (4-Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN EVALUATION SECTIONS (8-Cols) */}
          <main className="lg:col-span-8 space-y-8">
            {/* 4.1 EDITORIAL VERDICT */}
            <section id="verdict" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Our Independent Editorial Assessment
                </h2>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                {broker.verdictSummary}
              </p>

              {/* Best For / Not Ideal For Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-2">
                    ✅ Best For
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {broker.bestForSummary.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-2">
                    ❌ Not Ideal For
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {broker.notIdealForSummary.map((n, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pros & Cons */}
              <ProsConsGrid pros={broker.pros} cons={broker.cons} />
            </section>

            {/* 4.2 RATING BREAKDOWN */}
            <section id="ratings" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Score Breakdown & Testing Metrics
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Our mathematical score algorithm evaluates 5 fundamental pillars weighted by trader impact.
              </p>
              <RatingBreakdownBars ratings={broker.ratingsBreakdown} />
            </section>

            {/* 4.3 REGULATION & SAFETY AUDIT */}
            <section id="regulation" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  1.0 Regulation & Safety Audit
                </h2>
                <span className="text-xs text-emerald-600 font-bold">100% Verified</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                We independently check active licensing status on official government registers rather than relying on broker marketing statements.
              </p>

              {/* Regulation Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800 rounded-lg">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Regulator</th>
                      <th className="p-3">Country</th>
                      <th className="p-3">License Number</th>
                      <th className="p-3">Entity Name</th>
                      <th className="p-3">Register Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {broker.regulations.map((reg) => (
                      <tr key={reg.licenseNumber} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                          {reg.regulator} (Tier-{reg.tier})
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{reg.jurisdiction}</td>
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          #{reg.licenseNumber}
                        </td>
                        <td className="p-3 text-slate-500">{reg.entityName}</td>
                        <td className="p-3">
                          <a
                            href={reg.registerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                          >
                            <span>✓ Verified Active</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Safety Safeguards Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Segregation</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">Tier-1 Barclays & NAB</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Negative Balance</span>
                  <span className="font-bold text-emerald-600">Yes (Retail Protected)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Compensation Fund</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">FSCS up to £85,000</span>
                </div>
              </div>
            </section>

            {/* 4.4 TRADING COSTS & SPREADS */}
            <section id="costs" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                2.0 Audited Trading Costs & Spread Matrix
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Real-time recorded average spreads across major currency pairs, metals, and crypto instruments.
              </p>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800 rounded-lg">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Asset / Pair</th>
                      <th className="p-3">Raw ECN Spread</th>
                      <th className="p-3">Standard Spread</th>
                      <th className="p-3">Commission (RT)</th>
                      <th className="p-3">All-In Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {broker.spreadsTable.map((s) => (
                      <tr key={s.pair} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{s.pair}</td>
                        <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{s.rawSpread}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{s.standardSpread}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{s.commission}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                          {s.pair === "EUR / USD" ? "0.7 p equivalent ($7/lot)" : "Competitive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                💡 <strong>Non-Trading Fees:</strong> Inactivity Fee: <strong>{broker.inactivityFee}</strong>. Deposit & Withdrawal Fee: <strong>$0 (Free)</strong>.
              </div>
            </section>

            {/* 4.5 PLATFORMS & EXECUTION */}
            <section id="platforms" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                3.0 Trading Platforms & Execution Infrastructure
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Execution Type</span>
                  <span className="font-bold text-slate-900 dark:text-white">{broker.executionModel}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Fill Latency</span>
                  <span className="font-bold text-emerald-600">{broker.executionSpeedMs}ms Average</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Positive Slippage</span>
                  <span className="font-bold text-slate-900 dark:text-white">{broker.slippagePositivePct}% of fills</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Server Hub</span>
                  <span className="font-bold text-slate-900 dark:text-white">Equinix LD4 / NY4</span>
                </div>
              </div>
            </section>

            {/* 4.6 ACCOUNT TYPES */}
            <section id="accounts" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                4.0 Account Types Comparison
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {broker.accountTypes.map((acc) => (
                  <div key={acc.name} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{acc.name}</h3>
                    <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span>Min Deposit:</span>
                        <strong className="text-slate-900 dark:text-white">{acc.minDeposit}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Spread From:</span>
                        <strong className="text-blue-600">{acc.spreadFrom}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Commission:</span>
                        <strong className="text-slate-900 dark:text-white">{acc.commission}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Suited For:</span>
                        <strong className="text-slate-900 dark:text-white">{acc.bestFor}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4.7 USER REVIEWS COMMUNITY */}
            <section id="reviews" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    5.0 Verified User Reviews ({broker.reviewCount})
                  </h2>
                  <p className="text-xs text-slate-500">
                    User ratings are calculated independently from our editorial score.
                  </p>
                </div>
                <Link
                  to="/reviews/write"
                  className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded hover:bg-slate-800"
                >
                  ✍️ Write a Review
                </Link>
              </div>

              {broker.userReviews.length > 0 ? (
                <div className="space-y-3">
                  {broker.userReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{rev.author}</span>
                          <span className="text-slate-400">({rev.country})</span>
                          {rev.verifiedLiveAccount && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                              ✓ Verified Live Account
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[11px]">{rev.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">"{rev.headline}"</h4>
                      <p className="text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">{rev.review}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span>Trading: {rev.experience}</span>
                        <span>•</span>
                        <span>Platform: {rev.platform}</span>
                        <span>•</span>
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <ThumbsUp className="h-3 w-3" /> Helpful ({rev.helpfulCount})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-500 rounded">
                  No community reviews submitted yet for this broker. Be the first to share your trading experience.
                </div>
              )}
            </section>

            {/* 4.8 FAQ */}
            <section id="faq" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                6.0 Frequently Asked Questions
              </h2>
              <FaqAccordion items={broker.faqs} />
            </section>
          </main>

          {/* STICKY RESEARCH SIDEBAR (4-Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-[140px] space-y-6">
              {/* Summary Widget */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  {broker.name} at a Glance
                </h3>

                <div className="space-y-2 mb-5">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Editorial Score:</span>
                    <strong className="text-slate-900 dark:text-white">★ {broker.editorialRating} / 5.0</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Trust Class:</span>
                    <strong className="text-emerald-600 font-bold">{broker.editorialClass}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Regulation:</span>
                    <strong className="text-slate-900 dark:text-white">FCA, ASIC, CySEC</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Min Deposit:</span>
                    <strong className="text-slate-900 dark:text-white">{broker.minDepositFormatted}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">EUR/USD Spread:</span>
                    <strong className="text-blue-600 font-bold">{broker.eurUsdSpread} pips</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Commission:</span>
                    <strong className="text-slate-900 dark:text-white">${broker.commissionPerLot.toFixed(2)}/lot</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={broker.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold rounded-md shadow-xs transition-colors"
                  >
                    Visit Official Broker Site ↗
                  </a>

                  <button
                    onClick={() => {
                      if (selected) removeBroker(broker.id);
                      else addBroker(broker.id);
                    }}
                    className="block w-full text-center py-2 border border-slate-300 dark:border-slate-700 rounded-md font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {selected ? "✓ Added to Comparison Tray" : "+ Add to Side-by-Side Compare"}
                  </button>
                </div>
              </div>

              {/* Similar Alternatives */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Similar Alternative Brokers
                </h3>
                <div className="space-y-3">
                  {BROKERS.filter((b) => b.id !== broker.id).slice(0, 2).map((alt) => (
                    <div key={alt.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{alt.name}</div>
                        <div className="text-[10px] text-slate-500">Spread: {alt.eurUsdSpread}p | ★{alt.editorialRating}</div>
                      </div>
                      <Link
                        to={`/brokers/${alt.slug}`}
                        className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold rounded-md hover:bg-slate-100 transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data Disclosure */}
              <SampleDataNotice />
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="font-extrabold text-xs text-slate-900 dark:text-white">{broker.name}</div>
          <div className="text-[10px] text-slate-500">★ {broker.editorialRating} • Spread: {broker.eurUsdSpread}p</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (selected) removeBroker(broker.id);
              else addBroker(broker.id);
            }}
            className="p-2 border rounded-md text-xs font-bold"
            title="Add to compare"
          >
            <Scale className="h-4 w-4" />
          </button>
          <a
            href={broker.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1"
          >
            <span>Visit Broker</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
