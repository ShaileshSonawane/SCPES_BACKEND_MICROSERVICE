import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Clock,
  Building,
  Award,
  LogOut,
  Bell,
  LayoutDashboard,
  Check
} from 'lucide-react';
import { User, Drive, NotificationSummary } from '../../types';
import { RecruiterPostJobView } from '../RecruiterPostJobView';
import { RankedCandidatesView } from '../RankedCandidatesView';
import { NotificationDrawer } from '../NotificationDrawer';
import { AccessDeniedView } from '../AccessDeniedView';

export type RecruiterTab = 'overview' | 'post-job' | 'ranked' | 'pipeline';

interface Props {
  currentUser: User | null;
  drives: Drive[];
  notifications: NotificationSummary | null;
  onLogout: () => void;
  onRefreshDrives: () => Promise<void>;
}

export const RecruiterPortal: React.FC<Props> = ({
  currentUser,
  drives,
  notifications,
  onLogout,
  onRefreshDrives,
}) => {
  // Strict role security guard: only RECRUITER and ADMIN can view Recruiter portal
  if (currentUser && currentUser.role !== 'RECRUITER' && currentUser.role !== 'ADMIN') {
    return <AccessDeniedView currentUser={currentUser} requiredRole="Corporate Recruiter" onLogout={onLogout} />;
  }

  const [activeTab, setActiveTab] = useState<RecruiterTab>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const [candidateActionMap, setCandidateActionMap] = useState<Record<string, string>>({
    'c1': 'SHORTLISTED',
    'c2': 'PENDING',
    'c3': 'INTERVIEW_SCHEDULED',
    'c4': 'PENDING',
  });

  const candidates = [
    {
      id: 'c1',
      scpeId: 'SCPE-STU-001',
      name: 'Aarav Patil',
      role: 'Cloud SWE / Systems Engineer',
      branch: 'CSE',
      cgpa: 8.52,
      matchScore: 94,
      skills: ['Java 21', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'],
      status: candidateActionMap['c1'] || 'PENDING',
    },
    {
      id: 'c2',
      scpeId: 'SCPE-STU-003',
      name: 'Rohan Verma',
      role: 'Cloud SWE',
      branch: 'ECE',
      cgpa: 9.10,
      matchScore: 89,
      skills: ['Python', 'Distributed Systems', 'Algorithms', 'Go'],
      status: candidateActionMap['c2'] || 'PENDING',
    },
    {
      id: 'c3',
      scpeId: 'SCPE-STU-006',
      name: 'Ananya Deshmukh',
      role: 'Systems Engineer',
      branch: 'CSE',
      cgpa: 9.45,
      matchScore: 86,
      skills: ['C++', 'System Design', 'Kubernetes', 'Microservices'],
      status: candidateActionMap['c3'] || 'PENDING',
    },
    {
      id: 'c4',
      scpeId: 'SCPE-STU-002',
      name: 'Neha Patel',
      role: 'Junior Software Intern',
      branch: 'IT',
      cgpa: 6.54,
      matchScore: 78,
      skills: ['SQL', 'JavaScript', 'HTML/CSS', 'Git'],
      status: candidateActionMap['c4'] || 'PENDING',
    },
  ];

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setCandidateActionMap(prev => ({ ...prev, [id]: newStatus }));
  };

  const unreadCount = notifications?.unreadCount || 2;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'Corporate Recruiter Talent Portal', screen: 'Screen 9' };
      case 'post-job':
        return { title: 'Create Campus Recruitment Drive', screen: 'Screen 9' };
      case 'ranked':
        return { title: 'AI-Ranked Candidates Matrix', screen: 'Screen 10' };
      case 'pipeline':
        return { title: 'Applicant Evaluation & Interview Pipeline', screen: 'Screen 10' };
    }
  };

  const meta = getTabTitle();

  const handleNavigate = (tabName: string) => {
    if (tabName === 'recruiter-post-job' || tabName === 'post-job') setActiveTab('post-job');
    else if (tabName === 'recruiter-ranked' || tabName === 'ranked') setActiveTab('ranked');
    else if (tabName === 'pipeline') setActiveTab('pipeline');
    else setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* RECRUITER SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-amber-500/25">
            💼
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">SCPES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                RECRUITER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5 font-mono">{currentUser?.scpeId || 'SCPE-REC-001'}</p>
          </div>
        </div>

        {/* Recruiter Profile Card */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              RS
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Rohan Shah</p>
              <p className="text-[10px] text-amber-300 font-mono truncate">{currentUser?.scpeId || 'SCPE-REC-001'}</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Pool: <strong className="text-white font-mono">86 Applicants</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              42 Eligible
            </span>
          </div>
        </div>

        {/* Navigation Tabs - Exclusively Recruiter Tabs */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Talent Pipeline</span>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'overview'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Recruiter Overview</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S9</span>
          </button>

          <button
            onClick={() => setActiveTab('post-job')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'post-job'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Post Campus Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('ranked')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'ranked'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>AI-Ranked Candidates</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S10</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'pipeline'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Evaluation Matrix</span>
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({currentUser?.scpeId || 'SCPE-REC-001'})</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* RECRUITER TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">{meta.title}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Partner Account
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SCPE_ID: {currentUser?.scpeId || 'SCPE-REC-001'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Google India & Infosys Campus Recruitment Partner
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Matching Engine :8086</span>
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Recruiter Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                RS
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">Rohan Shah</p>
                <p className="text-[10px] font-mono text-amber-600 mt-0.5">{currentUser?.scpeId || 'SCPE-REC-001'}</p>
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

        {/* MAIN BODY */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Openings</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">2</span>
                    <span className="text-xs font-bold text-amber-600">Active Campus Drives</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Google SWE & Systems Engineer</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Applicants</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">86</span>
                    <span className="text-xs font-bold text-slate-400">Applications</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">100% Verified Academic Profiles</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Rule-Eligible</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">42</span>
                    <span className="text-xs font-bold text-emerald-600">Passed Criteria</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Zero active backlogs & CGPA &ge; Cutoff</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Shortlisted</span>
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">18</span>
                    <span className="text-xs font-bold text-violet-600">In Interview Rounds</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Round 1 Coding scheduled this week</p>
                </div>
              </div>

              {/* Active Drives */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                      Your Active Campus Placement Drives
                    </h2>
                    <p className="text-xs text-slate-500">Live recruitment opportunities open for Batch 2027 applications</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('post-job')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Post New Drive</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                          G
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">Google Cloud SWE</h3>
                          <p className="text-xs text-slate-500">Software Engineer — Cloud Infrastructure</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200/80 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Package</span>
                        <span className="text-xs font-extrabold text-slate-900">₹24.5 LPA</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Applied</span>
                        <span className="text-xs font-extrabold text-slate-900">42</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Rule Passed</span>
                        <span className="text-xs font-extrabold text-emerald-600">28</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 font-medium">Cutoff: CGPA ≥ 7.0 • 0 Backlogs</span>
                      <button
                        onClick={() => setActiveTab('ranked')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
                      >
                        <span>View Applicants</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                          I
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">Systems Engineer — Digital</h3>
                          <p className="text-xs text-slate-500">Infosys Campus Specialist Program</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200/80 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Package</span>
                        <span className="text-xs font-extrabold text-slate-900">₹9.5 LPA</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Applied</span>
                        <span className="text-xs font-extrabold text-slate-900">44</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Rule Passed</span>
                        <span className="text-xs font-extrabold text-emerald-600">38</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 font-medium">Cutoff: CGPA ≥ 6.5 • Max 1 Backlog</span>
                      <button
                        onClick={() => setActiveTab('ranked')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
                      >
                        <span>View Applicants</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POST A JOB */}
          {activeTab === 'post-job' && (
            <RecruiterPostJobView onNavigateTab={handleNavigate} />
          )}

          {/* TAB 3: RANKED CANDIDATES */}
          {activeTab === 'ranked' && (
            <RankedCandidatesView />
          )}

          {/* TAB 4: EVALUATION & PIPELINE MATRIX */}
          {activeTab === 'pipeline' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    Applicant Evaluation & Status Pipeline
                  </h2>
                  <p className="text-xs text-slate-500">Progress applicants through technical rounds, HR, and final offer letters</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3">SCPE ID & Candidate</th>
                      <th className="pb-3">CGPA</th>
                      <th className="pb-3">Resume AI Match</th>
                      <th className="pb-3">Extracted Core Skills</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Recruiter Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5">
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <p className="font-mono text-[10px] text-amber-600 font-semibold">{c.scpeId} • {c.branch}</p>
                        </td>
                        <td className="py-3.5 font-extrabold text-slate-800 font-mono text-xs">{c.cgpa}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-amber-600 font-mono text-sm">{c.matchScore}%</span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-600 h-full rounded-full" style={{ width: `${c.matchScore}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {c.skills.map((sk) => (
                              <span key={sk} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'SHORTLISTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'INTERVIEW_SCHEDULED'
                              ? 'bg-violet-100 text-violet-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(c.id, 'SHORTLISTED')}
                              className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(c.id, 'INTERVIEW_SCHEDULED')}
                              className="py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold transition border border-amber-200"
                            >
                              Interview
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-auto py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between">
          <span>SCPES Corporate Recruiter Portal &copy; 2026 • Campus Placement Partner Program</span>
          <span className="font-mono text-[11px] text-slate-400">
            Matching Service :8086 • Kafka Resume Ingestion
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
