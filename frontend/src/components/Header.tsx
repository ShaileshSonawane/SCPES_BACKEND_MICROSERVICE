import React from 'react';
import { User, NotificationSummary } from '../types';
import { Bell, GraduationCap, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

interface Props {
  currentUser: User | null;
  notifications: NotificationSummary | null;
  onSwitchUser: (email: string, pass: string, role: string) => void;
  onToggleNotifications: () => void;
  loading: boolean;
}

export const Header: React.FC<Props> = ({
  currentUser,
  notifications,
  onSwitchUser,
  onToggleNotifications,
  loading,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Presentation Switcher Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">DEMO PERSONA SWITCHER:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onSwitchUser('tpo@scpes.edu', 'Tpo@123', 'TPO')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
              currentUser?.email === 'tpo@scpes.edu'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            TPO (Placement Officer)
          </button>

          <button
            onClick={() => onSwitchUser('student1@scpes.edu', 'Student@123', 'STUDENT')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
              currentUser?.email === 'student1@scpes.edu'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Student 1 (Aarav - Eligible)
          </button>

          <button
            onClick={() => onSwitchUser('student2@scpes.edu', 'Student@123', 'STUDENT')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
              currentUser?.email === 'student2@scpes.edu'
                ? 'bg-rose-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Student 2 (Neha - Has Backlog)
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-2">
              SCPES
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                v1.0 Microservices
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">Smart College Placement Eligibility System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">{currentUser.email}</p>
                <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {currentUser.role}
                </span>
              </div>

              <button
                onClick={onToggleNotifications}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications && notifications.unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {notifications.unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {loading && (
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
          )}
        </div>
      </div>
    </header>
  );
};
