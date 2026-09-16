import React, { useState, useMemo } from "react";
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
  Filter,
  X,
  UserCheck,
  Globe,
  Share2,
  Eye,
  FileText,
  Tag,
  Building2,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Edit3,
  RotateCcw,
  Link as LinkIcon,
  AlertCircle
} from "lucide-react";

export default function EditorialCms() {
  const { guides, publishGuide, createGuide, updateGuide, activeRoleDef, brokers } = useAdmin();
  const [selectedGuideId, setSelectedGuideId] = useState<string>(guides[0]?.id || "");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activePaneTab, setActivePaneTab] = useState<"overview" | "citations" | "seo" | "content">("overview");

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSeoTitle, setEditSeoTitle] = useState("");
  const [editSeoDescription, setEditSeoDescription] = useState("");

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategory, setNewCategory] = useState<EditorialGuide["category"]>("Beginner Guide");
  const [newAuthorName, setNewAuthorName] = useState("Dr. Alexander Thorne");
  const [newAuthorRole, setNewAuthorRole] = useState("Lead Financial Analyst");
  const [newReadingTime, setNewReadingTime] = useState(10);
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSources, setNewSources] = useState("");
  const [newFeaturedBrokers, setNewFeaturedBrokers] = useState<string[]>([]);
  const [newSeoTitle, setNewSeoTitle] = useState("");
  const [newSeoDescription, setNewSeoDescription] = useState("");

  // Category Options
  const categoryOptions: EditorialGuide["category"][] = [
    "Beginner Guide",
    "Trading Costs",
    "Regulation & Safety",
    "Platform Comparison",
    "Trading Strategies",
  ];

  // Filtered Guides
  const filteredGuides = useMemo(() => {
    return guides.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      // 2. Category Filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q) ||
          item.authorName.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [guides, statusFilter, categoryFilter, searchQuery]);

  // Selected Guide
  const selectedGuide = guides.find((g) => g.id === selectedGuideId) || filteredGuides[0] || guides[0];

  // Executive Metrics
  const totalGuides = guides.length;
  const publishedGuides = guides.filter((g) => g.status === "published").length;
  const totalCitations = guides.reduce((sum, g) => sum + (g.sourcesCount || g.sourcesList.length || 0), 0);
  const avgReadTime = totalGuides > 0 ? Math.round(guides.reduce((sum, g) => sum + g.readingTimeMinutes, 0) / totalGuides) : 0;

  const handleSelectGuide = (id: string) => {
    setSelectedGuideId(id);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (!selectedGuide) return;
    setEditTitle(selectedGuide.title);
    setEditSummary(selectedGuide.summary);
    setEditContent(selectedGuide.content);
    setEditSeoTitle(selectedGuide.seoTitle);
    setEditSeoDescription(selectedGuide.seoDescription);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedGuide) return;
    updateGuide(selectedGuide.id, {
      title: editTitle.trim() || selectedGuide.title,
      summary: editSummary.trim() || selectedGuide.summary,
      content: editContent.trim() || selectedGuide.content,
      seoTitle: editSeoTitle.trim() || selectedGuide.seoTitle,
      seoDescription: editSeoDescription.trim() || selectedGuide.seoDescription,
    });
    setIsEditing(false);
    setActionSuccess(`Research guide "${selectedGuide.title}" updated successfully!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handlePublish = (id: string) => {
    publishGuide(id);
    setActionSuccess("Editorial guide certified by compliance and published to public platform!");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCreateGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sourcesArray = newSources.split("\n").map((s) => s.trim()).filter(Boolean);

    const created = createGuide({
      slug,
      title: newTitle.trim(),
      category: newCategory,
      authorName: newAuthorName.trim() || activeRoleDef.name,
      authorRole: newAuthorRole.trim() || "Research Analyst",
      status: "published",
      readingTimeMinutes: Number(newReadingTime) || 10,
      summary: newSummary.trim(),
      content: newContent.trim() || newSummary.trim(),
      sourcesCount: sourcesArray.length,
      sourcesList: sourcesArray,
      featuredBrokers: newFeaturedBrokers,
      seoTitle: newSeoTitle.trim() || newTitle.trim(),
      seoDescription: newSeoDescription.trim() || newSummary.trim(),
      factCheckedBy: activeRoleDef.name,
      factCheckedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      complianceSignedBy: activeRoleDef.name,
      complianceSignedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
    });

    setSelectedGuideId(created.id);
    setIsCreateModalOpen(false);
    // Reset inputs
    setNewTitle("");
    setNewSlug("");
    setNewSummary("");
    setNewContent("");
    setNewSources("");
    setNewFeaturedBrokers([]);
    setNewSeoTitle("");
    setNewSeoDescription("");

    setActionSuccess(`Created and published new guide: "${created.title}"`);
    setTimeout(() => setActionSuccess(null), 4500);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Trading Costs":
        return "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900";
      case "Regulation & Safety":
        return "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900";
      case "Beginner Guide":
        return "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900";
      case "Platform Comparison":
        return "text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900";
      default:
        return "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900";
    }
  };

  const hasActiveFilters = searchQuery !== "" || categoryFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs mb-1.5 font-bold">
            <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
            <span>EDITORIAL CONTENT MANAGEMENT SYSTEM</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Research Guides, Market Dispatches & Publishing Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Author, peer review, fact-check, and publish institutional educational guides and broker regulatory research.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Draft New Research Guide</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Executive Editorial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Published Guides</span>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
            {publishedGuides} <span className="text-xs text-slate-400 font-normal">/ {totalGuides} total</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-3 w-3" />
            <span>100% Compliance Verified</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Primary Sources & Citations</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {totalCitations}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Peer-reviewed regulatory registers</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Avg. Reading Time</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {avgReadTime} mins
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Institutional deep-dive standard</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Editorial Integrity Rank</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            Grade A+
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Zero sponsored bias guarantee</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Query Input */}
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guide title, author, slug, category, or keywords..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Categories ({guides.length})</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c} ({guides.filter((g) => g.category === c).length})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft / In Review</option>
              <option value="archived">Archived</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Split-Pane CMS Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Guides List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span>Editorial Runway</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                {filteredGuides.length} articles
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Select to inspect</span>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900 dark:text-slate-200">No matching articles found</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No editorial research guides matched your search or category filter.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1 no-scrollbar">
              {filteredGuides.map((item) => {
                const isSelected = item.id === selectedGuide?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectGuide(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                      isSelected
                        ? "bg-indigo-50/40 dark:bg-slate-900/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/30"
                        : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80 font-mono">
                      <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                        <UserCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{item.authorName}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          <Clock className="h-3 w-3" />
                          <span>{item.readingTimeMinutes} min</span>
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.sourcesCount} citations
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Article Editor & Compliance Sign-off */}
        <div className="lg:col-span-7">
          {selectedGuide ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
              {/* Top Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-900/80 px-2 py-0.5 rounded">
                      {selectedGuide.id}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(selectedGuide.category)}`}>
                      {selectedGuide.category}
                    </span>
                    <StatusBadge status={selectedGuide.status} size="sm" />
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{selectedGuide.readingTimeMinutes} min read</span>
                    </span>
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-base font-black bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {selectedGuide.title}
                    </h2>
                  )}

                  <div className="text-slate-600 dark:text-slate-400 text-xs">
                    Author: <strong className="text-slate-900 dark:text-slate-100">{selectedGuide.authorName}</strong> ({selectedGuide.authorRole}) • Published: <span className="font-mono">{selectedGuide.publishedAt || selectedGuide.updatedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Edits</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleStartEdit}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Edit Content</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-Tabs for Right Pane */}
              <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
                {[
                  { id: "overview", label: "Executive Summary & Brokers", icon: <FileText className="h-3.5 w-3.5" /> },
                  { id: "citations", label: `Fact-Check & Sources (${selectedGuide.sourcesCount})`, icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                  { id: "content", label: "Full Body Content", icon: <BookOpen className="h-3.5 w-3.5" /> },
                  { id: "seo", label: "SEO & Canonical", icon: <Globe className="h-3.5 w-3.5" /> },
                ].map((tab) => {
                  const isActive = activePaneTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePaneTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Overview */}
              {activePaneTab === "overview" && (
                <div className="space-y-4">
                  {/* Executive Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                      Executive Summary Callout
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {selectedGuide.summary}
                      </p>
                    )}
                  </div>

                  {/* Featured Brokers */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                        Featured Research Subject Brokers ({selectedGuide.featuredBrokers?.length || 0})
                      </div>
                      <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                        Auto-linked to profile specs
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedGuide.featuredBrokers?.map((brkId) => {
                        const brokerMatch = brokers.find((b) => b.id === brkId);
                        return (
                          <div
                            key={brkId}
                            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 shadow-2xs"
                          >
                            <Building2 className="h-3.5 w-3.5 text-amber-500" />
                            <span>{brokerMatch?.name || brkId}</span>
                            <span className="font-mono text-[10px] text-slate-400">({brkId})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Fact-Check & Sources */}
              {activePaneTab === "citations" && (
                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Primary Sources & Citation Verification ({selectedGuide.sourcesList.length})</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Peer Reviewed
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs">
                    {selectedGuide.sourcesList.map((s, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{s}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-500">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Fact Checked By</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                        {selectedGuide.factCheckedBy || "Dr. Elena Rostova"}
                      </div>
                      <div className="text-[10px] text-slate-400">{selectedGuide.factCheckedAt || "2026-09-12 12:00 UTC"}</div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Compliance Signed By</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                        {selectedGuide.complianceSignedBy || "Marcus Vance (Compliance)"}
                      </div>
                      <div className="text-[10px] text-slate-400">{selectedGuide.complianceSignedAt || "2026-09-12 14:00 UTC"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Full Body Content */}
              {activePaneTab === "content" && (
                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                    Full Article Markdown Content
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={10}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans space-y-3">
                      <p>{selectedGuide.content}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: SEO & Metadata */}
              {activePaneTab === "seo" && (
                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 font-mono text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    SEO & Canonical Routing Settings
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Live Canonical URL Slug</div>
                      <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        <span>https://wikifx.com/guides/{selectedGuide.slug}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">SEO Title Tag</div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editSeoTitle}
                          onChange={(e) => setEditSeoTitle(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                        />
                      ) : (
                        <div className="text-slate-800 dark:text-slate-200 font-sans font-semibold">
                          {selectedGuide.seoTitle}
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Meta Description</div>
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={editSeoDescription}
                          onChange={(e) => setEditSeoDescription(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                        />
                      ) : (
                        <div className="text-slate-600 dark:text-slate-400 font-sans">
                          {selectedGuide.seoDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Publishing Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-mono">
                  Reviewer Role: <strong className="text-slate-800 dark:text-slate-200">{activeRoleDef.name}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {selectedGuide.status !== "published" && (
                    <button
                      onClick={() => handlePublish(selectedGuide.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <FileCheck className="h-4 w-4" />
                      <span>Certify & Publish Guide</span>
                    </button>
                  )}
                  {selectedGuide.status === "published" && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" />
                        <span>Live on Public Platform</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <BookOpen className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200">No Guide Selected</div>
              <p className="text-xs text-slate-500">Select an editorial guide from the runway list to preview and edit.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Guide Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">Draft New Research Guide</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Institutional educational publishing workflow</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGuide} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                    }
                  }}
                  placeholder="e.g. Navigating Negative Balance Protection in High-Leverage Forex Trading"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="negative-balance-protection-guide"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Reading Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={newReadingTime}
                    onChange={(e) => setNewReadingTime(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Executive Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Concise institutional summary for readers and search snippets..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Sources & Citations (One per line)
                </label>
                <textarea
                  rows={3}
                  value={newSources}
                  onChange={(e) => setNewSources(e.target.value)}
                  placeholder="ESMA Retail CFD Protection Rulebook 2025&#10;FCA Policy Statement PS18/19&#10;Bank for International Settlements Report"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create & Publish Guide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
