import type { RouteObject } from "react-router";
import Login from "../pages/Login";
import AdminDashboard from "@/routes/admin";

/**
 * Dedicated route definitions for the ControlCenter module.
 * Can be used as sub-routes under `/control-center` or directly at root when accessed via `author.localhost`.
 */
export const controlCenterChildRoutes: RouteObject[] = [
  { index: true, element: <Login /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Login initialMode="signup" /> },
  { path: "register", element: <Login initialMode="signup" /> },
  { path: "forgot-password", element: <Login initialMode="forgot" /> },
  { path: "admin", element: <AdminDashboard /> },
  { path: "dashboard", element: <AdminDashboard /> },
];

/**
 * Dedicated standalone routes for author.localhost host/subdomain.
 */
export const authorSubdomainRoutes: RouteObject[] = [
  {
    path: "/",
    children: controlCenterChildRoutes,
  },
];

export default controlCenterChildRoutes;
