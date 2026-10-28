import React, { useState, useEffect } from 'react';
import {
  IdCard,
  KeyRound,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  ShieldCheck,
  Info,
  UserPlus,
  Sparkles,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { ForgotPasswordView } from './ForgotPasswordView';
import { RecruiterRegisterView } from './RecruiterRegisterView';

export type LoginRoleTab = 'STUDENT' | 'ADMIN' | 'RECRUITER';

interface Props {
  onLogin: (scpeId: string, pass: string, role?: string) => void;
  loading: boolean;
  error?: string | null;
  initialRoleTab?: LoginRoleTab;
}

export const LoginView: React.FC<Props> = ({
  onLogin,
  loading,
  error: externalError,
  initialRoleTab = 'STUDENT',
}) => {
  // Determine initial active tab from URL hash if available (e.g. #recruiter, #admin, #student)
  const getInitialTab = (): LoginRoleTab => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase();
      if (h.includes('recruiter')) return 'RECRUITER';
      if (h.includes('admin') || h.includes('tpo')) return 'ADMIN';
      if (h.includes('student')) return 'STUDENT';
    }
    return initialRoleTab;
  };

  const [activeTab, setActiveTab] = useState<LoginRoleTab>(getInitialTab);
  const [scpeId, setScpeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Active subview: 'LOGIN' | 'FORGOT_PASSWORD' | 'REGISTER_RECRUITER'
  const [viewMode, setViewMode] = useState<'LOGIN' | 'FORGOT_PASSWORD' | 'REGISTER_RECRUITER'>('LOGIN');

  // Sync hash with active tab
  const handleTabChange = (tab: LoginRoleTab) => {
    setActiveTab(tab);
    setViewMode('LOGIN');
    setValidationError(null);
    setNotificationMsg(null);
    if (typeof window !== 'undefined') {
      window.location.hash = tab.toLowerCase();
    }
  };

  // Keep state synced if hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash.toLowerCase();
      if (h.includes('recruiter')) setActiveTab('RECRUITER');
      else if (h.includes('admin')) setActiveTab('ADMIN');
      else if (h.includes('student')) setActiveTab('STUDENT');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Set default placeholder and credentials per role
  const roleConfig = {
    STUDENT: {
      role: 'STUDENT',
      tabTitle: 'Student Login',
      title: 'Student Placement Portal',
      subtitle: 'Check placement eligibility, verify criteria, and track recruitment drives.',
      icon: GraduationCap,
      placeholder: 'e.g. SCPE-STU-001 or student1@scpes.edu',
      inputLabel: 'Student Roll No / SCPE_ID / Email',
      themeGlow: 'bg-emerald-500/10',
      badgeBorder: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
      activeTabStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/20',
      buttonGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30',
      focusRing: 'focus:ring-emerald-500 focus:border-emerald-500',
      heroBadge: 'Student Portal Active',
      demoCredentials: [
        { label: 'Student 1 (Eligible - Aarav)', id: 'SCPE-STU-001', pass: 'Student@123' },
        { label: 'Student 2 (Ineligible - Neha)', id: 'SCPE-STU-002', pass: 'Student@123' },
      ],
    },
    ADMIN: {
      role: 'ADMIN',
      tabTitle: 'Admin & TPO Login',
      title: 'Administrative Control Center',
      subtitle: 'Super Admin, Central TPO & Faculty Placement Coordinator authentication.',
      icon: ShieldCheck,
      placeholder: 'e.g. SCPE-ADM-001 or admin@scpes.edu',
      inputLabel: 'Institutional Admin ID / Officer SCPE_ID',
      themeGlow: 'bg-purple-500/10',
      badgeBorder: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
      activeTabStyle: 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-500/20',
      buttonGradient: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30',
      focusRing: 'focus:ring-purple-500 focus:border-purple-500',
      heroBadge: 'High-Security RBAC Isolation',
      demoCredentials: [
        { label: 'Super Admin', id: 'SCPE-ADM-001', pass: 'Admin@123' },
        { label: 'Central TPO Officer', id: 'SCPE-TPO-001', pass: 'Tpo@123' },
        { label: 'Faculty Coordinator', id: 'SCPE-FAC-001', pass: 'Faculty@123' },
      ],
    },
    RECRUITER: {
      role: 'RECRUITER',
      tabTitle: 'Recruiter Login',
      title: 'Corporate Recruiter Portal',
      subtitle: 'Post job requirements, evaluate candidates and manage enterprise hiring.',
      icon: Briefcase,
      placeholder: 'e.g. recruiter@google.com or SCPE-REC-001',
      inputLabel: 'Corporate Work Email / Recruiter ID',
      themeGlow: 'bg-amber-500/10',
      badgeBorder: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
      activeTabStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20',
      buttonGradient: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30',
      focusRing: 'focus:ring-amber-500 focus:border-amber-500',
      heroBadge: 'Corporate Hiring Partner',
      demoCredentials: [
        { label: 'Google Recruiter', id: 'recruiter@google.com', pass: 'Recruiter@123' },
      ],
    },
  }[activeTab];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanId = scpeId.trim();
    if (!cleanId) {
      setValidationError('Please enter your institutional ID or email address.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    onLogin(cleanId, password, roleConfig.role);
  };

  const handleApplyDemo = (id: string, pass: string) => {
    setScpeId(id);
    setPassword(pass);
    setValidationError(null);
  };

  // Called when password reset succeeds on the same page
  const handlePasswordResetSuccess = (updatedEmail: string) => {
    setViewMode('LOGIN');
    setScpeId(updatedEmail);
    setPassword('');
    setNotificationMsg(
      'Password updated successfully in database! Please sign in with your new password.'
    );
  };

  // Called when recruiter registration succeeds
  const handleRecruiterRegistered = (newEmail: string, newScpeId?: string) => {
    setActiveTab('RECRUITER');
    setViewMode('LOGIN');
    setScpeId(newEmail);
    setPassword('');
    setNotificationMsg(
      `Recruiter account (${newScpeId || 'Registered'}) created in database! Please sign in below.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-lg sm:text-xl tracking-tight">SCPES</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                MULTI-ROLE ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400">Smart College Placement Eligibility System</p>
          </div>
        </div>

        {/* Distinct Role Selection Tabs */}
        <nav aria-label="Portal Selection" className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => handleTabChange('STUDENT')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'STUDENT'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ADMIN'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('RECRUITER')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'RECRUITER'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Recruiter Login</span>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-xl mx-auto my-auto py-6">
        {/* SUBVIEW 1: ON-THE-SAME-PAGE FORGOT PASSWORD & OTP RESET */}
        {viewMode === 'FORGOT_PASSWORD' && (
          <ForgotPasswordView
            initialEmail={scpeId.includes('@') ? scpeId : ''}
            roleContext={activeTab}
            onSuccess={handlePasswordResetSuccess}
            onCancel={() => setViewMode('LOGIN')}
          />
        )}

        {/* SUBVIEW 2: RECRUITER REGISTRATION / SIGN UP */}
        {viewMode === 'REGISTER_RECRUITER' && (
          <RecruiterRegisterView
            onSuccess={handleRecruiterRegistered}
            onCancel={() => setViewMode('LOGIN')}
          />
        )}

        {/* SUBVIEW 3: DISTINCT LOGIN VIEW PER ROLE */}
        {viewMode === 'LOGIN' && (
          <div className="w-full">
            {/* Title & Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-3 text-xs font-bold transition-all border-slate-700 bg-slate-900">
                <roleConfig.icon className="w-4 h-4 text-white" />
                <span className="text-white">{roleConfig.heroBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {roleConfig.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
                {roleConfig.subtitle}
              </p>
            </div>

            {/* Success notification */}
            {notificationMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{notificationMsg}</span>
              </div>
            )}

            {/* Error notifications */}
            {(externalError || validationError) && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{validationError || externalError}</span>
              </div>
            )}

            {/* The Dedicated Login Form Card */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              {/* Role theme glow */}
              <div className={`absolute -top-16 -right-16 w-44 h-44 ${roleConfig.themeGlow} rounded-full blur-3xl pointer-events-none`} />

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ID or Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {roleConfig.inputLabel}
                  </label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={scpeId}
                      onChange={(e) => {
                        setScpeId(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder={roleConfig.placeholder}
                      autoFocus
                      autoComplete="username"
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white ${roleConfig.focusRing} outline-none transition tracking-wide placeholder:font-sans placeholder:font-normal placeholder:text-slate-600`}
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    {/* Integrated Forgot Password Link */}
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('FORGOT_PASSWORD');
                        setValidationError(null);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="Enter your account password"
                      autoComplete="current-password"
                      className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white ${roleConfig.focusRing} outline-none transition font-mono placeholder:font-sans placeholder:text-slate-600`}
                      required
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl ${roleConfig.buttonGradient} text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50`}
                >
                  {loading ? (
                    <span>Validating & Authorizing...</span>
                  ) : (
                    <>
                      <span>Sign In to {roleConfig.tabTitle}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* SPECIFIC SIGN UP OPTION FOR RECRUITER */}
              {activeTab === 'RECRUITER' && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs text-amber-200 font-medium mb-2">
                    Has your company not registered yet?
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('REGISTER_RECRUITER')}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register New Recruiter & Company (Sign Up)</span>
                  </button>
                </div>
              )}

              {/* INFO OPTION FOR STUDENT */}
              {activeTab === 'STUDENT' && (
                <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Not yet enrolled on SCPES?</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Contact Placement Cell
                  </span>
                </div>
              )}

              {/* Demo Credentials Helper per Tab */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Demo Quick-Fill ({roleConfig.tabTitle}):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roleConfig.demoCredentials.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleApplyDemo(c.id, c.pass)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-left font-mono text-[11px] text-slate-300 hover:text-white transition flex items-center gap-1.5"
                    >
                      <span className="font-semibold text-slate-200">{c.label}:</span>
                      <span className="text-indigo-400">{c.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>SCPES &copy; 2026 &bull; Enterprise Placement Eligibility System</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-500">
            Current Portal: {roleConfig.title}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <Lock className="w-3 h-3" />
            <span>Encrypted Auth</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
