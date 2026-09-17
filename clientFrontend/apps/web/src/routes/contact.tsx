import React, { useState } from "react";
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Headphones,
  Layers,
  ChevronRight,
  User,
  Mail,
  Building,
  Globe,
  Search,
  Phone,
  MessageSquare,
  Handshake,
  PlusCircle,
  Megaphone,
  Users,
  LifeBuoy,
  X,
  CheckCircle2,
  FileText,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

// Department categories matching reference design in image.png
const DEPARTMENTS = [
  {
    id: "cooperation",
    label: "Business Cooperation",
    subtext: "Partnerships, integrations & business queries",
    icon: Handshake,
  },
  {
    id: "license",
    label: "License Update",
    subtext: "Broker license information & regulatory updates",
    icon: ShieldCheck,
  },
  {
    id: "listing",
    label: "Submit for Listing",
    subtext: "List your platform or broker on VTReview",
    icon: PlusCircle,
  },
  {
    id: "feedback",
    label: "Feedback & Suggestions",
    subtext: "Share complaints, ideas & platform suggestions",
    icon: MessageSquare,
  },
  {
    id: "kol",
    label: "KOL Collaboration",
    subtext: "Influencer, affiliate & media collaborations",
    icon: Megaphone,
  },
  {
    id: "lcs",
    label: "LCS Cooperation",
    subtext: "Local community service representative application",
    icon: Users,
  },
  {
    id: "support",
    label: "Support Verification",
    subtext: "Account auditing & priority customer desk",
    icon: LifeBuoy,
  },
];

// Custom brand SVGs for contact methods matching design
function WeChatIcon() {
  return (
    <svg className="h-4 w-4 text-[#07C160] fill-current" viewBox="0 0 24 24">
      <path d="M8.5 3C4.36 3 1 5.91 1 9.5c0 2.05 1.05 3.88 2.7 5.12l-.7 2.58 2.75-1.38c.84.24 1.74.38 2.75.38 4.14 0 7.5-2.91 7.5-6.5S12.64 3 8.5 3zm-2 4.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm8.5 5.5c-3.31 0-6 2.24-6 5s2.69 5 6 5c.67 0 1.32-.1 1.94-.28l2.06 1.03-.52-1.93c1.3-1 2.02-2.38 2.02-3.82 0-2.76-2.69-5-6-5zm-2 3c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm3.5 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4 text-[#25D366] fill-current" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="h-4 w-4 text-[#5865F2] fill-current" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="h-4 w-4 text-[#229ED9] fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S16.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.752-.168.706-.428.943-.678.966-.546.05-.961-.36-1.492-.708-.83-.544-1.3-8.82-1.748-1.278l-1.235.856c-.276.27-.512.496-1.048.496-.535 0-.895-.226-1.43-.578l-3.376-2.222c-.636-.42-.588-1.036.096-1.428.178-.102 3.25-2.981 3.31-3.238.007-.032.014-.154-.058-.218-.073-.064-.18-.042-.258-.024-.11.025-1.87 1.188-5.28 3.493-.499.344-.95.512-1.353.503-.445-.01-.1.303-.217-1.428l-1.077-3.37c-.156-.488.24-.847.649-.688l13.197-5.088c.611-.23.1.144-.067.844z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3.75m0 0L7.5 8.25m4.5-4.5l4.5 4.5M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
    </svg>
  );
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState("cooperation");

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("IN0091");
  const [phone, setPhone] = useState("");
  const [weChat, setWeChat] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [otherApp, setOtherApp] = useState("Messaging App");
  const [otherAccount, setOtherAccount] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [nationality, setNationality] = useState("India");
  const [trc20Address, setTrc20Address] = useState("");
  const [discord, setDiscord] = useState("");
  const [telegram, setTelegram] = useState("");
  const [purpose, setPurpose] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Character counter limit
  const maxCharCount = 500;

  const currentDept = DEPARTMENTS.find((d) => d.id === activeTab) || DEPARTMENTS[0];
  const DeptIcon = currentDept.icon;

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
    if (activeTab === "kol") {
      if (!fullName.trim() || !trc20Address.trim()) {
        toast.error("Please fill in all required fields (*).");
        return;
      }
    } else if (activeTab === "feedback" || activeTab === "lcs" || activeTab === "support") {
      if (!fullName.trim() || !email.trim() || !companyName.trim()) {
        toast.error("Please fill in all required fields (*).");
        return;
      }
    } else {
      if (!fullName.trim() || !email.trim() || !companyName.trim() || !companyWebsite.trim()) {
        toast.error("Please fill in all required fields (*).");
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Submitted successfully!");
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setCompanyName("");
    setEmail("");
    setPhone("");
    setWeChat("");
    setWhatsApp("");
    setOtherApp("Messaging App");
    setOtherAccount("");
    setCompanyWebsite("");
    setNationality("India");
    setTrc20Address("");
    setDiscord("");
    setTelegram("");
    setPurpose("");
    setPhotos([]);
  };

  const isKolTab = activeTab === "kol";
  const isFeedbackTab = activeTab === "feedback";
  const isLcsTab = activeTab === "lcs";
  const isSupportTab = activeTab === "support";

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 md:px-8">
      <div className="max-w-[1240px] mx-auto">
        {/* Page Hero Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-[11px] font-bold tracking-wide uppercase mb-3 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>OFFICIAL WIKIIFX REVIEW SERVICE PORTAL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How can we <span className="text-amber-500">assist you</span> today?
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2.5 max-w-xl mx-auto font-medium">
            Select an inquiry department from the left menu list to get routed directly to our specialized support team.
          </p>

          {/* SLA Info Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>24–48h SLA Response</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Verified Desk Channel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Headphones className="h-4 w-4 text-blue-500" />
              <span>Priority Business Support</span>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: SIDEBAR + FORM CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: SELECT DEPARTMENT */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-bold tracking-wider uppercase">
                <Layers className="h-4 w-4 text-amber-500" />
                <span>SELECT DEPARTMENT</span>
              </div>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                7 Categories
              </span>
            </div>

            {/* Department List */}
            <div className="space-y-2">
              {DEPARTMENTS.map((dept) => {
                const IconComponent = dept.icon;
                const isActive = activeTab === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setActiveTab(dept.id);
                      setIsSubmitted(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between gap-3.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#131926] text-white shadow-md ring-1 ring-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-slate-900 dark:text-white"}`}>
                          {dept.label}
                        </h3>
                        <p className={`text-[10px] truncate mt-0.5 ${isActive ? "text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>
                          {dept.subtext}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT MAIN FORM CARD */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
            {/* Top Border Amber Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

            {isSubmitted ? (
              <div className="py-16 text-center space-y-4 max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Submission Received!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Thank you for submitting your request for <strong>{currentDept.label}</strong>. Our team will review your details and respond within 24–48 business hours.
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
                {/* Form Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                      <DeptIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {currentDept.label}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentDept.subtext}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-500">
                    * Required Fields
                  </span>
                </div>

                {/* SECTION 1: 1. PRIMARY INFORMATION */}
                <div>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-xs font-extrabold tracking-wider uppercase mb-5">
                    <User className="h-4 w-4" />
                    <span>1. PRIMARY INFORMATION</span>
                  </div>

                  {isKolTab ? (
                    /* KOL Specific Primary Info */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          <span className="text-rose-500 mr-1">*</span>Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          <span className="text-rose-500 mr-1">*</span>Nationality
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <select
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Singapore">Singapore</option>
                          </select>
                          <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">∨</span>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          <span className="text-rose-500 mr-1">*</span>TRC20 Address
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="Enter your TRC20 wallet address"
                            value={trc20Address}
                            onChange={(e) => setTrc20Address(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Primary Info Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      {/* * Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          <span className="text-rose-500 mr-1">*</span>Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* * Email Address */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          <span className="text-rose-500 mr-1">*</span>Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* * Company Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          <span className="text-rose-500 mr-1">*</span>
                          {isFeedbackTab ? "Company Name？" : isLcsTab || isSupportTab ? "Your Company Name？" : "Company Name"}
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder={isLcsTab || isSupportTab ? "Company Name" : "Enter company name"}
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                          />
                          <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                        </div>
                      </div>

                      {/* * Company Website */}
                      {!isFeedbackTab && (
                        <div>
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                            <span className="text-rose-500 mr-1">*</span>Company Website
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type="url"
                              required
                              placeholder="https://example.com"
                              value={companyWebsite}
                              onChange={(e) => setCompanyWebsite(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* SECTION 2: 2. CONTACT CHANNELS */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-extrabold tracking-wider uppercase mb-5">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                      <Phone className="h-4 w-4" />
                      <span>2. CONTACT CHANNELS</span>
                    </div>
                    <span className="text-rose-500 text-[11px] font-normal lowercase tracking-normal">
                      * Required contact channel
                    </span>
                  </div>

                  {isKolTab ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          <span>Email Address</span>
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <DiscordIcon />
                          <span>Discord</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter your Discord ID"
                          value={discord}
                          onChange={(e) => setDiscord(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <TelegramIcon />
                          <span>Telegram</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter your Telegram ID"
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          <span>Others</span>
                        </div>
                        <div className="space-y-2.5">
                          <input
                            type="text"
                            placeholder="Messaging App"
                            value={otherApp}
                            onChange={(e) => setOtherApp(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                          />
                          <input
                            type="text"
                            placeholder="Linked App Account"
                            value={otherAccount}
                            onChange={(e) => setOtherAccount(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      {/* Phone Number */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                          <span>Phone Number</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative shrink-0">
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="appearance-none bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <option value="IN0091">🇮🇳 IN 0091</option>
                              <option value="US0001">🇺🇸 US 0001</option>
                              <option value="UK0044">🇬🇧 UK 0044</option>
                              <option value="AE0971">🇦🇪 AE 0971</option>
                              <option value="SG0065">🇸🇬 SG 0065</option>
                            </select>
                            <span className="absolute right-2.5 top-3 text-[10px] text-slate-400 pointer-events-none">∨</span>
                          </div>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* WeChat */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <WeChatIcon />
                          <span>WeChat</span>
                        </div>
                        <input
                          type="text"
                          placeholder="WeChat ID"
                          value={weChat}
                          onChange={(e) => setWeChat(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <WhatsAppIcon />
                          <span>WhatsApp</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Your WhatsApp Number"
                          value={whatsApp}
                          onChange={(e) => setWhatsApp(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>

                      {/* Others */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          <span>Others</span>
                        </div>
                        <div className="space-y-2.5">
                          <input
                            type="text"
                            placeholder="Messaging App"
                            value={otherApp}
                            onChange={(e) => setOtherApp(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                          />
                          <input
                            type="text"
                            placeholder="Linked App Account"
                            value={otherAccount}
                            onChange={(e) => setOtherAccount(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 3: TEXTAREA & REMARKS */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isKolTab ? (
                      <>
                        <span className="text-rose-500 mr-1">*</span>Self-introduction
                      </>
                    ) : isFeedbackTab ? (
                      <>
                        <span className="text-rose-500 mr-1">*</span>Complaints or Suggestions
                      </>
                    ) : isLcsTab ? (
                      "Cooperation Purpose"
                    ) : isSupportTab ? (
                      "Description"
                    ) : (
                      "Remark"
                    )}
                  </label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      maxLength={maxCharCount}
                      placeholder="Enter 0-500 characters"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 resize-none transition-all"
                    />
                    <div className="absolute right-4 bottom-3 text-xs text-slate-400 font-mono">
                      {purpose.length}/{maxCharCount}
                    </div>
                  </div>
                </div>

                {/* SECTION 4: ADD PHOTOS (Enhanced Professional UI) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Add photos / Proof documents
                      </label>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {photos.length} / 5 uploaded
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Max 10MB per file
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5">
                    {/* Upload Trigger Button */}
                    {photos.length < 5 && (
                      <label className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-amber-500/5 hover:border-amber-500/70 text-slate-400 hover:text-amber-500 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group shrink-0 shadow-2xs">
                        <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-amber-500/50 flex items-center justify-center mb-1 group-hover:scale-110 transition-all shadow-xs">
                          <Upload className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <span className="text-[10px] font-bold tracking-tight text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                          Upload
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Uploaded File Previews with Image Thumbnails */}
                    {photos.map((file, idx) => {
                      const isImage = file.type.startsWith("image/");
                      const previewUrl = isImage ? URL.createObjectURL(file) : null;
                      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);

                      return (
                        <div
                          key={idx}
                          className="group relative h-20 w-20 sm:h-22 sm:w-22 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-2xs hover:shadow-md transition-all shrink-0"
                        >
                          {isImage && previewUrl ? (
                            <img
                              src={previewUrl}
                              alt={file.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center p-2 text-center bg-amber-500/5">
                              <FileText className="h-6 w-6 text-amber-500 mb-1" />
                              <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                                {file.name}
                              </span>
                              <span className="text-[8px] font-mono text-slate-400">
                                {fileSizeMb}MB
                              </span>
                            </div>
                          )}

                          {/* Hover Overlay with Delete Button */}
                          <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-200 flex flex-col items-center justify-center p-1 text-white">
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-transform transform hover:scale-110 shadow-md cursor-pointer mb-1"
                              title="Remove file"
                            >
                              <X className="h-3.5 w-3.5 stroke-[2.5]" />
                            </button>
                            <span className="text-[9px] font-medium text-white/90 truncate w-full text-center px-1">
                              {file.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Please upload pictures or PDF documents smaller than 10MB.</span>
                  </div>
                </div>

                {/* DIVIDER LINE */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6" />

                {/* CENTERED SUBMIT BUTTON */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-14 py-3 rounded-xl bg-[#2B3445] hover:bg-[#1E2532] text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
                  >
                    {isSubmitting ? <span>Submitting...</span> : <span>Submit</span>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
