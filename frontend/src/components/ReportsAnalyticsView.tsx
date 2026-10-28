import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileDown,
  Building,
  Award,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Drive } from '../types';

interface Props {
  drives: Drive[];
}

export const ReportsAnalyticsView: React.FC<Props> = ({ drives }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportPdf = async () => {
    setDownloading(true);
    try {
      const driveId = drives[0]?.id || 'default-drive';
      await api.downloadReportPdf(driveId);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e: any) {
      const errMsg = e?.response?.data?.message || e?.message || 'Failed to generate report';
      console.error('[ReportsAnalyticsView] Export PDF failed:', {
        reason: errMsg,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      alert('Report export failed: ' + errMsg);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Highest package
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">32 LPA</span>
            <span className="text-xs font-bold text-slate-600">Amazon</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Off-campus & campus top offer</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Average package
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">7.8 LPA</span>
            <span className="text-xs font-bold text-emerald-600">+14% YoY</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">All placed students</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Median package
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-700">6.5 LPA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">50th percentile offer value</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Companies visited
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">24</span>
            <span className="text-xs font-bold text-indigo-600">This academic year</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active corporate partners</p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Report PDF generated via iText in report-service and dispatched to browser!</span>
        </div>
      )}

      {/* Middle Grid: Dept Average Package on Left, Company Selection Volume on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Average Package (Horizontal Bars) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base">Average package by department (LPA)</h3>
            <span className="text-xs text-slate-400 font-medium">Batch 2027</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { dept: 'CSE', val: 9.8, max: 12, color: 'bg-indigo-600' },
              { dept: 'IT', val: 8.4, max: 12, color: 'bg-indigo-500' },
              { dept: 'ECE', val: 7.1, max: 12, color: 'bg-indigo-400' },
              { dept: 'MECH', val: 5.6, max: 12, color: 'bg-slate-400' },
              { dept: 'CIVIL', val: 4.8, max: 12, color: 'bg-slate-300' },
            ].map((d) => {
              const widthPct = (d.val / d.max) * 100;
              return (
                <div key={d.dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{d.dept}</span>
                    <span className="text-indigo-900 font-black">{d.val} LPA</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`${d.color} h-full rounded-full transition-all duration-500`} style={{ width: `${widthPct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company-wise Selections */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base">Company-wise selections</h3>
            <span className="text-xs text-slate-400 font-medium">Hired candidates</span>
          </div>

          <div className="space-y-2.5">
            {[
              { company: 'Infosys', count: 41, max: 50, color: 'bg-blue-600' },
              { company: 'TCS', count: 38, max: 50, color: 'bg-indigo-600' },
              { company: 'Capgemini', count: 29, max: 50, color: 'bg-cyan-600' },
              { company: 'Persistent', count: 22, max: 50, color: 'bg-orange-600' },
              { company: 'Wipro', count: 18, max: 50, color: 'bg-emerald-600' },
              { company: 'Zensar', count: 12, max: 50, color: 'bg-purple-600' },
              { company: 'Cognizant', count: 9, max: 50, color: 'bg-slate-600' },
            ].map((c) => (
              <div key={c.company} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
                <span className="text-xs font-bold text-slate-800">{c.company}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                    <div className={`${c.color} h-full rounded-full`} style={{ width: `${(c.count / c.max) * 100}%` }}></div>
                  </div>
                  <span className="text-xs font-black text-slate-900 w-6 text-right">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Action Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-900/60">
        <div>
          <h4 className="text-lg font-bold">Institutional Placement & Funnel Dossier</h4>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            Includes department summaries, package statistics, criteria configurations, and eligible-applied-selected funnels per drive generated by report-service.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            disabled={downloading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition"
          >
            <FileDown className="w-4 h-4" />
            <span>{downloading ? 'Generating PDF...' : 'Export PDF'}</span>
          </button>

          <button
            onClick={() => alert('Exporting complete institutional placement dossier as Excel...')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
          >
            Export Excel / CSV
          </button>
        </div>
      </div>
    </div>
  );
};
