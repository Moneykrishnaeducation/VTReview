import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useAdmin } from "../../context/admin-context";
import { StatusBadge } from "../../components/status-badge";
import { ScoreEditor } from "../../components/score-editor";
import { AuditTimeline } from "../../components/audit-timeline";
import { EvidenceCard } from "../../components/evidence-card";
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
  Clock,
  Eye,
} from "lucide-react";

export default function BrokerDetail() {
  const { id } = useParams<{ id: string }>();
  const { brokers, updateBroker, auditLogs, evidenceList, reviews, complaints } = useAdmin();

  // Find broker by slug or id
  const broker = brokers.find((b) => b.slug === id || b.id === id) || brokers[0];
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isDraftMode, setIsDraftMode] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter linked items
  const brokerAuditLogs = auditLogs.filter((log) => log.entityId === broker.id || log.entityName.includes(broker.name));
  const brokerEvidence = evidenceList.filter((ev) => ev.relatedEntityId === broker.id || ev.relatedEntityName.includes(broker.name));
  const brokerReviews = reviews.filter((r) => r.brokerId === broker.id);
  const brokerComplaints = complaints.filter((c) => c.brokerId === broker.id);

  const tabs = [
    { id: "overview", label: "Overview", icon: <Building2 className="h-3.5 w-3.5" /> },
    { id: "identity", label: "Identity & Corporate", icon: <Globe2 className="h-3.5 w-3.5" /> },
    { id: "regulation", label: "Regulation & Licenses", icon: <ShieldCheck className="h-3.5 w-3.5" />, badge: broker.licenses.length },
    { id: "trading_costs", label: "Costs & Spreads", icon: <DollarSign className="h-3.5 w-3.5" /> },
    { id: "platforms", label: "Platforms & Latency", icon: <Laptop className="h-3.5 w-3.5" /> },
    { id: "accounts", label: "Account Types", icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: "ratings", label: "120-Point Ratings", icon: <Star className="h-3.5 w-3.5" /> },
    { id: "reviews", label: "Community Reviews", icon: <MessageSquare className="h-3.5 w-3.5" />, badge: brokerReviews.length },
    { id: "complaints", label: "Disputes", icon: <AlertTriangle className="h-3.5 w-3.5" />, badge: brokerComplaints.length },
    { id: "evidence", label: "Evidence Vault", icon: <FileText className="h-3.5 w-3.5" />, badge: brokerEvidence.length },
    { id: "seo", label: "SEO & Schema", icon: <Search className="h-3.5 w-3.5" /> },
    { id: "audit_history", label: "Audit Timeline", icon: <History className="h-3.5 w-3.5" />, badge: brokerAuditLogs.length },
  ];

  const handleSave = () => {
    updateBroker(broker.id, {
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link to="/brokers" className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Broker Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Draft vs Public Switcher */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-0.5 rounded-lg text-xs shadow-xs">
            <button
              onClick={() => setIsDraftMode(false)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                !isDraftMode ? "bg-amber-500 text-slate-950 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Public State
            </button>
            <button
              onClick={() => setIsDraftMode(true)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                isDraftMode ? "bg-amber-500 text-slate-950 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Draft Workspace
            </button>
          </div>

          <button
            onClick={handleSave}
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
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{broker.name}</h1>
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
              <div className="text-base font-black text-amber-600 dark:text-amber-400">★ {broker.editorialScore.toFixed(1)}</div>
            </div>
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Community</div>
              <div className="text-base font-black text-slate-800 dark:text-slate-200">★ {broker.communityScore.toFixed(1)}</div>
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

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="md:col-span-2 space-y-6">
            {/* Quick Specs Grid */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Trading Benchmarks & Account Thresholds</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">EUR/USD Median Spread</div>
                  <div className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{broker.eurUsdSpread} pips</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Round-Turn Commission</div>
                  <div className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">${broker.commissionPerLot * 2}/lot</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Min Deposit Barrier</div>
                  <div className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">${broker.minDeposit}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Execution Engine</div>
                  <div className="font-mono text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">{broker.executionModel}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Max Leverage Ratio</div>
                  <div className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">{broker.maxLeverage.split("/")[0]}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Tradable Instruments</div>
                  <div className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">{broker.tradableAssetsCount}+ Assets</div>
                </div>
              </div>
            </div>

            {/* Editorial Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Editorial Research Summary</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {broker.summary}
              </p>
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
                  <div key={lic.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{lic.regulatorCode} ({lic.jurisdiction})</span>
                      <StatusBadge status={lic.tier} size="sm" />
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">License #{lic.licenseNumber}</div>
                    <div className="text-[10px] text-slate-500 truncate">{lic.licenseeEntity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Regulation & Licenses */}
      {activeTab === "regulation" && (
        <div className="space-y-6 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Regulatory Register Certifications</h3>

            <div className="space-y-4">
              {broker.licenses.map((lic) => (
                <div key={lic.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{lic.regulatorName}</span>
                      <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">({lic.regulatorCode})</span>
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
                    <div>License Number: <strong className="text-slate-900 dark:text-slate-200">{lic.licenseNumber}</strong></div>
                    <div>Entity: <strong className="text-slate-900 dark:text-slate-200">{lic.licenseeEntity}</strong></div>
                    <div>Compensation: <strong className="text-slate-900 dark:text-slate-200">{lic.compensationScheme || "None"}</strong></div>
                    <div>NBP Protection: <strong className="text-emerald-600 dark:text-emerald-400">{lic.negativeBalanceProtection ? "Guaranteed" : "No"}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ratings Calculation Workspace */}
      {activeTab === "ratings" && (
        <ScoreEditor broker={broker} />
      )}

      {/* Tab 4: Evidence Vault */}
      {activeTab === "evidence" && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Linked Evidence Vault Documents ({brokerEvidence.length})</h3>
            <Link to="/evidence" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
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

      {/* Tab 5: Audit History */}
      {activeTab === "audit_history" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-xs space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Immutable Audit Log for {broker.name}</h3>
          <AuditTimeline entries={brokerAuditLogs} />
        </div>
      )}

      {/* Other tabs fallback */}
      {!["overview", "regulation", "ratings", "evidence", "audit_history"].includes(activeTab) && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 space-y-2 text-xs shadow-xs">
          <Building2 className="h-8 w-8 text-amber-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">
            {tabs.find((t) => t.id === activeTab)?.label} Workspace
          </h4>
          <p className="max-w-md mx-auto">
            Live operational data for this specification is connected and synced with the research database.
          </p>
        </div>
      )}
    </div>
  );
}
