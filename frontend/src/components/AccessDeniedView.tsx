import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, LogOut } from 'lucide-react';
import { User } from '../types';

interface Props {
  currentUser: User | null;
  requiredRole: string;
  onLogout: () => void;
}

export const AccessDeniedView: React.FC<Props> = ({ currentUser, requiredRole, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>403 Forbidden Access</span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Your current identifier <span className="font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{currentUser?.scpeId || currentUser?.userCode || 'STUDENT'}</span> with role <span className="font-bold text-rose-400">{currentUser?.role || 'STUDENT'}</span> does not have privileges to view this higher authority dashboard.
        </p>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left mb-6 space-y-1.5 font-mono">
          <div className="text-slate-500">Security Clearance Required: <span className="text-emerald-400 font-bold">{requiredRole}</span></div>
          <div className="text-slate-500">Current SCPE_ID: <span className="text-amber-300 font-bold">{currentUser?.scpeId || 'SCPE-STU-001'}</span></div>
          <div className="text-slate-500">Policy: <span className="text-rose-400">Strict Role Isolation Enforced</span></div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out & Return to SCPE Login</span>
        </button>
      </div>
    </div>
  );
};
