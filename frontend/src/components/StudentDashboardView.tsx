import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building,
  AlertTriangle
} from 'lucide-react';
import { Drive, StudentProfile } from '../types';

interface Props {
  profile: StudentProfile | null;
  drives: Drive[];
  onNavigateTab: (tab: any) => void;
  activePersona: string;
}

export const StudentDashboardView: React.FC<Props> = ({
  profile,
  drives,
  onNavigateTab,
  activePersona,
}) => {
  const isStudent2 = activePersona === 'student2';

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Eligible Drives</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{isStudent2 ? '2' : '12'}</span>
            <span className="text-xs font-bold text-emerald-600">+3 new this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Matched against academic criteria</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Applied</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{isStudent2 ? '0' : '5'}</span>
            <span className="text-xs font-bold text-indigo-600">{isStudent2 ? '0 in progress' : '2 in progress'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Applications submitted</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Shortlisted</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{isStudent2 ? '0' : '2'}</span>
            <span className="text-xs font-bold text-emerald-600">Next: Technical round</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Moved past initial screening</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Unread Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">3</span>
            <span className="text-xs font-bold text-amber-600">1 deadline today</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Placement cell announcements</p>
        </div>
      </div>

      {/* Main Grid: Matched Jobs on Left, Profile Status on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jobs Matched For You */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Jobs matched for you
                </h3>
                <p className="text-xs text-slate-400">Scored via Apache Tika resume parser and skill match engine</p>
              </div>
              <button
                onClick={() => onNavigateTab('eligible-drives')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Infosys Card */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                      I
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Infosys</h4>
                      <p className="text-xs text-slate-500">Systems Engineer • 6.5 LPA</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Match 92%
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-400">Skills: Java, SQL, OOP</span>
                  <button
                    onClick={() => onNavigateTab('eligible-drives')}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Persistent Card */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                      P
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Persistent Systems</h4>
                      <p className="text-xs text-slate-500">Java Developer • 8 LPA</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Match 84%
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-400">Skills: Java, Spring, SQL</span>
                  <button
                    onClick={() => onNavigateTab('eligible-drives')}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Capgemini Card */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                      C
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Capgemini</h4>
                      <p className="text-xs text-slate-500">Analyst • 5.2 LPA</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Match 77%
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-400">Skills: SQL, Python</span>
                  <button
                    onClick={() => onNavigateTab('eligible-drives')}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Zensar Card */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                      Z
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Zensar</h4>
                      <p className="text-xs text-slate-500">Backend Engineer • 7 LPA</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    Match 68%
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-400">Skills: Java, REST</span>
                  <button
                    onClick={() => onNavigateTab('eligible-drives')}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Tracker Steppers */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">Application tracker</h3>
            <p className="text-xs text-slate-400 mb-6">Real-time status transitions published to Kafka event stream</p>

            <div className="space-y-6">
              {/* Tracker Item 1 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-900 text-sm">Infosys — Systems Engineer</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    Shortlisted
                  </span>
                </div>

                {/* 5-Step Stepper */}
                <div className="grid grid-cols-5 gap-2 relative">
                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-1 block">Applied</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-1 block">Aptitude</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs ring-4 ring-indigo-100">
                      3
                    </div>
                    <span className="text-[11px] font-bold text-indigo-700 mt-1 block">Technical</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold">
                      4
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">HR</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold">
                      5
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Result</span>
                  </div>
                </div>
              </div>

              {/* Tracker Item 2 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-900 text-sm">Persistent — Java Developer</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Aptitude Pending
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-1 block">Applied</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-indigo-100">
                      2
                    </div>
                    <span className="text-[11px] font-bold text-indigo-700 mt-1 block">Aptitude</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold">
                      3
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Technical</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold">
                      4
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">HR</span>
                  </div>

                  <div className="text-center">
                    <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold">
                      5
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Result</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Profile status</h3>
              <p className="text-xs text-slate-400">Faculty verified academic standing</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Profile completeness</span>
                <span className="text-indigo-600">85%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                  Academic Data Verified
                </p>
                <p className="text-[11px] text-emerald-800">Approved by Department Head</p>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Upcoming deadlines
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="font-medium text-slate-800">Infosys — SE</span>
                  <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Today</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="font-medium text-slate-800">Persistent — Java</span>
                  <span className="font-medium text-slate-500">12 Oct</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="font-medium text-slate-800">Capgemini — Analyst</span>
                  <span className="font-medium text-slate-500">18 Oct</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Resume updated 2 days ago • Automatic re-matching active
            </p>

            <button
              onClick={() => onNavigateTab('student-profile')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>View Full Academic Record (Screen 5)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
