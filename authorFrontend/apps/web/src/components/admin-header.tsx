import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAdmin } from "../context/admin-context";
import { ROLES } from "../data/admin-data";
import type { AdminRole } from "../types/admin";
import { ModeToggle } from "./mode-toggle";
import {
  Search,
  Bell,
  ShieldAlert,
  UserCheck,
  ChevronDown,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface AdminHeaderProps {
  isSidebarCollapsed: boolean;
}

export function AdminHeader({ isSidebarCollapsed }: AdminHeaderProps) {
  const {
    activeRole,
    setActiveRole,
    activeRoleDef,
    setIsSearchOpen,
    unreadNotificationsCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    pendingVerificationsCount,
    pendingReviewsCount,
    pendingComplaintsCount,
  } = useAdmin();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-14 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between px-4 md:px-6 transition-all duration-200 ${
        isSidebarCollapsed ? "left-16" : "left-64"
      }`}
    >
      {/* Left: Quick Search Button & Breadcrumb hint */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full max-w-sm bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <span>Search entities, licenses, evidence...</span>
          </div>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Role Selector & Notifications */}
      <div className="flex items-center gap-3">
        {/* Quick Task Badges */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono">
          <Link
            to="/regulation/verification"
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors"
            title="Pending License Verifications"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{pendingVerificationsCount} Lic</span>
          </Link>
          <Link
            to="/reviews"
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors"
            title="Pending Review Moderation"
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>{pendingReviewsCount} Rev</span>
          </Link>
          <Link
            to="/complaints"
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors"
            title="Active Dispute Cases"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>{pendingComplaintsCount} Cmp</span>
          </Link>
        </div>

        {/* Interactive Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="hidden sm:inline text-slate-400">Role:</span>
            <span className="font-bold text-white">{activeRoleDef.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2.5 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-500 border-b border-slate-800 mb-1">
                Simulate Operational Role (RBAC)
              </div>
              <div className="space-y-1">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRole(role.id as AdminRole);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                      activeRole === role.id ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold">{role.name}</div>
                      <div className="text-[10px] text-slate-500 leading-tight line-clamp-1">{role.description}</div>
                    </div>
                    {activeRole === role.id && <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center font-mono">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotifMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-white text-sm">Notifications & Alerts</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.actionUrl) {
                        setIsNotifMenuOpen(false);
                        navigate(n.actionUrl);
                      }
                    }}
                    className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                      n.read
                        ? "bg-slate-900/40 border-slate-800/80 text-slate-400"
                        : "bg-slate-900 border-amber-500/30 text-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{n.createdAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 mt-2 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setIsNotifMenuOpen(false)}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] hover:underline"
                >
                  View Notification Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <ModeToggle />

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
            MV
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">Marcus Vance</span>
            <span className="text-[10px] text-slate-500 leading-tight">Lead Compliance</span>
          </div>
        </div>
      </div>
    </header>
  );
}
