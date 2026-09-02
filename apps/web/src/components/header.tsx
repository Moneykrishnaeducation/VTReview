import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import {
  Search,
  Globe,
  Shield,
  Scale,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Star,
  CheckCircle2,
} from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RANKED_BROKERS } from "@/data/rankings-data";

export default function Header() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const links = [
    { to: "/", label: "Home" },
    { to: "/rankings", label: "Broker Rankings", badge: "2026" },
    { to: "/search", label: "Directory & Reviews" },
    { to: "/compare", label: "Compare" },
    { to: "/news", label: "Market News", badge: "Live" },
    { to: "/admin", label: "Admin" },
  ];

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const searchResults = RANKED_BROKERS.filter((b) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.headquarters.toLowerCase().includes(q) ||
      b.regulators.some((r) => r.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  const handleSelectBroker = (brokerId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/broker/${brokerId}`);
  };

  return (
    <>
      {/* 1. Top Micro Bar: Live Intelligence & Trust Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800 hidden sm:block">
        <div className="container mx-auto flex items-center justify-between h-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Surveillance Active
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              <strong className="text-white font-semibold">10,480+</strong> Brokers Monitored • <strong className="text-white font-semibold">54</strong> Regulators
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <Link to="/news?category=Regulation+%26+Alerts" className="hover:text-rose-300 flex items-center gap-1 transition-colors">
              <AlertTriangle className="h-3 w-3 text-rose-400" />
              <span>Scam Blacklist (4 New)</span>
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/compare" className="hover:text-sky-300 flex items-center gap-1 transition-colors">
              <Scale className="h-3 w-3 text-sky-400" />
              <span>Broker Compare</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card/90 backdrop-blur-md shadow-xs transition-colors">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 lg:px-6">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-5 xl:gap-7">
            <NavLink to="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-600 via-primary to-cyan-400 text-white font-black text-sm shadow-xs shadow-primary/20 group-hover:scale-105 transition-transform">
                <Shield className="h-4 w-4 absolute opacity-25 text-white" />
                <span className="relative z-10 tracking-tighter">VT</span>
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground flex items-center gap-1.5">
                VTINDEX
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 leading-none">
                  PRO
                </span>
              </span>
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map(({ to, label, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all relative flex items-center gap-1.5 leading-none ${
                      isActive
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`
                  }
                >
                  <span>{label}</span>
                  {badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 leading-none">
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Utilities (Search, Actions, Theme Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search Launcher Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 h-8 w-36 md:w-52 rounded-lg border border-input bg-muted/40 hover:bg-muted px-2.5 text-xs text-muted-foreground transition-all shadow-2xs hover:border-primary/40 focus:outline-none"
            >
              <Search className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate text-left flex-1">Search brokers...</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border bg-background px-1 font-mono text-[9px] font-medium text-muted-foreground opacity-100 shrink-0">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </button>

            {/* Compare Quick Access */}
            <Link to="/compare" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground">
                <Scale className="h-3.5 w-3.5 text-primary" />
                <span className="hidden xl:inline">Compare</span>
              </Button>
            </Link>

            {/* Dark / Light Mode Toggle */}
            <ModeToggle />

            {/* User Actions */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Link to="/search">
                <Button variant="outline" size="sm" className="h-8 px-3 font-medium text-xs rounded-lg">
                  Verify
                </Button>
              </Link>
              <Link to="/rankings">
                <Button size="sm" className="h-8 px-3 font-bold text-xs rounded-lg shadow-xs shadow-primary/20 bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white">
                  Rankings
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-lg lg:hidden flex flex-col p-6 animate-in fade-in slide-in-from-top-4 duration-200 border-b">
          <div className="flex flex-col gap-2 flex-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Navigation
            </div>
            {links.map(({ to, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                <span>{label}</span>
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-6 border-t flex flex-col gap-3">
            <Link to="/search" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full justify-center h-11 text-sm font-semibold rounded-xl">
                Search & Verify Any Broker
              </Button>
            </Link>
            <Link to="/compare" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center h-11 text-sm font-semibold rounded-xl">
                Head-to-Head Compare
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Live Interactive Search Modal / Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
          <div 
            className="bg-card w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b gap-3 bg-muted/20">
              <Search className="h-5 w-5 text-primary shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search broker name, regulator (e.g. FCA, ASIC), or feature..."
                className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold px-2 py-1 rounded-md bg-muted"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Results / Suggestions */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                      Matching Brokers ({searchResults.length})
                    </div>
                    {searchResults.map((broker) => (
                      <div
                        key={broker.id}
                        onClick={() => handleSelectBroker(broker.id)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/60 cursor-pointer transition-colors border border-transparent hover:border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                            {broker.logo}
                          </div>
                          <div>
                            <div className="font-semibold text-sm flex items-center gap-2">
                              {broker.name}
                              <span className="text-xs text-muted-foreground font-normal">
                                {broker.countryFlag} {broker.headquarters}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span>Regulators: {broker.regulators.slice(0, 3).join(", ")}</span>
                              <span>•</span>
                              <span>Deposit: ${broker.minDeposit}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
                              <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                              {broker.overallScore}/10
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {broker.reviewsCount} reviews
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="font-medium text-sm">No brokers found matching "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try searching for "Exness", "IC Markets", "ASIC", or "TradingView"</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                      Trending Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["IC Markets", "Exness", "Pepperstone", "XM Global", "FTMO Prop Firm", "FCA Regulated"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center gap-1.5"
                        >
                          <TrendingUp className="h-3 w-3 text-primary" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                      Popular Top Rated Brokers
                    </div>
                    <div className="space-y-1">
                      {RANKED_BROKERS.slice(0, 3).map((broker) => (
                        <div
                          key={broker.id}
                          onClick={() => handleSelectBroker(broker.id)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                              {broker.logo}
                            </div>
                            <span className="font-medium text-sm">{broker.name}</span>
                            <Badge variant="outline" className="text-[10px] py-0 h-4 text-emerald-500 border-emerald-500/30">
                              {broker.regulatoryStatus}
                            </Badge>
                          </div>
                          <span className="text-xs text-primary font-semibold flex items-center gap-1">
                            Score {broker.overallScore} <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Footer */}
            <div className="p-3 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground px-4">
              <span>Press <kbd className="font-mono bg-background px-1 rounded border">ESC</kbd> to exit</span>
              <Link
                to="/search"
                onClick={() => setIsSearchOpen(false)}
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                Open Full Directory <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

