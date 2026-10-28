import React, { useState, useEffect } from 'react';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  initialEmail?: string;
  roleContext?: 'STUDENT' | 'ADMIN' | 'RECRUITER';
  onSuccess: (email: string) => void;
  onCancel: () => void;
}

export const ForgotPasswordView: React.FC<Props> = ({
  initialEmail = '',
  roleContext = 'STUDENT',
  onSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Timer countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Color schemes based on role
  const theme = {
    STUDENT: {
      accent: 'emerald',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      shadow: 'shadow-emerald-600/30',
      border: 'border-emerald-500/30',
      bgGlow: 'bg-emerald-500/10',
      badge: 'Student Recovery',
      ring: 'focus:ring-emerald-500 focus:border-emerald-500',
      button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
    },
    ADMIN: {
      accent: 'purple',
      gradient: 'from-purple-600 via-indigo-600 to-blue-600',
      shadow: 'shadow-purple-600/30',
      border: 'border-purple-500/30',
      bgGlow: 'bg-purple-500/10',
      badge: 'Admin Security',
      ring: 'focus:ring-purple-500 focus:border-purple-500',
      button: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
    },
    RECRUITER: {
      accent: 'amber',
      gradient: 'from-amber-600 via-orange-600 to-yellow-600',
      shadow: 'shadow-amber-600/30',
      border: 'border-amber-500/30',
      bgGlow: 'bg-amber-500/10',
      badge: 'Recruiter Recovery',
      ring: 'focus:ring-amber-500 focus:border-amber-500',
      button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
    },
  }[roleContext];

  // Step 1: Send OTP to email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(cleanEmail);
      setOtpSent(true);
      setCountdown(60);
      setSuccessMsg(res.message || `Verification OTP sent to ${cleanEmail}`);
      if (res.simulatedOtp) {
        setPreviewOtp(res.simulatedOtp);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch verification OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm OTP & Set New Password on the same page
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification OTP.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword(email.trim(), otp.trim(), newPassword);
      setSuccessMsg(res.message || 'Password successfully updated in database!');
      
      // Allow user to see the success state before redirecting back
      setTimeout(() => {
        onSuccess(email.trim());
      }, 1800);
    } catch (err: any) {
      setError(err?.message || 'Password reset failed. Please ensure the OTP is correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto py-6">
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow accent */}
        <div className={`absolute -top-16 -right-16 w-44 h-44 ${theme.bgGlow} rounded-full blur-3xl pointer-events-none`} />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.border} text-slate-300 ${theme.bgGlow}`}>
            {theme.badge}
          </span>
        </div>

        <div className="text-left mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-indigo-400" />
            Reset Password
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {!otpSent
              ? 'Enter your registered email address to receive a secure verification code.'
              : 'Enter the OTP received on your email and set your new password below.'}
          </p>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Simulated OTP helper for testing environments */}
        {previewOtp && otpSent && (
          <div className="mb-4 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Simulated Email OTP:{' '}
                <strong className="font-mono text-sm tracking-widest text-indigo-300">{previewOtp}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOtp(previewOtp)}
              className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 font-bold transition"
            >
              Auto-fill
            </button>
          </div>
        )}

        {/* STEP 1: Enter Email (or locked if OTP already sent) */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student1@scpes.edu or recruiter@google.com"
                  autoFocus
                  required
                  className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white ${theme.ring} outline-none transition placeholder:text-slate-600 font-mono`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl ${theme.button} text-white font-bold text-sm ${theme.shadow} shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Verification OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: On the SAME PAGE, Enter OTP + Set New Password + Confirm New Password */
          <form onSubmit={handleResetPassword} className="space-y-4 animate-fadeIn">
            {/* Locked Email Pill with Edit Option */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-400 truncate">Email:</span>
                <span className="font-mono text-slate-200 font-semibold truncate">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setPreviewOtp(null);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium ml-2 shrink-0"
              >
                Change
              </button>
            </div>

            {/* 6-Digit OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  6-Digit Email OTP Code
                </label>
                {countdown > 0 ? (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={loading}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  autoFocus
                  required
                  className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono tracking-widest font-black text-white ${theme.ring} outline-none transition placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-600`}
                />
              </div>
            </div>

            {/* Set New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Set New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white ${theme.ring} outline-none transition font-mono placeholder:font-sans placeholder:text-slate-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white ${theme.ring} outline-none transition font-mono placeholder:font-sans placeholder:text-slate-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                  {newPassword === confirmPassword ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl ${theme.button} text-white font-bold text-sm ${theme.shadow} shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Database...</span>
                </>
              ) : (
                <>
                  <span>Set New Password & Confirm</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          <span>Safe & Encrypted &bull; Passwords are hashed with BCrypt (Cost factor 12)</span>
        </div>
      </div>
    </div>
  );
};
