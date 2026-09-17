import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileEdit,
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building,
  Mail,
  FileText,
  Minus,
} from "lucide-react";
import { toast } from "sonner";

export default function InformationCorrectionModal() {
  const navigate = useNavigate();
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Form states
  const [brokerName, setBrokerName] = useState("");
  const [category, setCategory] = useState("license");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitted(true);
    toast.success("Correction request submitted for editorial review!");
    setTimeout(() => {
      setIsFormModalOpen(false);
      setIsSubmitted(false);
      setBrokerName("");
      setDescription("");
      setEmail("");
    }, 1500);
  };

  return (
    <>
      {/* 1. FIXED FLOATING YELLOW BUTTON AT BOTTOM RIGHT */}
      <button
        onClick={() => setIsBannerOpen(!isBannerOpen)}
        className="fixed bottom-4 right-20 z-40 bg-[#FFD200] hover:bg-[#F2C700] text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer border border-amber-400/50 transition-all hover:scale-105"
        title="Information Correction"
        aria-label="Information Correction"
      >
        <FileEdit className="h-4 w-4 text-slate-950" />
        <span className="text-xs font-bold tracking-tight">Information Correction</span>
      </button>

      {/* 2. YELLOW POPUP BANNER ABOVE THE BUTTON (Matching image.png) */}
      {isBannerOpen && (
        <div className="fixed bottom-20 right-4 z-40 max-w-sm w-80 sm:w-96 bg-[#FFD200] border border-amber-400 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 text-slate-950">
          {/* Top-Right Minimize (-) Button */}
          <button
            onClick={() => setIsBannerOpen(false)}
            className="absolute right-3.5 top-3.5 h-6 w-6 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Minimize"
          >
            <Minus className="h-3.5 w-3.5 stroke-[3]" />
          </button>

          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 pr-2">
              <h3 className="text-base sm:text-lg font-black leading-tight text-slate-950 tracking-tight">
                Request Information<br />Correction
              </h3>
              <p className="text-xs font-medium text-slate-900 mt-2 mb-4 leading-snug max-w-[210px]">
                We will proactively contact you within 2 business days.
              </p>

              {/* Fill in Information Dark Button */}
              <button
                onClick={() => {
                  setIsBannerOpen(false);
                  navigate("/contact");
                }}
                className="bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.02]"
              >
                Fill in Information
              </button>
            </div>

            {/* Vector Illustration Graphic */}
            <div className="w-24 h-24 shrink-0 flex items-center justify-center relative">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                <rect x="25" y="15" width="70" height="90" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2"/>
                <rect x="35" y="25" width="50" height="6" rx="3" fill="#3B82F6"/>
                <rect x="35" y="37" width="35" height="4" rx="2" fill="#94A3B8"/>
                <rect x="35" y="47" width="45" height="4" rx="2" fill="#CBD5E1"/>
                <rect x="35" y="57" width="40" height="4" rx="2" fill="#CBD5E1"/>

                {/* Person 1 */}
                <circle cx="38" cy="82" r="9" fill="#3B82F6"/>
                <path d="M26 102 C26 92 32 87 38 87 C44 87 50 92 50 102 Z" fill="#1E40AF"/>

                {/* Person 2 */}
                <circle cx="82" cy="82" r="9" fill="#F59E0B"/>
                <path d="M70 102 C70 92 76 87 82 87 C88 87 94 92 94 102 Z" fill="#D97706"/>

                {/* Pencil */}
                <path d="M75 18 L92 35 L87 40 L70 23 Z" fill="#FF5722"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 3. FORM MODAL DIALOG (Opened when clicking "Fill in Information") */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFormModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Request Information Correction
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Submit details of any discrepancy for prompt editorial review
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Correction Submitted!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Our compliance team will audit the reported data and contact you within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Broker / Entity Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Broker / Entity Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. IC Markets, Pepperstone..."
                      value={brokerName}
                      onChange={(e) => setBrokerName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Correction Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Correction Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="license">Inaccurate Regulatory License / Register No.</option>
                    <option value="spreads">Outdated Spreads, Fees or Leverage Info</option>
                    <option value="website">Incorrect Official Website or HQ Address</option>
                    <option value="complaint">Unresolved Dispute Update</option>
                    <option value="other">Other Fact Correction</option>
                  </select>
                </div>

                {/* Correction Details */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Details of Inaccuracy & Correct Data <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide the exact discrepancy and link to official source or register..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                    />
                  </div>
                </div>

                {/* Submitter Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Contact Email <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="contact@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Submit Correction</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
