import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Scale,
  Award,
  BookOpen,
  Calculator,
  ExternalLink,
  Info,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { BROKERS } from "@/data/broker-directory-data";

export default function GlobalHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Search filtering
  const filteredBrokers = searchQuery.trim()
    ? BROKERS.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.primaryLicense.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.platforms.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
          b.executionModel.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleMouseEnter = (menuName: string) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuName);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  return (
    <>
      <header className="sticky top-[33px] z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Top Utility Line: Advertiser Disclosure & Regulatory Audit Note */}
        <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-1 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Independent Financial Research Standard
              </span>
              <span className="hidden md:inline text-slate-400">•</span>
              <span className="hidden md:inline">Audited Spreads & Direct Regulator Register Verification</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAffiliateModal(true)}
                className="hover:underline text-slate-600 dark:text-slate-400 flex items-center gap-1 cursor-pointer"
              >
                <Info className="h-3 w-3" />
                Advertiser Disclosure
              </button>
              <span>•</span>
              <Link to="/how-we-rate" className="hover:underline font-medium text-slate-700 dark:text-slate-300">
                Rating Methodology
              </Link>
            </div>
          </div>
        </div>

        {/* Main Desktop Header */}
        <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-amber-500 text-slate-950 font-black rounded-lg flex items-center justify-center text-sm tracking-tighter shadow-xs">
                WFX
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base leading-none">
                  Wikii<span className="text-amber-500 font-black">FX</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold leading-tight">
                  Regulatory Inquiry
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Global Typeahead Search */}
          <div className="hidden lg:block relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search brokers, licenses (e.g. FCA 583261), platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Typeahead Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Matching Verified Brokers
                </div>
                {filteredBrokers.length > 0 ? (
                  filteredBrokers.map((broker) => (
                    <Link
                      key={broker.id}
                      to={`/brokers/${broker.slug}`}
                      className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-b last:border-0 border-slate-100 dark:border-slate-800"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {broker.name}
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 rounded">
                            {broker.primaryLicense}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Spread: {broker.eurUsdSpread} p | Min: {broker.minDepositFormatted} | {broker.executionModel}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-slate-100">★ {broker.editorialRating}</span>
                        <div className="text-[10px] text-slate-400">{broker.editorialClass}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-3 text-center text-slate-500">
                    No brokers matching "{searchQuery}". Try searching by license number or platform.
                  </div>
                )}
                <div className="px-3 pt-2 text-center bg-slate-50 dark:bg-slate-950/50 mt-1">
                  <Link to={`/brokers?q=${encodeURIComponent(searchQuery)}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    View all matching results in Directory →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Primary Nav Items with Mega-Menu Handlers */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {/* Brokers Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("brokers")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/brokers"
                className={`flex items-center gap-1 px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  activeMegaMenu === "brokers" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : ""
                }`}
              >
                Brokers
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Compare Direct Link */}
            <Link
              to="/compare"
              className="flex items-center gap-1 px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Scale className="h-3.5 w-3.5 text-slate-400" />
              Compare
            </Link>

            {/* Best Brokers Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("best-brokers")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/best-brokers/overall"
                className={`flex items-center gap-1 px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  activeMegaMenu === "best-brokers" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : ""
                }`}
              >
                Best Brokers
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Reviews */}
            <Link
              to="/reviews"
              className="px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Reviews
            </Link>

            {/* Regulation */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("regulation")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/regulation"
                className={`flex items-center gap-1 px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  activeMegaMenu === "regulation" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : ""
                }`}
              >
                Regulation
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Guides */}
            <Link
              to="/guides/trading-costs"
              className="px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Guides
            </Link>

            {/* Tools */}
            <Link
              to="/tools"
              className="flex items-center gap-1 px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Calculator className="h-3.5 w-3.5 text-slate-400" />
              Tools
            </Link>

            {/* Complaints Exposure */}
            <Link
              to="/complaints"
              className="px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold"
            >
              Complaints
            </Link>
          </nav>

          {/* Right Action: Find My Broker CTA */}
          <div className="flex items-center gap-2">
            <Link
              to="/tools/broker-finder"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 dark:text-amber-600" />
              Find My Broker
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* DESKTOP MEGA MENU OVERLAY */}
        {activeMegaMenu && (
          <div
            className="absolute left-0 right-0 top-full bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            onMouseEnter={() => handleMouseEnter(activeMegaMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1240px] mx-auto px-6 py-6">
              {activeMegaMenu === "brokers" && (
                <div className="grid grid-cols-4 gap-8 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      Popular Categories
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/overall" className="hover:text-slate-900 dark:hover:text-white font-medium flex items-center justify-between">
                          <span>Best Overall Brokers 2026</span>
                          <span className="text-[10px] px-1 bg-slate-100 dark:bg-slate-800 rounded">Top 10</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/beginners" className="hover:text-slate-900 dark:hover:text-white">
                          Best for Beginners
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/low-spreads" className="hover:text-slate-900 dark:hover:text-white">
                          Lowest Spread Brokers
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?filter=zero-deposit" className="hover:text-slate-900 dark:hover:text-white">
                          Zero Minimum Deposit
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?filter=swap-free" className="hover:text-slate-900 dark:hover:text-white">
                          Islamic / Swap-Free Accounts
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      By Platform
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/mt4" className="hover:text-slate-900 dark:hover:text-white">
                          MetaTrader 4 (MT4) Brokers
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/mt5" className="hover:text-slate-900 dark:hover:text-white">
                          MetaTrader 5 (MT5) Brokers
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/tradingview" className="hover:text-slate-900 dark:hover:text-white font-medium text-blue-600 dark:text-blue-400">
                          TradingView Integrated Brokers
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?platform=cTrader" className="hover:text-slate-900 dark:hover:text-white">
                          cTrader Brokers
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?platform=proprietary" className="hover:text-slate-900 dark:hover:text-white">
                          Proprietary Web Apps
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      By Trading Style
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/scalping" className="hover:text-slate-900 dark:hover:text-white">
                          Day Trading & Scalping
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=ecn" className="hover:text-slate-900 dark:hover:text-white">
                          True ECN / Raw Spread
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=copy" className="hover:text-slate-900 dark:hover:text-white">
                          Copy & Social Trading
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=ea" className="hover:text-slate-900 dark:hover:text-white">
                          Algorithmic / EA / API Trading
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=high-leverage" className="hover:text-slate-900 dark:hover:text-white">
                          High Leverage Options
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Guided Broker Discovery
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      Answer 5 quick questions and our independent engine matches the ideal verified broker for your strategy.
                    </p>
                    <Link
                      to="/tools/broker-finder"
                      className="inline-block w-full text-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-1.5 px-3 rounded text-xs hover:bg-slate-800 transition-colors"
                    >
                      Start Broker Finder (60s) →
                    </Link>
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-[11px]">
                      <Link to="/brokers" className="text-slate-600 dark:text-slate-400 hover:underline">
                        Browse All 140+ Brokers
                      </Link>
                      <Link to="/how-we-rate" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        How We Rate
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeMegaMenu === "best-brokers" && (
                <div className="grid grid-cols-3 gap-8 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      Editorial Curations
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/overall" className="hover:text-slate-900 dark:hover:text-white font-medium">
                          ★ Best Overall Forex Brokers (2026)
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/beginners" className="hover:text-slate-900 dark:hover:text-white">
                          🔰 Best Forex Brokers for Beginners
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/low-spreads" className="hover:text-slate-900 dark:hover:text-white">
                          ⚡ Best for Low Spreads & ECN
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/scalping" className="hover:text-slate-900 dark:hover:text-white">
                          🎯 Best for Scalping & High-Speed Execution
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      By Platform & Tool
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/tradingview" className="hover:text-slate-900 dark:hover:text-white font-medium text-blue-600 dark:text-blue-400">
                          📊 Best TradingView Brokers
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/mt4" className="hover:text-slate-900 dark:hover:text-white">
                          💻 Best MT4 Brokers
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/mt5" className="hover:text-slate-900 dark:hover:text-white">
                          🚀 Best MT5 Brokers
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2">
                      Independent Ranking Criteria
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                      Rankings are 100% data-driven based on tier-1 licensing, audited live account test data, and real slippage measurements.
                    </p>
                    <Link to="/how-we-rate" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      Read Full 120-Point Methodology →
                    </Link>
                  </div>
                </div>
              )}

              {activeMegaMenu === "regulation" && (
                <div className="grid grid-cols-4 gap-8 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      Tier-1 Supervised Regulators
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/regulation/fca" className="hover:text-slate-900 dark:hover:text-white font-medium">
                          🇬🇧 FCA — United Kingdom (£85k FSCS)
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation/asic" className="hover:text-slate-900 dark:hover:text-white font-medium">
                          🇦🇺 ASIC — Australia (AFSL Oversight)
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation/cysec" className="hover:text-slate-900 dark:hover:text-white font-medium">
                          🇨🇾 CySEC — Cyprus / EU (€20k ICF)
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation/bafin" className="hover:text-slate-900 dark:hover:text-white">
                          🇩🇪 BaFin — Germany
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      Tier-2 & Regional
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/regulation" className="hover:text-slate-900 dark:hover:text-white">
                          🇦🇪 DFSA — Dubai DIFC
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-slate-900 dark:hover:text-white">
                          🇿🇦 FSCA — South Africa
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-slate-900 dark:hover:text-white">
                          🇸🇬 MAS — Singapore
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                      Safety & Verification
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/regulation" className="hover:text-slate-900 dark:hover:text-white font-medium text-emerald-600 dark:text-emerald-400">
                          🛡️ 4-Step License Verification Guide
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-slate-900 dark:hover:text-white">
                          Negative Balance Protection Rules
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-slate-900 dark:hover:text-white">
                          Segregated Bank Account Auditing
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2">
                      Regulatory License Lookup
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      Verify any broker’s official regulatory register number directly against official government databases.
                    </p>
                    <Link to="/regulation" className="inline-block w-full text-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-1.5 px-3 rounded text-xs">
                      Explore Regulation Hub →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOBILE NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[80px] bg-white dark:bg-slate-900 z-50 overflow-y-auto px-4 py-6 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            {/* Search Input for Mobile */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search brokers, licenses, platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm"
              />
            </div>

            {/* Quick Action Finder CTA */}
            <div className="mb-6 p-4 rounded-lg bg-slate-900 dark:bg-slate-800 text-white">
              <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Find My Broker (60-Sec Quiz)
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Unbiased algorithm matching your trading style, platform, and capital.
              </p>
              <Link
                to="/tools/broker-finder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-2 rounded text-xs"
              >
                Launch Wizard Now →
              </Link>
            </div>

            {/* Mobile Nav Links */}
            <nav className="space-y-4 text-sm font-semibold">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Core Directory</div>
                <div className="space-y-1">
                  <Link
                    to="/brokers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    All Brokers Directory (140+)
                  </Link>
                  <Link
                    to="/compare"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Side-by-Side Comparison</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">Tool</span>
                  </Link>
                  <Link
                    to="/reviews"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    User Reviews & Ratings
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Best Brokers Rankings</div>
                <div className="space-y-1">
                  <Link
                    to="/best-brokers/overall"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Best Overall Forex Brokers (2026)
                  </Link>
                  <Link
                    to="/best-brokers/beginners"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Best for Beginners
                  </Link>
                  <Link
                    to="/best-brokers/low-spreads"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Lowest Spread Brokers
                  </Link>
                  <Link
                    to="/best-brokers/tradingview"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Best TradingView Brokers
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Research & Tools</div>
                <div className="space-y-1">
                  <Link
                    to="/regulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Regulation & Safety Hub
                  </Link>
                  <Link
                    to="/tools"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Trading Calculators
                  </Link>
                  <Link
                    to="/complaints"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600"
                  >
                    Complaints & Exposure
                  </Link>
                  <Link
                    to="/how-we-rate"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Editorial Methodology
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ADVERTISER DISCLOSURE MODAL */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setShowAffiliateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Advertiser & Affiliate Disclosure
              </h3>
            </div>
            <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>WikiiFX</strong> is an independent financial research and regulatory inquiry platform. We are committed to transparency and objectivity in all our evaluations.
              </p>
              <p>
                To support our extensive testing and direct regulatory audits, we may receive compensation when you open an account through links on our site.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-medium">
                🛡️ <strong>Our Editorial Guarantee:</strong> Commercial relationships never influence our editorial ratings, ranking algorithms, or fact-checked reviews. Brokers cannot pay for higher scores or positive verdicts.
              </div>
              <p className="text-[11px] text-slate-500">
                CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 70% and 85% of retail investor accounts lose money when trading CFDs.
              </p>
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={() => setShowAffiliateModal(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded hover:bg-slate-800 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
