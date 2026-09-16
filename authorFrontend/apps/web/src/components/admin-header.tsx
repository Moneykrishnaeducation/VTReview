import React, { useState, useRef, useEffect } from "react";
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
  Menu,
  KeyRound,
  FileText,
  Settings,
  LogOut,
  User,
  Activity,
  Check,
  MessageSquare,
  AlertCircle
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
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-14 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between px-3 md:px-6 transition-all duration-300 left-0 ${
        isSidebarCollapsed ? "lg:left-20" : "lg:left-64"
      }`}
    >
      {/* Left: Mobile Drawer Trigger & Global Search Button */}
      <div className="flex items-center gap-2.5 flex-1 max-w-lg">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer shadow-2xs"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Global Search Button Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full max-w-xs sm:max-w-sm bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate">Search brokers, licenses, users...</span>
          </div>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action Triage, Role Selector, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Triage Action Pills */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono">
          <Link
            to="/regulation/verification"
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/50 border border-slate-200 hover:border-emerald-300 dark:border-slate-800 dark:hover:border-emerald-800 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-all shadow-2xs"
            title="Pending License Verification Desk"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-semibold">{pendingVerificationsCount}</span>
            <span className="text-[10px] text-slate-400">Licenses</span>
          </Link>

          <Link
            to="/reviews"
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-900 dark:hover:bg-amber-950/50 border border-slate-200 hover:border-amber-300 dark:border-slate-800 dark:hover:border-amber-800 text-slate-700 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-300 flex items-center gap-1.5 transition-all shadow-2xs"
            title="Community Review Moderation Queue"
          >
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold">{pendingReviewsCount}</span>
            <span className="text-[10px] text-slate-400">Reviews</span>
          </Link>

          <Link
            to="/complaints"
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/50 border border-slate-200 hover:border-rose-300 dark:border-slate-800 dark:hover:border-rose-800 text-slate-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-300 flex items-center gap-1.5 transition-all shadow-2xs"
            title="Trader Financial Disputes Queue"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            <span className="font-semibold">{pendingComplaintsCount}</span>
            <span className="text-[10px] text-slate-400">Disputes</span>
          </Link>
        </div>

        {/* Interactive Role Switcher */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => {
              setIsRoleMenuOpen(!isRoleMenuOpen);
              setIsNotifMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
            title="Switch Simulated Administrative Role"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-mono text-[11px]">Role:</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[130px]">{activeRoleDef.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2.5 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between font-mono">
                <span>Simulate Operational Role</span>
                <KeyRound className="h-3.5 w-3.5 text-amber-500" />
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5 no-scrollbar">
                {ROLES.map((role) => {
                  const isSelected = activeRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setActiveRole(role.id as AdminRole);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-start justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-semibold"
                          : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{role.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                          {role.description}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
                <Link
                  to="/roles"
                  onClick={() => setIsRoleMenuOpen(false)}
                  className="text-amber-600 dark:text-amber-400 hover:underline text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <span>View Complete Governance Matrix</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => {
              setIsNotifMenuOpen(!isNotifMenuOpen);
              setIsRoleMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer shadow-2xs"
            title="Notifications & System Alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center font-mono ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotifMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 dark:text-white text-sm">Alerts & Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-semibold flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-0.5 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 space-y-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                    <div className="font-bold text-xs text-slate-700 dark:text-slate-300">All caught up!</div>
                    <p className="text-[10px] text-slate-500">No pending operational alerts.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.actionUrl) {
                          setIsNotifMenuOpen(false);
                          navigate(n.actionUrl);
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        n.read
                          ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 text-slate-500"
                          : "bg-slate-50 dark:bg-slate-900 border-amber-500/30 text-slate-800 dark:text-slate-200 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />}
                          <span>{n.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setIsNotifMenuOpen(false)}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-500 font-bold text-xs hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Notification Center</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <ModeToggle />

        {/* User Profile Avatar & Menu */}
        <div className="relative pl-1 md:pl-2 border-l border-slate-200 dark:border-slate-800" ref={userMenuRef}>
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsRoleMenuOpen(false);
              setIsNotifMenuOpen(false);
            }}
            className="flex items-center gap-2 p-1 md:px-2 md:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
              MV
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Marcus Vance</span>
              <span className="text-[10px] text-slate-500 font-mono leading-tight">Compliance Desk</span>
            </div>
            <ChevronDown className="hidden md:block h-3 w-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white text-xs">Marcus Vance</div>
                <div className="text-[11px] text-slate-500 font-mono truncate">m.vance@wikifx.internal</div>
                <div className="pt-1">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20">
                    {activeRoleDef.name}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                <Link
                  to="/users"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <span>User & Trader Directory</span>
                </Link>

                <Link
                  to="/roles"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5 text-purple-500" />
                  <span>RBAC Governance Matrix</span>
                </Link>

                <Link
                  to="/audit"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Immutable Audit Log</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Switch Session / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
