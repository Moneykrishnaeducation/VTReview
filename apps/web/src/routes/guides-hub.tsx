import React from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Calculator,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { BROKERS } from "@/data/broker-directory-data";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function GuidesHub() {
  const lowCostBrokers = BROKERS.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 09 — GUIDES & QUANTITATIVE EDITORIAL RESEARCH">
          Institutional research article template. Structured like an academic/financial whitepaper with Table of Contents, verified mathematical formulas, and contextual broker recommendation tables.
        </UxAnnotation>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link to="/guides/trading-costs" className="hover:underline">Guides</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Forex Trading Costs Explained</span>
        </div>

        {/* Article Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span>Quantitative Trading Guide</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Understanding All-In Forex Trading Costs: Spreads, Commissions & Swaps
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>By <strong>David Vance</strong>, Quantitative Research Analyst</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> Fact-Checked by Editorial Board
            </span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 8 min read
            </span>
          </div>
        </div>

        {/* 8:4 Grid Content & Sticky TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Body (8-Cols) */}
          <article className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2">
                1.0 The Real Friction in Every Forex Trade
              </h2>
              <p className="mb-3">
                When evaluating forex brokers, many retail traders make the costly mistake of looking solely at the advertised headline spread. In reality, total transaction cost represents a composite of four distinct friction components:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white">
                Total Trade Friction = (Spread Cost) + (Commission Fee) + (Slippage Differential) + (Overnight Swap Financing)
              </div>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2">
                2.0 Spread Models: Standard (No Commission) vs Raw ECN
              </h2>
              <p className="mb-3">
                Most brokers offer two primary pricing models. Understanding which model fits your trading frequency is essential for minimizing annual cost leakage.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700 rounded-lg">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Model</th>
                      <th className="p-3">EUR/USD Spread</th>
                      <th className="p-3">Commission</th>
                      <th className="p-3">Cost per Standard Lot (100k)</th>
                      <th className="p-3">Best Suited For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Raw ECN / Razor</td>
                      <td className="p-3 font-bold text-blue-600">0.1 pips ($1.00)</td>
                      <td className="p-3">$6.00 – $7.00 RT</td>
                      <td className="p-3 font-bold text-emerald-600">$7.00 – $8.00 total</td>
                      <td className="p-3">Scalpers, Day Traders, EAs</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Standard Account</td>
                      <td className="p-3">0.9 pips ($9.00)</td>
                      <td className="p-3">$0.00</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">$9.00 total</td>
                      <td className="p-3">Casual Swing Traders</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Embedded Live Calculator Preview Callout */}
            <div className="p-5 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl">
              <div className="flex items-center gap-2 mb-2 font-bold text-blue-900 dark:text-blue-200 text-sm">
                <Calculator className="h-5 w-5 text-blue-600" />
                <span>Calculate Your Trade Costs Instantly</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Use our interactive all-in cost calculator to calculate exact spread + commission costs per lot across 60+ currency pairs.
              </p>
              <Link
                to="/tools"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Launch Interactive All-In Cost Calculator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Contextual Low Cost Broker Recommendations */}
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-3">
                3.0 Top Verified Low-Cost Forex Brokers for 2026
              </h2>
              <div className="space-y-3">
                {lowCostBrokers.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        {b.name}
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border rounded font-semibold">
                          {b.primaryLicense}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        EUR/USD: <strong>{b.eurUsdSpread} p</strong> • Comm: <strong>${b.commissionPerLot.toFixed(2)}/lot</strong> • All-In: <strong>${(b.eurUsdSpread * 10 + b.commissionPerLot * 2).toFixed(2)}/lot</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/brokers/${b.slug}`} className="px-3 py-1.5 border rounded font-bold hover:bg-white">
                        Review
                      </Link>
                      <a href={b.affiliateUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded">
                        Visit ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Sticky Table of Contents Sidebar (4-Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-[140px] space-y-6 text-xs">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3 pb-2 border-b">
                  Table of Contents
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="hover:text-blue-600 font-medium cursor-pointer">1.0 Real Friction in Forex Trades</li>
                  <li className="hover:text-blue-600 font-medium cursor-pointer">2.0 Standard vs Raw ECN Spread Models</li>
                  <li className="hover:text-blue-600 font-medium cursor-pointer">3.0 Hidden Slippage in Execution</li>
                  <li className="hover:text-blue-600 font-medium cursor-pointer">4.0 Overnight Swap Financing Formulas</li>
                  <li className="hover:text-blue-600 font-medium cursor-pointer">5.0 Top Low-Cost Broker Rankings</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                  Related Research Guides
                </h3>
                <ul className="space-y-2.5 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link to="/guides/trading-costs" className="hover:text-blue-600 font-semibold block">
                      How to Spot Offshore Forex Scams (2026 Guide)
                    </Link>
                    <span className="text-[10px] text-slate-400">5 min read</span>
                  </li>
                  <li>
                    <Link to="/guides/trading-costs" className="hover:text-blue-600 font-semibold block">
                      MT4 vs MT5 vs TradingView: Execution Speed Benchmark
                    </Link>
                    <span className="text-[10px] text-slate-400">7 min read</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
