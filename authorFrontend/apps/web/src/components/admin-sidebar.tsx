import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAdmin } from "../context/admin-context";
import {
  LayoutDashboard,
  Building2,
  Scale,
  ShieldCheck,
  Star,
  FileText,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  Users,
  KeyRound,
  BarChart3,
  CheckSquare2,
  Server,
  History,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Radio,
  Search,
  X,
  ShieldAlert,
  LogOut,
  ChevronDown
} from "lucide-react";

import logo from "../assets/logo.png";
import favicon from "../assets/favicon.png";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const location = useLocation();
  const {
    pendingVerificationsCount,
    pendingReviewsCount,
    pendingComplaintsCount,
    pendingRatingsCount,
    unreadNotificationsCount,
    criticalIssuesCount,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setIsSearchOpen,
    activeRoleDef,
  } = useAdmin();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname, setIsMobileSidebarOpen]);

  // Keyboard shortcut ( [ ) to toggle sidebar collapse on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "[" || (e.ctrlKey && e.key === "\\")) &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCollapsed, setIsCollapsed]);

  const navGroups = [
    {
      title: "Core Workspace",
      items: [
        { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      ],
    },
    {
      title: "Regulation & Safety",
      items: [
        {
          label: "Verification Queue",
          to: "/regulation/verification",
          icon: <ShieldCheck className="h-4 w-4" />,
          badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined,
          badgeColor: "bg-emerald-500 text-slate-950 font-bold",
        },
        { label: "Regulators Registry", to: "/regulation/regulators", icon: <Scale className="h-4 w-4" /> },
      ],
    },
    {
      title: "Community & Summit",
      items: [
        {
          label: "Review Moderation",
          to: "/reviews",
          icon: <MessageSquare className="h-4 w-4" />,
          badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
          badgeColor: "bg-cyan-500 text-slate-950 font-bold",
        },
        {
          label: "Complaints & Claims",
          to: "/complaints",
          icon: <AlertTriangle className="h-4 w-4" />,
          badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : undefined,
          badgeColor: "bg-rose-500 text-white font-bold",
        },
        {
          label: "Global Convocation",
          to: "/convocation",
          icon: <Radio className="h-4 w-4 text-amber-500" />,
          badge: "LIVE",
          badgeColor: "bg-rose-500 text-white font-black animate-pulse",
        },
      ],
    },
    {
      title: "Editorial CMS",
      items: [
        { label: "Guides & Research", to: "/editorial/guides", icon: <BookOpen className="h-4 w-4" /> },
      ],
    },
    {
      title: "Identity & RBAC",
      items: [
        { label: "User Directory", to: "/users", icon: <Users className="h-4 w-4" /> },
        { label: "Roles & Permissions", to: "/roles", icon: <KeyRound className="h-4 w-4" /> },
      ],
    },
    {
      title: "Intelligence & Quality",
      items: [
        { label: "Operational Analytics", to: "/analytics", icon: <BarChart3 className="h-4 w-4" /> },
        {
          label: "Data Quality Alerts",
          to: "/data-quality",
          icon: <CheckSquare2 className="h-4 w-4" />,
          badge: criticalIssuesCount > 0 ? criticalIssuesCount : undefined,
          badgeColor: "bg-orange-500 text-slate-950 font-bold",
        },
        { label: "Job Queues & Sync", to: "/operations", icon: <Server className="h-4 w-4" /> },
      ],
    },
    {
      title: "System Governance",
      items: [
        {
          label: "Notifications",
          to: "/notifications",
          icon: <Bell className="h-4 w-4" />,
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
          badgeColor: "bg-amber-500 text-slate-950 font-black",
        },
        { label: "Immutable Audit Log", to: "/audit-logs", icon: <History className="h-4 w-4" /> },
        { label: "System Settings", to: "/settings", icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <>
      {/* 1. MOBILE BACKDROP OVERLAY */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* 2. SIDEBAR CONTAINER */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 lg:z-30 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-xs overflow-x-hidden ${
          isMobileSidebarOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* BRAND HEADER */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shrink-0">
          <Link
            to="/dashboard"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-2 overflow-hidden group"
          >
            {isCollapsed && !isMobileSidebarOpen ? (
              <img
                src={favicon}
                alt="WikiFX"
                className="h-8 w-8 object-contain rounded-lg p-0.5 bg-amber-500/10 border border-amber-500/20 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="WikiFX Admin"
                  className="h-8 w-auto max-w-[130px] object-contain group-hover:scale-102 transition-transform"
                />
                <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono font-bold rounded border border-amber-500/20 uppercase">
                  Admin
                </span>
              </div>
            )}
          </Link>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Sidebar ( [ )" : "Collapse Sidebar ( [ )"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Close Mobile Menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* QUICK SEARCH JUMP (Expanded Mode) */}
        {(!isCollapsed || isMobileSidebarOpen) ? (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2 shadow-2xs transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                <span className="text-[11px] truncate">Jump to entity...</span>
              </div>
              <kbd className="font-mono text-[9px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Ctrl+K
              </kbd>
            </button>
          </div>
        ) : (
          <div className="px-2 pt-2.5 pb-1 flex justify-center shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
              title="Quick Search (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* NAVIGATION GROUPS SCROLL AREA */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden space-y-4 text-xs no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isCollapsed && !isMobileSidebarOpen ? "px-2 py-3" : "px-2.5 py-3"
          }`}
        >
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {(!isCollapsed || isMobileSidebarOpen) ? (
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                  <span>{group.title}</span>
                  <div className="h-px bg-slate-100 dark:bg-slate-900 flex-1 ml-2" />
                </div>
              ) : (
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-1" />
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === item.to ||
                    (item.to !== "/dashboard" && location.pathname.startsWith(item.to));

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      title={isCollapsed && !isMobileSidebarOpen ? `${item.label}${item.badge !== undefined ? ` (${item.badge})` : ""}` : undefined}
                      className={`relative group flex items-center rounded-xl font-medium transition-all ${
                        isCollapsed && !isMobileSidebarOpen
                          ? "justify-center p-2.5"
                          : "justify-between px-3 py-2"
                      } ${
                        isActive
                          ? "bg-amber-500/10 text-amber-900 dark:text-amber-300 border-l-4 border-amber-500 font-bold shadow-2xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={`transition-colors shrink-0 ${
                            isActive
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {(!isCollapsed || isMobileSidebarOpen) && (
                          <span className="truncate text-[12px]">{item.label}</span>
                        )}
                      </div>

                      {/* Badge / Pill Count */}
                      {item.badge !== undefined && (
                        (!isCollapsed || isMobileSidebarOpen) ? (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                              item.badgeColor || "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-950" />
                        )
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM USER & NODE STATUS FOOTER */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 backdrop-blur-xs shrink-0 overflow-x-hidden">
          {(!isCollapsed || isMobileSidebarOpen) ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
                    MV
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Marcus Vance</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{activeRoleDef.name}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/settings"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="System Governance Settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">NODE-LIVE</span>
                  <span>•</span>
                  <span>STAGING-01</span>
                </div>
                <span>v1.2.0</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                title={`Logged in: Marcus Vance (${activeRoleDef.name})`}
              >
                MV
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                title="Expand Sidebar ( [ )"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
