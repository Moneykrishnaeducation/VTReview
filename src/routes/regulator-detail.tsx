import React from "react";
import { useParams, Link } from "react-router";
import {
  ShieldCheck,
  ExternalLink,
  Lock,
  Building,
  CheckCircle2,
  ArrowRight,
  Scale,
} from "lucide-react";
import { REGULATORS, BROKERS, type RegulatorGuide } from "@/data/broker-directory-data";
import { BrokerResultCard, UxAnnotation } from "@/components/ui/wireframe-components";

export default function RegulatorDetail() {
  const { regulatorId = "fca" } = useParams<{ regulatorId: string }>();

  const regulator: RegulatorGuide =
    REGULATORS.find((r) => r.id === regulatorId || r.shortName.toLowerCase() === regulatorId.toLowerCase()) ||
    REGULATORS[0];

  // Regulated brokers
  const regulatedBrokers = BROKERS.filter((b) =>
    b.regulations.some((r) => r.regulator.toLowerCase() === regulator.shortName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 13 — REGULATOR DETAIL & VERIFICATION GUIDE">
          In-depth regulatory authority guide. Includes step-by-step register lookup protocols, statutory consumer compensation limits, and a filtered directory of authorized brokerages.
        </UxAnnotation>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link to="/regulation" className="hover:underline">Regulation</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{regulator.shortName} ({regulator.country})</span>
        </div>

        {/* Header Profile Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-4xl p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border">
                {regulator.flag}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                    {regulator.shortName} — {regulator.name}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-300">
                    {regulator.tierLabel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Jurisdiction: <strong>{regulator.country}</strong></span>
                  <span>•</span>
                  <span>Established: {regulator.established}</span>
                  <span>•</span>
                  <a
                    href={regulator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                  >
                    <span>Official Registry Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-3xl">
            {regulator.summary}
          </p>

          {/* Core Protection Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Insolvency Compensation</span>
              <strong className="text-slate-900 dark:text-white">{regulator.compensationLimit}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Retail Leverage Limit</span>
              <strong className="text-slate-900 dark:text-white">{regulator.retailLeverageCap}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Fund Segregation</span>
              <strong className="text-emerald-600">Strictly Mandatory (Tier-1 Banks)</strong>
            </div>
          </div>
        </div>

        {/* 2-Column: Verification Protocol + Protections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Verification Protocol */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs text-xs">
            <h2 className="text-base font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              How to Verify a {regulator.shortName} License
            </h2>
            <ol className="space-y-2.5 text-slate-600 dark:text-slate-300">
              {regulator.verificationSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Key Protections */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs text-xs">
            <h2 className="text-base font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Mandatory Legal Safeguards
            </h2>
            <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
              {regulator.keyProtections.map((prot, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{prot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulated Brokers Directory */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Verified {regulator.shortName} Regulated Forex Brokers ({regulatedBrokers.length})
            </h2>
            <Link to="/brokers" className="text-xs text-blue-600 font-bold hover:underline">
              View All 140+ Brokers Directory →
            </Link>
          </div>

          <div className="space-y-4">
            {regulatedBrokers.map((broker) => (
              <BrokerResultCard key={broker.id} broker={broker} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
