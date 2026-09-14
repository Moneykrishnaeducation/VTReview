import React, { useState } from "react";
import { Link } from "react-router";
import {
  Scale,
  X,
  Plus,
  ShieldCheck,
  Check,
  Minus,
  ExternalLink,
  ChevronDown,
  Info,
  SlidersHorizontal,
  ArrowRight,
  Layers,
} from "lucide-react";
import { BROKERS, type Broker } from "@/data/broker-directory-data";
import { useComparison } from "@/lib/comparison-context";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function ComparisonBuilder() {
  const { selectedBrokers, addBroker, removeBroker, clearBrokers } = useComparison();
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [showAddPicker, setShowAddPicker] = useState(false);

  // Available brokers not yet in comparison
  const availableToAdd = BROKERS.filter(
    (b) => !selectedBrokers.some((sb) => sb.id === b.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 04 — SIDE-BY-SIDE COMPARISON BUILDER">
          Side-by-side financial comparison grid supporting 2–4 brokers with sticky column headers, difference highlighting toggle, and responsive mobile stacked card fallback.
        </UxAnnotation>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link to="/compare" className="hover:underline text-slate-700 dark:text-slate-300 font-semibold">Compare</Link>
          <span>›</span>
          <span>Side-by-Side Builder</span>
        </div>

        {/* Header Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Scale className="h-7 w-7 text-blue-600" />
              Side-by-Side Forex Broker Comparison
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Compare spreads, regulatory safety tiers, trading platforms, and total all-in trading costs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className={`flex items-center gap-2 text-xs font-semibold cursor-pointer select-none px-3 py-1.5 rounded-md border transition-colors ${
              highlightDiffs
                ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            }`}>
              <input
                type="checkbox"
                checked={highlightDiffs}
                onChange={(e) => setHighlightDiffs(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Highlight Differences Only</span>
            </label>

            {availableToAdd.length > 0 && selectedBrokers.length < 4 && (
              <button
                onClick={() => setShowAddPicker(!showAddPicker)}
                className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-md flex items-center gap-1 shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Broker ({selectedBrokers.length}/4)</span>
              </button>
            )}
          </div>
        </div>

        {/* Broker Add Dropdown Picker */}
        {showAddPicker && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-xl mb-6 animate-in fade-in duration-150">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select a Broker to Add to Comparison Table:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {availableToAdd.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    addBroker(b.id);
                    setShowAddPicker(false);
                  }}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border rounded text-left font-semibold flex items-center justify-between"
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-slate-400">★{b.editorialRating}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COMPARISON TABLE */}
        {selectedBrokers.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              {/* STICKY HEADER ROW */}
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 w-1/4 font-bold text-slate-500 uppercase text-[11px]">
                    Comparison Category
                  </th>
                  {selectedBrokers.map((b) => (
                    <th key={b.id} className="p-4 w-1/4 border-l border-slate-200 dark:border-slate-700 align-top">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                            <Link to={`/brokers/${b.slug}`} className="hover:underline">
                              {b.name}
                            </Link>
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {b.primaryLicense}
                          </div>
                        </div>
                        {selectedBrokers.length > 1 && (
                          <button
                            onClick={() => removeBroker(b.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="Remove from comparison"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="text-xs mb-3">
                        <span className="font-black text-slate-900 dark:text-white">★ {b.editorialRating}</span>
                        <span className="text-slate-400 text-[10px]"> ({b.reviewCount} reviews)</span>
                      </div>

                      <a
                        href={b.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-[11px] rounded shadow-xs hover:bg-slate-800"
                      >
                        Visit Broker ↗
                      </a>
                    </th>
                  ))}

                  {/* Empty Slot Placeholder */}
                  {selectedBrokers.length < 4 && (
                    <th className="p-4 border-l border-slate-200 dark:border-slate-700 text-center align-middle bg-slate-50/50 dark:bg-slate-900/50">
                      <button
                        onClick={() => setShowAddPicker(true)}
                        className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-500 w-full text-center text-xs font-semibold"
                      >
                        <Plus className="h-5 w-5 mx-auto mb-1 opacity-60" />
                        + Add Competitor ({4 - selectedBrokers.length} slots left)
                      </button>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* 1.0 REGULATION & TRUST */}
                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={selectedBrokers.length + 2} className="p-3 uppercase text-[10px] tracking-wider text-slate-400">
                    🛡️ Regulation, Safety & Trust
                  </td>
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/40 dark:bg-amber-950/20" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">Regulatory Licenses</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800 font-medium">
                      {b.regulations.map((r) => r.regulator).join(", ")}
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/40 dark:bg-amber-950/20" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">Tier-1 Licenses</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800 font-bold text-emerald-600">
                      {b.regulations.filter((r) => r.tier === 1).length} Tier-1 Authorities (High)
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">Negative Balance Protection</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800">
                      {b.negativeBalanceProtection ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Yes (Mandatory)
                        </span>
                      ) : (
                        <span className="text-rose-500 font-bold">No</span>
                      )}
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>

                {/* 2.0 TRADING COSTS */}
                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={selectedBrokers.length + 2} className="p-3 uppercase text-[10px] tracking-wider text-slate-400">
                    💸 Trading Costs & Fees
                  </td>
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/50 dark:bg-amber-950/30" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">EUR/USD Average Spread</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800 font-black text-sm text-blue-600 dark:text-blue-400">
                      {b.eurUsdSpread} pips
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/50 dark:bg-amber-950/30" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">Commission (Per Lot RT)</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800 font-medium">
                      ${b.commissionPerLot.toFixed(2)} round-turn
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/50 dark:bg-amber-950/30" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">Inactivity Fee</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800 font-medium">
                      {b.inactivityFee}
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>

                {/* 3.0 ACCOUNT & DEPOSITS */}
                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={selectedBrokers.length + 2} className="p-3 uppercase text-[10px] tracking-wider text-slate-400">
                    ⚙️ Account Features & Funding
                  </td>
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/50 dark:bg-amber-950/30" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">Minimum Deposit</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                      {b.minDepositFormatted}
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">Max Leverage (Retail)</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800">
                      {b.maxLeverageRetail}
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>

                {/* 4.0 PLATFORMS */}
                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={selectedBrokers.length + 2} className="p-3 uppercase text-[10px] tracking-wider text-slate-400">
                    💻 Platforms & Software
                  </td>
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/50 dark:bg-amber-950/30" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">TradingView Charting</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800">
                      {b.platforms.includes("TradingView") ? (
                        <span className="text-blue-600 font-bold flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Supported
                        </span>
                      ) : (
                        <span className="text-slate-400">Not Integrated</span>
                      )}
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>
                <tr className={highlightDiffs ? "bg-amber-50/50 dark:bg-amber-950/30" : ""}>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">cTrader Suite</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-3.5 border-l border-slate-100 dark:border-slate-800">
                      {b.platforms.includes("cTrader") ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Supported
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-100 dark:border-slate-800" />}
                </tr>

                {/* 5.0 VERDICT & OUTBOUND */}
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <td className="p-4 text-slate-900 dark:text-white">Summary Action</td>
                  {selectedBrokers.map((b) => (
                    <td key={b.id} className="p-4 border-l border-slate-200 dark:border-slate-700">
                      <Link
                        to={`/brokers/${b.slug}`}
                        className="block w-full text-center py-1.5 border border-slate-300 dark:border-slate-600 rounded text-xs font-bold mb-2 hover:bg-white dark:hover:bg-slate-700"
                      >
                        Read Review
                      </Link>
                      <a
                        href={b.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded shadow-xs"
                      >
                        Visit Broker ↗
                      </a>
                    </td>
                  ))}
                  {selectedBrokers.length < 4 && <td className="border-l border-slate-200 dark:border-slate-700" />}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <h3 className="font-bold text-base mb-2">No brokers selected for comparison</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select 2 to 4 brokers from the directory or browse our ranked categories.
            </p>
            <Link
              to="/brokers"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded"
            >
              Browse All Brokers Directory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
