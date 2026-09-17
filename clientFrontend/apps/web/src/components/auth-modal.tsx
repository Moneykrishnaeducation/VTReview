import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Phone,
  CheckCircle2,
  KeyRound,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { type UserRole } from "@/domain/user";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();

  // Multi-step Login State
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Step 2 State
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("registered");

  // Notifications
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setFullName("");
    setEmail("");
    setIsOtpSent(false);
    setOtpCode("");
    setIsEmailVerified(false);
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccessMsg(null);
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = () => {
    setError(null);
    setSuccessMsg(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsOtpSent(true);
    setSuccessMsg(`OTP sent to ${email}. (Demo Code: 123456)`);
  };

  // Step 1: Verify OTP Code
  const handleVerifyOtp = () => {
    setError(null);
    if (!otpCode || otpCode.trim().length < 4) {
      setError("Please enter a valid OTP code.");
      return;
    }

    setIsEmailVerified(true);
    setSuccessMsg("Email verified successfully! Click 'Next' to proceed.");
  };

  // Step 1 -> Step 2
  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isEmailVerified) {
      setError("Please verify your email address with the OTP code first.");
      return;
    }

    setSuccessMsg(null);
    setStep(2);
  };

  // Final Login Submit (Step 2)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Complete login
    login(email, role);
    onClose();
    resetForm();
  };

  // Quick Demo Login
  const handleQuickLogin = (demoEmail: string, demoRole: UserRole) => {
    login(demoEmail, demoRole);
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {step === 1 ? "Login - Step 1: Verify Email" : "Login - Step 2: Password & Contact"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === 1
              ? "Enter your name & verify your email to log in"
              : "Set up phone number & password to complete login"}
          </p>
        </div>

        {/* Status Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Name, Email & Verify/Send OTP */}
        {step === 1 && (
          <form onSubmit={handleGoToStep2} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Email Input with Verify / Send OTP Button */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    disabled={isEmailVerified}
                    placeholder="trader@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-60 transition-all"
                  />
                  {isEmailVerified && (
                    <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-emerald-400" />
                  )}
                </div>

                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isOtpSent ? "Resend OTP" : "Verify"}
                  </button>
                )}
              </div>
            </div>

            {/* OTP Code Verification Box (Shown after clicking Verify / Send OTP) */}
            {isOtpSent && !isEmailVerified && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/20 space-y-2 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 font-mono tracking-widest placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Verify Code
                  </button>
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              type="submit"
              disabled={!isEmailVerified}
              className="w-full mt-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Phone Number, Password & Confirm Password */}
        {step === 2 && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login Now</span>
                <LogIn className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-slate-900 px-2 text-slate-500 font-bold tracking-wider">
              Or Quick Login
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleQuickLogin("user.google@wikifx.com", "registered")}
            className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-100 hover:border-slate-600 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs group"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
