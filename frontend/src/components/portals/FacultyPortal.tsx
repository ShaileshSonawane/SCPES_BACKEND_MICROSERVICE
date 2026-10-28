import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileCheck,
  Search,
  Download,
  Award,
  BarChart3,
  LogOut,
  Bell,
  LayoutDashboard
} from 'lucide-react';
import { User, Drive, NotificationSummary } from '../../types';
import { ReportsAnalyticsView } from '../ReportsAnalyticsView';
import { NotificationDrawer } from '../NotificationDrawer';
import { AccessDeniedView } from '../AccessDeniedView';

export type FacultyTab = 'overview' | 'verification' | 'merit' | 'analytics';

interface Props {
  currentUser: User | null;
  drives: Drive[];
  notifications: NotificationSummary | null;
  onLogout: () => void;
  onRefreshDrives: () => Promise<void>;
}

interface StudentRecord {
  id: string;
  scpeId: string;
  rollNo: string;
  name: string;
  branch: string;
  tenthPct: number;
  twelfthPct: number;
  cgpa: number;
  activeBacklogs: number;
  backlogHistory: number;
  verificationStatus: 'VERIFIED' | 'SUBMITTED' | 'REJECTED';
  submissionDate: string;
  remark?: string;
}

export const FacultyPortal: React.FC<Props> = ({
  currentUser,
  drives,
  notifications,
  onLogout,
  onRefreshDrives,
}) => {
  // Strict role security guard: only FACULTY and ADMIN can view Faculty portal
  if (currentUser && currentUser.role !== 'FACULTY' && currentUser.role !== 'ADMIN') {
    return <AccessDeniedView currentUser={currentUser} requiredRole="Faculty Placement Coordinator" onLogout={onLogout} />;
  }

  const [activeTab, setActiveTab] = useState<FacultyTab>('overview');
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRemarkModal, setActiveRemarkModal] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: 's1',
      scpeId: 'SCPE-STU-001',
      rollNo: '2023-CSE-101',
      name: 'Aarav Patil',
      branch: 'CSE',
      tenthPct: 88.5,
      twelfthPct: 86.0,
      cgpa: 8.52,
      activeBacklogs: 0,
      backlogHistory: 0,
      verificationStatus: 'VERIFIED',
      submissionDate: '24 Oct 2026',
      remark: 'All marksheets verified against University ERP'
    },
    {
      id: 's2',
      scpeId: 'SCPE-STU-002',
      rollNo: '2023-CSE-119',
      name: 'Neha Patel',
      branch: 'CSE',
      tenthPct: 76.0,
      twelfthPct: 74.5,
      cgpa: 6.54,
      activeBacklogs: 1,
      backlogHistory: 1,
      verificationStatus: 'SUBMITTED',
      submissionDate: 'Yesterday, 4:20 PM',
      remark: 'Sem 4 revaluation marksheet uploaded'
    },
    {
      id: 's3',
      scpeId: 'SCPE-STU-003',
      rollNo: '2023-CSE-142',
      name: 'Rohan Verma',
      branch: 'ECE',
      tenthPct: 91.2,
      twelfthPct: 89.0,
      cgpa: 9.10,
      activeBacklogs: 0,
      backlogHistory: 0,
      verificationStatus: 'SUBMITTED',
      submissionDate: 'Today, 9:15 AM',
      remark: 'Pending Sem 6 consolidated transcript verification'
    },
    {
      id: 's4',
      scpeId: 'SCPE-STU-004',
      rollNo: '2023-CSE-156',
      name: 'Priya Nair',
      branch: 'CSE',
      tenthPct: 82.0,
      twelfthPct: 80.5,
      cgpa: 7.80,
      activeBacklogs: 0,
      backlogHistory: 1,
      verificationStatus: 'REJECTED',
      submissionDate: '23 Oct 2026',
      remark: '12th standard aggregate mismatch with uploaded PDF'
    },
    {
      id: 's5',
      scpeId: 'SCPE-STU-005',
      rollNo: '2023-CSE-168',
      name: 'Aditya Kulkarni',
      branch: 'CSE',
      tenthPct: 85.0,
      twelfthPct: 83.0,
      cgpa: 8.15,
      activeBacklogs: 0,
      backlogHistory: 0,
      verificationStatus: 'SUBMITTED',
      submissionDate: 'Today, 11:30 AM',
      remark: 'Fresh submission for placement season 2026-27'
    },
    {
      id: 's6',
      scpeId: 'SCPE-STU-006',
      rollNo: '2023-CSE-182',
      name: 'Ananya Deshmukh',
      branch: 'CSE',
      tenthPct: 94.0,
      twelfthPct: 92.5,
      cgpa: 9.45,
      activeBacklogs: 0,
      backlogHistory: 0,
      verificationStatus: 'VERIFIED',
      submissionDate: '22 Oct 2026',
      remark: 'Dean honors list recipient'
    },
  ]);

  const handleApprove = (id: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, verificationStatus: 'VERIFIED', remark: 'Verified & Signed off by Faculty Coordinator' } : s));
  };

  const handleOpenRejectModal = (id: string) => {
    setActiveRemarkModal(id);
    setRemarkText('');
  };

  const handleConfirmReject = () => {
    if (activeRemarkModal) {
      setStudents(students.map(s => s.id === activeRemarkModal ? {
        ...s,
        verificationStatus: 'REJECTED',
        remark: remarkText || 'Academic record flagged: please re-upload valid grade cards.'
      } : s));
      setActiveRemarkModal(null);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.scpeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const verifiedCount = students.filter(s => s.verificationStatus === 'VERIFIED').length;
  const pendingCount = students.filter(s => s.verificationStatus === 'SUBMITTED').length;
  const rejectedCount = students.filter(s => s.verificationStatus === 'REJECTED').length;

  const unreadCount = notifications?.unreadCount || 1;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'Faculty Placement Coordinator Overview', screen: 'Screen 5' };
      case 'verification':
        return { title: 'Student Academic Verification Queue', screen: 'Screen 5' };
      case 'merit':
        return { title: 'Department Merit Ledger & CGPA Distribution', screen: 'Screen 5' };
      case 'analytics':
        return { title: 'Department Placement Performance & Trends', screen: 'Screen 11' };
    }
  };

  const meta = getTabTitle();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* FACULTY SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/25">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">SCPES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                FACULTY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5 font-mono">{currentUser?.scpeId || 'SCPE-FAC-001'}</p>
          </div>
        </div>

        {/* Faculty Profile Card */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              RV
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Prof. Rajesh Verma</p>
              <p className="text-[10px] text-blue-300 font-mono truncate">{currentUser?.scpeId || 'SCPE-FAC-001'}</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Queue: <strong className="text-amber-300 font-mono">{pendingCount} pending</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              {verifiedCount} Verified
            </span>
          </div>
        </div>

        {/* Navigation Tabs - Exclusively Faculty Tabs */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Academic Sign-Off</span>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Coordinator Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'verification'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Marks Verification</span>
            {pendingCount > 0 && (
              <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('merit')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'merit'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Department Merit & CGPA</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Department Analytics</span>
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({currentUser?.scpeId || 'SCPE-FAC-001'})</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* FACULTY TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">{meta.title}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                CSE Department
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SCPE_ID: {currentUser?.scpeId || 'SCPE-FAC-001'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Academic Sign-Off & Verification Authority • Batch 2027
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1 px-2.5 text-xs bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-bold outline-none"
            >
              <option value="CSE">Dept: Computer Science (CSE)</option>
              <option value="IT">Dept: Information Tech (IT)</option>
              <option value="ENTC">Dept: Electronics (ENTC)</option>
            </select>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Verification Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                RV
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">Prof. Rajesh Verma</p>
                <p className="text-[10px] font-mono text-blue-600 mt-0.5">{currentUser?.scpeId || 'SCPE-FAC-001'}</p>
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

        {/* BODY */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Dept Students</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{students.length * 24}</span>
                <span className="text-xs font-bold text-slate-400">Batch 2027</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Computer Science & Engineering</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Verified Records</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{verifiedCount}</span>
                <span className="text-xs font-bold text-emerald-600">
                  {Math.round((verifiedCount / students.length) * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Eligible to participate in drives</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Pending Sign-off</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{pendingCount}</span>
                <span className="text-xs font-bold text-amber-600">Action Required</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Submitted for verification</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Flagged Discrepancies</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{rejectedCount}</span>
                <span className="text-xs font-bold text-rose-600">Needs Correction</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Marksheet aggregate mismatch</p>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & VERIFICATION COMBINED / TAB 2: VERIFICATION ONLY */}
          {(activeTab === 'overview' || activeTab === 'verification') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    Student Academic Verification Queue (STUDENT_VERIFY)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Inspect submitted marks and approve credentials to unlock drive participation
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search by student name, roll, or SCPE ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 w-52 sm:w-64"
                    />
                  </div>

                  <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium">
                    {(['ALL', 'SUBMITTED', 'VERIFIED', 'REJECTED'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          statusFilter === st
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {st === 'SUBMITTED' ? 'Pending' : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3">SCPE ID & Student Name</th>
                      <th className="pb-3">10th %</th>
                      <th className="pb-3">12th %</th>
                      <th className="pb-3">Current CGPA</th>
                      <th className="pb-3">Backlogs (Act / Hist)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5">
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="font-mono text-[10px] text-blue-600 font-semibold">{s.scpeId} • {s.rollNo}</p>
                          {s.remark && (
                            <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                              Note: {s.remark}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 font-bold text-slate-700">{s.tenthPct}%</td>
                        <td className="py-3.5 font-bold text-slate-700">{s.twelfthPct}%</td>
                        <td className="py-3.5 font-extrabold text-blue-600 font-mono text-sm">{s.cgpa}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.activeBacklogs === 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {s.activeBacklogs} Active / {s.backlogHistory} Total
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            s.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.verificationStatus === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {s.verificationStatus === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {s.verificationStatus === 'REJECTED' && <XCircle className="w-3 h-3 text-rose-600" />}
                            {s.verificationStatus === 'SUBMITTED' && <Clock className="w-3 h-3 text-amber-600" />}
                            <span>{s.verificationStatus}</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(s.id)}
                              disabled={s.verificationStatus === 'VERIFIED'}
                              className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Sign Off</span>
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(s.id)}
                              disabled={s.verificationStatus === 'REJECTED'}
                              className="py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-40 text-[11px] font-bold transition border border-rose-200 flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Flag</span>
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

          {/* TAB 3: MERIT LEDGER & CGPA */}
          {(activeTab === 'overview' || activeTab === 'merit') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="font-extrabold text-sm text-slate-900 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  CGPA Distribution — Dept of Computer Science (Batch 2027)
                </h3>
                <p className="text-xs text-slate-500 mb-4">Academic profile strength for campus recruitment shortlisting</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                      <span>9.0+ CGPA (Dream Tier)</span>
                      <span className="font-mono text-blue-600 font-bold">28 students (19.7%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                      <span>8.0 - 8.9 CGPA (Tier 1 Core)</span>
                      <span className="font-mono text-emerald-600 font-bold">64 students (45.1%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                      <span>7.0 - 7.9 CGPA (Mass Recruitment)</span>
                      <span className="font-mono text-cyan-600 font-bold">36 students (25.3%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                      <span>Below 7.0 CGPA / Active Backlog</span>
                      <span className="font-mono text-rose-600 font-bold">14 students (9.9%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-1 flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-600" />
                    Verified Department Master Merit List
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Export faculty-certified academic ledger directly to the Central Training & Placement Office.
                  </p>

                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 space-y-2">
                    <p className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Verification Authority Confirmed</span>
                    </p>
                    <p className="text-blue-800/80">
                      Faculty sign-offs apply digital verification flags stored in the PostgreSQL database.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert('Exporting CSE Batch 2027 Verified Academic Ledger (CSV)...')}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 mt-4"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certified Ledger (Excel / CSV)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <ReportsAnalyticsView drives={drives} />
          )}
        </main>

        <footer className="mt-auto py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between">
          <span>SCPES Faculty Portal &copy; 2026 • Department Placement Verification Cell</span>
          <span className="font-mono text-[11px] text-slate-400">
            Student Service :8083 • PostgreSQL Academic Schema
          </span>
        </footer>
      </div>

      {/* Discrepancy Flagging Modal */}
      {activeRemarkModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-slate-900">Flag Academic Discrepancy</h3>
            </div>
            <p className="text-xs text-slate-500">
              Provide reason for rejection so the student can rectify and resubmit their marksheet.
            </p>
            <textarea
              rows={3}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="e.g. CGPA does not match Semester 5 transcript; please upload verified grade card..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveRemarkModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm"
              >
                Confirm Flag
              </button>
            </div>
          </div>
        </div>
      )}

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
