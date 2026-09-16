import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  ExternalLink,
  Search,
  Sparkles,
  Scale,
  ShieldCheck,
  Calendar,
  ChevronDown,
  PieChart,
  Activity,
  Filter,
  ArrowUpRight,
  Layers,
  Clock,
  RefreshCw,
  Download,
  FileCode,
  CheckCircle2,
  Globe2,
  ArrowRight,
  Zap,
} from "lucide-react";

// --- Datasets for Timeframes ---
const TIMEFRAME_DATA = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    searches: [14200, 16800, 15900, 18400, 21000, 12500, 13800],
    compares: [3100, 3800, 3500, 4200, 4900, 2600, 2900],
    clicks: [2800, 3400, 3200, 3900, 4500, 2200, 2500],
    totalViews: "112,600",
    viewsChange: "+8.4%",
    totalCompares: "25,000",
    comparesChange: "+5.2%",
    totalFinder: "9,400",
    disputeRate: "95.2%",
    avgLatency: "24ms",
  },
  "30d": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    searches: [98000, 105000, 112000, 103920],
    compares: [21500, 23800, 24600, 22510],
    clicks: [19200, 21100, 22000, 19400],
    totalViews: "418,920",
    viewsChange: "+14.2%",
    totalCompares: "92,410",
    comparesChange: "+8.6%",
    totalFinder: "34,180",
    disputeRate: "94.8%",
    avgLatency: "22ms",
  },
  "90d": {
    labels: ["Month 1", "Month 2", "Month 3"],
    searches: [320000, 380000, 418920],
    compares: [72000, 84000, 92410],
    clicks: [61000, 73000, 81700],
    totalViews: "1,118,920",
    viewsChange: "+22.5%",
    totalCompares: "248,410",
    comparesChange: "+12.1%",
    totalFinder: "98,400",
    disputeRate: "96.1%",
    avgLatency: "20ms",
  },
};

// Donut Chart Data
const DONUT_DATA = [
  { broker: "IC Markets", clicks: 28400, percentage: 34.8, color: "#3b82f6" },
  { broker: "Pepperstone", clicks: 26100, percentage: 31.9, color: "#f59e0b" },
  { broker: "VTIndex", clicks: 14800, percentage: 18.1, color: "#10b981" },
  { broker: "XM Group", clicks: 12400, percentage: 15.2, color: "#8b5cf6" },
];

// Jurisdictions Data
const JURISDICTION_DATA = [
  { name: "FCA (United Kingdom)", share: 42, count: "175,946 views", flag: "🇬🇧", color: "bg-blue-500" },
  { name: "ASIC (Australia)", share: 28, count: "117,297 views", flag: "🇦🇺", color: "bg-emerald-500" },
  { name: "CySEC (European Union)", share: 18, count: "75,405 views", flag: "🇪🇺", color: "bg-amber-500" },
  { name: "FSCA (South Africa) & Other", share: 12, count: "50,272 views", flag: "🌐", color: "bg-purple-500" },
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [selectedSeries, setSelectedSeries] = useState<"all" | "searches" | "compares" | "clicks">("all");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const currentData = TIMEFRAME_DATA[timeRange];

  // SVG Line Chart Coordinate Generator
  const chartWidth = 800;
  const chartHeight = 240;
  const padding = 35;

  const maxVal = Math.max(...currentData.searches) * 1.15;
  const stepX = (chartWidth - padding * 2) / (currentData.labels.length - 1);

  const getPoints = (dataset: number[]) => {
    return dataset.map((val, idx) => {
      const x = padding + idx * stepX;
      const y = chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);
      return { x, y, val };
    });
  };

  const createAreaPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];

    let path = `M ${first.x} ${first.y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    path += ` L ${last.x} ${chartHeight - padding} L ${first.x} ${chartHeight - padding} Z`;
    return path;
  };

  const createLinePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    const first = points[0];
    let path = `M ${first.x} ${first.y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const searchPoints = getPoints(currentData.searches);
  const comparePoints = getPoints(currentData.compares);
  const clickPoints = getPoints(currentData.clicks);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleExportCSV = () => {
    const headers = ["Timeframe", "Period", "Searches", "Comparisons", "Outbound Clicks"];
    const rows = currentData.labels.map((label, idx) => [
      timeRange,
      label,
      currentData.searches[idx],
      currentData.compares[idx],
      currentData.clicks[idx],
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `telemetry-analytics-${timeRange}-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ timeframe: timeRange, metrics: currentData, marketShare: DONUT_DATA }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `telemetry-analytics-${timeRange}-${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-xs font-sans w-full pb-16">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-mono text-[11px] mb-1 font-semibold">
            <BarChart3 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>PLATFORM RESEARCH &amp; DISCOVERY ANALYTICS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Telemetry &amp; Conversion Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Real-time telemetry across broker searches, comparison tool runs, quiz conversions, and decoupled outbound affiliate referrals.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe Switcher */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex items-center gap-1 shadow-xs">
            {(["7d", "30d", "90d"] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeRange(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeRange === tf
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            title="Export JSON"
          >
            <FileCode className="h-4 w-4" />
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            title="Export CSV"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-amber-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Executive KPI Metric Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Directory Impressions</span>
            <Search className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {currentData.totalViews}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{currentData.viewsChange} vs prev period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Comparison Runs</span>
            <Scale className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {currentData.totalCompares}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{currentData.comparesChange} engagement rate</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Finder Quiz Runs</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {currentData.totalFinder}
          </div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
            88.4% completion rate
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Dispute Settlement</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {currentData.disputeRate}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Avg resolution: 4.2 days
          </div>
        </div>
      </div>

      {/* ── Main Feature Graph: Interactive Vector Telemetry Chart ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              <span>Discovery &amp; Conversion Telemetry Trends</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time user engagement timeline across broker directory searches, comparison tool runs, and outbound referral clicks.
            </p>
          </div>

          {/* Series Legend Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedSeries("all")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                selectedSeries === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              All Metrics
            </button>
            <button
              type="button"
              onClick={() => setSelectedSeries("searches")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedSeries === "searches"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Searches</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSeries("compares")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedSeries === "compares"
                  ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Compares</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSeries("clicks")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedSeries === "clicks"
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Outbound Clicks</span>
            </button>
          </div>
        </div>

        {/* SVG Telemetry Chart Container */}
        <div className="relative w-full overflow-hidden pt-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible"
          >
            <defs>
              <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = padding + pct * (chartHeight - padding * 2);
              return (
                <g key={idx}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-600 text-[9px] font-mono"
                  >
                    {Math.round(maxVal * (1 - pct)).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Area Fills */}
            {(selectedSeries === "all" || selectedSeries === "searches") && (
              <path d={createAreaPath(searchPoints)} fill="url(#amberGrad)" />
            )}
            {(selectedSeries === "all" || selectedSeries === "compares") && (
              <path d={createAreaPath(comparePoints)} fill="url(#blueGrad)" />
            )}
            {(selectedSeries === "all" || selectedSeries === "clicks") && (
              <path d={createAreaPath(clickPoints)} fill="url(#emeraldGrad)" />
            )}

            {/* Lines */}
            {(selectedSeries === "all" || selectedSeries === "searches") && (
              <path
                d={createLinePath(searchPoints)}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
            {(selectedSeries === "all" || selectedSeries === "compares") && (
              <path
                d={createLinePath(comparePoints)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
            {(selectedSeries === "all" || selectedSeries === "clicks") && (
              <path
                d={createLinePath(clickPoints)}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Data Point Circles & Interactive Hover Hits */}
            {currentData.labels.map((label, idx) => {
              const sp = searchPoints[idx];
              const cp = comparePoints[idx];
              const clp = clickPoints[idx];
              const isHovered = hoveredPoint === idx;

              return (
                <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)}>
                  {isHovered && (
                    <line
                      x1={sp.x}
                      y1={padding}
                      x2={sp.x}
                      y2={chartHeight - padding}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {(selectedSeries === "all" || selectedSeries === "searches") && (
                    <circle
                      cx={sp.x}
                      cy={sp.y}
                      r={isHovered ? 6 : 4}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-150 cursor-pointer"
                    />
                  )}

                  {(selectedSeries === "all" || selectedSeries === "compares") && (
                    <circle
                      cx={cp.x}
                      cy={cp.y}
                      r={isHovered ? 6 : 4}
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-150 cursor-pointer"
                    />
                  )}

                  {(selectedSeries === "all" || selectedSeries === "clicks") && (
                    <circle
                      cx={clp.x}
                      cy={clp.y}
                      r={isHovered ? 6 : 4}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-150 cursor-pointer"
                    />
                  )}

                  <text
                    x={sp.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className={`text-[10px] font-mono ${
                      isHovered ? "fill-amber-500 font-bold" : "fill-slate-400 dark:fill-slate-500"
                    }`}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card Overlay */}
          {hoveredPoint !== null && (
            <div
              className="absolute z-20 bg-slate-900/95 text-white dark:bg-slate-950/95 p-3 rounded-xl border border-slate-700 shadow-xl font-mono text-[11px] pointer-events-none space-y-1.5 backdrop-blur-md"
              style={{
                left: `${(searchPoints[hoveredPoint].x / chartWidth) * 100}%`,
                top: "10%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
                <span>{currentData.labels[hoveredPoint]}</span>
                <span className="text-[10px] text-slate-400">Live Snapshot</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-amber-300">
                <span>Searches:</span>
                <span className="font-bold">{searchPoints[hoveredPoint].val.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-blue-300">
                <span>Compares:</span>
                <span className="font-bold">{comparePoints[hoveredPoint].val.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-emerald-300">
                <span>Outbound Clicks:</span>
                <span className="font-bold">{clickPoints[hoveredPoint].val.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Middle Grid: Outbound Distribution Donut & Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Outbound Referral Market Share Donut Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4 text-blue-500" />
              <span>Outbound Referral Conversion Share</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Decoupled Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-44 h-44 transform -rotate-90">
                {(() => {
                  let accumulatedPercent = 0;
                  return DONUT_DATA.map((item, idx) => {
                    const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += item.percentage;

                    const isHovered = hoveredDonutSlice === idx;

                    return (
                      <circle
                        key={idx}
                        cx="80"
                        cy="80"
                        r="60"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={isHovered ? "22" : "18"}
                        pathLength="100"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredDonutSlice(idx)}
                        onMouseLeave={() => setHoveredDonutSlice(null)}
                      />
                    );
                  });
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                  81.7K
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Total Visits</span>
              </div>
            </div>

            {/* Legend & Breakdown Table */}
            <div className="space-y-2.5">
              {DONUT_DATA.map((item, idx) => {
                const isHovered = hoveredDonutSlice === idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDonutSlice(idx)}
                    onMouseLeave={() => setHoveredDonutSlice(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isHovered
                        ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-900 dark:text-slate-200">{item.broker}</span>
                      </div>
                      <span className="font-mono font-black text-slate-800 dark:text-slate-300">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 pl-5">
                      <span>{item.clicks.toLocaleString()} clicks</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Verified Direct</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conversion Funnel Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-500" />
              <span>Research Conversion Funnel</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">19.5% Overall</span>
          </div>

          <div className="space-y-4">
            {[
              { step: "1. Directory Impressions", count: "418,920", pct: 100, color: "bg-amber-500", note: "Top-of-funnel traffic" },
              { step: "2. Compare Tool Runs", count: "92,410", pct: 22.1, color: "bg-blue-500", note: "22.1% conversion" },
              { step: "3. Broker Finder Quiz", count: "34,180", pct: 8.2, color: "bg-purple-500", note: "37.0% quiz conversion" },
              { step: "4. Outbound Referral Click", count: "81,700", pct: 19.5, color: "bg-emerald-500", note: "Final outbound exit" },
            ].map((st, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{st.step}</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{st.count}</span>
                </div>

                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${st.color} rounded-full transition-all duration-500`}
                    style={{ width: `${st.pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{st.note}</span>
                  <span>{st.pct}% of initial</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Grid: Search Queries & Regional Breakdown ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Research Search Queries */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-amber-500" />
              <span>Top Research Search Queries (Volume &amp; Share)</span>
            </h3>
          </div>

          <div className="space-y-3.5">
            {[
              { query: "Lowest spread ECN brokers", count: 24800, share: 28, trend: "+18%" },
              { query: "FCA regulated scalping brokers", count: 18400, share: 21, trend: "+12%" },
              { query: "VTIndex ASIC license check", count: 14200, share: 16, trend: "+24%" },
              { query: "TradingView direct integration brokers", count: 11900, share: 13, trend: "+9%" },
              { query: "Zero deposit MT5 brokers", count: 9800, share: 11, trend: "+5%" },
            ].map((q, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{q.query}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-amber-700 dark:text-amber-400 font-bold">{q.count.toLocaleString()}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{q.trend}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${(q.share / 30) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Jurisdiction Traffic Share */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              <span>Traffic by Regulatory Jurisdiction</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Tier-1 Priority</span>
          </div>

          <div className="space-y-3.5">
            {JURISDICTION_DATA.map((j, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{j.flag}</span>
                    <span>{j.name}</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-500">{j.count}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{j.share}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${j.color} rounded-full transition-all duration-300`}
                    style={{ width: `${j.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
