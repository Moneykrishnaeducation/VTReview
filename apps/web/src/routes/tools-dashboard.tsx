import React, { useState } from "react";
import { Link } from "react-router";
import {
  Calculator,
  Sparkles,
  DollarSign,
  Layers,
  Scale,
  Clock,
  Calendar,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { UxAnnotation } from "@/components/ui/wireframe-components";
import { calculatePipValue, calculateAllInTradingCost } from "@/lib/calculators";
import { analytics } from "@/lib/analytics";

export default function ToolsDashboard() {
  // Calculator Interactive State
  const [pair, setPair] = useState("EUR/USD");
  const [accountCurrency, setAccountCurrency] = useState("USD");
  const [lots, setLots] = useState<number>(1.0);
  const [model, setModel] = useState<"raw" | "standard">("raw");
  const [spreadPips, setSpreadPips] = useState<number>(0.1);
  const [commissionPerLot, setCommissionPerLot] = useState<number>(6.0);

  // Pure Quantitative Calculation
  const pipValuePerLot = calculatePipValue({ pair, lotSize: 1.0, accountCurrency });
  const { spreadCost, commissionCost, totalCost } = calculateAllInTradingCost({
    spreadPips,
    commissionPerLot: model === "raw" ? commissionPerLot : 0,
    lots,
    pipValuePerStandardLot: pipValuePerLot,
  });

  // Comparison benchmark (standard broker with 1.1 spread and $0 comm = $11.00/lot)
  const benchmarkCost = 1.1 * pipValuePerLot * lots;
  const savings = Math.max(0, benchmarkCost - totalCost);

  const handleModelChange = (newModel: "raw" | "standard") => {
    setModel(newModel);
    if (newModel === "raw") {
      setSpreadPips(0.1);
      setCommissionPerLot(6.0);
    } else {
      setSpreadPips(0.8);
      setCommissionPerLot(0.0);
    }
    analytics.track("calculator_computed", {
      category: "forex_cost_calculator",
      metadata: { pair, model: newModel, lots },
    });
  };

  const toolsList = [
    { title: "🎯 Guided Broker Finder", desc: "5-step wizard to match ideal broker for your capital and style.", link: "/tools/broker-finder", badge: "Most Popular" },
    { title: "💸 All-In Forex Cost Calculator", desc: "Calculate exact round-turn spread and commission cost per lot.", link: "#calculator", badge: "Interactive" },
    { title: "📐 Pip Value & Risk Estimator", desc: "Determine exact monetary risk per pip across 60+ currency pairs.", link: "#", badge: "Risk Tool" },
    { title: "⚖️ Side-by-Side Comparison", desc: "Compare up to 4 brokers across 120+ audited specifications.", link: "/compare", badge: "Core Tool" },
    { title: "🛡️ License Register Lookup", desc: "Direct step-by-step verification guide for FCA, ASIC, and CySEC.", link: "/regulation", badge: "Safety" },
    { title: "📅 Global Economic Calendar", desc: "High-impact news release schedule with historical volatility data.", link: "#", badge: "Market Data" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 10 — TOOLS DASHBOARD & FOREX ALL-IN COST CALCULATOR">
          Interactive financial research tools dashboard with an embedded, real-time <strong>Forex Cost Calculator</strong> to determine exact slippage, commission, and spread friction.
        </UxAnnotation>

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Tools & Calculators</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            <Calculator className="h-4 w-4 text-blue-600" />
            <span>Quantitative Financial Tools</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Forex Trading Calculators & Research Tools
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Objective trading calculators to compute exact transaction costs, margin leverage, and regulatory safety checkpoints.
          </p>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {toolsList.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-all text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{t.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                    {t.badge}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {t.desc}
                </p>
              </div>

              <Link
                to={t.link}
                className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <span>Launch Tool</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>

        {/* DETAILED INTERACTIVE CALCULATOR: FOREX ALL-IN COST CALCULATOR */}
        <div id="calculator" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Forex All-In Transaction Cost Calculator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Formula: <strong>Total Transaction Cost = (Spread in Pips × Pip Value) + Round-Turn Commission</strong>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Calculator Inputs (6-Cols) */}
            <div className="lg:col-span-6 space-y-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Currency Pair:
                  </label>
                  <select
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded font-semibold text-xs"
                  >
                    <option value="EUR/USD">EUR / USD</option>
                    <option value="GBP/USD">GBP / USD</option>
                    <option value="USD/JPY">USD / JPY</option>
                    <option value="XAU/USD">XAU / USD (Gold)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Base Currency:
                  </label>
                  <select
                    value={accountCurrency}
                    onChange={(e) => setAccountCurrency(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded font-semibold text-xs"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Trade Size (Lots):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.01"
                    value={lots}
                    onChange={(e) => setLots(parseFloat(e.target.value) || 0.1)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1.5">
                  Broker Pricing Model:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleModelChange("raw")}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      model === "raw"
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold border-slate-900"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300"
                    }`}
                  >
                    Raw ECN (Spread + Comm.)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModelChange("standard")}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      model === "standard"
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold border-slate-900"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300"
                    }`}
                  >
                    Standard (All-in Spread)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Spread (in pips):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={spreadPips}
                    onChange={(e) => setSpreadPips(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Commission (Round-Turn):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    disabled={model === "standard"}
                    value={commissionPerLot}
                    onChange={(e) => setCommissionPerLot(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded font-bold text-xs disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Calculator Results Box (6-Cols) */}
            <div className="lg:col-span-6 bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md text-xs space-y-4">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
                Calculated Transaction Breakdown ({accountCurrency})
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Spread Cost ({spreadPips} pips × {lots} lots):</span>
                  <span className="font-mono font-bold">${spreadCost.toFixed(2)} {accountCurrency}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Commission Cost (${commissionPerLot} RT × {lots} lots):</span>
                  <span className="font-mono font-bold">${commissionCost.toFixed(2)} {accountCurrency}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-black text-amber-400">
                  <span>TOTAL TRANSACTION COST:</span>
                  <span className="font-mono text-base">${totalCost.toFixed(2)} {accountCurrency}</span>
                </div>
              </div>

              {/* Benchmark comparison savings banner */}
              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" />
                  <span>Cost Efficiency Benchmark</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Compared to an average standard broker ($11.00 per lot), this trade configuration costs <strong>${totalCost.toFixed(2)}</strong>, saving you <strong>${savings.toFixed(2)} {accountCurrency}</strong> per execution.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/best-brokers/low-spreads"
                  className="block text-center w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs transition-colors"
                >
                  View Ranked Lowest Spread Brokers (0.0 Pips) →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
