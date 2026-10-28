import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  AlertCircle,
  FileText,
  Award,
  Sliders,
  Users,
  BarChart3,
  Building2,
  PlusCircle,
  Sparkles,
  LogOut,
  Layers,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Server,
  FileCheck
} from 'lucide-react';
import { User } from '../types';

export type NavTab =
  | 'student-dashboard'
  | 'student-profile'
  | 'eligible-drives'
  | 'not-eligible-drives'
  | 'student-applications'
  | 'tpo-dashboard'
  | 'rule-builder'
  | 'eligibility-results'
  | 'tpo-applicants'
  | 'reports-analytics'
  | 'admin-dashboard'
  | 'faculty-dashboard'
  | 'recruiter-dashboard'
  | 'recruiter-post-job'
  | 'recruiter-ranked';

export type PersonaType = 'student1' | 'student2' | 'tpo' | 'admin' | 'faculty' | 'recruiter';

interface Props {
  currentUser: User | null;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onSwitchPersona: (persona: PersonaType) => void;
  onLogout: () => void;
  activePersona: string;
}

export const Sidebar: React.FC<Props> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onSwitchPersona,
  onLogout,
  activePersona,
}) => {
  const role = currentUser?.role || 'STUDENT';

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shrink-0 select-none z-30">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/25">
          S
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-base tracking-tight">SCPES</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-none mt-0.5">Role-Based Placement Portal</p>
        </div>
      </div>

      {/* Navigation Links Grouped By Active Role */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* STUDENT ROLE PANEL */}
        {role === 'STUDENT' && (
          <>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Student Portal</span>
            </div>
            <button
              onClick={() => onSelectTab('student-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'student-dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Student Dashboard</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S2</span>
            </button>

            <button
              onClick={() => onSelectTab('student-profile')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'student-profile'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Profile & Academics</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S5</span>
            </button>

            <button
              onClick={() => onSelectTab('eligible-drives')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'eligible-drives'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Eligible Drives</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S3</span>
            </button>

            <button
              onClick={() => onSelectTab('not-eligible-drives')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'not-eligible-drives'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Not-Eligible Drives</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S4</span>
            </button>

            <button
              onClick={() => onSelectTab('student-applications')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'student-applications'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Applications</span>
            </button>
          </>
        )}

        {/* TPO ROLE PANEL */}
        {role === 'TPO' && (
          <>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>TPO Officer Portal</span>
            </div>
            <button
              onClick={() => onSelectTab('tpo-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'tpo-dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>TPO Dashboard</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S6</span>
            </button>

            <button
              onClick={() => onSelectTab('rule-builder')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'rule-builder'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Eligibility Rules</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S7</span>
            </button>

            <button
              onClick={() => onSelectTab('eligibility-results')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'eligibility-results'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Eligible Students</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S8</span>
            </button>

            <button
              onClick={() => onSelectTab('tpo-applicants')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'tpo-applicants'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Applicants Funnel</span>
            </button>

            <button
              onClick={() => onSelectTab('reports-analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'reports-analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Reports & Analytics</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S11</span>
            </button>
          </>
        )}

        {/* SUPER ADMIN ROLE PANEL */}
        {role === 'ADMIN' && (
          <>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Super Admin Portal</span>
            </div>
            <button
              onClick={() => onSelectTab('admin-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'admin-dashboard'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Control Center</span>
            </button>

            <button
              onClick={() => onSelectTab('reports-analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'reports-analytics'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Placement Analytics</span>
            </button>

            <button
              onClick={() => onSelectTab('tpo-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'tpo-dashboard'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>TPO Operations</span>
            </button>
          </>
        )}

        {/* FACULTY COORDINATOR ROLE PANEL */}
        {role === 'FACULTY' && (
          <>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>Faculty Coordinator</span>
            </div>
            <button
              onClick={() => onSelectTab('faculty-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'faculty-dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Faculty Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('reports-analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'reports-analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Department Stats</span>
            </button>
          </>
        )}

        {/* RECRUITER ROLE PANEL */}
        {role === 'RECRUITER' && (
          <>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Recruiter Portal</span>
            </div>
            <button
              onClick={() => onSelectTab('recruiter-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'recruiter-dashboard'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Recruiter Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('recruiter-post-job')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'recruiter-post-job'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Post a Job</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S9</span>
            </button>

            <button
              onClick={() => onSelectTab('recruiter-ranked')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'recruiter-ranked'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Ranked Candidates</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S10</span>
            </button>
          </>
        )}
      </div>

      {/* Presentation Switcher Pill Box */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-indigo-400" />
          Entity Panel Switcher
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => onSwitchPersona('tpo')}
            className={`px-2 py-1.5 rounded-lg text-left font-medium transition text-[11px] truncate ${
              activePersona === 'tpo'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Dr. Meera Kulkarni (TPO)"
          >
            🏛️ TPO Panel
          </button>
          <button
            onClick={() => onSwitchPersona('student1')}
            className={`px-2 py-1.5 rounded-lg text-left font-medium transition text-[11px] truncate ${
              activePersona === 'student1'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Aarav Patil (Eligible - CGPA 8.5)"
          >
            🎓 Student Panel
          </button>
          <button
            onClick={() => onSwitchPersona('admin')}
            className={`px-2 py-1.5 rounded-lg text-left font-medium transition text-[11px] truncate ${
              activePersona === 'admin'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Super Admin Dashboard"
          >
            🛡️ Super Admin
          </button>
          <button
            onClick={() => onSwitchPersona('faculty')}
            className={`px-2 py-1.5 rounded-lg text-left font-medium transition text-[11px] truncate ${
              activePersona === 'faculty'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Prof. Rajesh Verma (Faculty Coordinator)"
          >
            👨‍🏫 Faculty Panel
          </button>
          <button
            onClick={() => onSwitchPersona('recruiter')}
            className={`px-2 py-1.5 rounded-lg text-left font-medium transition text-[11px] truncate ${
              activePersona === 'recruiter'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Infosys / Google Recruiter"
          >
            💼 Recruiter Panel
          </button>
          <button
            onClick={() => onSwitchPersona('student2')}
            className={`px-2 py-1.5 rounded-lg text-left font-medium transition text-[11px] truncate ${
              activePersona === 'student2'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Neha Patel (Ineligible - 1 Backlog)"
          >
            ⚠️ Ineligible Student
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-medium transition border border-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch User / Sign Out (Screen 1)</span>
        </button>
      </div>
    </aside>
  );
};
