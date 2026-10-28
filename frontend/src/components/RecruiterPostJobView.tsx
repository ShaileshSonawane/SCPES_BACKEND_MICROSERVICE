import React, { useState } from 'react';
import { PlusCircle, Sparkles, CheckCircle2, ArrowRight, Layers, FileText } from 'lucide-react';

interface Props {
  onNavigateTab: (tab: any) => void;
}

export const RecruiterPostJobView: React.FC<Props> = ({ onNavigateTab }) => {
  const [title, setTitle] = useState('Systems Engineer');
  const [ctc, setCtc] = useState('6.5');
  const [description, setDescription] = useState(
    'Build and maintain Java microservices, work with SQL databases, write REST APIs and collaborate with cross-functional teams.'
  );
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [passoutYear, setPassoutYear] = useState('2027');
  const [mustHaveSkills, setMustHaveSkills] = useState(['Java', 'SQL', 'OOP']);
  const [keySkills, setKeySkills] = useState(['Spring Boot', 'Docker', 'Kafka', 'AWS']);
  const [threshold, setThreshold] = useState('60%');
  const [published, setPublished] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setPublished(true);
  };

  return (
    <div className="space-y-6">
      {published && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Job published! Kafka event emitted. 148 matched candidates identified.</span>
          </div>
          <button
            onClick={() => onNavigateTab('recruiter-ranked')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
          >
            View Ranked Candidates (Screen 10)
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: 2 Cols */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">New job posting</h3>
              <p className="text-xs text-slate-400">Configure job details and criteria for automated candidate matching</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Infosys Campus Drive
            </span>
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CTC (LPA)</label>
                <input
                  type="text"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Min CGPA</label>
                <input
                  type="text"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max backlogs</label>
                <input
                  type="text"
                  value={maxBacklogs}
                  onChange={(e) => setMaxBacklogs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Passout year</label>
                <input
                  type="text"
                  value={passoutYear}
                  onChange={(e) => setPassoutYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                />
              </div>
            </div>

            {/* Must-Have Skills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Must-have skills (mandatory)
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {mustHaveSkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {s}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const sk = prompt('Enter skill:');
                    if (sk) setMustHaveSkills([...mustHaveSkills, sk]);
                  }}
                  className="text-xs font-semibold text-indigo-600 px-2 py-1 rounded-lg border border-dashed border-indigo-300 hover:bg-indigo-50"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Key Skills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Key skills (good to have)
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {keySkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const sk = prompt('Enter skill:');
                    if (sk) setKeySkills([...keySkills, sk]);
                  }}
                  className="text-xs font-semibold text-slate-600 px-2 py-1 rounded-lg border border-dashed border-slate-300 hover:bg-slate-50"
                >
                  + Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Minimum match score to forward job
              </label>
              <select
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-48 px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold bg-white outline-none"
              >
                <option value="60%">60%</option>
                <option value="70%">70%</option>
                <option value="80%">80%</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
              >
                Save draft
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-xs"
              >
                Publish job
              </button>
            </div>
          </form>
        </div>

        {/* Right Infographic: What happens on publish */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">What happens on publish</h3>
            <p className="text-xs text-slate-400 mb-5">Automated 3-stage matching pipeline</p>

            <div className="space-y-4 text-xs">
              {/* Stage 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Eligibility filter</span>
                </div>
                <p className="text-slate-500 text-[11px]">CGPA, backlogs, branch, 10th/12th, year</p>
                <p className="text-indigo-600 font-bold text-xs mt-1.5">312 of 480 pass</p>
              </div>

              {/* Stage 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Resume match</span>
                </div>
                <p className="text-slate-500 text-[11px]">Must-have gate + key skills + TF-IDF</p>
                <p className="text-emerald-600 font-bold text-xs mt-1.5">148 score ≥ 60%</p>
              </div>

              {/* Stage 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Job forwarded</span>
                </div>
                <p className="text-slate-500 text-[11px]">In-app + email to matched students</p>
                <p className="text-violet-600 font-bold text-xs mt-1.5">148 notified</p>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-950 font-medium">
              <span className="font-bold block mb-1">Algorithm Formula:</span>
              Score = 50% must-have + 30% key skills + 20% resume-to-JD text similarity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
