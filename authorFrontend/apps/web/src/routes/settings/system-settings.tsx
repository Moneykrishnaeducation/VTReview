import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/admin-context";
import {
  Settings,
  ShieldCheck,
  AlertTriangle,
  Save,
  CheckCircle2,
  Sliders,
  FileText,
  Globe,
  Award,
  History,
  RotateCcw,
  Eye,
  Download,
  Server,
  Zap,
  Lock,
  Radio,
  RefreshCw,
  X,
  Smartphone,
  Monitor,
  Sparkles,
  Database,
} from "lucide-react";

// ─── Preset Risk Warnings ───────────────────────────────────────────────────
const REGIONAL_WARNING_PRESETS: Record<string, { label: string; text: string }> = {
  esma: {
    label: "ESMA / EU (74-89%)",
    text: "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 74% and 89% of retail investor accounts lose money when trading CFDs with these providers. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your capital.",
  },
  fca: {
    label: "FCA UK (81%)",
    text: "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 81% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your capital.",
  },
  asic: {
    label: "ASIC Australia (70-85%)",
    text: "Trading CFDs involves a high level of risk to your capital and you should only trade with money you can afford to lose. Approximately 70% to 85% of retail client accounts lose money. Ensure you thoroughly read the Product Disclosure Statement (PDS) and Target Market Determination (TMD) before investing.",
  },
  global: {
    label: "Global Multi-Jurisdiction Default",
    text: "High Risk Investment Notice: Forex and CFD trading involve substantial risk of loss and are not suitable for all investors. Leverage creates additional risk and loss exposure. Past performance is not indicative of future results. Please ensure you fully understand the risks involved before entering into any transactions.",
  },
};

const SCORING_PRESETS = {
  balanced: {
    label: "Balanced Baseline (Recommended)",
    weights: {
      regulation: 35,
      costs: 25,
      execution: 15,
      supportAndDisputes: 15,
      educationAndFeatures: 10,
    },
  },
  safetyFirst: {
    label: "Safety & Regulation Heavy",
    weights: {
      regulation: 50,
      costs: 15,
      execution: 15,
      supportAndDisputes: 15,
      educationAndFeatures: 5,
    },
  },
  costFocused: {
    label: "Low Spread & Cost Focused",
    weights: {
      regulation: 25,
      costs: 45,
      execution: 15,
      supportAndDisputes: 10,
      educationAndFeatures: 5,
    },
  },
};

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  category: string;
  changeSummary: string;
}

export default function SystemSettings() {
  const { activeRoleDef, addAuditLogEntry } = useAdmin();
  const [activeTab, setActiveTab] = useState<"disclosures" | "features" | "scoring" | "edge" | "audit">("disclosures");
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [cdnPurging, setCdnPurging] = useState(false);

  // ── Tab 1: Disclosures ────────────────────────────────────────────────────
  const [riskWarning, setRiskWarning] = useState(REGIONAL_WARNING_PRESETS.esma.text);
  const [disclosureText, setDisclosureText] = useState(
    "WikiFX / VTReview is an independent comparison website supported by referral commissions. We may receive financial compensation when visitors click on affiliate links to broker websites. This compensation does not influence our rigorous editorial ratings, test scores, or algorithmic ranking formulas. We do not accept payment to artificially alter broker scores or promote unregulated offshore entities."
  );
  const [disputePolicy, setDisputePolicy] = useState(
    "All disputes submitted to the Exposure & Convocation mediation desk are reviewed independently under strict anti-tamper protocols. Broker responses are logged in public immutable audit ledgers."
  );
  const [cookieConsentPolicy, setCookieConsentPolicy] = useState(
    "We use privacy-preserving first-party telemetry to record tick spread execution latency and aggregated market volume metrics. No personal financial data is shared with unverified commercial third parties."
  );

  // ── Tab 2: Feature Flags ──────────────────────────────────────────────────
  const [featureFlags, setFeatureFlags] = useState({
    liveSpreadSync: true,
    publicComplaintsFeed: true,
    communityReviewsOpen: true,
    automatedCloneDetection: true,
    aiEvidenceOcr: true,
    webhookDispatch: true,
    searchRateLimiting: true,
    strictMfaSuperAdmin: true,
  });

  // ── Tab 3: Scoring Formula ────────────────────────────────────────────────
  const [scoringWeights, setScoringWeights] = useState({
    regulation: 35,
    costs: 25,
    execution: 15,
    supportAndDisputes: 15,
    educationAndFeatures: 10,
  });

  // ── Tab 4: Edge & API ─────────────────────────────────────────────────────
  const [edgeSettings, setEdgeSettings] = useState({
    cdnTtlSeconds: 300,
    feedPollingIntervalSec: 30,
    maintenanceMode: false,
    maintenanceBannerText: "Scheduled platform infrastructure upgrade in progress. Market data updates may experience slight delay.",
    fcaApiEndpoint: "https://api.fca.org.uk/v1/register",
    asicApiEndpoint: "https://asic.gov.au/api/registers/v2",
    cysecApiEndpoint: "https://cysec.gov.cy/api/entities/v1",
  });

  // ── Tab 5: Audit History ──────────────────────────────────────────────────
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>([
    {
      id: "set-aud-01",
      timestamp: "2026-09-15 14:32 UTC",
      actor: "Sarah Jenkins",
      role: "Compliance Officer",
      category: "Disclosures",
      changeSummary: "Updated ESMA risk percentage text to reflect 2026 Q3 audit disclosures.",
    },
    {
      id: "set-aud-02",
      timestamp: "2026-09-14 09:15 UTC",
      actor: "David Chen",
      role: "Super Admin",
      category: "Feature Gates",
      changeSummary: "Enabled automated AI Evidence OCR verification pipeline.",
    },
    {
      id: "set-aud-03",
      timestamp: "2026-09-10 18:00 UTC",
      actor: "Alexander Thorne",
      role: "Lead Financial Analyst",
      category: "Scoring Formula",
      changeSummary: "Adjusted Trading Cost weighting coefficient to 25% from 20%.",
    },
  ]);

  // Total scoring weights sum
  const totalWeight = Object.values(scoringWeights).reduce((a, b) => a + b, 0);

  // Keyboard shortcut (Ctrl/Cmd + S) to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        triggerSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [riskWarning, disclosureText, disputePolicy, cookieConsentPolicy, featureFlags, scoringWeights, edgeSettings, totalWeight, activeTab, activeRoleDef]);

  const triggerSave = () => {
    if (totalWeight !== 100) {
      alert("Scoring formula weights must sum to exactly 100% before saving.");
      return;
    }

    const newAudit: AuditEntry = {
      id: `set-aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      actor: activeRoleDef.name,
      role: activeRoleDef.name,
      category: activeTab.toUpperCase(),
      changeSummary: `Governance configuration updated under ${activeTab.toUpperCase()} matrix.`,
    };

    setAuditHistory((prev) => [newAudit, ...prev]);
    if (addAuditLogEntry) {
      addAuditLogEntry({
        action: "UPDATE",
        entityType: "setting",
        entityId: "global-governance",
        entityName: "Platform Governance Settings",
        summary: `Updated system settings tab: ${activeTab}. Status: synchronized across nodes.`,
      });
    }

    setSaveSuccess(`System configuration synced across public web nodes by ${activeRoleDef.name}.`);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleExportConfig = () => {
    const configData = {
      timestamp: new Date().toISOString(),
      governanceActor: activeRoleDef.name,
      disclosures: {
        riskWarning,
        disclosureText,
        disputePolicy,
        cookieConsentPolicy,
      },
      featureFlags,
      scoringWeights,
      edgeSettings,
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vtreview-system-governance-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePurgeCdn = () => {
    setCdnPurging(true);
    setTimeout(() => {
      setCdnPurging(false);
      setSaveSuccess("Global edge CDN caches purged across all 4 server regions.");
      setTimeout(() => setSaveSuccess(null), 4000);
    }, 1200);
  };

  const handleResetCurrentTab = () => {
    if (confirm("Are you sure you want to restore default regulatory values for this section?")) {
      if (activeTab === "disclosures") {
        setRiskWarning(REGIONAL_WARNING_PRESETS.esma.text);
        setDisclosureText(
          "WikiFX / VTReview is an independent comparison website supported by referral commissions. We may receive financial compensation when visitors click on affiliate links to broker websites. This compensation does not influence our rigorous editorial ratings, test scores, or algorithmic ranking formulas."
        );
      } else if (activeTab === "features") {
        setFeatureFlags({
          liveSpreadSync: true,
          publicComplaintsFeed: true,
          communityReviewsOpen: true,
          automatedCloneDetection: true,
          aiEvidenceOcr: true,
          webhookDispatch: true,
          searchRateLimiting: true,
          strictMfaSuperAdmin: true,
        });
      } else if (activeTab === "scoring") {
        setScoringWeights(SCORING_PRESETS.balanced.weights);
      }
      setSaveSuccess("Default regulatory configuration restored.");
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-xs w-full pb-16">
      {/* ── Top Header Bar with Context Ribbon ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-mono text-[11px] mb-1 font-semibold">
            <Settings className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>PLATFORM GOVERNANCE & LEGAL CONTROL</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            System Configuration, Disclosures & Global Telemetry
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Manage international statutory disclaimers, live spread ingestion gates, scoring formula coefficients, and edge cluster nodes.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Preview how disclaimers appear to live users"
          >
            <Eye className="h-3.5 w-3.5 text-blue-500" />
            <span className="hidden sm:inline">Live Preview</span>
          </button>

          <button
            type="button"
            onClick={handleExportConfig}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export full governance config as JSON snapshot"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={triggerSave}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* ── Success Banner ── */}
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{saveSuccess}</span>
          </div>
          <button
            onClick={() => setSaveSuccess(null)}
            className="text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Executive KPI Cards Ribbon ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>Statutory Compliance</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">100% Compliant</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            ESMA • FCA • ASIC Synchronized
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>Telemetry Nodes</span>
            <Radio className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">4 / 4 Active</div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            London • NY • Tokyo • Sydney
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>Clone Shield</span>
            <Zap className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">0 Infiltrations</div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
            Auto-Match Active (30s interval)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            <span>Governance Actor</span>
            <Lock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white truncate">
            {activeRoleDef.name}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            Role Tier: {activeRoleDef.id}
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            {
              id: "disclosures",
              label: "Disclosures & Legal",
              icon: <FileText className="h-3.5 w-3.5" />,
            },
            {
              id: "features",
              label: "Feature Gates & Telemetry",
              icon: <Sliders className="h-3.5 w-3.5" />,
            },
            {
              id: "scoring",
              label: "Scoring Formula Weights",
              icon: <Award className="h-3.5 w-3.5" />,
              badge: `${totalWeight}%`,
              badgeError: totalWeight !== 100,
            },
            {
              id: "edge",
              label: "Edge CDN & Registry APIs",
              icon: <Globe className="h-3.5 w-3.5" />,
            },
            {
              id: "audit",
              label: "Audit Ledger",
              icon: <History className="h-3.5 w-3.5" />,
              badge: auditHistory.length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      tab.badgeError
                        ? "bg-rose-500 text-white animate-pulse"
                        : isActive
                        ? "bg-slate-950/20 text-slate-950"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleResetCurrentTab}
          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium text-[11px] px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Section</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: Disclosures & Legal Framework
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "disclosures" && (
        <div className="space-y-6">
          {/* Statutory Risk Warning */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <span>Mandatory Statutory High-Risk Investment Warning (ESMA / FCA / ASIC)</span>
              </div>
              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Presets:</span>
                {Object.entries(REGIONAL_WARNING_PRESETS).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setRiskWarning(v.text)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                      riskWarning === v.text
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              This statutory warning is rendered persistently on the public portal footer, floating sticky notices, and high-leverage CFD comparison modules.
            </p>

            <div className="space-y-1.5">
              <textarea
                value={riskWarning}
                onChange={(e) => setRiskWarning(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-200 leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Recommended: 250 - 500 characters</span>
                <span>{riskWarning.length} characters</span>
              </div>
            </div>
          </div>

          {/* Advertiser Compensation & Editorial Independence */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Editorial Independence & Advertiser Compensation Disclosure</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Integrity Seal Active
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Guarantees operational decoupling between commercial referral links and algorithmic 120-point broker ratings.
            </p>

            <div className="space-y-1.5">
              <textarea
                value={disclosureText}
                onChange={(e) => setDisclosureText(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-200 leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Rendered on top-right banner of all review dossiers</span>
                <span>{disclosureText.length} characters</span>
              </div>
            </div>
          </div>

          {/* Dispute Resolution & Privacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Dispute Mediation & Exposure Protocol</span>
              </div>
              <textarea
                value={disputePolicy}
                onChange={(e) => setDisputePolicy(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 leading-relaxed focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Lock className="h-4 w-4 text-purple-500" />
                <span>Privacy & Spread Telemetry Policy</span>
              </div>
              <textarea
                value={cookieConsentPolicy}
                onChange={(e) => setCookieConsentPolicy(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 leading-relaxed focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: Feature Gates & Telemetry
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sliders className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Global Operational Feature Toggles</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Toggle platform capabilities and automated verification engines in real-time with zero system downtime.
              </p>
            </div>

            {/* Feature Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "liveSpreadSync",
                  label: "Live Spread Telemetry Sync",
                  desc: "Continuously captures 10,000 tick London & NY spread feeds from active liquidity test accounts.",
                  badge: "Data Ingestion",
                  icon: <Zap className="h-4 w-4 text-amber-500" />,
                },
                {
                  key: "publicComplaintsFeed",
                  label: "Public Dispute & Exposure Feed",
                  desc: "Displays verified mediation dossiers and dispute outcomes on public broker profiles.",
                  badge: "Transparency",
                  icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
                },
                {
                  key: "communityReviewsOpen",
                  label: "Community Review Submissions",
                  desc: "Allows registered real-money traders to submit verified account reviews for moderation.",
                  badge: "Community",
                  icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
                },
                {
                  key: "automatedCloneDetection",
                  label: "Automated Regulatory Clone Detector",
                  desc: "Scans newly registered domain names and WHOIS against FCA, ASIC, and BaFin warning registers.",
                  badge: "Shield AI",
                  icon: <ShieldCheck className="h-4 w-4 text-blue-500" />,
                },
                {
                  key: "aiEvidenceOcr",
                  label: "AI-Assisted License OCR Verification",
                  desc: "Extracts regulator registration numbers from uploaded certificate images and validates checksums.",
                  badge: "Verification",
                  icon: <Sparkles className="h-4 w-4 text-indigo-500" />,
                },
                {
                  key: "webhookDispatch",
                  label: "Real-time Editorial Webhook Dispatch",
                  desc: "Pushes broker rating status updates to downstream affiliate news feeds and API partners.",
                  badge: "Webhooks",
                  icon: <Radio className="h-4 w-4 text-cyan-500" />,
                },
                {
                  key: "searchRateLimiting",
                  label: "Search Rate-Limiter & Anti-Scraping",
                  desc: "Enforces 60 requests/minute ceiling per IP to protect proprietary broker benchmarking databases.",
                  badge: "Security",
                  icon: <Lock className="h-4 w-4 text-slate-500" />,
                },
                {
                  key: "strictMfaSuperAdmin",
                  label: "Strict MFA Enforcement on Tier-1 Edits",
                  desc: "Requires hardware/authenticator TOTP prompt prior to publishing rating tier modifications.",
                  badge: "Governance",
                  icon: <ShieldCheck className="h-4 w-4 text-amber-500" />,
                },
              ].map((f) => {
                const isChecked = featureFlags[f.key as keyof typeof featureFlags];
                return (
                  <label
                    key={f.key}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isChecked
                        ? "bg-slate-50/80 dark:bg-slate-950 border-amber-500/30 shadow-xs"
                        : "bg-slate-50/40 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-75"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                        {f.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{f.label}</span>
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            {f.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>

                    <div className="relative inline-flex items-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setFeatureFlags((prev) => ({
                            ...prev,
                            [f.key]: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: Scoring Algorithm & Weighting Matrix
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "scoring" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>120-Point Multi-Pillar Scoring Weight Matrix</span>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Adjust the percentage coefficients that formulate algorithmic broker scores across the 5 core evaluation pillars.
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                {Object.entries(SCORING_PRESETS).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setScoringWeights(v.weights)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Percentage Gauge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Formula Weight Allocation:</span>
                  <span
                    className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-full ${
                      totalWeight === 100
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {totalWeight}% {totalWeight === 100 ? "✓ VALID" : "⚠ MUST EQUAL 100%"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">5 Active Pillars</span>
              </div>

              {/* Stacked Colored Distribution Bar */}
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${scoringWeights.regulation}%` }} className="bg-emerald-500 transition-all" title={`Regulation: ${scoringWeights.regulation}%`} />
                <div style={{ width: `${scoringWeights.costs}%` }} className="bg-amber-500 transition-all" title={`Costs: ${scoringWeights.costs}%`} />
                <div style={{ width: `${scoringWeights.execution}%` }} className="bg-blue-500 transition-all" title={`Execution: ${scoringWeights.execution}%`} />
                <div style={{ width: `${scoringWeights.supportAndDisputes}%` }} className="bg-purple-500 transition-all" title={`Disputes: ${scoringWeights.supportAndDisputes}%`} />
                <div style={{ width: `${scoringWeights.educationAndFeatures}%` }} className="bg-rose-500 transition-all" title={`Education: ${scoringWeights.educationAndFeatures}%`} />
              </div>
            </div>

            {/* Slider Controls */}
            <div className="space-y-4">
              {[
                {
                  key: "regulation",
                  label: "Pillar 1: Regulatory Safety, Tiering & Capital Protection",
                  color: "emerald",
                  desc: "Licenses with FCA, ASIC, BaFin, SEC, NFA, segregated client funds, and compensation schemes.",
                },
                {
                  key: "costs",
                  label: "Pillar 2: Real Trading Costs, Spreads & Commission Drag",
                  color: "amber",
                  desc: "Live EUR/USD & GBP/USD spread captures, swap fees, inactivity charges, and hidden costs.",
                },
                {
                  key: "execution",
                  label: "Pillar 3: Execution Speed, Latency & Slippage Tolerance",
                  color: "blue",
                  desc: "Mean fill latency in milliseconds, order rejection rates, and market depth stability during high volatility.",
                },
                {
                  key: "supportAndDisputes",
                  label: "Pillar 4: Dispute Resolution, Withdrawal Speed & Support Desk",
                  color: "purple",
                  desc: "Resolved complaint ratios, payout clearance speeds, and multi-lingual customer care desk responsiveness.",
                },
                {
                  key: "educationAndFeatures",
                  label: "Pillar 5: Platform Tooling, Market Research & Academy",
                  color: "rose",
                  desc: "TradingView integrations, MT4/MT5 support, proprietary analytics, webinars, and educational guides.",
                },
              ].map((p) => {
                const val = scoringWeights[p.key as keyof typeof scoringWeights];
                return (
                  <div
                    key={p.key}
                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{p.label}</div>
                        <div className="text-[11px] text-slate-500">{p.desc}</div>
                      </div>
                      <div className="font-mono font-black text-sm px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white shadow-xs">
                        {val}%
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="70"
                        step="5"
                        value={val}
                        onChange={(e) =>
                          setScoringWeights((prev) => ({
                            ...prev,
                            [p.key]: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: Edge CDN & Registry APIs
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "edge" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CDN & Caching */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Server className="h-4 w-4 text-blue-500" />
                  <span>Global Edge CDN Cache Management</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Cloudflare Enterprise
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    Public Static Cache TTL (Seconds)
                  </label>
                  <input
                    type="number"
                    value={edgeSettings.cdnTtlSeconds}
                    onChange={(e) =>
                      setEdgeSettings((prev) => ({
                        ...prev,
                        cdnTtlSeconds: parseInt(e.target.value, 10) || 300,
                      }))
                    }
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    Live Telemetry Ingestion Rate (Seconds)
                  </label>
                  <input
                    type="number"
                    value={edgeSettings.feedPollingIntervalSec}
                    onChange={(e) =>
                      setEdgeSettings((prev) => ({
                        ...prev,
                        feedPollingIntervalSec: parseInt(e.target.value, 10) || 30,
                      }))
                    }
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handlePurgeCdn}
                    disabled={cdnPurging}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                  >
                    <RefreshCw className={`h-4 w-4 ${cdnPurging ? "animate-spin text-amber-500" : ""}`} />
                    <span>{cdnPurging ? "Purging Edge CDN across 4 regions..." : "Purge All Edge CDN Caches"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Regulatory Authority Direct Sync APIs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Database className="h-4 w-4 text-emerald-500" />
                  <span>Regulator Register Webhooks & APIs</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: "FCA Register API (UK)", url: edgeSettings.fcaApiEndpoint, status: "Connected (200 OK)" },
                  { label: "ASIC Connect Gateway (AU)", url: edgeSettings.asicApiEndpoint, status: "Connected (200 OK)" },
                  { label: "CySEC Regulatory Feed (CY)", url: edgeSettings.cysecApiEndpoint, status: "Connected (200 OK)" },
                ].map((ep, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ep.label}</span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{ep.status}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate">{ep.url}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Maintenance Mode */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  <span>Emergency Maintenance & Warning Broadcast</span>
                </h4>
                <p className="text-slate-500 text-xs mt-0.5">
                  Broadcasts a global emergency warning banner across all public broker catalog and review pages.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={edgeSettings.maintenanceMode}
                  onChange={(e) =>
                    setEdgeSettings((prev) => ({
                      ...prev,
                      maintenanceMode: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            {edgeSettings.maintenanceMode && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl space-y-2 animate-in fade-in">
                <label className="block text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">
                  Broadcast Message Text
                </label>
                <input
                  type="text"
                  value={edgeSettings.maintenanceBannerText}
                  onChange={(e) =>
                    setEdgeSettings((prev) => ({
                      ...prev,
                      maintenanceBannerText: e.target.value,
                    }))
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 5: Audit Ledger & Version History
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "audit" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <History className="h-4 w-4 text-amber-500" />
                <span>Governance Configuration Revision Ledger</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Immutable record of all platform statutory disclosures, scoring formula recalibrations, and feature state modifications.
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold text-slate-700 dark:text-slate-300">
              {auditHistory.length} Revisions Logged
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditHistory.map((item) => (
              <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {item.category}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{item.changeSummary}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>Actor: <strong className="text-slate-700 dark:text-slate-300">{item.actor}</strong> ({item.role})</span>
                    <span>•</span>
                    <span className="font-mono">{item.timestamp}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    alert(`Rollback configuration to revision ${item.id}? This will restore snapshot state.`);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Rollback
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="text-slate-500 font-mono text-[11px] flex items-center gap-2">
          <span>Active Governance Actor:</span>
          <strong className="text-slate-900 dark:text-slate-200 font-semibold">{activeRoleDef.name}</strong>
          <span className="text-slate-400">({activeRoleDef.id})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerSave}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save System Governance Configuration</span>
          </button>
        </div>
      </div>

      {/* ── Modal: Live Disclaimer & Mobile/Desktop Preview ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Live Public Preview: Disclosures & Footers
                </h3>
              </div>

              {/* Viewport switcher */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    previewDevice === "desktop" ? "bg-amber-500 text-slate-950" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    previewDevice === "mobile" ? "bg-amber-500 text-slate-950" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body - Mockup Browser Canvas */}
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-100 dark:bg-slate-950 flex-1">
              <div
                className={`mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm transition-all ${
                  previewDevice === "mobile" ? "max-w-sm" : "max-w-2xl"
                }`}
              >
                {/* Emergency banner preview if active */}
                {edgeSettings.maintenanceMode && (
                  <div className="p-2.5 bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{edgeSettings.maintenanceBannerText}</span>
                  </div>
                )}

                {/* Advertiser Disclosure Pill */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Advertiser Disclosure & Independence Guarantee</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {disclosureText}
                  </p>
                </div>

                {/* Mock Broker Header */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/40 flex items-center justify-between">
                  <div>
                    <div className="font-black text-sm text-slate-900 dark:text-white">IC Markets Global</div>
                    <div className="text-[10px] text-slate-500">Tier-1 ASIC • Raw Spread ECN • 0.1 Pip EUR/USD</div>
                  </div>
                  <div className="font-mono font-black text-base text-amber-500">★ 9.4</div>
                </div>

                {/* Statutory High Risk Warning Footer */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[10px] text-slate-700 dark:text-amber-200/90 leading-relaxed font-medium space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[9px] tracking-wider flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>High Risk Investment Notice</span>
                  </div>
                  <p>{riskWarning}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
