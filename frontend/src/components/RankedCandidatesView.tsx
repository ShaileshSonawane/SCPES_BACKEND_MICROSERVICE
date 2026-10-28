import React, { useState } from 'react';
import { Sparkles, CheckCircle2, FileDown, Check, ArrowRight } from 'lucide-react';

export const RankedCandidatesView: React.FC = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Neha Joshi', branch: 'CSE', cgpa: 8.6, score: 96, matched: ['Java', 'SQL', 'OOP', 'Spring'], missing: [], shortlisted: false },
    { id: 2, name: 'Vikram Singh', branch: 'ECE', cgpa: 8.1, score: 91, matched: ['Java', 'SQL', 'OOP'], missing: ['Kafka'], shortlisted: false },
    { id: 3, name: 'Aarav Patil', branch: 'CSE', cgpa: 7.4, score: 88, matched: ['Java', 'SQL', 'OOP'], missing: ['AWS'], shortlisted: true },
    { id: 4, name: 'Tanvi More', branch: 'IT', cgpa: 7.5, score: 84, matched: ['Java', 'SQL'], missing: ['Docker', 'Kafka'], shortlisted: false },
    { id: 5, name: 'Sneha Rao', branch: 'ECE', cgpa: 7.9, score: 79, matched: ['Java', 'SQL'], missing: ['Docker'], shortlisted: false },
    { id: 6, name: 'Kunal Mehta', branch: 'IT', cgpa: 7.0, score: 73, matched: ['Java', 'SQL'], missing: ['Spring'], shortlisted: false },
    { id: 7, name: 'Mihir Gokhale', branch: 'CSE', cgpa: 7.3, score: 68, matched: ['Java', 'SQL'], missing: ['Docker', 'AWS'], shortlisted: false },
    { id: 8, name: 'Riya Sharma', branch: 'IT', cgpa: 7.8, score: 64, matched: ['Java', 'SQL'], missing: ['Spring'], shortlisted: false },
  ]);

  const toggleShortlist = (id: number) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, shortlisted: !c.shortlisted } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-900">Ranked Candidates — Systems Engineer</h2>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              148 MATCHED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sorted by Cosine Similarity & TF-IDF match score • Threshold 60%
          </p>
        </div>

        <button
          onClick={() => alert('Exporting candidate rank matrix as Excel/CSV...')}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-500" />
          <span>Export list</span>
        </button>
      </div>

      {/* Candidates List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">#</th>
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">CGPA</th>
                <th className="px-6 py-3.5">Match Score</th>
                <th className="px-6 py-3.5">Matched Skills</th>
                <th className="px-6 py-3.5">Missing Key</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{c.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <span className="text-[11px] font-semibold text-indigo-600">{c.branch}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{c.cgpa.toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                        c.score >= 85
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : c.score >= 75
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {c.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.matched.map((m) => (
                        <span
                          key={m}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.missing.length === 0 ? (
                      <span className="text-slate-300 text-xs">-</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {c.missing.map((m) => (
                          <span
                            key={m}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleShortlist(c.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 ml-auto ${
                        c.shortlisted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {c.shortlisted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Shortlisted</span>
                        </>
                      ) : (
                        <span>Shortlist</span>
                      )}
                    </button>
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
