import React from "react";
import { Link } from "react-router";
import {
  ShieldCheck,
  Award,
  Scale,
  CheckCircle2,
  Lock,
  Zap,
  TrendingDown,
  Layers,
  HelpCircle,
} from "lucide-react";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function RatingMethodology() {
  const pillars = [
    {
      title: "1. Safety & Regulation",
      weight: "30% Weight",
      desc: "Direct verification of Tier-1 licenses (FCA, ASIC, CySEC, BaFin), client fund segregation in Tier-1 banks, and statutory compensation funds.",
      criteria: [
        "Primary Tier-1 active license verification on official government registers",
        "Mandatory segregated client bank accounts with audited custody",
        "Mandatory negative balance protection for retail investors",
        "Track record and financial solvency history of parent operating entity",
      ],
    },
    {
      title: "2. Trading Costs & Fees",
      weight: "25% Weight",
      desc: "Real tick data analysis measuring EUR/USD, GBP/USD, and Gold spreads, commissions, and overnight financing swaps.",
      criteria: [
        "Real-money audited raw ECN spreads during London and New York overlaps",
        "Transparent fixed commission rate per standard lot",
        "Evaluation of non-trading fees: deposit, withdrawal, and inactivity costs",
        "Benchmarked overnight swap financing rates against interbank standard",
      ],
    },
    {
      title: "3. Platforms & Execution",
      weight: "20% Weight",
      desc: "Latency testing in milliseconds, slippage distribution during major economic releases, and platform software diversity.",
      criteria: [
        "Support for MetaTrader 4, MetaTrader 5, cTrader, and native TradingView",
        "Order fill speed measured across 500+ live trades (<40ms benchmark)",
        "Slippage distribution percentage (positive/neutral vs negative)",
        "Mobile iOS and Android app responsiveness and biometric login security",
      ],
    },
    {
      title: "4. Deposit & Withdrawal Speed",
      weight: "10% Weight",
      desc: "Speed of funding and withdrawals tested with real capital across debit cards, bank wires, and electronic wallets.",
      criteria: [
        "Withdrawal request turnaround under 24 business hours",
        "Zero broker-side funding or payout processing fees",
        "Diversity of funding rails (Cards, Wire, PayPal, Skrill, Apple Pay)",
      ],
    },
    {
      title: "5. Customer Support & Research",
      weight: "15% Weight",
      desc: "Secret-shopper testing evaluating live chat response latency, technical competence, and quality of educational materials.",
      criteria: [
        "Live chat human agent connection under 60 seconds",
        "Availability of 24/5 or 24/7 technical customer support",
        "Structured beginner trading education without promotional sales calls",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 14 — EDITORIAL RATING METHODOLOGY">
          Public transparency specification outlining the <strong>120-point quantitative evaluation formula</strong>. Enforces trust by separating editorial scores from commercial sponsorships.
        </UxAnnotation>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">How We Rate Brokers</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            <Award className="h-4 w-4 text-amber-500" />
            <span>Editorial Integrity Standard</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Our 120-Point Broker Rating Methodology
          </h1>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Every broker score on WikiiFX is calculated mathematically from over 120 audited data points across five weighted evaluation pillars. Commercial partnerships never influence our formulas or rankings.
          </p>
        </div>

        {/* Editorial Independence Charter */}
        <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 mb-10 text-xs leading-relaxed space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Our Editorial Independence Charter
          </h2>
          <p className="text-slate-300">
            1. <strong>Scores Cannot Be Bought:</strong> No broker can pay to increase their editorial score or achieve a higher rank on any category list.
          </p>
          <p className="text-slate-300">
            2. <strong>Real Account Auditing:</strong> We deposit real money and trade real lots to benchmark spreads, slippage, and withdrawal delays.
          </p>
          <p className="text-slate-300">
            3. <strong>Clear Affiliate Disclosure:</strong> While we may receive referral commissions when users click outbound links, our testing lab operates under strict operational separation.
          </p>
        </div>

        {/* 5 Weighted Pillars */}
        <div className="space-y-6 mb-12">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            The 5 Weighted Evaluation Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{p.title}</h3>
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 font-bold text-[11px] rounded text-slate-700 dark:text-slate-300">
                    {p.weight}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {p.desc}
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Audit Checkpoints:</span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {p.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
