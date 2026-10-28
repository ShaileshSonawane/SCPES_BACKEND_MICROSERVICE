import React, { useState } from 'react';
import { Drive } from '../types';
import { api } from '../services/api';
import { X, Check, Sliders, AlertCircle } from 'lucide-react';

interface Props {
  drive: Drive;
  onClose: () => void;
  onSaved: () => void;
}

export const RulesModal: React.FC<Props> = ({ drive, onClose, onSaved }) => {
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [minTenth, setMinTenth] = useState('75.0');
  const [minTwelfth, setMinTwelfth] = useState('75.0');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [branches, setBranches] = useState('CSE,IT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const rulePayload = {
        driveId: drive.id,
        minCgpa: parseFloat(minCgpa),
        min10th: parseFloat(minTenth),
        min12th: parseFloat(minTwelfth),
        maxActiveBacklogs: parseInt(maxBacklogs, 10),
        maxBacklogHistory: 2,
        allowedBranches: branches.split(',').map((b) => b.trim().toUpperCase()).filter(Boolean),
        passoutYear: 2027,
        policy: 'ONE_OFFER',
      };

      await api.setRules(drive.id, rulePayload);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save eligibility rules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg">Define Eligibility Criteria</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Drive Details</p>
            <p className="text-slate-800 font-bold text-base">{drive.companyName} — {drive.role}</p>
            <p className="text-slate-500 text-xs mt-0.5">Rules will be evaluated against verified student academic profiles.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Max Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  value={maxBacklogs}
                  onChange={(e) => setMaxBacklogs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Min 10th %</label>
                <input
                  type="number"
                  step="0.5"
                  value={minTenth}
                  onChange={(e) => setMinTenth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Min 12th %</label>
                <input
                  type="number"
                  step="0.5"
                  value={minTwelfth}
                  onChange={(e) => setMinTwelfth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Allowed Branches (comma separated)</label>
              <input
                type="text"
                value={branches}
                onChange={(e) => setBranches(e.target.value)}
                placeholder="CSE,IT,ECE"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Students outside these branches are rejected by BranchRule.</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm flex items-center gap-2 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Rules
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
