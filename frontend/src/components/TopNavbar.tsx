import React from 'react';
import { Search, Bell, ShieldCheck, Database } from 'lucide-react';
import { User, NotificationSummary } from '../types';

interface Props {
  title: string;
  screenNumber: number;
  currentUser: User | null;
  notifications: NotificationSummary | null;
  onToggleNotifications: () => void;
  activePersona: string;
}

export const TopNavbar: React.FC<Props> = ({
  title,
  screenNumber,
  currentUser,
  notifications,
  onToggleNotifications,
  activePersona,
}) => {
  const getInitials = () => {
    if (activePersona === 'admin') return 'SA';
    if (activePersona === 'faculty') return 'RV';
    if (activePersona === 'tpo') return 'MK';
    if (activePersona === 'recruiter') return 'RS';
    if (activePersona === 'student2') return 'NP';
    return 'AP';
  };

  const getName = () => {
    if (activePersona === 'admin') return 'Super Administrator';
    if (activePersona === 'faculty') return 'Prof. Rajesh Verma';
    if (activePersona === 'tpo') return 'Dr. Meera Kulkarni';
    if (activePersona === 'recruiter') return 'Rohan Shah (Infosys / Google)';
    if (activePersona === 'student2') return 'Neha Patel';
    return 'Aarav Patil';
  };

  const getRoleLabel = () => {
    if (activePersona === 'admin') return 'University System Administrator';
    if (activePersona === 'faculty') return 'Faculty Placement Coordinator (CSE)';
    if (activePersona === 'tpo') return 'TPO Placement Officer';
    if (activePersona === 'recruiter') return 'Corporate Campus Recruiter';
    if (activePersona === 'student2') return 'Student (Batch 2027 • Ineligible)';
    return 'Student (Batch 2027 • Verified)';
  };

  const unreadCount = notifications?.unreadCount || 3;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Screen Tag */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">{title}</h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 hidden sm:inline">
            Panel: {currentUser?.role || 'STUDENT'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">SCPES Verified Placement Pipeline</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search drives, skills, applicants..."
            className="w-56 lg:w-72 pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Live Backend Connection Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Gateway :8080</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          title="In-app Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar & Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className={`w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-xs ${
            activePersona === 'admin'
              ? 'bg-gradient-to-tr from-purple-700 to-purple-500'
              : activePersona === 'faculty'
              ? 'bg-gradient-to-tr from-blue-700 to-blue-500'
              : activePersona === 'recruiter'
              ? 'bg-gradient-to-tr from-amber-600 to-amber-500'
              : 'bg-gradient-to-tr from-indigo-700 to-indigo-500'
          }`}>
            {getInitials()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">{getName()}</p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{getRoleLabel()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
