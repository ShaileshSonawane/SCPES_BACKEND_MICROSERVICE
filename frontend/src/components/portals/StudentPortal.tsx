import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  LogOut,
  Bell,
  GraduationCap,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Lock
} from 'lucide-react';
import { User, Drive, StudentProfile, NotificationSummary } from '../../types';
import { StudentDashboardView } from '../StudentDashboardView';
import { StudentProfileView } from '../StudentProfileView';
import { EligibleDrivesView } from '../EligibleDrivesView';
import { NotEligibleDrivesView } from '../NotEligibleDrivesView';
import { NotificationDrawer } from '../NotificationDrawer';

export type StudentTab = 'overview' | 'profile' | 'eligible' | 'not-eligible' | 'applications';

interface Props {
  currentUser: User | null;
  profile: StudentProfile | null;
  drives: Drive[];
  notifications: NotificationSummary | null;
  initialVariant?: 'student1' | 'student2';
  onLogout: () => void;
  onRefreshDrives: () => Promise<void>;
}

export const StudentPortal: React.FC<Props> = ({
  currentUser,
  profile,
  drives,
  notifications,
  initialVariant = 'student1',
  onLogout,
  onRefreshDrives,
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('overview');
  const [studentVariant, setStudentVariant] = useState<'student1' | 'student2'>(initialVariant);
  const [showNotifications, setShowNotifications] = useState(false);

  const isStudent2 = studentVariant === 'student2';
  const studentName = isStudent2 ? 'Neha Patel' : 'Aarav Patil';
  const rollNo = isStudent2 ? '2023-IT-119' : '2023-CSE-101';
  const currentScpeId = currentUser?.scpeId || (isStudent2 ? 'SCPE-STU-002' : 'SCPE-STU-001');
  const branch = isStudent2 ? 'Information Technology' : 'Computer Science & Eng';
  const cgpa = isStudent2 ? '6.54' : '8.52';
  const statusLabel = isStudent2 ? '1 Active Backlog • Ineligible Demo' : 'Verified Academic Standing • Eligible';

  const unreadCount = notifications?.unreadCount || 3;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'Student Placement Dashboard', screen: 'Screen 2' };
      case 'profile':
        return { title: 'My Profile & Academic Transcript', screen: 'Screen 5' };
      case 'eligible':
        return { title: 'Eligible Campus Recruitment Drives', screen: 'Screen 3' };
      case 'not-eligible':
        return { title: 'Ineligible Drives & Evaluation Reasons', screen: 'Screen 4' };
      case 'applications':
        return { title: 'My Applications & Recruitment Pipeline', screen: 'Screen 2' };
    }
  };

  const meta = getTabTitle();

  const handleNavigate = (tabName: string) => {
    if (tabName === 'eligible-drives' || tabName === 'eligible') setActiveTab('eligible');
    else if (tabName === 'not-eligible-drives' || tabName === 'not-eligible') setActiveTab('not-eligible');
    else if (tabName === 'student-profile' || tabName === 'profile') setActiveTab('profile');
    else if (tabName === 'student-applications' || tabName === 'applications') setActiveTab('applications');
    else setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* STUDENT-DEDICATED SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shrink-0 select-none z-30">
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-emerald-500/20">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">SCPES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                STUDENT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5 font-mono">{currentScpeId}</p>
          </div>
        </div>

        {/* Student Mini Profile Card */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center ${
              isStudent2 ? 'bg-rose-600' : 'bg-emerald-600'
            }`}>
              {isStudent2 ? 'NP' : 'AP'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{studentName}</p>
              <p className="text-[10px] font-mono text-emerald-400 truncate">{currentScpeId}</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">CGPA: <strong className="text-white font-mono">{cgpa}</strong></span>
            <span className={`px-1.5 py-0.5 rounded font-bold ${
              isStudent2 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {isStudent2 ? '1 Backlog' : '0 Backlogs'}
            </span>
          </div>
        </div>

        {/* Security Isolation Notice */}
        <div className="mx-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2 text-[10px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Restricted Access: Authority Dashboards Locked</span>
        </div>

        {/* Navigation Tabs - Exclusively Student Tabs */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student Views</span>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S2</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Profile & Academics</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S5</span>
          </button>

          <button
            onClick={() => setActiveTab('eligible')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'eligible'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Eligible Drives</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S3</span>
          </button>

          <button
            onClick={() => setActiveTab('not-eligible')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'not-eligible'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Not-Eligible Drives</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S4</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'applications'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Applications</span>
          </button>
        </div>

        {/* Student Demo Switcher & Sign Out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
          {/* Quick toggle between Aarav (pass) and Neha (fail) for presentations */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Demonstrate Student Scenarios:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setStudentVariant('student1')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center transition ${
                  studentVariant === 'student1'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ✓ Aarav (STU-001)
              </button>
              <button
                onClick={() => setStudentVariant('student2')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center transition ${
                  studentVariant === 'student2'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚠ Neha (STU-002)
              </button>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({currentScpeId})</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* STUDENT TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">{meta.title}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {meta.screen}
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                {currentScpeId}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Logged in as <strong className="text-slate-700">{studentName}</strong> ({branch})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gateway :8080</span>
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Student Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className={`w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-xs ${
                isStudent2 ? 'bg-rose-600' : 'bg-emerald-600'
              }`}>
                {isStudent2 ? 'NP' : 'AP'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{studentName}</p>
                <p className="text-[10px] font-mono text-emerald-600 mt-0.5">{currentScpeId}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition border border-rose-200"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* VIEW BODY */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <StudentDashboardView
              profile={profile}
              drives={drives}
              onNavigateTab={handleNavigate}
              activePersona={studentVariant}
            />
          )}

          {activeTab === 'profile' && (
            <StudentProfileView
              profile={profile}
              activePersona={studentVariant}
            />
          )}

          {activeTab === 'eligible' && (
            <EligibleDrivesView
              drives={drives}
              onNavigateTab={handleNavigate}
              activePersona={studentVariant}
            />
          )}

          {activeTab === 'not-eligible' && (
            <NotEligibleDrivesView
              onNavigateTab={handleNavigate}
              activePersona={studentVariant}
            />
          )}

          {activeTab === 'applications' && (
            <EligibleDrivesView
              drives={drives}
              onNavigateTab={handleNavigate}
              activePersona={studentVariant}
            />
          )}
        </main>

        <footer className="mt-auto py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between">
          <span>SCPES Student Portal &copy; 2026 • Verified Academic Placement Pipeline</span>
          <span className="font-mono text-[11px] text-slate-400">
            Student Service :8083 • gRPC :9090
          </span>
        </footer>
      </div>

      {showNotifications && (
        <NotificationDrawer
          data={notifications}
          onClose={() => setShowNotifications(false)}
          onRefresh={onRefreshDrives}
        />
      )}
    </div>
  );
};
