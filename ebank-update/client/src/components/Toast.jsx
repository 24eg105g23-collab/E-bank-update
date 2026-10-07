import React from 'react';
import { useBank } from '../context/BankContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useBank();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 text-xs font-semibold backdrop-blur-xl ${
        toast.type === 'success' 
          ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20' 
          : toast.type === 'error'
          ? 'bg-slate-900/95 border-rose-500/50 text-rose-400 shadow-rose-500/20'
          : 'bg-slate-900/95 border-blue-500/50 text-blue-400 shadow-blue-500/20'
      }`}>
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
