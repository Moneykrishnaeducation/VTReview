import React, { useState } from "react";
import { useAdmin } from "../context/admin-context";
import { Link, useNavigate } from "react-router";
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
  AlertTriangle,
} from "lucide-react";

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, brokers, regulators, evidenceList, reviews, guides, users } = useAdmin();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search across entities
  const matchingBrokers = trimmed
    ? brokers.filter((b) => b.name.toLowerCase().includes(trimmed) || b.slug.includes(trimmed) || b.primaryRegulator.toLowerCase().includes(trimmed))
    : [];

  const matchingRegulators = trimmed
    ? regulators.filter((r) => r.code.toLowerCase().includes(trimmed) || r.name.toLowerCase().includes(trimmed) || r.jurisdiction.toLowerCase().includes(trimmed))
    : [];

  const matchingEvidence = trimmed
    ? evidenceList.filter((e) => e.id.toLowerCase().includes(trimmed) || e.title.toLowerCase().includes(trimmed) || e.relatedEntityName.toLowerCase().includes(trimmed))
    : [];

  const matchingReviews = trimmed
    ? reviews.filter((r) => r.id.toLowerCase().includes(trimmed) || r.userName.toLowerCase().includes(trimmed) || r.brokerName.toLowerCase().includes(trimmed) || r.title.toLowerCase().includes(trimmed))
    : [];

  const matchingGuides = trimmed
    ? guides.filter((g) => g.title.toLowerCase().includes(trimmed) || g.category.toLowerCase().includes(trimmed) || g.authorName.toLowerCase().includes(trimmed))
    : [];

  const matchingUsers = trimmed
    ? users.filter((u) => u.name.toLowerCase().includes(trimmed) || u.email.toLowerCase().includes(trimmed) || u.role.toLowerCase().includes(trimmed))
    : [];

  const totalResults =
    matchingBrokers.length +
    matchingRegulators.length +
    matchingEvidence.length +
    matchingReviews.length +
    matchingGuides.length +
    matchingUsers.length;

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    setQuery("");
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search brokers, licenses, evidence IDs, regulators, guides, users... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-white p-1">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-[11px] font-mono text-slate-400 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {!trimmed && (
            <div className="p-6 text-center text-slate-500 space-y-2">
              <p>Type to search across verified financial entities, audit logs, and evidence vaults.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <span className="px-2 py-1 bg-slate-900 rounded font-mono text-[10px] text-slate-400">"IC Markets"</span>
                <span className="px-2 py-1 bg-slate-900 rounded font-mono text-[10px] text-slate-400">"ASIC"</span>
                <span className="px-2 py-1 bg-slate-900 rounded font-mono text-[10px] text-slate-400">"EVD-2026-00481"</span>
                <span className="px-2 py-1 bg-slate-900 rounded font-mono text-[10px] text-slate-400">"SimonB_FX"</span>
              </div>
            </div>
          )}

          {trimmed && totalResults === 0 && (
            <div className="p-8 text-center text-slate-500">
              No matching administrative records found for "{query}".
            </div>
          )}

          {/* Brokers Group */}
          {matchingBrokers.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-amber-400" />
                <span>Verified Brokers ({matchingBrokers.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingBrokers.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect(`/brokers/${b.slug}`)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-900 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        {b.logo}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-amber-400">{b.name}</div>
                        <div className="text-[11px] text-slate-400">{b.legalEntity} • {b.primaryRegulator}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold">{b.editorialScore} pts</span>
                      <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Regulators Group */}
          {matchingRegulators.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="h-3 w-3 text-blue-400" />
                <span>Regulators Registry ({matchingRegulators.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingRegulators.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(`/regulation/regulators`)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-900 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{r.flag}</span>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-blue-400">{r.code} — {r.name}</div>
                        <div className="text-[11px] text-slate-400">{r.jurisdiction} • {r.tier}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Group */}
          {matchingEvidence.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3 w-3 text-emerald-400" />
                <span>Evidence Vault ({matchingEvidence.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingEvidence.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => handleSelect(`/evidence`)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-900 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-mono text-emerald-400 font-bold">{ev.id}</div>
                      <div className="text-slate-200 group-hover:text-white">{ev.title}</div>
                      <div className="text-[11px] text-slate-500">{ev.relatedEntityName} • {ev.uploadedAt}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guides Group */}
          {matchingGuides.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-indigo-400" />
                <span>Editorial Guides ({matchingGuides.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingGuides.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSelect(`/editorial/guides/${g.id}`)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-900 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-100 group-hover:text-indigo-400">{g.title}</div>
                      <div className="text-[11px] text-slate-500">{g.category} • by {g.authorName}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Global Research Operations Search</span>
          <span>Press <strong>ESC</strong> to dismiss</span>
        </div>
      </div>
    </div>
  );
}
