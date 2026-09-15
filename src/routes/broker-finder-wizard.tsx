import React, { useState } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Scale,
  ExternalLink,
  Zap,
  BookOpen,
  TrendingDown,
  Monitor,
  Check,
} from "lucide-react";
import { BROKERS, type Broker } from "@/data/broker-directory-data";
import { useComparison } from "@/lib/comparison-context";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function BrokerFinderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Wizard Answers State
  const [tradingStyle, setTradingStyle] = useState<string>("scalper");
  const [platform, setPlatform] = useState<string>("tradingview");
  const [priority, setPriority] = useState<string>("spreads");
  const [deposit, setDeposit] = useState<string>("500");
  const [location, setLocation] = useState<string>("uk");

  const { isBrokerSelected, addBroker, removeBroker } = useComparison();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Trigger calculation state
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setIsCompleted(true);
      }, 900);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setIsCompleted(false);
  };

  // Matched recommendations
  const matchedBrokers = [
    {
      broker: BROKERS[0], // Pepperstone
      matchPercentage: 96,
      whyMatches: [
        "Raw ECN Spreads: Averaging 0.1 pips on EUR/USD (Matches your ultra-low cost scalping requirement)",
        "Platform Support: Native webhook and charting integration with TradingView and MT5",
        "Tier-1 Security: Authorized and regulated by the UK Financial Conduct Authority (FCA #684312)",
        "Zero Account Minimum: Matches your planned initial deposit of $500",
      ],
    },
    {
      broker: BROKERS[1], // IC Markets
      matchPercentage: 91,
      whyMatches: [
        "Ultra-High Liquidity: 0.0 pip raw spreads with cTrader and MT5 support",
        "Institutional Low Latency: Sub-30ms execution in Equinix NY4",
        "Regulated by ASIC and CySEC with segregated funds",
      ],
    },
    {
      broker: BROKERS[2], // IG
      matchPercentage: 86,
      whyMatches: [
        "Publicly Traded FTSE 250 parent company with 50+ year track record",
        "Exceptional regulatory trust score (99/100)",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
      <div className="max-w-[860px] mx-auto">
        <UxAnnotation tag="SCREEN 05 — BROKER FINDER (GUIDED 5-STEP RECOMMENDATION ENGINE)">
          Multi-step guided discovery wizard designed for traders unsure of technical jargon. Converts simple trader preferences into algorithmic compatibility scores with explicit <strong>"Why This Matches You"</strong> verification checkpoints.
        </UxAnnotation>

        {/* Wizard Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          {!isCompleted && !isCalculating ? (
            <div>
              {/* Header & Step Counter */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 text-xs font-bold mb-3">
                  <Sparkles className="h-4 w-4" />
                  <span>60-Second Guided Broker Finder</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Find Your Ideal Verified Forex Broker
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  Answer 5 objective questions to filter through 140+ audited brokerages.
                </p>

                {/* Step Progress Bar */}
                <div className="flex items-center justify-center gap-2 mt-6 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        s <= currentStep ? "bg-slate-900 dark:bg-slate-100" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
                  Step {currentStep} of 5
                </div>
              </div>

              {/* STEP 1: EXPERIENCE & TRADING STYLE */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white text-center mb-4">
                    What is your primary trading style or experience level?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => setTradingStyle("beginner")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        tradingStyle === "beginner"
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-slate-100 font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">🔰 Beginner / Just Learning</div>
                      <p className="text-slate-500 text-[11px]">Looking for simplicity, clear education, demo trading, and human phone support.</p>
                    </button>

                    <button
                      onClick={() => setTradingStyle("scalper")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        tradingStyle === "scalper"
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-slate-100 font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">⚡ Day Trader / Scalper</div>
                      <p className="text-slate-500 text-[11px]">Require ultra-tight raw ECN spreads from 0.0 pips and fast sub-40ms execution.</p>
                    </button>

                    <button
                      onClick={() => setTradingStyle("algo")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        tradingStyle === "algo"
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-slate-100 font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">🤖 Algorithmic / EA Trader</div>
                      <p className="text-slate-500 text-[11px]">Running automated bots on MetaTrader/cTrader with VPS hosting requirements.</p>
                    </button>

                    <button
                      onClick={() => setTradingStyle("copy")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        tradingStyle === "copy"
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-slate-100 font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">👥 Copy / Social Trader</div>
                      <p className="text-slate-500 text-[11px]">Wanting to mirror verified professional trader portfolios with 1 click.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PLATFORM PREFERENCE */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white text-center mb-4">
                    Which trading platform or interface do you prefer?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => setPlatform("tradingview")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        platform === "tradingview"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600 font-bold text-blue-900 dark:text-blue-100"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">📊 TradingView Charting</div>
                      <p className="text-slate-500 text-[11px]">Execute orders directly from TradingView charts with custom Pine Script indicators.</p>
                    </button>

                    <button
                      onClick={() => setPlatform("mt5")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        platform === "mt5"
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">💻 MetaTrader 5 (MT5)</div>
                      <p className="text-slate-500 text-[11px]">Multi-asset standard with 64-bit multi-threaded strategy tester.</p>
                    </button>

                    <button
                      onClick={() => setPlatform("ctrader")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        platform === "ctrader"
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">⚡ cTrader Suite</div>
                      <p className="text-slate-500 text-[11px]">Level II Depth of Market, C# algorithmic bots, and discounted commissions.</p>
                    </button>

                    <button
                      onClick={() => setPlatform("mobile")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        platform === "mobile"
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1">📱 Modern Web / Mobile App</div>
                      <p className="text-slate-500 text-[11px]">Intuitive mobile iOS/Android app with 1-click risk management.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: KEY PRIORITIES */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white text-center mb-4">
                    What matters most to you in a broker?
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { id: "spreads", title: "Lowest Trading Costs & Spreads", desc: "Raw zero spread accounts with discounted commissions." },
                      { id: "safety", title: "Maximum Regulatory Safety (FCA / ASIC)", desc: "Statutory FSCS compensation & segregated Tier-1 bank funds." },
                      { id: "execution", title: "Ultra-Fast Execution & No Re-quotes", desc: "Equinix server connectivity with minimal slippage." },
                      { id: "education", title: "Beginner Academy & Live Daily Webinars", desc: "Structured learning courses without high-pressure sales." },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPriority(p.id)}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          priority === p.id
                            ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 font-bold ring-1 ring-slate-900"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</div>
                          <div className="text-slate-500 text-[11px]">{p.desc}</div>
                        </div>
                        {priority === p.id && <Check className="h-5 w-5 text-slate-900 dark:text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: PLANNED DEPOSIT */}
              {currentStep === 4 && (
                <div className="space-y-4 text-center">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
                    What is your planned initial deposit capital?
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {[
                      { id: "50", label: "$10 – $50", desc: "Micro / Cent Accounts" },
                      { id: "200", label: "$50 – $200", desc: "Standard Retail Entry" },
                      { id: "500", label: "$500 – $2,000", desc: "Dedicated ECN Account" },
                      { id: "5000", label: "$2,000+", desc: "VIP / Free VPS Account" },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDeposit(d.id)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          deposit === d.id
                            ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 font-bold ring-1 ring-slate-900"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="font-black text-sm mb-1">{d.label}</div>
                        <div className="text-slate-500 text-[10px]">{d.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: RESIDENCE / REGULATORY JURISDICTION */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white text-center mb-4">
                    Where is your country of tax residence?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { id: "uk", flag: "🇬🇧", name: "United Kingdom", desc: "FCA Supervised (£85k FSCS, 1:30 leverage)" },
                      { id: "eu", flag: "🇪🇺", name: "European Union", desc: "CySEC / BaFin Supervised (€20k ICF protection)" },
                      { id: "au", flag: "🇦🇺", name: "Australia", desc: "ASIC Regulated (AFSL, AFCA dispute resolution)" },
                      { id: "global", flag: "🌐", name: "International / Asia / LATAM", desc: "FSC / FSA Global Licences (High Leverage 1:500)" },
                    ].map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setLocation(loc.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          location === loc.id
                            ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 font-bold ring-1 ring-slate-900"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="font-extrabold text-sm mb-1 flex items-center gap-1.5">
                          <span>{loc.flag}</span>
                          <span>{loc.name}</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{loc.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wizard Bottom Navigation Bar */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 px-3 py-2 rounded"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <span>{currentStep === 5 ? "Calculate Recommendations →" : "Continue to Next Step"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : isCalculating ? (
            /* Calculating Animation State */
            <div className="py-16 text-center space-y-4">
              <div className="h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Computing Verified Broker Match Algorithm...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Weighting 120+ data points across FCA/ASIC licensing, live raw spread logs, and TradingView compatibility.
              </p>
            </div>
          ) : (
            /* WIZARD RESULTS SCREEN */
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Algorithmic Matching Complete
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                    Your Personalized Broker Matches
                  </h2>
                  <p className="text-xs text-slate-500">
                    Filtered for: <strong>Scalping • TradingView • Low Spreads • UK/FCA</strong>
                  </p>
                </div>

                <button
                  onClick={resetWizard}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline px-2 py-1 border rounded"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              {/* Matched Brokers Cards List */}
              <div className="space-y-6">
                {matchedBrokers.map((m, idx) => {
                  const b = m.broker;
                  const selected = isBrokerSelected(b.id);
                  return (
                    <div
                      key={b.id}
                      className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-extrabold text-base text-slate-900 dark:text-white">
                              {b.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {b.primaryLicense} • Overall Score: ★{b.editorialRating}
                            </div>
                          </div>
                        </div>

                        {/* Match Percentage Badge */}
                        <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-sm rounded-full border border-emerald-300 w-fit">
                          {m.matchPercentage}% MATCH
                        </div>
                      </div>

                      {/* Explicit "Why This Matches You" Breakdown */}
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 mb-4 text-xs">
                        <div className="font-bold text-slate-900 dark:text-white mb-2">
                          Why this broker matches your profile:
                        </div>
                        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                          {m.whyMatches.map((why, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="h-3.5 w-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                              <span>{why}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quick Specs */}
                      <div className="grid grid-cols-3 gap-2 text-xs mb-4 text-slate-700 dark:text-slate-300">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">EUR/USD Spread</span>
                          <strong>{b.eurUsdSpread} pips</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Commission</span>
                          <strong>${b.commissionPerLot.toFixed(2)} / lot</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Platforms</span>
                          <strong>{b.platforms.slice(0, 2).join(", ")}</strong>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <button
                          onClick={() => {
                            if (selected) removeBroker(b.id);
                            else addBroker(b.id);
                          }}
                          className="font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                        >
                          {selected ? "✓ Added to Compare" : "+ Add to Compare"}
                        </button>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/brokers/${b.slug}`}
                            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded font-bold hover:bg-white"
                          >
                            Read Full Review
                          </Link>
                          <a
                            href={b.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-xs"
                          >
                            Visit Broker ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
