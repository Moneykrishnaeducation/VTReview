import { Outlet, useLocation } from "react-router";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function RoutedLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      storageKey="vite-ui-theme"
    >
      <div className={isLoginPage ? "h-svh" : "grid h-svh grid-rows-[auto_1fr]"}>
        {!isLoginPage && <Header />}
        <Outlet />
      </div>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default function AppShell() {
  return <RoutedLayout />;
}

