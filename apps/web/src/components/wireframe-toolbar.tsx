import React from "react";
import { Link, useLocation } from "react-router";
import { useComparison, type ViewportMode } from "@/lib/comparison-context";
import { Monitor, Tablet, Smartphone, Maximize2, Tag, ChevronDown, CheckCircle2, ShieldCheck } from "lucide-react";

export default function WireframeToolbar() {
  const { viewportMode, setViewportMode, showAnnotations, toggleAnnotations } = useComparison();
  const location = useLocation();

  const screens = [
    { name: "Screen 01: Homepage", path: "/" },
    { name: "Screen 02: Broker Directory", path: "/brokers" },
    { name: "Screen 03: Broker Review (Pepperstone)", path: "/brokers/pepperstone" },
    { name: "Screen 04: Comparison Builder", path: "/compare" },
    { name: "Screen 05: Broker Finder (5-Step)", path: "/tools/broker-finder" },
    { name: "Screen 06: Best for Beginners", path: "/best-brokers/beginners" },
    { name: "Screen 06b: Best Low Spreads", path: "/best-brokers/low-spreads" },
    { name: "Screen 07: Regulation Hub", path: "/regulation" },
    { name: "Screen 08: User Reviews Hub", path: "/reviews" },
    { name: "Screen 09: Trading Costs Guide", path: "/guides/trading-costs" },
    { name: "Screen 10: Tools & Cost Calculator", path: "/tools" },
    { name: "Screen 11: Write a Review Flow", path: "/reviews/write" },
    { name: "Screen 12: Complaints / Exposure Hub", path: "/complaints" },
    { name: "Screen 13: FCA Regulator Detail", path: "/regulation/fca" },
    { name: "Screen 14: 120-Point Rating Methodology", path: "/how-we-rate" },
  ];

  return (
    <aside aria-label="High-Fidelity Research System Control Bar" className="sticky top-0 z-50 bg-slate-900 text-slate-200 border-b border-slate-700 px-3 py-1.5 text-xs select-none shadow-md">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: System Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold tracking-wider text-emerald-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            HIGH-FIDELITY RESEARCH SYSTEM
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Independent Financial Research & Broker Intelligence Engine
          </span>
        </div>

        {/* Center: Quick Screen Jumper */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 hidden md:inline">Jump to Screen:</label>
          <div className="relative">
            <select
              value={location.pathname}
              onChange={(e) => {
                window.location.href = e.target.value;
              }}
              className="bg-slate-800 text-slate-100 border border-slate-600 rounded px-2.5 py-1 text-xs appearance-none pr-7 cursor-pointer hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {screens.map((s) => (
                <option key={s.path} value={s.path}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Viewport Simulator & UX Annotations Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAnnotations}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
              showAnnotations
                ? "bg-blue-600 border-blue-400 text-white font-semibold"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
            title="Toggle UX Design Architecture Notes & Rationale"
          >
            <Tag className="h-3 w-3" />
            <span>{showAnnotations ? "Annotations ON" : "Show UX Notes"}</span>
          </button>

          <div className="hidden lg:flex items-center bg-slate-800 border border-slate-700 rounded p-0.5 gap-0.5">
            <button
              onClick={() => setViewportMode("fluid")}
              className={`p-1 rounded ${viewportMode === "fluid" ? "bg-slate-700 text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
              title="Full Width (Responsive Fluid)"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewportMode("desktop")}
              className={`p-1 rounded ${viewportMode === "desktop" ? "bg-slate-700 text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
              title="Desktop 1240px Wireframe Frame"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewportMode("tablet")}
              className={`p-1 rounded ${viewportMode === "tablet" ? "bg-slate-700 text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
              title="Tablet 768px Wireframe Frame"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewportMode("mobile")}
              className={`p-1 rounded ${viewportMode === "mobile" ? "bg-slate-700 text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
              title="Mobile 390px Wireframe Frame"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
