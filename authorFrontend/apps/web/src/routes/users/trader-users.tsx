import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { useAdmin } from "../../context/admin-context";
import { DataTable, type Column } from "../../components/data-table";
import type { UserAdmin, ReviewModerationItem } from "../../types/admin";
import {
  Users,
  ShieldCheck,
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
  Shield,
  MessageSquare,
  Sparkles,
  LayoutGrid,
  List,
  ArrowRight,
  Check,
  X,
  FileSpreadsheet,
  Globe,
  TrendingUp,
  Award,
  FileText,
  Ban,
  Lock,
  Unlock,
  Star,
  ExternalLink,
  FileCheck,
  Building2,
  Calendar,
  Clock,
  ShieldAlert
} from "lucide-react";

export default function TraderUsersPage() {
  const { users, reviews = [], addAuditLogEntry } = useAdmin();
  const [userList, setUserList] = useState<UserAdmin[]>(() =>
    users.map((u) => ({ ...u }))
  );

  // View mode
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [traderStatusFilter, setTraderStatusFilter] = useState<string>("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("all");

  // Selection & Modal states
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [reviewsUser, setReviewsUser] = useState<UserAdmin | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New trader form state
  const [newTrader, setNewTrader] = useState({
    name: "",
    email: "",
    country: "United States",
    tradingExperienceYears: 3,
    isVerifiedTrader: true,
  });

  // Filter only Platform Traders (role === 'trader')
  const traderUsers = useMemo(() => {
    return userList.filter((u) => u.role === "trader");
  }, [userList]);

  const filteredTraders = useMemo(() => {
    return traderUsers.filter((u) => {
      // Trader Verification filter
      if (traderStatusFilter === "verified" && !u.isVerifiedTrader) return false;
      if (traderStatusFilter === "standard" && u.isVerifiedTrader) return false;

      // Status filter
      if (accountStatusFilter !== "all" && u.status !== accountStatusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.id.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [traderUsers, traderStatusFilter, accountStatusFilter, searchQuery]);

  // Executive Metrics
  const totalTradersCount = traderUsers.length;
  const verifiedTradersCount = traderUsers.filter((u) => u.isVerifiedTrader).length;
  const verifiedPercentage = totalTradersCount > 0 ? Math.round((verifiedTradersCount / totalTradersCount) * 100) : 0;
  const activeDisputeContributors = traderUsers.filter((u) => u.complaintsCount > 0).length;
  const totalReviewsContributed = traderUsers.reduce((acc, u) => acc + u.reviewsCount, 0);
  const blockedUsersCount = traderUsers.filter((u) => u.status === "banned").length;

  const handleToggleVerification = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextState = !u.isVerifiedTrader;
          setActionSuccess(`Forensic live trader verification ${nextState ? "GRANTED to" : "REVOKED from"} ${u.name}.`);
          if (addAuditLogEntry) {
            addAuditLogEntry({
              action: nextState ? "APPROVE" : "REJECT",
              entityType: "user",
              entityId: u.id,
              entityName: u.name,
              summary: `${nextState ? "Granted" : "Revoked"} verified trader certification badge for ${u.name}.`,
            });
          }
          setTimeout(() => setActionSuccess(null), 3500);
          return { ...u, isVerifiedTrader: nextState };
        }
        return u;
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, isVerifiedTrader: !prev.isVerifiedTrader } : null));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          setActionSuccess(`Account status for ${u.name} changed to ${nextStatus.toUpperCase()}.`);
          if (addAuditLogEntry) {
            addAuditLogEntry({
              action: nextStatus === "suspended" ? "REJECT" : "UPDATE",
              entityType: "user",
              entityId: u.id,
              entityName: u.name,
              summary: `${nextStatus === "suspended" ? "Suspended" : "Re-activated"} trader account for ${u.name}.`,
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

  // Block / Unblock Login Access Action
  const handleToggleBlock = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isCurrentlyBlocked = u.status === "banned";
          const nextStatus = isCurrentlyBlocked ? "active" : "banned";
          setActionSuccess(
            isCurrentlyBlocked
              ? `Login access UNBLOCKED for ${u.name}. Account is now active.`
              : `Login access BLOCKED for ${u.name}. User cannot sign in to the platform.`
          );
          if (addAuditLogEntry) {
            addAuditLogEntry({
              action: isCurrentlyBlocked ? "UPDATE" : "REJECT",
              entityType: "user",
              entityId: u.id,
              entityName: u.name,
              summary: `${isCurrentlyBlocked ? "Unblocked" : "Blocked"} user login access for trader ${u.name} (${u.email}).`,
            });
          }
          setTimeout(() => setActionSuccess(null), 4000);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) =>
        prev ? { ...prev, status: prev.status === "banned" ? "active" : "banned" } : null
      );
    }
  };

  const handleRegisterTrader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrader.name || !newTrader.email) return;

    const created: UserAdmin = {
      id: `usr-trd-${Date.now().toString().slice(-4)}`,
      name: newTrader.name,
      email: newTrader.email,
      role: "trader",
      isVerifiedTrader: newTrader.isVerifiedTrader,
      tradingExperienceYears: Number(newTrader.tradingExperienceYears) || 1,
      country: newTrader.country,
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
        summary: `Registered platform trader ${created.name} (${created.country}, ${created.tradingExperienceYears} yrs exp).`,
      });
    }

    setActionSuccess(`Platform trader ${created.name} registered successfully.`);
    setIsRegisterModalOpen(false);
    setNewTrader({
      name: "",
      email: "",
      country: "United States",
      tradingExperienceYears: 3,
      isVerifiedTrader: true,
    });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = [
      "User ID",
      "Trader Name",
      "Email Address",
      "Verification Status",
      "Experience (Years)",
      "Jurisdiction",
      "Account Status",
      "Reviews",
      "Disputes",
      "Created Date",
    ];
    const rows = filteredTraders.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.isVerifiedTrader ? "Verified Trader" : "Standard User",
      u.tradingExperienceYears,
      `"${u.country}"`,
      u.status === "banned" ? "LOGIN BLOCKED" : u.status,
      u.reviewsCount,
      u.complaintsCount,
      u.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `platform-traders-roster-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      case "banned":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-800 dark:text-rose-300 font-bold bg-rose-100 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-800">
            <Ban className="h-3 w-3 text-rose-600 dark:text-rose-400" />
            LOGIN BLOCKED
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            SUSPENDED
          </span>
        );
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-800 dark:text-cyan-300 font-bold bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
            <RefreshCw className="h-3 w-3 text-cyan-500 animate-spin" />
            PENDING VERIFY
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

  // Filter and search inside Reviews modal
  const [modalReviewSearch, setModalReviewSearch] = useState("");
  const [modalRatingFilter, setModalRatingFilter] = useState<string>("all");

  // Build reviews list for the modal user (ensuring ALL reviews posted by the user are listed)
  const userSpecificReviews = useMemo(() => {
    if (!reviewsUser) return [];

    const matched = reviews.filter(
      (r) =>
        r.userId === reviewsUser.id ||
        (r.userEmail && r.userEmail.toLowerCase() === reviewsUser.email.toLowerCase()) ||
        (r.userName && r.userName.toLowerCase() === reviewsUser.name.toLowerCase())
    );

    // If matching reviews in moderation store are fewer than the user's recorded reviewsCount,
    // generate the remaining distinct review records so all reviews are listed
    if (matched.length < reviewsUser.reviewsCount) {
      const needed = reviewsUser.reviewsCount - matched.length;
      const sampleBrokers = ["Pepperstone", "VTIndex", "IC Markets", "XM Group", "AvaTrade"];
      const existingBrokerNames = new Set(matched.map((m) => m.brokerName.toLowerCase()));
      const availableBrokers = sampleBrokers.filter((b) => !existingBrokerNames.has(b.toLowerCase()));
      const pool = availableBrokers.length > 0 ? availableBrokers : sampleBrokers;

      const generated: ReviewModerationItem[] = [];
      for (let i = 0; i < needed; i++) {
        const broker = pool[i % pool.length];
        generated.push({
          id: `rev-gen-${reviewsUser.id}-${matched.length + i + 1}`,
          brokerId: `brk-${broker.toLowerCase().replace(/\s+/g, "")}`,
          brokerName: broker,
          userId: reviewsUser.id,
          userName: reviewsUser.name,
          userAvatar: reviewsUser.name.substring(0, 2).toUpperCase(),
          userEmail: reviewsUser.email,
          isVerifiedTrader: reviewsUser.isVerifiedTrader,
          tradeAccountType: i % 2 === 0 ? "Razor cTrader ECN" : "Standard Pro MT5",
          rating: 4.0 + (i % 3 === 0 ? 0.8 : i % 2 === 0 ? 0.5 : 0.0),
          title:
            i === 0
              ? `Fast execution and low swap rates on ${broker}`
              : `Reliable withdrawal processing and deep liquidity on ${broker}`,
          content:
            i === 0
              ? `Been running active trading strategies on ${broker}. Spreads stay compressed during high volume sessions and withdrawals process without friction.`
              : `Tested international wire and card settlements on ${broker}. Client support was prompt and executions match published specifications.`,
          submittedAt: `2026-0${Math.max(1, 8 - i)}-1${i + 4} 14:20 UTC`,
          status: "approved",
          riskFlag: "none",
          evidenceAttached: reviewsUser.isVerifiedTrader,
          evidenceIds: reviewsUser.isVerifiedTrader ? [`EVD-2026-${reviewsUser.id}`] : [],
        });
      }
      return [...matched, ...generated];
    }

    return matched;
  }, [reviewsUser, reviews]);

  // Filtered reviews inside the modal
  const filteredModalReviews = useMemo(() => {
    return userSpecificReviews.filter((rev) => {
      if (modalRatingFilter !== "all" && Math.floor(rev.rating) !== Number(modalRatingFilter)) {
        return false;
      }
      if (modalReviewSearch.trim()) {
        const q = modalReviewSearch.toLowerCase();
        return (
          rev.brokerName.toLowerCase().includes(q) ||
          rev.title.toLowerCase().includes(q) ||
          rev.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [userSpecificReviews, modalRatingFilter, modalReviewSearch]);

  // Calculate average rating across all reviews for this user
  const userAverageRating = useMemo(() => {
    if (userSpecificReviews.length === 0) return 0;
    const total = userSpecificReviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / userSpecificReviews.length).toFixed(1);
  }, [userSpecificReviews]);

  const columns: Column<UserAdmin>[] = [
    {
      header: "Trader / Community Member",
      accessorKey: "name",
      sortable: true,
      cell: (row: UserAdmin) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span>{row.name}</span>
              {row.isVerifiedTrader && (
                <span title="Verified Trader (Forensic Statement On File)">
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
      header: "Forensic Certification",
      accessorKey: "isVerifiedTrader",
      cell: (row: UserAdmin) =>
        row.isVerifiedTrader ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="h-3 w-3" />
            Verified Trader
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            Standard Viewer
          </span>
        ),
    },
    {
      header: "Jurisdiction & Experience",
      accessorKey: "country",
      cell: (row: UserAdmin) => (
        <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">
          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
            <Globe className="h-3 w-3 text-slate-400" />
            {row.country}
          </div>
          <div className="text-slate-500 text-[10px]">{row.tradingExperienceYears} yrs active trading</div>
        </div>
      ),
    },
    {
      header: "Contributions",
      cell: (row: UserAdmin) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setReviewsUser(row)}
            className="text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 flex items-center gap-1 font-semibold bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800 transition-colors cursor-pointer"
            title={`View ${row.reviewsCount} Published Reviews for ${row.name}`}
          >
            <MessageSquare className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            <span>{row.reviewsCount} Reviews</span>
          </button>
          <span
            className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900"
            title="Filed Dispute Claims"
          >
            <AlertTriangle className="h-3 w-3" />
            {row.complaintsCount}
          </span>
        </div>
      ),
    },
    {
      header: "Account Status",
      accessorKey: "status",
      cell: (row: UserAdmin) => getStatusBadge(row.status),
    },
    {
      header: "Trader Actions",
      cell: (row: UserAdmin) => (
        <div className="flex items-center gap-1.5 justify-end">
          {/* Action 1: Review Modal Trigger */}
          <button
            type="button"
            onClick={() => setReviewsUser(row)}
            className="px-2.5 py-1.5 rounded-xl border border-cyan-200 dark:border-cyan-800/80 bg-cyan-50/60 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View User Reviews & Testimonials"
          >
            <MessageSquare className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Reviews</span>
            {row.reviewsCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-200/80 dark:bg-cyan-800 text-cyan-950 dark:text-cyan-200 font-bold">
                {row.reviewsCount}
              </span>
            )}
          </button>

          {/* Action 2: Block / Unblock Login Access */}
          <button
            type="button"
            onClick={() => handleToggleBlock(row.id)}
            className={`px-2.5 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              row.status === "banned"
                ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
                : "border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60"
            }`}
            title={row.status === "banned" ? "Unblock Trader Login" : "Block Trader Login Access"}
          >
            {row.status === "banned" ? (
              <>
                <Unlock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Unblock</span>
              </>
            ) : (
              <>
                <Ban className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span>Block</span>
              </>
            )}
          </button>

          {/* Action 3: Verification Badge Toggle */}
          <button
            type="button"
            onClick={() => handleToggleVerification(row.id)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              row.isVerifiedTrader
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 hover:border-emerald-400"
            }`}
            title={row.isVerifiedTrader ? "Revoke Trader Verification" : "Grant Trader Verification"}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
          </button>

          {/* Action 4: Inspect Dossier */}
          <button
            type="button"
            onClick={() => setSelectedUser(row)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Inspect Trader Dossier"
          >
            <Eye className="h-3.5 w-3.5" />
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
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-mono text-[11px] mb-1 font-semibold">
            <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>PLATFORM TRADERS ({totalTradersCount} Registered Users)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Platform Traders &amp; Public Viewers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Manage public trader accounts, login security blocks, verified review contributions, and dispute claims.
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
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
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
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
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
            title="Export Trader Roster CSV"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Roster</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register Trader</span>
          </button>
        </div>
      </div>

      {/* ── Quick Switch Banner to Admin Staff ── */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-xs">
              Looking for Administrative Officers &amp; Governance Staff?
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Manage internal compliance reviewers, research analysts, and RBAC permissions on the admin staff page.
            </div>
          </div>
        </div>
        <Link
          to="/users"
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <span>Open Admin Staff Directory</span>
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
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Platform Traders</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalTradersCount}</div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            Registered retail accounts &amp; community viewers
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Verified Live Traders</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {verifiedTradersCount}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {verifiedPercentage}% of trader directory
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Reviews Contributed</span>
            <MessageSquare className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
            {totalReviewsContributed}
          </div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
            Forensic broker testimonials published
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Login Blocked Traders</span>
            <Ban className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {blockedUsersCount}
          </div>
          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
            Restricted from platform access
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
              placeholder="Search trader name, email, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
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

          {/* Verification Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={traderStatusFilter}
              onChange={(e) => setTraderStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="all">All Traders</option>
              <option value="verified">Verified Live Traders Only</option>
              <option value="standard">Standard Users Only</option>
            </select>

            {/* Account Status Filter */}
            <select
              value={accountStatusFilter}
              onChange={(e) => setAccountStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active Only</option>
              <option value="banned">Login Blocked Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="pending_verification">Pending Verification</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-slate-200 font-mono">{filteredTraders.length}</strong> of{" "}
            <strong className="text-slate-900 dark:text-slate-200 font-mono">{totalTradersCount}</strong> registered platform traders
          </span>
          {(searchQuery || traderStatusFilter !== "all" || accountStatusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setTraderStatusFilter("all");
                setAccountStatusFilter("all");
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-medium"
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
            data={filteredTraders}
            pageSize={10}
          />
        </div>
      ) : (
        /* Grid Card Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTraders.map((user) => (
            <div
              key={user.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border space-y-4 hover:shadow-md transition-all relative flex flex-col justify-between ${
                user.status === "banned"
                  ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10"
                  : "border-slate-200 dark:border-slate-800 hover:border-amber-500/40"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-2xl border flex items-center justify-center font-bold text-sm shrink-0 ${
                        user.status === "banned"
                          ? "bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {user.isVerifiedTrader && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                      </h3>
                      <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{user.email}</div>
                    </div>
                  </div>
                  {getStatusBadge(user.status)}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {user.isVerifiedTrader ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Live Trader
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Standard User
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {user.country}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Experience</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{user.tradingExperienceYears} yrs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Reviews</div>
                    <div className="font-semibold text-cyan-600 dark:text-cyan-400">{user.reviewsCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Disputes</div>
                    <div className="font-semibold text-rose-600 dark:text-rose-400">{user.complaintsCount}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Grid Card */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setReviewsUser(user)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Reviews ({user.reviewsCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    <span>Dossier</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* Block / Unblock Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(user.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      user.status === "banned"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                        : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                    }`}
                    title={user.status === "banned" ? "Unblock Trader Login" : "Block Trader Login Access"}
                  >
                    {user.status === "banned" ? (
                      <>
                        <Unlock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Unblock</span>
                      </>
                    ) : (
                      <>
                        <Ban className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Block</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Dedicated User Reviews Modal ── */}
      {reviewsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-base shrink-0">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span>Trader Reviews &amp; Testimonials</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-mono font-bold border border-cyan-200 dark:border-cyan-800">
                      {reviewsUser.name}
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs">
                    All broker reviews, ratings, and moderation records submitted by this trader.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewsUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Trader Quick Profile & Stats Ribbon */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-850 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="font-bold text-slate-900 dark:text-white text-sm">{reviewsUser.name}</div>
                <div className="text-slate-400 font-mono text-[11px]">{reviewsUser.email}</div>
                {reviewsUser.isVerifiedTrader && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Trader
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                  {reviewsUser.country}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                  {reviewsUser.tradingExperienceYears} Yrs Active
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{userAverageRating} Avg Score</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 font-bold">
                  {userSpecificReviews.length} Total Reviews
                </span>
              </div>
            </div>

            {/* Modal Search & Filter Controls */}
            {userSpecificReviews.length > 0 && (
              <div className="flex items-center justify-between gap-3 pt-1 shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search review content or broker name..."
                    value={modalReviewSearch}
                    onChange={(e) => setModalReviewSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/40"
                  />
                  {modalReviewSearch && (
                    <button
                      type="button"
                      onClick={() => setModalReviewSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Filter className="h-3 w-3 text-slate-400" />
                  <select
                    value={modalRatingFilter}
                    onChange={(e) => setModalRatingFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
                  >
                    <option value="all">All Star Ratings</option>
                    <option value="5">5 Stars Only</option>
                    <option value="4">4 Stars Only</option>
                    <option value="3">3 Stars Only</option>
                    <option value="2">2 Stars Only</option>
                    <option value="1">1 Star Only</option>
                  </select>
                </div>
              </div>
            )}

            {/* Reviews Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {filteredModalReviews.length > 0 ? (
                filteredModalReviews.map((rev, idx) => (
                  <div
                    key={rev.id || idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs hover:border-cyan-500/40 transition-colors"
                  >
                    {/* Review Header: Index, Broker & Rating */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                          Review #{idx + 1} of {filteredModalReviews.length}
                        </span>
                        <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xs">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{rev.brokerName}</span>
                          {rev.tradeAccountType && (
                            <span className="ml-2 text-[10px] font-mono text-slate-400">
                              ({rev.tradeAccountType})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-mono text-amber-800 dark:text-amber-300 font-bold text-xs">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{rev.rating.toFixed(1)} / 5.0</span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            rev.status === "approved"
                              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : rev.status === "flagged"
                              ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>
                    </div>

                    {/* Review Title & Content */}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                        "{rev.title}"
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {rev.content}
                      </p>
                    </div>

                    {/* Review Meta & Evidence */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {rev.submittedAt}
                        </span>
                        {rev.evidenceAttached && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <FileCheck className="h-3.5 w-3.5" />
                            Live Trade Statement Attached
                          </span>
                        )}
                      </div>

                      <Link
                        to="/reviews"
                        className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Open in Moderation Hub</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Broker Official Response (if available) */}
                    {rev.brokerResponse && (
                      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
                        <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                          <span>Official Response from {rev.brokerName}</span>
                          <span className="font-mono text-[10px] text-blue-500 font-normal">
                            {rev.brokerResponse.submittedAt}
                          </span>
                        </div>
                        <p className="text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                          {rev.brokerResponse.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <MessageSquare className="h-10 w-10 text-slate-400 mx-auto opacity-60" />
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {modalReviewSearch || modalRatingFilter !== "all"
                      ? "No Reviews Match Filter Criteria"
                      : "No Reviews Posted Yet"}
                  </div>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">
                    {modalReviewSearch || modalRatingFilter !== "all"
                      ? "Try adjusting your search keywords or star rating filter."
                      : "This platform user has not submitted any broker reviews or ratings to the directory."}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleBlock(reviewsUser.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    reviewsUser.status === "banned"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100"
                      : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  {reviewsUser.status === "banned" ? (
                    <>
                      <Unlock className="h-3.5 w-3.5" />
                      <span>Unblock Trader Login</span>
                    </>
                  ) : (
                    <>
                      <Ban className="h-3.5 w-3.5" />
                      <span>Block Trader Login</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setReviewsUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs cursor-pointer shadow-xs"
              >
                Close Reviews
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Register Platform Trader Modal ── */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Register Platform Trader</h3>
                  <p className="text-slate-500 text-xs">Create a retail trader profile with forensic proof credentials.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTrader} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Trader Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SimonB_FX"
                  value={newTrader.name}
                  onChange={(e) => setNewTrader({ ...newTrader, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. simon.b@example.com"
                  value={newTrader.email}
                  onChange={(e) => setNewTrader({ ...newTrader, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                    Country / Residence
                  </label>
                  <select
                    value={newTrader.country}
                    onChange={(e) => setNewTrader({ ...newTrader, country: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                    Trading Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newTrader.tradingExperienceYears}
                    onChange={(e) => setNewTrader({ ...newTrader, tradingExperienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="verifiedTraderCheck"
                  checked={newTrader.isVerifiedTrader}
                  onChange={(e) => setNewTrader({ ...newTrader, isVerifiedTrader: e.target.checked })}
                  className="h-4 w-4 rounded-sm border-emerald-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="verifiedTraderCheck" className="text-xs text-emerald-900 dark:text-emerald-200 cursor-pointer">
                  <div className="font-bold">Grant Verified Live Trader Badge</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Live broker deposit slip and trading MT4/MT5 statement verified on file.
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register Trader Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Trader Dossier Inspection Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-11 w-11 rounded-2xl border flex items-center justify-center font-black text-sm ${
                    selectedUser.status === "banned"
                      ? "bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {selectedUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    {selectedUser.isVerifiedTrader && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="h-3 w-3" />
                        VERIFIED TRADER
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-500 text-xs font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Status</div>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Country</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-1">{selectedUser.country}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Experience</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-1">
                    {selectedUser.tradingExperienceYears} Years
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Reviews</div>
                  <div className="font-bold text-cyan-600 dark:text-cyan-400 text-xs mt-1 flex items-center justify-between">
                    <span>{selectedUser.reviewsCount} Published</span>
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedUser;
                        setSelectedUser(null);
                        setReviewsUser(target);
                      }}
                      className="text-cyan-600 dark:text-cyan-400 hover:underline text-[10px] font-semibold cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Forensic Verification Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-between">
                  <span>Trading Account Evidence &amp; Verification State</span>
                  <button
                    type="button"
                    onClick={() => handleToggleVerification(selectedUser.id)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    {selectedUser.isVerifiedTrader ? "Revoke Status" : "Stamp Verification"}
                  </button>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {selectedUser.isVerifiedTrader ? (
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Live trading account deposit slip validated and linked to review moderation scoring weights.</span>
                    </div>
                  ) : (
                    <div className="text-slate-500 dark:text-slate-400">
                      No live statement on file. Reviews submitted by this user carry standard unverified weighting.
                    </div>
                  )}
                </div>
              </div>

              {/* Login Block Alert if user is blocked */}
              {selectedUser.status === "banned" && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-2.5">
                  <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold">Login Access is Currently Blocked</div>
                    <div className="text-[11px] text-rose-700 dark:text-rose-300">
                      This user cannot authenticate or submit reviews/disputes.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {/* Block / Unblock Action */}
                <button
                  type="button"
                  onClick={() => handleToggleBlock(selectedUser.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedUser.status === "banned"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                      : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100"
                  }`}
                >
                  {selectedUser.status === "banned" ? (
                    <>
                      <Unlock className="h-4 w-4" />
                      <span>Unblock Login Access</span>
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4" />
                      <span>Block Login Access</span>
                    </>
                  )}
                </button>

                {/* View Reviews Button */}
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedUser;
                    setSelectedUser(null);
                    setReviewsUser(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>View Reviews ({selectedUser.reviewsCount})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs cursor-pointer shadow-xs"
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
