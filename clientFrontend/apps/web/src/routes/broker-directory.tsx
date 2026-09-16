import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  LayoutGrid,
  List,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Building2,
  Wallet,
} from "lucide-react";
import { BROKERS, type Broker } from "@/data/broker-directory-data";
import { BrokerResultCard, UxAnnotation } from "@/components/ui/wireframe-components";
import { useComparison } from "@/lib/comparison-context";

export default function BrokerDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<"rating" | "spread" | "deposit" | "reviews">("rating");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { isBrokerSelected, addBroker, removeBroker } = useComparison();

  // Faceted Filter States
  const [tier1Only, setTier1Only] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [depositRange, setDepositRange] = useState<string>("all");
  const [rawSpreadOnly, setRawSpreadOnly] = useState(false);
  const [scalpingRequired, setScalpingRequired] = useState(false);
  const [tradingViewOnly, setTradingViewOnly] = useState(false);
  const [copyTradingOnly, setCopyTradingOnly] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const toggleFunding = (f: string) => {
    setSelectedFunding((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setTier1Only(false);
    setSelectedPlatforms([]);
    setDepositRange("all");
    setRawSpreadOnly(false);
    setScalpingRequired(false);
    setTradingViewOnly(false);
    setCopyTradingOnly(false);
    setSelectedFunding([]);
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredBrokers = useMemo(() => {
    return BROKERS.filter((b) => {
      // Search text
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          b.name.toLowerCase().includes(q) ||
          b.primaryLicense.toLowerCase().includes(q) ||
          b.executionModel.toLowerCase().includes(q) ||
          b.platforms.some((p) => p.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Tier 1 Regulation
      if (tier1Only && !b.regulations.some((r) => r.tier === 1)) {
        return false;
      }

      // Platforms
      if (
        selectedPlatforms.length > 0 &&
        !selectedPlatforms.every((p) => b.platforms.includes(p))
      ) {
        return false;
      }

      // TradingView specific
      if (tradingViewOnly && !b.platforms.includes("TradingView")) {
        return false;
      }

      // Deposit
      if (depositRange === "zero" && b.minDeposit > 0) return false;
      if (depositRange === "under50" && b.minDeposit > 50) return false;
      if (depositRange === "under100" && b.minDeposit > 100) return false;

      // Spread type
      if (rawSpreadOnly && b.eurUsdSpread > 0.3) return false;

      // Scalping / EA / Copy
      if (scalpingRequired && !b.scalpingAllowed) return false;
      if (copyTradingOnly && !b.copyTrading) return false;

      // Funding methods
      if (
        selectedFunding.length > 0 &&
        !selectedFunding.every((f) =>
          b.depositMethods.some((dm) => dm.toLowerCase().includes(f.toLowerCase()))
        )
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.editorialRating - a.editorialRating;
      if (sortBy === "spread") return a.eurUsdSpread - b.eurUsdSpread;
      if (sortBy === "deposit") return a.minDeposit - b.minDeposit;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [
    search,
    tier1Only,
    selectedPlatforms,
    tradingViewOnly,
    depositRange,
    rawSpreadOnly,
    scalpingRequired,
    copyTradingOnly,
    selectedFunding,
    sortBy,
  ]);

  const activeFilterCount =
    (tier1Only ? 1 : 0) +
    selectedPlatforms.length +
    (depositRange !== "all" ? 1 : 0) +
    (rawSpreadOnly ? 1 : 0) +
    (scalpingRequired ? 1 : 0) +
    (tradingViewOnly ? 1 : 0) +
    (copyTradingOnly ? 1 : 0) +
    selectedFunding.length;

  const totalPages = Math.ceil(filteredBrokers.length / itemsPerPage) || 1;
  const paginatedBrokers = filteredBrokers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 02 — BROKER DIRECTORY (FACETED RESEARCH & DUAL VIEW)">
          Comprehensive broker discovery directory. Features a <strong>9:3 desktop layout</strong> with faceted multi-metric filtering (regulation tier, platforms, deposit, spread model, funding methods), active filter chips, table/card view toggle, and pagination.
        </UxAnnotation>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link to="/brokers" className="hover:underline text-slate-700 dark:text-slate-300 font-semibold">Brokers</Link>
          <span>›</span>
          <span>Directory & Search</span>
        </div>

        {/* Page Title & Intro */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Forex & CFD Broker Directory
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Search, filter, and compare {BROKERS.length} verified and audited brokerages based on your exact trading requirements and regulatory protections.
          </p>
        </div>

        {/* Search Bar & Active Filter Chips */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by broker name, regulatory license number (e.g. FCA 684312), or platform..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold text-[11px]">Active Filters:</span>
              {tier1Only && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-xs">
                  Tier-1 Regulated
                  <button onClick={() => setTier1Only(false)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              )}
              {tradingViewOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200 text-xs">
                  TradingView
                  <button onClick={() => setTradingViewOnly(false)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              )}
              {rawSpreadOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-xs">
                  Raw Spread (&lt;0.3p)
                  <button onClick={() => setRawSpreadOnly(false)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              )}
              {depositRange !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-xs">
                  Deposit: {depositRange}
                  <button onClick={() => setDepositRange("all")} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedFunding.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-xs">
                  Funding: {f}
                  <button onClick={() => toggleFunding(f)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              ))}
              {activeFilterCount === 0 && (
                <span className="text-slate-400 italic text-[11px]">Showing all verified brokers (No filters applied)</span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="h-3 w-3" />
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded text-xs font-bold"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filter Brokers ({activeFilterCount})</span>
          </button>
          <div className="text-xs text-slate-500 font-semibold">
            {filteredBrokers.length} Brokers Found
          </div>
        </div>

        {/* Main Grid: 3-Col Sidebar + 9-Col Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FACETED FILTER SIDEBAR (Desktop) */}
          <aside className={`lg:col-span-3 space-y-5 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 h-fit ${isMobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                Filter Brokers
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                  Reset
                </button>
              )}
            </div>

            {/* 1. Regulation Tier */}
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-2">
                Regulation Authority
              </label>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tier1Only}
                    onChange={(e) => setTier1Only(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Tier-1 Regulated (FCA, ASIC, CySEC)</span>
                </label>
              </div>
            </div>

            {/* 2. Platforms */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-2">
                Trading Platforms
              </label>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes("MetaTrader 4")}
                    onChange={() => togglePlatform("MetaTrader 4")}
                    className="rounded border-slate-300"
                  />
                  <span>MetaTrader 4 (MT4)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes("MetaTrader 5")}
                    onChange={() => togglePlatform("MetaTrader 5")}
                    className="rounded border-slate-300"
                  />
                  <span>MetaTrader 5 (MT5)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-blue-600 dark:text-blue-400">
                  <input
                    type="checkbox"
                    checked={tradingViewOnly}
                    onChange={(e) => setTradingViewOnly(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>TradingView Charting</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes("cTrader")}
                    onChange={() => togglePlatform("cTrader")}
                    className="rounded border-slate-300"
                  />
                  <span>cTrader Suite</span>
                </label>
              </div>
            </div>

            {/* 3. Minimum Deposit */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-2">
                Minimum Deposit
              </label>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deposit"
                    checked={depositRange === "all"}
                    onChange={() => setDepositRange("all")}
                  />
                  <span>Any Deposit Amount</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deposit"
                    checked={depositRange === "zero"}
                    onChange={() => setDepositRange("zero")}
                  />
                  <span>$0 (No Minimum)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deposit"
                    checked={depositRange === "under50"}
                    onChange={() => setDepositRange("under50")}
                  />
                  <span>Under $50 Entry</span>
                </label>
              </div>
            </div>

            {/* 4. Trading Style & Features */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-2">
                Trading Style & Execution
              </label>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rawSpreadOnly}
                    onChange={(e) => setRawSpreadOnly(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Raw ECN Spread (&lt;0.3 pips)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scalpingRequired}
                    onChange={(e) => setScalpingRequired(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Scalping & High-Speed EA</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyTradingOnly}
                    onChange={(e) => setCopyTradingOnly(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Copy & Social Trading</span>
                </label>
              </div>
            </div>

            {/* 5. Funding Methods */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-2">
                Funding Methods
              </label>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFunding.includes("Card")}
                    onChange={() => toggleFunding("Card")}
                    className="rounded border-slate-300"
                  />
                  <span>Credit / Debit Card (Visa/MC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFunding.includes("Wire")}
                    onChange={() => toggleFunding("Wire")}
                    className="rounded border-slate-300"
                  />
                  <span>Bank Wire Transfer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFunding.includes("PayPal")}
                    onChange={() => toggleFunding("PayPal")}
                    className="rounded border-slate-300"
                  />
                  <span>PayPal / Skrill / Neteller</span>
                </label>
              </div>
            </div>
          </aside>

          {/* RESULTS CONTENT (9-Cols) */}
          <main className="lg:col-span-9">
            {/* Results Toolbar */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                Showing <strong>{filteredBrokers.length}</strong> Audited Brokers (Page {currentPage} of {totalPages})
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 font-bold text-xs"
                  >
                    <option value="rating">Highest Editorial Rating</option>
                    <option value="spread">Lowest EUR/USD Spread</option>
                    <option value="deposit">Lowest Min Deposit</option>
                    <option value="reviews">Most User Reviews</option>
                  </select>
                </div>

                {/* View Toggle: Cards vs Table */}
                <div className="hidden sm:flex items-center border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-1.5 ${viewMode === "cards" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                    title="Card View"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 ${viewMode === "table" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                    title="Table View"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Result Items: Cards View vs Table View */}
            {filteredBrokers.length > 0 ? (
              viewMode === "cards" ? (
                <div className="space-y-4">
                  {paginatedBrokers.map((broker) => (
                    <BrokerResultCard key={broker.id} broker={broker} />
                  ))}
                </div>
              ) : (
                /* DENSE RESEARCH TABLE VIEW */
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-xs text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Broker Name</th>
                        <th className="p-3.5">Editorial Score</th>
                        <th className="p-3.5">Regulators</th>
                        <th className="p-3.5">EUR/USD Spread</th>
                        <th className="p-3.5">Min Deposit</th>
                        <th className="p-3.5">Commission</th>
                        <th className="p-3.5">Platforms</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {paginatedBrokers.map((broker) => {
                        const selected = isBrokerSelected(broker.id);
                        return (
                          <tr key={broker.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5">
                              <Link to={`/brokers/${broker.slug}`} className="font-extrabold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                                {broker.name}
                              </Link>
                              <div className="text-[10px] text-slate-400">{broker.executionModel}</div>
                            </td>
                            <td className="p-3.5">
                              <span className="font-black text-slate-900 dark:text-white tabular-nums">★ {broker.editorialRating}</span>
                              <div className="text-[10px] text-emerald-600 font-semibold">{broker.editorialClass}</div>
                            </td>
                            <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-300">
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800">
                                <ShieldCheck className="h-3 w-3" />
                                {broker.primaryLicense}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                              {broker.eurUsdSpread} pips
                            </td>
                            <td className="p-3.5 font-medium tabular-nums">
                              {broker.minDepositFormatted}
                            </td>
                            <td className="p-3.5 tabular-nums font-medium">
                              ${broker.commissionPerLot.toFixed(2)}/lot
                            </td>
                            <td className="p-3.5 text-[11px] text-slate-600 dark:text-slate-400">
                              {broker.platforms.slice(0, 2).join(", ")}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    if (selected) removeBroker(broker.id);
                                    else addBroker(broker.id);
                                  }}
                                  className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                  {selected ? "✓ Compare" : "+ Compare"}
                                </button>
                                <Link
                                  to={`/brokers/${broker.slug}`}
                                  className="px-3 py-1 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 rounded-md font-bold text-[11px] transition-colors"
                                >
                                  Review
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              /* Empty Search / Filter State */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center">
                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  No brokers found matching your criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Try unchecking some filters or searching with a different keyword or license number.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredBrokers.length > itemsPerPage && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-6 text-xs font-bold">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border rounded disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  « Previous Page
                </button>
                <div className="text-slate-500">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border rounded disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Next Page »
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
