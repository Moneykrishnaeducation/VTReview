import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Flame,
  Lock,
} from "lucide-react";
import type { VerificationStatus, PublishingStatus, RegulationTier, RiskLevel } from "../types/admin";

interface StatusBadgeProps {
  status: VerificationStatus | PublishingStatus | RegulationTier | RiskLevel | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = "sm", showIcon = true, className = "" }: StatusBadgeProps) {
  let bgClass = "bg-slate-900 border-slate-700 text-slate-300";
  let icon = <Clock className="h-3 w-3" />;
  let label = String(status);

  switch (status) {
    // Verification Status
    case "verified":
      bgClass = "bg-emerald-950/80 border-emerald-700 text-emerald-300";
      icon = <CheckCircle2 className="h-3 w-3 text-emerald-400" />;
      label = "Verified";
      break;
    case "pending":
    case "under_review":
    case "in_review":
      bgClass = "bg-amber-950/80 border-amber-700 text-amber-300";
      icon = <Clock className="h-3 w-3 text-amber-400 animate-pulse" />;
      label = status === "in_review" ? "In Review" : "Pending Review";
      break;
    case "rejected":
    case "banned":
      bgClass = "bg-rose-950/80 border-rose-700 text-rose-300";
      icon = <XCircle className="h-3 w-3 text-rose-400" />;
      label = "Rejected";
      break;
    case "expired":
    case "stale":
      bgClass = "bg-orange-950/80 border-orange-700 text-orange-300";
      icon = <AlertTriangle className="h-3 w-3 text-orange-400" />;
      label = "Expired Audit";
      break;
    case "needs_review":
    case "needs_clarification":
      bgClass = "bg-purple-950/80 border-purple-700 text-purple-300";
      icon = <AlertTriangle className="h-3 w-3 text-purple-400" />;
      label = "Needs Clarification";
      break;
    case "flagged":
      bgClass = "bg-red-950/90 border-red-600 text-red-300 font-bold";
      icon = <Flame className="h-3 w-3 text-red-400" />;
      label = "Flagged Risk";
      break;

    // Publishing Status
    case "published":
      bgClass = "bg-emerald-950/80 border-emerald-700 text-emerald-300";
      icon = <FileCheck className="h-3 w-3 text-emerald-400" />;
      label = "Published";
      break;
    case "draft":
      bgClass = "bg-slate-900 border-slate-700 text-slate-300";
      icon = <Clock className="h-3 w-3 text-slate-400" />;
      label = "Draft";
      break;
    case "scheduled":
      bgClass = "bg-blue-950/80 border-blue-700 text-blue-300";
      icon = <Clock className="h-3 w-3 text-blue-400" />;
      label = "Scheduled";
      break;
    case "compliance_approved":
      bgClass = "bg-teal-950/80 border-teal-700 text-teal-300";
      icon = <ShieldCheck className="h-3 w-3 text-teal-400" />;
      label = "Compliance Approved";
      break;

    // Regulation Tiers
    case "Tier-1":
      bgClass = "bg-blue-950 border-blue-600 text-blue-200 font-bold";
      icon = <ShieldCheck className="h-3 w-3 text-blue-400" />;
      label = "Tier-1 Jurisdiction";
      break;
    case "Tier-2":
      bgClass = "bg-indigo-950 border-indigo-700 text-indigo-200";
      icon = <ShieldCheck className="h-3 w-3 text-indigo-400" />;
      label = "Tier-2 Jurisdiction";
      break;
    case "Tier-3":
      bgClass = "bg-purple-950 border-purple-800 text-purple-200";
      icon = <ShieldAlert className="h-3 w-3 text-purple-400" />;
      label = "Tier-3 / Offshore";
      break;
    case "Unregulated":
      bgClass = "bg-rose-950 border-rose-700 text-rose-300 font-black";
      icon = <AlertTriangle className="h-3 w-3 text-rose-400" />;
      label = "Unregulated Entity";
      break;

    // Risk Levels
    case "critical":
      bgClass = "bg-rose-950 border-rose-600 text-rose-200 font-black animate-pulse";
      icon = <Flame className="h-3 w-3 text-rose-400" />;
      label = "Critical Risk";
      break;
    case "high":
      bgClass = "bg-rose-950/70 border-rose-800 text-rose-300 font-bold";
      icon = <AlertTriangle className="h-3 w-3 text-rose-400" />;
      label = "High Risk";
      break;
    case "medium":
      bgClass = "bg-amber-950/70 border-amber-800 text-amber-300";
      icon = <AlertTriangle className="h-3 w-3 text-amber-400" />;
      label = "Medium Risk";
      break;
    case "low":
      bgClass = "bg-slate-900 border-slate-700 text-slate-300";
      icon = <ShieldCheck className="h-3 w-3 text-slate-400" />;
      label = "Low Risk";
      break;
  }

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full shrink-0 ${sizeClasses[size]} ${bgClass} ${className}`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
}
