import React from 'react';
import { AlertTriangle, Info, ArrowLeft, ShieldAlert } from 'lucide-react';

interface Props {
  onNavigateTab: (tab: any) => void;
  activePersona: string;
}

export const NotEligibleDrivesView: React.FC<Props> = ({
  onNavigateTab,
  activePersona,
}) => {
  const isStudent2 = activePersona === 'student2';

  const rows = [
    {
      initial: 'T',
      bgColor: 'bg-blue-700',
      company: 'TCS Digital',
      role: 'Digital Engineer',
      ctc: '7 LPA',
      reasons: ['Active backlogs 1 > allowed 0'],
    },
    {
      initial: 'W',
      bgColor: 'bg-emerald-700',
      company: 'Wipro Turbo',
      role: 'Project Engineer',
      ctc: '6.5 LPA',
      reasons: ['CGPA 7.4 < required 7.5'],
    },
    {
      initial: 'A',
      bgColor: 'bg-amber-600',
      company: 'Amazon',
      role: 'SDE-1',
      ctc: '24 LPA',
      reasons: ['CGPA 7.4 < 8.0', 'Active backlogs 1 > 0'],
    },
    {
      initial: 'B',
      bgColor: 'bg-rose-700',
      company: 'Bosch',
      role: 'Embedded Engineer',
      ctc: '8 LPA',
      reasons: ['Branch CSE not allowed (ECE, EEE only)'],
    },
    {
      initial: 'D',
      bgColor: 'bg-teal-700',
      company: 'Deloitte',
      role: 'Analyst',
      ctc: '7.5 LPA',
      reasons: ['12th % 58 < required 60'],
    },
    {
      initial: 'A',
      bgColor: 'bg-purple-700',
      company: 'Accenture',
      role: 'ASE',
      ctc: '4.5 LPA',
      reasons: ['Already placed (One-Offer policy)'],
    },
    {
      initial: 'T',
      bgColor: 'bg-slate-700',
      company: 'Tech Mahindra',
      role: 'Associate',
      ctc: '4 LPA',
      reasons: ['Passout year 2026 required (You are 2027)'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('eligible-drives')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Eligible ({isStudent2 ? '2' : '12'})
          </button>
          <button className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs">
            Not Eligible ({rows.length})
          </button>
        </div>

        <button
          onClick={() => onNavigateTab('eligible-drives')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Eligible Drives
        </button>
      </div>

      {/* Verified Record Status Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
              Verified Student Record
            </p>
            <p className="text-sm font-semibold text-amber-950 mt-0.5">
              CGPA <span className="underline font-bold">7.4</span> • Active backlogs <span className="underline font-bold">1</span> • Branch <span className="underline font-bold">CSE</span>. Clear your backlog to unlock 3 more drives.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-200/60 text-amber-900 hidden sm:inline">
          Rule Engine Enforced
        </span>
      </div>

      {/* Disqualification Reasons Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Ineligibility Audit Trail</h3>
            <p className="text-xs text-slate-400">Exact criteria violations computed deterministically by SCPES rule evaluator</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">{rows.length} disqualified drives</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Company</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">CTC</th>
                <th className="px-6 py-3.5">Why You Are Not Eligible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl ${row.bgColor} text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}
                    >
                      {row.initial}
                    </div>
                    <span>{row.company}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{row.role}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{row.ctc}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {row.reasons.map((r, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{r}</span>
                        </span>
                      ))}
                    </div>
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
