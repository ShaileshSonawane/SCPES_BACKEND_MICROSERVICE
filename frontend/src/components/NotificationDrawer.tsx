import React from 'react';
import { NotificationSummary } from '../types';
import { api } from '../services/api';
import { X, Bell, CheckCircle, Info, Briefcase } from 'lucide-react';

interface Props {
  data: NotificationSummary | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-base">Notifications</h3>
          {data && data.unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
              {data.unreadCount} new
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!data || data.notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          data.notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
              className={`p-3.5 rounded-xl border text-sm transition cursor-pointer ${
                n.isRead
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-indigo-50/70 border-indigo-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {n.type === 'NEW_DRIVE' ? (
                  <Briefcase className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                ) : n.type === 'APPLICATION' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="leading-snug">{n.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
