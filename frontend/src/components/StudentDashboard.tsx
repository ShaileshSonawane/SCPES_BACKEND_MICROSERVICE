import React, { useState, useEffect } from 'react';
import { StudentProfile, Drive, Application, EligibilityRow } from '../types';
import { api } from '../services/api';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Upload,
  AlertCircle,
  FileText,
  BadgeCheck,
  Building,
  ArrowRight
} from 'lucide-react';

interface Props {
  profile: StudentProfile | null;
  drives: Drive[];
  onRefresh: () => void;
}

export const StudentDashboard: React.FC<Props> = ({ profile, drives, onRefresh }) => {
  const [eligibilityMap, setEligibilityMap] = useState<Record<string, EligibilityRow>>({});
  const [applications, setApplications] = useState<Application[]>([]);
  const [applyingDriveId, setApplyingDriveId] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, [drives]);

  const loadStudentData = async () => {
    try {
      const myApps = await api.getMyApplications();
      setApplications(myApps);

      const map: Record<string, EligibilityRow> = {};
      for (const d of drives) {
        try {
          const row = await api.getMyEligibility(d.id);
          map[d.id] = row;
        } catch (e: any) {
          console.warn(`[StudentDashboard] Eligibility check for drive ${d.id} failed:`, e?.response?.data || e.message);
          // If not evaluated yet or error
          map[d.id] = { studentId: '', eligible: false, reasons: ['Not yet evaluated for this drive'] };
        }
      }
      setEligibilityMap(map);
    } catch (e: any) {
      console.error('Error fetching student data:', e?.response?.data || e.message);
    }
  };

  const handleApply = async (driveId: string) => {
    setApplyingDriveId(driveId);
    try {
      await api.applyToDrive(driveId);
      await loadStudentData();
      onRefresh();
    } catch (err: any) {
      const reason = err?.response?.data?.message || err?.message || 'Failed to submit application';
      console.error(`[StudentDashboard] Apply to drive ${driveId} failed:`, {
        reason,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert(reason);
    } finally {
      setApplyingDriveId(null);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeSuccess(false);
    try {
      await api.uploadResume(file);
      setResumeSuccess(true);
      setTimeout(() => setResumeSuccess(false), 4000);
    } catch (err: any) {
      const reason = err?.response?.data?.message || err?.message || 'Resume upload failed';
      console.error('[StudentDashboard] Resume upload failed:', {
        reason,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert('Error uploading resume: ' + reason);
    } finally {
      setUploadingResume(false);
    }
  };

  const hasApplied = (driveId: string) => {
    return applications.some((a) => a.driveId === driveId);
  };

  const getApplicationForDrive = (driveId: string) => {
    return applications.find((a) => a.driveId === driveId);
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-100 shrink-0 font-bold text-xl">
              {profile?.name ? profile.name[0] : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{profile?.name || 'Student Profile'}</h2>
                {profile?.academicRecord?.verificationStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Roll No: <span className="font-mono text-slate-700">{profile?.rollNo}</span> \u2022 Branch:{' '}
                <span className="font-semibold text-slate-700">{profile?.branch}</span> \u2022 Batch:{' '}
                <span className="font-semibold text-slate-700">{profile?.batch}</span> (Passout {profile?.passoutYear})
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile?.skills?.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Snapshot Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CGPA</span>
              <p className={`text-xl font-black mt-0.5 ${
                (profile?.academicRecord?.cgpa || 0) >= 7.5 ? 'text-emerald-600' : 'text-slate-800'
              }`}>
                {profile?.academicRecord?.cgpa?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div className="text-center px-2 border-x border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">10th / 12th</span>
              <p className="text-xs font-bold text-slate-700 mt-1">
                {profile?.academicRecord?.tenthPct || '0'}% / {profile?.academicRecord?.twelfthPct || '0'}%
              </p>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Backlogs</span>
              <p className={`text-xl font-black mt-0.5 ${
                (profile?.academicRecord?.activeBacklogs || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {profile?.academicRecord?.activeBacklogs ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Resume Upload Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Placement Resume:</span>
            <span className="text-xs text-slate-400">PDF / DOCX for NLP Skill Matching</span>
          </div>

          <div className="flex items-center gap-3">
            {resumeSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Parsed & Synced to Matching Engine!
              </span>
            )}
            <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 transition">
              <Upload className="w-3.5 h-3.5" />
              {uploadingResume ? 'Uploading...' : 'Upload Resume'}
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Available Placement Drives */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-lg">Available Placement Drives</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Authoritative Rule Engine Status</span>
        </div>

        <div className="divide-y divide-slate-100">
          {drives.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No placement drives found</p>
            </div>
          ) : (
            drives.map((drive) => {
              const elig = eligibilityMap[drive.id];
              const applied = hasApplied(drive.id);
              const appRecord = getApplicationForDrive(drive.id);

              return (
                <div key={drive.id} className="p-6 hover:bg-slate-50/50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-lg">{drive.companyName}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          \u20b9{drive.ctc} LPA
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">
                          {drive.category || 'REGULAR'}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-700">{drive.role}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>Rounds: {drive.rounds?.length || 0}</span>
                        <span>\u2022</span>
                        <span>Last Date: {drive.lastApplyDate || 'Open'}</span>
                      </div>

                      {/* Rule Failure Breakdown if Ineligible */}
                      {elig && !elig.eligible && elig.reasons && elig.reasons.length > 0 && (
                        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs">
                          <p className="font-bold mb-1 flex items-center gap-1.5 text-rose-900">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Eligibility Criteria Not Met:
                          </p>
                          <ul className="list-disc list-inside space-y-0.5 text-rose-700 pl-1 font-medium">
                            {elig.reasons.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Eligibility Badge & Apply Action */}
                    <div className="flex flex-col sm:items-end gap-3 shrink-0">
                      {applied ? (
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            appRecord?.status === 'SELECTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : appRecord?.status === 'SHORTLISTED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Status: {appRecord?.status}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1">Application Submitted</p>
                        </div>
                      ) : elig?.eligible ? (
                        <div className="space-y-2 text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Eligible to Apply
                          </span>
                          <div>
                            <button
                              onClick={() => handleApply(drive.id)}
                              disabled={applyingDriveId === drive.id}
                              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                            >
                              {applyingDriveId === drive.id ? 'Applying...' : 'Apply Now'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Not Eligible
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
