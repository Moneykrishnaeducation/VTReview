import React, { useState } from "react";
import {
  User,
  Mail,
  Building,
  Phone,
  MessageSquare,
  UploadCloud,
  X,
  CheckCircle2,
  Search,
  Send,
  HelpCircle,
  Sparkles,
  FileText,
  ShieldCheck,
  Award,
} from "lucide-react";
import { toast } from "sonner";

// Tab options matching reference design
const TABS = [
  { id: "cooperation", label: "Business Cooperation" },
  { id: "license", label: "License Update" },
  { id: "listing", label: "Submit for Listing" },
  { id: "feedback", label: "Feedback & Suggestions" },
  { id: "kol", label: "KOL Collaboration" },
  { id: "lcs", label: "LCS Cooperation" },
  { id: "support", label: "Support Verification" },
];

export default function Contact() {
  // Default to License Update tab as requested
  const [activeTab, setActiveTab] = useState("license");

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [regulator, setRegulator] = useState("FCA");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [weChat, setWeChat] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [otherApp, setOtherApp] = useState("Telegram");
  const [otherAccount, setOtherAccount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Character counter
  const maxCharCount = 500;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    if (photos.length + filesArray.length > 5) {
      toast.error("You can upload a maximum of 5 photos.");
      return;
    }

    const validFiles = filesArray.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 10MB limit.`);
        return false;
      }
      return true;
    });

    setPhotos((prev) => [...prev, ...validFiles]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !companyName.trim()) {
      toast.error("Please fill in all required fields (*).");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("License update request submitted for compliance verification!");
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setCompanyName("");
    setEmail("");
    setLicenseNumber("");
    setPhone("");
    setWeChat("");
    setWhatsApp("");
    setOtherAccount("");
    setPurpose("");
    setPhotos([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4">
      <div className="max-w-[1140px] mx-auto">
        {/* Page Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>WikiIFX Regulatory & License Update Desk</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            License Update & Verification Desk
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Submit regulatory license updates, official certificate amendments, or broker listing details directly to our auditing team.
          </p>
        </div>

        {/* 1. TOP TABS NAVIGATION BAR (Matching image.png) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs mb-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSubmitted(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-amber-400 dark:bg-amber-500 dark:text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN FORM CONTAINER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl relative">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Submission Received!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Thank you for submitting your <strong>{TABS.find((t) => t.id === activeTab)?.label}</strong> request. Our compliance team will audit the regulatory details against official register databases and update the broker profile within 24–48 business hours.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Section Title (Matching image.png "Enter your details") */}
              <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Enter your details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Active Desk: <span className="font-semibold text-amber-500">{TABS.find((t) => t.id === activeTab)?.label}</span>
                </p>
              </div>

              {/* 2-COLUMN GRID INPUT FIELDS (Matching image.png layout for License Update) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* LEFT COLUMN */}
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      <span className="text-amber-500 mr-1">*</span>Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      <span className="text-amber-500 mr-1">*</span>Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Other Contact Methods Section */}
                  <div className="pt-2 space-y-4">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span className="text-amber-500 mr-1">*</span>Other Contact Methods
                    </label>

                    {/* Phone Number */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-blue-500" />
                        <span>Phone Number</span>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 shrink-0 font-medium"
                        >
                          <option value="+91">🇮🇳 IN (+91)</option>
                          <option value="+1">🇺🇸 US (+1)</option>
                          <option value="+44">🇬🇧 UK (+44)</option>
                          <option value="+971">🇦🇪 AE (+971)</option>
                          <option value="+65">🇸🇬 SG (+65)</option>
                          <option value="+61">🇦🇺 AU (+61)</option>
                          <option value="+852">🇭🇰 HK (+852)</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                        <span>WhatsApp</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Your WhatsApp Number"
                        value={whatsApp}
                        onChange={(e) => setWhatsApp(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">
                  {/* Your Company Name / Broker Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      <span className="text-amber-500 mr-1">*</span>Your Company Name?
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                      <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Regulatory License Info (Specific to License Update) */}
                  {activeTab === "license" && (
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                      <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Award className="h-3.5 w-3.5" />
                        <span>Regulatory License Details</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Regulator Authority
                          </label>
                          <select
                            value={regulator}
                            onChange={(e) => setRegulator(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
                          >
                            <option value="FCA">FCA (United Kingdom)</option>
                            <option value="ASIC">ASIC (Australia)</option>
                            <option value="CySEC">CySEC (Cyprus / EU)</option>
                            <option value="BaFin">BaFin (Germany)</option>
                            <option value="DFSA">DFSA (Dubai DIFC)</option>
                            <option value="FSCA">FSCA (South Africa)</option>
                            <option value="MAS">MAS (Singapore)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            License / Reg Number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. FCA 583261"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WeChat & Others Contact Section */}
                  <div className="pt-0 space-y-4">
                    {/* WeChat */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                        <span>WeChat</span>
                      </div>
                      <input
                        type="text"
                        placeholder="WeChat ID"
                        value={weChat}
                        onChange={(e) => setWeChat(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>

                    {/* Others Contact Apps */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Others</span>
                      </div>
                      <div className="space-y-2">
                        <select
                          value={otherApp}
                          onChange={(e) => setOtherApp(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                        >
                          <option value="Telegram">Messaging App (Telegram)</option>
                          <option value="Skype">Skype</option>
                          <option value="LinkedIn">LinkedIn Profile</option>
                          <option value="Line">LINE ID</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Linked App Account"
                          value={otherAccount}
                          onChange={(e) => setOtherAccount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. COOPERATION PURPOSE / LICENSE UPDATE NOTES (Matching image1.png) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  {activeTab === "license" ? "License Update Details & Official Notes" : "Cooperation Purpose"}
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={maxCharCount}
                    placeholder="Enter 0-500 characters describing the license update or proposal..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 resize-none transition-all"
                  />
                  <div className="absolute right-3.5 bottom-3 text-[10px] font-mono text-slate-400">
                    {purpose.length}/{maxCharCount}
                  </div>
                </div>
              </div>

              {/* 4. ADD PHOTOS / LICENSE CERTIFICATES (Matching image1.png) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Add photos ({photos.length}/5)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Photo Upload Box */}
                  <label className="h-20 w-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-amber-500">
                    <UploadCloud className="h-6 w-6" />
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded File Previews */}
                  {photos.map((file, idx) => (
                    <div
                      key={idx}
                      className="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative p-1 flex flex-col items-center justify-center text-center overflow-hidden group"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute right-1 top-1 p-0.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <FileText className="h-5 w-5 text-amber-500 mb-1" />
                      <span className="text-[9px] font-mono text-slate-600 dark:text-slate-300 truncate w-full px-1">
                        {file.name}
                      </span>
                    </div>
                  ))}

                  <p className="text-xs text-slate-400 ml-1">
                    Please upload the picture that smaller than 10M
                  </p>
                </div>
              </div>

              {/* 5. CENTERED SUBMIT BUTTON (Matching image1.png) */}
              <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-sm shadow-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
