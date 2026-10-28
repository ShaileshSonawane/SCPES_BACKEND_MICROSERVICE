import React, { useState } from 'react';
import {
  Server,
  ShieldCheck,
  Building,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Cpu,
  Database,
  Radio,
  FileCheck,
  Settings,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Sliders,
  Layers
} from 'lucide-react';
import { Drive } from '../types';

interface Props {
  drives: Drive[];
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboardView: React.FC<Props> = ({ drives, onNavigateTab }) => {
  // Service health monitoring
  const [services, setServices] = useState([
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
    { id: 'c1', name: 'Microsoft India', email: 'campus-recruitment@microsoft.com', domain: 'Cloud & AI', ctcRange: '18 - 44 LPA', status: 'PENDING', date: 'Today, 10:15 AM' },
    { id: 'c2', name: 'Atlassian Corp', email: 'university-talent@atlassian.com', domain: 'Enterprise SaaS', ctcRange: '22 - 38 LPA', status: 'PENDING', date: 'Yesterday' },
    { id: 'c3', name: 'Goldman Sachs', email: 'campus.india@gs.com', domain: 'Fintech & Quant', ctcRange: '16 - 28 LPA', status: 'PENDING', date: '2 days ago' },
    { id: 'c4', name: 'Infosys Limited', email: 'recruiter@infosys.com', domain: 'IT & Digital', ctcRange: '4 - 9.5 LPA', status: 'APPROVED', date: '1 week ago' },
  ]);

  // System placement policy controls
  const [policyOneOffer, setPolicyOneOffer] = useState(true);
  const [dreamCompanyThreshold, setDreamCompanyThreshold] = useState(12);
  const [requireFacultyVerification, setRequireFacultyVerification] = useState(true);
  const [policySaved, setPolicySaved] = useState(false);

  // User directory
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  const [users, setUsers] = useState([
    { id: 'u1', name: 'Dr. Meera Kulkarni', email: 'tpo@scpes.edu', role: 'TPO', dept: 'Central Placement Office', status: 'ACTIVE', lastActive: '2 mins ago' },
    { id: 'u2', name: 'Prof. Rajesh Verma', email: 'faculty@scpes.edu', role: 'FACULTY', dept: 'Computer Science & Eng', status: 'ACTIVE', lastActive: '15 mins ago' },
    { id: 'u3', name: 'Prof. Sunita Deshmukh', email: 's.deshmukh@scpes.edu', role: 'FACULTY', dept: 'Information Technology', status: 'ACTIVE', lastActive: '1 hour ago' },
    { id: 'u4', name: 'Rohan Shah (Infosys)', email: 'recruiter@infosys.com', role: 'RECRUITER', dept: 'Talent Acquisition Team', status: 'ACTIVE', lastActive: '3 hours ago' },
    { id: 'u5', name: 'Aarav Patil', email: 'student1@scpes.edu', role: 'STUDENT', dept: 'CSE - Batch 2027 (Roll: 101)', status: 'ACTIVE', lastActive: 'Just now' },
    { id: 'u6', name: 'Neha Patel', email: 'student2@scpes.edu', role: 'STUDENT', dept: 'IT - Batch 2027 (Roll: 119)', status: 'ACTIVE', lastActive: '10 mins ago' },
    { id: 'u7', name: 'Super Admin', email: 'admin@scpes.edu', role: 'ADMIN', dept: 'System Infrastructure', status: 'ACTIVE', lastActive: 'Active Now' },
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
                          u.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Super Admin Master Control
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Instance ID: SCPES-NODE-01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              University System Administration
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Monitor microservices mesh topology, approve external recruiter onboarding, manage RBAC privileges, and govern institution-wide placement policies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('tpo-dashboard')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
            >
              <Building className="w-4 h-4 text-indigo-400" />
              <span>TPO Console</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports-analytics')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Audit Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
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
            <span className="text-xs font-bold text-emerald-600">All Healthy</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Gateway + 7 Services + DB + Kafka</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total System Users</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">526</span>
            <span className="text-xs font-bold text-indigo-600">5 Roles</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">480 Students, 28 Recruiters, 14 Faculty, 3 TPO</p>
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
          <p className="text-[11px] text-slate-400 mt-1">Awaiting TPO & Admin Signoff</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Evaluation Engine</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">Loom</span>
            <span className="text-xs font-bold text-violet-600">Java 21</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Virtual Threads active on port 8085</p>
        </div>
      </div>

      {/* Main Grid: Services Mesh & Company Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Microservices Mesh Health Monitor */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Microservices Mesh & Infrastructure Topology
              </h2>
              <p className="text-xs text-slate-500">Live operational status and ping metrics for all system endpoints</p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Mesh Active
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

        {/* Right 1 Col: Company Registrations Approval Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                Company Approvals
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                COMPANY_APPROVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              External recruiters registering to host campus recruitment drives require Super Admin / TPO approval.
            </p>

            <div className="space-y-3">
              {companies.map((c) => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900">{c.name}</h3>
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

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p><span className="font-semibold text-slate-700">Domain:</span> {c.domain}</p>
                    <p><span className="font-semibold text-slate-700">CTC Band:</span> {c.ctcRange}</p>
                    <p className="font-mono text-[10px] text-slate-400">{c.email}</p>
                  </div>

                  {c.status === 'PENDING' && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                      <button
                        onClick={() => handleApproveCompany(c.id)}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectCompany(c.id)}
                        className="flex-1 py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center justify-center gap-1 transition border border-rose-200"
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

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">Integrated with Spring Boot Placement Service :8084</span>
          </div>
        </div>
      </div>

      {/* Global Placement Policy & Governance */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              University Placement Policy Governance
            </h2>
            <p className="text-xs text-slate-500">Configure global offer limits and verification rules enforced by the SCPES Eligibility Engine</p>
          </div>
          <button
            onClick={handleSavePolicy}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{policySaved ? 'Policy Saved!' : 'Apply Policy Rules'}</span>
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
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              When enabled, placed students cannot apply to normal drives unless CTC meets Dream Company threshold.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Dream Company Tier</span>
              <span className="text-xs font-mono font-bold text-indigo-600">₹{dreamCompanyThreshold} LPA</span>
            </div>
            <input
              type="range"
              min="8"
              max="25"
              step="1"
              value={dreamCompanyThreshold}
              onChange={(e) => setDreamCompanyThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
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
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Only students with <span className="font-semibold text-emerald-600">VERIFIED</span> marks by department faculty coordinators can be evaluated for drives.
            </p>
          </div>
        </div>
      </div>

      {/* User Directory & RBAC Management */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              System User Directory & Role-Based Access Control
            </h2>
            <p className="text-xs text-slate-500">Super Admin directory of all active identities across departments and portals</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user, email, dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48 sm:w-64"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
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
                <th className="pb-3">User & Email</th>
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
                    <p className="font-mono text-[11px] text-slate-400">{u.email}</p>
                  </td>
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
                    <button className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]">
                      Manage Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
