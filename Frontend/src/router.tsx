import { createBrowserRouter } from "react-router";

import AppShell from "./app-shell";
import Home from "./routes/home";
import BrokerDirectory from "./routes/broker-directory";
import BrokerReviewDetail from "./routes/broker-review-detail";
import ComparisonBuilder from "./routes/comparison-builder";
import BrokerFinderWizard from "./routes/broker-finder-wizard";
import BestBrokersCategory from "./routes/best-brokers-category";
import RegulationHub from "./routes/regulation-hub";
import RegulatorDetail from "./routes/regulator-detail";
import UserReviewsHub from "./routes/user-reviews-hub";
import WriteReviewFlow from "./routes/write-review-flow";
import GuidesHub from "./routes/guides-hub";
import ToolsDashboard from "./routes/tools-dashboard";
import ComplaintsHub from "./routes/complaints-hub";
import RatingMethodology from "./routes/rating-methodology";
import Login from "./ControlCenter/Login";
import AdminDashboard from "./routes/admin";

function NotFound() {
  return (
    <main className="max-w-[1240px] mx-auto px-4 py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
        404
      </div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-xs text-slate-500 mb-6">The requested wireframe screen does not exist.</p>
      <a href="/" className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold">
        Return to Wireframe Home
      </a>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "control-center/login", element: <Login /> },
      { path: "signup", element: <Login initialMode="signup" /> },
      { path: "register", element: <Login initialMode="signup" /> },
      { path: "forgot-password", element: <Login initialMode="forgot" /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "brokers", element: <BrokerDirectory /> },
      { path: "brokers/:id", element: <BrokerReviewDetail /> },
      { path: "broker/:id", element: <BrokerReviewDetail /> },
      { path: "compare", element: <ComparisonBuilder /> },
      { path: "tools/broker-finder", element: <BrokerFinderWizard /> },
      { path: "best-brokers/:category", element: <BestBrokersCategory /> },
      { path: "regulation", element: <RegulationHub /> },
      { path: "regulation/:regulatorId", element: <RegulatorDetail /> },
      { path: "reviews", element: <UserReviewsHub /> },
      { path: "reviews/write", element: <WriteReviewFlow /> },
      { path: "guides", element: <GuidesHub /> },
      { path: "guides/:slug", element: <GuidesHub /> },
      { path: "tools", element: <ToolsDashboard /> },
      { path: "tools/cost-calculator", element: <ToolsDashboard /> },
      { path: "complaints", element: <ComplaintsHub /> },
      { path: "how-we-rate", element: <RatingMethodology /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
