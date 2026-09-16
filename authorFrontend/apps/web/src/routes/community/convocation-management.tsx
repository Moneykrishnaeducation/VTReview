import React, { useState } from "react";
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
  Eye
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

export default function ConvocationManagement() {
  const { activeRoleDef } = useAdmin();
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sessions" | "questions" | "polls" | "speakers" | "charter">("questions");

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
      concurrentViewers: 8420
    },
    {
      id: "SES-02",
      title: "Forex Execution Telemetry: Auditing 10,000-Tick Slippage & Raw ECN Spreads",
      track: "Market Execution",
      stage: "Auditorium 2",
      time: "11:00 - 12:15 UTC",
      status: "upcoming",
      speakers: ["Marcus Vance (WikiIFX)", "Tariq Al-Mansoor (MENA Liquidity)"],
      concurrentViewers: 0
    },
    {
      id: "SES-03",
      title: "Trader Townhall: Direct Cross-Examination of Broker Dispute Mediation Officers",
      track: "Dispute Arbitration",
      stage: "Community Main Floor",
      time: "13:30 - 15:00 UTC",
      status: "upcoming",
      speakers: ["Sarah Jenkins, Esq.", "Klaus Zimmerman (EBC)"],
      concurrentViewers: 0
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

  // Resolution Polling state
  const [pollActive, setPollActive] = useState(true);
  const [pollResults, setPollResults] = useState({
    totalVotes: 3410,
    opt1: 72,
    opt2: 21,
    opt3: 7
  });

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

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[11px] mb-1">
            <Radio className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>COMMUNITY SUMMIT & CONVOCATION OPERATIONS CONTROL</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Global Trader Convocation & Townhall Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
            <Radio className="h-3 w-3 animate-ping" />
            <span>4K BROADCAST ACTIVE (8,420 VIEWERS)</span>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Convocation Telemetry Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Total Registered Delegates</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="font-mono text-xl font-black text-slate-900 dark:text-white">48,520</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+1,420 registered today</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Floor Questions In Queue</span>
            <Mic className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="font-mono text-xl font-black text-slate-900 dark:text-white">
            {floorQuestions.filter((q) => q.status === "pending_review").length} Pending
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {floorQuestions.length} total questions logged
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Resolution Ballot Turnout</span>
            <Vote className="h-4 w-4 text-purple-500" />
          </div>
          <div className="font-mono text-xl font-black text-slate-900 dark:text-white">
            {pollResults.totalVotes.toLocaleString()} Votes
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            78.4% Quorum reached
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Dispute Reserve Escrow</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">$500,000</div>
          <div className="text-[10px] text-slate-500 font-mono">Guaranteed Trader Pool</div>
        </div>
      </div>

      {/* Convocation Workspace Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "questions"
              ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          <span>Floor Q&A Moderation ({floorQuestions.filter((q) => q.status === "pending_review").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "sessions"
              ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Video className="h-3.5 w-3.5" />
          <span>Stage Streams & Agenda ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("polls")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "polls"
              ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Vote className="h-3.5 w-3.5" />
          <span>Live Resolution Voting</span>
        </button>

        <button
          onClick={() => setActiveTab("charter")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "charter"
              ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>2026 Trader Charter</span>
        </button>
      </div>

      {/* TAB 1: FLOOR QUESTIONS MODERATION */}
      {activeTab === "questions" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Delegate Floor Questions Moderation Queue
              </h3>
              <p className="text-slate-500 text-[11px]">
                Approve verified trader questions to be delivered to keynote speakers and regulatory ombudsmen on stage.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Moderator Actor: <strong className="text-slate-800 dark:text-slate-200">{activeRoleDef.name}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {floorQuestions.map((q) => (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  q.status === "pushed_to_podium"
                    ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/50 shadow-xs"
                    : q.status === "rejected"
                    ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 opacity-60"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                      {q.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{q.traderName}</span>
                    <span className="text-slate-500 font-mono text-[10px]">({q.country})</span>
                    {q.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="h-3 w-3" /> VERIFIED
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        q.status === "pushed_to_podium"
                          ? "bg-amber-500 text-slate-950"
                          : q.status === "answered"
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : q.status === "rejected"
                          ? "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {q.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs">
                    {q.upvotes} Delegate Upvotes
                  </div>
                </div>

                <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-medium bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  "{q.question}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500">
                  <div>
                    Assigned Target Panel: <strong className="text-slate-800 dark:text-slate-200">{q.targetPanel}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.status !== "rejected" && (
                      <button
                        onClick={() => handleModerateQuestion(q.id, "rejected")}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 font-bold rounded-lg border border-rose-200 dark:border-rose-800 cursor-pointer"
                      >
                        Reject
                      </button>
                    )}

                    {q.status !== "pushed_to_podium" && (
                      <button
                        onClick={() => handleModerateQuestion(q.id, "pushed_to_podium")}
                        className="px-3.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Radio className="h-3.5 w-3.5" />
                        <span>Push to Podium</span>
                      </button>
                    )}

                    {q.status === "pushed_to_podium" && (
                      <button
                        onClick={() => handleModerateQuestion(q.id, "answered")}
                        className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark Answered on Stage</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STAGE STREAMS & AGENDA */}
      {activeTab === "sessions" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Stage Broadcast Controls & Session Agenda
              </h3>
              <p className="text-slate-500 text-[11px]">
                Control live RTMP broadcasts, stage assignment, and attendee stream allocations.
              </p>
            </div>
            <button
              onClick={() => alert("Modal to create new convocation keynote session.")}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Session</span>
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                      {s.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{s.title}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
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
                      className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        s.status === "live"
                          ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                  <div>Track: <strong className="text-slate-800 dark:text-slate-200">{s.track}</strong></div>
                  <div>Stage: <strong className="text-slate-800 dark:text-slate-200">{s.stage}</strong> ({s.time})</div>
                  <div>Live Viewers: <strong className="text-emerald-600 dark:text-emerald-400">{s.concurrentViewers.toLocaleString()}</strong></div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Panellists: {s.speakers.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESOLUTION VOTING */}
      {activeTab === "polls" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Live Convocation Floor Resolution & Ballot Control
              </h3>
              <p className="text-slate-500 text-[11px]">
                Create and manage delegate voting resolutions incorporated into the official 2026 Declaration.
              </p>
            </div>

            <button
              onClick={() => {
                setPollActive(!pollActive);
                setActionNotice(`Ballot #04 voting status toggled to: ${!pollActive ? "ACTIVE" : "CLOSED"}`);
                setTimeout(() => setActionNotice(null), 3000);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer shadow-xs ${
                pollActive
                  ? "bg-rose-600 text-white hover:bg-rose-500"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {pollActive ? "Close Resolution Voting" : "Re-Open Resolution Voting"}
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-700 dark:text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-[11px]">
                RESOLUTION #04 (AUDITED PROOF-OF-RESERVES)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {pollResults.totalVotes.toLocaleString()} Verified Votes
              </span>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Should all brokers offering leverage &gt; 1:100 be required to publish third-party audited monthly Proof-of-Reserves?
            </h4>

            <div className="space-y-2 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span>Option A: Yes, mandatory monthly audit</span>
                  <span className="font-mono">{pollResults.opt1}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pollResults.opt1}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span>Option B: Quarterly only for Tier-1 brokers</span>
                  <span className="font-mono">{pollResults.opt2}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pollResults.opt2}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span>Option C: No, current regulatory reporting suffices</span>
                  <span className="font-mono">{pollResults.opt3}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pollResults.opt3}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHARTER */}
      {activeTab === "charter" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                2026 Retail Trader Bill of Rights & Convocation Declaration
              </h3>
              <p className="text-slate-500 text-[11px]">
                Ratification status by participating regulatory authorities and independent research bodies.
              </p>
            </div>
            <button
              onClick={() => {
                setActionNotice("Official Convocation Charter certified & published to public web nodes!");
                setTimeout(() => setActionNotice(null), 3500);
              }}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Certify & Publish Declaration</span>
            </button>
          </div>

          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Article I: Right to Unmanipulated Execution Telemetry</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Status: Passed by 98.2% delegate vote in session Plenary Hall A.</p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Article II: Right to Immediate Capital Segregation & Solvency Audits</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Status: Certified by WikiIFX Regulatory Oversight Board.</p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Article III: Right to Binding Third-Party Dispute Arbitration</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Status: Integrated into Complaints Management workflow engine.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
