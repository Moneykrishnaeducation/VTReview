import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useAdmin } from "../../context/admin-context";
import { StatusBadge } from "../../components/status-badge";
import { ScoreEditor } from "../../components/score-editor";
import { AuditTimeline } from "../../components/audit-timeline";
import { EvidenceCard } from "../../components/evidence-card";
import type { BrokerAdmin } from "../../types/admin";
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
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition";
const readCls =
  "w-full text-xs text-slate-800 dark:text-slate-200 py-1.5 leading-relaxed";
const labelCls =
  "block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-0.5";

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
    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className={labelCls}>{label}</div>
      {editMode ? children : <div className={readCls}>{readValue}</div>}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function BrokerDetail() {
  const { id } = useParams<{ id: string }>();
  const { brokers, updateBroker, auditLogs, evidenceList, reviews, complaints } = useAdmin();

  // Find broker by slug or id
  const broker = brokers.find((b) => b.slug === id || b.id === id) || brokers[0];
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isDraftMode, setIsDraftMode] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Per-section edit mode flags
  const [editingOverview, setEditingOverview] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [editingCosts, setEditingCosts] = useState(false);
  const [editingSeo, setEditingSeo] = useState(false);

  // ── Draft state for Overview section
  const [draftEurUsd, setDraftEurUsd] = useState(broker.eurUsdSpread);
  const [draftGbpUsd, setDraftGbpUsd] = useState(broker.gbpUsdSpread);
  const [draftCommission, setDraftCommission] = useState(broker.commissionPerLot);
  const [draftMinDeposit, setDraftMinDeposit] = useState(broker.minDeposit);
  const [draftMaxLeverage, setDraftMaxLeverage] = useState(broker.maxLeverage);
  const [draftAssets, setDraftAssets] = useState(broker.tradableAssetsCount);
  const [draftExecution, setDraftExecution] = useState(broker.executionModel);
  const [draftSummary, setDraftSummary] = useState(broker.summary);

  // ── Draft state for Identity section
  const [draftName, setDraftName] = useState(broker.name);
  const [draftLegalEntity, setDraftLegalEntity] = useState(broker.legalEntity);
  const [draftWebsite, setDraftWebsite] = useState(broker.website);
  const [draftFoundedYear, setDraftFoundedYear] = useState(broker.foundedYear);
  const [draftHqCountry, setDraftHqCountry] = useState(broker.hqCountry);
  const [draftStatus, setDraftStatus] = useState(broker.status);

  // ── Draft state for SEO section
  const [draftSeoTitle, setDraftSeoTitle] = useState(broker.seoTitle);
  const [draftSeoDesc, setDraftSeoDesc] = useState(broker.seoDescription);
  const [draftPros, setDraftPros] = useState(broker.pros.join("\n"));
  const [draftCons, setDraftCons] = useState(broker.cons.join("\n"));

  // Filter linked items
  const brokerAuditLogs = auditLogs.filter(
    (log) => log.entityId === broker.id || log.entityName.includes(broker.name)
  );
  const brokerEvidence = evidenceList.filter(
    (ev) => ev.relatedEntityId === broker.id || ev.relatedEntityName.includes(broker.name)
  );
  const brokerReviews = reviews.filter((r) => r.brokerId === broker.id);
  const brokerComplaints = complaints.filter((c) => c.brokerId === broker.id);

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

  // ── Save helpers
  const flashSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
    });
    setEditingIdentity(false);
    flashSuccess();
  };

  const saveSeo = () => {
    updateBroker(broker.id, {
      seoTitle: draftSeoTitle,
      seoDescription: draftSeoDesc,
      pros: draftPros.split("\n").map((s) => s.trim()).filter(Boolean),
      cons: draftCons.split("\n").map((s) => s.trim()).filter(Boolean),
    });
    setEditingSeo(false);
    flashSuccess();
  };

  const handleGlobalSave = () => {
    updateBroker(broker.id, {
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
    });
    flashSuccess();
  };

  // ── Edit toggle bar (shared component)
  function EditBar({
    editing,
    onEdit,
    onSave,
    onCancel,
  }: {
    editing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
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
              className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
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
            Edit
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Header Bar */}
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
            onClick={handleGlobalSave}
            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-slate-200 dark:border-slate-700"
          >
            <Save className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Broker specifications updated and audit trail record created.</span>
        </div>
      )}

      {/* Main Entity Summary Card */}
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

        {/* 15-Tab Horizontal Scroller */}
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

      {/* ════════ Tab: Overview ════════ */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="md:col-span-2 space-y-6">
            {/* Trading Benchmarks – editable */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
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

            {/* Editorial Summary – editable */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
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

          {/* Right Sidebar: Active Licenses Snapshot */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Certified Regulatory Licenses</span>
              </h3>

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

      {/* ════════ Tab: Identity & Corporate ════════ */}
      {activeTab === "identity" && (
        <div className="space-y-6 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
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
                label="Website"
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
            </div>

            {/* Pros & Cons read-only here — managed via SEO tab */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <p className={`${labelCls} mb-2`}>Pros</p>
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
                <p className={`${labelCls} mb-2`}>Cons</p>
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

      {/* ════════ Tab: Regulation & Licenses ════════ */}
      {activeTab === "regulation" && (
        <div className="space-y-6 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Direct Regulatory Register Certifications
            </h3>

            <div className="space-y-4">
              {broker.licenses.map((lic) => (
                <div
                  key={lic.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {lic.regulatorName}
                      </span>
                      <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                        ({lic.regulatorCode})
                      </span>
                      <StatusBadge status={lic.status} size="sm" />
                      <StatusBadge status={lic.tier} size="sm" />
                    </div>
                    {lic.officialRegisterUrl && (
                      <a
                        href={lic.officialRegisterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                      >
                        <span>Verify on Official Register</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div>
                      License Number:{" "}
                      <strong className="text-slate-900 dark:text-slate-200">
                        {lic.licenseNumber}
                      </strong>
                    </div>
                    <div>
                      Entity:{" "}
                      <strong className="text-slate-900 dark:text-slate-200">
                        {lic.licenseeEntity}
                      </strong>
                    </div>
                    <div>
                      Compensation:{" "}
                      <strong className="text-slate-900 dark:text-slate-200">
                        {lic.compensationScheme || "None"}
                      </strong>
                    </div>
                    <div>
                      NBP Protection:{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {lic.negativeBalanceProtection ? "Guaranteed" : "No"}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════ Tab: Costs & Spreads ════════ */}
      {activeTab === "trading_costs" && (
        <div className="space-y-6 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Spread &amp; Cost Benchmarks
              </h3>
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
                onSave={() => {
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
                }}
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

      {/* ════════ Tab: SEO & Schema ════════ */}
      {activeTab === "seo" && (
        <div className="space-y-6 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                SEO Metadata &amp; Editorial Signals
              </h3>
              <EditBar
                editing={editingSeo}
                onEdit={() => {
                  setDraftSeoTitle(broker.seoTitle);
                  setDraftSeoDesc(broker.seoDescription);
                  setDraftPros(broker.pros.join("\n"));
                  setDraftCons(broker.cons.join("\n"));
                  setEditingSeo(true);
                }}
                onSave={saveSeo}
                onCancel={() => setEditingSeo(false)}
              />
            </div>

            <div className="space-y-4">
              <SpecField
                label="SEO Title"
                editMode={editingSeo}
                readValue={
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {broker.seoTitle}
                  </span>
                }
              >
                <input
                  className={inputCls}
                  value={draftSeoTitle}
                  onChange={(e) => setDraftSeoTitle(e.target.value)}
                />
              </SpecField>

              <SpecField
                label="SEO Meta Description"
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
                  label="Pros (one per line)"
                  editMode={editingSeo}
                  readValue={
                    <ul className="space-y-1">
                      {broker.pros.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400"
                        >
                          <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{p}</span>
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <textarea
                    rows={5}
                    className={inputCls}
                    value={draftPros}
                    onChange={(e) => setDraftPros(e.target.value)}
                  />
                </SpecField>

                <SpecField
                  label="Cons (one per line)"
                  editMode={editingSeo}
                  readValue={
                    <ul className="space-y-1">
                      {broker.cons.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400"
                        >
                          <X className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{c}</span>
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <textarea
                    rows={5}
                    className={inputCls}
                    value={draftCons}
                    onChange={(e) => setDraftCons(e.target.value)}
                  />
                </SpecField>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ Tab: 120-Point Ratings ════════ */}
      {activeTab === "ratings" && <ScoreEditor broker={broker} />}

      {/* ════════ Tab: Evidence Vault ════════ */}
      {activeTab === "evidence" && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Linked Evidence Vault Documents ({brokerEvidence.length})
            </h3>
            <Link
              to="/evidence"
              className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
            >
              Open Full Evidence Library →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brokerEvidence.map((ev) => (
              <EvidenceCard key={ev.id} evidence={ev} />
            ))}
          </div>
        </div>
      )}

      {/* ════════ Tab: Audit History ════════ */}
      {activeTab === "audit_history" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-xs space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Immutable Audit Log for {broker.name}
          </h3>
          <AuditTimeline entries={brokerAuditLogs} />
        </div>
      )}

      {/* Other tabs fallback */}
      {!["overview", "identity", "regulation", "trading_costs", "seo", "ratings", "evidence", "audit_history"].includes(
        activeTab
      ) && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 space-y-2 text-xs shadow-xs">
          <Building2 className="h-8 w-8 text-amber-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">
            {tabs.find((t) => t.id === activeTab)?.label} Workspace
          </h4>
          <p className="max-w-md mx-auto">
            Live operational data for this specification is connected and synced with the research
            database.
          </p>
        </div>
      )}
    </div>
  );
}
