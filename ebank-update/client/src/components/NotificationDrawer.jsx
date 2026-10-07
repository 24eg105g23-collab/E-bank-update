import React from 'react';
import { useBank } from '../context/BankContext';
import { X, Bell, CheckCircle2, AlertCircle, Info, CheckCheck } from 'lucide-react';

export default function NotificationDrawer() {
  const { 
    isNotifDrawerOpen, 
    setIsNotifDrawerOpen, 
    notifications, 
    markNotifRead, 
    markAllNotifsRead 
  } = useBank();

  if (!isNotifDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-white">Notifications Center</h2>
                <p className="text-xs text-slate-400">KYC Status Alerts & Updates</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={markAllNotifsRead}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                title="Mark all read"
              >
                <CheckCheck className="w-4 h-4 text-emerald-400" />
              </button>
              <button 
                onClick={() => setIsNotifDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs font-semibold">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => markNotifRead(n.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    !n.read 
                      ? 'bg-slate-950 border-blue-500/40 shadow-lg shadow-blue-500/5' 
                      : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {n.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      {n.type === 'ERROR' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                      {n.type === 'INFO' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                      <span className="text-xs font-bold text-white">{n.title}</span>
                    </div>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-500 text-right">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
