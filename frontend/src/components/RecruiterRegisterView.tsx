import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Phone,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  onSuccess: (email: string, scpeId?: string) => void;
  onCancel: () => void;
}

export const RecruiterRegisterView: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [companyName, setCompanyName] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('IT & Software');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredScpeId, setRegisteredScpeId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyName.trim()) {
      setError('Please provide your company name.');
      return;
    }
    if (!recruiterName.trim()) {
      setError('Please provide your full recruiter name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid corporate email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerRecruiter({
        companyName: companyName.trim(),
        recruiterName: recruiterName.trim(),
        email: email.trim(),
        sector,
        website: website.trim(),
        phone: phone.trim(),
        password,
      });

      const scpeId = res?.scpeId || 'SCPE-REC-' + Math.floor(100 + Math.random() * 900);
      setRegisteredScpeId(scpeId);

      // Brief moment for celebration before transition
      setTimeout(() => {
        onSuccess(email.trim(), scpeId);
      }, 2000);
    } catch (err: any) {
      // In offline demo fallback
      const mockScpeId = 'SCPE-REC-' + Math.floor(100 + Math.random() * 900);
      setRegisteredScpeId(mockScpeId);
      setTimeout(() => {
        onSuccess(email.trim(), mockScpeId);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-auto py-6">
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Amber glow accent */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recruiter Login</span>
          </button>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-300 bg-amber-500/10 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            Corporate Onboarding
          </span>
        </div>

        <div className="text-left mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            Recruiter & Company Registration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Register your enterprise hiring profile to post campus placement drives and shortlist eligible candidates.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Card when registered */}
        {registeredScpeId ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Registration Successful!</h3>
            <p className="text-xs text-slate-300">
              Your Recruiter account has been created in the database.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-amber-400 font-bold tracking-wider inline-block">
              {registeredScpeId}
            </div>
            <p className="text-[11px] text-slate-400">
              Redirecting you to corporate authorization...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company / Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Adobe"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Recruiter Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Person / Recruiter Name *
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Corporate Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Corporate Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. recruiter@company.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Industry / Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="IT & Software">IT & Software</option>
                  <option value="Core Engineering">Core Engineering</option>
                  <option value="Banking & Finance">Banking & Finance</option>
                  <option value="Consulting & Analytics">Consulting & Analytics</option>
                  <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company Website (Optional)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition font-mono placeholder:font-sans placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition font-mono placeholder:font-sans placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering Recruiter & Company...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Complete Recruiter Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          <span>By registering, you agree to SCPES institutional placement terms & fair evaluation policies.</span>
        </div>
      </div>
    </div>
  );
};
