import React, { useState } from 'react';
import {
  Server,
  ShieldCheck,
  Building,
  Users,
  Sliders,
  BarChart3,
  LogOut,
  Bell,
  Cpu,
  Activity,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink
} from 'lucide-react';
import { User, Drive, NotificationSummary } from '../../types';
import { ReportsAnalyticsView } from '../ReportsAnalyticsView';
import { NotificationDrawer } from '../NotificationDrawer';
import { AccessDeniedView } from '../AccessDeniedView';

export type AdminTab = 'mesh' | 'companies' | 'policy' | 'users' | 'reports';

interface Props {
  currentUser: User | null;
  drives: Drive[];
  notifications: NotificationSummary | null;
  onLogout: () => void;
  onRefreshDrives: () => Promise<void>;
}

export const AdminPortal: React.FC<Props> = ({
  currentUser,
  drives,
  notifications,
  onLogout,
  onRefreshDrives,
}) => {
  // Strict role security guard
  if (currentUser && currentUser.role !== 'ADMIN') {
    return <AccessDeniedView currentUser={currentUser} requiredRole="Super Admin" onLogout={onLogout} />;
  }

  const [activeTab, setActiveTab] = useState<AdminTab>('mesh');
  const [showNotifications, setShowNotifications] = useState(false);

  // Microservices state
  const [services] = useState([
    { name: 'api-gateway', port: '8080', status: 'ONLINE', latency: '4ms', type: 'Spring Cloud Gateway (WebFlux)', version: 'v1.0' },
    { name: 'identity-service', port: '8082', status: 'ONLINE', latency: '6ms', type: 'JWT & RBAC Auth Engine', version: 'v1.0' },
    { name: 'student-service', port: '8083', status: 'ONLINE', latency: '8ms', type: 'Profile & gRPC Server (:9090)', version: 'v1.0' },
    { name: 'placement-service', port: '8084', status: 'ONLINE', latency: '5ms', type: 'Drives & Applications Registry', version: 'v1.0' },
    { name: 'eligibility-service', port: '8085', status: 'ONLINE', latency: '3ms', type: 'Rule Engine (Virtual Threads)', version: 'v1.0' },
    { name: 'matching-service', port: '8086', status: 'ONLINE', latency: '12ms', type: 'Kafka Resume Skill Matcher', version: 'v1.0' },
    { name: 'notification-service', port: '8081', status: 'STANDBY', latency: '1ms', type: 'WebSocket & SSE Engine', version: 'v1.0' },
    { name: 'report-service', port: '8087', status: 'STANDBY', latency: '2ms', type: 'PDF/CSV Funnel Exporter', version: 'v1.0' },
    { name: 'scpes-postgres', port: '5433', status: 'ONLINE', latency: '2ms', type: 'PostgreSQL Relational DB', version: '16-alpine' },
    { name: 'scpes-kafka', port: '29092', status: 'ONLINE', latency: '4ms', type: 'Apache Kafka Event Broker', version: '7.4.0' },
  ]);

  // Company approval queue
  const [companies, setCompanies] = useState([
    { id: 'c1', scpeId: 'SCPE-CMP-003', name: 'Microsoft India', email: 'campus-recruitment@microsoft.com', domain: 'Cloud & AI', ctcRange: '18 - 44 LPA', status: 'PENDING', date: 'Today, 10:15 AM' },
    { id: 'c2', scpeId: 'SCPE-CMP-004', name: 'Atlassian Corp', email: 'university-talent@atlassian.com', domain: 'Enterprise SaaS', ctcRange: '22 - 38 LPA', status: 'PENDING', date: 'Yesterday' },
    { id: 'c3', scpeId: 'SCPE-CMP-005', name: 'Goldman Sachs', email: 'campus.india@gs.com', domain: 'Fintech & Quant', ctcRange: '16 - 28 LPA', status: 'PENDING', date: '2 days ago' },
    { id: 'c4', scpeId: 'SCPE-CMP-006', name: 'Infosys Limited', email: 'recruiter@infosys.com', domain: 'IT & Digital', ctcRange: '4 - 9.5 LPA', status: 'APPROVED', date: '1 week ago' },
  ]);

  // Placement policy
  const [policyOneOffer, setPolicyOneOffer] = useState(true);
  const [dreamCompanyThreshold, setDreamCompanyThreshold] = useState(12);
  const [requireFacultyVerification, setRequireFacultyVerification] = useState(true);
  const [policySaved, setPolicySaved] = useState(false);

  // User directory
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  const [users] = useState([
    { id: 'u1', scpeId: 'SCPE-TPO-001', name: 'Dr. Meera Kulkarni', email: 'tpo@scpes.edu', role: 'TPO', dept: 'Central Placement Office', status: 'ACTIVE', lastActive: '2 mins ago' },
    { id: 'u2', scpeId: 'SCPE-FAC-001', name: 'Prof. Rajesh Verma', email: 'faculty@scpes.edu', role: 'FACULTY', dept: 'Computer Science & Eng', status: 'ACTIVE', lastActive: '15 mins ago' },
    { id: 'u3', scpeId: 'SCPE-FAC-002', name: 'Prof. Sunita Deshmukh', email: 's.deshmukh@scpes.edu', role: 'FACULTY', dept: 'Information Technology', status: 'ACTIVE', lastActive: '1 hour ago' },
    { id: 'u4', scpeId: 'SCPE-REC-001', name: 'Rohan Shah (Google)', email: 'recruiter@google.com', role: 'RECRUITER', dept: 'Talent Acquisition Team', status: 'ACTIVE', lastActive: '3 hours ago' },
    { id: 'u5', scpeId: 'SCPE-STU-001', name: 'Aarav Patil', email: 'student1@scpes.edu', role: 'STUDENT', dept: 'CSE - Batch 2027 (Roll: 101)', status: 'ACTIVE', lastActive: 'Just now' },
    { id: 'u6', scpeId: 'SCPE-STU-002', name: 'Neha Patel', email: 'student2@scpes.edu', role: 'STUDENT', dept: 'IT - Batch 2027 (Roll: 119)', status: 'ACTIVE', lastActive: '10 mins ago' },
    { id: 'u7', scpeId: 'SCPE-ADM-001', name: 'Super Admin', email: 'admin@scpes.edu', role: 'ADMIN', dept: 'System Infrastructure', status: 'ACTIVE', lastActive: 'Active Now' },
  ]);

  const handleApproveCompany = (id: string) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c));
  };

  const handleRejectCompany = (id: string) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: 'REJECTED' } : c));
  };

  const handleSavePolicy = () => {
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.scpeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const unreadCount = notifications?.unreadCount || 2;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'mesh':
        return { title: 'Microservices Mesh & Infrastructure Topology', screen: 'Screen 1' };
      case 'companies':
        return { title: 'External Recruiter & Company Onboarding', screen: 'Screen 1' };
      case 'policy':
        return { title: 'University Placement Policy Governance', screen: 'Screen 1' };
      case 'users':
        return { title: 'User Directory & Role-Based Access Control', screen: 'Screen 1' };
      case 'reports':
        return { title: 'System-Wide Placement Audit & Analytics', screen: 'Screen 11' };
    }
  };

  const meta = getTabTitle();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* SUPER ADMIN SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-purple-500/25">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">SCPES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5 font-mono">{currentUser?.scpeId || 'SCPE-ADM-001'}</p>
          </div>
        </div>

        {/* Admin Profile Mini Card */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Super Administrator</p>
              <p className="text-[10px] text-purple-300 font-mono truncate">{currentUser?.scpeId || 'SCPE-ADM-001'}</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Node: <strong className="text-purple-300 font-mono">SCPES-NODE-01</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              10/10 Online
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Governance Controls</span>
          </div>

          <button
            onClick={() => setActiveTab('mesh')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'mesh'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Microservices Mesh</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono">10</span>
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'companies'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Company Approvals</span>
            <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
              {companies.filter(c => c.status === 'PENDING').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'policy'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Placement Policies</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>User Directory & RBAC</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'reports'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>System Audit Reports</span>
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({currentUser?.scpeId || 'SCPE-ADM-001'})</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ADMIN TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">{meta.title}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Super Admin
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SCPE_ID: {currentUser?.scpeId || 'SCPE-ADM-001'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              SCPES University Infrastructure & RBAC Governance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200/80 text-purple-800 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span>Cluster Mesh Active</span>
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">Super Administrator</p>
                <p className="text-[10px] font-mono text-purple-600 mt-0.5">{currentUser?.scpeId || 'SCPE-ADM-001'}</p>
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
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Cluster Services</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <Server className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">10 / 10</span>
                <span className="text-xs font-bold text-emerald-600">All Online</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Gateway + 7 Services + DB + Kafka</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total System Users</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{users.length * 75 + 1}</span>
                <span className="text-xs font-bold text-purple-600">5 Distinct Roles</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Students, Recruiters, Faculty, TPO, Admins</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Company Approvals</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {companies.filter(c => c.status === 'PENDING').length}
                </span>
                <span className="text-xs font-bold text-amber-600">Pending Review</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Awaiting Super Admin Signoff</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Evaluation Engine</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">Java 21</span>
                <span className="text-xs font-bold text-indigo-600">Virtual Threads</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Project Loom enabled on port 8085</p>
            </div>
          </div>

          {/* TAB 1: MICROSERVICES MESH */}
          {activeTab === 'mesh' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Microservices Mesh & Infrastructure Topology
                  </h2>
                  <p className="text-xs text-slate-500">Live operational status and ping metrics for all system endpoints</p>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Cluster Health: Optimal
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3">Component</th>
                      <th className="pb-3">Port / Bind</th>
                      <th className="pb-3">Architecture Role</th>
                      <th className="pb-3">Latency</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services.map((svc) => (
                      <tr key={svc.name} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-mono">{svc.name}</span>
                        </td>
                        <td className="py-2.5 font-mono text-slate-600">:{svc.port}</td>
                        <td className="py-2.5 text-slate-500">{svc.type}</td>
                        <td className="py-2.5 font-mono text-slate-600">{svc.latency}</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            svc.status === 'ONLINE'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {svc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY APPROVALS */}
          {activeTab === 'companies' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    External Recruiter & Company Registration Queue
                  </h2>
                  <p className="text-xs text-slate-500">
                    Corporate partners registering to host on-campus placement drives require Super Admin validation
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {companies.filter(c => c.status === 'PENDING').length} Pending Review
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                        <p className="text-[10px] font-mono text-slate-500">{c.scpeId}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : c.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <p><span className="font-semibold text-slate-700">Domain:</span> {c.domain}</p>
                      <p><span className="font-semibold text-slate-700">CTC Band:</span> {c.ctcRange}</p>
                      <p className="font-mono text-[11px] text-slate-400">{c.email}</p>
                    </div>

                    {c.status === 'PENDING' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handleApproveCompany(c.id)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Recruiter</span>
                        </button>
                        <button
                          onClick={() => handleRejectCompany(c.id)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-rose-200"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PLACEMENT POLICY GOVERNANCE */}
          {activeTab === 'policy' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    University Placement Policy Governance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enforce institutional rules executed across the Kafka event stream and rule engine
                  </p>
                </div>
                <button
                  onClick={handleSavePolicy}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{policySaved ? 'Policy Saved!' : 'Apply Governance Policy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">One-Offer Policy (ONE_OFFER)</span>
                    <input
                      type="checkbox"
                      checked={policyOneOffer}
                      onChange={(e) => setPolicyOneOffer(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    When active, placed students cannot apply to lower/equal drives unless CTC exceeds Dream threshold.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Dream Company Tier</span>
                    <span className="text-xs font-mono font-bold text-purple-600">₹{dreamCompanyThreshold} LPA</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="25"
                    step="1"
                    value={dreamCompanyThreshold}
                    onChange={(e) => setDreamCompanyThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">
                    Students holding an offer can only apply to drives with CTC ≥ this threshold.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Faculty Verification Gate</span>
                    <input
                      type="checkbox"
                      checked={requireFacultyVerification}
                      onChange={(e) => setRequireFacultyVerification(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Only students with <span className="font-semibold text-emerald-600">VERIFIED</span> marks by department faculty coordinators can be evaluated for drives.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USER DIRECTORY & RBAC */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    University User Directory & Role-Based Access Control
                  </h2>
                  <p className="text-xs text-slate-500">Manage user identities and role assignments across all microservice portals</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search user, email, scpe_id..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Super Admin</option>
                    <option value="TPO">TPO Officer</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3">SCPE ID & Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Department / Org</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Last Active</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3">
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="font-mono text-[11px] font-semibold text-purple-600">{u.scpeId}</p>
                        </td>
                        <td className="py-3 font-mono text-slate-500">{u.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'TPO'
                              ? 'bg-indigo-100 text-indigo-700'
                              : u.role === 'FACULTY'
                              ? 'bg-blue-100 text-blue-700'
                              : u.role === 'RECRUITER'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{u.dept}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 font-mono text-[11px]">{u.lastActive}</td>
                        <td className="py-3 text-right">
                          <button className="text-purple-600 hover:text-purple-800 font-bold text-[11px]">
                            Manage Permissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & AUDIT */}
          {activeTab === 'reports' && (
            <ReportsAnalyticsView drives={drives} />
          )}
        </main>

        <footer className="mt-auto py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between">
          <span>SCPES Super Admin Center &copy; 2026 • University Governance & Node Monitor</span>
          <span className="font-mono text-[11px] text-slate-400">
            Identity Service :8082 • Gateway :8080 • Kafka :29092
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
