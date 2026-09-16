import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAdmin } from "../../context/admin-context";
import type { NotificationItem } from "../../types/admin";
import {
  Bell,
  Check,
  Calendar,
  ChevronDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  Search,
  Eye,
  MoreHorizontal,
  X,
  FileText,
  Wrench,
  ArrowRight,
  ShieldAlert,
  Zap,
  Clock,
  Filter,
  CheckCheck,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Inbox,
  RotateCcw,
  Radio,
  Tag,
} from "lucide-react";

export default function NotificationsCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdmin();
  const navigate = useNavigate();

  // State
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "high" | "verification" | "compliance">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Counts & Metrics
  const metrics = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const high = notifications.filter((n) => n.priority === "high").length;
    const resolved = notifications.filter((n) => n.read).length;
    return { total, unread, high, resolved };
  }, [notifications]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // 1. Tab filter
      if (activeTab === "unread" && n.read) return false;
      if (activeTab === "high" && n.priority !== "high") return false;
      if (activeTab === "verification" && n.type !== "verification_request") return false;
      if (activeTab === "compliance" && n.type !== "compliance_alert") return false;

      // 2. Priority filter
      if (priorityFilter !== "all" && n.priority !== priorityFilter) return false;

      // 3. Type filter
      if (typeFilter !== "all" && n.type !== typeFilter) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.id.toLowerCase().includes(q) ||
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [notifications, activeTab, priorityFilter, typeFilter, searchQuery]);

  // Batch actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchMarkRead = () => {
    selectedIds.forEach((id) => markNotificationRead(id));
    setToastMessage(`Marked ${selectedIds.length} notifications as read.`);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setToastMessage("All notifications marked as read.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const resetFilters = () => {
    setActiveTab("all");
    setTypeFilter("all");
    setPriorityFilter("all");
    setSearchQuery("");
    setTimeRange("all");
    setSelectedIds([]);
  };

  const getPriorityBadge = (priority: NotificationItem["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold text-[10px] inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>CRITICAL</span>
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px] inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>HIGH</span>
          </span>
        );
      case "low":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 font-bold text-[10px] inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>INFO</span>
          </span>
        );
    }
  };

  const getTypeIcon = (type: NotificationItem["type"], priority: NotificationItem["priority"]) => {
    switch (type) {
      case "compliance_alert":
        return (
          <div className="h-9 w-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-4 w-4" />
          </div>
        );
      case "verification_request":
        return (
          <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4" />
          </div>
        );
      case "evidence_expired":
        return (
          <div className="h-9 w-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
        );
      case "moderation_task":
        return (
          <div className="h-9 w-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
        );
      case "job_failed":
        return (
          <div className="h-9 w-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <Bell className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans w-full pb-16">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs relative">
            <Bell className="h-6 w-6" />
            {metrics.unread > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {metrics.unread}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Notifications &amp; Operations Alert Hub
              </h1>
              {metrics.unread > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] shadow-xs">
                  {metrics.unread} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time operational alerts, license verification milestones, critical dispute escalations, and system integrity notices.
            </p>
          </div>
        </div>

        {/* Global Header Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <CheckCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Mark All As Read</span>
          </button>
        </div>
      </div>

      {/* ── Feedback Toast ── */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Executive KPI Metric Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab("all")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all cursor-pointer space-y-1 shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Total Broadcasts</span>
            <Inbox className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{metrics.total}</div>
          <div className="text-[10px] text-slate-500 font-medium">All logged operation notices</div>
        </div>

        <div
          onClick={() => setActiveTab("unread")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer space-y-1 shadow-xs"
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Unread Attention</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{metrics.unread}</div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Awaiting triage / review
          </div>
        </div>

        <div
          onClick={() => setActiveTab("high")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer space-y-1 shadow-xs"
        >
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Critical Escalations</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">{metrics.high}</div>
          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">High priority compliance items</div>
        </div>

        <div
          onClick={() => setActiveTab("all")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer space-y-1 shadow-xs"
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Processed Items</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{metrics.resolved}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Read &amp; archived tasks</div>
        </div>
      </div>

      {/* ── Multi-Parameter Navigation & Filter Matrix ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
        {/* Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Alerts", count: metrics.total },
              { id: "unread", label: "Unread", count: metrics.unread, highlight: metrics.unread > 0 },
              { id: "high", label: "Critical", count: metrics.high },
              { id: "verification", label: "Verification Requests" },
              { id: "compliance", label: "Compliance Alerts" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer text-xs ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-slate-950/20 text-slate-950"
                          : tab.highlight
                          ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Batch Actions Bar (when selected) */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-xl animate-in fade-in">
              <span className="font-bold text-amber-800 dark:text-amber-300 text-xs font-mono">
                {selectedIds.length} Selected
              </span>
              <button
                type="button"
                onClick={handleBatchMarkRead}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer"
              >
                Mark Read
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-[11px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search alert title, reference ID, message body..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Alert Types</option>
            <option value="verification_request">Verification Requests</option>
            <option value="compliance_alert">Compliance Alerts</option>
            <option value="evidence_expired">Evidence Expiration</option>
            <option value="moderation_task">Moderation Tasks</option>
            <option value="job_failed">Job / Sync Failures</option>
            <option value="system_notice">System Notices</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="high">Critical (High)</option>
            <option value="medium">Elevated (Medium)</option>
            <option value="low">Informational (Low)</option>
          </select>

          {(searchQuery || typeFilter !== "all" || priorityFilter !== "all" || activeTab !== "all") && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Main Dual Split Workstation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Notifications Stream List */}
        <div className={`${selectedNotif ? "lg:col-span-7" : "lg:col-span-12"} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all`}>
          {/* Header row with Select All */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={selectedIds.length > 0 && selectedIds.length === filteredNotifications.length}
                onChange={handleSelectAll}
                className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
              />
              <span>Select All Displayed ({filteredNotifications.length})</span>
            </label>

            <span className="text-[11px] text-slate-400 font-mono">
              Live Operations Queue
            </span>
          </div>

          {/* Notification Items List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => {
                const isSelected = selectedNotif?.id === notif.id;
                const isChecked = selectedIds.includes(notif.id);
                const isUnread = !notif.read;

                return (
                  <div
                    key={notif.id}
                    className={`p-4 transition-all flex items-start justify-between gap-4 ${
                      isSelected
                        ? "bg-amber-500/10 border-l-4 border-l-amber-500"
                        : isUnread
                        ? "bg-slate-50/70 dark:bg-slate-950/60 border-l-4 border-l-amber-500 hover:bg-slate-100/70 dark:hover:bg-slate-900"
                        : "hover:bg-slate-50 dark:hover:bg-slate-850/40 opacity-80 hover:opacity-100 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(notif.id)}
                        className="accent-amber-500 h-4 w-4 rounded mt-1 shrink-0 cursor-pointer"
                      />

                      {/* Icon */}
                      {getTypeIcon(notif.type, notif.priority)}

                      {/* Content */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs ${isUnread ? "font-black text-slate-900 dark:text-white" : "font-bold text-slate-700 dark:text-slate-300"}`}>
                            {notif.title}
                          </span>
                          {getPriorityBadge(notif.priority)}
                          {isUnread && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500 text-slate-950">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className={`text-xs line-clamp-2 leading-relaxed ${isUnread ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                          {notif.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notif.createdAt}
                          </span>
                          <span>•</span>
                          <span className="capitalize font-semibold text-slate-600 dark:text-slate-400">
                            {notif.type.replace(/_/g, " ")}
                          </span>
                          <span>•</span>
                          <span>Ref: #{notif.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions on row */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => {
                            markNotificationRead(notif.id);
                            setToastMessage(`Marked "${notif.title}" as read.`);
                            setTimeout(() => setToastMessage(null), 2500);
                          }}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedNotif(isSelected ? null : notif)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                            : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                        title={isSelected ? "Close details" : "Inspect details"}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {notif.actionUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            markNotificationRead(notif.id);
                            navigate(notif.actionUrl!);
                          }}
                          className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer font-bold"
                          title="Jump to resolution workflow"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center space-y-2">
                <Bell className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <div className="text-slate-500 font-medium">No operational notifications match your filter criteria.</div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Forensic Inspector Panel */}
        {selectedNotif && (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl sticky top-6 animate-in fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3">
                {getTypeIcon(selectedNotif.type, selectedNotif.priority)}
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {selectedNotif.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(selectedNotif.priority)}
                    <span className="text-[10px] font-mono text-slate-400">Ref: #{selectedNotif.id}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notification Full Message */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Alert Summary</span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 font-medium">
                {selectedNotif.message}
              </p>
            </div>

            {/* Key-Value Details */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Operational Metadata</span>
              <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Alert Category</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold capitalize">
                    {selectedNotif.type.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Source Feed</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">VTIndex Core Engine</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Timestamp</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedNotif.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Triage Status</span>
                  <span className={`font-bold ${selectedNotif.read ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {selectedNotif.read ? "Read & Processed" : "Active / Action Required"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              {!selectedNotif.read && (
                <button
                  type="button"
                  onClick={() => {
                    markNotificationRead(selectedNotif.id);
                    setToastMessage(`Marked "${selectedNotif.title}" as read.`);
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Mark as Read &amp; Acknowledged</span>
                </button>
              )}

              {selectedNotif.actionUrl && (
                <button
                  type="button"
                  onClick={() => {
                    markNotificationRead(selectedNotif.id);
                    navigate(selectedNotif.actionUrl!);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Resolve &amp; Jump to Workstation</span>
                  <ArrowRight className="h-4 w-4 text-amber-500" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
