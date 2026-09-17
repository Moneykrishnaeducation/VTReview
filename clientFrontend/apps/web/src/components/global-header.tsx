import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router";
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
  Users,
  User,
  LogOut,
  LogIn,
  FileText,
  ShieldAlert,
  Star,
  Globe,
  Building2,
  Zap,
  Shield,
  Layers,
  HelpCircle,
  ArrowRight,
  Cpu,
  Bookmark,
  Coins,
  Check,
  TrendingUp,
} from "lucide-react";
import { BROKERS } from "@/data/broker-directory-data";
import logo from "@/assets/logo.png";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/auth-context";
import { useComparison } from "@/lib/comparison-context";
import AuthModal from "@/components/auth-modal";

interface SearchResultItem {
  id: string;
  type: "broker" | "regulator" | "tool";
  title: string;
  subtitle: string;
  url: string;
  rating?: number;
  badge?: string;
  category?: string;
}

export default function GlobalHeader() {
  const { session, logout } = useAuth();
  const { selectedBrokerIds } = useComparison();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);

  // Command Palette & Search State
  const [paletteQuery, setPaletteQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<"all" | "brokers" | "regulators" | "tools">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const paletteInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll detection for compact sticky header mode
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setActiveMegaMenu(null);
    setShowCommandPalette(false);
  }, [location.pathname]);

  // Click outside handlers for user profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K / '/' to open command palette)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if (e.key === "Escape") {
        setShowCommandPalette(false);
        setIsUserMenuOpen(false);
        setActiveMegaMenu(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when Command Palette opens
  useEffect(() => {
    if (showCommandPalette) {
      setTimeout(() => paletteInputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setPaletteQuery("");
    }
  }, [showCommandPalette]);

  // Filtered Search Results for Command Palette
  const searchResults: SearchResultItem[] = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) return [];

    const matchedBrokers: SearchResultItem[] = BROKERS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.primaryLicense.toLowerCase().includes(q) ||
        b.platforms.some((p) => p.toLowerCase().includes(q)) ||
        b.executionModel.toLowerCase().includes(q) ||
        (b.categoryBadges && b.categoryBadges.some((t: string) => t.toLowerCase().includes(q))) ||
        (b.bestForTags && b.bestForTags.some((t: string) => t.toLowerCase().includes(q)))
    ).map((b) => ({
      type: "broker" as const,
      id: b.id,
      title: b.name,
      subtitle: `${b.primaryLicense} • Spread: ${b.eurUsdSpread} p • Min: ${b.minDepositFormatted} • ${b.executionModel}`,
      url: `/brokers/${b.slug}`,
      rating: b.editorialRating,
      badge: b.primaryLicense,
      category: b.editorialClass,
    }));

    const tools: SearchResultItem[] = [
      { id: "tool-broker-finder", title: "Broker Finder Wizard (60-Sec Match)", subtitle: "Find optimal verified broker based on capital and strategy", url: "/tools/broker-finder", type: "tool" as const },
      { id: "tool-cost-calculator", title: "All-In Trading Cost & Spread Calculator", subtitle: "Compare true pip spreads and round-turn commissions", url: "/tools", type: "tool" as const },
      { id: "tool-compare", title: "Side-by-Side Broker Comparison Matrix", subtitle: "Compare up to 4 brokers across 40+ audited parameters", url: "/compare", type: "tool" as const },
      { id: "tool-reviews", title: "Verified Community Reviews & Ratings", subtitle: "Real trader experiences backed by live account proofs", url: "/reviews", type: "tool" as const },
      { id: "tool-methodology", title: "120-Point Independent Rating Methodology", subtitle: "How we audit regulatory registries, slippage, and fees", url: "/how-we-rate", type: "tool" as const },
    ].filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q));

    const regulators: SearchResultItem[] = [
      { id: "reg-fca", title: "FCA — Financial Conduct Authority (UK)", subtitle: "Tier-1 regulator with £85,000 FSCS statutory investor protection", url: "/regulation/fca", type: "regulator" as const, badge: "Tier-1" },
      { id: "reg-asic", title: "ASIC — Australian Securities and Investments Commission", subtitle: "Tier-1 regulator with mandatory client asset segregation", url: "/regulation/asic", type: "regulator" as const, badge: "Tier-1" },
      { id: "reg-cysec", title: "CySEC — Cyprus Securities and Exchange Commission", subtitle: "Tier-1 EU regulator with €20,000 Investor Compensation Fund (ICF)", url: "/regulation/cysec", type: "regulator" as const, badge: "Tier-1" },
      { id: "reg-bafin", title: "BaFin — Federal Financial Supervisory Authority (Germany)", subtitle: "Tier-1 German oversight with strict negative balance protection", url: "/regulation/bafin", type: "regulator" as const, badge: "Tier-1" },
      { id: "reg-hub", title: "Global Regulatory Registry & Safety Hub", subtitle: "Official government database lookup and verification guides", url: "/regulation", type: "regulator" as const, badge: "Hub" },
    ].filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q));

    if (selectedFilterCategory === "brokers") return matchedBrokers;
    if (selectedFilterCategory === "regulators") return regulators;
    if (selectedFilterCategory === "tools") return tools;

    return [...matchedBrokers.slice(0, 5), ...regulators.slice(0, 3), ...tools.slice(0, 3)];
  }, [paletteQuery, selectedFilterCategory]);

  const handleMouseEnter = (menuName: string) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuName);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedItem = searchResults[selectedIndex];
      if (selectedItem) {
        navigate(selectedItem.url);
        setShowCommandPalette(false);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-200">
        {/* ========================================================================= */}
        {/* TIER 1: TOP REGULATORY STATUS & UTILITY BAR */}
        {/* (Smoothly collapses on scroll for sleek compact sticky mode) */}
        {/* ========================================================================= */}
        <div
          className={`bg-slate-900 border-b border-slate-800 text-slate-300 text-[11px] transition-all duration-300 overflow-hidden ${
            isScrolled ? "max-h-0 opacity-0 py-0 border-none" : "max-h-12 opacity-100 py-1.5"
          }`}
        >
          <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between gap-4">
            {/* Left: Regulatory Trust & Scope Indicators */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>140+ Tier-1 & Tier-2 Regulated Brokers Monitored</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <span className="hidden md:inline text-slate-400">
                Supervised Oversight: <strong className="text-slate-200 font-medium">UK FCA, ASIC, CySEC, BaFin</strong>
              </span>
            </div>

            {/* Right: Quick Links & Transparency Actions */}
            <div className="flex items-center gap-4 shrink-0 text-slate-400">
              <Link
                to="/community/convocation"
                className="hover:text-amber-400 flex items-center gap-1.5 text-amber-300 font-medium transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span>Convocation 2026</span>
              </Link>
              <span className="text-slate-700">|</span>
              <Link
                to="/how-we-rate"
                className="hover:text-slate-200 hidden sm:inline transition-colors"
              >
                120-Point Methodology
              </Link>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <button
                type="button"
                onClick={() => setShowAffiliateModal(true)}
                className="hover:text-slate-200 transition-colors cursor-pointer"
              >
                Advertiser Disclosure
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TIER 2: MAIN GLASSMORPHIC NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 shadow-xs transition-all duration-200">
          <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
                <img
                  src={logo}
                  alt="WikiIFX Broker Review"
                  className="h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
              {/* Brokers Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("brokers")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/brokers"
                  className={`flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors ${
                    activeMegaMenu === "brokers" || location.pathname.startsWith("/brokers")
                      ? "bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400"
                      : ""
                  }`}
                >
                  <span>Brokers</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      activeMegaMenu === "brokers" ? "rotate-180 text-amber-500" : ""
                    }`}
                  />
                </Link>
              </div>

              {/* Compare Direct Link with Live Selected Badge */}
              <Link
                to="/compare"
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors ${
                  location.pathname === "/compare" ? "bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400" : ""
                }`}
              >
                <Scale className="h-3.5 w-3.5 text-slate-400" />
                <span>Compare</span>
                {selectedBrokerIds.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] leading-none">
                    {selectedBrokerIds.length}
                  </span>
                )}
              </Link>

              {/* Best Brokers Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("best-brokers")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/best-brokers/overall"
                  className={`flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors ${
                    activeMegaMenu === "best-brokers" || location.pathname.startsWith("/best-brokers")
                      ? "bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400"
                      : ""
                  }`}
                >
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>Best Brokers</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      activeMegaMenu === "best-brokers" ? "rotate-180 text-amber-500" : ""
                    }`}
                  />
                </Link>
              </div>

              {/* User Reviews */}
              <Link
                to="/reviews"
                className={`px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors ${
                  location.pathname.startsWith("/reviews") ? "bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400" : ""
                }`}
              >
                Reviews
              </Link>

              {/* Regulation Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("regulation")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/regulation"
                  className={`flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors ${
                    activeMegaMenu === "regulation" || location.pathname.startsWith("/regulation")
                      ? "bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400"
                      : ""
                  }`}
                >
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Regulation</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      activeMegaMenu === "regulation" ? "rotate-180 text-amber-500" : ""
                    }`}
                  />
                </Link>
              </div>

              {/* Tools Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("tools")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/tools"
                  className={`flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors ${
                    activeMegaMenu === "tools" || location.pathname.startsWith("/tools")
                      ? "bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400"
                      : ""
                  }`}
                >
                  <Calculator className="h-3.5 w-3.5 text-blue-500" />
                  <span>Tools</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      activeMegaMenu === "tools" ? "rotate-180 text-amber-500" : ""
                    }`}
                  />
                </Link>
              </div>

              {/* Complaints Hub */}
              <Link
                to="/complaints"
                className={`px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors ${
                  location.pathname.startsWith("/complaints") ? "bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400" : ""
                }`}
              >
                Complaints
              </Link>
            </nav>

            {/* Right Action Strip */}
            <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
              {/* Command Palette Trigger Button */}
              <button
                type="button"
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-amber-500/40 text-xs transition-all cursor-pointer shadow-2xs group"
                aria-label="Open global search command palette"
              >
                <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                <span className="hidden md:inline font-medium text-slate-600 dark:text-slate-400">Search brokers...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Mode Toggle (Dark / Light Theme) */}
              <ModeToggle />

              {/* User Profile Pill & Rich Dropdown */}
              <div className="relative" ref={userMenuRef}>
                {session.isAuthenticated && session.user ? (
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    aria-label="User profile menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="relative h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-2xs">
                      {session.user.displayName.substring(0, 2).toUpperCase()}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[85px] truncate">
                      {session.user.displayName}
                    </span>
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                    aria-label="Sign In or Join"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}

                {/* Enhanced User Profile Dropdown */}
                {isUserMenuOpen && session.isAuthenticated && session.user && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150 text-xs">
                    {/* User Profile Info Card */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                          {session.user.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate flex items-center gap-1.5">
                            <span>{session.user.displayName}</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{session.user.email}</div>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="font-medium text-slate-500 dark:text-slate-400">Account Tier</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold uppercase tracking-wider">
                          {session.user.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-0.5 font-medium text-slate-700 dark:text-slate-300">
                      <Link
                        to="/reviews"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span>My Reviews & Community</span>
                      </Link>
                      <Link
                        to="/compare"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Scale className="h-4 w-4 text-slate-400" />
                          <span>Comparison Tray</span>
                        </div>
                        {selectedBrokerIds.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                            {selectedBrokerIds.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/complaints"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <ShieldAlert className="h-4 w-4 text-slate-400" />
                        <span>My Dispute Exposures</span>
                      </Link>
                      <Link
                        to="/tools/broker-finder"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>Broker Match Wizard</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setShowAffiliateModal(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                      >
                        <Info className="h-4 w-4 text-slate-400" />
                        <span>Advertiser Disclosure</span>
                      </button>
                    </div>

                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                    {/* Sign Out Action */}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Find My Broker High-Impact CTA Button */}
              <Link
                to="/tools/broker-finder"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold shadow-xs hover:shadow-amber-500/20 transition-all whitespace-nowrap shrink-0 active:scale-95 leading-none"
              >
                <Sparkles className="h-3.5 w-3.5 text-slate-950 shrink-0" />
                <span>Find My Broker</span>
              </Link>

              {/* Mobile Hamburger Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation drawer"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP MEGA MENUS */}
        {/* ========================================================================= */}
        {activeMegaMenu && (
          <div
            className="absolute left-0 right-0 top-full bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xl z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150"
            onMouseEnter={() => handleMouseEnter(activeMegaMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1240px] mx-auto px-6 py-6">
              {/* Brokers Mega Menu */}
              {activeMegaMenu === "brokers" && (
                <div className="grid grid-cols-4 gap-8 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      Popular Categories
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/overall" className="hover:text-amber-600 dark:hover:text-white font-medium flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Best Overall Brokers 2026</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold rounded">TOP 10</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/beginners" className="hover:text-amber-600 dark:hover:text-white flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Best for Beginners</span>
                          <span className="text-[10px] px-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">Guide</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/low-spreads" className="hover:text-amber-600 dark:hover:text-white flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Lowest Spread Brokers</span>
                          <span className="text-[10px] px-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-mono">0.0 p</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?filter=zero-deposit" className="hover:text-amber-600 dark:hover:text-white flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Zero Minimum Deposit</span>
                          <span className="text-[10px] px-1 bg-slate-100 dark:bg-slate-800 rounded">$0 Min</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?filter=swap-free" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Islamic / Swap-Free Accounts</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-blue-500" />
                      By Platform Ecosystem
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/mt4" className="hover:text-amber-600 dark:hover:text-white group flex items-center justify-between">
                          <span className="group-hover:translate-x-0.5 transition-transform">MetaTrader 4 (MT4) Brokers</span>
                          <span className="text-[10px] px-1 bg-slate-100 dark:bg-slate-800 rounded">Classic</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/mt5" className="hover:text-amber-600 dark:hover:text-white group flex items-center justify-between">
                          <span className="group-hover:translate-x-0.5 transition-transform">MetaTrader 5 (MT5) Brokers</span>
                          <span className="text-[10px] px-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded">Popular</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/tradingview" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium group flex items-center justify-between">
                          <span className="group-hover:translate-x-0.5 transition-transform">TradingView Integrated</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded font-semibold">HOT</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?platform=cTrader" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">cTrader DMA / ECN</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?platform=proprietary" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Proprietary Mobile & Web</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      By Trading Style
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/scalping" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Day Trading & Scalping</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=ecn" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">True ECN / Raw Spread</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=copy" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Copy & Social Trading</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=ea" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Algorithmic / EA / API Trading</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/brokers?style=high-leverage" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">High Leverage Options</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Spotlight Finder Card */}
                  <div className="bg-gradient-to-br from-amber-500/10 via-slate-50 to-amber-500/5 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 p-4 rounded-xl border border-amber-500/20 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] mb-2">
                        <Sparkles className="h-3 w-3" />
                        Guided Broker Match
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1.5">
                        Find My Ideal Broker
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        Answer 5 quick questions and our unbiased matching algorithm pairs you with the highest-rated broker for your strategy.
                      </p>
                    </div>
                    <div>
                      <Link
                        to="/tools/broker-finder"
                        className="inline-flex items-center justify-center gap-1.5 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs transition-colors shadow-2xs"
                      >
                        <span>Start Broker Finder (60s)</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px]">
                        <Link to="/brokers" className="text-slate-600 dark:text-slate-400 hover:underline">
                          All 140+ Brokers
                        </Link>
                        <Link to="/how-we-rate" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                          How We Rate
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Best Brokers Mega Menu */}
              {activeMegaMenu === "best-brokers" && (
                <div className="grid grid-cols-3 gap-8 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      Editorial Curations (2026)
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/overall" className="hover:text-amber-600 dark:hover:text-white font-medium flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">★ Best Overall Forex Brokers</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold rounded">TOP</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/beginners" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🔰 Best Forex Brokers for Beginners</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/low-spreads" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">⚡ Best for Low Spreads & ECN</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/scalping" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🎯 Best for Scalping & Fast Execution</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-blue-500" />
                      By Platform & Tool
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/best-brokers/tradingview" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium group flex items-center justify-between">
                          <span className="group-hover:translate-x-0.5 transition-transform">📊 Best TradingView Brokers</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded">Top Choice</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/mt4" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">💻 Best MetaTrader 4 (MT4)</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/best-brokers/mt5" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🚀 Best MetaTrader 5 (MT5)</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Audited Ranking Methodology
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        Rankings are 100% data-driven based on Tier-1 regulatory audits, live account execution testing, and verified fee analysis.
                      </p>
                    </div>
                    <Link
                      to="/how-we-rate"
                      className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      <span>Read Full 120-Point Methodology</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Regulation Mega Menu */}
              {activeMegaMenu === "regulation" && (
                <div className="grid grid-cols-4 gap-8 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      Tier-1 Supervised Regulators
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/regulation/fca" className="hover:text-amber-600 dark:hover:text-white font-medium flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🇬🇧 FCA — United Kingdom</span>
                          <span className="text-[10px] px-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded">£85k FSCS</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation/asic" className="hover:text-amber-600 dark:hover:text-white font-medium flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🇦🇺 ASIC — Australia</span>
                          <span className="text-[10px] px-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded">AFSL</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation/cysec" className="hover:text-amber-600 dark:hover:text-white font-medium flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🇨🇾 CySEC — Cyprus / EU</span>
                          <span className="text-[10px] px-1 bg-slate-100 dark:bg-slate-800 rounded">€20k ICF</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation/bafin" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🇩🇪 BaFin — Germany</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      Tier-2 & Regional
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/regulation" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🇦🇪 DFSA — Dubai DIFC</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🇿🇦 FSCA — South Africa</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🇸🇬 MAS — Singapore</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                      Safety & Verification
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/regulation" className="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium group">
                          <span className="group-hover:translate-x-0.5 transition-transform">🛡️ 4-Step License Verification</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Negative Balance Protection Rules</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/regulation" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Segregated Client Fund Audits</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2">
                        Official License Registry
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                        Verify any broker’s official regulatory register number directly against verified government databases.
                      </p>
                    </div>
                    <Link
                      to="/regulation"
                      className="inline-block w-full text-center bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold py-2 px-3 rounded-lg text-xs transition-colors"
                    >
                      Explore Regulation Hub →
                    </Link>
                  </div>
                </div>
              )}

              {/* Tools Mega Menu */}
              {activeMegaMenu === "tools" && (
                <div className="grid grid-cols-3 gap-8 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5 text-blue-500" />
                      Interactive Calculators
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/tools" className="hover:text-amber-600 dark:hover:text-white font-medium flex items-center justify-between group">
                          <span className="group-hover:translate-x-0.5 transition-transform">All-In Trading Cost Calculator</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded">Live</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/tools" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Pip Value & Margin Estimator</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/tools" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Currency Converter & Swap Fee Matrix</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Scale className="h-3.5 w-3.5 text-amber-500" />
                      Comparison & Selection
                    </h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        <Link to="/compare" className="hover:text-amber-600 dark:hover:text-white font-medium group flex items-center justify-between">
                          <span className="group-hover:translate-x-0.5 transition-transform">Side-by-Side Comparison Matrix</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded font-bold">4-Way</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/tools/broker-finder" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Broker Match Wizard (60-Sec Quiz)</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/reviews/write" className="hover:text-amber-600 dark:hover:text-white group">
                          <span className="group-hover:translate-x-0.5 transition-transform">Submit Verified Trader Review</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2 flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-amber-500" />
                        True Cost Benchmarking
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        Compare hidden commissions, real rollover fees, and live market spreads across Tier-1 audited brokers.
                      </p>
                    </div>
                    <Link
                      to="/tools"
                      className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      <span>Open Trading Tools Suite</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MOBILE NAVIGATION DRAWER */}
        {/* ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[52px] bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-200">
            <div className="fixed inset-y-0 right-0 top-[52px] w-full max-w-sm bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto p-4 flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div className="space-y-4">
                {/* Mobile Search Button Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowCommandPalette(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 text-xs text-left"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <span>Search brokers, licenses, tools...</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    ⌘K
                  </kbd>
                </button>

                {/* User Status Card in Mobile Drawer */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  {session.isAuthenticated && session.user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                          {session.user.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{session.user.displayName}</div>
                          <div className="text-[10px] text-slate-500">{session.user.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Sign Out"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100">Trader Access</div>
                        <div className="text-[10px] text-slate-500">Sign in to write verified reviews</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowAuthModal(true);
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>

                {/* Wizard Highlight Card */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/5 dark:from-amber-950/30 dark:to-slate-900 border border-amber-500/20">
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Find My Broker (60s Quiz)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2.5">
                    Match with top-tier regulated brokers for your trading needs.
                  </p>
                  <Link
                    to="/tools/broker-finder"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition-colors"
                  >
                    Launch Finder Wizard →
                  </Link>
                </div>

                {/* Categorized Nav Links */}
                <nav className="space-y-3 text-xs font-semibold">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Core Directory</div>
                    <div className="space-y-0.5">
                      <Link
                        to="/brokers"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        All Brokers Directory (140+)
                      </Link>
                      <Link
                        to="/compare"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        <span>Side-by-Side Comparison</span>
                        {selectedBrokerIds.length > 0 && (
                          <span className="text-[10px] px-1.5 bg-amber-500 text-slate-950 font-bold rounded-full">
                            {selectedBrokerIds.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/reviews"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        User Reviews & Ratings
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Best Brokers Rankings</div>
                    <div className="space-y-0.5">
                      <Link
                        to="/best-brokers/overall"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        Best Overall Forex Brokers (2026)
                      </Link>
                      <Link
                        to="/best-brokers/beginners"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        Best for Beginners
                      </Link>
                      <Link
                        to="/best-brokers/low-spreads"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        Lowest Spread Brokers
                      </Link>
                      <Link
                        to="/best-brokers/tradingview"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        Best TradingView Brokers
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Research & Community</div>
                    <div className="space-y-0.5">
                      <Link
                        to="/regulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        Regulation & Safety Hub
                      </Link>
                      <Link
                        to="/tools"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        Trading Calculators
                      </Link>
                      <Link
                        to="/community/convocation"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold"
                      >
                        <span>Global Convocation 2026</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-rose-500 text-white rounded font-mono font-bold">LIVE</span>
                      </Link>
                      <Link
                        to="/complaints"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        Complaints & Exposures
                      </Link>
                      <Link
                        to="/how-we-rate"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        120-Point Methodology
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowAffiliateModal(true);
                  }}
                  className="text-slate-500 dark:text-slate-400 hover:underline text-[11px]"
                >
                  Advertiser Disclosure
                </button>
                <div className="text-[10px] text-slate-400 font-mono">v2.6 Live</div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* GLOBAL COMMAND PALETTE (⌘K / Ctrl+K MODAL) */}
      {/* ========================================================================= */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Box */}
            <div className="relative border-b border-slate-200 dark:border-slate-800 p-3 flex items-center gap-3">
              <Search className="h-5 w-5 text-amber-500 shrink-0 ml-1" />
              <input
                ref={paletteInputRef}
                type="text"
                placeholder="Search brokers, licenses (e.g. FCA, ASIC), platforms, tools..."
                value={paletteQuery}
                onChange={(e) => {
                  setPaletteQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handlePaletteKeyDown}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
              {paletteQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setPaletteQuery("");
                    paletteInputRef.current?.focus();
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  ESC
                </kbd>
              )}
            </div>

            {/* Filter Category Tabs */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs">
              {(
                [
                  { key: "all", label: "All Results" },
                  { key: "brokers", label: "Brokers" },
                  { key: "regulators", label: "Regulators" },
                  { key: "tools", label: "Tools & Guides" },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedFilterCategory(cat.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedFilterCategory === cat.key
                      ? "bg-amber-500 text-slate-950 shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Command Palette Body Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {paletteQuery.trim().length === 0 ? (
                <div className="p-4 space-y-4">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      Popular Queries
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["IC Markets", "Pepperstone", "Exness", "FCA Regulated", "Raw Spreads", "TradingView", "Zero Deposit", "cTrader"].map(
                        (tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setPaletteQuery(tag);
                              paletteInputRef.current?.focus();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                      Quick Navigation
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Link
                        to="/tools/broker-finder"
                        onClick={() => setShowCommandPalette(false)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                      >
                        <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">Broker Match Wizard</div>
                          <div className="text-[10px] text-slate-500">60-second quiz engine</div>
                        </div>
                      </Link>
                      <Link
                        to="/compare"
                        onClick={() => setShowCommandPalette(false)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                      >
                        <Scale className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">Compare Matrix</div>
                          <div className="text-[10px] text-slate-500">Side-by-side specs</div>
                        </div>
                      </Link>
                      <Link
                        to="/best-brokers/overall"
                        onClick={() => setShowCommandPalette(false)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                      >
                        <Award className="h-4 w-4 text-amber-500 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">Best Brokers 2026</div>
                          <div className="text-[10px] text-slate-500">Annual editorial awards</div>
                        </div>
                      </Link>
                      <Link
                        to="/regulation"
                        onClick={() => setShowCommandPalette(false)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4 text-blue-500 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">Regulation Hub</div>
                          <div className="text-[10px] text-slate-500">FCA, ASIC, CySEC registry</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <Link
                        key={item.id}
                        to={item.url}
                        onClick={() => setShowCommandPalette(false)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-500/10 dark:bg-slate-800 border border-amber-500/30"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-200 shrink-0">
                            {item.type === "broker" && <Star className="h-4 w-4 text-amber-500" />}
                            {item.type === "regulator" && <Shield className="h-4 w-4 text-emerald-500" />}
                            {item.type === "tool" && <Calculator className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs truncate">
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded font-mono font-medium">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pl-3 shrink-0">
                          {item.rating && (
                            <span className="font-bold text-amber-500 text-xs flex items-center gap-0.5">
                              ★ {item.rating.toFixed(1)}
                            </span>
                          )}
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <ShieldAlert className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
                    No results found for "{paletteQuery}"
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Try searching for broker names, license numbers (e.g. FCA), trading platforms, or calculators.
                  </p>
                  <Link
                    to="/brokers"
                    onClick={() => setShowCommandPalette(false)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg text-xs"
                  >
                    Browse Directory →
                  </Link>
                </div>
              )}
            </div>

            {/* Command Palette Footer */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">↓</kbd> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">↵</kbd> to select
                </span>
              </div>
              <Link
                to={`/brokers?q=${encodeURIComponent(paletteQuery)}`}
                onClick={() => setShowCommandPalette(false)}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                View in Directory →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADVERTISER DISCLOSURE MODAL */}
      {/* ========================================================================= */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setShowAffiliateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Advertiser & Affiliate Transparency
                </h3>
                <p className="text-[11px] text-slate-500">Editorial Independence Guarantee</p>
              </div>
            </div>
            <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>WikiiFX</strong> is an independent financial research and regulatory inquiry platform. We are committed to absolute transparency, data integrity, and strict objectivity across all evaluations.
              </p>
              <p>
                To support our extensive testing and live account audits, we may receive compensation when you open an account through links on our platform.
              </p>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
                🛡️ <strong>Our Editorial Guarantee:</strong> Commercial relationships never influence our editorial ratings, ranking algorithms, or fact-checked reviews. Brokers cannot pay for higher scores or positive verdicts.
              </div>
              <p className="text-[11px] text-slate-500">
                CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 70% and 85% of retail investor accounts lose money when trading CFDs.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAffiliateModal(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer text-xs"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTHENTICATION / LOGIN POPUP MODAL */}
      {/* ========================================================================= */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
