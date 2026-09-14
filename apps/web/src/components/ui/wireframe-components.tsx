import React, { useState } from "react";
import { Link } from "react-router";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Scale,
  Sparkles,
  Info,
  Building,
  Clock,
  Layers,
  Award,
  Users,
  AlertTriangle,
  FileCheck2,
  Check,
} from "lucide-react";
import { type Broker } from "@/data/broker-directory-data";
import { useComparison } from "@/lib/comparison-context";

// 1.0 UX ANNOTATION CONTAINER (Toggleable for Inspection)
export function UxAnnotation({
  tag,
  children,
}: {
  tag: string;
  children: React.ReactNode;
}) {
  const { showAnnotations } = useComparison();
  if (!showAnnotations) return null;

  return (
    <div className="ux-annotation p-3 my-3 rounded-lg border border-dashed border-blue-500 bg-blue-500/5 text-xs text-blue-900 dark:text-blue-200">
      <div className="ux-annotation-tag">{tag}</div>
      <div className="mt-1.5 leading-relaxed">{children}</div>
    </div>
  );
}

// 2.0 TRUST BADGE SYSTEM
export type TrustBadgeVariant = "verified" | "tier1" | "tier2" | "offshore" | "tested" | "sample";

export function TrustBadge({
  variant = "verified",
  label,
  sublabel,
}: {
  variant?: TrustBadgeVariant;
  label?: string;
  sublabel?: string;
}) {
  switch (variant) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md">
          <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          <span>{label || "Verified License"}</span>
          {sublabel && <span className="text-emerald-600/70 dark:text-emerald-400/70 font-normal">({sublabel})</span>}
        </span>
      );
    case "tier1":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>{label || "Tier-1 Supervised"}</span>
        </span>
      );
    case "tier2":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-md">
          <AlertTriangle className="h-3 w-3 text-amber-600" />
          <span>{label || "Tier-2 Oversight"}</span>
        </span>
      );
    case "tested":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md">
          <FileCheck2 className="h-3 w-3 text-blue-600" />
          <span>{label || "Live Account Tested"}</span>
        </span>
      );
    case "sample":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded">
          <Info className="h-2.5 w-2.5" />
          <span>Sample Prototype Data</span>
        </span>
      );
    default:
      return null;
  }
}

// 3.0 SAMPLE DATA & METHODOLOGY DISCLOSURE BANNER
export function SampleDataNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5 ${className}`}>
      <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <strong className="text-slate-800 dark:text-slate-200">Prototype Research Notice:</strong> Broker metrics, spread averages, and regulatory license data are illustrative sample representations for interface validation. Always verify official register numbers directly with the supervisory body.
      </div>
    </div>
  );
}

// 4.0 REUSABLE DUAL SCORE CARD (Editorial vs Community Separation)
export function ScoreCardDual({
  editorialRating,
  editorialClass,
  userRating,
  reviewCount,
}: {
  editorialRating: number;
  editorialClass: string;
  userRating: number;
  reviewCount: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
      {/* Editorial Research Score */}
      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-left shadow-xs">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Award className="h-3 w-3 text-amber-500" />
          <span>Editorial Score</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">★ {editorialRating.toFixed(1)}</span>
          <span className="text-[10px] text-slate-400 font-medium">/ 5.0</span>
        </div>
        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{editorialClass}</div>
      </div>

      {/* Community User Rating */}
      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-left shadow-xs">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Users className="h-3 w-3 text-blue-500" />
          <span>Trader Rating</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">★ {userRating.toFixed(1)}</span>
          <span className="text-[10px] text-slate-400 font-medium">/ 5.0</span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{reviewCount} Verified Reviews</div>
      </div>
    </div>
  );
}

// 5.0 REUSABLE BROKER RESULT CARD (Directory & Category Listings)
export function BrokerResultCard({ broker }: { broker: Broker }) {
  const { isBrokerSelected, addBroker, removeBroker } = useComparison();
  const selected = isBrokerSelected(broker.id);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Left Info: Logo, Name, Badges, Regulations */}
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-1 shrink-0">
            <Building className="h-5 w-5 text-slate-600 mb-0.5" />
            <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 tracking-tighter leading-none">
              {broker.logoText.split(" ")[0]}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/brokers/${broker.slug}`}
                className="text-base font-extrabold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {broker.name}
              </Link>
              <TrustBadge variant="verified" label={broker.primaryLicense} />
              {broker.categoryBadges.slice(0, 1).map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>HQ: {broker.hq}</span>
              <span>•</span>
              <span>Founded: {broker.founded}</span>
              <span>•</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{broker.executionModel}</span>
            </div>
          </div>
        </div>

        {/* Right Ratings & Trust Gauges */}
        <div className="flex items-center lg:items-end flex-row lg:flex-col justify-between gap-1 shrink-0 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Editorial Score</span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100 tabular-nums">★ {broker.editorialRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>Class: <strong className="text-slate-700 dark:text-slate-300">{broker.editorialClass}</strong></span>
            <span>•</span>
            <span>Users: ★ {broker.userRating} ({broker.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Center 4-Column Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 py-3 px-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">EUR/USD Spread</span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tabular-nums">{broker.eurUsdSpread} pips</span>
          <span className="text-[10px] text-slate-500 block">Raw Spread Avg</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Min Deposit</span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tabular-nums">{broker.minDepositFormatted}</span>
          <span className="text-[10px] text-slate-500 block">0% Funding Fee</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Commission</span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tabular-nums">${broker.commissionPerLot.toFixed(2)}</span>
          <span className="text-[10px] text-slate-500 block">Per Lot / Side</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Platforms</span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm truncate block">
            {broker.platforms.join(", ")}
          </span>
          <span className="text-[10px] text-slate-500 block">{broker.tradableMarketsCount}+ Markets</span>
        </div>
      </div>

      {/* Editorial Verdict Excerpt */}
      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
        <strong>Our Verdict:</strong> {broker.verdictSummary}
      </p>

      {/* Bottom Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Comparison Checkbox */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none hover:text-slate-900 dark:hover:text-white">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              if (e.target.checked) addBroker(broker.id);
              else removeBroker(broker.id);
            }}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
          <span>{selected ? "✓ Added to Compare" : "+ Add to Compare"}</span>
        </label>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <Link
            to={`/brokers/${broker.slug}`}
            className="px-3.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors"
          >
            Read In-Depth Review
          </Link>

          <a
            href={broker.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs transition-colors"
          >
            <span>Visit Broker</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
}

// 6.0 SCORE GAUGE BREAKDOWN COMPONENT
export function RatingBreakdownBars({ ratings }: { ratings: Broker["ratingsBreakdown"] }) {
  const categories = [
    { label: "Safety & Regulation", weight: "30%", score: ratings.safety, note: "Tier-1 licenses & segregated client funds" },
    { label: "Trading Costs & Fees", weight: "25%", score: ratings.costs, note: "Audited live raw spreads + commissions" },
    { label: "Platforms & Tools", weight: "20%", score: ratings.platforms, note: "TradingView, MT4/MT5, mobile app & latency" },
    { label: "Deposit & Withdrawal", weight: "10%", score: ratings.banking, note: "Withdrawal processing speeds & zero deposit fees" },
    { label: "Customer Support", weight: "15%", score: ratings.support, note: "24/5 live chat & telephone response speed" },
  ];

  return (
    <div className="space-y-3 text-xs">
      {categories.map((cat) => {
        const percentage = (cat.score / 5.0) * 100;
        return (
          <div key={cat.label} className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{cat.label}</span>
                <span className="text-[10px] text-slate-400 font-normal">({cat.weight} weight)</span>
              </div>
              <div className="font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {cat.score.toFixed(1)} <span className="text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-slate-900 dark:bg-slate-100 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">{cat.note}</div>
          </div>
        );
      })}
    </div>
  );
}

// 7.0 PROS AND CONS COMPONENT
export function ProsConsGrid({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Key Advantages (Pros)
        </h4>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {pros.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-1.5">
          <XCircle className="h-4 w-4 text-rose-600" />
          Drawbacks & Limitations (Cons)
        </h4>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {cons.map((c, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">✕</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 8.0 FAQ ACCORDION COMPONENT
export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-2 text-xs">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full px-4 py-3 text-left font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span>{item.question}</span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 pb-3.5 pt-1 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

