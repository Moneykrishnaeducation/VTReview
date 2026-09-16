import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import { Settings, ShieldCheck, AlertTriangle, Save, CheckCircle2, Sliders } from "lucide-react";

export default function SystemSettings() {
  const { activeRoleDef } = useAdmin();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings form states
  const [riskWarning, setRiskWarning] = useState(
    "CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 70% and 85% of retail investor accounts lose money when trading CFDs with these providers. You should consider whether you understand how CFDs work, and whether you can afford to take the high risk of losing your capital."
  );

  const [disclosureText, setDisclosureText] = useState(
    "WikiFX is an independent comparison website supported by referral commissions. We may receive financial compensation when visitors click on affiliate links to broker websites. This compensation does not influence our rigorous editorial ratings, test scores, or algorithmic ranking formulas. We do not accept payment to artificially alter broker scores or promote unregulated offshore entities."
  );

  const [featureFlags, setFeatureFlags] = useState({
    liveSpreadSync: true,
    publicComplaintsFeed: true,
    communityReviewsOpen: true,
    automatedCloneDetection: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-mono text-[11px] mb-1">
            <Settings className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>PLATFORM GOVERNANCE & LEGAL SETTINGS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            System Configuration, Disclosures & Risk Warnings
          </h1>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>System configuration updated and synced across public web nodes.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Warning Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <span>Mandatory Statutory High-Risk Investment Warning (ESMA / FCA / ASIC)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            This disclosure is rendered persistently on the public platform footer and all broker comparison pages.
          </p>
          <textarea
            value={riskWarning}
            onChange={(e) => setRiskWarning(e.target.value)}
            rows={4}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-200 leading-relaxed focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Advertiser Disclosure Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Editorial Independence & Advertiser Compensation Disclosure</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            Guarantees operational decoupling between commercial referral links and algorithmic 120-point broker ratings.
          </p>
          <textarea
            value={disclosureText}
            onChange={(e) => setDisclosureText(e.target.value)}
            rows={4}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-200 leading-relaxed focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Feature Flags */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Sliders className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Global Operational Feature Toggles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "liveSpreadSync",
                label: "Live Spread Telemetry Sync",
                desc: "Continuously captures 10,000 tick London/NY spread feeds.",
              },
              {
                key: "publicComplaintsFeed",
                label: "Public Complaints & Exposure Feed",
                desc: "Displays audited dispute cases on broker review pages.",
              },
              {
                key: "communityReviewsOpen",
                label: "Community Review Submissions",
                desc: "Allows registered traders to submit verified account reviews.",
              },
              {
                key: "automatedCloneDetection",
                label: "Automated FCA/ASIC Clone Detector",
                desc: "Scans new broker domains against regulatory warning lists.",
              },
            ].map((f) => (
              <label
                key={f.key}
                className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-slate-200">{f.label}</div>
                  <div className="text-[11px] text-slate-500">{f.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={featureFlags[f.key as keyof typeof featureFlags]}
                  onChange={(e) =>
                    setFeatureFlags((prev) => ({
                      ...prev,
                      [f.key]: e.target.checked,
                    }))
                  }
                  className="accent-amber-500 h-4 w-4 rounded mt-0.5 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-slate-500 font-mono text-[11px]">
            Governance Actor: <strong className="text-slate-800 dark:text-slate-300">{activeRoleDef.name}</strong>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save System Governance Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
