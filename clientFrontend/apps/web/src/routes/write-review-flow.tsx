import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  PenLine,
  Star,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { BROKERS } from "@/data/broker-directory-data";
import { UxAnnotation } from "@/components/ui/wireframe-components";

export default function WriteReviewFlow() {
  const [selectedBroker, setSelectedBroker] = useState("pepperstone");
  const [overallRating, setOverallRating] = useState(5);
  const [executionRating, setExecutionRating] = useState(5);
  const [spreadRating, setSpreadRating] = useState(5);
  const [supportRating, setSupportRating] = useState(4);
  const [headline, setHeadline] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("2-5 years");
  const [declaredLegal, setDeclaredLegal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !reviewBody || !declaredLegal) {
      alert("Please complete the required review fields and confirm independence.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
      <div className="max-w-[760px] mx-auto">
        <UxAnnotation tag="SCREEN 11 — WRITE A REVIEW (MULTI-STEP SUBMISSION FLOW)">
          Structured review submission flow. Requires independent declaration of non-commercial relationship and optional statement upload to grant the <strong>Verified Live Account</strong> badge.
        </UxAnnotation>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link to="/reviews" className="hover:underline">User Reviews</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Write a Review</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <PenLine className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Submit an Independent Trader Review
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Help the global trading community by providing an honest account of execution speed, spreads, and withdrawal handling.
                </p>
              </div>

              {/* 1. Broker Selection */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1.5">
                  1. Select the Broker You Traded With:
                </label>
                <select
                  value={selectedBroker}
                  onChange={(e) => setSelectedBroker(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                >
                  {BROKERS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.primaryLicense})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Star Ratings */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1.5">
                  2. Overall Star Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setOverallRating(star)}
                      className={`p-2 rounded-md border ${
                        star <= overallRating
                          ? "bg-amber-50 text-amber-500 border-amber-300"
                          : "bg-slate-50 text-slate-300 border-slate-200"
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 text-sm">
                    {overallRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* 3. Detailed Breakdown Ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Execution Speed:</label>
                  <select
                    value={executionRating}
                    onChange={(e) => setExecutionRating(parseInt(e.target.value))}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border rounded text-xs"
                  >
                    <option value={5}>5 - Ultra Fast / No Slippage</option>
                    <option value={4}>4 - Good Execution</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Frequent Slippage</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Spreads & Fees:</label>
                  <select
                    value={spreadRating}
                    onChange={(e) => setSpreadRating(parseInt(e.target.value))}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border rounded text-xs"
                  >
                    <option value={5}>5 - True Raw 0.0 Pips</option>
                    <option value={4}>4 - Competitive</option>
                    <option value={3}>3 - High Spreads</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Support:</label>
                  <select
                    value={supportRating}
                    onChange={(e) => setSupportRating(parseInt(e.target.value))}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border rounded text-xs"
                  >
                    <option value={5}>5 - Immediate & Helpful</option>
                    <option value={4}>4 - Fast Response</option>
                    <option value={3}>3 - Slow Queue</option>
                  </select>
                </div>
              </div>

              {/* 4. Review Headline & Body */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  3. Review Headline:
                </label>
                <input
                  type="text"
                  placeholder="E.g., Fast withdrawals and ultra-tight spreads on London open"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  4. Detailed Review (Minimum 100 characters):
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details about deposit/withdrawal speed, slippage during news events, customer support responsiveness, and platform stability..."
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    Key Pro / Advantage:
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Zero deposit fees, fast payouts"
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-rose-700 dark:text-rose-400 block mb-1">
                    Key Con / Limitation:
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Weekend chat is automated"
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs"
                  />
                </div>
              </div>

              {/* 5. Statement Upload for Verified Trader Badge */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl">
                <div className="font-bold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Get a "Verified Live Account Trader" Badge (Optional)
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-3">
                  Upload an account statement header or redacted trade ticket screenshot. Confidential data is automatically redacted.
                </p>
                <div className="border border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-4 text-center bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50">
                  <Upload className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                    Click to select file or drag & drop screenshot
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, PDF up to 10MB</div>
                </div>
              </div>

              {/* 6. Legal Independence Declaration */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={declaredLegal}
                    onChange={(e) => setDeclaredLegal(e.target.checked)}
                    className="rounded text-slate-900 mt-0.5"
                  />
                  <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    I declare under penalty of platform ban that this review reflects my genuine, firsthand personal trading experience and that I have no commercial affiliation, paid arrangement, or conflict of interest with this broker or its competitors.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <Link to="/reviews" className="text-slate-500 font-bold hover:underline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-lg shadow-sm"
                >
                  Submit Review for Verification →
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation Success State */
            <div className="py-12 text-center space-y-4">
              <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Review Submitted Successfully
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Thank you for contributing to the independent trader community. Your review will be published to the broker directory following standard anti-spam audit.
              </p>
              <div className="pt-4">
                <Link
                  to="/reviews"
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-lg inline-block"
                >
                  Return to Reviews Hub
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
