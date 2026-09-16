import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import type { UserAdmin } from "../../types/admin";
import { DataTable, type Column } from "../../components/data-table";
import { StatusBadge } from "../../components/status-badge";
import {
  Users,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  AlertTriangle,
  Download,
  Search,
  Filter,
  X,
  Plus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  Calendar,
  Globe,
  Award,
  Shield,
  FileCheck,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  Building2,
  TrendingUp,
  Clock
} from "lucide-react";

export default function UserManagement() {
  const { users, activeRoleDef, evidenceList, setSelectedEvidenceModal } = useAdmin();

  // Local state for user actions
  const [userList, setUserList] = useState<UserAdmin[]>(users);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [traderStatusFilter, setTraderStatusFilter] = useState<string>("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("all");

  // Invite form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserAdmin["role"]>("research_analyst");
  const [inviteCountry, setInviteCountry] = useState("United Kingdom");
  const [inviteExp, setInviteExp] = useState(5);
  const [inviteIsVerified, setInviteIsVerified] = useState(true);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (traderStatusFilter === "verified" && !u.isVerifiedTrader) return false;
      if (traderStatusFilter === "standard" && u.isVerifiedTrader) return false;
      if (accountStatusFilter !== "all" && u.status !== accountStatusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.id.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [userList, roleFilter, traderStatusFilter, accountStatusFilter, searchQuery]);

  // Executive Metrics
  const totalUsersCount = userList.length;
  const verifiedTradersCount = userList.filter((u) => u.isVerifiedTrader).length;
  const internalStaffCount = userList.filter((u) => u.role !== "trader").length;
  const verifiedPercentage = totalUsersCount > 0 ? Math.round((verifiedTradersCount / totalUsersCount) * 100) : 0;

  const handleToggleVerification = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextState = !u.isVerifiedTrader;
          setActionSuccess(`Trader verification badge ${nextState ? "GRANTED to" : "REVOKED from"} ${u.name}.`);
          setTimeout(() => setActionSuccess(null), 3500);
          return { ...u, isVerifiedTrader: nextState };
        }
        return u;
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => prev ? { ...prev, isVerifiedTrader: !prev.isVerifiedTrader } : null);
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          setActionSuccess(`Account status updated to ${nextStatus.toUpperCase()} for ${u.name}.`);
          setTimeout(() => setActionSuccess(null), 3500);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => prev ? { ...prev, status: prev.status === "active" ? "suspended" : "active" } : null);
    }
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newUser: UserAdmin = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      isVerifiedTrader: inviteIsVerified,
      tradingExperienceYears: Number(inviteExp) || 3,
      country: inviteCountry,
      status: "active",
      reviewsCount: 0,
      complaintsCount: 0,
      createdAt: new Date().toISOString().substring(0, 10),
      lastActiveAt: "Just now",
    };

    setUserList((prev) => [newUser, ...prev]);
    setIsInviteModalOpen(false);
    setInviteName("");
    setInviteEmail("");
    setActionSuccess(`Added user "${newUser.name}" (${newUser.role}) to directory!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ["User ID", "Name", "Email", "Role", "Verified Trader", "Country", "Experience (Yrs)", "Status", "Created At"];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.isVerifiedTrader ? "Yes" : "No",
      `"${u.country}"`,
      u.tradingExperienceYears,
      u.status,
      u.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wikifx-users-ledger-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccess(`Exported ${filteredUsers.length} user records to CSV.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-mono text-[10px] font-bold">SUPER ADMIN</span>;
      case "compliance_reviewer":
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-mono text-[10px] font-bold">COMPLIANCE REVIEWER</span>;
      case "research_analyst":
        return <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-mono text-[10px] font-bold">RESEARCH ANALYST</span>;
      case "moderator":
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-mono text-[10px] font-bold">MODERATOR</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-bold">TRADER</span>;
    }
  };

  const columns: Column<UserAdmin>[] = [
    {
      header: "User Identity",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-xs shrink-0 shadow-2xs">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span>{row.name}</span>
              {row.isVerifiedTrader && (
                <span title="Verified Trader (Forensic Proof On File)">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Platform Role",
      accessorKey: "role",
      sortable: true,
      cell: (row) => getRoleBadge(row.role),
    },
    {
      header: "Trader Status",
      accessorKey: "isVerifiedTrader",
      cell: (row) =>
        row.isVerifiedTrader ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="h-3 w-3" />
            Verified Trader
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            Standard User
          </span>
        ),
    },
    {
      header: "Jurisdiction / Exp",
      accessorKey: "country",
      cell: (row) => (
        <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">
          <div className="font-semibold text-slate-900 dark:text-slate-100">{row.country}</div>
          <div className="text-slate-500 text-[10px]">{row.tradingExperienceYears} yrs active trading</div>
        </div>
      ),
    },
    {
      header: "Contributions",
      cell: (row) => (
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1 font-semibold bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-900" title="Published Reviews">
            <MessageSquare className="h-3 w-3" />
            {row.reviewsCount}
          </span>
          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900" title="Dispute Complaints">
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
      cell: (row) => <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{row.lastActiveAt}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedUser(row)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
            title="Inspect Dossier"
          >
            <Eye className="h-3.5 w-3.5 text-indigo-500" />
          </button>
          <button
            onClick={() => handleToggleVerification(row.id)}
            className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              row.isVerifiedTrader
                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-400"
            }`}
            title={row.isVerifiedTrader ? "Revoke Verification" : "Grant Verified Badge"}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setTraderStatusFilter("all");
    setAccountStatusFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || roleFilter !== "all" || traderStatusFilter !== "all" || accountStatusFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-mono text-xs mb-1.5 font-bold">
            <Users className="h-3.5 w-3.5 text-amber-500" />
            <span>USER & TRADER IDENTITY ({userList.length} ACCOUNTS)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            User Directory & Trader Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage trader identities, verified review badges, regulatory analyst permissions, and disciplinary standing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-indigo-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add / Invite User</span>
          </button>
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

      {/* Executive User Directory KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Total Accounts</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalUsersCount}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Platform identity ledger</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Verified Live Traders</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {verifiedTradersCount} <span className="text-xs text-slate-400 font-normal">({verifiedPercentage}%)</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-3 w-3" />
            <span>Forensic trade proof verified</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Internal Staff & Analysts</span>
            <UserCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
            {internalStaffCount}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Role-Based Access Governance</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Account Health Standing</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            100% Active
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>0 accounts under disciplinary ban</span>
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Query Input */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name, email, role, country..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="lg:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Roles ({userList.length})</option>
              <option value="super_admin">Super Admin</option>
              <option value="compliance_reviewer">Compliance Reviewer</option>
              <option value="research_analyst">Research Analyst</option>
              <option value="moderator">Community Moderator</option>
              <option value="trader">Trader</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="lg:col-span-3">
            <select
              value={traderStatusFilter}
              onChange={(e) => setTraderStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified Traders Only</option>
              <option value="standard">Standard Traders</option>
            </select>
          </div>

          {/* View Mode Toggle & Reset */}
          <div className="lg:col-span-2 flex items-center justify-end gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === "table" ? (
        <DataTable
          data={filteredUsers}
          columns={columns}
          searchPlaceholder="Filter table rows..."
          searchKey="name"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs relative"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {u.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {u.isVerifiedTrader && (
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[170px]">{u.email}</div>
                  </div>
                </div>

                <StatusBadge status={u.status} size="sm" />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div>{getRoleBadge(u.role)}</div>
                <div className="font-mono text-xs text-slate-500">{u.country}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500">
                  Reviews: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{u.reviewsCount}</strong>
                </div>
                <div className="text-slate-500">
                  Disputes: <strong className="text-rose-600 dark:text-rose-400 font-bold">{u.complaintsCount}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setSelectedUser(u)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Dossier</span>
                </button>

                <button
                  onClick={() => handleToggleVerification(u.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    u.isVerifiedTrader
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{u.isVerifiedTrader ? "Verified" : "Verify"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Dossier Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-base shadow-xs">
                  {selectedUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5">
                    <span>{selectedUser.name}</span>
                    {selectedUser.isVerifiedTrader && (
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">User Identifier</div>
                <div className="font-bold text-slate-900 dark:text-white">{selectedUser.id}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Platform Role</div>
                <div>{getRoleBadge(selectedUser.role)}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Jurisdiction</div>
                <div className="font-bold text-slate-900 dark:text-white">{selectedUser.country}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Trading Experience</div>
                <div className="font-bold text-slate-900 dark:text-white">{selectedUser.tradingExperienceYears} Years</div>
              </div>
            </div>

            {selectedUser.verifiedDepositSlipEvidenceId && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-200">Deposit Slip Proof On File</div>
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      ID: {selectedUser.verifiedDepositSlipEvidenceId}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const ev = evidenceList.find((e) => e.id === selectedUser.verifiedDepositSlipEvidenceId);
                    if (ev) setSelectedEvidenceModal(ev);
                  }}
                  className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 rounded-lg font-bold border border-slate-200 dark:border-slate-700 text-[11px] cursor-pointer"
                >
                  Inspect Proof
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleStatus(selectedUser.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedUser.status === "active"
                    ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {selectedUser.status === "active" ? "Suspend Account" : "Re-Activate Account"}
              </button>

              <button
                onClick={() => handleToggleVerification(selectedUser.id)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{selectedUser.isVerifiedTrader ? "Revoke Badge" : "Grant Verified Badge"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">Register / Invite User</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Add analyst, reviewer, or verified trader</p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="d.vance@wikifx.internal"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Platform Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200"
                  >
                    <option value="research_analyst">Research Analyst</option>
                    <option value="compliance_reviewer">Compliance Reviewer</option>
                    <option value="moderator">Community Moderator</option>
                    <option value="trader">Verified Trader</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Jurisdiction / Country</label>
                  <input
                    type="text"
                    value={inviteCountry}
                    onChange={(e) => setInviteCountry(e.target.value)}
                    placeholder="United Kingdom"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Trading Experience (Yrs)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={inviteExp}
                    onChange={(e) => setInviteExp(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inviteIsVerified}
                      onChange={(e) => setInviteIsVerified(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Grant Verified Trader Badge</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
