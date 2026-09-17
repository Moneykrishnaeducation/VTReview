import React, { useState } from "react";
import { Link } from "react-router";
import {
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ArrowUp,
  Mail,
  CheckCircle2,
  Lock,
  Scale,
  Star,
  Award,
  Sparkles,
  Globe,
  Building2,
  HelpCircle,
  Info,
  X,
  Radio,
  FileText,
  ShieldAlert,
  ArrowRight,
  Send,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

export default function GlobalFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Subscribed to Weekly Regulatory & Broker Risk Alerts!");
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs border-t border-slate-200 dark:border-slate-800/90 pt-12 pb-16 mt-16 transition-colors">
        <div className="max-w-[1240px] mx-auto px-4">
          {/* ========================================================================= */}
          {/* NEWSLETTER & REGULATORY ALERT SUBSCRIPTION BANNER */}
          {/* ========================================================================= */}
          <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-blue-500/10 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border border-amber-500/20 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] mb-2">
                <Radio className="h-3 w-3 text-amber-500 animate-pulse" />
                <span>Weekly Regulatory Intelligence</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                Stay Ahead of Broker Scandals & License Changes
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive direct regulator revocation alerts (FCA, ASIC, CySEC), sudden spread widen warnings, and verified exposure reports.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Subscribe</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  No Spam Guarantee
                </span>
                <span>•</span>
                <span>One-Click Unsubscribe</span>
              </div>
            </form>
          </div>

          {/* ========================================================================= */}
          {/* MAIN 5-COLUMN FOOTER SITEMAP */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
            {/* Col 1: Brand & Authority */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-block mb-3">
                <img
                  src={logo}
                  alt="WikiIFX Broker Review"
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
                Independent financial research, live account spread benchmarking, and direct government regulatory register audits.
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Audited September 2026</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                  <Globe className="h-3.5 w-3.5" />
                  <span>140+ Supervised Entities</span>
                </div>
              </div>
            </div>

            {/* Col 2: Brokers Directory */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                Brokers Directory
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <Link to="/brokers" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    All Verified Brokers (140+)
                  </Link>
                </li>
                <li>
                  <Link to="/best-brokers/overall" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Top 10 Overall 2026
                  </Link>
                </li>
                <li>
                  <Link to="/best-brokers/beginners" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Best for Beginners
                  </Link>
                </li>
                <li>
                  <Link to="/best-brokers/low-spreads" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Lowest Spread Accounts
                  </Link>
                </li>
                <li>
                  <Link to="/best-brokers/scalping" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Best for Scalping & ECN
                  </Link>
                </li>
                <li>
                  <Link to="/best-brokers/tradingview" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Best TradingView Brokers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Regulation & Safety */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                Regulation & Safety
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <Link to="/regulation" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Regulation Hub & Tiers
                  </Link>
                </li>
                <li>
                  <Link to="/regulation/fca" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    FCA Regulated Brokers (UK)
                  </Link>
                </li>
                <li>
                  <Link to="/regulation/asic" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    ASIC Regulated Brokers (AU)
                  </Link>
                </li>
                <li>
                  <Link to="/regulation/cysec" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    CySEC Regulated Brokers (EU)
                  </Link>
                </li>
                <li>
                  <Link to="/regulation" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    4-Step License Verification
                  </Link>
                </li>
                <li>
                  <Link to="/complaints" className="hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors flex items-center gap-1 text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Complaints & Exposure</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Tools & Community */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                Tools & Calculators
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <Link to="/tools/broker-finder" className="hover:text-amber-600 dark:hover:text-amber-300 font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 transition-colors">
                    <Sparkles className="h-3 w-3" />
                    <span>Broker Finder (60s Quiz)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/compare" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Side-by-Side Comparison Matrix
                  </Link>
                </li>
                <li>
                  <Link to="/tools" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    All-In Cost & Spread Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/community/convocation" className="hover:text-amber-600 dark:hover:text-amber-300 font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Global Convocation 2026</span>
                  </Link>
                </li>
                <li>
                  <Link to="/reviews" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Trader Reviews & Proofs
                  </Link>
                </li>
                <li>
                  <Link to="/reviews/write" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Submit Verified Review
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 5: Editorial Standards */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                Editorial & Trust
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <Link to="/how-we-rate" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    120-Point Methodology
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Trading Costs Guide
                  </Link>
                </li>
                <li>
                  <Link to="/how-we-rate" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Editorial Independence Policy
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowAffiliateModal(true)}
                    className="hover:text-amber-600 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Advertiser Transparency
                  </button>
                </li>
                <li>
                  <Link to="/how-we-rate" className="hover:text-amber-600 dark:hover:text-white transition-colors">
                    Dispute Resolution Protocol
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STATUTORY RISK WARNING & REGULATORY DISCLOSURE */}
          {/* ========================================================================= */}
          <div className="mt-8 space-y-4 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {/* Risk Warning Box */}
            <div className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-200 font-semibold">
                  Mandatory High-Risk Investment Warning:
                </strong>{" "}
                CFDs are complex financial instruments and come with a high risk of losing money rapidly due to leverage.
                Between <strong className="text-slate-900 dark:text-slate-200">70% and 85% of retail investor accounts lose money</strong> when
                trading CFDs. You should consider whether you understand how CFDs work, and whether you can afford to take the high risk of losing
                your capital. Forex and leveraged derivative trading carries substantial risk and is not suitable for every investor.
              </div>
            </div>

            {/* Advertiser Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px]">
              <p className="text-slate-500 dark:text-slate-400 max-w-3xl">
                <strong className="text-slate-700 dark:text-slate-300">Advertiser Disclosure:</strong> WikiiFX operates as an independent financial
                research platform supported by affiliate compensation. Commercial relationships never compromise our editorial ratings, ranking
                methodology, or negative exposure reports. Brokers cannot pay for higher rankings or altered verdicts.
              </p>
              <button
                type="button"
                onClick={() => setShowAffiliateModal(true)}
                className="text-amber-600 dark:text-amber-400 hover:underline font-semibold shrink-0 cursor-pointer text-left sm:text-right"
              >
                Read Full Disclosure →
              </button>
            </div>

            {/* Bottom Bar & Back-to-Top Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-900 text-slate-500 text-[10px]">
              <div>
                © 2026 WikiiFX Global Financial Research Media Group. All rights reserved. Independent Financial Review & Regulatory Registry Intelligence.
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">256-Bit SSL Secured</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Daily Spread Auditing</span>
                <span className="hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
                  aria-label="Scroll back to top"
                >
                  <span>Back to top</span>
                  <ArrowUp className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* ADVERTISER DISCLOSURE MODAL */}
      {/* ========================================================================= */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setShowAffiliateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Advertiser & Affiliate Transparency
                </h3>
                <p className="text-[11px] text-slate-500">Editorial Independence Guarantee</p>
              </div>
            </div>
            <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>WikiiFX</strong> is an independent financial research and regulatory inquiry platform. We are committed to absolute transparency, data integrity, and strict objectivity across all evaluations.
              </p>
              <p>
                To support our extensive testing and live account audits, we may receive compensation when you open an account through links on our platform.
              </p>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
                🛡️ <strong>Our Editorial Guarantee:</strong> Commercial relationships never influence our editorial ratings, ranking algorithms, or fact-checked reviews. Brokers cannot pay for higher scores or positive verdicts.
              </div>
              <p className="text-[11px] text-slate-500">
                CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 70% and 85% of retail investor accounts lose money when trading CFDs.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAffiliateModal(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer text-xs"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
