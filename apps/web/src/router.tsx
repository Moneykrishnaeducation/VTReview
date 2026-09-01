import { createBrowserRouter } from "react-router";

import AppShell from "./app-shell";
import Home from "./routes/home";
import BrokerDetail from "./routes/broker";
import Rankings from "./routes/rankings";
import Compare from "./routes/compare";
import Search from "./routes/search";
import AdminDashboard from "./routes/admin";

function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground">The requested page could not be found.</p>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "broker/:id", element: <BrokerDetail /> },
      { path: "rankings", element: <Rankings /> },
      { path: "compare", element: <Compare /> },
      { path: "search", element: <Search /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
