import React from 'react';
import { useBank } from '../context/BankContext';
import { X, History, ShieldCheck, FileCode, CheckCircle2 } from 'lucide-react';

export default function AuditHistoryModal() {
  const { isAuditModalOpen, setIsAuditModalOpen, auditLogs } = useBank();

  if (!isAuditModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">System Audit & Security Trail Log</h2>
              <p className="text-xs text-slate-400">Immutable record of all customer update requests and bank officer actions</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuditModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Log List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-blue-400">{log.id}</span>
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                    log.action.includes('APPROVED') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    log.action.includes('REJECTED') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                  }`}>
                    {log.action}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>

              <p className="text-slate-200 font-semibold">{log.details}</p>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                <span>Actor: <strong className="text-slate-300">{log.performedBy}</strong></span>
                <span>IP Address: <strong className="text-slate-300 font-mono">{log.ipAddress}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Total Audit Logs: {auditLogs.length}</span>
          <button
            onClick={() => setIsAuditModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Close Audit Log
          </button>
        </div>

      </div>
    </div>
  );
}
