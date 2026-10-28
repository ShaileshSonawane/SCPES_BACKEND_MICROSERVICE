import React, { useState } from 'react';
import {
  UserCheck,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { StudentProfile } from '../types';

interface Props {
  profile: StudentProfile | null;
  activePersona: string;
}

export const StudentProfileView: React.FC<Props> = ({ profile, activePersona }) => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isStudent2 = activePersona === 'student2';

  const name = isStudent2 ? 'Neha Patel' : (profile?.name || 'Aarav Patil');
  const rollNo = isStudent2 ? 'IT2023-019' : (profile?.rollNo || 'CS2023-042');
  const branch = isStudent2 ? 'IT' : (profile?.branch || 'CSE');
  const cgpa = isStudent2 ? 6.5 : (profile?.academicRecord?.cgpa || 8.5);
  const activeBacklogs = isStudent2 ? 1 : (profile?.academicRecord?.activeBacklogs || 0);

  const sgpaList = isStudent2
    ? [
        { sem: 'Sem 1', sgpa: 6.8 },
        { sem: 'Sem 2', sgpa: 6.4 },
        { sem: 'Sem 3', sgpa: 6.2 },
        { sem: 'Sem 4', sgpa: 6.7 },
        { sem: 'Sem 5', sgpa: 6.5 },
        { sem: 'Sem 6', sgpa: 6.6 },
      ]
    : [
        { sem: 'Sem 1', sgpa: 7.0 },
        { sem: 'Sem 2', sgpa: 7.3 },
        { sem: 'Sem 3', sgpa: 7.1 },
        { sem: 'Sem 4', sgpa: 7.8 },
        { sem: 'Sem 5', sgpa: 7.5 },
        { sem: 'Sem 6', sgpa: 7.6 },
      ];

  const extractedSkills = isStudent2
    ? ['Java', 'SQL', 'C++', 'HTML', 'CSS', 'JavaScript']
    : ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'REST', 'Git', 'Docker', 'React', 'Python', 'OOP', 'Kafka'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Personal information</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Student ID #{rollNo}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Full name</label>
              <p className="font-bold text-slate-900">{name}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Roll number</label>
              <p className="font-mono font-bold text-slate-900">{rollNo}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Branch</label>
              <p className="font-bold text-indigo-700">{branch}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Passout year</label>
              <p className="font-bold text-slate-900">2027</p>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Phone</label>
              <p className="font-medium text-slate-700">+91 98765 43210</p>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Email</label>
              <p className="font-medium text-slate-700">{isStudent2 ? 'student2@scpes.edu' : 'aarav.patil@college.edu'}</p>
            </div>
          </div>
        </div>

        {/* Academic Record */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Academic record</h3>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED BY FACULTY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">10th %</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">88.4%</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">12th / Dip %</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">82.0%</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700 block uppercase">CGPA</span>
              <p className="text-xl font-black text-indigo-950 mt-0.5">{cgpa}</p>
            </div>
            <div className={`p-3 rounded-2xl border ${activeBacklogs > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200/70'}`}>
              <span className={`text-[11px] font-bold block uppercase ${activeBacklogs > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
                Active backlogs
              </span>
              <p className={`text-xl font-black mt-0.5 ${activeBacklogs > 0 ? 'text-rose-900' : 'text-slate-900'}`}>
                {activeBacklogs}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Backlog history</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">2</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Gap (years)</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semester-wise SGPA Progress Chart */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-1">Semester-wise SGPA</h3>
        <p className="text-xs text-slate-400 mb-6">Academic consistency monitored for criteria evaluations</p>

        <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-40 pt-4 px-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
          {sgpaList.map((item, idx) => {
            const heightPct = (item.sgpa / 10) * 100;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <span className="text-xs font-bold text-indigo-700 mb-1 opacity-90 group-hover:scale-110 transition">
                  {item.sgpa.toFixed(1)}
                </span>
                <div
                  className="w-full max-w-[48px] bg-indigo-600 group-hover:bg-indigo-700 rounded-t-xl transition-all duration-300"
                  style={{ height: `${heightPct}%` }}
                ></div>
                <span className="text-[11px] font-semibold text-slate-600 mt-2 block">{item.sem}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resume & Skills Parser Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Resume & skills</h3>
            <p className="text-xs text-slate-400">Parsed via Apache Tika and vectorized for cosine similarity matching</p>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs transition">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Parsing...' : 'Replace Resume'}</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {uploadSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Resume parsed successfully! Skills extracted and job matches recalculated.</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{name.replace(' ', '_')}_Resume.pdf</p>
              <p className="text-xs text-slate-400">Uploaded 2 days ago • 214 KB • Parsed successfully</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Skills extracted from your resume
          </span>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Resume changes automatically re-match you with open jobs across campus.</span>
          <button className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition">
            Submit for verification
          </button>
        </div>
      </div>
    </div>
  );
};
