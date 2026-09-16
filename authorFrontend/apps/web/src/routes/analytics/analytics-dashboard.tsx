import React from "react";
import { BarChart3, TrendingUp, Users, ExternalLink, Search, Sparkles, Scale, ShieldCheck } from "lucide-react";

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono text-[11px] mb-1">
            <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
            <span>PLATFORM RESEARCH INTELLIGENCE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Operational & Discovery Analytics
          </h1>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Last refreshed: <strong className="text-slate-300">Live Telemetry (16 Sep 2026)</strong>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Broker Directory Views</span>
            <Search className="h-4 w-4 text-amber-500" />
          </div>
          <div className="font-mono text-xl font-black text-white">418,920</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Comparison Tool Runs</span>
            <Scale className="h-4 w-4 text-blue-500" />
          </div>
          <div className="font-mono text-xl font-black text-white">92,410</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+8.6% conversions</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Broker Finder Completions</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="font-mono text-xl font-black text-white">34,180</div>
          <div className="text-[10px] text-slate-400 font-mono">88.4% completion rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
            <span>Dispute Settlement Rate</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="font-mono text-xl font-black text-emerald-400">94.8%</div>
          <div className="text-[10px] text-slate-400 font-mono">Avg resolution: 4.2 days</div>
        </div>
      </div>

      {/* Discovery Searches & Outbound Clicks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Search Queries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm">Top Research Search Queries (Last 30 Days)</h3>
          <div className="space-y-2">
            {[
              { query: "Lowest spread ECN brokers", count: 24800, share: "28%" },
              { query: "FCA regulated scalping brokers", count: 18400, share: "21%" },
              { query: "VTIndex ASIC license check", count: 14200, share: "16%" },
              { query: "TradingView direct integration brokers", count: 11900, share: "13%" },
              { query: "Zero deposit MT5 brokers", count: 9800, share: "11%" },
            ].map((q, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="font-medium text-slate-200">{q.query}</span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-amber-400 font-bold">{q.count.toLocaleString()} queries</span>
                  <span className="text-slate-500">{q.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outbound Referral Link Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Outbound Verification & Affiliate Clicks</h3>
            <span className="text-[10px] text-slate-500 font-mono">Decoupled from Scoring</span>
          </div>

          <div className="space-y-2">
            {[
              { broker: "IC Markets", outboundClicks: 28400, source: "Review & Compare Tray" },
              { broker: "Pepperstone", outboundClicks: 26100, source: "Top 10 Rankings & Finder" },
              { broker: "VTIndex", outboundClicks: 14800, source: "Broker Directory & Spreads Table" },
              { broker: "XM Group", outboundClicks: 12400, source: "Beginners Guide & Calculator" },
            ].map((b, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">{b.broker}</div>
                  <div className="text-[10px] text-slate-500">Primary Channel: {b.source}</div>
                </div>
                <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                  <span>{b.outboundClicks.toLocaleString()} visits</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
