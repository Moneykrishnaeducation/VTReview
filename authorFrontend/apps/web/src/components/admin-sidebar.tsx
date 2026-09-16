import React, { useState } from "react";
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
} from "lucide-react";

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
  } = useAdmin();

  const navGroups = [
    {
      title: "Core Operations",
      items: [
        { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      ],
    },
    {
      title: "Research & Ratings",
      items: [
        { label: "Broker Directory", to: "/brokers", icon: <Building2 className="h-4 w-4" /> },
        {
          label: "120-Point Ratings",
          to: "/ratings",
          icon: <Star className="h-4 w-4" />,
          badge: pendingRatingsCount > 0 ? pendingRatingsCount : undefined,
          badgeColor: "bg-amber-500 text-slate-950",
        },
        { label: "Evidence Vault", to: "/evidence", icon: <FileText className="h-4 w-4" /> },
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
      title: "Community & Disputes",
      items: [
        {
          label: "Review Moderation",
          to: "/reviews",
          icon: <MessageSquare className="h-4 w-4" />,
          badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
          badgeColor: "bg-cyan-500 text-slate-950",
        },
        {
          label: "Complaints & Claims",
          to: "/complaints",
          icon: <AlertTriangle className="h-4 w-4" />,
          badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : undefined,
          badgeColor: "bg-rose-500 text-white font-bold",
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
      title: "Governance",
      items: [
        {
          label: "Notifications",
          to: "/notifications",
          icon: <Bell className="h-4 w-4" />,
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
          badgeColor: "bg-amber-500 text-slate-950",
        },
        { label: "Immutable Audit Log", to: "/audit-logs", icon: <History className="h-4 w-4" /> },
        { label: "System Settings", to: "/settings", icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-30 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col transition-all duration-200 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-3.5 bg-slate-950">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            WFX
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-sm tracking-tight leading-tight">
                Wiki<span className="text-amber-500 font-black">FX</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-tight">
                Research Operations
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </div>
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
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xs"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? "text-amber-400" : "text-slate-400"}>{item.icon}</span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                          item.badgeColor || "bg-slate-800 text-slate-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Environment Indicator */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">LIVE OPS</span>
            <span className="text-slate-500">•</span>
            <span>STAGING-01</span>
          </div>
          <span className="text-[10px] text-slate-500">v1.0.0</span>
        </div>
      )}
    </aside>
  );
}
