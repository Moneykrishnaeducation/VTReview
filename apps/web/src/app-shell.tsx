import React from "react";
import { Outlet } from "react-router";

import GlobalHeader from "@/components/global-header";
import GlobalFooter from "@/components/global-footer";
import WireframeToolbar from "@/components/wireframe-toolbar";
import StickyComparisonTray from "@/components/sticky-comparison-tray";
import { ComparisonProvider, useComparison } from "@/lib/comparison-context";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function LayoutContent() {
  const { viewportMode } = useComparison();

  const getViewportContainerClass = () => {
    switch (viewportMode) {
      case "desktop":
        return "max-w-[1240px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 min-h-screen my-4 rounded-lg overflow-hidden";
      case "tablet":
        return "max-w-[768px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 min-h-screen my-4 rounded-lg overflow-hidden";
      case "mobile":
        return "max-w-[390px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 min-h-screen my-4 rounded-lg overflow-hidden";
      default:
        return "w-full min-h-screen";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      <WireframeToolbar />
      <div className={getViewportContainerClass()}>
        <GlobalHeader />
        <main className="flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <GlobalFooter />
      </div>
      <StickyComparisonTray />
      <Toaster richColors />
    </div>
  );
}

export default function AppShell() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="wikiifx-theme"
    >
      <AuthProvider>
        <ComparisonProvider>
          <LayoutContent />
        </ComparisonProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

