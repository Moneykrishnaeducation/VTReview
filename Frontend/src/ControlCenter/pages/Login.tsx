import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Building2,
  TrendingUp,
  Check,
  RotateCcw,
  BadgeCheck,
  ChevronLeft,
  Loader2,
  Users,
  Shield,
} from "lucide-react";
import logo from "@/assets/logo.png";

type AuthMode = "login" | "signup" | "forgot" | "verify-otp" | "reset-password" | "success";

interface LoginProps {
  initialMode?: AuthMode;
}

export default function Login({ initialMode }: LoginProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode state driven by prop or query param "mode"
  const [mode, setMode] = useState<AuthMode>(() => {
    if (initialMode) return initialMode;
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup" || modeParam === "register") return "signup";
    if (modeParam === "forgot" || modeParam === "reset") return "forgot";
    return "login";
  });

  // Sync mode with query parameter changes
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup" || modeParam === "register") {
      setMode("signup");
    } else if (modeParam === "forgot" || modeParam === "reset") {
      setMode("forgot");
    } else if (!modeParam && !initialMode) {
      setMode("login");
    }
  }, [searchParams, initialMode]);

  // Form Fields State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState<"trader" | "analyst" | "broker">("trader");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password OTP states
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // UI state for async interactions
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === "verify-otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [mode, timer]);

  const switchMode = (newMode: AuthMode) => {
    setErrorMessage(null);
    setSuccessMsg(null);
    setMode(newMode);
    if (newMode === "login") setSearchParams({});
    else if (newMode === "signup") setSearchParams({ mode: "signup" });
    else if (newMode === "forgot") setSearchParams({ mode: "forgot" });
  };

  // Password Strength Calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-200" };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
    if (score === 2) return { score, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
    if (score === 3) return { score, label: "Good", color: "bg-blue-500", text: "text-blue-600" };
    return { score, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const pwdRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Contains a number (0-9)", met: /[0-9]/.test(password) },
    { label: "Contains special character (!@#$)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  // OTP Input Handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Submission Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Welcome back! Redirecting to Control Center...");
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    }, 1000);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (pwdStrength.score < 2) {
      setErrorMessage("Please create a stronger password.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("You must accept the Terms of Service to create an account.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Account successfully created! Verification link sent to " + email);
      setMode("success");
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTimer(60);
      setCanResend(false);
      setMode("verify-otp");
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpCode.join("");

    if (code.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode("reset-password");
    }, 1000);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (pwdStrength.score < 2) {
      setErrorMessage("Please create a stronger password.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Your password has been successfully reset. You can now log in.");
      setMode("login");
    }, 1200);
  };

  return (
    <div className="min-h-screen h-screen w-full bg-[#070e1b] flex items-center justify-center relative overflow-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden font-sans">
      {/* BACKGROUND GRAPHIC ACCENTS (Matching image1.png) */}

      {/* Right side diagonal light background shapes - Shifted right to give left dark side more width */}
      <div className="absolute right-0 top-0 bottom-0 w-[48%] xl:w-[50%] bg-gradient-to-br from-[#f0f4f9] via-[#e2eaf4] to-[#d8e3f0] hidden lg:block transform -skew-x-12 translate-x-20 xl:translate-x-24 z-0" />
      
      {/* Top Right Orange/Yellow Diagonal Angle Accents */}
      <div className="absolute top-0 right-0 z-0 pointer-events-none overflow-hidden w-72 h-40 hidden sm:block">
        {/* Upper dark orange layer */}
        <div className="absolute -top-8 -right-8 w-44 h-36 bg-amber-600 transform rotate-12 skew-x-12 shadow-md" />
        {/* Bright yellow top corner stripe */}
        <div className="absolute -top-12 -right-4 w-52 h-24 bg-amber-400 transform -rotate-12 -skew-x-25 shadow-lg" />
      </div>

      {/* Candlestick Chart Watermark Graphic (Left Side) */}
      <div className="absolute left-8 top-1/4 w-96 h-96 opacity-10 pointer-events-none hidden lg:flex gap-4 items-end">
        <div className="w-6 bg-cyan-400 h-48 rounded-sm relative"><div className="w-1 bg-cyan-400 h-64 -top-8 left-2.5 absolute" /></div>
        <div className="w-6 bg-amber-400 h-32 rounded-sm relative"><div className="w-1 bg-amber-400 h-48 -top-8 left-2.5 absolute" /></div>
        <div className="w-6 bg-cyan-400 h-64 rounded-sm relative"><div className="w-1 bg-cyan-400 h-80 -top-8 left-2.5 absolute" /></div>
        <div className="w-6 bg-cyan-400 h-40 rounded-sm relative"><div className="w-1 bg-cyan-400 h-56 -top-8 left-2.5 absolute" /></div>
      </div>

      {/* Glowing Shield Watermark Graphic (Left Side Upper Right) */}
      <div className="absolute left-[32%] xl:left-[36%] top-12 opacity-30 pointer-events-none hidden lg:block">
        <div className="relative w-52 h-60 border-4 border-cyan-400/40 rounded-b-full flex items-center justify-center bg-cyan-500/5 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <div className="relative p-3 rounded-full bg-cyan-400/10 border border-cyan-400/30">
            <TrendingUp className="w-16 h-16 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12 items-center">
        
        {/* LEFT PANEL: Dark Theme Branding Showcase */}
        <div className="lg:col-span-6 xl:col-span-6 text-white space-y-8 pr-4 lg:pr-8 xl:pr-12">
          
          {/* Top Logo */}
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src={logo} alt="WikiiFX Logo" className="h-10 w-auto object-contain" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-light text-lg">|</span>
              <span className="text-base font-bold text-slate-200">Control Center</span>
            </div>
          </Link>

          {/* Institutional Surveillance Pill Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c1a30] border border-[#1a2d4d] text-blue-300 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Institutional Financial Surveillance
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Empowering
            </h1>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Independent Trader
            </h1>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 leading-tight">
              Protection &
            </h1>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 leading-tight">
              Regulatory Audits
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Access real-time broker surveillance, verified regulation databases, exposure complaints mediation, and automated license cross-verification.
          </p>

          {/* Stat Boxes (2 Columns matching image1.png) */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {/* Box 1: Brokers Indexed */}
            <div className="p-4 rounded-xl bg-[#0a1526]/80 border border-[#1a2d4b] flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-black text-amber-400">10,480+</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brokers Indexed</div>
              </div>
            </div>

            {/* Box 2: Active Traders */}
            <div className="p-4 rounded-xl bg-[#0a1526]/80 border border-[#1a2d4b] flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-black text-cyan-400">250K+</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Traders</div>
              </div>
            </div>
          </div>

          {/* Trust Bullet List */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-200 pt-2">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>
                <strong className="text-white">Direct API Feeds:</strong> Live cross-checks with FCA, ASIC, CySEC and BaFin registries.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>
                <strong className="text-white">Dispute Mediation:</strong> Active resolution team handling frozen withdrawal claims.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>
                <strong className="text-white">256-Bit SSL Safeguard:</strong> Enterprise grade encryption for account credentials.
              </span>
            </div>
          </div>

   
        </div>

        {/* RIGHT PANEL: Form Card (Matching image1.png Card Style) */}
        <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full border border-slate-100 relative">
            
            {/* Logo Header Inside Card */}
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="WikiiFX Logo" className="h-9 w-auto object-contain" />
              <div>
                <div className="text-xs font-semibold text-slate-500">Control Center</div>
              </div>
            </div>

            {/* Error / Success Alert Messages */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* MODE 1: LOGIN (Matching image1.png exactly) */}
            {mode === "login" && (
              <div>
                {/* Header with Title and Create Account Link */}
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Sign In to Control Center
                  </h2>
                  
                </div>
                
                

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Email Address or Username
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="trader@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Keep me signed in checkbox */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 h-4 w-4 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 font-medium">Keep me signed in for 30 days</span>
                    </label>
                  </div>

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In to Control Center <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                    <span className="bg-white px-3 text-slate-400">OR CONTINUE WITH</span>
                  </div>
                </div>

                {/* Social Sign In Buttons (Google & Apple ID side by side matching image1.png) */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setSuccessMsg("Google SSO authentication successful!");
                        setTimeout(() => navigate("/admin"), 800);
                      }, 800);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                 
                </div>

                {/* Bottom Security Notice */}
                <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" /> Protected by 256-bit SSL Financial Grade Security
                </div>
              </div>
            )}

            {/* MODE 2: SIGN UP */}
            {mode === "signup" && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Create Trader Account</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Join 250,000+ verified traders</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Sign In →
                  </button>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {/* Account Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Select Profile</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "trader", label: "Retail Trader", icon: User },
                        { id: "analyst", label: "Pro / Analyst", icon: TrendingUp },
                        { id: "broker", label: "Broker Rep", icon: Building2 },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAccountType(item.id as any)}
                          className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                            accountType === item.id
                              ? "bg-blue-50 border-blue-600 text-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <item.icon className="h-3.5 w-3.5" />
                          <span className="text-[11px]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="alex@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Strength:</span>
                          <span className={`font-bold ${pwdStrength.text}`}>{pwdStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`h-full flex-1 transition-all rounded-full ${
                                pwdStrength.score >= step ? pwdStrength.color : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5 accent-blue-600"
                      />
                      <span className="text-[11px] text-slate-600 leading-relaxed">
                        I agree to the <a href="/terms" className="text-blue-600 font-bold hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy</a>.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Registration <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* MODE 3: FORGOT PASSWORD STEP 1 */}
            {mode === "forgot" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Reset Password</h2>
                    <p className="text-xs text-slate-500">Enter email to receive OTP code</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 mb-5 flex items-start gap-2.5">
                  <KeyRound className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    We will send a 6-digit verification code to your registered email address.
                  </span>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="trader@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending Code...
                      </>
                    ) : (
                      <>
                        Send Reset Code <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* MODE 4: VERIFY OTP */}
            {mode === "verify-otp" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Enter Verification Code</h2>
                    <p className="text-xs text-slate-500">Sent to {email || "your email"}</p>
                  </div>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      {otpCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-10 h-12 text-center font-black text-lg bg-slate-50 border border-slate-200 rounded-xl text-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-500">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => {
                          setTimer(60);
                          setCanResend(false);
                          setSuccessMsg("A new verification code has been sent.");
                        }}
                        className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Resend Code
                      </button>
                    ) : (
                      <span>Resend code in <strong className="text-blue-600">{timer}s</strong></span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying Code...
                      </>
                    ) : (
                      <>
                        Verify Code <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* MODE 5: RESET PASSWORD */}
            {mode === "reset-password" && (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-extrabold text-slate-900">Set New Password</h2>
                  <p className="text-xs text-slate-500">Create a secure new password</p>
                </div>

                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Updating Password...
                      </>
                    ) : (
                      <>
                        Update Password & Sign In <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* MODE 6: SUCCESS VERIFICATION */}
            {mode === "success" && (
              <div className="text-center py-6">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">Registration Complete!</h2>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                  Your profile has been created. A verification link was sent to <strong className="text-slate-900">{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-500/25"
                >
                  Proceed to Sign In →
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
