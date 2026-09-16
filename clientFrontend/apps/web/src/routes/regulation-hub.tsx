import React from "react";
import { Link } from "react-router";
import {
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Search,
  Building,
  HelpCircle,
} from "lucide-react";
import { REGULATORS } from "@/data/broker-directory-data";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function RegulationHub() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 07 — REGULATION & SAFETY HUB">
          Educational and regulatory audit hub. Clarifies the difference between Tier-1 jurisdictions with statutory compensation (£85k/€20k) and unregulated offshore entities. Includes a 4-step interactive license verification protocol.
        </UxAnnotation>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Regulation & Safety Hub</span>
        </div>

        {/* Header Intro */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>Forex Safety Standard</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Forex Broker Regulation & Safety Hub
          </h1>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Understanding regulatory tiers, statutory compensation schemes, and client fund segregation is the single most critical factor before depositing capital with any online broker.
          </p>
        </div>

        {/* 1.0 JURISDICTION TIER PYRAMID */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">
            Global Regulatory Hierarchy Tiers
          </h2>

          <div className="space-y-4">
            {/* Tier 1 */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-xl p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-black text-xs rounded">
                    TIER 1
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Strictest Supervision & Statutory Insolvency Protection
                  </h3>
                </div>
                <span className="text-xs text-emerald-600 font-bold">FCA (UK), ASIC (AU), CySEC (EU), BaFin (DE), FINMA (CH)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Tier-1 authorities require mandatory segregated client accounts at Tier-1 credit institutions, daily client asset reporting, legally binding dispute resolution, and statutory compensation funds (£85,000 via FSCS in UK, €20,000 via ICF in EU).
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">✓ 1:30 Retail Leverage Cap</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">✓ Mandatory Negative Balance Protection</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">✓ Strict Ban on Credit Card Bonuses</span>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500 text-slate-900 font-black text-xs rounded">
                    TIER 2
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Moderate Regional Oversight
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-bold">DFSA (Dubai DIFC), FSCA (South Africa), MAS (Singapore)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Reputable regional authorities that enforce regular capital adequacy audits and local entity registration, but may lack broad retail compensation funds.
              </p>
            </div>

            {/* Tier 3 */}
            <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-xl p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-rose-600 text-white font-black text-xs rounded">
                    TIER 3 / OFFSHORE
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Minimal Oversight & High Risk
                  </h3>
                </div>
                <span className="text-xs text-rose-600 font-bold">FSC Mauritius, VFSC Vanuatu, FSA Seychelles, SVG</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Offshore registration often permits 1:500+ leverage and deposit bonuses, but provides zero insolvency compensation, no mandatory segregation checks, and little legal recourse in event of a dispute.
              </p>
            </div>
          </div>
        </div>

        {/* 2.0 4-STEP LICENSE VERIFICATION PROTOCOL */}
        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-xl border border-slate-800 shadow-md mb-10 text-xs">
          <h2 className="text-lg font-black text-white mb-2 flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-400" />
            4-Step Broker License Verification Protocol
          </h2>
          <p className="text-slate-400 mb-6">
            Follow this 4-step checklist before depositing funds to avoid clone scam websites.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-2">
                1
              </div>
              <h4 className="font-bold text-slate-200 text-sm mb-1">Find License Number</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Scroll to the broker's footer. Note down the regulator name and exact reference ID (e.g. FCA #684312).
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-2">
                2
              </div>
              <h4 className="font-bold text-slate-200 text-sm mb-1">Open Official Register</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Visit the regulator's official portal directly (e.g. register.fca.org.uk) — do NOT click links from unverified emails.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-2">
                3
              </div>
              <h4 className="font-bold text-slate-200 text-sm mb-1">Match Approved Domains</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Check the regulator’s list of authorized trading URLs. Confirm the URL matches character-for-character to prevent clones.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-2">
                4
              </div>
              <h4 className="font-bold text-slate-200 text-sm mb-1">Confirm Segregation</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Verify that your account onboarding is routed to the authorized UK/EU/AU corporate entity rather than an offshore affiliate.
              </p>
            </div>
          </div>
        </div>

        {/* 3.0 REGULATOR BREAKDOWN CARDS */}
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">
            Major International Financial Regulators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGULATORS.map((reg) => (
              <div
                key={reg.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-2xl mb-1 block">{reg.flag}</span>
                      <h3 className="font-black text-base text-slate-900 dark:text-white">
                        {reg.shortName} ({reg.country})
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">{reg.name}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded border border-emerald-300">
                      {reg.tierLabel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                    {reg.summary}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded text-xs space-y-1.5 mb-4 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Compensation:</span>
                      <strong className="text-slate-900 dark:text-white">{reg.compensationLimit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Retail Leverage:</span>
                      <strong className="text-slate-900 dark:text-white">{reg.retailLeverageCap}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Segregation:</span>
                      <strong className="text-emerald-600 font-bold">Mandatory</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">{reg.brokerCount} Regulated Brokers</span>
                  <Link
                    to={`/regulation/${reg.id}`}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Regulator Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
