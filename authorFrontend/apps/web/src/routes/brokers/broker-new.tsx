import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAdmin } from "../../context/admin-context";
import { StatusBadge } from "../../components/status-badge";
import { BrokerLogo } from "../../components/broker-logo";
import { LogoUpload } from "../../components/logo-upload";
import type { BrokerAdmin, BrokerLicenseAdmin } from "../../types/admin";
import {
  Building2,
  ShieldCheck,
  Star,
  FileText,
  DollarSign,
  Laptop,
  Globe2,
  Search,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

// ─── Shared style tokens (identical to broker-detail.tsx) ─────────────────────
const inputCls =
  "w-full bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition";
const labelCls =
  "block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-0.5";
const cardCls =
  "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs";

// ─── Field cell — identical to SpecField in broker-detail (always in edit mode) ─
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
      <div className={labelCls}>
        {label}
        {required && <span className="text-amber-500 ml-0.5">*</span>}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-rose-500 dark:text-rose-400 text-[10px] font-medium pt-0.5">
          <AlertCircle className="h-2.5 w-2.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── blank license factory ────────────────────────────────────────────────────
function blankLicense(): BrokerLicenseAdmin {
  return {
    id: `lic-new-${Math.random().toString(36).substring(2, 8)}`,
    regulatorCode: "",
    regulatorName: "",
    jurisdiction: "",
    tier: "Tier-1",
    licenseNumber: "",
    licenseeEntity: "",
    status: "pending",
    officialRegisterUrl: "",
    compensationScheme: "",
    maxLeverage: "1:30",
    negativeBalanceProtection: true,
    segregatedAccounts: true,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BrokerNew() {
  const { addBroker } = useAdmin();
  const navigate = useNavigate();

  // ── Active tab
  const [activeTab, setActiveTab] = useState("identity");

  // ── Identity
  const [name, setName] = useState("");
  const [legalEntity, setLegalEntity] = useState("");
  const [logo, setLogo] = useState("");
  const [logoAbbr, setLogoAbbr] = useState("");
  const [website, setWebsite] = useState("");
  const [foundedYear, setFoundedYear] = useState<number>(2010);
  const [hqCountry, setHqCountry] = useState("");
  const [status, setStatus] = useState<BrokerAdmin["status"]>("draft");

  // ── Regulation
  const [primaryRegulator, setPrimaryRegulator] = useState("");
  const [tier, setTier] = useState<BrokerAdmin["tier"]>("Tier-1");
  const [licenses, setLicenses] = useState<BrokerLicenseAdmin[]>([blankLicense()]);

  // ── Costs & Spreads
  const [eurUsdSpread, setEurUsdSpread] = useState<number>(0);
  const [gbpUsdSpread, setGbpUsdSpread] = useState<number>(0);
  const [commissionPerLot, setCommissionPerLot] = useState<number>(0);
  const [allInCostEurUsd, setAllInCostEurUsd] = useState<number>(0);
  const [minDeposit, setMinDeposit] = useState<number>(0);
  const [maxLeverage, setMaxLeverage] = useState("1:500");
  const [executionModel, setExecutionModel] =
    useState<BrokerAdmin["executionModel"]>("ECN/STP");
  const [tradableAssetsCount, setTradableAssetsCount] = useState<number>(0);

  // ── Platforms & Deposits
  const [platforms, setPlatforms] = useState("");
  const [depositMethods, setDepositMethods] = useState("");

  // ── Ratings
  const [editorialScore, setEditorialScore] = useState<number>(0);
  const [starRating, setStarRating] = useState<number>(0);
  const [communityScore, setCommunityScore] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [complaintCount, setComplaintCount] = useState<number>(0);

  // ── SEO & Editorial
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [summary, setSummary] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // ── UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // ── Derived live-preview values
  const displayLogo =
    logo.trim() || logoAbbr.trim() || (name.trim() ? name.trim().slice(0, 2).toUpperCase() : "??");

  // ── License helpers
  const updateLicense = (idx: number, key: keyof BrokerLicenseAdmin, value: unknown) =>
    setLicenses((prev) => prev.map((l, i) => (i === idx ? { ...l, [key]: value } : l)));
  const addLicense = () => setLicenses((prev) => [...prev, blankLicense()]);
  const removeLicense = (idx: number) =>
    setLicenses((prev) => prev.filter((_, i) => i !== idx));

  // ── Tabs (same icon + label pattern as broker-detail)
  const tabs = [
    { id: "identity", label: "Identity & Corporate", icon: <Globe2 className="h-3.5 w-3.5" /> },
    {
      id: "regulation",
      label: "Regulation & Licenses",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      badge: licenses.length,
    },
    { id: "trading_costs", label: "Costs & Spreads", icon: <DollarSign className="h-3.5 w-3.5" /> },
    { id: "platforms", label: "Platforms & Deposits", icon: <Laptop className="h-3.5 w-3.5" /> },
    { id: "ratings", label: "Ratings", icon: <Star className="h-3.5 w-3.5" /> },
    { id: "seo", label: "SEO & Editorial", icon: <Search className="h-3.5 w-3.5" /> },
  ];

  // ── Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Broker name is required";
    if (!legalEntity.trim()) errs.legalEntity = "Legal entity is required";
    if (!primaryRegulator.trim()) errs.primaryRegulator = "Primary regulator is required";
    if (!summary.trim()) errs.summary = "Editorial summary is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Jump to the tab that has the first error
      if (errs.name || errs.legalEntity) setActiveTab("identity");
      else if (errs.primaryRegulator) setActiveTab("regulation");
      else if (errs.summary) setActiveTab("seo");
    }
    return Object.keys(errs).length === 0;
  };

  // ── Submit
  const handleCreate = () => {
    if (!validate()) return;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    addBroker({
      slug,
      name: name.trim(),
      legalEntity: legalEntity.trim(),
      logo: displayLogo,
      website: website.trim(),
      foundedYear,
      hqCountry: hqCountry.trim(),
      status,
      verificationStatus: "pending",
      publishingStatus: "draft",
      lastVerifiedDate: "",
      verifiedBy: "",
      primaryRegulator: primaryRegulator.trim(),
      tier,
      licenses,
      editorialScore,
      starRating,
      communityScore,
      reviewCount,
      complaintCount,
      pillars: [],
      eurUsdSpread,
      gbpUsdSpread,
      commissionPerLot,
      allInCostEurUsd,
      minDeposit,
      maxLeverage: maxLeverage.trim(),
      executionModel,
      platforms: platforms.split(",").map((s) => s.trim()).filter(Boolean),
      depositMethods: depositMethods.split(",").map((s) => s.trim()).filter(Boolean),
      tradableAssetsCount,
      pros: pros.split("\n").map((s) => s.trim()).filter(Boolean),
      cons: cons.split("\n").map((s) => s.trim()).filter(Boolean),
      summary: summary.trim(),
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      draftChangesCount: 0,
    });

    setSuccess(true);
    setTimeout(() => navigate(`/brokers/${slug}`), 1200);
  };

  return (
    <div className="space-y-6">

      {/* ── Top Breadcrumb Header Bar (identical structure to broker-detail) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/brokers"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Broker Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mode badge — mirrors the Draft/Public switcher slot */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-0.5 rounded-lg text-xs shadow-xs">
            <span className="px-3 py-1 rounded-md font-semibold bg-amber-500 text-slate-950 shadow-xs">
              New Record
            </span>
            <span className="px-3 py-1 font-semibold text-slate-500 dark:text-slate-400">
              Draft Workspace
            </span>
          </div>

          {/* Primary action — mirrors "Save Changes" button */}
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Create Broker Record</span>
          </button>
        </div>
      </div>

      {/* ── Success toast ── */}
      {success && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Broker record created successfully. Redirecting to profile…</span>
        </div>
      )}

      {/* ── Validation banner ── */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Please fix the following before creating:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {Object.values(errors).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Main Entity Preview Card + Tab Bar
          — identical layout to broker-detail's "Main Entity Summary Card"
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-xs shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">

          {/* Logo + Name + Badges */}
          <div className="flex items-center gap-4">
            {/* Logo box */}
            <BrokerLogo
              logo={displayLogo}
              name={name}
              size="lg"
              className="h-14 w-14 rounded-2xl shrink-0 shadow-md select-none"
            />

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                {/* Live-preview name — updates as user types */}
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  {name.trim() || <span className="text-slate-400 dark:text-slate-600 italic font-medium text-base">Broker name will appear here…</span>}
                </h1>
                <StatusBadge status={tier} size="md" />
                <StatusBadge status="pending" size="md" />
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {legalEntity.trim() || <span className="italic text-slate-400 dark:text-slate-600">Legal entity</span>}
                {foundedYear ? ` • Founded ${foundedYear}` : ""}
                {hqCountry.trim() ? ` (${hqCountry.trim()})` : ""}
              </div>
            </div>
          </div>

          {/* Score preview — identical to broker-detail's score panel */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <div className="text-center px-2 border-r border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Editorial</div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400">
                ★ {editorialScore.toFixed(1)}
              </div>
            </div>
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Community</div>
              <div className="text-base font-black text-slate-800 dark:text-slate-200">
                ★ {communityScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar — polished with no-scrollbar and matching badge & active tab styling ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-200 dark:border-slate-800 pt-3 pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const hasError =
              (tab.id === "identity" && (errors.name || errors.legalEntity)) ||
              (tab.id === "regulation" && errors.primaryRegulator) ||
              (tab.id === "seo" && errors.summary);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                    : hasError
                    ? "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {hasError && <AlertCircle className={`h-3 w-3 ${isActive ? "text-slate-950" : "text-rose-500"}`} />}
                {tab.badge !== undefined && !hasError && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
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
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Tab: Identity & Corporate
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "identity" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-amber-500" />
                Corporate Identity Record
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                <Building2 className="h-2.5 w-2.5" />
                NEW RECORD
              </span>
            </div>

            {/* Logo Asset Upload Section */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <ImageIcon className="h-4 w-4 text-amber-500" />
                    Broker Brand Logo
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload an official brand icon (PNG, JPG, SVG, WebP) or enter an image web URL.
                  </p>
                </div>
                <div className="w-full sm:w-48">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-0.5">
                    Fallback Abbreviation
                  </label>
                  <input
                    className={inputCls}
                    value={logoAbbr}
                    maxLength={4}
                    onChange={(e) => setLogoAbbr(e.target.value.toUpperCase())}
                    placeholder="e.g. PP (auto if blank)"
                  />
                </div>
              </div>

              <LogoUpload
                value={logo}
                onChange={setLogo}
                brokerName={name}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Broker Name" required error={errors.name}>
                <input
                  className={inputCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pepperstone"
                />
              </Field>

              <Field label="Legal Entity" required error={errors.legalEntity}>
                <input
                  className={inputCls}
                  value={legalEntity}
                  onChange={(e) => setLegalEntity(e.target.value)}
                  placeholder="e.g. Pepperstone Group Limited"
                />
              </Field>

              <Field label="Website URL">
                <input
                  type="url"
                  className={inputCls}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://pepperstone.com"
                />
              </Field>

              <Field label="Founded Year">
                <input
                  type="number"
                  min={1900}
                  max={2030}
                  className={inputCls}
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(Number(e.target.value))}
                />
              </Field>

              <Field label="HQ Country">
                <input
                  className={inputCls}
                  value={hqCountry}
                  onChange={(e) => setHqCountry(e.target.value)}
                  placeholder="e.g. Australia"
                />
              </Field>

              <Field label="Record Status">
                <select
                  className={inputCls}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BrokerAdmin["status"])}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Tab: Regulation & Licenses
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "regulation" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Regulation &amp; Tier
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Primary Regulator(s)" required error={errors.primaryRegulator}>
                <input
                  className={inputCls}
                  value={primaryRegulator}
                  onChange={(e) => setPrimaryRegulator(e.target.value)}
                  placeholder="e.g. ASIC / FCA / CySEC"
                />
              </Field>

              <Field label="Regulation Tier">
                <select
                  className={inputCls}
                  value={tier}
                  onChange={(e) => setTier(e.target.value as BrokerAdmin["tier"])}
                >
                  <option value="Tier-1">Tier-1 (FCA / ASIC / BaFin)</option>
                  <option value="Tier-2">Tier-2 (CySEC / FSCA)</option>
                  <option value="Tier-3">Tier-3 (Offshore)</option>
                  <option value="Unregulated">Unregulated</option>
                </select>
              </Field>
            </div>
          </div>

          {/* License rows — same card pattern as broker-detail regulation tab */}
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Regulatory Licenses
                <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {licenses.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={addLicense}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Add License
              </button>
            </div>

            <div className="space-y-4">
              {licenses.map((lic, idx) => (
                <div
                  key={lic.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  {/* License header — mirrors broker-detail regulation tab row header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {lic.regulatorName || <span className="text-slate-400 italic font-normal">Regulator name</span>}
                      </span>
                      {lic.regulatorCode && (
                        <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                          ({lic.regulatorCode})
                        </span>
                      )}
                      <StatusBadge status={lic.status} size="sm" />
                      <StatusBadge status={lic.tier} size="sm" />
                    </div>
                    {licenses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLicense(idx)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Field grid — mirrors the grid in broker-detail regulation tab */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <Field label="Regulator Code">
                      <input
                        className={inputCls}
                        value={lic.regulatorCode}
                        onChange={(e) => updateLicense(idx, "regulatorCode", e.target.value)}
                        placeholder="e.g. ASIC"
                      />
                    </Field>
                    <Field label="Regulator Full Name">
                      <input
                        className={inputCls}
                        value={lic.regulatorName}
                        onChange={(e) => updateLicense(idx, "regulatorName", e.target.value)}
                        placeholder="Australian Securities and Investments Commission"
                      />
                    </Field>
                    <Field label="Jurisdiction">
                      <input
                        className={inputCls}
                        value={lic.jurisdiction}
                        onChange={(e) => updateLicense(idx, "jurisdiction", e.target.value)}
                        placeholder="e.g. Australia"
                      />
                    </Field>
                    <Field label="License Number">
                      <input
                        className={inputCls}
                        value={lic.licenseNumber}
                        onChange={(e) => updateLicense(idx, "licenseNumber", e.target.value)}
                        placeholder="e.g. 414530"
                      />
                    </Field>
                    <Field label="Licensee Entity">
                      <input
                        className={inputCls}
                        value={lic.licenseeEntity}
                        onChange={(e) => updateLicense(idx, "licenseeEntity", e.target.value)}
                        placeholder="e.g. Pepperstone Group Limited"
                      />
                    </Field>
                    <Field label="Tier">
                      <select
                        className={inputCls}
                        value={lic.tier}
                        onChange={(e) =>
                          updateLicense(idx, "tier", e.target.value as BrokerLicenseAdmin["tier"])
                        }
                      >
                        <option value="Tier-1">Tier-1</option>
                        <option value="Tier-2">Tier-2</option>
                        <option value="Tier-3">Tier-3</option>
                        <option value="Unregulated">Unregulated</option>
                      </select>
                    </Field>
                    <Field label="Official Register URL">
                      <input
                        type="url"
                        className={inputCls}
                        value={lic.officialRegisterUrl}
                        onChange={(e) => updateLicense(idx, "officialRegisterUrl", e.target.value)}
                        placeholder="https://..."
                      />
                    </Field>
                    <Field label="Compensation Scheme">
                      <input
                        className={inputCls}
                        value={lic.compensationScheme || ""}
                        onChange={(e) =>
                          updateLicense(idx, "compensationScheme", e.target.value)
                        }
                        placeholder="e.g. FSCS up to £85,000"
                      />
                    </Field>
                    <Field label="Max Leverage">
                      <input
                        className={inputCls}
                        value={lic.maxLeverage}
                        onChange={(e) => updateLicense(idx, "maxLeverage", e.target.value)}
                        placeholder="e.g. 1:30"
                      />
                    </Field>
                  </div>

                  {/* Bottom data row — mirrors broker-detail's 4-col mono grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lic.negativeBalanceProtection}
                        onChange={(e) =>
                          updateLicense(idx, "negativeBalanceProtection", e.target.checked)
                        }
                        className="accent-amber-500 rounded"
                      />
                      <span>
                        NBP Protection:{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {lic.negativeBalanceProtection ? "Guaranteed" : "No"}
                        </strong>
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lic.segregatedAccounts}
                        onChange={(e) =>
                          updateLicense(idx, "segregatedAccounts", e.target.checked)
                        }
                        className="accent-amber-500 rounded"
                      />
                      <span>
                        Segregated:{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {lic.segregatedAccounts ? "Yes" : "No"}
                        </strong>
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Tab: Costs & Spreads
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "trading_costs" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Spread &amp; Cost Benchmarks
            </h3>

            {/* Same 2-col + 3-col grid as broker-detail's overview benchmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="EUR/USD Median Spread (pips)">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={eurUsdSpread}
                  onChange={(e) => setEurUsdSpread(Number(e.target.value))}
                />
              </Field>
              <Field label="GBP/USD Spread (pips)">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={gbpUsdSpread}
                  onChange={(e) => setGbpUsdSpread(Number(e.target.value))}
                />
              </Field>
              <Field label="Commission / Lot ($)">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={commissionPerLot}
                  onChange={(e) => setCommissionPerLot(Number(e.target.value))}
                />
              </Field>
              <Field label="All-In Cost EUR/USD (pips)">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputCls}
                  value={allInCostEurUsd}
                  onChange={(e) => setAllInCostEurUsd(Number(e.target.value))}
                />
              </Field>
              <Field label="Min Deposit Barrier ($)">
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={minDeposit}
                  onChange={(e) => setMinDeposit(Number(e.target.value))}
                />
              </Field>
              <Field label="Max Leverage Ratio">
                <input
                  className={inputCls}
                  value={maxLeverage}
                  onChange={(e) => setMaxLeverage(e.target.value)}
                  placeholder="e.g. 1:500 (Offshore) / 1:30 (FCA)"
                />
              </Field>
              <Field label="Execution Engine">
                <select
                  className={inputCls}
                  value={executionModel}
                  onChange={(e) =>
                    setExecutionModel(e.target.value as BrokerAdmin["executionModel"])
                  }
                >
                  <option value="ECN/STP">ECN/STP</option>
                  <option value="STP">STP</option>
                  <option value="Market Maker">Market Maker</option>
                  <option value="DMA/ECN">DMA/ECN</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </Field>
              <Field label="Tradable Instruments">
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={tradableAssetsCount}
                  onChange={(e) => setTradableAssetsCount(Number(e.target.value))}
                />
              </Field>
            </div>

            {/* Live preview row — mirrors broker-detail overview benchmark display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">EUR/USD</div>
                <div className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {eurUsdSpread} pips
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Round-Turn</div>
                <div className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                  ${commissionPerLot * 2}/lot
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Min Deposit</div>
                <div className="font-mono text-sm font-black text-slate-800 dark:text-slate-200">
                  ${minDeposit}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Execution</div>
                <div className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                  {executionModel}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Tab: Platforms & Deposits
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "platforms" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="h-4 w-4 text-blue-500" />
              Platforms &amp; Deposit Methods
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Trading Platforms (comma-separated)">
                <input
                  className={inputCls}
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  placeholder="MetaTrader 4, MetaTrader 5, cTrader, TradingView"
                />
              </Field>
              <Field label="Deposit Methods (comma-separated)">
                <input
                  className={inputCls}
                  value={depositMethods}
                  onChange={(e) => setDepositMethods(e.target.value)}
                  placeholder="Bank Wire, Visa/Mastercard, PayPal, Neteller"
                />
              </Field>
            </div>

            {/* Parsed preview — mirrors the list-chip style used in the app */}
            {(platforms || depositMethods) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                {platforms && (
                  <div>
                    <p className={`${labelCls} mb-2`}>Platforms Preview</p>
                    <div className="flex flex-wrap gap-1.5">
                      {platforms.split(",").map((p, i) =>
                        p.trim() ? (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-mono font-medium border border-slate-200 dark:border-slate-700"
                          >
                            {p.trim()}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
                {depositMethods && (
                  <div>
                    <p className={`${labelCls} mb-2`}>Deposit Methods Preview</p>
                    <div className="flex flex-wrap gap-1.5">
                      {depositMethods.split(",").map((d, i) =>
                        d.trim() ? (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-mono font-medium border border-slate-200 dark:border-slate-700"
                          >
                            {d.trim()}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Tab: Ratings
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "ratings" && (
        <div className="space-y-6 text-xs">
          <div className={cardCls}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Initial Ratings &amp; Counts
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <Field label="Editorial Score (0–100)">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  className={inputCls}
                  value={editorialScore}
                  onChange={(e) => setEditorialScore(Number(e.target.value))}
                />
              </Field>
              <Field label="Star Rating (0–5)">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  className={inputCls}
                  value={starRating}
                  onChange={(e) => setStarRating(Number(e.target.value))}
                />
              </Field>
              <Field label="Community Score (0–5)">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  className={inputCls}
                  value={communityScore}
                  onChange={(e) => setCommunityScore(Number(e.target.value))}
                />
              </Field>
              <Field label="Review Count">
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={reviewCount}
                  onChange={(e) => setReviewCount(Number(e.target.value))}
                />
              </Field>
              <Field label="Complaint Count">
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={complaintCount}
                  onChange={(e) => setComplaintCount(Number(e.target.value))}
                />
              </Field>
            </div>

            {/* Score preview — mirrors the score panel in the entity card */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
              <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Editorial</div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                  ★ {editorialScore.toFixed(1)}
                </div>
              </div>
              <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Community</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200">
                  ★ {communityScore.toFixed(1)}
                </div>
              </div>
              <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Star Rating</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200">
                  {starRating.toFixed(1)} ★
                </div>
              </div>
              <div className="text-center px-3">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Reviews</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200">
                  {reviewCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Tab: SEO & Editorial
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "seo" && (
        <div className="space-y-6 text-xs">
          {/* Editorial Summary */}
          <div className={cardCls}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              Editorial Research Summary
            </h3>
            <Field label="Summary" required error={errors.summary}>
              <textarea
                rows={4}
                className={inputCls}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A concise research-backed editorial summary of this broker…"
              />
            </Field>

            {summary && (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {summary}
              </p>
            )}
          </div>

          {/* Pros & Cons — mirrors broker-detail's identity tab pros/cons layout */}
          <div className={cardCls}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pros &amp; Cons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Pros (one per line)">
                <textarea
                  rows={5}
                  className={inputCls}
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  placeholder={"Ultra-tight raw spreads\nTier-1 FCA regulation\n..."}
                />
              </Field>
              <Field label="Cons (one per line)">
                <textarea
                  rows={5}
                  className={inputCls}
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  placeholder={"Higher minimum deposit\nNo crypto trading\n..."}
                />
              </Field>
            </div>

            {/* Parsed pros/cons preview — identical to identity tab read view */}
            {(pros || cons) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <p className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    Pros Preview
                  </p>
                  <ul className="space-y-1">
                    {pros.split("\n").filter(Boolean).map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    Cons Preview
                  </p>
                  <ul className="space-y-1">
                    {cons.split("\n").filter(Boolean).map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <X className="h-3 w-3 mt-0.5 shrink-0 text-rose-500" />
                        <span className="text-slate-700 dark:text-slate-300">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* SEO Metadata */}
          <div className={cardCls}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-500" />
              SEO Metadata
            </h3>
            <div className="space-y-4">
              <Field label="SEO Title">
                <input
                  className={inputCls}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={`${name || "Broker"} Review 2026 — Verified Spreads & Safety Audit`}
                />
              </Field>
              <Field label="SEO Meta Description">
                <textarea
                  rows={2}
                  className={inputCls}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="In-depth independent research audit. Real-account spread benchmarks, license verification, and true ECN costs."
                />
              </Field>
            </div>

            {/* Character counts */}
            <div className="flex gap-6 text-[10px] font-mono text-slate-500">
              <span>
                Title:{" "}
                <strong className={seoTitle.length > 60 ? "text-rose-500" : "text-slate-700 dark:text-slate-300"}>
                  {seoTitle.length}/60
                </strong>
              </span>
              <span>
                Description:{" "}
                <strong className={seoDescription.length > 160 ? "text-rose-500" : "text-slate-700 dark:text-slate-300"}>
                  {seoDescription.length}/160
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom action bar — identical position to broker-detail save bar ── */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/brokers"
          className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
        >
          Cancel
        </Link>

        <div className="flex items-center gap-2">
          {activeTab !== "seo" && (
            <button
              type="button"
              onClick={() => {
                const order = ["identity", "regulation", "trading_costs", "platforms", "ratings", "seo"];
                const next = order[order.indexOf(activeTab) + 1];
                if (next) setActiveTab(next);
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
            >
              Next →
            </button>
          )}
          <button
            type="button"
            onClick={handleCreate}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="h-4 w-4" />
            Create Broker Research Record
          </button>
        </div>
      </div>
    </div>
  );
}
