import React from "react";
import { useAdmin } from "../../context/admin-context";
import { ROLES } from "../../data/admin-data";
import { KeyRound, ShieldCheck, CheckCircle2, Lock, UserCheck, Sparkles } from "lucide-react";

export default function RolesPermissions() {
  const { activeRole, setActiveRole } = useAdmin();

  const permissionMatrix = [
    { module: "Broker Specifications & Research", superAdmin: "Full", admin: "Full", analyst: "Edit", reviewer: "Read", moderator: "Read", editorial: "Read", support: "Read" },
    { module: "Regulatory License Certification", superAdmin: "Full", admin: "Full", analyst: "Submit", reviewer: "Verify & Stamp", moderator: "Read", editorial: "Read", support: "Read" },
    { module: "120-Point Rating Calculation", superAdmin: "Full", admin: "Full", analyst: "Propose Delta", reviewer: "Approve / Reject", moderator: "—", editorial: "Read", support: "—" },
    { module: "Community Review Moderation", superAdmin: "Full", admin: "Full", analyst: "—", reviewer: "Audit", moderator: "Full Triage", editorial: "—", support: "Limited" },
    { module: "Trader Financial Complaints", superAdmin: "Full", admin: "Full", analyst: "—", reviewer: "Dispute Sign-off", moderator: "Arbitrate", editorial: "—", support: "Limited" },
    { module: "Editorial Guides & Publishing", superAdmin: "Full", admin: "Full", analyst: "Read", reviewer: "Compliance Gate", moderator: "—", editorial: "Full Authoring", support: "Read" },
    { module: "User Directory & Verified Badges", superAdmin: "Full", admin: "Full", analyst: "—", reviewer: "—", moderator: "Flag Accounts", editorial: "—", support: "Badge Validation" },
    { module: "Immutable Audit Logs Oversight", superAdmin: "Full Root", admin: "Full", analyst: "Own Logs", reviewer: "Full Audit", moderator: "Own Logs", editorial: "Own Logs", support: "Own Logs" },
    { module: "System Settings & Disclosures", superAdmin: "Full", admin: "Manage", analyst: "—", reviewer: "Risk Warnings", moderator: "—", editorial: "—", support: "—" },
  ];

  const getPill = (val: string) => {
    if (val.includes("Full") || val === "Verify & Stamp" || val === "Approve / Reject") {
      return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold">{val}</span>;
    }
    if (val.includes("Propose") || val.includes("Submit") || val.includes("Edit") || val.includes("Arbitrate") || val.includes("Authoring")) {
      return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px] font-bold">{val}</span>;
    }
    if (val === "Read") {
      return <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono text-[10px]">Read-Only</span>;
    }
    if (val === "—") {
      return <span className="text-slate-600 font-mono text-[11px]">—</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">{val}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 font-mono text-[11px] mb-1">
            <KeyRound className="h-3.5 w-3.5" />
            <span>ACCESS GOVERNANCE & RBAC</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Role-Based Access Control (RBAC) Permission Matrix
          </h1>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROLES.slice(0, 4).map((role) => (
          <div
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              activeRole === role.id
                ? "bg-slate-900 border-amber-500 ring-1 ring-amber-500/30 shadow-md"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{role.name}</span>
              {activeRole === role.id && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{role.description}</p>
            <div className="pt-2 text-[10px] font-mono text-slate-500">Click to simulate role</div>
          </div>
        ))}
      </div>

      {/* Full Permission Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs text-xs">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Operational Module Authorization Scope</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3.5">Functional Module</th>
                <th className="p-3.5">Super Admin</th>
                <th className="p-3.5">Admin</th>
                <th className="p-3.5">Research Analyst</th>
                <th className="p-3.5">Compliance Reviewer</th>
                <th className="p-3.5">Community Moderator</th>
                <th className="p-3.5">Editorial Manager</th>
                <th className="p-3.5">Support / Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-200">{row.module}</td>
                  <td className="p-3.5">{getPill(row.superAdmin)}</td>
                  <td className="p-3.5">{getPill(row.admin)}</td>
                  <td className="p-3.5">{getPill(row.analyst)}</td>
                  <td className="p-3.5">{getPill(row.reviewer)}</td>
                  <td className="p-3.5">{getPill(row.moderator)}</td>
                  <td className="p-3.5">{getPill(row.editorial)}</td>
                  <td className="p-3.5">{getPill(row.support)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
