import React, { useState } from 'react';
import { Drive, Application } from '../types';
import { api } from '../services/api';
import { RulesModal } from './RulesModal';
import {
  Briefcase,
  Play,
  Sliders,
  FileDown,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  drives: Drive[];
  onRefreshDrives: () => void;
}

export const TpoDashboard: React.FC<Props> = ({ drives, onRefreshDrives }) => {
  const [selectedDriveForRules, setSelectedDriveForRules] = useState<Drive | null>(null);
  const [activeDriveApplicants, setActiveDriveApplicants] = useState<{ drive: Drive; apps: Application[] } | null>(null);
  const [evaluatingDriveId, setEvaluatingDriveId] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<{ driveId: string; eligibleCount: number; studentIds: string[] } | null>(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  const handleEvaluate = async (driveId: string) => {
    setEvaluatingDriveId(driveId);
    setEvalResult(null);
    try {
      const res = await api.evaluateDrive(driveId);
      const eligibleCount = res.eligible !== undefined ? Number(res.eligible) : (res.eligibleStudentIds?.length || 0);
      setEvalResult({
        driveId,
        eligibleCount,
        studentIds: res.eligibleStudentIds || [],
      });
      onRefreshDrives();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to evaluate drive');
    } finally {
      setEvaluatingDriveId(null);
    }
  };

  const handleViewApplicants = async (drive: Drive) => {
    setLoadingApplicants(true);
    try {
      const apps = await api.getDriveApplications(drive.id);
      setActiveDriveApplicants({ drive, apps });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    setUpdatingAppId(appId);
    try {
      await api.updateApplicationStatus(appId, status);
      if (activeDriveApplicants) {
        const apps = await api.getDriveApplications(activeDriveApplicants.drive.id);
        setActiveDriveApplicants({ drive: activeDriveApplicants.drive, apps });
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleDownloadPdf = async (driveId: string) => {
    try {
      await api.downloadReportPdf(driveId);
    } catch (err: any) {
      alert('Report service unavailable or error downloading PDF: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            TPO Placement Operations
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Placement Officer Control Console</h2>
          <p className="mt-2 text-indigo-200 text-sm leading-relaxed">
            Configure criteria rules, trigger high-throughput eligibility evaluations powered by Java 21 Virtual Threads, manage applicant funnels, and export placement reports.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-indigo-800/60">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-300 uppercase font-semibold">Active Drives</span>
            <p className="text-2xl font-bold text-white mt-0.5">{drives.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-300 uppercase font-semibold">Highest CTC</span>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">
              ₹{Math.max(...drives.map(d => d.ctc || 0), 18).toFixed(1)} LPA
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-300 uppercase font-semibold">Eval Engine</span>
            <p className="text-sm font-bold text-indigo-200 mt-1">Virtual Threads</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-300 uppercase font-semibold">Event Broker</span>
            <p className="text-sm font-bold text-indigo-200 mt-1">Kafka KRaft</p>
          </div>
        </div>
      </div>

      {/* Live Evaluation Banner */}
      {evalResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Virtual Thread Evaluation Finished</p>
              <p className="text-xs text-emerald-700">
                Found <span className="font-bold underline">{evalResult.eligibleCount}</span> verified eligible candidate(s) for drive.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEvalResult(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1 bg-emerald-100/60 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Placement Drives List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">Placement Drives</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">{drives.length} drives registered</span>
        </div>

        <div className="divide-y divide-slate-100">
          {drives.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Building className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No drives found in placement service database</p>
            </div>
          ) : (
            drives.map((drive) => (
              <div key={drive.id} className="p-6 hover:bg-slate-50/50 transition">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-slate-900 text-lg">{drive.companyName}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        ₹{drive.ctc} LPA
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        drive.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {drive.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 font-medium">{drive.role}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>Rounds: {drive.rounds?.length || 0}</span>
                      <span>•</span>
                      <span>Last Apply: {drive.lastApplyDate || 'Open'}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">ID: {drive.id.slice(0, 8)}...</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedDriveForRules(drive)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      Configure Rules
                    </button>

                    <button
                      onClick={() => handleEvaluate(drive.id)}
                      disabled={evaluatingDriveId === drive.id}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Play className={`w-3.5 h-3.5 ${evaluatingDriveId === drive.id ? 'animate-spin' : ''}`} />
                      {evaluatingDriveId === drive.id ? 'Evaluating...' : 'Evaluate Drive'}
                    </button>

                    <button
                      onClick={() => handleViewApplicants(drive)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      Applicants
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(drive.id)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition"
                      title="Download PDF Funnel Report"
                    >
                      <FileDown className="w-3.5 h-3.5 text-slate-500" />
                      PDF Report
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applicants Drawer / Section if active */}
      {activeDriveApplicants && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                Applicants for {activeDriveApplicants.drive.companyName} — {activeDriveApplicants.drive.role}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Authoritative status transitions emitted to Kafka broker.</p>
            </div>
            <button
              onClick={() => setActiveDriveApplicants(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>

          <div className="mt-4">
            {activeDriveApplicants.apps.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No students have applied to this drive yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeDriveApplicants.apps.map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        Candidate: {app.studentId}
                      </span>
                      <p className="text-xs text-slate-400">
                        Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        app.status === 'SELECTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'SHORTLISTED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status}
                      </span>

                      {app.status === 'APPLIED' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                          disabled={updatingAppId === app.id}
                          className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                        >
                          Shortlist
                        </button>
                      )}

                      {app.status === 'SHORTLISTED' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                          disabled={updatingAppId === app.id}
                          className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                        >
                          Select (Hire)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {selectedDriveForRules && (
        <RulesModal
          drive={selectedDriveForRules}
          onClose={() => setSelectedDriveForRules(null)}
          onSaved={() => {
            onRefreshDrives();
          }}
        />
      )}
    </div>
  );
};
