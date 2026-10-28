import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sliders,
  Users,
  Briefcase,
  BarChart3,
  LogOut,
  Bell,
  Building2,
  Cpu,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { User, Drive, NotificationSummary } from '../../types';
import { TpoDashboardView } from '../TpoDashboardView';
import { RuleBuilderView } from '../RuleBuilderView';
import { EligibilityResultsView } from '../EligibilityResultsView';
import { TpoDashboard } from '../TpoDashboard';
import { ReportsAnalyticsView } from '../ReportsAnalyticsView';
import { NotificationDrawer } from '../NotificationDrawer';
import { AccessDeniedView } from '../AccessDeniedView';

export type TpoTab = 'overview' | 'rule-builder' | 'eligibility-results' | 'funnel' | 'reports';

interface Props {
  currentUser: User | null;
  drives: Drive[];
  notifications: NotificationSummary | null;
  onLogout: () => void;
  onRefreshDrives: () => Promise<void>;
}

export const TpoPortal: React.FC<Props> = ({
  currentUser,
  drives,
  notifications,
  onLogout,
  onRefreshDrives,
}) => {
  // Strict role security guard: only TPO and ADMIN can view TPO portal
  if (currentUser && currentUser.role !== 'TPO' && currentUser.role !== 'ADMIN') {
    return <AccessDeniedView currentUser={currentUser} requiredRole="Training & Placement Officer (TPO)" onLogout={onLogout} />;
  }

  const [activeTab, setActiveTab] = useState<TpoTab>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications?.unreadCount || 3;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'TPO Placement Dashboard & Drives', screen: 'Screen 6' };
      case 'rule-builder':
        return { title: 'Dynamic Eligibility Rule Builder', screen: 'Screen 7' };
      case 'eligibility-results':
        return { title: 'Batch Eligibility Evaluation Matrix', screen: 'Screen 8' };
      case 'funnel':
        return { title: 'Placement Operations & Selection Funnel', screen: 'Screen 6' };
      case 'reports':
        return { title: 'Institutional Placement Reports & Dossier', screen: 'Screen 11' };
    }
  };

  const meta = getTabTitle();

  const handleNavigate = (tabName: string) => {
    if (tabName === 'rule-builder') setActiveTab('rule-builder');
    else if (tabName === 'eligibility-results') setActiveTab('eligibility-results');
    else if (tabName === 'tpo-applicants' || tabName === 'funnel') setActiveTab('funnel');
    else if (tabName === 'reports-analytics' || tabName === 'reports') setActiveTab('reports');
    else setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* TPO DEDICATED SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shrink-0 select-none z-30">
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/25">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">SCPES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                TPO CELL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5 font-mono">{currentUser?.scpeId || 'SCPE-TPO-001'}</p>
          </div>
        </div>

        {/* TPO Profile Mini Card */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              MK
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Dr. Meera Kulkarni</p>
              <p className="text-[10px] text-indigo-300 font-mono truncate">{currentUser?.scpeId || 'SCPE-TPO-001'}</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Engine: <strong className="text-violet-300 font-mono">Virtual Threads</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
              Java 21 Loom
            </span>
          </div>
        </div>

        {/* Navigation Tabs - Exclusively TPO Tabs */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Placement Operations</span>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Placement Overview</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S6</span>
          </button>

          <button
            onClick={() => setActiveTab('rule-builder')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'rule-builder'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Eligibility Rule Builder</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S7</span>
          </button>

          <button
            onClick={() => setActiveTab('eligibility-results')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'eligibility-results'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Eligible Students</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S8</span>
          </button>

          <button
            onClick={() => setActiveTab('funnel')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'funnel'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Applicants Funnel</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Placement Reports</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">S11</span>
          </button>
        </div>

        {/* TPO Actions & Sign Out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({currentUser?.scpeId || 'SCPE-TPO-001'})</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TPO TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">{meta.title}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {meta.screen}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SCPE_ID: {currentUser?.scpeId || 'SCPE-TPO-001'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              SCPES Central Placement Office • Virtual Threads Rule Engine Active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-[11px] font-semibold">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Virtual Threads :8085</span>
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Placement Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                MK
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">Dr. Meera Kulkarni</p>
                <p className="text-[10px] font-mono text-indigo-600 mt-0.5">{currentUser?.scpeId || 'SCPE-TPO-001'}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition border border-rose-200"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* VIEW BODY */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <TpoDashboardView
              drives={drives}
              onNavigateTab={handleNavigate}
            />
          )}

          {activeTab === 'rule-builder' && (
            <RuleBuilderView
              drives={drives}
              onNavigateTab={handleNavigate}
            />
          )}

          {activeTab === 'eligibility-results' && (
            <EligibilityResultsView
              drives={drives}
            />
          )}

          {activeTab === 'funnel' && (
            <TpoDashboard
              drives={drives}
              onRefreshDrives={onRefreshDrives}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAnalyticsView
              drives={drives}
            />
          )}
        </main>

        <footer className="mt-auto py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between">
          <span>SCPES TPO Placement Cell &copy; 2026 • Enterprise Placement Automation</span>
          <span className="font-mono text-[11px] text-slate-400">
            Eligibility Service :8085 • Placement Service :8084
          </span>
        </footer>
      </div>

      {showNotifications && (
        <NotificationDrawer
          data={notifications}
          onClose={() => setShowNotifications(false)}
          onRefresh={onRefreshDrives}
        />
      )}
    </div>
  );
};
