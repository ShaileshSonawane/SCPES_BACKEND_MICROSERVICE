import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Building,
  TrendingUp,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Drive } from '../types';

interface Props {
  drives: Drive[];
  onNavigateTab: (tab: any) => void;
}

export const TpoDashboardView: React.FC<Props> = ({ drives, onNavigateTab }) => {
  const [approvals, setApprovals] = useState([
    { id: 1, name: 'Persistent Systems', email: 'hr@persistent.com', sector: 'IT Services' },
    { id: 2, name: 'Bosch India', email: 'campus@bosch.in', sector: 'Manufacturing' },
    { id: 3, name: 'Zoho Corp', email: 'talent@zoho.com', sector: 'Software' },
  ]);

  const handleAction = (id: number) => {
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered students</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">480</span>
            <span className="text-xs font-bold text-slate-400">Batch 2027</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified academic profiles</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active drives</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">9</span>
            <span className="text-xs font-bold text-indigo-600">3 closing this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Accepting applications</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending approvals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{approvals.length}</span>
            <span className="text-xs font-bold text-amber-600">Recruiters</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting TPO validation</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Placed students</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">312</span>
            <span className="text-xs font-bold text-emerald-600">65% placement rate</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Offers accepted</p>
        </div>
      </div>

      {/* Middle Grid: Drive Funnel & Department Placement % */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drive Funnel (All Drives) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Drive funnel (all drives)</h3>
              <span className="text-xs text-slate-400 font-medium">Batch 2027 Aggregate</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Eligible</span>
                  <span className="text-slate-900">412 candidates</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Applied</span>
                  <span className="text-slate-900">268 candidates</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Shortlisted</span>
                  <span className="text-slate-900">94 candidates</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Selected</span>
                  <span className="text-emerald-600 font-black">41 candidates hired</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('eligibility-results')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View detailed student evaluations (Screen 8)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Department-wise Placement % */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Department-wise placement %</h3>
              <span className="text-xs text-slate-400 font-medium">Batch 2027</span>
            </div>

            <div className="space-y-3.5">
              {[
                { dept: 'CSE', pct: 92, color: 'bg-indigo-600' },
                { dept: 'IT', pct: 88, color: 'bg-indigo-500' },
                { dept: 'ECE', pct: 76, color: 'bg-indigo-400' },
                { dept: 'MECH', pct: 61, color: 'bg-slate-400' },
                { dept: 'CIVIL', pct: 54, color: 'bg-slate-300' },
              ].map((d) => (
                <div key={d.dept}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">{d.dept}</span>
                    <span className="text-slate-900">{d.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${d.color} h-full rounded-full`} style={{ width: `${d.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('reports-analytics')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View full analytics & salary report (Screen 11)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Company Registration Approvals Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Company Registrations</h3>
            <p className="text-xs text-slate-400">Recruiters requiring TPO validation before creating drives</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {approvals.length} Pending
          </span>
        </div>

        {approvals.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            All company registrations approved.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Company Registration</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Sector</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvals.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{app.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{app.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        {app.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleAction(app.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(app.id)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
