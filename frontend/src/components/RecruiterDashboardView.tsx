import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Clock,
  Filter,
  Search,
  Building,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { Drive } from '../types';

interface Props {
  drives: Drive[];
  onNavigateTab: (tab: any) => void;
}

export const RecruiterDashboardView: React.FC<Props> = ({ drives, onNavigateTab }) => {
  const [candidateActionMap, setCandidateActionMap] = useState<Record<string, string>>({
    'c1': 'SHORTLISTED',
    'c2': 'PENDING',
    'c3': 'INTERVIEW_SCHEDULED',
    'c4': 'PENDING',
  });

  const candidates = [
    {
      id: 'c1',
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
      name: 'Siddharth Roy',
      role: 'Cloud SWE',
      branch: 'CSE',
      cgpa: 9.10,
      matchScore: 89,
      skills: ['Python', 'Distributed Systems', 'Algorithms', 'Go'],
      status: candidateActionMap['c2'] || 'PENDING',
    },
    {
      id: 'c3',
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
      name: 'Rohan Gupta',
      role: 'Data Engineer Intern',
      branch: 'IT',
      cgpa: 8.30,
      matchScore: 82,
      skills: ['SQL', 'Spark', 'Kafka', 'Python'],
      status: candidateActionMap['c4'] || 'PENDING',
    },
  ];

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setCandidateActionMap(prev => ({ ...prev, [id]: newStatus }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                Corporate Recruiter Portal
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Google India / Infosys Partner Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Campus Talent Acquisition & Pipeline
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Post job profiles, access pre-filtered eligible applicant pools verified by SCPES rule criteria, and review AI-ranked candidates based on resume match scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('recruiter-post-job')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Campus Job</span>
            </button>
            <button
              onClick={() => onNavigateTab('recruiter-ranked')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>AI Ranked Pool</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Openings</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">2</span>
            <span className="text-xs font-bold text-indigo-600">Active Campus Drives</span>
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

      {/* Active Drives Posted by this Recruiter */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Your Active Campus Placement Drives
            </h2>
            <p className="text-xs text-slate-500">Live recruitment opportunities open for Batch 2027 applications</p>
          </div>
          <button
            onClick={() => onNavigateTab('recruiter-post-job')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>+ Create Drive</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/90 space-y-3">
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
              <span className="text-[11px] text-slate-500 font-medium">Cutoff: CGPA &ge; 7.0 &bull; 0 Backlogs</span>
              <button
                onClick={() => onNavigateTab('recruiter-ranked')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
              >
                <span>View Applicants</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/90 space-y-3">
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
              <span className="text-[11px] text-slate-500 font-medium">Cutoff: CGPA &ge; 6.5 &bull; Max 1 Backlog</span>
              <button
                onClick={() => onNavigateTab('recruiter-ranked')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
              >
                <span>View Applicants</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top AI Matched Candidates Preview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              Top AI-Ranked Candidate Matches
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated by matching-service via Kafka with resume cosine similarity against job descriptions
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('recruiter-ranked')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>See full candidate matrix (Screen 10)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Candidate & Dept</th>
                <th className="pb-3">CGPA</th>
                <th className="pb-3">Resume AI Match</th>
                <th className="pb-3">Extracted Core Skills</th>
                <th className="pb-3">Application Status</th>
                <th className="pb-3 text-right">Recruiter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5">
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.branch} &bull; Batch 2027</p>
                  </td>
                  <td className="py-3.5 font-extrabold text-slate-800 font-mono text-xs">{c.cgpa}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-indigo-600 font-mono text-sm">{c.matchScore}%</span>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${c.matchScore}%` }} />
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
                        className="py-1 px-2 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-[11px] font-bold transition border border-violet-200"
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
    </div>
  );
};
