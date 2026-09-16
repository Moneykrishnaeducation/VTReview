import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAdmin } from "../context/admin-context";
import { useNavigate } from "react-router";
import {
  Search,
  X,
  Building2,
  Scale,
  FileText,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  ArrowRight,
  ShieldCheck,
  Shield,
  AlertTriangle,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Command,
  FileCheck,
  Check
} from "lucide-react";

interface FlatSearchResult {
  id: string;
  group: "broker" | "regulator" | "evidence" | "review" | "guide" | "user";
  groupLabel: string;
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
  score?: string | number;
  icon: React.ReactNode;
}

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, brokers, regulators, evidenceList, reviews, guides, users } = useAdmin();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  // Search across entities and construct flat results list
  const flatResults = useMemo<FlatSearchResult[]>(() => {
    if (!trimmed) return [];

    const list: FlatSearchResult[] = [];

    // 1. Brokers
    const matchingBrokers = brokers.filter(
      (b) => b.name.toLowerCase().includes(trimmed) || b.slug.includes(trimmed) || b.primaryRegulator.toLowerCase().includes(trimmed)
    );
    matchingBrokers.forEach((b) => {
      list.push({
        id: b.id,
        group: "broker",
        groupLabel: "Verified Brokers",
        title: b.name,
        subtitle: `${b.legalEntity} • ${b.primaryRegulator}`,
        url: `/brokers/${b.slug}`,
        score: `${b.editorialScore} pts`,
        icon: <Building2 className="h-4 w-4 text-amber-500" />,
      });
    });

    // 2. Regulators
    const matchingRegulators = regulators.filter(
      (r) => r.code.toLowerCase().includes(trimmed) || r.name.toLowerCase().includes(trimmed) || r.jurisdiction.toLowerCase().includes(trimmed)
    );
    matchingRegulators.forEach((r) => {
      list.push({
        id: r.id,
        group: "regulator",
        groupLabel: "Regulators Registry",
        title: `${r.code} — ${r.name}`,
        subtitle: `${r.jurisdiction} • ${r.tier}`,
        url: `/regulation/regulators`,
        badge: r.tier,
        icon: <Scale className="h-4 w-4 text-blue-500" />,
      });
    });

    // 3. Evidence
    const matchingEvidence = evidenceList.filter(
      (e) => e.id.toLowerCase().includes(trimmed) || e.title.toLowerCase().includes(trimmed) || e.relatedEntityName.toLowerCase().includes(trimmed)
    );
    matchingEvidence.forEach((ev) => {
      list.push({
        id: ev.id,
        group: "evidence",
        groupLabel: "Evidence Vault",
        title: `${ev.id} — ${ev.title}`,
        subtitle: `${ev.relatedEntityName} • ${ev.uploadedAt}`,
        url: `/evidence`,
        icon: <FileCheck className="h-4 w-4 text-emerald-500" />,
      });
    });

    // 4. Reviews
    const matchingReviews = reviews.filter(
      (r) => r.id.toLowerCase().includes(trimmed) || r.userName.toLowerCase().includes(trimmed) || r.brokerName.toLowerCase().includes(trimmed) || r.title.toLowerCase().includes(trimmed)
    );
    matchingReviews.forEach((rev) => {
      list.push({
        id: rev.id,
        group: "review",
        groupLabel: "Community Reviews",
        title: `${rev.userName}: "${rev.title}"`,
        subtitle: `Broker: ${rev.brokerName} • Rating: ${rev.rating}/5.0`,
        url: `/reviews`,
        icon: <MessageSquare className="h-4 w-4 text-cyan-500" />,
      });
    });

    // 5. Editorial Guides
    const matchingGuides = guides.filter(
      (g) => g.title.toLowerCase().includes(trimmed) || g.category.toLowerCase().includes(trimmed) || g.authorName.toLowerCase().includes(trimmed)
    );
    matchingGuides.forEach((g) => {
      list.push({
        id: g.id,
        group: "guide",
        groupLabel: "Editorial Guides",
        title: g.title,
        subtitle: `${g.category} • by ${g.authorName}`,
        url: `/editorial`,
        icon: <BookOpen className="h-4 w-4 text-indigo-500" />,
      });
    });

    // 6. Users & Traders
    const matchingUsers = users.filter(
      (u) => u.name.toLowerCase().includes(trimmed) || u.email.toLowerCase().includes(trimmed) || u.role.toLowerCase().includes(trimmed)
    );
    matchingUsers.forEach((u) => {
      const isTrader = u.role === "trader";
      list.push({
        id: u.id,
        group: "user",
        groupLabel: isTrader ? "Platform Traders" : "Admin Staff",
        title: `${u.name} (${u.role.replace("_", " ")})`,
        subtitle: `${u.email} • ${u.country}`,
        url: isTrader ? `/users/traders` : `/users`,
        badge: u.isVerifiedTrader ? "Verified" : undefined,
        icon: isTrader ? <Users className="h-4 w-4 text-amber-500" /> : <Shield className="h-4 w-4 text-purple-500" />,
      });
    });

    return list;
  }, [trimmed, brokers, regulators, evidenceList, reviews, guides, users]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [trimmed]);

  // Focus search input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle keyboard navigation: ArrowUp, ArrowDown, Enter, Escape
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsSearchOpen(false);
        setQuery("");
        return;
      }

      if (flatResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) {
          handleSelect(selected.url);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, flatResults, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeElement && typeof activeElement.scrollIntoView === "function") {
        activeElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  if (!isSearchOpen) return null;

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    setQuery("");
    navigate(url);
  };

  const quickPillQueries = [
    { label: "IC Markets", query: "IC Markets" },
    { label: "ASIC Tier-1", query: "ASIC" },
    { label: "FCA UK", query: "FCA" },
    { label: "Evidence Vault", query: "EVD-2026" },
    { label: "Trader Reviews", query: "SimonB" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsSearchOpen(false);
        }
      }}
    >
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60">
          <Search className="h-5 w-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search brokers, licenses, evidence IDs, regulators, guides, users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div
          ref={resultsContainerRef}
          className="max-h-[60vh] overflow-y-auto p-3 space-y-2 text-xs no-scrollbar"
        >
          {/* Empty State / Search Suggestions */}
          {!trimmed && (
            <div className="p-8 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-2xs">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Global Operational Search</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant keyboard navigation across verified brokers, licenses, evidence files, and user directories.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {quickPillQueries.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setQuery(item.query);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                  >
                    "{item.label}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results State */}
          {trimmed && flatResults.length === 0 && (
            <div className="p-10 text-center text-slate-500 space-y-2">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200">No matching records found</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No verified entities, regulatory records, or files matched "{query}".
              </p>
            </div>
          )}

          {/* Results List */}
          {trimmed && flatResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Search Results ({flatResults.length})</span>
                <span>Use ↑ ↓ to navigate, ↵ to select</span>
              </div>

              {flatResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={`${item.group}-${item.id}`}
                    data-index={index}
                    onClick={() => handleSelect(item.url)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/30 shadow-xs text-slate-900 dark:text-white"
                        : "bg-white dark:bg-slate-950/60 border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 shadow-2xs"
                            : "bg-slate-100 dark:bg-slate-900 text-slate-500"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs truncate">{item.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 shrink-0">
                            {item.groupLabel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.score && (
                        <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                          {item.score}
                        </span>
                      )}
                      {isSelected ? (
                        <div className="flex items-center gap-1 font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                          <span>Enter</span>
                          <CornerDownLeft className="h-3 w-3" />
                        </div>
                      ) : (
                        <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Keyboard Navigation Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold">
                ↓
              </kbd>
              <span>Navigate</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold">
                ↵
              </kbd>
              <span>Select</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold">
                ESC
              </kbd>
              <span>Close</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
            <Sparkles className="h-3 w-3" />
            <span>Fast Global Index</span>
          </div>
        </div>
      </div>
    </div>
  );
}
