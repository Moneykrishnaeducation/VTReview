import React, { useState } from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-colors cursor-pointer flex items-center justify-center"
        title="Toggle Theme (Light / Dark / System)"
        aria-label="Toggle Theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Light</span>
            </div>
            {theme === "light" && <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />}
          </button>

          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer ${
              theme === "dark"
                ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="h-3.5 w-3.5 text-cyan-400" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <Check className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />}
          </button>

          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer ${
              theme === "system"
                ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Monitor className="h-3.5 w-3.5 text-slate-500" />
              <span>System</span>
            </div>
            {theme === "system" && <Check className="h-3.5 w-3.5 text-slate-900 dark:text-slate-100" />}
          </button>
        </div>
      )}
    </div>
  );
}
