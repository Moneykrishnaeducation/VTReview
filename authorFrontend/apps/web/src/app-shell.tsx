import React from "react";
import { AdminProvider } from "./context/admin-context";
import { AdminShell } from "./components/admin-shell";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

export default function AppShell() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      storageKey="wikifx-admin-theme"
    >
      <AdminProvider>
        <AdminShell />
        <Toaster richColors />
      </AdminProvider>
    </ThemeProvider>
  );
}
