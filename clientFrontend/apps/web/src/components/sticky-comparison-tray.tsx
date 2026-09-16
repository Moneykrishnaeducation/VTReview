import React from "react";
import { Link, useLocation } from "react-router";
import { useComparison } from "@/lib/comparison-context";
import { Scale, X, Plus, ArrowRight, Trash2 } from "lucide-react";

export default function StickyComparisonTray() {
  const { selectedBrokers, removeBroker, clearBrokers } = useComparison();
  const location = useLocation();

  // If on compare page or no brokers selected, hide tray
  if (location.pathname === "/compare" || selectedBrokers.length === 0) {
    return null;
  }

  return (
    <aside aria-label="Comparison Tray" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white border-t border-slate-700 shadow-2xl py-2.5 px-4 animate-in slide-in-from-bottom duration-200">
      <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Tray Title & Count */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>Comparison Tray</span>
              <span className="px-1.5 py-0.2 bg-slate-800 text-amber-400 border border-slate-700 rounded text-[11px]">
                {selectedBrokers.length}/4 Selected
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              Side-by-side spread, regulation, and platform matrix
            </div>
          </div>
        </div>

        {/* Center: Selected Broker Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {selectedBrokers.map((broker) => (
            <div
              key={broker.id}
              className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs shrink-0"
            >
              <div className="h-4 w-4 bg-slate-700 rounded text-[9px] font-bold flex items-center justify-center text-slate-300">
                {broker.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="font-semibold text-slate-200">{broker.name}</span>
              <span className="text-[10px] text-amber-400">★{broker.editorialRating}</span>
              <button
                onClick={() => removeBroker(broker.id)}
                className="text-slate-400 hover:text-red-400 p-0.5 rounded ml-1"
                title={`Remove ${broker.name} from comparison`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {selectedBrokers.length < 4 && (
            <Link
              to="/brokers"
              className="flex items-center gap-1 border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md px-2.5 py-1 text-xs transition-colors shrink-0"
            >
              <Plus className="h-3 w-3" />
              <span>Add Broker ({4 - selectedBrokers.length} slots left)</span>
            </Link>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearBrokers}
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 flex items-center gap-1"
            title="Clear all selected brokers"
          >
            <Trash2 className="h-3 w-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <span>Compare Now ({selectedBrokers.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
