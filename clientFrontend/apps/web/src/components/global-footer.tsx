import React from "react";
import { Link } from "react-router";
import { ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";

export default function GlobalFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-16 mt-16">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Top 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Platform Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 bg-amber-500 text-slate-950 font-black rounded-lg flex items-center justify-center text-xs tracking-tighter">
                WFX
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Wikii<span className="text-amber-500 font-black">FX</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-3">
              Independent financial research, live account spread testing, and direct regulatory register verification.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Audited September 2026</span>
            </div>
          </div>

          {/* Col 2: Brokers Directory */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-3">Brokers Directory</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/brokers" className="hover:text-white">All Verified Brokers</Link></li>
              <li><Link to="/best-brokers/overall" className="hover:text-white">Top 10 Overall 2026</Link></li>
              <li><Link to="/best-brokers/beginners" className="hover:text-white">Best for Beginners</Link></li>
              <li><Link to="/best-brokers/low-spreads" className="hover:text-white">Lowest Spread Accounts</Link></li>
              <li><Link to="/best-brokers/scalping" className="hover:text-white">Best for Scalping</Link></li>
              <li><Link to="/best-brokers/tradingview" className="hover:text-white">Best TradingView Brokers</Link></li>
            </ul>
          </div>

          {/* Col 3: Regulation & Trust */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-3">Regulation & Safety</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/regulation" className="hover:text-white">Regulation Hub & Tiers</Link></li>
              <li><Link to="/regulation/fca" className="hover:text-white">FCA Regulated Brokers (UK)</Link></li>
              <li><Link to="/regulation/asic" className="hover:text-white">ASIC Regulated Brokers (AU)</Link></li>
              <li><Link to="/regulation/cysec" className="hover:text-white">CySEC Regulated Brokers (EU)</Link></li>
              <li><Link to="/regulation" className="hover:text-white">How to Verify a License</Link></li>
              <li><Link to="/complaints" className="hover:text-amber-400 font-semibold">Complaints & Exposure</Link></li>
            </ul>
          </div>

          {/* Col 4: Comparison & Tools */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-3">Tools & Calculators</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/tools/broker-finder" className="hover:text-white font-medium text-amber-400">🎯 Broker Finder Wizard</Link></li>
              <li><Link to="/compare" className="hover:text-white">Side-by-Side Comparison</Link></li>
              <li><Link to="/tools" className="hover:text-white">Forex All-In Cost Calculator</Link></li>
              <li><Link to="/tools" className="hover:text-white">Pip Value & Risk Estimator</Link></li>
              <li><Link to="/community/convocation" className="hover:text-amber-300 font-bold text-amber-400">🌐 Global Convocation 2026</Link></li>
              <li><Link to="/reviews" className="hover:text-white">User Community Reviews</Link></li>
              <li><Link to="/reviews/write" className="hover:text-white">Submit a Review</Link></li>
            </ul>
          </div>

          {/* Col 5: Editorial & Legal */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-3">Editorial Standards</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/how-we-rate" className="hover:text-white">120-Point Rating Methodology</Link></li>
              <li><Link to="/guides/trading-costs" className="hover:text-white">Forex Costs Guide</Link></li>
              <li><Link to="/about" className="hover:text-white">About Research Team</Link></li>
              <li><Link to="/how-we-rate" className="hover:text-white">Editorial Independence</Link></li>
              <li><span className="hover:text-white cursor-pointer">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Regulatory Risk Disclosure, Prototype Notice & Advertiser Notice */}
        <div className="mt-8 space-y-4 text-[11px] text-slate-500 leading-relaxed">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Mandatory High-Risk Investment Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between <strong>70% and 85% of retail investor accounts lose money</strong> when trading CFDs with these providers. You should consider whether you understand how CFDs work, and whether you can afford to take the high risk of losing your capital. Forex trading carries substantial risk and is not suitable for every investor.
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg text-[10px] text-slate-400">
            <strong>Research System Notice:</strong> This platform is running as an <em>Independent Financial Research & High-Fidelity UI System</em>. All presented broker scores, regulatory status entries, execution speeds, and user reviews represent structured illustrative sample data for interface evaluation.
          </div>

          <p>
            <strong>Advertiser Disclosure:</strong> WikiiFX is an independent comparison website supported by referral commissions. We may receive financial compensation when visitors click on affiliate links to broker websites. This compensation does not influence our rigorous editorial ratings, test scores, or algorithmic ranking formulas. We do not accept payment to artificially alter broker scores or promote unregulated offshore entities.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-900 text-slate-500 text-[10px]">
            <div>© 2026 WikiiFX Regulatory Inquiry & Research Media Group. All rights reserved. Independent Financial Research.</div>
            <div className="flex gap-4">
              <span>Security Audited</span>
              <span>•</span>
              <span>Daily Spread Sync</span>
              <span>•</span>
              <span>FCA / ASIC / CySEC Data Synchronized</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
