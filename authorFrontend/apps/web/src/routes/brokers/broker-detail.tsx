import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useAdmin } from "../../context/admin-context";
import { StatusBadge } from "../../components/status-badge";
import { ScoreEditor } from "../../components/score-editor";
import { AuditTimeline } from "../../components/audit-timeline";
import { EvidenceCard } from "../../components/evidence-card";
import type {
  BrokerAdmin,
  BrokerLicenseAdmin,
  BrokerAccountType,
  ReviewModerationItem,
  ComplaintAdmin,
} from "../../types/admin";
import {
  Building2,
  ShieldCheck,
  Star,
  FileText,
  DollarSign,
  Laptop,
  CreditCard,
  Globe2,
  MessageSquare,
  AlertTriangle,
  Search,
  History,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Save,
  Edit2,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  Check,
  Sparkles,
} from "lucide-react";

// ─── Style helpers ──────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition";
const readCls = "w-full text-xs text-slate-800 dark:text-slate-200 py-1.5 leading-relaxed";
const labelCls = "block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-0.5";
const cardCls =
  "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-xs shadow-xs space-y-4";

function SpecField({
  label,
  editMode,
  readValue,
  children,
}: {
  label: string;
  editMode: boolean;
  readValue: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
      <div className={labelCls}>{label}</div>
      {editMode ? children : <div className={readCls}>{readValue}</div>}
    </div>
  );
}

// ─── Default Account Types if not present ──────────────────────────────────
const DEFAULT_ACCOUNT_TYPES: BrokerAccountType[] = [
  {
    id: "acc-std",
    name: "Standard Account",
    minDeposit: 50,
    spreadFrom: 0.8,
    commission: 0,
    maxLeverage: "1:500",
    executionType: "STP",
    currencies: ["USD", "EUR", "GBP", "AUD"],
  },
  {
    id: "acc-raw",
    name: "Raw Spread / ECN Account",
    minDeposit: 200,
    spreadFrom: 0.0,
    commission: 3.5,
    maxLeverage: "1:500",
    executionType: "ECN/STP",
    currencies: ["USD", "EUR", "GBP", "JPY", "SGD"],
  },
  {
    id: "acc-vip",
    name: "Pro / Institutional Account",
    minDeposit: 10000,
    spreadFrom: 0.0,
    commission: 2.0,
    maxLeverage: "1:200",
    executionType: "DMA/ECN",
    currencies: ["USD", "EUR", "GBP", "CHF"],
  },
];

export default function BrokerDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    brokers,
    updateBroker,
    auditLogs,
    evidenceList,
    reviews,
    complaints,
    moderateReview,
    updateComplaintStatus,
    addEvidence,
    addReview,
    addComplaint,
    addAuditLogEntry,
    activeRoleDef,
  } = useAdmin();

  // Find broker by slug or id
  const broker = brokers.find((b) => b.slug === id || b.id === id) || brokers[0];
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isDraftMode, setIsDraftMode] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Broker specifications updated.");

  // Filter linked items
  const brokerAuditLogs = auditLogs.filter(
    (log) => log.entityId === broker.id || log.entityName.includes(broker.name)
  );
  const brokerEvidence = evidenceList.filter(
    (ev) => ev.relatedEntityId === broker.id || ev.relatedEntityName.includes(broker.name)
  );
  const brokerReviews = reviews.filter((r) => r.brokerId === broker.id);
  const brokerComplaints = complaints.filter((c) => c.brokerId === broker.id);

  // ══════════════════════════════════════════════════════════════════════════
  // EDIT STATES FOR ALL 12 TABS
  // ══════════════════════════════════════════════════════════════════════════

  // ── Tab 1: Overview
  const [editingOverview, setEditingOverview] = useState(false);
  const [draftEurUsd, setDraftEurUsd] = useState(broker.eurUsdSpread);
  const [draftGbpUsd, setDraftGbpUsd] = useState(broker.gbpUsdSpread);
  const [draftCommission, setDraftCommission] = useState(broker.commissionPerLot);
  const [draftMinDeposit, setDraftMinDeposit] = useState(broker.minDeposit);
  const [draftMaxLeverage, setDraftMaxLeverage] = useState(broker.maxLeverage);
  const [draftAssets, setDraftAssets] = useState(broker.tradableAssetsCount);
  const [draftExecution, setDraftExecution] = useState(broker.executionModel);
  const [draftSummary, setDraftSummary] = useState(broker.summary);

  // ── Tab 2: Identity & Corporate
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [draftName, setDraftName] = useState(broker.name);
  const [draftLegalEntity, setDraftLegalEntity] = useState(broker.legalEntity);
  const [draftWebsite, setDraftWebsite] = useState(broker.website);
  const [draftFoundedYear, setDraftFoundedYear] = useState(broker.foundedYear);
  const [draftHqCountry, setDraftHqCountry] = useState(broker.hqCountry);
  const [draftStatus, setDraftStatus] = useState(broker.status);
  const [draftPrimaryRegulator, setDraftPrimaryRegulator] = useState(broker.primaryRegulator);
  const [draftTier, setDraftTier] = useState(broker.tier);

  // ── Tab 3: Regulation & Licenses
  const [editingRegulation, setEditingRegulation] = useState(false);
  const [draftLicenses, setDraftLicenses] = useState<BrokerLicenseAdmin[]>(broker.licenses);

  // ── Tab 4: Costs & Spreads
  const [editingCosts, setEditingCosts] = useState(false);

  // ── Tab 5: Platforms & Latency
  const [editingPlatforms, setEditingPlatforms] = useState(false);
  const [draftPlatforms, setDraftPlatforms] = useState(broker.platforms.join(", "));
  const [draftDepositMethods, setDraftDepositMethods] = useState(broker.depositMethods.join(", "));
  const [draftDataCenter, setDraftDataCenter] = useState(
    broker.dataCenterLocation || "Equinix LD4 (London) & NY4 (New York)"
  );
  const [draftLatency, setDraftLatency] = useState(broker.executionSpeedMs || 28);
  const [draftVps, setDraftVps] = useState(broker.vpsAvailable ?? true);
  const [draftCopyTrading, setDraftCopyTrading] = useState(broker.copyTradingSupported ?? true);
  const [draftFixApi, setDraftFixApi] = useState(broker.fixApiSupported ?? true);

  // ── Tab 6: Account Types
  const [editingAccounts, setEditingAccounts] = useState(false);
  const [draftAccounts, setDraftAccounts] = useState<BrokerAccountType[]>(
    broker.accountTypes && broker.accountTypes.length > 0
      ? broker.accountTypes
      : DEFAULT_ACCOUNT_TYPES
  );

  // ── Tab 7: 120-Point Ratings (Direct Score Override)
  const [editingRatings, setEditingRatings] = useState(false);
  const [draftEditorialScore, setDraftEditorialScore] = useState(broker.editorialScore);
  const [draftStarRating, setDraftStarRating] = useState(broker.starRating);
  const [draftCommunityScore, setDraftCommunityScore] = useState(broker.communityScore);
  const [draftReviewCount, setDraftReviewCount] = useState(broker.reviewCount);
  const [draftComplaintCount, setDraftComplaintCount] = useState(broker.complaintCount);

  // ── Tab 8: Community Reviews Modals / New Review
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newRevUser, setNewRevUser] = useState("");
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevTitle, setNewRevTitle] = useState("");
  const [newRevContent, setNewRevContent] = useState("");

  // ── Tab 9: Disputes Modals / New Dispute
  const [showAddComplaintModal, setShowAddComplaintModal] = useState(false);
  const [newCmpUser, setNewCmpUser] = useState("");
  const [newCmpEmail, setNewCmpEmail] = useState("");
  const [newCmpTitle, setNewCmpTitle] = useState("");
  const [newCmpDesc, setNewCmpDesc] = useState("");
  const [newCmpAmount, setNewCmpAmount] = useState(500);
  const [newCmpCategory, setNewCmpCategory] = useState<ComplaintAdmin["category"]>("delayed_withdrawal");

  // ── Tab 10: Evidence Ingestion Modal
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvType, setNewEvType] = useState<
    "regulatory_register" | "spread_test" | "broker_legal_doc" | "screenshot" | "trading_statement"
  >("regulatory_register");
  const [newEvNotes, setNewEvNotes] = useState("");
  const [newEvUrl, setNewEvUrl] = useState("");

  // ── Tab 11: SEO & Schema
  const [editingSeo, setEditingSeo] = useState(false);
  const [draftSeoTitle, setDraftSeoTitle] = useState(broker.seoTitle);
  const [draftSeoDesc, setDraftSeoDesc] = useState(broker.seoDescription);
  const [draftSchemaType, setDraftSchemaType] = useState(broker.schemaType || "FinancialService");
  const [draftKeywords, setDraftKeywords] = useState(
    broker.targetKeywords?.join(", ") || `${broker.name} review, forex broker, verified spreads, safety`
  );
  const [draftPros, setDraftPros] = useState(broker.pros.join("\n"));
  const [draftCons, setDraftCons] = useState(broker.cons.join("\n"));

  // ── Tab 12: Audit Entry Modal
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [newAuditSummary, setNewAuditSummary] = useState("");
  const [newAuditReason, setNewAuditReason] = useState("");
  const [newAuditAction, setNewAuditAction] = useState<
    "VERIFY" | "UPDATE" | "APPROVE" | "SCORE_CHANGE" | "PUBLISH"
  >("UPDATE");

  // ── Notification helper
  const flashSuccess = (msg = "Broker specifications updated and audit trail logged.") => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ── Tabs Definition (All 12 with badges)
  const tabs = [
    { id: "overview", label: "Overview", icon: <Building2 className="h-3.5 w-3.5" /> },
    { id: "identity", label: "Identity & Corporate", icon: <Globe2 className="h-3.5 w-3.5" /> },
    {
      id: "regulation",
      label: "Regulation & Licenses",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      badge: broker.licenses.length,
    },
    { id: "trading_costs", label: "Costs & Spreads", icon: <DollarSign className="h-3.5 w-3.5" /> },
    { id: "platforms", label: "Platforms & Latency", icon: <Laptop className="h-3.5 w-3.5" /> },
    { id: "accounts", label: "Account Types", icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: "ratings", label: "120-Point Ratings", icon: <Star className="h-3.5 w-3.5" /> },
    {
      id: "reviews",
      label: "Community Reviews",
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      badge: brokerReviews.length,
    },
    {
      id: "complaints",
      label: "Disputes",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      badge: brokerComplaints.length,
    },
    {
      id: "evidence",
      label: "Evidence Vault",
      icon: <FileText className="h-3.5 w-3.5" />,
      badge: brokerEvidence.length,
    },
    { id: "seo", label: "SEO & Schema", icon: <Search className="h-3.5 w-3.5" /> },
    {
      id: "audit_history",
      label: "Audit Timeline",
      icon: <History className="h-3.5 w-3.5" />,
      badge: brokerAuditLogs.length,
    },
  ];

  // ── Save Handlers ─────────────────────────────────────────────────────────

  const saveOverview = () => {
    updateBroker(broker.id, {
      eurUsdSpread: draftEurUsd,
      gbpUsdSpread: draftGbpUsd,
      commissionPerLot: draftCommission,
      minDeposit: draftMinDeposit,
      maxLeverage: draftMaxLeverage,
      tradableAssetsCount: draftAssets,
      executionModel: draftExecution,
      summary: draftSummary,
    });
    setEditingOverview(false);
    flashSuccess();
  };

  const saveIdentity = () => {
    updateBroker(broker.id, {
      name: draftName,
      legalEntity: draftLegalEntity,
      website: draftWebsite,
      foundedYear: draftFoundedYear,
      hqCountry: draftHqCountry,
      status: draftStatus,
      primaryRegulator: draftPrimaryRegulator,
      tier: draftTier,
    });
    setEditingIdentity(false);
    flashSuccess();
  };

  const saveRegulation = () => {
    updateBroker(broker.id, { licenses: draftLicenses });
    setEditingRegulation(false);
    flashSuccess("Regulatory licenses catalog updated.");
  };

  const saveCosts = () => {
    updateBroker(broker.id, {
      eurUsdSpread: draftEurUsd,
      gbpUsdSpread: draftGbpUsd,
      commissionPerLot: draftCommission,
      minDeposit: draftMinDeposit,
      maxLeverage: draftMaxLeverage,
      tradableAssetsCount: draftAssets,
      executionModel: draftExecution,
    });
    setEditingCosts(false);
    flashSuccess();
  };

  const savePlatforms = () => {
    updateBroker(broker.id, {
      platforms: draftPlatforms.split(",").map((s: string) => s.trim()).filter(Boolean),
      depositMethods: draftDepositMethods.split(",").map((s: string) => s.trim()).filter(Boolean),
      dataCenterLocation: draftDataCenter,
      executionSpeedMs: draftLatency,
      vpsAvailable: draftVps,
      copyTradingSupported: draftCopyTrading,
      fixApiSupported: draftFixApi,
    });
    setEditingPlatforms(false);
    flashSuccess("Platform specifications and latency telemetry saved.");
  };

  const saveAccounts = () => {
    updateBroker(broker.id, { accountTypes: draftAccounts });
    setEditingAccounts(false);
    flashSuccess("Account tier structures saved.");
  };

  const saveRatings = () => {
    updateBroker(broker.id, {
      editorialScore: draftEditorialScore,
      starRating: draftStarRating,
      communityScore: draftCommunityScore,
      reviewCount: draftReviewCount,
      complaintCount: draftComplaintCount,
    });
    setEditingRatings(false);
    flashSuccess("Editorial ratings and community scores updated.");
  };

  const saveSeo = () => {
    updateBroker(broker.id, {
      seoTitle: draftSeoTitle,
      seoDescription: draftSeoDesc,
      schemaType: draftSchemaType,
      targetKeywords: draftKeywords.split(",").map((s: string) => s.trim()).filter(Boolean),
      pros: draftPros.split("\n").map((s: string) => s.trim()).filter(Boolean),
      cons: draftCons.split("\n").map((s: string) => s.trim()).filter(Boolean),
    });
    setEditingSeo(false);
    flashSuccess("SEO metadata and schema tags saved.");
  };

  // Add License Helper
  const addBlankLicense = () => {
    const newLic: BrokerLicenseAdmin = {
      id: `lic-${Date.now()}`,
      regulatorCode: "FCA",
      regulatorName: "Financial Conduct Authority",
      jurisdiction: "United Kingdom",
      tier: "Tier-1",
      licenseNumber: "NEW-12345",
      licenseeEntity: broker.legalEntity || broker.name,
      status: "pending",
      officialRegisterUrl: "https://register.fca.org.uk",
      maxLeverage: "1:30",
      negativeBalanceProtection: true,
      segregatedAccounts: true,
    };
    setDraftLicenses((prev) => [...prev, newLic]);
  };

  const updateDraftLicense = (index: number, field: keyof BrokerLicenseAdmin, val: unknown) => {
    setDraftLicenses((prev) =>
      prev.map((lic, i) => (i === index ? { ...lic, [field]: val } : lic))
    );
  };

  const removeDraftLicense = (index: number) => {
    setDraftLicenses((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Account Tier Helper
  const addBlankAccount = () => {
    const newAcc: BrokerAccountType = {
      id: `acc-${Date.now()}`,
      name: "New Account Tier",
      minDeposit: 100,
      spreadFrom: 0.5,
      commission: 0,
      maxLeverage: "1:500",
      executionType: "STP",
      currencies: ["USD", "EUR"],
    };
    setDraftAccounts((prev) => [...prev, newAcc]);
  };

  // ── Reusable EditBar Component ────────────────────────────────────────────
  function EditBar({
    editing,
    onEdit,
    onSave,
    onCancel,
    label = "Edit",
  }: {
    editing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    label?: string;
  }) {
    return (
      <div className="flex items-center justify-end gap-2">
        {editing ? (
          <>
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Save className="h-3 w-3" />
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-3 w-3" />
            {label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Breadcrumb Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/brokers"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Broker Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Draft vs Public Switcher */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-0.5 rounded-lg text-xs shadow-xs">
            <button
              onClick={() => setIsDraftMode(false)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                !isDraftMode
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Public State
            </button>
            <button
              onClick={() => setIsDraftMode(true)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                isDraftMode
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Draft Workspace
            </button>
          </div>

          <button
            onClick={() => {
              updateBroker(broker.id, {
                updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
              });
              flashSuccess();
            }}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* ── Main Entity Summary Card ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-xs shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-md">
              {broker.logo}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  {broker.name}
                </h1>
                <StatusBadge status={broker.tier} size="md" />
                <StatusBadge status={broker.verificationStatus} size="md" />
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {broker.legalEntity} • Founded {broker.foundedYear} ({broker.hqCountry})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <div className="text-center px-2 border-r border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Editorial</div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400">
                ★ {broker.editorialScore.toFixed(1)}
              </div>
            </div>
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Community</div>
              <div className="text-base font-black text-slate-800 dark:text-slate-200">
                ★ {broker.communityScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* ── 12-Tab Horizontal Scroller ── */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-200 dark:border-slate-800 pt-3 custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: Overview (Editable)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="md:col-span-2 space-y-6">
            <div className={cardCls}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Trading Benchmarks &amp; Account Thresholds
                </h3>
                <EditBar
                  editing={editingOverview}
                  onEdit={() => {
                    setDraftEurUsd(broker.eurUsdSpread);
                    setDraftGbpUsd(broker.gbpUsdSpread);
                    setDraftCommission(broker.commissionPerLot);
                    setDraftMinDeposit(broker.minDeposit);
                    setDraftMaxLeverage(broker.maxLeverage);
                    setDraftAssets(broker.tradableAssetsCount);
                    setDraftExecution(broker.executionModel);
                    setDraftSummary(broker.summary);
                    setEditingOverview(true);
                  }}
                  onSave={saveOverview}
                  onCancel={() => setEditingOverview(false)}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <SpecField
                  label="EUR/USD Median Spread"
                  editMode={editingOverview}
                  readValue={
                    <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {broker.eurUsdSpread} pips
                    </span>
                  }
                >
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    className={inputCls}
                    value={draftEurUsd}
                    onChange={(e) => setDraftEurUsd(Number(e.target.value))}
                  />
                </SpecField>

                <SpecField
                  label="Round-Turn Commission"
                  editMode={editingOverview}
                  readValue={
                    <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                      ${broker.commissionPerLot * 2}/lot
                    </span>
                  }
                >
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    className={inputCls}
                    value={draftCommission}
                    onChange={(e) => setDraftCommission(Number(e.target.value))}
                  />
                </SpecField>

                <SpecField
                  label="Min Deposit Barrier"
                  editMode={editingOverview}
                  readValue={
                    <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                      ${broker.minDeposit}
                    </span>
                  }
                >
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={draftMinDeposit}
                    onChange={(e) => setDraftMinDeposit(Number(e.target.value))}
                  />
                </SpecField>

                <SpecField
                  label="Execution Engine"
                  editMode={editingOverview}
                  readValue={
                    <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                      {broker.executionModel}
                    </span>
                  }
                >
                  <select
                    className={inputCls}
                    value={draftExecution}
                    onChange={(e) =>
                      setDraftExecution(e.target.value as BrokerAdmin["executionModel"])
                    }
                  >
                    <option value="ECN/STP">ECN/STP</option>
                    <option value="STP">STP</option>
                    <option value="Market Maker">Market Maker</option>
                    <option value="DMA/ECN">DMA/ECN</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </SpecField>

                <SpecField
                  label="Max Leverage Ratio"
                  editMode={editingOverview}
                  readValue={
                    <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                      {broker.maxLeverage.split("/")[0]}
                    </span>
                  }
                >
                  <input
                    className={inputCls}
                    value={draftMaxLeverage}
                    onChange={(e) => setDraftMaxLeverage(e.target.value)}
                  />
                </SpecField>

                <SpecField
                  label="Tradable Instruments"
                  editMode={editingOverview}
                  readValue={
                    <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                      {broker.tradableAssetsCount}+ Assets
                    </span>
                  }
                >
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={draftAssets}
                    onChange={(e) => setDraftAssets(Number(e.target.value))}
                  />
                </SpecField>
              </div>
            </div>

            <div className={cardCls}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Editorial Research Summary
                </h3>
                <EditBar
                  editing={editingOverview}
                  onEdit={() => {
                    setDraftSummary(broker.summary);
                    setEditingOverview(true);
                  }}
                  onSave={saveOverview}
                  onCancel={() => setEditingOverview(false)}
                />
              </div>
              {editingOverview ? (
                <textarea
                  rows={4}
                  className={inputCls}
                  value={draftSummary}
                  onChange={(e) => setDraftSummary(e.target.value)}
                />
              ) : (
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {broker.summary}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className={cardCls}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Certified Regulatory Licenses</span>
                </h3>
                <button
                  onClick={() => setActiveTab("regulation")}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-[11px]"
                >
                  Manage →
                </button>
              </div>

              <div className="space-y-2.5">
                {broker.licenses.map((lic) => (
                  <div
                    key={lic.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {lic.regulatorCode} ({lic.jurisdiction})
                      </span>
                      <StatusBadge status={lic.tier} size="sm" />
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      License #{lic.licenseNumber}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{lic.licenseeEntity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: Identity & Corporate (Editable)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "identity" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-amber-500" />
                Corporate Identity Record
              </h3>
              <EditBar
                editing={editingIdentity}
                onEdit={() => {
                  setDraftName(broker.name);
                  setDraftLegalEntity(broker.legalEntity);
                  setDraftWebsite(broker.website);
                  setDraftFoundedYear(broker.foundedYear);
                  setDraftHqCountry(broker.hqCountry);
                  setDraftStatus(broker.status);
                  setDraftPrimaryRegulator(broker.primaryRegulator);
                  setDraftTier(broker.tier);
                  setEditingIdentity(true);
                }}
                onSave={saveIdentity}
                onCancel={() => setEditingIdentity(false)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <SpecField
                label="Broker Name"
                editMode={editingIdentity}
                readValue={<strong className="text-slate-900 dark:text-slate-100">{broker.name}</strong>}
              >
                <input
                  className={inputCls}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                />
              </SpecField>

              <SpecField
                label="Legal Entity"
                editMode={editingIdentity}
                readValue={broker.legalEntity}
              >
                <input
                  className={inputCls}
                  value={draftLegalEntity}
                  onChange={(e) => setDraftLegalEntity(e.target.value)}
                />
              </SpecField>

              <SpecField
                label="Website URL"
                editMode={editingIdentity}
                readValue={
                  <a
                    href={broker.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    {broker.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                }
              >
                <input
                  type="url"
                  className={inputCls}
                  value={draftWebsite}
                  onChange={(e) => setDraftWebsite(e.target.value)}
                />
              </SpecField>

              <SpecField
                label="Founded Year"
                editMode={editingIdentity}
                readValue={broker.foundedYear}
              >
                <input
                  type="number"
                  min={1900}
                  max={2030}
                  className={inputCls}
                  value={draftFoundedYear}
                  onChange={(e) => setDraftFoundedYear(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="HQ Country"
                editMode={editingIdentity}
                readValue={broker.hqCountry}
              >
                <input
                  className={inputCls}
                  value={draftHqCountry}
                  onChange={(e) => setDraftHqCountry(e.target.value)}
                />
              </SpecField>

              <SpecField
                label="Record Status"
                editMode={editingIdentity}
                readValue={<StatusBadge status={broker.status} size="sm" />}
              >
                <select
                  className={inputCls}
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value as BrokerAdmin["status"])}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="suspended">Suspended</option>
                  <option value="archived">Archived</option>
                </select>
              </SpecField>

              <SpecField
                label="Primary Regulator"
                editMode={editingIdentity}
                readValue={broker.primaryRegulator}
              >
                <input
                  className={inputCls}
                  value={draftPrimaryRegulator}
                  onChange={(e) => setDraftPrimaryRegulator(e.target.value)}
                />
              </SpecField>

              <SpecField
                label="Regulation Tier"
                editMode={editingIdentity}
                readValue={<StatusBadge status={broker.tier} size="sm" />}
              >
                <select
                  className={inputCls}
                  value={draftTier}
                  onChange={(e) => setDraftTier(e.target.value as BrokerAdmin["tier"])}
                >
                  <option value="Tier-1">Tier-1 (FCA / ASIC / BaFin)</option>
                  <option value="Tier-2">Tier-2 (CySEC / FSCA)</option>
                  <option value="Tier-3">Tier-3 (Offshore)</option>
                  <option value="Unregulated">Unregulated</option>
                </select>
              </SpecField>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                <p className={`${labelCls} mb-2`}>Pros (Strengths)</p>
                <ul className="space-y-1">
                  {broker.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={`${labelCls} mb-2`}>Cons (Drawbacks)</p>
                <ul className="space-y-1">
                  {broker.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400">
                      <X className="h-3 w-3 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: Regulation & Licenses (Fully Editable with Add / Delete / Edit)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "regulation" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Direct Regulatory Register Certifications ({draftLicenses.length})
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Statutory register cross-checks, client asset segregation, and statutory leverage limits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {editingRegulation && (
                  <button
                    onClick={addBlankLicense}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add License</span>
                  </button>
                )}

                <EditBar
                  editing={editingRegulation}
                  onEdit={() => {
                    setDraftLicenses([...broker.licenses]);
                    setEditingRegulation(true);
                  }}
                  onSave={saveRegulation}
                  onCancel={() => {
                    setDraftLicenses([...broker.licenses]);
                    setEditingRegulation(false);
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {draftLicenses.map((lic, idx) => (
                <div
                  key={lic.id || idx}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {lic.regulatorName || lic.regulatorCode}
                      </span>
                      <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                        ({lic.regulatorCode})
                      </span>
                      <StatusBadge status={lic.status} size="sm" />
                      <StatusBadge status={lic.tier} size="sm" />
                    </div>

                    <div className="flex items-center gap-3">
                      {!editingRegulation && lic.officialRegisterUrl && (
                        <a
                          href={lic.officialRegisterUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                        >
                          <span>Official Register</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}

                      {editingRegulation && (
                        <button
                          onClick={() => removeDraftLicense(idx)}
                          className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {editingRegulation ? (
                    <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <SpecField label="Regulator Code" editMode readValue={lic.regulatorCode}>
                          <input
                            className={inputCls}
                            value={lic.regulatorCode}
                            onChange={(e) => updateDraftLicense(idx, "regulatorCode", e.target.value)}
                          />
                        </SpecField>
                        <SpecField label="Regulator Name" editMode readValue={lic.regulatorName}>
                          <input
                            className={inputCls}
                            value={lic.regulatorName}
                            onChange={(e) => updateDraftLicense(idx, "regulatorName", e.target.value)}
                          />
                        </SpecField>
                        <SpecField label="Jurisdiction" editMode readValue={lic.jurisdiction}>
                          <input
                            className={inputCls}
                            value={lic.jurisdiction}
                            onChange={(e) => updateDraftLicense(idx, "jurisdiction", e.target.value)}
                          />
                        </SpecField>
                        <SpecField label="License Number" editMode readValue={lic.licenseNumber}>
                          <input
                            className={inputCls}
                            value={lic.licenseNumber}
                            onChange={(e) => updateDraftLicense(idx, "licenseNumber", e.target.value)}
                          />
                        </SpecField>
                        <SpecField label="Licensee Entity" editMode readValue={lic.licenseeEntity}>
                          <input
                            className={inputCls}
                            value={lic.licenseeEntity}
                            onChange={(e) => updateDraftLicense(idx, "licenseeEntity", e.target.value)}
                          />
                        </SpecField>
                        <SpecField label="Tier" editMode readValue={lic.tier}>
                          <select
                            className={inputCls}
                            value={lic.tier}
                            onChange={(e) => updateDraftLicense(idx, "tier", e.target.value as BrokerLicenseAdmin["tier"])}
                          >
                            <option value="Tier-1">Tier-1</option>
                            <option value="Tier-2">Tier-2</option>
                            <option value="Tier-3">Tier-3</option>
                            <option value="Unregulated">Unregulated</option>
                          </select>
                        </SpecField>
                        <SpecField label="Status" editMode readValue={lic.status}>
                          <select
                            className={inputCls}
                            value={lic.status}
                            onChange={(e) => updateDraftLicense(idx, "status", e.target.value as BrokerLicenseAdmin["status"])}
                          >
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                            <option value="expired">Expired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </SpecField>
                        <SpecField label="Register Search URL" editMode readValue={lic.officialRegisterUrl}>
                          <input
                            type="url"
                            className={inputCls}
                            value={lic.officialRegisterUrl}
                            onChange={(e) => updateDraftLicense(idx, "officialRegisterUrl", e.target.value)}
                          />
                        </SpecField>
                        <SpecField label="Compensation Scheme" editMode readValue={lic.compensationScheme || "None"}>
                          <input
                            className={inputCls}
                            value={lic.compensationScheme || ""}
                            onChange={(e) => updateDraftLicense(idx, "compensationScheme", e.target.value)}
                          />
                        </SpecField>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lic.negativeBalanceProtection}
                            onChange={(e) => updateDraftLicense(idx, "negativeBalanceProtection", e.target.checked)}
                            className="rounded accent-amber-500"
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Negative Balance Protection (NBP) Guaranteed
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lic.segregatedAccounts}
                            onChange={(e) => updateDraftLicense(idx, "segregatedAccounts", e.target.checked)}
                            className="rounded accent-amber-500"
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Segregated Client Accounts Mandatory
                          </span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <div>
                        License Number: <strong className="text-slate-900 dark:text-slate-200">{lic.licenseNumber}</strong>
                      </div>
                      <div>
                        Entity: <strong className="text-slate-900 dark:text-slate-200">{lic.licenseeEntity}</strong>
                      </div>
                      <div>
                        Compensation: <strong className="text-slate-900 dark:text-slate-200">{lic.compensationScheme || "None"}</strong>
                      </div>
                      <div>
                        NBP Protection:{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {lic.negativeBalanceProtection ? "Guaranteed" : "No"}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: Costs & Spreads (Editable)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "trading_costs" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Spread &amp; Cost Benchmarks
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Real-account tick telemetry, commission formulas, and round-turn trading costs.
                </p>
              </div>

              <EditBar
                editing={editingCosts}
                onEdit={() => {
                  setDraftEurUsd(broker.eurUsdSpread);
                  setDraftGbpUsd(broker.gbpUsdSpread);
                  setDraftCommission(broker.commissionPerLot);
                  setDraftMinDeposit(broker.minDeposit);
                  setDraftMaxLeverage(broker.maxLeverage);
                  setDraftAssets(broker.tradableAssetsCount);
                  setDraftExecution(broker.executionModel);
                  setEditingCosts(true);
                }}
                onSave={saveCosts}
                onCancel={() => setEditingCosts(false)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <SpecField
                label="EUR/USD Spread (pips)"
                editMode={editingCosts}
                readValue={
                  <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {broker.eurUsdSpread}
                  </span>
                }
              >
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={draftEurUsd}
                  onChange={(e) => setDraftEurUsd(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="GBP/USD Spread (pips)"
                editMode={editingCosts}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    {broker.gbpUsdSpread}
                  </span>
                }
              >
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={draftGbpUsd}
                  onChange={(e) => setDraftGbpUsd(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="Commission / Lot ($)"
                editMode={editingCosts}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    ${broker.commissionPerLot}
                  </span>
                }
              >
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={draftCommission}
                  onChange={(e) => setDraftCommission(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="All-In Cost EUR/USD"
                editMode={editingCosts}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    {broker.allInCostEurUsd} pips
                  </span>
                }
              >
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={draftEurUsd}
                  onChange={(e) => setDraftEurUsd(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="Min Deposit ($)"
                editMode={editingCosts}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    ${broker.minDeposit}
                  </span>
                }
              >
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={draftMinDeposit}
                  onChange={(e) => setDraftMinDeposit(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="Max Leverage"
                editMode={editingCosts}
                readValue={broker.maxLeverage}
              >
                <input
                  className={inputCls}
                  value={draftMaxLeverage}
                  onChange={(e) => setDraftMaxLeverage(e.target.value)}
                />
              </SpecField>

              <SpecField
                label="Execution Model"
                editMode={editingCosts}
                readValue={
                  <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                    {broker.executionModel}
                  </span>
                }
              >
                <select
                  className={inputCls}
                  value={draftExecution}
                  onChange={(e) =>
                    setDraftExecution(e.target.value as BrokerAdmin["executionModel"])
                  }
                >
                  <option value="ECN/STP">ECN/STP</option>
                  <option value="STP">STP</option>
                  <option value="Market Maker">Market Maker</option>
                  <option value="DMA/ECN">DMA/ECN</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </SpecField>

              <SpecField
                label="Tradable Assets"
                editMode={editingCosts}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    {broker.tradableAssetsCount}+
                  </span>
                }
              >
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={draftAssets}
                  onChange={(e) => setDraftAssets(Number(e.target.value))}
                />
              </SpecField>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 5: Platforms & Latency (Editable)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "platforms" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-blue-500" />
                  Trading Software Ecosystem &amp; Server Infrastructure
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Equinix data center connectivity, execution ping benchmarks, and client trading terminals.
                </p>
              </div>

              <EditBar
                editing={editingPlatforms}
                onEdit={() => {
                  setDraftPlatforms(broker.platforms.join(", "));
                  setDraftDepositMethods(broker.depositMethods.join(", "));
                  setDraftDataCenter(broker.dataCenterLocation || "Equinix LD4 (London) & NY4 (New York)");
                  setDraftLatency(broker.executionSpeedMs || 28);
                  setDraftVps(broker.vpsAvailable ?? true);
                  setDraftCopyTrading(broker.copyTradingSupported ?? true);
                  setDraftFixApi(broker.fixApiSupported ?? true);
                  setEditingPlatforms(true);
                }}
                onSave={savePlatforms}
                onCancel={() => setEditingPlatforms(false)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SpecField
                label="Supported Platforms (comma-separated)"
                editMode={editingPlatforms}
                readValue={
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {broker.platforms.map((p, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-semibold text-xs border border-slate-200 dark:border-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                }
              >
                <input
                  className={inputCls}
                  value={draftPlatforms}
                  onChange={(e) => setDraftPlatforms(e.target.value)}
                  placeholder="MetaTrader 4, MetaTrader 5, cTrader, TradingView"
                />
              </SpecField>

              <SpecField
                label="Deposit & Withdrawal Rails (comma-separated)"
                editMode={editingPlatforms}
                readValue={
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {broker.depositMethods.map((d, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-semibold text-xs border border-slate-200 dark:border-slate-700"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                }
              >
                <input
                  className={inputCls}
                  value={draftDepositMethods}
                  onChange={(e) => setDraftDepositMethods(e.target.value)}
                  placeholder="Bank Wire, Visa/Mastercard, PayPal, Crypto"
                />
              </SpecField>

              <SpecField
                label="Data Center Location"
                editMode={editingPlatforms}
                readValue={broker.dataCenterLocation || "Equinix LD4 (London) & NY4 (New York)"}
              >
                <input
                  className={inputCls}
                  value={draftDataCenter}
                  onChange={(e) => setDraftDataCenter(e.target.value)}
                  placeholder="e.g. Equinix LD4 / NY4 / TY3"
                />
              </SpecField>

              <SpecField
                label="Average Execution Latency (ms)"
                editMode={editingPlatforms}
                readValue={
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {broker.executionSpeedMs || 28} ms
                  </span>
                }
              >
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={draftLatency}
                  onChange={(e) => setDraftLatency(Number(e.target.value))}
                />
              </SpecField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!editingPlatforms}
                  checked={editingPlatforms ? draftVps : (broker.vpsAvailable ?? true)}
                  onChange={(e) => setDraftVps(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Free Sponsored VPS</div>
                  <div className="text-[10px] text-slate-500">Low-latency EA hosting</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!editingPlatforms}
                  checked={editingPlatforms ? draftCopyTrading : (broker.copyTradingSupported ?? true)}
                  onChange={(e) => setDraftCopyTrading(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Copy &amp; Social Trading</div>
                  <div className="text-[10px] text-slate-500">cTrader Copy / ZuluTrade</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!editingPlatforms}
                  checked={editingPlatforms ? draftFixApi : (broker.fixApiSupported ?? true)}
                  onChange={(e) => setDraftFixApi(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Institutional FIX API</div>
                  <div className="text-[10px] text-slate-500">Direct order routing bridge</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 6: Account Types (Editable with Add / Delete / Edit)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "accounts" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  Account Tier Specifications ({draftAccounts.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Retail and professional account tiers, minimum barriers, and commission structures.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {editingAccounts && (
                  <button
                    onClick={addBlankAccount}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Tier</span>
                  </button>
                )}

                <EditBar
                  editing={editingAccounts}
                  onEdit={() => {
                    setDraftAccounts(
                      broker.accountTypes && broker.accountTypes.length > 0
                        ? [...broker.accountTypes]
                        : [...DEFAULT_ACCOUNT_TYPES]
                    );
                    setEditingAccounts(true);
                  }}
                  onSave={saveAccounts}
                  onCancel={() => setEditingAccounts(false)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {draftAccounts.map((acc, idx) => (
                <div
                  key={acc.id || idx}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{acc.name}</span>
                    {editingAccounts && (
                      <button
                        onClick={() => setDraftAccounts((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {editingAccounts ? (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <div className={labelCls}>Account Name</div>
                        <input
                          className={inputCls}
                          value={acc.name}
                          onChange={(e) =>
                            setDraftAccounts((prev) =>
                              prev.map((a, i) => (i === idx ? { ...a, name: e.target.value } : a))
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className={labelCls}>Min Deposit ($)</div>
                          <input
                            type="number"
                            className={inputCls}
                            value={acc.minDeposit}
                            onChange={(e) =>
                              setDraftAccounts((prev) =>
                                prev.map((a, i) =>
                                  i === idx ? { ...a, minDeposit: Number(e.target.value) } : a
                                )
                              )
                            }
                          />
                        </div>
                        <div>
                          <div className={labelCls}>Spread From</div>
                          <input
                            type="number"
                            step="0.1"
                            className={inputCls}
                            value={acc.spreadFrom}
                            onChange={(e) =>
                              setDraftAccounts((prev) =>
                                prev.map((a, i) =>
                                  i === idx ? { ...a, spreadFrom: Number(e.target.value) } : a
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className={labelCls}>Commission ($/lot)</div>
                          <input
                            type="number"
                            step="0.5"
                            className={inputCls}
                            value={acc.commission}
                            onChange={(e) =>
                              setDraftAccounts((prev) =>
                                prev.map((a, i) =>
                                  i === idx ? { ...a, commission: Number(e.target.value) } : a
                                )
                              )
                            }
                          />
                        </div>
                        <div>
                          <div className={labelCls}>Max Leverage</div>
                          <input
                            className={inputCls}
                            value={acc.maxLeverage}
                            onChange={(e) =>
                              setDraftAccounts((prev) =>
                                prev.map((a, i) => (i === idx ? { ...a, maxLeverage: e.target.value } : a))
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Min Deposit:</span>
                        <strong className="text-slate-900 dark:text-slate-200">${acc.minDeposit}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Spread From:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{acc.spreadFrom} pips</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Commission:</span>
                        <strong className="text-slate-900 dark:text-slate-200">
                          {acc.commission === 0 ? "Zero ($0)" : `$${acc.commission}/lot`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Leverage:</span>
                        <strong className="text-slate-900 dark:text-slate-200">{acc.maxLeverage}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Execution:</span>
                        <strong className="text-amber-600 dark:text-amber-400">{acc.executionType}</strong>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 7: 120-Point Ratings (Editable Studio + Direct Score Overrides)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "ratings" && (
        <div className="space-y-6 text-xs">
          {/* Quick Direct Score Overrides */}
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  Direct Score Governance
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Fast editorial overrides for overall rating stars, community index, and review counts.
                </p>
              </div>

              <EditBar
                editing={editingRatings}
                onEdit={() => {
                  setDraftEditorialScore(broker.editorialScore);
                  setDraftStarRating(broker.starRating);
                  setDraftCommunityScore(broker.communityScore);
                  setDraftReviewCount(broker.reviewCount);
                  setDraftComplaintCount(broker.complaintCount);
                  setEditingRatings(true);
                }}
                onSave={saveRatings}
                onCancel={() => setEditingRatings(false)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <SpecField
                label="Editorial Score (0-100)"
                editMode={editingRatings}
                readValue={
                  <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                    ★ {broker.editorialScore.toFixed(1)}
                  </span>
                }
              >
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  className={inputCls}
                  value={draftEditorialScore}
                  onChange={(e) => setDraftEditorialScore(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="Star Rating (0-5)"
                editMode={editingRatings}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    {broker.starRating.toFixed(1)} ★
                  </span>
                }
              >
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  className={inputCls}
                  value={draftStarRating}
                  onChange={(e) => setDraftStarRating(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="Community Score (0-5)"
                editMode={editingRatings}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    {broker.communityScore.toFixed(1)} ★
                  </span>
                }
              >
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  className={inputCls}
                  value={draftCommunityScore}
                  onChange={(e) => setDraftCommunityScore(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="Review Count"
                editMode={editingRatings}
                readValue={
                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                    {broker.reviewCount}
                  </span>
                }
              >
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={draftReviewCount}
                  onChange={(e) => setDraftReviewCount(Number(e.target.value))}
                />
              </SpecField>

              <SpecField
                label="Complaint Count"
                editMode={editingRatings}
                readValue={
                  <span className="font-mono text-sm font-black text-rose-600 dark:text-rose-400">
                    {broker.complaintCount}
                  </span>
                }
              >
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={draftComplaintCount}
                  onChange={(e) => setDraftComplaintCount(Number(e.target.value))}
                />
              </SpecField>
            </div>
          </div>

          {/* 120-Point Multi-Pillar Studio */}
          <ScoreEditor broker={broker} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 8: Community Reviews (Editable Moderation & Response)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "reviews" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-cyan-500" />
                  Trader Reviews &amp; Moderation Queue ({brokerReviews.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Direct review moderation, verified trader badge checks, and public broker response management.
                </p>
              </div>

              <button
                onClick={() => setShowAddReviewModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Record Trader Review</span>
              </button>
            </div>

            {brokerReviews.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
                No reviews logged for {broker.name} yet. Click "Record Trader Review" to add one.
              </div>
            ) : (
              <div className="space-y-4">
                {brokerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{rev.userName}</span>
                        {rev.isVerifiedTrader && (
                          <span className="px-2 py-0.2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] rounded-full border border-emerald-300 dark:border-emerald-700">
                            Verified Trader
                          </span>
                        )}
                        <span className="font-mono text-amber-500 font-bold">★ {rev.rating}/5</span>
                        <StatusBadge status={rev.status} size="sm" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            moderateReview(rev.id, "approve");
                            flashSuccess("Review approved and published.");
                          }}
                          className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-semibold text-[11px] hover:bg-emerald-200 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            moderateReview(rev.id, "flag");
                            flashSuccess("Review flagged for compliance review.");
                          }}
                          className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-semibold text-[11px] hover:bg-amber-200 cursor-pointer"
                        >
                          Flag Risk
                        </button>
                        <button
                          onClick={() => {
                            moderateReview(rev.id, "reject");
                            flashSuccess("Review rejected.");
                          }}
                          className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 rounded font-semibold text-[11px] hover:bg-rose-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{rev.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{rev.content}</p>
                    </div>

                    {rev.brokerResponse && (
                      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border-l-2 border-amber-500 rounded-r-lg">
                        <div className="font-bold text-amber-800 dark:text-amber-300 text-[11px]">
                          Official Broker Response ({rev.brokerResponse.author}):
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">
                          {rev.brokerResponse.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 9: Disputes & Complaints (Editable Status & Settlement)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "complaints" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  Trader Dispute Cases &amp; Mediation ({brokerComplaints.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Unresolved slippage claims, withdrawal delays, and regulatory escalation cases.
                </p>
              </div>

              <button
                onClick={() => setShowAddComplaintModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Log Dispute Case</span>
              </button>
            </div>

            {brokerComplaints.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
                No active complaints filed against {broker.name}. Good regulatory standing!
              </div>
            ) : (
              <div className="space-y-4">
                {brokerComplaints.map((cmp) => (
                  <div
                    key={cmp.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {cmp.caseNumber}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{cmp.userName}</span>
                        <span className="font-mono text-slate-600 dark:text-slate-400">
                          Claim: {cmp.currency} {cmp.claimAmount}
                        </span>
                        <StatusBadge status={cmp.status} size="sm" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[10px]">Update Status:</span>
                        <select
                          value={cmp.status}
                          onChange={(e) => {
                            updateComplaintStatus(
                              cmp.id,
                              e.target.value as ComplaintAdmin["status"],
                              `Status updated to ${e.target.value} by ${activeRoleDef.name}`
                            );
                            flashSuccess(`Complaint case status updated to ${e.target.value}.`);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="broker_contacted">Broker Contacted</option>
                          <option value="broker_responded">Broker Responded</option>
                          <option value="evidence_review">Evidence Review</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{cmp.claimTitle}</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{cmp.claimDescription}</p>
                    </div>

                    {cmp.resolutionNotes && (
                      <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                          Resolution Outcome:
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">
                          {cmp.resolutionNotes} (Settled: {cmp.currency} {cmp.settledAmount || cmp.claimAmount})
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 10: Evidence Vault (Editable Ingestion & Verification)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "evidence" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Cryptographic Evidence Records ({brokerEvidence.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  SHA-256 hashed regulatory register captures, spread test telemetry, and trader account slips.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/evidence"
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  Full Evidence Library →
                </Link>

                <button
                  onClick={() => setShowAddEvidenceModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Ingest New Evidence</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brokerEvidence.map((ev) => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 11: SEO & Schema (Editable)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "seo" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="h-4 w-4 text-indigo-500" />
                  SEO Metadata &amp; Structured JSON-LD Schema
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Organic ranking titles, meta snippets, canonical endpoints, and Google SERP preview.
                </p>
              </div>

              <EditBar
                editing={editingSeo}
                onEdit={() => {
                  setDraftSeoTitle(broker.seoTitle);
                  setDraftSeoDesc(broker.seoDescription);
                  setDraftSchemaType(broker.schemaType || "FinancialService");
                  setDraftKeywords(
                    broker.targetKeywords?.join(", ") ||
                      `${broker.name} review, forex broker, verified spreads, safety`
                  );
                  setDraftPros(broker.pros.join("\n"));
                  setDraftCons(broker.cons.join("\n"));
                  setEditingSeo(true);
                }}
                onSave={saveSeo}
                onCancel={() => setEditingSeo(false)}
              />
            </div>

            {/* Google SERP Live Preview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Google SERP Live Preview</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                https://vtreview.com › brokers › {broker.slug}
              </div>
              <div className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                {editingSeo ? draftSeoTitle : broker.seoTitle}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {editingSeo ? draftSeoDesc : broker.seoDescription}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold pt-0.5">
                Rating: {broker.starRating.toFixed(1)}/5 • {broker.reviewCount} votes • Verified by VTReview
              </div>
            </div>

            <div className="space-y-4">
              <SpecField
                label={`SEO Page Title (${(editingSeo ? draftSeoTitle : broker.seoTitle).length}/60 chars)`}
                editMode={editingSeo}
                readValue={<span className="font-semibold">{broker.seoTitle}</span>}
              >
                <input
                  className={inputCls}
                  value={draftSeoTitle}
                  onChange={(e) => setDraftSeoTitle(e.target.value)}
                />
              </SpecField>

              <SpecField
                label={`SEO Meta Description (${(editingSeo ? draftSeoDesc : broker.seoDescription).length}/160 chars)`}
                editMode={editingSeo}
                readValue={broker.seoDescription}
              >
                <textarea
                  rows={2}
                  className={inputCls}
                  value={draftSeoDesc}
                  onChange={(e) => setDraftSeoDesc(e.target.value)}
                />
              </SpecField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SpecField
                  label="Schema.org Entity Type"
                  editMode={editingSeo}
                  readValue={broker.schemaType || "FinancialService"}
                >
                  <select
                    className={inputCls}
                    value={draftSchemaType}
                    onChange={(e) => setDraftSchemaType(e.target.value)}
                  >
                    <option value="FinancialService">FinancialService (Default)</option>
                    <option value="Corporation">Corporation</option>
                    <option value="BrokerageBusiness">BrokerageBusiness</option>
                  </select>
                </SpecField>

                <SpecField
                  label="Target Keywords (comma-separated)"
                  editMode={editingSeo}
                  readValue={
                    broker.targetKeywords?.join(", ") || `${broker.name} review, forex broker, spreads`
                  }
                >
                  <input
                    className={inputCls}
                    value={draftKeywords}
                    onChange={(e) => setDraftKeywords(e.target.value)}
                  />
                </SpecField>
              </div>

              {/* Editable Pros & Cons Textareas in SEO */}
              {editingSeo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <div className={labelCls}>Pros (one per line)</div>
                    <textarea
                      rows={5}
                      className={inputCls}
                      value={draftPros}
                      onChange={(e) => setDraftPros(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className={labelCls}>Cons (one per line)</div>
                    <textarea
                      rows={5}
                      className={inputCls}
                      value={draftCons}
                      onChange={(e) => setDraftCons(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 12: Audit Timeline (Editable: Append Audit Logs)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "audit_history" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-purple-500" />
                  Immutable Compliance Audit Log ({brokerAuditLogs.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Tamper-evident trail tracking every edit, verification, score adjustment, and dispute action.
                </p>
              </div>

              <button
                onClick={() => setShowAuditModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Log Compliance Audit Entry</span>
              </button>
            </div>

            <AuditTimeline entries={brokerAuditLogs} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS FOR NEW REVIEWS, COMPLAINTS, EVIDENCE, AUDIT ENTRIES
          ══════════════════════════════════════════════════════════════════════ */}

      {/* Modal 1: Record Review */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Record Verified Trader Review
              </h3>
              <button onClick={() => setShowAddReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className={labelCls}>Trader Name</div>
                <input
                  className={inputCls}
                  value={newRevUser}
                  onChange={(e) => setNewRevUser(e.target.value)}
                  placeholder="e.g. Marcus Thorne"
                />
              </div>

              <div>
                <div className={labelCls}>Rating (1 - 5)</div>
                <select
                  className={inputCls}
                  value={newRevRating}
                  onChange={(e) => setNewRevRating(Number(e.target.value))}
                >
                  <option value={5}>5 ★★★★★ (Exceptional)</option>
                  <option value={4}>4 ★★★★☆ (Good)</option>
                  <option value={3}>3 ★★★☆☆ (Average)</option>
                  <option value={2}>2 ★★☆☆☆ (Below Average)</option>
                  <option value={1}>1 ★☆☆☆☆ (Poor)</option>
                </select>
              </div>

              <div>
                <div className={labelCls}>Review Title</div>
                <input
                  className={inputCls}
                  value={newRevTitle}
                  onChange={(e) => setNewRevTitle(e.target.value)}
                  placeholder="e.g. Excellent raw spread execution on major pairs"
                />
              </div>

              <div>
                <div className={labelCls}>Review Body</div>
                <textarea
                  rows={3}
                  className={inputCls}
                  value={newRevContent}
                  onChange={(e) => setNewRevContent(e.target.value)}
                  placeholder="Provide detailed trader experience notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newRevUser.trim() || !newRevTitle.trim()) return;
                  addReview({
                    brokerId: broker.id,
                    brokerName: broker.name,
                    userId: `usr-${Date.now().toString().slice(-4)}`,
                    userName: newRevUser,
                    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                    userEmail: `${newRevUser.toLowerCase().replace(/\s+/g, ".")}@trader.io`,
                    isVerifiedTrader: true,
                    rating: newRevRating,
                    title: newRevTitle,
                    content: newRevContent,
                    status: "approved",
                    riskFlag: "none",
                    evidenceAttached: false,
                    evidenceIds: [],
                  });
                  setShowAddReviewModal(false);
                  flashSuccess("Verified trader review recorded and approved.");
                }}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Log Dispute */}
      {showAddComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Log Dispute / Complaint</h3>
              <button onClick={() => setShowAddComplaintModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className={labelCls}>Trader Name</div>
                  <input
                    className={inputCls}
                    value={newCmpUser}
                    onChange={(e) => setNewCmpUser(e.target.value)}
                    placeholder="Trader Name"
                  />
                </div>
                <div>
                  <div className={labelCls}>Trader Email</div>
                  <input
                    className={inputCls}
                    value={newCmpEmail}
                    onChange={(e) => setNewCmpEmail(e.target.value)}
                    placeholder="trader@mail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className={labelCls}>Claim Amount ($)</div>
                  <input
                    type="number"
                    className={inputCls}
                    value={newCmpAmount}
                    onChange={(e) => setNewCmpAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <div className={labelCls}>Category</div>
                  <select
                    className={inputCls}
                    value={newCmpCategory}
                    onChange={(e) => setNewCmpCategory(e.target.value as ComplaintAdmin["category"])}
                  >
                    <option value="delayed_withdrawal">Delayed Withdrawal</option>
                    <option value="excessive_slippage">Excessive Slippage</option>
                    <option value="unauthorized_trade">Unauthorized Trade</option>
                    <option value="account_freeze">Account Freeze</option>
                    <option value="misleading_bonus">Misleading Bonus</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <div className={labelCls}>Dispute Title</div>
                <input
                  className={inputCls}
                  value={newCmpTitle}
                  onChange={(e) => setNewCmpTitle(e.target.value)}
                  placeholder="e.g. $1,200 wire withdrawal delay exceeding 14 days"
                />
              </div>

              <div>
                <div className={labelCls}>Dispute Details</div>
                <textarea
                  rows={3}
                  className={inputCls}
                  value={newCmpDesc}
                  onChange={(e) => setNewCmpDesc(e.target.value)}
                  placeholder="Document the trader's statement and chronology..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowAddComplaintModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newCmpTitle.trim() || !newCmpUser.trim()) return;
                  addComplaint({
                    brokerId: broker.id,
                    brokerName: broker.name,
                    userId: `usr-${Date.now().toString().slice(-4)}`,
                    userName: newCmpUser,
                    userEmail: newCmpEmail || "trader@broker-dispute.io",
                    isVerifiedTrader: true,
                    claimTitle: newCmpTitle,
                    claimDescription: newCmpDesc,
                    claimAmount: newCmpAmount,
                    currency: "USD",
                    category: newCmpCategory,
                    status: "under_review",
                    evidenceIds: [],
                  });
                  setShowAddComplaintModal(false);
                  flashSuccess("Dispute case logged and dispatched to compliance.");
                }}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold"
              >
                Log Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Ingest Evidence */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ingest Audit Evidence for {broker.name}
              </h3>
              <button onClick={() => setShowAddEvidenceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className={labelCls}>Evidence Title</div>
                <input
                  className={inputCls}
                  value={newEvTitle}
                  onChange={(e) => setNewEvTitle(e.target.value)}
                  placeholder="e.g. ASIC Official Register Certificate Snapshot"
                />
              </div>

              <div>
                <div className={labelCls}>Evidence Category</div>
                <select
                  className={inputCls}
                  value={newEvType}
                  onChange={(e) =>
                    setNewEvType(
                      e.target.value as
                        | "regulatory_register"
                        | "spread_test"
                        | "broker_legal_doc"
                        | "screenshot"
                        | "trading_statement"
                    )
                  }
                >
                  <option value="regulatory_register">Official Regulatory Register Screenshot</option>
                  <option value="spread_test">Live Tick Telemetry / Spread Log</option>
                  <option value="broker_legal_doc">Broker PDS / Legal Client Terms</option>
                  <option value="screenshot">Deposit / Withdrawal Proof Slip</option>
                  <option value="trading_statement">MT4/MT5 Verified Statement</option>
                </select>
              </div>

              <div>
                <div className={labelCls}>Source Verification URL</div>
                <input
                  type="url"
                  className={inputCls}
                  value={newEvUrl}
                  onChange={(e) => setNewEvUrl(e.target.value)}
                  placeholder="https://connectonline.asic.gov.au"
                />
              </div>

              <div>
                <div className={labelCls}>Auditor Notes</div>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={newEvNotes}
                  onChange={(e) => setNewEvNotes(e.target.value)}
                  placeholder="Notes verifying the authenticity of this file..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowAddEvidenceModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newEvTitle.trim()) return;
                  addEvidence({
                    title: newEvTitle,
                    type: newEvType,
                    relatedEntityType: "broker",
                    relatedEntityId: broker.id,
                    relatedEntityName: broker.name,
                    fileFormat: "PDF / PNG",
                    fileSizeBytes: 1048576,
                    status: "verified",
                    sourceUrl: newEvUrl,
                    notes: newEvNotes || "Verified by administrative auditor.",
                  });
                  setShowAddEvidenceModal(false);
                  flashSuccess("Evidence record sealed with SHA-256 hash.");
                }}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold"
              >
                Seal &amp; Ingest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Log Audit Entry */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Append Certified Compliance Audit Entry
              </h3>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className={labelCls}>Action Type</div>
                <select
                  className={inputCls}
                  value={newAuditAction}
                  onChange={(e) =>
                    setNewAuditAction(
                      e.target.value as "VERIFY" | "UPDATE" | "APPROVE" | "SCORE_CHANGE" | "PUBLISH"
                    )
                  }
                >
                  <option value="VERIFY">VERIFY (Official Re-audit Passed)</option>
                  <option value="UPDATE">UPDATE (Specification Modified)</option>
                  <option value="APPROVE">APPROVE (Compliance Sign-off)</option>
                  <option value="SCORE_CHANGE">SCORE_CHANGE (Pillar Adjustments)</option>
                  <option value="PUBLISH">PUBLISH (Public Sync)</option>
                </select>
              </div>

              <div>
                <div className={labelCls}>Audit Summary</div>
                <input
                  className={inputCls}
                  value={newAuditSummary}
                  onChange={(e) => setNewAuditSummary(e.target.value)}
                  placeholder="e.g. Conducted periodic ASIC register and segregated account audit."
                />
              </div>

              <div>
                <div className={labelCls}>Regulatory Reason / Basis</div>
                <textarea
                  rows={3}
                  className={inputCls}
                  value={newAuditReason}
                  onChange={(e) => setNewAuditReason(e.target.value)}
                  placeholder="Statutory compliance review notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newAuditSummary.trim()) return;
                  addAuditLogEntry({
                    action: newAuditAction,
                    entityType: "broker",
                    entityId: broker.id,
                    entityName: broker.name,
                    summary: newAuditSummary,
                    reason: newAuditReason || "Manual compliance governance entry.",
                  });
                  setShowAuditModal(false);
                  flashSuccess("Audit log record appended to immutable timeline.");
                }}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold"
              >
                Append Audit Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
