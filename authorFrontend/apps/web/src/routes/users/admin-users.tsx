import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { useAdmin } from "../../context/admin-context";
import { DataTable, type Column } from "../../components/data-table";
import type { UserAdmin, AdminRole } from "../../types/admin";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Mail,
  Eye,
  Key,
  Lock,
  Calendar,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Users,
  Check,
  X,
  Building2,
  Clock,
  UserCheck,
  FileSpreadsheet
} from "lucide-react";

export default function AdminUsersPage() {
  const { users, addAuditLogEntry } = useAdmin();
  const [userList, setUserList] = useState<UserAdmin[]>(() =>
    users.map((u) => ({ ...u }))
  );

  // View mode
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("all");

  // Selection & Modal states
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "compliance_reviewer" as AdminRole,
    country: "United Kingdom",
    department: "Compliance & Legal",
    securityTier: "Tier 2 - Operational Access",
  });

  // Filter only Admin users (role !== 'trader')
  const adminUsers = useMemo(() => {
    return userList.filter((u) => u.role !== "trader");
  }, [userList]);

  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((u) => {
      // Role filter
      if (roleFilter !== "all" && u.role !== roleFilter) return false;

      // Status filter
      if (accountStatusFilter !== "all" && u.status !== accountStatusFilter) return false;

      // Search Query
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
  }, [adminUsers, roleFilter, accountStatusFilter, searchQuery]);

  // Executive Metrics
  const totalAdminsCount = adminUsers.length;
  const activeAdminsCount = adminUsers.filter((u) => u.status === "active").length;
  const superAdminsCount = adminUsers.filter((u) => u.role === "super_admin").length;
  const complianceOfficersCount = adminUsers.filter((u) => u.role === "compliance_reviewer").length;

  const handleToggleStatus = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          setActionSuccess(`Administrative status for ${u.name} updated to ${nextStatus.toUpperCase()}.`);
          if (addAuditLogEntry) {
            addAuditLogEntry({
              action: nextStatus === "suspended" ? "REJECT" : "UPDATE",
              entityType: "user",
              entityId: u.id,
              entityName: u.name,
              summary: `${nextStatus === "suspended" ? "Suspended" : "Activated"} admin governance access for ${u.name} (${u.role}).`,
            });
          }
          setTimeout(() => setActionSuccess(null), 3500);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) =>
        prev ? { ...prev, status: prev.status === "active" ? "suspended" : "active" } : null
      );
    }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) return;

    const created: UserAdmin = {
      id: `usr-adm-${Date.now().toString().slice(-4)}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      isVerifiedTrader: true,
      tradingExperienceYears: 5,
      country: newAdmin.country,
      status: "active",
      reviewsCount: 0,
      complaintsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastActiveAt: "Just now",
    };

    setUserList((prev) => [created, ...prev]);
    if (addAuditLogEntry) {
      addAuditLogEntry({
        action: "CREATE",
        entityType: "user",
        entityId: created.id,
        entityName: created.name,
        summary: `Invited new administrative staff member ${created.name} as ${created.role}.`,
      });
    }

    setActionSuccess(`Administrative officer ${created.name} successfully registered.`);
    setIsInviteModalOpen(false);
    setNewAdmin({
      name: "",
      email: "",
      role: "compliance_reviewer",
      country: "United Kingdom",
      department: "Compliance & Legal",
      securityTier: "Tier 2 - Operational Access",
    });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ["User ID", "Full Name", "Email Address", "Administrative Role", "Jurisdiction", "Account Status", "Created Date", "Last Active"];
    const rows = filteredAdmins.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      `"${u.country}"`,
      u.status,
      u.createdAt,
      `"${u.lastActiveAt}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin-staff-roster-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadge = (role: AdminRole | "trader") => {
    switch (role) {
      case "super_admin":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            <Lock className="h-3 w-3 text-rose-500" />
            SUPER ADMIN
          </span>
        );
      case "compliance_reviewer":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            <Shield className="h-3 w-3 text-purple-500" />
            COMPLIANCE REVIEWER
          </span>
        );
      case "research_analyst":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
            <Sparkles className="h-3 w-3 text-blue-500" />
            RESEARCH ANALYST
          </span>
        );
      case "moderator":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <CheckCircle2 className="h-3 w-3 text-amber-500" />
            MODERATOR
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {role}
          </span>
        );
    }
  };

  const getStatusBadge = (status: UserAdmin["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ACTIVE
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-800 dark:text-rose-300 font-bold bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="h-3 w-3 text-rose-500" />
            SUSPENDED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600">
            {status}
          </span>
        );
    }
  };

  const columns: Column<UserAdmin>[] = [
    {
      header: "Officer / Identity",
      accessorKey: "name",
      sortable: true,
      cell: (row: UserAdmin) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs bg-gradient-to-br from-purple-500/20 to-amber-500/20 border-purple-500/30 text-purple-700 dark:text-purple-300">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span>{row.name}</span>
              <Shield className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "RBAC Role",
      accessorKey: "role",
      sortable: true,
      cell: (row: UserAdmin) => getRoleBadge(row.role),
    },
    {
      header: "Jurisdiction & Base",
      accessorKey: "country",
      cell: (row: UserAdmin) => (
        <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">
          <div className="font-semibold text-slate-900 dark:text-slate-100">{row.country}</div>
          <div className="text-slate-500 text-[10px] flex items-center gap-1">
            <Building2 className="h-3 w-3 text-slate-400" />
            Operations HQ
          </div>
        </div>
      ),
    },
    {
      header: "Account Status",
      accessorKey: "status",
      cell: (row: UserAdmin) => getStatusBadge(row.status),
    },
    {
      header: "Last Activity",
      accessorKey: "lastActiveAt",
      cell: (row: UserAdmin) => (
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Clock className="h-3 w-3 text-slate-400" />
          {row.lastActiveAt}
        </div>
      ),
    },
    {
      header: "Governance Actions",
      cell: (row: UserAdmin) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => setSelectedUser(row)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Inspect Officer Dossier"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleToggleStatus(row.id)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              row.status === "active"
                ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100"
                : "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
            }`}
            title={row.status === "active" ? "Suspend Officer Access" : "Activate Officer Access"}
          >
            {row.status === "active" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-xs font-sans w-full pb-16">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 font-mono text-[11px] mb-1 font-semibold">
            <Shield className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>ADMINISTRATIVE GOVERNANCE ({totalAdminsCount} Active Staff Officers)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Admin Staff &amp; Security Officers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Manage administrative credentials, internal compliance reviewers, research analysts, and RBAC governance tiers.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Table / Grid Switcher */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-purple-600 text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export Admin Roster CSV"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Roster</span>
          </button>

          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Invite Admin Officer</span>
          </button>
        </div>
      </div>

      {/* ── Quick Switch Banner to Platform Traders ── */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shrink-0">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-xs">
              Looking for Public Traders &amp; Platform Account Holders?
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Manage retail traders, forensic statement verifications, and community reviewer identities on the dedicated traders page.
            </div>
          </div>
        </div>
        <Link
          to="/users/traders"
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <span>Open Platform Traders Directory</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-xs">{actionSuccess}</span>
        </div>
      )}

      {/* ── Executive Metric KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Admin Staff Members</span>
            <Shield className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalAdminsCount}</div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
            {activeAdminsCount} active governance sessions
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Super Admins</span>
            <Lock className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">{superAdminsCount}</div>
          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
            Root access &amp; system parameters
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Compliance Reviewers</span>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{complianceOfficersCount}</div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
            4-Eyes verification signatory power
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>MFA Security Coverage</span>
            <Key className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Hardware FIDO2 &amp; TOTP enforced
          </div>
        </div>
      </div>

      {/* ── Filters and Search Bar ── */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search officer name, email, role, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
            >
              <option value="all">All Admin Roles</option>
              <option value="super_admin">Super Admins</option>
              <option value="compliance_reviewer">Compliance Reviewers</option>
              <option value="research_analyst">Research Analysts</option>
              <option value="moderator">Moderators</option>
            </select>

            {/* Account Status Filter */}
            <select
              value={accountStatusFilter}
              onChange={(e) => setAccountStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          {(searchQuery || roleFilter !== "all" || accountStatusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setAccountStatusFilter("all");
              }}
              className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Main View Area (Table vs Grid) ── */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredAdmins}
            pageSize={10}
          />
        </div>
      ) : (
        /* Grid Card Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAdmins.map((user) => (
            <div
              key={user.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-purple-500/40 hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-sm text-purple-700 dark:text-purple-300 shrink-0">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <span>{user.name}</span>
                        <Shield className="h-3.5 w-3.5 text-purple-500" />
                      </h3>
                      <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{user.email}</div>
                    </div>
                  </div>
                  {getStatusBadge(user.status)}
                </div>

                <div className="flex items-center gap-2">
                  {getRoleBadge(user.role)}
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {user.country}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Clearance</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {user.role === "super_admin" ? "Level 4 (Root)" : "Level 3 (Reviewer)"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Last Active</div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{user.lastActiveAt}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>View Dossier</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(user.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    user.status === "active"
                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                      : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  {user.status === "active" ? (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Suspend</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Activate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Invite Admin Officer Modal ── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Invite Administrative Staff</h3>
                  <p className="text-slate-500 text-xs">Issue governance credentials and RBAC clearance tier.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Full Name &amp; Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Julian Archer"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Corporate Internal Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. j.archer@wikifx.internal"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                    Administrative Role
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as AdminRole })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40"
                  >
                    <option value="compliance_reviewer">Compliance Reviewer</option>
                    <option value="research_analyst">Research Analyst</option>
                    <option value="moderator">Moderator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                    Jurisdiction / Office
                  </label>
                  <select
                    value={newAdmin.country}
                    onChange={(e) => setNewAdmin({ ...newAdmin, country: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40"
                  >
                    <option value="United Kingdom">United Kingdom (London HQ)</option>
                    <option value="Cyprus">Cyprus (Limassol Office)</option>
                    <option value="Australia">Australia (Sydney Hub)</option>
                    <option value="Singapore">Singapore (APAC Center)</option>
                    <option value="United States">United States (New York)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 space-y-1 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  Security Enforcement Policy
                </div>
                <div className="text-[11px] text-purple-800 dark:text-purple-400">
                  New administrative accounts require hardware MFA verification on first login. An invitation link with one-time security token will be dispatched immediately.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Send Admin Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Officer Dossier Inspection Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-purple-500/30 flex items-center justify-center font-black text-sm text-purple-700 dark:text-purple-300">
                  {selectedUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    {getRoleBadge(selectedUser.role)}
                  </h3>
                  <p className="text-slate-500 text-xs font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Status</div>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Jurisdiction</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-1">{selectedUser.country}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Security Tier</div>
                  <div className="font-bold text-purple-600 dark:text-purple-400 text-xs mt-1">
                    {selectedUser.role === "super_admin" ? "Root / Tier 4" : "Auditor / Tier 3"}
                  </div>
                </div>
              </div>

              {/* RBAC Capabilities Matrix */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/50 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-between">
                  <span>RBAC Privileges &amp; Operations Scope</span>
                  <Link to="/roles" className="text-purple-600 hover:underline text-[11px] font-medium">
                    Modify RBAC Matrix
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Broker Research &amp; Ratings</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Regulatory Queue Verification</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Forensic Evidence Review</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    {selectedUser.role === "super_admin" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span>Immutable Audit Log Export</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedUser.id)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  selectedUser.status === "active"
                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                    : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                }`}
              >
                {selectedUser.status === "active" ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Suspend Admin Session</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Re-activate Access</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
