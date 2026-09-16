import { createBrowserRouter, Navigate } from "react-router";

import AppShell from "./app-shell";
import Dashboard from "./routes/dashboard";
import BrokerList from "./routes/brokers/broker-list";
import BrokerDetail from "./routes/brokers/broker-detail";
import VerificationQueue from "./routes/regulation/verification-queue";
import RegulatorsList from "./routes/regulation/regulators-list";
import EvidenceLibrary from "./routes/evidence/evidence-library";
import RatingManagement from "./routes/ratings/rating-management";
import ReviewModeration from "./routes/reviews/review-moderation";
import ComplaintManagement from "./routes/complaints/complaint-management";
import EditorialCms from "./routes/editorial/editorial-cms";
import UserManagement from "./routes/users/user-management";
import RolesPermissions from "./routes/users/roles-permissions";
import AnalyticsDashboard from "./routes/analytics/analytics-dashboard";
import DataQualityDashboard from "./routes/data-quality/data-quality-dashboard";
import JobQueues from "./routes/operations/job-queues";
import AuditLogs from "./routes/audit-logs/audit-logs";
import NotificationsCenter from "./routes/notifications/notifications-center";
import SystemSettings from "./routes/settings/system-settings";

function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <div className="font-mono text-5xl font-black text-amber-500">404</div>
      <h1 className="text-xl font-bold text-white">Administrative Route Not Found</h1>
      <p className="text-xs text-slate-400">The requested operations module or entity workspace does not exist.</p>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },

      // Research & Brokers
      { path: "brokers", element: <BrokerList /> },
      { path: "brokers/:id", element: <BrokerDetail /> },
      { path: "ratings", element: <RatingManagement /> },
      { path: "evidence", element: <EvidenceLibrary /> },

      // Regulation
      { path: "regulation/verification", element: <VerificationQueue /> },
      { path: "regulation/regulators", element: <RegulatorsList /> },

      // Community & Disputes
      { path: "reviews", element: <ReviewModeration /> },
      { path: "complaints", element: <ComplaintManagement /> },

      // Editorial
      { path: "editorial", element: <EditorialCms /> },
      { path: "editorial/guides", element: <EditorialCms /> },
      { path: "editorial/guides/:id", element: <EditorialCms /> },

      // Users & RBAC
      { path: "users", element: <UserManagement /> },
      { path: "roles", element: <RolesPermissions /> },

      // Intelligence & Quality
      { path: "analytics", element: <AnalyticsDashboard /> },
      { path: "data-quality", element: <DataQualityDashboard /> },
      { path: "operations", element: <JobQueues /> },

      // Governance
      { path: "audit-logs", element: <AuditLogs /> },
      { path: "notifications", element: <NotificationsCenter /> },
      { path: "settings", element: <SystemSettings /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
