import { useAdmin } from "../../context/admin-context";
import type { UserAdmin } from "../../types/admin";
import { DataTable, type Column } from "../../components/data-table";
import { StatusBadge } from "../../components/status-badge";
import { Users, ShieldCheck, UserCheck, MessageSquare, AlertTriangle, Download } from "lucide-react";

export default function UserManagement() {
  const { users } = useAdmin();

  const columns: Column<UserAdmin>[] = [
    {
      header: "User Identity",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>{row.name}</span>
              {row.isVerifiedTrader && (
                <span title="Verified Trader">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Platform Role",
      accessorKey: "role",
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 uppercase">
          {row.role.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Trader Status",
      accessorKey: "isVerifiedTrader",
      cell: (row) => (
        row.isVerifiedTrader ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            <ShieldCheck className="h-3 w-3" />
            Verified Trader
          </span>
        ) : (
          <span className="text-[11px] text-slate-500 font-mono">Standard User</span>
        )
      ),
    },
    {
      header: "Country / Exp",
      accessorKey: "country",
      cell: (row) => (
        <div className="text-[11px] text-slate-300 font-mono">
          <div>{row.country}</div>
          <div className="text-slate-500 text-[10px]">{row.tradingExperienceYears} yrs experience</div>
        </div>
      ),
    },
    {
      header: "Contributions",
      cell: (row) => (
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-cyan-400 flex items-center gap-1" title="Reviews">
            <MessageSquare className="h-3 w-3" />
            {row.reviewsCount}
          </span>
          <span className="text-rose-400 flex items-center gap-1" title="Complaints">
            <AlertTriangle className="h-3 w-3" />
            {row.complaintsCount}
          </span>
        </div>
      ),
    },
    {
      header: "Account Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: "Last Active",
      accessorKey: "lastActiveAt",
      sortable: true,
      cell: (row) => <span className="font-mono text-[11px] text-slate-400">{row.lastActiveAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono text-[11px] mb-1">
            <Users className="h-3.5 w-3.5 text-amber-400" />
            <span>USER & TRADER IDENTITY ({users.length} Accounts)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            User Directory & Trader Verification
          </h1>
        </div>

        <button className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
          <Download className="h-3.5 w-3.5" />
          <span>Export Users</span>
        </button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search user name, email, role, country..."
        searchKey="name"
      />
    </div>
  );
}
