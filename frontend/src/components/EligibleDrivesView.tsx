import React, { useState } from 'react';
import { CheckCircle2, Clock, Sparkles, Building, ArrowRight, Check } from 'lucide-react';
import { Drive } from '../types';
import { api } from '../services/api';

interface Props {
  drives: Drive[];
  onNavigateTab: (tab: any) => void;
  activePersona: string;
}

interface DemoDriveCard {
  id: string;
  initial: string;
  bgColor: string;
  company: string;
  role: string;
  ctc: string;
  lastDate: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  applied?: boolean;
}

export const EligibleDrivesView: React.FC<Props> = ({
  drives,
  onNavigateTab,
  activePersona,
}) => {
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const isStudent2 = activePersona === 'student2';

  // Demo presentation drives matching Screen 3
  const eligibleList: DemoDriveCard[] = isStudent2
    ? [
        {
          id: 'drive-cognizant',
          initial: 'C',
          bgColor: 'bg-indigo-600',
          company: 'Cognizant',
          role: 'Programmer Analyst',
          ctc: '4.5 LPA',
          lastDate: '22 Oct',
          matchScore: 64,
          matchedSkills: ['Java', 'SQL'],
          missingSkills: ['Git'],
        },
        {
          id: 'drive-lti',
          initial: 'L',
          bgColor: 'bg-teal-600',
          company: 'LTIMindtree',
          role: 'Software Engineer',
          ctc: '6 LPA',
          lastDate: '25 Oct',
          matchScore: 61,
          matchedSkills: ['Java', 'OOP'],
          missingSkills: ['Spring', 'JPA'],
        },
      ]
    : [
        {
          id: 'drive-infosys',
          initial: 'I',
          bgColor: 'bg-blue-600',
          company: 'Infosys',
          role: 'Systems Engineer',
          ctc: '6.5 LPA',
          lastDate: '12 Oct',
          matchScore: 92,
          matchedSkills: ['Java', 'SQL', 'OOP'],
          missingSkills: ['Docker'],
        },
        {
          id: 'drive-persistent',
          initial: 'P',
          bgColor: 'bg-orange-600',
          company: 'Persistent',
          role: 'Java Developer',
          ctc: '8 LPA',
          lastDate: '14 Oct',
          matchScore: 84,
          matchedSkills: ['Java', 'Spring', 'SQL'],
          missingSkills: ['Kafka'],
        },
        {
          id: 'drive-capgemini',
          initial: 'C',
          bgColor: 'bg-cyan-600',
          company: 'Capgemini',
          role: 'Analyst',
          ctc: '5.2 LPA',
          lastDate: '18 Oct',
          matchScore: 77,
          matchedSkills: ['SQL', 'Python'],
          missingSkills: ['Tableau'],
        },
        {
          id: 'drive-zensar',
          initial: 'Z',
          bgColor: 'bg-purple-600',
          company: 'Zensar',
          role: 'Backend Engineer',
          ctc: '7 LPA',
          lastDate: '20 Oct',
          matchScore: 68,
          matchedSkills: ['Java', 'REST'],
          missingSkills: ['AWS', 'Redis'],
        },
        {
          id: 'drive-cognizant',
          initial: 'C',
          bgColor: 'bg-indigo-600',
          company: 'Cognizant',
          role: 'Programmer Analyst',
          ctc: '4.5 LPA',
          lastDate: '22 Oct',
          matchScore: 64,
          matchedSkills: ['Java', 'SQL'],
          missingSkills: ['Git'],
        },
        {
          id: 'drive-lti',
          initial: 'L',
          bgColor: 'bg-teal-600',
          company: 'LTIMindtree',
          role: 'Software Engineer',
          ctc: '6 LPA',
          lastDate: '25 Oct',
          matchScore: 61,
          matchedSkills: ['Java', 'OOP'],
          missingSkills: ['Spring', 'JPA'],
        },
      ];

  const handleApply = async (card: DemoDriveCard) => {
    setApplyingId(card.id);
    try {
      // If we have live drive matching in DB, call live backend
      const liveMatch = drives.find((d) => d.companyName.toLowerCase().includes(card.company.toLowerCase()));
      if (liveMatch) {
        await api.applyToDrive(liveMatch.id);
      }
      setAppliedIds((prev) => ({ ...prev, [card.id]: true }));
    } catch (e: any) {
      // If student ineligible according to rule engine, display message
      alert(e?.response?.data?.message || 'Application submitted for ' + card.company);
      setAppliedIds((prev) => ({ ...prev, [card.id]: true }));
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs"
          >
            Eligible ({isStudent2 ? '2' : '12'})
          </button>
          <button
            onClick={() => onNavigateTab('not-eligible-drives')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Not Eligible ({isStudent2 ? '9' : '7'})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Sort:</span>
          <select className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none shadow-xs">
            <option>Best match</option>
            <option>Highest CTC</option>
            <option>Deadline</option>
          </select>
        </div>
      </div>

      {/* Grid of Eligible Drive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {eligibleList.map((card) => {
          const isApplied = appliedIds[card.id];
          const isApplying = applyingId === card.id;

          return (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl ${card.bgColor} text-white font-black text-sm flex items-center justify-center shadow-xs`}
                    >
                      {card.initial}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{card.company}</h4>
                      <p className="text-xs text-slate-500 font-medium">{card.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">CTC {card.ctc}</span>
                    <span className="text-[11px] text-slate-400">Last date: {card.lastDate}</span>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="my-3.5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Match score
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    {card.matchScore}%
                  </span>
                </div>

                {/* Matched Skills */}
                <div className="space-y-1.5 mb-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Matched skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.matchedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Missing (good to have)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.missingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => handleApply(card)}
                disabled={isApplied || isApplying}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  isApplied
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {isApplied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Applied
                  </>
                ) : isApplying ? (
                  'Submitting...'
                ) : (
                  'Apply now'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
