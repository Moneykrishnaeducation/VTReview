import React, { useState } from "react";
import { Link } from "react-router";
import {
  FileText,
  Ticket,
  Award,
  ShieldAlert,
  UserCheck,
  Users,
  ShoppingBag,
  Briefcase,
  Star,
  AlertOctagon,
  User,
  Settings,
  CreditCard,
  Edit,
  RefreshCw,
  Box,
  Handshake,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  Plus,
  Share2,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Lock,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ArrowUpRight,
  Check,
  Zap,
  Globe,
  Mail,
  Phone,
  Send,
  MessageCircle,
  Save,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

// Grouped Left Sidebar Menu items
const MENU_SECTIONS = [
  {
    title: "MAIN ACTIVITIES",
    items: [
      { id: "posts", label: "Posts", icon: FileText, badge: null },
      { id: "tickets", label: "My Tickets", icon: Ticket, badge: "2" },
      { id: "achievements", label: "My Achievements", icon: Award, badge: null },
      { id: "mediation", label: "Mediation", icon: ShieldAlert, badge: null },
    ],
  },
  {
    title: "SOCIAL & COMMUNITY",
    items: [
      { id: "following", label: "Following", icon: UserCheck, badge: null },
      { id: "followers", label: "My followers", icon: Users, badge: null },
      { id: "favorites", label: "Favorites", icon: Star, badge: null },
    ],
  },
  {
    title: "COMMERCIAL & ORDERS",
    items: [
      { id: "orders", label: "Orders", icon: ShoppingBag, badge: null },
      { id: "applications", label: "My Applications", icon: Briefcase, badge: "New" },
      { id: "ponzi", label: "Ponzi Scheme", icon: AlertOctagon, badge: null },
    ],
  },
  {
    title: "ACCOUNT & PREFERENCES",
    items: [
      { id: "profile", label: "Profile", icon: User, badge: null },
      { id: "settings", label: "Settings", icon: Settings, badge: null },
      { id: "account", label: "My Account", icon: CreditCard, badge: null },
    ],
  },
];

// Suggested Users list
const INITIAL_SUGGESTIONS = [
  {
    id: 1,
    name: "FX35698421",
    avatar: "R",
    avatarBg: "bg-purple-600",
    badge: "PI",
    role: "Forex Analyst",
    isFollowing: false,
  },
  {
    id: 2,
    name: "TraderAlpha_99",
    avatar: "A",
    avatarBg: "bg-blue-600",
    badge: "VIP",
    role: "Crypto Trader",
    isFollowing: false,
  },
  {
    id: 3,
    name: "GoldMarket_Guru",
    avatar: "G",
    avatarBg: "bg-[#D97706]",
    badge: "PI",
    role: "Commodities Pro",
    isFollowing: true,
  },
];

export default function UserProfile() {
  const [activeSidebarTab, setActiveSidebarTab] = useState("posts");
  const [activeBannerTab, setActiveBannerTab] = useState("business");
  const [activeFilterPill, setActiveFilterPill] = useState("posted");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState<"basic" | "contact" | "social">("basic");
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);

  // User Profile Data State (Fully Editable)
  const [username, setUsername] = useState("FX5108531922");
  const [accountBadge, setAccountBadge] = useState("PI");
  const [fullName, setFullName] = useState("Money Krishna");
  const [bio, setBio] = useState("Professional Forex Trader & Market Analyst");
  const [country, setCountry] = useState("India");
  const [email, setEmail] = useState("user@vt-review.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [telegram, setTelegram] = useState("@fx5108_trader");
  const [discord, setDiscord] = useState("fx_trader#1234");
  const [whatsApp, setWhatsApp] = useState("+91 9876543210");
  const [tradingStyle, setTradingStyle] = useState("Swing Trader");
  const [avatarTheme, setAvatarTheme] = useState<"amber" | "slate" | "blue" | "emerald">("amber");

  // Temporary Form States for Modal Editing
  const [tempUsername, setTempUsername] = useState(username);
  const [tempBadge, setTempBadge] = useState(accountBadge);
  const [tempFullName, setTempFullName] = useState(fullName);
  const [tempBio, setTempBio] = useState(bio);
  const [tempCountry, setTempCountry] = useState(country);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempTelegram, setTempTelegram] = useState(telegram);
  const [tempDiscord, setTempDiscord] = useState(discord);
  const [tempWhatsApp, setTempWhatsApp] = useState(whatsApp);

  // Stats Counters
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  // Business Modal Form state
  const [companyName, setCompanyName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmittingBiz, setIsSubmittingBiz] = useState(false);

  // Open Edit Modal with current data copied to temporary state
  const handleOpenEditModal = () => {
    setTempUsername(username);
    setTempBadge(accountBadge);
    setTempFullName(fullName);
    setTempBio(bio);
    setTempCountry(country);
    setTempEmail(email);
    setTempPhone(phone);
    setTempTelegram(telegram);
    setTempDiscord(discord);
    setTempWhatsApp(whatsApp);
    setIsEditModalOpen(true);
  };

  // Save Modal Profile Data Changes
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(tempUsername);
    setAccountBadge(tempBadge);
    setFullName(tempFullName);
    setBio(tempBio);
    setCountry(tempCountry);
    setEmail(tempEmail);
    setPhone(tempPhone);
    setTelegram(tempTelegram);
    setDiscord(tempDiscord);
    setWhatsApp(tempWhatsApp);
    setIsEditModalOpen(false);
    toast.success("Profile information updated successfully!");
  };

  // Save Inline Profile Data Changes (from Sidebar Profile Tab)
  const handleInlineSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile details saved successfully!");
  };

  // Toggle follow status for suggested user
  const toggleFollow = (id: number) => {
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.isFollowing;
          toast.success(
            nextState ? `You are now following ${s.name}` : `Unfollowed ${s.name}`
          );
          return { ...s, isFollowing: nextState };
        }
        return s;
      })
    );
  };

  const handleRefreshSuggestions = () => {
    setIsRefreshingSuggestions(true);
    setTimeout(() => {
      setIsRefreshingSuggestions(false);
      toast.info("Suggested list updated");
    }, 600);
  };

  const handleBusinessApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBiz(true);
    setTimeout(() => {
      setIsSubmittingBiz(false);
      setIsBusinessModalOpen(false);
      toast.success("Business Account application submitted successfully!");
    }, 1000);
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    } else {
      toast.success("Profile link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-6 px-3 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-[1280px] mx-auto space-y-5">
        {/* ================= BREADCRUMB & QUICK STATUS BAR ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
            <Link
              to="/"
              className="hover:text-amber-500 flex items-center gap-1 transition-colors"
            >
              <span>Home</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-200 font-bold">
              Personal Center
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Account Status: Active</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <span>Identity Verified</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN 2-COLUMN GRID LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT SIDEBAR (STICKY NAVIGATION) ================= */}
          <aside className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-xs sticky top-4">
            {/* User Quick Mini Summary in Sidebar */}
            <div className="flex items-center gap-3 p-2.5 mb-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                {username.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {username}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {country} • {accountBadge}
                </p>
              </div>
            </div>

            {/* Menu Grouped List */}
            <nav className="space-y-4">
              {MENU_SECTIONS.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-3 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const isActive = activeSidebarTab === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSidebarTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${
                          isActive
                            ? "bg-[#FFD000] text-slate-950 font-extrabold shadow-sm translate-x-0.5"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ItemIcon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive
                                ? "text-slate-950"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-amber-500"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              isActive
                                ? "bg-slate-950 text-white"
                                : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Account Completion Meter */}
            <div className="mt-5 p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-950 dark:to-slate-900 rounded-xl border border-amber-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Profile Strength</span>
                </span>
                <span className="text-amber-600 dark:text-amber-400">85%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[85%] rounded-full transition-all duration-500" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Add 2-Factor authentication to reach 100%.
              </p>
            </div>
          </aside>

          {/* ================= RIGHT MAIN AREA (BANNER + CONTENT + WIDGETS) ================= */}
          <main className="lg:col-span-9 space-y-6">
            {/* HERO PROFILE HEADER BANNER */}
            <div className="bg-gradient-to-r from-[#FBF3E4] via-[#FDF8EE] to-[#FFFBF3] dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 rounded-2xl border border-[#F3E5CD] dark:border-slate-800 pt-7 px-6 sm:px-8 pb-0 shadow-sm relative overflow-hidden">
              {/* Background Ambient Glow */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 relative z-10">
                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Avatar Container with Eagle Icon & Online Indicator */}
                  <div className="relative shrink-0 group">
                    <div className="h-18 w-18 sm:h-22 sm:w-22 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-md p-1 group-hover:scale-[1.02] transition-transform">
                      {/* Eagle Avatar Graphic */}
                      <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full rounded-xl object-cover"
                      >
                        <circle cx="50" cy="50" r="50" fill="#475569" />
                        <path
                          d="M20,65 C35,40 65,40 80,65 C70,55 60,50 50,50 C40,50 30,55 20,65 Z"
                          fill="#FFFFFF"
                        />
                        <path
                          d="M40,30 Q55,20 75,35 Q60,40 50,55 Q45,40 40,30 Z"
                          fill="#F59E0B"
                        />
                        <circle cx="58" cy="35" r="4" fill="#0F172A" />
                        <path
                          d="M15,50 C30,25 70,25 85,50 C65,45 35,45 15,50 Z"
                          fill="#E2E8F0"
                        />
                      </svg>
                    </div>
                    {/* Status Dot */}
                    <span
                      className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-xs"
                      title="Online Now"
                    />
                  </div>

                  {/* User Details Block */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>{username}</span>
                        <CheckCircle2 className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                      </h1>
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold italic font-mono text-[11px] px-3 py-0.5 rounded-full border border-slate-300/80 dark:border-slate-700 shadow-2xs">
                        {accountBadge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-md">
                      {bio}
                    </p>

                    {/* Stats Inline Pills */}
                    <div className="flex items-center gap-5 pt-1 text-xs font-semibold">
                      <div className="flex items-baseline gap-1">
                        <strong className="font-extrabold text-slate-900 dark:text-white text-base">
                          {followingCount}
                        </strong>
                        <span className="text-slate-500 text-xs">Follow</span>
                      </div>
                      <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
                      <div className="flex items-baseline gap-1">
                        <strong className="font-extrabold text-slate-900 dark:text-white text-base">
                          {followersCount}
                        </strong>
                        <span className="text-slate-500 text-xs">Followers</span>
                      </div>
                      <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
                      <div className="flex items-baseline gap-1">
                        <strong className="font-extrabold text-slate-900 dark:text-white text-base">
                          {likesCount}
                        </strong>
                        <span className="text-slate-500 text-xs">Likes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Action Buttons (Edit Information link trigger) */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                 
                  <button
                    onClick={handleOpenEditModal}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:border-amber-500 hover:text-amber-600 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-all cursor-pointer shadow-2xs"
                    title="Share Profile"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* BANNER SUB-TABS (Business / Posts / Feedback) */}
              <div className="flex items-center gap-8 border-t border-[#F0E2CA]/80 dark:border-slate-800 pt-3 relative z-10">
                <button
                  onClick={() => setActiveBannerTab("business")}
                  className={`pb-3 text-xs sm:text-sm font-extrabold transition-all relative cursor-pointer flex items-center gap-2 ${
                    activeBannerTab === "business"
                      ? "text-slate-950 dark:text-white border-b-2 border-slate-950 dark:border-amber-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="h-4 w-4 text-amber-500" />
                  <span>Business</span>
                </button>
                <button
                  onClick={() => setActiveBannerTab("posts")}
                  className={`pb-3 text-xs sm:text-sm font-extrabold transition-all relative cursor-pointer flex items-center gap-2 ${
                    activeBannerTab === "posts"
                      ? "text-slate-950 dark:text-white border-b-2 border-slate-950 dark:border-amber-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span>Posts</span>
                </button>
                <button
                  onClick={() => setActiveBannerTab("feedback")}
                  className={`pb-3 text-xs sm:text-sm font-extrabold transition-all relative cursor-pointer flex items-center gap-2 ${
                    activeBannerTab === "feedback"
                      ? "text-slate-950 dark:text-white border-b-2 border-slate-950 dark:border-amber-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <span>Feedback</span>
                </button>
              </div>
            </div>

            {/* LOWER WORKSPACE AREA: 2-COLUMN DISPLAY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT WORKSPACE PANEL */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 min-h-[420px] shadow-xs flex flex-col justify-between">
                {activeSidebarTab === "profile" || activeSidebarTab === "settings" ? (
                  /* INLINE EDIT PROFILE FORM WHEN SIDEBAR PROFILE/SETTINGS TAB IS ACTIVE */
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <User className="h-5 w-5 text-amber-500" />
                          <span>Edit Profile & Account Details</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Update your personal information, contact methods, and trading background.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenEditModal}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-400 text-xs font-bold hover:bg-amber-200 transition-colors"
                      >
                        Open Modal Editor
                      </button>
                    </div>

                    <form onSubmit={handleInlineSave} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Account Badge Tag
                          </label>
                          <input
                            type="text"
                            value={accountBadge}
                            onChange={(e) => setAccountBadge(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Nationality / Country
                          </label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Singapore">Singapore</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Telegram ID
                          </label>
                          <input
                            type="text"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Discord Username
                          </label>
                          <input
                            type="text"
                            value={discord}
                            onChange={(e) => setDiscord(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Self Introduction / Bio
                        </label>
                        <textarea
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-[#FFD000] hover:bg-[#E6B800] text-slate-950 text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* STANDARD POSTS/SUBMISSIONS FILTER & CONTENT AREA */
                  <>
                    {/* TOOLBAR: SUB-FILTERS & SEARCH */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                      {/* SUB-FILTER PILLS */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveFilterPill("posted")}
                          className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            activeFilterPill === "posted"
                              ? "bg-[#FFD000] text-slate-950 shadow-2xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          Posted
                        </button>
                        <button
                          onClick={() => setActiveFilterPill("pending")}
                          className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            activeFilterPill === "pending"
                              ? "bg-[#FFD000] text-slate-950 shadow-2xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => setActiveFilterPill("not_approved")}
                          className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            activeFilterPill === "not_approved"
                              ? "bg-[#FFD000] text-slate-950 shadow-2xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          Not Approved
                        </button>
                      </div>

                      {/* SEARCH FIELD */}
                      <div className="relative w-full sm:w-48">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search records..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* DYNAMIC CONTENT / EMPTY STATE */}
                    <div className="my-auto py-12 flex flex-col items-center justify-center text-center">
                      {/* Clean Minimalist 3D Box Illustration */}
                      <div className="relative mb-4 group">
                        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl group-hover:blur-2xl transition-all" />
                        <svg
                          className="w-28 h-28 text-slate-300 dark:text-slate-700 drop-shadow-sm relative z-10"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M50 15 L85 30 L50 45 L15 30 Z"
                            fill="#E2E8F0"
                            className="dark:fill-slate-800"
                          />
                          <path
                            d="M15 30 L50 45 L50 80 L15 65 Z"
                            fill="#CBD5E1"
                            className="dark:fill-slate-700"
                          />
                          <path
                            d="M85 30 L50 45 L50 80 L85 65 Z"
                            fill="#94A3B8"
                            className="dark:fill-slate-600"
                          />
                          <path
                            d="M50 15 L25 5 L15 30 L50 45 Z"
                            fill="#F1F5F9"
                            className="dark:fill-slate-800"
                            opacity="0.8"
                          />
                          <path
                            d="M50 15 L75 5 L85 30 L50 45 Z"
                            fill="#E2E8F0"
                            className="dark:fill-slate-700"
                            opacity="0.8"
                          />
                        </svg>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                        No Content
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                        There are currently no items under the{" "}
                        <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                          {activeFilterPill.replace("_", " ")}
                        </span>{" "}
                        tab.
                      </p>

                      <div className="flex items-center gap-3">
                        <Link
                          to="/contact"
                          className="px-5 py-2.5 rounded-xl bg-[#FFD000] hover:bg-[#E6B800] text-slate-950 font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02]"
                        >
                          <Plus className="h-4 w-4 stroke-[3]" />
                          <span>Create New Submission</span>
                        </Link>
                      </div>
                    </div>

                    {/* Footer Info Notice */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Showing 0 records</span>
                      <span>Updated in real-time</span>
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT SIDEBAR COLUMN (WIDGETS) */}
              <div className="lg:col-span-4 space-y-6">
                {/* PROMO CARD 1: BUSINESS ACCOUNT CONVERSION WIDGET */}
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-white dark:to-slate-900 rounded-2xl border border-amber-300/70 dark:border-amber-500/30 p-6 text-center shadow-xs flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 tracking-wider">
                    PRO
                  </span>

                  {/* Handshake Graphic with Floating Currency Symbols */}
                  <div className="relative mb-3 flex items-center justify-center">
                    <div className="h-16 w-28 relative flex items-center justify-center">
                      <svg viewBox="0 0 100 80" className="w-full h-full">
                        <circle cx="20" cy="20" r="6" fill="#F59E0B" />
                        <text
                          x="20"
                          y="23"
                          fontSize="7"
                          fontWeight="bold"
                          fill="#FFF"
                          textAnchor="middle"
                        >
                          $
                        </text>

                        <circle cx="80" cy="25" r="7" fill="#F59E0B" />
                        <text
                          x="80"
                          y="28"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#FFF"
                          textAnchor="middle"
                        >
                          £
                        </text>

                        <circle cx="50" cy="12" r="6" fill="#F59E0B" />
                        <text
                          x="50"
                          y="15"
                          fontSize="7"
                          fontWeight="bold"
                          fill="#FFF"
                          textAnchor="middle"
                        >
                          €
                        </text>

                        <path
                          d="M10 50 Q30 40 45 48 L35 60 L10 55 Z"
                          fill="#FDBA74"
                        />
                        <path
                          d="M90 50 Q70 40 55 48 L65 60 L90 55 Z"
                          fill="#FED7AA"
                        />
                        <path
                          d="M45 48 L55 48 L60 58 L40 58 Z"
                          fill="#FB923C"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base max-w-[220px] leading-tight mb-2">
                    Unlock more opportunities with a Business Account
                  </h3>

                  <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 text-left w-full mb-5 px-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[3]" />
                      <span>Verified Business Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[3]" />
                      <span>Priority Support & Review Audit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[3]" />
                      <span>Exclusive Community Visibility</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => setIsBusinessModalOpen(true)}
                    className="w-full bg-[#FFD000] hover:bg-[#E6B800] text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-xs cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

                {/* PROMO CARD 2: SUGGESTED TRADERS WIDGET */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Suggested for You
                    </h4>
                    <button
                      onClick={handleRefreshSuggestions}
                      className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Refresh</span>
                      <RefreshCw
                        className={`h-3 w-3 ${
                          isRefreshingSuggestions ? "animate-spin text-amber-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div
                            className={`h-9 w-9 rounded-full ${item.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {item.avatar}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[100px]">
                                {item.name}
                              </span>
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[9px] px-1.5 py-0.2 rounded font-extrabold italic">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {item.role}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFollow(item.id)}
                          className={`text-xs font-extrabold px-3.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs ${
                            item.isFollowing
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              : "bg-[#FFD000] hover:bg-[#E6B800] text-slate-950"
                          }`}
                        >
                          {item.isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ================= RICH EDIT INFORMATION MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit className="h-5 w-5 text-amber-500" />
                  <span>Edit Profile Information</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your display credentials, contact methods, and bio.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Live Profile Header Preview */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                {tempUsername.slice(0, 2).toUpperCase() || "FX"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {tempUsername || "Username"}
                  </h4>
                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded font-bold italic">
                    {tempBadge || "PI"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {tempFullName} • {tempCountry}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-md">
                Live Preview
              </span>
            </div>

            {/* Modal Internal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setEditModalTab("basic")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  editModalTab === "basic"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Basic Information
              </button>
              <button
                type="button"
                onClick={() => setEditModalTab("contact")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  editModalTab === "contact"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Contact Details
              </button>
              <button
                type="button"
                onClick={() => setEditModalTab("social")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  editModalTab === "social"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Social Handles
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSave} className="space-y-4">
              {editModalTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Username <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Account Tag Badge
                      </label>
                      <select
                        value={tempBadge}
                        onChange={(e) => setTempBadge(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
                      >
                        <option value="PI">PI (Professional Investor)</option>
                        <option value="VIP">VIP Trader</option>
                        <option value="KOL">KOL Affiliate</option>
                        <option value="Analyst">Market Analyst</option>
                        <option value="User">Standard User</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={tempFullName}
                        onChange={(e) => setTempFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nationality / Country
                      </label>
                      <select
                        value={tempCountry}
                        onChange={(e) => setTempCountry(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Bio / Self-Introduction
                    </label>
                    <textarea
                      rows={3}
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                      placeholder="Share your trading background or bio..."
                    />
                  </div>
                </div>
              )}

              {editModalTab === "contact" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span>WhatsApp Number</span>
                    </label>
                    <input
                      type="tel"
                      value={tempWhatsApp}
                      onChange={(e) => setTempWhatsApp(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {editModalTab === "social" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5 text-sky-500" />
                      <span>Telegram ID</span>
                    </label>
                    <input
                      type="text"
                      value={tempTelegram}
                      onChange={(e) => setTempTelegram(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Discord Username</span>
                    </label>
                    <input
                      type="text"
                      value={tempDiscord}
                      onChange={(e) => setTempDiscord(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFD000] hover:bg-[#E6B800] text-slate-950 text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BUSINESS ACCOUNT APPLICATION MODAL ================= */}
      {isBusinessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Handshake className="h-5 w-5 text-amber-500" />
                <span>Apply for Business Account</span>
              </h3>
              <button
                onClick={() => setIsBusinessModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBusinessApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter registered company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Business Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBusinessModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBiz}
                  className="px-5 py-2 rounded-xl bg-[#FFD000] hover:bg-[#E6B800] text-slate-950 text-xs font-extrabold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingBiz ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
