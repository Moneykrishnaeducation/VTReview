import React, { useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileCheck,
  ChevronDown,
  Filter,
} from "lucide-react";
import { MOCK_COMPLAINTS, type ComplaintItem } from "@/data/broker-directory-data";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function ComplaintsHub() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredComplaints = MOCK_COMPLAINTS.filter((c) => {
    if (selectedStatus !== "all" && c.status !== selectedStatus) return false;
    if (selectedCategory !== "all" && c.issueCategory !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 12 — COMPLAINTS & EXPOSURE DIRECTORY">
          Independent trader dispute resolution & exposure portal. Tracks broker response times, dispute mediation states, and verified withdrawal settlement confirmations.
        </UxAnnotation>

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Complaints & Exposure</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold mb-3">
            <AlertTriangle className="h-4 w-4" />
            <span>Trader Dispute & Exposure Portal</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Broker Complaints & Dispute Exposure
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Public transparency log documenting reported withdrawal delays, unexpected slippage, and KYC disputes. We facilitate factual communication between traders and authorized compliance departments.
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border rounded px-2.5 py-1 font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="Resolved ✓">Resolved ✓</option>
                <option value="Broker Responded">Broker Responded</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Issue Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border rounded px-2.5 py-1 font-bold"
              >
                <option value="all">All Categories</option>
                <option value="Withdrawal Delay">Withdrawal Delay</option>
                <option value="Execution / Slippage">Execution / Slippage</option>
                <option value="Account Freeze">Account Freeze</option>
              </select>
            </div>
          </div>

          <div className="text-slate-500 font-bold">
            Showing {filteredComplaints.length} Logged Case Reports
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((comp) => (
            <div
              key={comp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 font-bold">#{comp.id}</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {comp.brokerName}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Trader in {comp.traderCountry} • Date: {comp.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-900 dark:text-white">
                    Amount: {comp.amountClaimed}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded font-bold text-[11px] ${
                      comp.status === "Resolved ✓"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                        : "bg-amber-50 text-amber-700 border border-amber-300"
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Issue: {comp.issueCategory}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  "{comp.headline}"
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {comp.details}
                </p>
              </div>

              {comp.brokerResponse && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 mt-3 text-[11px]">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Official Broker Compliance Response:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    "{comp.brokerResponse}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
