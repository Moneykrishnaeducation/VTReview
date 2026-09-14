import React, { useState } from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  Star,
  ThumbsUp,
  Flag,
  ShieldCheck,
  Filter,
  CheckCircle2,
  ChevronDown,
  PenLine,
} from "lucide-react";
import { BROKERS, type UserReview } from "@/data/broker-directory-data";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function UserReviewsHub() {
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("helpful");

  // Gather all reviews across brokers
  const allReviews: (UserReview & { brokerName: string; brokerSlug: string })[] = [];
  BROKERS.forEach((b) => {
    b.userReviews.forEach((rev) => {
      allReviews.push({ ...rev, brokerName: b.name, brokerSlug: b.slug });
    });
  });

  const filteredReviews = allReviews.filter((rev) => {
    if (ratingFilter !== "all" && rev.rating !== parseInt(ratingFilter)) return false;
    if (verifiedOnly && !rev.verifiedLiveAccount) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <UxAnnotation tag="SCREEN 08 — USER REVIEWS COMMUNITY HUB">
          Community user reviews dashboard. Distinctly separated from weighted editorial scores. Highlights <strong>"Verified Live Account Trader"</strong> badges and structured pros/cons.
        </UxAnnotation>

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">User Reviews</span>
        </div>

        {/* Header Intro & Rating Distribution Grid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
                <MessageSquare className="h-4 w-4" />
                <span>Trader Community Hub</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Real Trader Reviews & Ratings
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Transparent experiences submitted by real live account traders. Every submission is screened against platform anti-fraud rules.
              </p>
              <Link
                to="/reviews/write"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <PenLine className="h-4 w-4" />
                <span>Write a Broker Review</span>
              </Link>
            </div>

            {/* Overall Score & Distribution (8-Cols) */}
            <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
              <div className="text-center sm:text-left sm:border-r border-slate-200 dark:border-slate-700 sm:pr-4">
                <div className="text-xs font-bold text-slate-400 uppercase">Average User Score</div>
                <div className="text-4xl font-black text-slate-900 dark:text-white mt-1">4.7</div>
                <div className="flex justify-center sm:justify-start gap-1 my-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <div className="text-[11px] text-slate-500">Based on 8,400+ verified ratings</div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                {[
                  { star: "5 Stars", pct: 74, count: "6,216" },
                  { star: "4 Stars", pct: 18, count: "1,512" },
                  { star: "3 Stars", pct: 5, count: "420" },
                  { star: "2 Stars", pct: 2, count: "168" },
                  { star: "1 Star", pct: 1, count: "84" },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-2 text-[11px]">
                    <span className="w-14 text-slate-500">{item.star}</span>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 dark:bg-slate-100 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="w-10 text-right text-slate-400 font-mono">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified Live Account Traders Only
              </span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rating:</span>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border rounded px-2 py-1"
              >
                <option value="all">All Stars (1–5)</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border rounded px-2 py-1 font-semibold"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Reviews Feed */}
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {rev.author}
                      <span className="text-xs text-slate-400 font-normal">({rev.country})</span>
                      {rev.verifiedLiveAccount && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Verified Trader
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Reviewed: <Link to={`/brokers/${rev.brokerSlug}`} className="font-bold text-slate-700 dark:text-slate-300 hover:underline">{rev.brokerName}</Link> • {rev.accountType} • {rev.platform}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 justify-end">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                "{rev.headline}"
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {rev.review}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 bg-emerald-50/40 rounded border border-emerald-200">
                  <strong className="text-emerald-800 text-[10px] block">👍 PRO:</strong>
                  <span className="text-slate-700">{rev.pros}</span>
                </div>
                <div className="p-2.5 bg-rose-50/40 rounded border border-rose-200">
                  <strong className="text-rose-800 text-[10px] block">👎 CON:</strong>
                  <span className="text-slate-700">{rev.cons}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ThumbsUp className="h-3 w-3" /> Helpful ({rev.helpfulCount})
                  </button>
                  <button className="flex items-center gap-1 hover:text-red-500">
                    <Flag className="h-3 w-3" /> Report
                  </button>
                </div>
                <span className="text-slate-400">Experience: {rev.experience}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
