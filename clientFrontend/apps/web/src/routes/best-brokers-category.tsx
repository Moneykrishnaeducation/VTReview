import React from "react";
import { useParams, Link } from "react-router";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Scale,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { BROKERS, type Broker } from "@/data/broker-directory-data";
import { useComparison } from "@/lib/comparison-context";
import { FaqAccordion, UxAnnotation } from "@/components/ui/wireframe-components";

export default function BestBrokersCategory() {
  const { category = "beginners" } = useParams<{ category: string }>();
  const { isBrokerSelected, addBroker, removeBroker } = useComparison();

  const categoryTitles: Record<string, { title: string; subtitle: string; tag: string }> = {
    beginners: {
      title: "Best Forex Brokers for Beginners (2026 Edition)",
      subtitle:
        "Ranked on account opening simplicity, demo paper-trading quality, $0–$50 minimum deposits, and risk-management safeguards.",
      tag: "Beginner Friendly",
    },
    "low-spreads": {
      title: "Best Lowest Spread Forex Brokers (2026)",
      subtitle:
        "Audited true ECN and raw spread accounts with EUR/USD spreads from 0.0 pips and discounted commissions.",
      tag: "Raw ECN Spreads",
    },
    scalping: {
      title: "Best Forex Brokers for Scalping & High-Frequency Day Trading",
      subtitle:
        "Low-latency Equinix NY4/LD4 execution, zero restrictions on tick scalping, and minimal slippage.",
      tag: "Scalping & EAs",
    },
    tradingview: {
      title: "Best TradingView Forex Brokers (2026)",
      subtitle:
        "Brokers with direct, native TradingView chart execution, webhook automation, and Pine Script compatibility.",
      tag: "TradingView Integrated",
    },
    overall: {
      title: "Best Forex Brokers Overall (2026 Comprehensive Audit)",
      subtitle:
        "The highest-scoring multi-regulated brokerages evaluated across 120+ objective financial criteria.",
      tag: "Top Rated",
    },
  };

  const currentMeta = categoryTitles[category] || categoryTitles.beginners;
  const rankedBrokers = BROKERS.slice(0, 4);

  const beginnerFaqs = [
    {
      question: "How much money do I need to start trading forex as a beginner?",
      answer:
        "Most top-rated beginner brokers allow you to start with between $0 and $50. However, we recommend starting with a free, unlimited demo paper-trading account before risking real capital.",
    },
    {
      question: "Can I lose more money than I deposit with these brokers?",
      answer:
        "No. Under Tier-1 regulation (FCA in the UK, ASIC in Australia, and CySEC in Europe), brokers are legally required to provide Negative Balance Protection to retail clients, preventing you from going into debt.",
    },
    {
      question: "What is the difference between standard and raw ECN accounts for beginners?",
      answer:
        "Standard accounts charge no separate commission, incorporating the broker's fee entirely into a slightly wider spread (e.g. 0.8 pips). Raw ECN accounts charge near-zero spreads (0.0–0.1 pips) plus a fixed commission per trade ($3.00–$3.50 per lot). Standard accounts are often simpler for beginners to calculate.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 06 — BEST BROKERS CATEGORY TEMPLATE">
          Editorial ranking template designed to demonstrate objective selection criteria before presenting ranked leaderboards. Every broker ranking features explicit <strong>"Why Selected"</strong> commentary and pros/cons.
        </UxAnnotation>

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link to="/best-brokers/overall" className="hover:underline">Best Brokers</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentMeta.title}</span>
        </div>

        {/* Category Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            <Award className="h-4 w-4 text-amber-500" />
            <span>Editorial Ranking • Audited September 2026</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {currentMeta.title}
          </h1>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-6">
            {currentMeta.subtitle}
          </p>

          {/* Mandatory Baseline Qualifications */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Editorial Qualification Baseline:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Tier-1 Supervised (FCA, ASIC, or CySEC)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Mandatory Negative Balance Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Audited Spreads on Live Money Accounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* RANKED BROKER CARDS LIST */}
        <div className="space-y-6 mb-12">
          {rankedBrokers.map((broker, idx) => {
            const selected = isBrokerSelected(broker.id);
            return (
              <div
                key={broker.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs relative"
              >
                {/* Ranking Tag Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                        {idx === 0 ? "🏆 BEST OVERALL WINNER" : idx === 1 ? "🥈 RUNNER UP" : "HONORABLE MENTION"}
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        <Link to={`/brokers/${broker.slug}`} className="hover:underline">
                          {broker.name}
                        </Link>
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">★ {broker.editorialRating} / 5.0</span>
                    <span className="text-xs text-emerald-600 font-bold block">{broker.primaryLicense}</span>
                  </div>
                </div>

                {/* Why Selected Editorial Commentary */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-4 text-xs">
                  <strong className="text-slate-900 dark:text-white block mb-1">
                    Why {broker.name} was selected for this category:
                  </strong>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {broker.verdictSummary}
                  </p>
                </div>

                {/* 4-Column Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-3 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-100 dark:border-slate-800 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Min Deposit</span>
                    <strong>{broker.minDepositFormatted}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">EUR/USD Spread</span>
                    <strong>{broker.eurUsdSpread} pips</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Commission</span>
                    <strong>${broker.commissionPerLot.toFixed(2)}/lot</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Platforms</span>
                    <strong>{broker.platforms.slice(0, 2).join(", ")}</strong>
                  </div>
                </div>

                {/* Pros & Cons Micro Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-5">
                  <div className="p-3 bg-emerald-50/40 rounded border border-emerald-200">
                    <strong className="text-emerald-800 text-[11px] block mb-1">👍 Key Pros:</strong>
                    <ul className="space-y-1 text-slate-700">
                      {broker.pros.slice(0, 2).map((p, i) => (
                        <li key={i}>✓ {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-rose-50/40 rounded border border-rose-200">
                    <strong className="text-rose-800 text-[11px] block mb-1">👎 Key Limitation:</strong>
                    <p className="text-slate-700">{broker.cons[0]}</p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <label className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        if (e.target.checked) addBroker(broker.id);
                        else removeBroker(broker.id);
                      }}
                      className="rounded"
                    />
                    <span>{selected ? "✓ Added to Comparison" : "+ Add to Compare"}</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/brokers/${broker.slug}`}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded font-bold hover:bg-slate-50"
                    >
                      Read Full Review
                    </Link>
                    <a
                      href={broker.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded shadow-xs flex items-center gap-1.5"
                    >
                      <span>Visit Broker</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category FAQ Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={beginnerFaqs} />
        </div>
      </div>
    </div>
  );
}
