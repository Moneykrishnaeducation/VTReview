import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/admin-context";
import { StatusBadge } from "../../components/status-badge";
import {
  Users,
  Calendar,
  Radio,
  Video,
  Mic,
  Vote,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Square,
  Plus,
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
  FileText,
  AlertTriangle,
  Sliders,
  Sparkles,
  Search,
  Eye,
  Filter,
  X,
  Share2,
  Check,
  Lock,
  Volume2,
  Tv,
  MessageSquare,
  UserCheck,
  ChevronDown,
  Layers,
  Activity,
  Send,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

interface AdminSession {
  id: string;
  title: string;
  track: string;
  stage: string;
  time: string;
  status: "live" | "upcoming" | "completed";
  speakers: string[];
  concurrentViewers: number;
  bitrate?: string;
  resolution?: string;
}

interface AdminQuestion {
  id: string;
  traderName: string;
  country: string;
  isVerified: boolean;
  question: string;
  targetPanel: string;
  upvotes: number;
  status: "pending_review" | "pushed_to_podium" | "answered" | "rejected";
  timestamp: string;
}

interface SpeakerProfile {
  id: string;
  name: string;
  role: string;
  organization: string;
  country: string;
  stage: string;
  status: "online" | "speaking" | "backstage";
  avatarText: string;
}

export default function ConvocationManagement() {
  const { activeRoleDef } = useAdmin();
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"questions" | "sessions" | "polls" | "speakers" | "charter">("questions");

  // Questions Filter & Search
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionStatusFilter, setQuestionStatusFilter] = useState<string>("all");
  const [questionPanelFilter, setQuestionPanelFilter] = useState<string>("all");

  // Schedule Session Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionTrack, setNewSessionTrack] = useState("Regulatory Policy");
  const [newSessionStage, setNewSessionStage] = useState("Plenary Hall A");
  const [newSessionTime, setNewSessionTime] = useState("16:00 - 17:30 UTC");
  const [newSessionSpeakers, setNewSessionSpeakers] = useState("");

  // Sessions state
  const [sessions, setSessions] = useState<AdminSession[]>([
    {
      id: "SES-01",
      title: "Global Keynote: The 2026 State of Retail Forex Regulation & Offshore Loopholes",
      track: "Regulatory Policy",
      stage: "Plenary Hall A",
      time: "09:00 - 10:30 UTC",
      status: "live",
      speakers: ["Sir Arthur Pendelton (FCA)", "Dr. Elena Rostova (WikiIFX)", "Julian Thorne (CySEC)"],
      concurrentViewers: 8420,
      bitrate: "14.2 Mbps",
      resolution: "4K UHD 60fps"
    },
    {
      id: "SES-02",
      title: "Forex Execution Telemetry: Auditing 10,000-Tick Slippage & Raw ECN Spreads",
      track: "Market Execution",
      stage: "Auditorium 2",
      time: "11:00 - 12:15 UTC",
      status: "upcoming",
      speakers: ["Marcus Vance (WikiIFX)", "Tariq Al-Mansoor (MENA Liquidity)"],
      concurrentViewers: 0,
      bitrate: "12.0 Mbps",
      resolution: "1080p 60fps"
    },
    {
      id: "SES-03",
      title: "Trader Townhall: Direct Cross-Examination of Broker Dispute Mediation Officers",
      track: "Dispute Arbitration",
      stage: "Community Main Floor",
      time: "13:30 - 15:00 UTC",
      status: "upcoming",
      speakers: ["Sarah Jenkins, Esq.", "Klaus Zimmerman (EBC)"],
      concurrentViewers: 0,
      bitrate: "14.2 Mbps",
      resolution: "4K UHD 60fps"
    }
  ]);

  // Floor questions moderation state
  const [floorQuestions, setFloorQuestions] = useState<AdminQuestion[]>([
    {
      id: "Q-101",
      traderName: "Alexander Hayes",
      country: "United Kingdom",
      isVerified: true,
      question: "Why are Tier-1 regulators still allowing brokers to route retail stop-loss orders to offshore B-Book sister companies during market news rollovers without instant execution logs?",
      targetPanel: "Regulatory Governance & License Enforcement",
      upvotes: 248,
      status: "pushed_to_podium",
      timestamp: "12 mins ago"
    },
    {
      id: "Q-102",
      traderName: "Mei-Ling Zhou",
      country: "Singapore",
      isVerified: true,
      question: "Can WikiIFX mandate that verified copy-trading lead accounts provide direct audited FIX API telemetry before they are listed on public broker leaderboards?",
      targetPanel: "Algorithmic & AI Alpha Track",
      upvotes: 189,
      status: "pending_review",
      timestamp: "24 mins ago"
    },
    {
      id: "Q-103",
      traderName: "Dmitri Volkov",
      country: "Cyprus",
      isVerified: true,
      question: "What is the standard turnaround time for the Trader Protection Fund when a broker is placed under temporary suspension by CySEC?",
      targetPanel: "Dispute Arbitration & Trader Rights",
      upvotes: 142,
      status: "pending_review",
      timestamp: "45 mins ago"
    },
    {
      id: "Q-104",
      traderName: "SpamBot_Alpha",
      country: "Unknown",
      isVerified: false,
      question: "Guaranteed 500% monthly returns EA available on Telegram click here bit.ly/spam",
      targetPanel: "Algorithmic & AI Alpha Track",
      upvotes: 0,
      status: "rejected",
      timestamp: "1 hour ago"
    }
  ]);

  // Speakers Directory
  const [speakers] = useState<SpeakerProfile[]>([
    {
      id: "SPK-01",
      name: "Sir Arthur Pendelton",
      role: "Senior Regulatory Counsel",
      organization: "Financial Conduct Authority (FCA)",
      country: "United Kingdom",
      stage: "Plenary Hall A",
      status: "speaking",
      avatarText: "AP"
    },
    {
      id: "SPK-02",
      name: "Dr. Elena Rostova",
      role: "Head of Forensic Analytics",
      organization: "WikiIFX Global Intelligence",
      country: "Switzerland",
      stage: "Plenary Hall A",
      status: "speaking",
      avatarText: "ER"
    },
    {
      id: "SPK-03",
      name: "Julian Thorne",
      role: "Director of Market Surveillance",
      organization: "CySEC Enforcement Desk",
      country: "Cyprus",
      stage: "Plenary Hall A",
      status: "backstage",
      avatarText: "JT"
    },
    {
      id: "SPK-04",
      name: "Marcus Vance",
      role: "Lead Execution Auditor",
      organization: "Institutional Market Review",
      country: "Australia",
      stage: "Auditorium 2",
      status: "online",
      avatarText: "MV"
    },
    {
      id: "SPK-05",
      name: "Sarah Jenkins, Esq.",
      role: "Chief Dispute Ombudsman",
      organization: "Trader Protection Council",
      country: "Ireland",
      stage: "Community Main Floor",
      status: "online",
      avatarText: "SJ"
    }
  ]);

  // Resolution Polling state
  const [pollActive, setPollActive] = useState(true);
  const [pollResults, setPollResults] = useState({
    totalVotes: 3410,
    opt1: 72,
    opt2: 21,
    opt3: 7
  });

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return floorQuestions.filter((q) => {
      if (questionStatusFilter !== "all" && q.status !== questionStatusFilter) return false;
      if (questionPanelFilter !== "all" && q.targetPanel !== questionPanelFilter) return false;
      if (questionSearch.trim()) {
        const query = questionSearch.toLowerCase();
        return (
          q.id.toLowerCase().includes(query) ||
          q.traderName.toLowerCase().includes(query) ||
          q.country.toLowerCase().includes(query) ||
          q.question.toLowerCase().includes(query) ||
          q.targetPanel.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [floorQuestions, questionStatusFilter, questionPanelFilter, questionSearch]);

  const handleModerateQuestion = (id: string, status: AdminQuestion["status"]) => {
    setFloorQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    setActionNotice(`Question #${id} status updated to: ${status.toUpperCase().replaceAll("_", " ")}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleToggleSessionStream = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === "live" ? "completed" : "live";
          return {
            ...s,
            status: newStatus,
            concurrentViewers: newStatus === "live" ? 5400 : 0
          };
        }
        return s;
      })
    );
    setActionNotice(`Stage broadcast state toggled for session #${id}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const newId = `SES-0${sessions.length + 1}`;
    const newSession: AdminSession = {
      id: newId,
      title: newSessionTitle.trim(),
      track: newSessionTrack,
      stage: newSessionStage,
      time: newSessionTime,
      status: "upcoming",
      speakers: newSessionSpeakers.split(",").map((s) => s.trim()).filter(Boolean),
      concurrentViewers: 0,
      bitrate: "12.0 Mbps",
      resolution: "1080p 60fps"
    };

    setSessions((prev) => [...prev, newSession]);
    setIsScheduleModalOpen(false);
    setNewSessionTitle("");
    setNewSessionSpeakers("");
    setActionNotice(`Session ${newId} scheduled successfully for ${newSessionStage}!`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const panelOptions = useMemo(() => {
    const set = new Set<string>();
    floorQuestions.forEach((q) => set.add(q.targetPanel));
    return Array.from(set);
  }, [floorQuestions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-xs mb-1.5 font-bold">
            <Radio className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>COMMUNITY SUMMIT & CONVOCATION OPERATIONS CONTROL</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Global Trader Convocation & Townhall Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time live RTMP stream broadcast management, delegate floor Q&A moderation, and resolution voting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>4K BROADCAST ACTIVE (8,420 VIEWERS)</span>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Convocation Telemetry Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Total Registered Delegates</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">48,520</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+1,420 registered today</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Floor Questions In Queue</span>
            <Mic className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">
            {floorQuestions.filter((q) => q.status === "pending_review").length} Pending
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>{floorQuestions.length} total questions logged</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Resolution Ballot Turnout</span>
            <Vote className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            {pollResults.totalVotes.toLocaleString()} Votes
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-3.5 w-3.5" />
            <span>78.4% Quorum reached</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Dispute Reserve Escrow</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">$500,000</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Guaranteed Trader Pool</span>
          </div>
        </div>
      </div>

      {/* Convocation Workspace Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "questions"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>Floor Q&A Moderation ({floorQuestions.filter((q) => q.status === "pending_review").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "sessions"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Video className="h-4 w-4" />
            <span>Stage Streams & Agenda ({sessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("polls")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "polls"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Vote className="h-4 w-4" />
            <span>Live Resolution Voting</span>
          </button>

          <button
            onClick={() => setActiveTab("speakers")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "speakers"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Keynote Speakers & VIPs ({speakers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("charter")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "charter"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>2026 Trader Charter</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FLOOR QUESTIONS MODERATION */}
      {activeTab === "questions" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-base">
                Delegate Floor Questions Moderation Queue
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Approve verified trader questions to be delivered to keynote speakers and regulatory ombudsmen on stage.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              Moderator: <strong className="text-slate-900 dark:text-slate-100">{activeRoleDef.name}</strong>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                placeholder="Search trader, country, or question text..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {questionSearch && (
                <button
                  onClick={() => setQuestionSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="lg:col-span-3">
              <select
                value={questionStatusFilter}
                onChange={(e) => setQuestionStatusFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">All Statuses ({floorQuestions.length})</option>
                <option value="pending_review">Pending Review ({floorQuestions.filter(q => q.status === "pending_review").length})</option>
                <option value="pushed_to_podium">Pushed to Podium ({floorQuestions.filter(q => q.status === "pushed_to_podium").length})</option>
                <option value="answered">Answered on Stage ({floorQuestions.filter(q => q.status === "answered").length})</option>
                <option value="rejected">Rejected ({floorQuestions.filter(q => q.status === "rejected").length})</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <select
                value={questionPanelFilter}
                onChange={(e) => setQuestionPanelFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">All Panels</option>
                {panelOptions.map((panel) => (
                  <option key={panel} value={panel}>
                    {panel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Mic className="h-8 w-8 text-slate-400 mx-auto" />
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">No questions match filter</div>
                <p className="text-xs text-slate-500">Try adjusting your search keywords or status filter.</p>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 shadow-xs ${
                    q.status === "pushed_to_podium"
                      ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/20"
                      : q.status === "rejected"
                      ? "bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 opacity-60"
                      : q.status === "answered"
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80"
                      : "bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-xs">
                        {q.id}
                      </span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">{q.traderName}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">({q.country})</span>
                      {q.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="h-3 w-3 text-emerald-500" />
                          <span>VERIFIED TRADER</span>
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          q.status === "pushed_to_podium"
                            ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                            : q.status === "answered"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : q.status === "rejected"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {q.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{q.upvotes} Delegate Upvotes</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{q.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-slate-800 dark:text-slate-100 text-xs leading-relaxed font-medium bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    "{q.question}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <span>Target Stage Panel:</span>
                      <strong className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {q.targetPanel}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {q.status !== "rejected" && (
                        <button
                          onClick={() => handleModerateQuestion(q.id, "rejected")}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 font-bold rounded-xl border border-rose-200 dark:border-rose-900 text-xs cursor-pointer transition-colors"
                        >
                          Reject
                        </button>
                      )}

                      {q.status !== "pushed_to_podium" && (
                        <button
                          onClick={() => handleModerateQuestion(q.id, "pushed_to_podium")}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <Radio className="h-3.5 w-3.5" />
                          <span>Push to Podium</span>
                        </button>
                      )}

                      {q.status === "pushed_to_podium" && (
                        <button
                          onClick={() => handleModerateQuestion(q.id, "answered")}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Mark Answered on Stage</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STAGE STREAMS & AGENDA */}
      {activeTab === "sessions" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-base">
                Stage Broadcast Controls & Session Agenda
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Control live RTMP broadcasts, stage assignment, and attendee stream allocations.
              </p>
            </div>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-xs">
                      {s.id}
                    </span>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm">{s.title}</h3>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        s.status === "live"
                          ? "bg-rose-500 text-white animate-pulse"
                          : s.status === "completed"
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSessionStream(s.id)}
                      className={`px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors ${
                        s.status === "live"
                          ? "bg-slate-800 text-slate-200 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                          : "bg-rose-600 text-white hover:bg-rose-500"
                      }`}
                    >
                      {s.status === "live" ? (
                        <>
                          <Square className="h-3.5 w-3.5 fill-current" />
                          <span>Stop Stream</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Go Live on Stage</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono">
                  <div className="text-slate-600 dark:text-slate-400">
                    Track: <strong className="text-slate-900 dark:text-slate-100 font-bold">{s.track}</strong>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Stage: <strong className="text-slate-900 dark:text-slate-100 font-bold">{s.stage}</strong> ({s.time})
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Live Viewers: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{s.concurrentViewers.toLocaleString()}</strong> ({s.resolution || "4K UHD"})
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>Panellists: <strong className="text-slate-800 dark:text-slate-200">{s.speakers.join(" • ")}</strong></span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">RTMP Bitrate: {s.bitrate || "14.2 Mbps"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESOLUTION VOTING */}
      {activeTab === "polls" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-base">
                Live Convocation Floor Resolution & Ballot Control
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Create and manage delegate voting resolutions incorporated into the official 2026 Declaration.
              </p>
            </div>

            <button
              onClick={() => {
                setPollActive(!pollActive);
                setActionNotice(`Ballot #04 voting status toggled to: ${!pollActive ? "ACTIVE" : "CLOSED"}`);
                setTimeout(() => setActionNotice(null), 3000);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs cursor-pointer shadow-xs transition-colors ${
                pollActive
                  ? "bg-rose-600 text-white hover:bg-rose-500"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {pollActive ? "Close Resolution Voting" : "Re-Open Resolution Voting"}
            </button>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg text-xs">
                RESOLUTION #04 (AUDITED PROOF-OF-RESERVES)
              </span>
              <span className="font-mono font-black text-slate-900 dark:text-white text-xs bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-lg">
                {pollResults.totalVotes.toLocaleString()} Verified Delegate Votes
              </span>
            </div>

            <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug">
              Should all brokers offering leverage &gt; 1:100 be required to publish third-party audited monthly Proof-of-Reserves?
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Option A: Yes, mandatory monthly audit</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{pollResults.opt1}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pollResults.opt1}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Option B: Quarterly only for Tier-1 brokers</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{pollResults.opt2}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pollResults.opt2}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Option C: No, current regulatory reporting suffices</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">{pollResults.opt3}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${pollResults.opt3}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KEYNOTE SPEAKERS & VIPS */}
      {activeTab === "speakers" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-base">
                Keynote Speakers & Regulatory Ombudsmen Registry
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Manage panelist roster, greenroom connection status, and speaker stage assignments.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {speakers.filter((s) => s.status === "speaking").length} Currently On Stage
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speakers.map((spk) => (
              <div
                key={spk.id}
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                      {spk.avatarText}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{spk.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{spk.organization}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                      spk.status === "speaking"
                        ? "bg-rose-500 text-white animate-pulse"
                        : spk.status === "backstage"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {spk.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-medium">{spk.role}</div>
                  <div className="text-slate-400 text-[11px] font-mono mt-0.5">Jurisdiction: {spk.country}</div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Assigned: {spk.stage}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Audio OK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CHARTER */}
      {activeTab === "charter" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-base">
                2026 Retail Trader Bill of Rights & Convocation Declaration
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Ratification status by participating regulatory authorities and independent research bodies.
              </p>
            </div>
            <button
              onClick={() => {
                setActionNotice("Official Convocation Charter certified & published to public web nodes!");
                setTimeout(() => setActionNotice(null), 3500);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Certify & Publish Declaration</span>
            </button>
          </div>

          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white text-sm">Article I: Right to Unmanipulated Execution Telemetry</strong>
              <p className="text-xs text-slate-600 dark:text-slate-400">Status: Passed by 98.2% delegate vote in session Plenary Hall A.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white text-sm">Article II: Right to Immediate Capital Segregation & Solvency Audits</strong>
              <p className="text-xs text-slate-600 dark:text-slate-400">Status: Certified by WikiIFX Regulatory Oversight Board.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white text-sm">Article III: Right to Binding Third-Party Dispute Arbitration</strong>
              <p className="text-xs text-slate-600 dark:text-slate-400">Status: Integrated into Complaints Management workflow engine.</p>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">Schedule Convocation Session</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Stage assignment & broadcast allocation</p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Session Keynote / Panel Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="e.g. Multi-Asset Liquidity & High-Frequency Latency Auditing"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Track Category</label>
                  <select
                    value={newSessionTrack}
                    onChange={(e) => setNewSessionTrack(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200"
                  >
                    <option value="Regulatory Policy">Regulatory Policy</option>
                    <option value="Market Execution">Market Execution</option>
                    <option value="Dispute Arbitration">Dispute Arbitration</option>
                    <option value="Algorithmic Alpha">Algorithmic Alpha</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Stage Location</label>
                  <select
                    value={newSessionStage}
                    onChange={(e) => setNewSessionStage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200"
                  >
                    <option value="Plenary Hall A">Plenary Hall A</option>
                    <option value="Auditorium 2">Auditorium 2</option>
                    <option value="Community Main Floor">Community Main Floor</option>
                    <option value="Executive Briefing Room">Executive Briefing Room</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Scheduled Time (UTC)</label>
                  <input
                    type="text"
                    value={newSessionTime}
                    onChange={(e) => setNewSessionTime(e.target.value)}
                    placeholder="16:00 - 17:30 UTC"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Speakers (Comma separated)</label>
                  <input
                    type="text"
                    value={newSessionSpeakers}
                    onChange={(e) => setNewSessionSpeakers(e.target.value)}
                    placeholder="e.g. Dr. Alex Thorne, Julian Thorne"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Confirm Session</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
