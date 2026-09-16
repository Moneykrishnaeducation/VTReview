import React, { useState } from "react";
import { Link } from "react-router";
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Video,
  Award,
  Vote,
  MessageSquare,
  ThumbsUp,
  Share2,
  CheckCircle2,
  AlertCircle,
  Mic,
  FileText,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  Flame,
  Globe,
  Radio,
  BookOpen,
  Send,
  X,
  Plus
} from "lucide-react";

interface Session {
  id: string;
  time: string;
  duration: string;
  title: string;
  track: "regulation" | "execution" | "algo" | "disputes";
  trackLabel: string;
  stage: string;
  speakers: { name: string; title: string; avatar: string; org: string }[];
  isLive?: boolean;
  isUpcoming?: boolean;
  streamUrl?: string;
  description: string;
  attendeesCount: number;
}

interface Speaker {
  id: string;
  name: string;
  role: string;
  org: string;
  avatar: string;
  jurisdiction: string;
  bio: string;
  topic: string;
}

interface FloorQuestion {
  id: string;
  traderName: string;
  traderAvatar: string;
  country: string;
  isVerified: boolean;
  question: string;
  targetPanel: string;
  upvotes: number;
  hasUpvoted?: boolean;
  timestamp: string;
  status: "live_podium" | "queued" | "answered";
}

export default function CommunityConvocation() {
  const [activeTab, setActiveTab] = useState<"agenda" | "townhall" | "speakers" | "working_groups" | "charter">("agenda");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [delegateType, setDelegateType] = useState<"virtual" | "vip" | "press">("virtual");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Floor Question State
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newTargetPanel, setNewTargetPanel] = useState("Regulatory Governance & License Enforcement");
  const [questions, setQuestions] = useState<FloorQuestion[]>([
    {
      id: "q-1",
      traderName: "Alexander Hayes",
      traderAvatar: "AH",
      country: "United Kingdom",
      isVerified: true,
      question: "Why are Tier-1 regulators still allowing brokers to route retail stop-loss orders to offshore B-Book sister companies during market news rollovers without instant execution logs?",
      targetPanel: "Regulatory Governance & License Enforcement",
      upvotes: 248,
      timestamp: "12 mins ago",
      status: "live_podium"
    },
    {
      id: "q-2",
      traderName: "Mei-Ling Zhou",
      traderAvatar: "MZ",
      country: "Singapore",
      isVerified: true,
      question: "Can WikiIFX mandate that verified copy-trading lead accounts provide direct audited FIX API telemetry before they are listed on public broker leaderboards?",
      targetPanel: "Algorithmic & AI Alpha Track",
      upvotes: 189,
      timestamp: "24 mins ago",
      status: "queued"
    },
    {
      id: "q-3",
      traderName: "Dmitri Volkov",
      traderAvatar: "DV",
      country: "Cyprus",
      isVerified: true,
      question: "What is the standard turnaround time for the Trader Protection Fund when a broker is placed under temporary suspension by CySEC?",
      targetPanel: "Dispute Arbitration & Trader Rights",
      upvotes: 142,
      timestamp: "45 mins ago",
      status: "queued"
    },
    {
      id: "q-4",
      traderName: "Carlos Mendez",
      traderAvatar: "CM",
      country: "Australia",
      isVerified: false,
      question: "How do we identify cloned offshore websites mimicking ASIC-licensed entities before depositing wire transfers?",
      targetPanel: "Regulatory Governance & License Enforcement",
      upvotes: 95,
      timestamp: "1 hour ago",
      status: "answered"
    }
  ]);

  // Poll state
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState({
    opt1: 72,
    opt2: 21,
    opt3: 7
  });

  const handleUpvote = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const hasUpvoted = q.hasUpvoted;
          return {
            ...q,
            upvotes: hasUpvoted ? q.upvotes - 1 : q.upvotes + 1,
            hasUpvoted: !hasUpvoted
          };
        }
        return q;
      })
    );
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: FloorQuestion = {
      id: `q-${Date.now()}`,
      traderName: "You (Verified Delegate)",
      traderAvatar: "VD",
      country: "Global Trader",
      isVerified: true,
      question: newQuestionText.trim(),
      targetPanel: newTargetPanel,
      upvotes: 1,
      hasUpvoted: true,
      timestamp: "Just now",
      status: "queued"
    };

    setQuestions([newQ, ...questions]);
    setNewQuestionText("");
  };

  const handleVotePoll = (opt: "opt1" | "opt2" | "opt3") => {
    if (pollVoted) return;
    setPollVoted(opt);
    setPollVotes((prev) => ({
      ...prev,
      [opt]: prev[opt] + 1
    }));
  };

  const sessions: Session[] = [
    {
      id: "s-1",
      time: "09:00 - 10:30 UTC",
      duration: "90 min",
      title: "Global Keynote: The 2026 State of Retail Forex Regulation & Offshore Loopholes",
      track: "regulation",
      trackLabel: "Regulatory Policy",
      stage: "Plenary Hall A (Live Broadcast)",
      isLive: true,
      speakers: [
        { name: "Sir Arthur Pendelton", title: "Former Senior Policy Director", org: "UK Financial Conduct Authority (FCA)", avatar: "AP" },
        { name: "Dr. Elena Rostova", title: "Chief Regulatory Auditor", org: "WikiIFX Research Institute", avatar: "ER" },
        { name: "Julian Thorne", title: "Head of Derivatives Compliance", org: "CySEC Advisory Board", avatar: "JT" }
      ],
      description: "A comprehensive forensic breakdown of cross-border retail regulatory arbitrage, mandatory €100k client compensation schemes, and real-time supervisory API verification.",
      attendeesCount: 4210
    },
    {
      id: "s-2",
      time: "11:00 - 12:15 UTC",
      duration: "75 min",
      title: "Forex Execution Telemetry: Auditing 10,000-Tick Slippage & Raw ECN Spreads",
      track: "execution",
      trackLabel: "Market Execution",
      stage: "Auditorium 2",
      isUpcoming: true,
      speakers: [
        { name: "Marcus Vance", title: "Chief Telemetry Engineer", org: "WikiIFX Benchmark Lab", avatar: "MV" },
        { name: "Tariq Al-Mansoor", title: "Managing Director of Institutional Flow", org: "MENA Liquidity Hub", avatar: "TM" }
      ],
      description: "Empirical analysis comparing declared vs real tick execution speeds across LD4 and NY4 data centers, revealing how asymmetric price slippage eats trader edge.",
      attendeesCount: 3150
    },
    {
      id: "s-3",
      time: "13:30 - 15:00 UTC",
      duration: "90 min",
      title: "Trader Townhall: Direct Cross-Examination of Broker Dispute Mediation Officers",
      track: "disputes",
      trackLabel: "Dispute Arbitration",
      stage: "Community Main Floor",
      isUpcoming: true,
      speakers: [
        { name: "Sarah Jenkins, Esq.", title: "Lead Financial Ombudsman", org: "International Dispute Chamber", avatar: "SJ" },
        { name: "Klaus Zimmerman", title: "Head of Compliance", org: "European Brokerage Council", avatar: "KZ" }
      ],
      description: "Live open-mic town hall where verified traders question broker representatives on withdrawal delays, leverage adjustments during flash crashes, and dispute arbitration verdicts.",
      attendeesCount: 5820
    },
    {
      id: "s-4",
      time: "15:30 - 17:00 UTC",
      duration: "90 min",
      title: "The AI Edge: Machine Learning for Real-Time Broker Solvency & Clone Detection",
      track: "algo",
      trackLabel: "AI & Algorithmic",
      stage: "Tech Stage Alpha",
      isUpcoming: true,
      speakers: [
        { name: "Dr. Chen Wei", title: "Head of Machine Learning", org: "FinTech Solvency Systems", avatar: "CW" },
        { name: "Liam O'Connor", title: "Automated Trading Architect", org: "Global Quant Network", avatar: "LO" }
      ],
      description: "How automated web crawlers and neural network models identify rogue copycat domains within 120 seconds of DNS registration before retail traders deposit capital.",
      attendeesCount: 2940
    }
  ];

  const speakers: Speaker[] = [
    {
      id: "sp-1",
      name: "Sir Arthur Pendelton",
      role: "Former Senior Policy Director",
      org: "UK Financial Conduct Authority (FCA)",
      avatar: "AP",
      jurisdiction: "United Kingdom (FCA)",
      bio: "Over 22 years spearheading retail investor protection directives, segregated client capital mandates, and statutory compensation rules.",
      topic: "Cross-Border Regulatory Harmonization & Offshore Shadow Operations"
    },
    {
      id: "sp-2",
      name: "Dr. Elena Rostova",
      role: "Chief Regulatory Auditor",
      org: "WikiIFX Research Institute",
      avatar: "ER",
      jurisdiction: "Global Research",
      bio: "Creator of the 120-Point Quantitative Broker Rating Matrix and author of 40+ investigative whitepapers on broker insolvency.",
      topic: "The 120-Point Solvency Standard: Eliminating Rating Bias"
    },
    {
      id: "sp-3",
      name: "Sarah Jenkins, Esq.",
      role: "Lead Financial Ombudsman",
      org: "International Dispute Chamber",
      avatar: "SJ",
      jurisdiction: "International Arbitration",
      bio: "Arbitrated over $42,000,000 in disputed retail trader balances, enforcing swift recovery protocols against non-compliant brokers.",
      topic: "Enforcing Recovery: How to Freeze Disputed Assets in 48 Hours"
    },
    {
      id: "sp-4",
      name: "Marcus Vance",
      role: "Chief Telemetry Engineer",
      org: "WikiIFX Benchmark Lab",
      avatar: "MV",
      jurisdiction: "LD4 / NY4 Colocation",
      bio: "Pioneered independent hardware telemetry taps recording millisecond execution speeds directly from Equinix data center cross-connects.",
      topic: "Tick-by-Tick Slippage Anatomy: Why Zero-Commission Isn't Free"
    }
  ];

  const workingGroups = [
    {
      id: "wg-1",
      name: "Retail Trader Rights & Compensation Taskforce",
      members: 1420,
      lead: "Sarah Jenkins, Esq.",
      objective: "Drafting the 2026 Global Trader Treaty demanding €100k mandatory segregated compensation funds across all tier-1 and tier-2 regulated brokerages.",
      status: "Active Drafting",
      deliverable: "Global Trader Bill of Rights (Q4 2026)"
    },
    {
      id: "wg-2",
      name: "Real-Time Execution & Latency Telemetry Consortium",
      members: 890,
      lead: "Marcus Vance",
      objective: "Establishing standard open-source telemetry protocols for traders to cryptographically verify server fill latency and detect B-Book delay timers.",
      status: "Specification Review",
      deliverable: "OpenFill Standard v1.2"
    },
    {
      id: "wg-3",
      name: "Prop Trading Governance & Payout Standards Committee",
      members: 2150,
      lead: "Dr. Chen Wei",
      objective: "Creating independent audit standards for simulated evaluation prop firms, ensuring transparent liquidity provider backing and guaranteed payout reserves.",
      status: "Public Consultation",
      deliverable: "Prop Firm Transparency Certification"
    },
    {
      id: "wg-4",
      name: "Anti-Cloning & Fraud Intelligence Network",
      members: 1100,
      lead: "Dr. Elena Rostova",
      objective: "Coordinating rapid response alerts between retail traders and government agencies to dismantle scam domains within 4 hours of detection.",
      status: "Live Ops",
      deliverable: "Global Blacklist Real-Time API"
    }
  ];

  const filteredSessions = sessions.filter((s) => {
    if (selectedTrack === "all") return true;
    return s.track === selectedTrack;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl text-white">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold tracking-wide">
            <Radio className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>GLOBAL TRADER CONVOCATION & COMMUNITY ASSEMBLY 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            The Global Assembly of Retail Traders, Regulators & Research Analysts
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            Where 48,000+ independent traders converge with top financial regulators, quantitative researchers, and liquidity engineers to demand total execution transparency, dispute justice, and rigorous broker solvency standards.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Registered Delegates</div>
              <div className="text-lg font-black text-amber-400">48,520+</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Globe className="h-3 w-3" /> 114 Countries
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Keynote Speakers</div>
              <div className="text-lg font-black text-cyan-400">84 Experts</div>
              <div className="text-[10px] text-slate-400">Regulators & Quants</div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Live Keynote Stage</div>
              <div className="text-lg font-black text-rose-400 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                BROADCASTING
              </div>
              <div className="text-[10px] text-slate-400">4K Ultra-Low Latency</div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Trader Fund Pledged</div>
              <div className="text-lg font-black text-emerald-400">$500,000 USD</div>
              <div className="text-[10px] text-slate-400">Dispute Defense Reserve</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Claim Virtual Delegate Pass (Free)</span>
            </button>

            <button
              onClick={() => setActiveTab("townhall")}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Mic className="h-4 w-4 text-cyan-400" />
              <span>Submit Question to Floor</span>
            </button>

            <a
              href="#live-stage"
              onClick={() => setActiveTab("agenda")}
              className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-800 transition-all"
            >
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>Session Agenda</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "agenda"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Mainstage Agenda & Live Tracks</span>
          </button>

          <button
            onClick={() => setActiveTab("townhall")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "townhall"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Community Floor & Townhall ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("speakers")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "speakers"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Keynote Speakers ({speakers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("working_groups")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "working_groups"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Vote className="h-4 w-4" />
            <span>Working Groups & Standards</span>
          </button>

          <button
            onClick={() => setActiveTab("charter")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "charter"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Trader Convocation Charter</span>
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: MAINSTAGE AGENDA */}
      {activeTab === "agenda" && (
        <div className="space-y-6">
          {/* Track Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-amber-500" />
              <span className="font-bold text-slate-900 dark:text-white">Filter by Convocation Track:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Sessions" },
                { id: "regulation", label: "🛡️ Regulatory Policy" },
                { id: "execution", label: "⚡ Execution & Slippage" },
                { id: "disputes", label: "⚖️ Dispute Arbitration" },
                { id: "algo", label: "🤖 AI & Algo Safety" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    selectedTrack === t.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.map((s) => (
              <div
                key={s.id}
                id="live-stage"
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 md:p-6 space-y-4 shadow-xs transition-all ${
                  s.isLive
                    ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      {s.isLive && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold flex items-center gap-1.5 animate-pulse">
                          <Radio className="h-3 w-3" />
                          LIVE BROADCAST NOW
                        </span>
                      )}
                      <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {s.trackLabel}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {s.time} ({s.duration})
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {s.stage}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                      {s.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right font-mono text-xs hidden sm:block">
                      <div className="font-bold text-slate-900 dark:text-white">{s.attendeesCount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Live Delegates</div>
                    </div>
                    {s.isLive ? (
                      <button
                        onClick={() => setShowRegisterModal(true)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
                      >
                        <Video className="h-4 w-4" />
                        <span>Enter Live Stream</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Session "${s.title}" added to your convocation calendar!`)}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 text-amber-500" />
                        <span>Add to Schedule</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {s.description}
                </p>

                {/* Speakers Pill Grid */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Featured Stage Panellists:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {s.speakers.map((spk, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2.5"
                      >
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs shrink-0">
                          {spk.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white text-xs truncate">{spk.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{spk.org}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY FLOOR & TOWNHALL */}
      {activeTab === "townhall" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Left Col (7 cols): Live Floor Questions & Upvoting */}
          <div className="lg:col-span-7 space-y-6">
            {/* Submit Question Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Mic className="h-4 w-4 text-amber-500" />
                <span>Submit Question to the General Convocation Floor</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Top-voted questions are read live by the floor moderator directly to regulatory keynote speakers and broker ombudsmen during the plenary session.
              </p>

              <form onSubmit={handlePostQuestion} className="space-y-3">
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Type your direct question for the regulatory panel or broker execution committee..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <select
                    value={newTargetPanel}
                    onChange={(e) => setNewTargetPanel(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="Regulatory Governance & License Enforcement">Target: Regulatory Governance</option>
                    <option value="Algorithmic & AI Alpha Track">Target: Execution & Latency Telemetry</option>
                    <option value="Dispute Arbitration & Trader Rights">Target: Dispute Arbitration</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Post to Floor</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Questions Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Active Delegate Questions ({questions.length})
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">RANKED BY TRADER UPVOTES</span>
              </div>

              {questions.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 shadow-xs ${
                    q.status === "live_podium"
                      ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/40"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                        {q.traderAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <span>{q.traderName}</span>
                          {q.isVerified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                              <ShieldCheck className="h-3 w-3" /> VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {q.country} • {q.timestamp}
                        </div>
                      </div>
                    </div>

                    {q.status === "live_podium" ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] font-mono flex items-center gap-1">
                        <Radio className="h-3 w-3 animate-ping" /> AT PODIUM
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {q.status}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{q.question}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      Target: <strong className="text-slate-700 dark:text-slate-300">{q.targetPanel}</strong>
                    </span>

                    <button
                      onClick={() => handleUpvote(q.id)}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        q.hasUpvoted
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{q.upvotes} Upvotes</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col (5 cols): Live Convocation Poll & Floor Rules */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Interactive Floor Poll */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Vote className="h-4 w-4 text-purple-500" />
                  <span>Live Floor Resolution Vote #04</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  ACTIVE VOTE
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  Should all brokers offering leverage &gt; 1:100 be required to publish third-party audited monthly Proof-of-Reserves?
                </h4>
                <p className="text-[11px] text-slate-500">
                  Votes from verified delegates will be incorporated into the official 2026 Trader Charter.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleVotePoll("opt1")}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    pollVoted === "opt1"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>Yes, mandatory monthly audit</span>
                  <span className="font-mono font-bold">{pollVotes.opt1}%</span>
                </button>

                <button
                  onClick={() => handleVotePoll("opt2")}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    pollVoted === "opt2"
                      ? "bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 font-bold"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>Quarterly only for Tier-1 brokers</span>
                  <span className="font-mono font-bold">{pollVotes.opt2}%</span>
                </button>

                <button
                  onClick={() => handleVotePoll("opt3")}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    pollVoted === "opt3"
                      ? "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300 font-bold"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>No, current regulatory reporting suffices</span>
                  <span className="font-mono font-bold">{pollVotes.opt3}%</span>
                </button>
              </div>

              {pollVoted && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Your delegate vote was sealed to the immutable convocation record.</span>
                </div>
              )}
            </div>

            {/* Convocation Floor Rules Card */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                <span>Floor Debate Etiquette & Transparency Rules</span>
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px] list-disc list-inside">
                <li>All questions are publicly logged and immutable on the research audit trail.</li>
                <li>Questions with verified trade statement attachments receive 2x voting weight.</li>
                <li>Brokers mentioned on stage must provide an official compliance reply within 48h.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KEYNOTE SPEAKERS */}
      {activeTab === "speakers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {speakers.map((spk) => (
              <div
                key={spk.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-sm shrink-0">
                    {spk.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{spk.name}</h3>
                    <div className="text-amber-700 dark:text-amber-400 font-semibold text-xs">{spk.role}</div>
                    <div className="text-slate-500 text-[11px]">{spk.org} • {spk.jurisdiction}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {spk.bio}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-500">Convocation Keynote Session:</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{spk.topic}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WORKING GROUPS */}
      {activeTab === "working_groups" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workingGroups.map((wg) => (
              <div
                key={wg.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                      {wg.status}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1.5">{wg.name}</h3>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">{wg.members.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">Delegates</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {wg.objective}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-500 text-[11px]">
                    Lead: <strong className="text-slate-800 dark:text-slate-200">{wg.lead}</strong>
                  </div>

                  <button
                    onClick={() => alert(`You have joined the "${wg.name}" working group! Check your email for drafting materials.`)}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    Join Working Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TRADER CONVOCATION CHARTER */}
      {activeTab === "charter" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs max-w-4xl mx-auto text-xs leading-relaxed">
          <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>THE 2026 GLOBAL CONVOCATION DECLARATION</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              The Retail Forex Trader Bill of Rights
            </h2>
            <p className="text-slate-500 text-xs">
              Ratified by 48,000+ Independent Traders, Dispute Ombudsmen & Research Fellows
            </p>
          </div>

          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Article I: Right to Unmanipulated Execution Telemetry</h4>
              <p>Every retail trader is entitled to cryptographic timestamp verification of all order fills, including slippage milliseconds, liquidity provider IDs, and spread markup breakdowns.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Article II: Right to Immediate Capital Segregation & Solvency Audits</h4>
              <p>Client funds must remain strictly segregated in Tier-1 credit institutions and protected against corporate bankruptcy through statutory €100k insurance mandates.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Article III: Right to Binding Third-Party Dispute Arbitration</h4>
              <p>Brokers cannot unilaterally cancel trader profits under vague latency arbitrage clauses without submitting complete server tick logs to an independent ombudsman.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Article IV: Absolute Decoupling of Rating Systems from Commercial Interests</h4>
              <p>Review platforms must never accept financial compensation to alter broker rankings, expunge legitimate user complaints, or conceal regulatory infractions.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. DELEGATE REGISTRATION MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-xs space-y-4">
            <button
              onClick={() => {
                setShowRegisterModal(false);
                setRegistrationSuccess(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {!registrationSuccess ? (
              <>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Claim Convocation Delegate Pass
                  </h3>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join 48,000+ traders worldwide. Access all live 4K keynotes, floor Q&A privileges, and downloadable solvency reports.
                </p>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    Delegate Access Tier:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "virtual", label: "Virtual Free", price: "$0" },
                      { id: "vip", label: "VIP Delegate", price: "$49" },
                      { id: "press", label: "Press Pass", price: "Free" }
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setDelegateType(tier.id as any)}
                        className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          delegateType === tier.id
                            ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <div>{tier.label}</div>
                        <div className="text-[10px] opacity-80">{tier.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Johnathan Vance"
                      defaultValue="Marcus Vance"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Email Address (For Stream Access Token) *
                    </label>
                    <input
                      type="email"
                      placeholder="trader@domain.com"
                      defaultValue="delegate@wikifx-community.org"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRegistrationSuccess(true)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
                >
                  <Award className="h-4 w-4" />
                  <span>Confirm Delegate Registration</span>
                </button>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delegate Pass Confirmed!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Your Convocation Stream Key <strong>#WFX-2026-CONV-8841</strong> has been activated. You now have full Q&A voting rights on the community floor.
                </p>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl cursor-pointer"
                >
                  Enter Assembly
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
