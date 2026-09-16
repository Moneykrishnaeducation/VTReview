import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { EditorialGuide } from "../../types/admin";
import { StatusBadge } from "../../components/status-badge";
import {
  BookOpen,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Save,
  Search,
  Sparkles,
} from "lucide-react";

export default function EditorialCms() {
  const { guides, publishGuide, activeRoleDef } = useAdmin();
  const [selectedGuideId, setSelectedGuideId] = useState<string>(guides[0]?.id || "");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedGuide = guides.find((g) => g.id === selectedGuideId) || guides[0];

  const handlePublish = (id: string) => {
    publishGuide(id);
    setActionSuccess("Editorial guide certified by compliance and published to public platform!");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] mb-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>EDITORIAL CONTENT MANAGEMENT SYSTEM</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Research Guides, Market Dispatches & Publishing Pipeline
          </h1>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Split-Pane CMS Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Col (5 cols): Guides List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span>Editorial Articles ({guides.length})</span>
            <span className="text-[10px] text-slate-500 font-mono">PUBLISHING RUNWAY</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto custom-scrollbar">
            {guides.map((item) => {
              const isSelected = item.id === selectedGuideId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedGuideId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-indigo-50/50 dark:bg-slate-950 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/20"
                      : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-indigo-700 dark:text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 rounded">
                      {item.category}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{item.title}</h4>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-800/80">
                    <span>By {item.authorName}</span>
                    <span>{item.readingTimeMinutes} min read</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Article Editor & Compliance Sign-off */}
        {selectedGuide ? (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-indigo-700 dark:text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {selectedGuide.category}
                  </span>
                  <StatusBadge status={selectedGuide.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedGuide.title}</h3>
                <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Author: <strong className="text-slate-800 dark:text-slate-200">{selectedGuide.authorName}</strong> ({selectedGuide.authorRole})
                </div>
              </div>
            </div>

            {/* Fact Check & Citation Compliance Audit */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Primary Sources & Citation Verification ({selectedGuide.sourcesCount})</span>
              </div>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                {selectedGuide.sourcesList.map((s, idx) => (
                  <li key={idx} className="line-clamp-1">{s}</li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
                <div>Fact Checked: <strong className="text-slate-700 dark:text-slate-300">{selectedGuide.factCheckedBy || "Elena Rostova"}</strong></div>
                <div>Compliance Signed: <strong className="text-slate-700 dark:text-slate-300">{selectedGuide.complianceSignedBy || "Marcus Vance"}</strong></div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-500">Executive Summary</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedGuide.summary}</p>
            </div>

            {/* SEO & Canonical Settings */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="text-[10px] uppercase font-bold text-slate-500">SEO Metadata</div>
              <div>Slug: <span className="text-amber-600 dark:text-amber-400 font-bold">/guides/{selectedGuide.slug}</span></div>
              <div className="text-slate-600 dark:text-slate-400 truncate">Title: {selectedGuide.seoTitle}</div>
            </div>

            {/* Publishing Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">
                Action by: <strong className="text-slate-800 dark:text-slate-300">{activeRoleDef.name}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePublish(selectedGuide.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>Certify & Publish Guide</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
