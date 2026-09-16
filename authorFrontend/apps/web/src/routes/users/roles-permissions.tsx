import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import { ROLES } from "../../data/admin-data";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  Sparkles,
  Shield,
  Layers,
  Search,
  Check,
  X,
  AlertTriangle,
  Info,
  Sliders,
  FileCheck,
  Award,
  Zap,
  RotateCcw,
  ArrowRight
} from "lucide-react";

export default function RolesPermissions() {
  const { activeRole, setActiveRole, activeRoleDef } = useAdmin();
  const [activeTab, setActiveTab] = useState<"matrix" | "capabilities" | "foureyed" | "session">("matrix");
  const [moduleSearch, setModuleSearch] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const permissionMatrix = [
    {
      module: "Broker Specifications & Research",
      description: "Managing broker profiles, spreads, execution models, and tradable asset catalogues.",
      superAdmin: "Full",
      admin: "Full",
      analyst: "Edit",
      reviewer: "Read",
      moderator: "Read",
      editorial: "Read",
      support: "Read"
    },
    {
      module: "Regulatory License Certification",
      description: "Submitting, auditing, and stamping statutory licenses against official regulator APIs.",
      superAdmin: "Full",
      admin: "Full",
      analyst: "Submit",
      reviewer: "Verify & Stamp",
      moderator: "Read",
      editorial: "Read",
      support: "Read"
    },
    {
      module: "120-Point Rating Calculation",
      description: "Calculating benchmarked rating pillars, submitting score deltas, and approving rating changes.",
      superAdmin: "Full",
      admin: "Full",
      analyst: "Propose Delta",
      reviewer: "Approve / Reject",
      moderator: "—",
      editorial: "Read",
      support: "—"
    },
    {
      module: "Community Review Moderation",
      description: "Auditing user reviews, inspecting MT4/MT5 trade proof, and publishing community feedback.",
      superAdmin: "Full",
      admin: "Full",
      analyst: "—",
      reviewer: "Audit",
      moderator: "Full Triage",
      editorial: "—",
      support: "Limited"
    },
    {
      module: "Trader Financial Complaints",
      description: "Arbitrating multi-party financial disputes, dispatching broker notices, and logging settlements.",
      superAdmin: "Full",
      admin: "Full",
      analyst: "—",
      reviewer: "Dispute Sign-off",
      moderator: "Arbitrate",
      editorial: "—",
      support: "Limited"
    },
    {
      module: "Editorial Guides & Publishing",
      description: "Authoring educational research articles, fact-checking citations, and publishing to web.",
      superAdmin: "Full",
      admin: "Full",
      analyst: "Read",
      reviewer: "Compliance Gate",
      moderator: "—",
      editorial: "Full Authoring",
      support: "Read"
    },
    {
      module: "User Directory & Verified Badges",
      description: "Managing user profiles, verifying deposit slips, granting badges, and suspending accounts.",
      superAdmin: "Full",
      admin: "Full",
      analyst: "—",
      reviewer: "—",
      moderator: "Flag Accounts",
      editorial: "—",
      support: "Badge Validation"
    },
    {
      module: "Immutable Audit Logs Oversight",
      description: "Real-time cryptographically hashed record of all administrative rating and verification actions.",
      superAdmin: "Full Root",
      admin: "Full",
      analyst: "Own Logs",
      reviewer: "Full Audit",
      moderator: "Own Logs",
      editorial: "Own Logs",
      support: "Own Logs"
    },
    {
      module: "System Settings & Disclosures",
      description: "Managing platform risk disclosures, statutory disclaimers, and global API keys.",
      superAdmin: "Full",
      admin: "Manage",
      analyst: "—",
      reviewer: "Risk Warnings",
      moderator: "—",
      editorial: "—",
      support: "—"
    },
  ];

  const granularCapabilities = [
    { key: "verify:licenses", label: "Verify & Stamp Regulatory Licenses", roles: ["super_admin", "admin", "compliance_reviewer"] },
    { key: "approve:ratings", label: "Approve 120-Point Broker Rating Deltas", roles: ["super_admin", "admin", "compliance_reviewer"] },
    { key: "propose:ratings", label: "Draft & Propose Rating Adjustments", roles: ["super_admin", "admin", "research_analyst"] },
    { key: "resolve:complaints", label: "Arbitrate Financial Disputes & Solvency Claims", roles: ["super_admin", "admin", "compliance_reviewer", "moderator"] },
    { key: "moderate:reviews", label: "Moderate & Publish Community Reviews", roles: ["super_admin", "admin", "moderator", "compliance_reviewer"] },
    { key: "publish:guides", label: "Publish Educational Research Guides", roles: ["super_admin", "admin", "editorial_manager", "compliance_reviewer"] },
    { key: "manage:users", label: "Grant Verified Trader Badges & Suspend Accounts", roles: ["super_admin", "admin", "moderator", "support_ops"] },
    { key: "view:audit", label: "Access Complete Immutable Forensic Audit Trail", roles: ["super_admin", "admin", "compliance_reviewer"] },
  ];

  const filteredMatrix = useMemo(() => {
    if (!moduleSearch.trim()) return permissionMatrix;
    const q = moduleSearch.toLowerCase();
    return permissionMatrix.filter(
      (row) => row.module.toLowerCase().includes(q) || row.description.toLowerCase().includes(q)
    );
  }, [moduleSearch, permissionMatrix]);

  const handleSimulateRole = (roleId: typeof activeRole) => {
    setActiveRole(roleId);
    const roleMatch = ROLES.find((r) => r.id === roleId);
    setActionSuccess(`Switched active simulated session to: ${roleMatch?.name || roleId}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const getPill = (val: string) => {
    if (val.includes("Full") || val === "Verify & Stamp" || val === "Approve / Reject") {
      return (
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[10px] font-bold">
          {val}
        </span>
      );
    }
    if (val.includes("Propose") || val.includes("Submit") || val.includes("Edit") || val.includes("Arbitrate") || val.includes("Authoring")) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-mono font-bold">
          {val}
        </span>
      );
    }
    if (val === "Read") {
      return (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-mono text-[10px]">
          Read-Only
        </span>
      );
    }
    if (val === "—") {
      return <span className="text-slate-400 dark:text-slate-600 font-mono text-xs">—</span>;
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
        {val}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-xs mb-1.5 font-bold">
            <KeyRound className="h-3.5 w-3.5 text-purple-500" />
            <span>ACCESS GOVERNANCE & RBAC</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Role-Based Access Control (RBAC) & Governance Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Institutional multi-role authorization framework governing broker rating edits, license verification, dispute mediation, and audit log access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Simulated Role: {activeRoleDef.name}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
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

      {/* Executive RBAC Governance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>System Roles Defined</span>
            <Shield className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            {ROLES.length} Roles
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Granular privilege tiers</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Protected Modules</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {permissionMatrix.length} Domains
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>100% RBAC coverage</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>4-Eyes Principle</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            Enforced
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-3 w-3" />
            <span>Segregated Rating & License Sign-off</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Active Role Scope</span>
            <Zap className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
            {activeRoleDef.permissions.includes("*") ? "All Permissions" : `${activeRoleDef.permissions.length} Grants`}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
            <span>{activeRoleDef.id}</span>
          </div>
        </div>
      </div>

      {/* Interactive Role Simulator Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="h-4 w-4 text-amber-500" />
            <span>Interactive Role Simulator (Select Role to Test UI & Permissions)</span>
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">CLICK CARD TO ACTIVATE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {ROLES.map((role) => {
            const isSelected = activeRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => handleSimulateRole(role.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 shadow-xs relative ${
                  isSelected
                    ? "bg-amber-50/50 dark:bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-md"
                    : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white text-sm">{role.name}</span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <CheckCircle2 className="h-3 w-3" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">SIMULATE</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {role.description}
                </p>

                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Grants: {role.permissions.includes("*") ? "Global Sovereignty" : `${role.permissions.length} actions`}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{role.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs for RBAC Views */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "matrix"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Operational Module Permission Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("capabilities")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "capabilities"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Granular Action Capability Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab("foureyed")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "foureyed"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>4-Eyes Segregation of Duties Policy</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Module Matrix Table */}
      {activeTab === "matrix" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs text-xs space-y-3">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-500" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Functional Module Authorization Scope
              </span>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                placeholder="Filter module name or scope..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              {moduleSearch && (
                <button
                  onClick={() => setModuleSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-3.5 pl-5">Functional Module</th>
                  <th className="p-3.5">Super Admin</th>
                  <th className="p-3.5">Admin</th>
                  <th className="p-3.5">Analyst</th>
                  <th className="p-3.5">Reviewer</th>
                  <th className="p-3.5">Moderator</th>
                  <th className="p-3.5">Editorial</th>
                  <th className="p-3.5 pr-5">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{row.module}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mt-0.5 leading-snug">
                        {row.description}
                      </div>
                    </td>
                    <td className="p-3.5">{getPill(row.superAdmin)}</td>
                    <td className="p-3.5">{getPill(row.admin)}</td>
                    <td className="p-3.5">{getPill(row.analyst)}</td>
                    <td className="p-3.5">{getPill(row.reviewer)}</td>
                    <td className="p-3.5">{getPill(row.moderator)}</td>
                    <td className="p-3.5">{getPill(row.editorial)}</td>
                    <td className="p-3.5 pr-5">{getPill(row.support)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Granular Capability Breakdown */}
      {activeTab === "capabilities" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Granular Action & Capability Mapping
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              Specific atomic capabilities mapped to authorized platform roles in the authorization guard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {granularCapabilities.map((cap) => {
              const isAllowedForActiveRole =
                activeRoleDef.permissions.includes("*") || activeRoleDef.permissions.includes(cap.key);
              return (
                <div
                  key={cap.key}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isAllowedForActiveRole
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{cap.key}</div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{cap.label}</h4>
                    </div>

                    {isAllowedForActiveRole ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center gap-1">
                        <Check className="h-3 w-3" /> GRANTED
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono text-[10px]">
                        RESTRICTED
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 font-mono">Authorized Roles:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.roles.map((r) => {
                        const roleObj = ROLES.find((ro) => ro.id === r);
                        return (
                          <span
                            key={r}
                            className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md font-mono text-[10px] text-slate-700 dark:text-slate-300"
                          >
                            {roleObj?.name || r}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: 4-Eyes Segregation of Duties */}
      {activeTab === "foureyed" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              4-Eyes Principle & Statutory Segregation of Duties
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              Strict multi-party oversight protocols preventing conflict of interest and unverified score manipulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-amber-50/40 dark:bg-slate-950 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Broker Rating Isolation Rule</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Research Analysts can calculate spreads, execute latency tests, and propose rating deltas, but <strong>CANNOT</strong> approve their own proposals into the live public index. A separate Compliance Reviewer or Super Admin must review attached evidence and approve the rating delta.
              </p>
            </div>

            <div className="p-5 bg-emerald-50/40 dark:bg-slate-950 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Regulatory License Verification Rule</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                License records submitted by data crawlers or analysts remain in a strict "Pending Review" staging queue until stamped with an official SHA-256 evidence register certificate by a certified Compliance Reviewer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
