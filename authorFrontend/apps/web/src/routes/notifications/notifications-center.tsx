import React, { useState } from "react";
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
} from "lucide-react";

export default function NotificationsCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdmin();
  const navigate = useNavigate();

  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeRange] = useState<string>("Last 7 Days");

  // Counts
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.priority === "high").length;
  const highCount = notifications.filter((n) => n.priority === "high").length;
  const mediumCount = notifications.filter((n) => n.priority === "medium").length;
  const lowCount = notifications.filter((n) => n.priority === "low").length;

  const filteredNotifications = notifications.filter((n) => {
    if (priorityFilter !== "all" && n.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (priority: NotificationItem["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold text-[10px] flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>HIGH</span>
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 font-bold text-[10px] flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>MEDIUM</span>
          </span>
        );
      case "low":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>LOW</span>
          </span>
        );
    }
  };

  const getIconForPriority = (priority: NotificationItem["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <div className="h-8 w-8 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0 font-black text-sm">
            !
          </div>
        );
      case "medium":
        return (
          <div className="h-8 w-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      case "low":
        return (
          <div className="h-8 w-8 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 font-bold text-xs font-serif italic">
            i
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Notification Center
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold text-[11px]">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stay informed with real-time alerts, system updates and critical events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Mark All As Read</span>
          </button>

          <div className="relative">
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{timeRange}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Critical Alerts */}
        <div
          onClick={() => setPriorityFilter("high")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer space-y-3 relative overflow-hidden group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-500 border border-rose-500/30 flex items-center justify-center font-black text-base">
              !
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Critical Alerts</span>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white">
            {criticalCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium group-hover:underline">
            <span>Requires immediate attention</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Card 2: High Priority */}
        <div
          onClick={() => setPriorityFilter("high")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer space-y-3 relative overflow-hidden group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-500 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">High Priority</span>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white">
            {highCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium group-hover:underline">
            <span>Needs quick action</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Card 3: Medium Priority */}
        <div
          onClick={() => setPriorityFilter("medium")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer space-y-3 relative overflow-hidden group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs font-serif italic">
              i
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Medium Priority</span>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white">
            {mediumCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
            <span>Monitor and review</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Card 4: Low Priority */}
        <div
          onClick={() => setPriorityFilter("low")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer space-y-3 relative overflow-hidden group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Low Priority</span>
          </div>
          <div className="font-mono text-3xl font-black text-slate-900 dark:text-white">
            {lowCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
            <span>Information / FYI</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Main Content Area (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Notifications Table Container */}
        <div className={`${selectedNotif ? "lg:col-span-8" : "lg:col-span-12"} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all duration-200`}>
          {/* Header Controls Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/60">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200">
              <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>All Notifications ({filteredNotifications.length})</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority Select Filter */}
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-48">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-3.5">Alert</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => {
                    const isSelected = selectedNotif?.id === notif.id;
                    const isUnread = !notif.read;

                    return (
                      <tr
                        key={notif.id}
                        className={`transition-all ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/60 border-l-4 border-l-blue-600 text-slate-900 dark:text-white font-medium"
                            : isUnread
                            ? "bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-l-amber-500 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 text-slate-900 dark:text-slate-100 font-semibold"
                            : "hover:bg-slate-50/80 dark:hover:bg-slate-850/50 text-slate-600 dark:text-slate-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        {/* Alert Column */}
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center gap-3 max-w-[220px]">
                            <div className="relative">
                              {getIconForPriority(notif.priority)}
                              {isUnread && (
                                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs leading-snug ${isUnread ? "font-black text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                                  {notif.title}
                                </span>
                                {isUnread && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-amber-500 text-slate-950 shrink-0">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Description Column */}
                        <td className="p-3.5 align-middle">
                          <p className={`text-xs line-clamp-2 max-w-xs leading-relaxed ${isUnread ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                            {notif.message}
                          </p>
                        </td>

                        {/* Priority Column */}
                        <td className="p-3.5 align-middle">
                          {getPriorityBadge(notif.priority)}
                        </td>

                        {/* Timestamp Column */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          <div className={`font-mono text-xs ${isUnread ? "font-bold text-slate-900 dark:text-slate-100" : "font-semibold text-slate-600 dark:text-slate-400"}`}>
                            {notif.createdAt}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                            Apr 26, 2025 10:24 AM
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="p-3.5 align-middle whitespace-nowrap">
                          {isUnread ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px] inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Unread</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30 font-bold text-[10px] inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              <span>Read</span>
                            </span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td className="p-3.5 align-middle text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedNotif(isSelected ? null : notif)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                              }`}
                              title={isSelected ? "Close details" : "Inspect details"}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                              title="More options"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500">
                      No notifications match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <div>
              Showing 1 - {filteredNotifications.length} of {filteredNotifications.length} notifications
            </div>
            <div className="flex items-center gap-1 font-mono">
              <button disabled className="p-1 rounded bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800">
                &lt;
              </button>
              <button className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                1
              </button>
              <button disabled className="p-1 rounded bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800">
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Inspector Side Panel (4 cols) */}
        {selectedNotif && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3">
                {getIconForPriority(selectedNotif.priority)}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedNotif.title}
                  </h3>
                  {getPriorityBadge(selectedNotif.priority)}
                </div>
              </div>

              <button
                onClick={() => setSelectedNotif(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notification Brief Message */}
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNotif.message}
            </p>

            {/* Details Key-Value Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-600 dark:text-blue-400">
                <Info className="h-4 w-4" />
                <span>Details</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Alert Type</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold capitalize">
                    {selectedNotif.type.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Source</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">VTIndex Registry</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Reference No.</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">#{selectedNotif.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Created</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedNotif.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Full Description Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-600 dark:text-blue-400">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {selectedNotif.message} Immediate attention is required to avoid regulatory issues or compliance non-conformance.
              </p>
            </div>

            {/* Status Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Status</span>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{selectedNotif.read ? "Read & Processed" : "Active"}</span>
                </span>
              </div>
            </div>

            {/* Actions Buttons Section */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-600 dark:text-blue-400 mb-2">
                <Wrench className="h-4 w-4" />
                <span>Actions</span>
              </div>

              {!selectedNotif.read && (
                <button
                  onClick={() => markNotificationRead(selectedNotif.id)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Mark as Read</span>
                </button>
              )}

              {selectedNotif.actionUrl && (
                <button
                  onClick={() => {
                    markNotificationRead(selectedNotif.id);
                    navigate(selectedNotif.actionUrl!);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Resolve Task</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
