import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { GlobalSearchModal } from "./global-search-modal";
import { EvidenceModal } from "./evidence-modal";
import { ChevronRight, Home } from "lucide-react";

export function AdminShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Generate simple breadcrumbs from pathname
  const pathParts = location.pathname.split("/").filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <AdminSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <AdminHeader isSidebarCollapsed={isSidebarCollapsed} />

      {/* Main Content Area */}
      <main
        className={`flex-1 pt-14 transition-all duration-300 flex flex-col pl-0 min-w-0 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Breadcrumbs Toolbar */}
        <div className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-8 py-2.5 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar">
          <Link to="/dashboard" className="hover:text-amber-600 dark:hover:text-white flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Link>

          {pathParts.map((part, index) => {
            const url = `/${pathParts.slice(0, index + 1).join("/")}`;
            const isLast = index === pathParts.length - 1;
            const formatted = part
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <React.Fragment key={url}>
                <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-amber-400 truncate max-w-[200px]">{formatted}</span>
                ) : (
                  <Link to={url} className="hover:text-white truncate max-w-[150px]">
                    {formatted}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Screen Outlet */}
        <div className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Global Modals */}
      <GlobalSearchModal />
      <EvidenceModal />
    </div>
  );
}
