import React from 'react';
import { useBank } from '../context/BankContext';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Bell, 
  History, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export default function HeaderNavbar() {
  const { 
    activeRole, 
    setActiveRole, 
    unreadNotifCount, 
    setIsNotifDrawerOpen, 
    setIsAuditModalOpen,
    serverOnline,
    resetDemoData,
    profile
  } = useBank();

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Brand Title */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-white">E-BANK</span>
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-display font-bold text-xl">UPDATE</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.6 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Digital KYC & Records Management</span>
              <span className="text-slate-600">•</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${serverOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                {serverOnline ? 'REST API Connected' : 'Demo Offline'}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Customer vs Bank Employee) */}
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center space-x-1 shadow-inner">
          <button
            onClick={() => setActiveRole('customer')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
              activeRole === 'customer'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer Portal</span>
          </button>

          <button
            onClick={() => setActiveRole('employee')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
              activeRole === 'employee'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Bank Employee Portal</span>
          </button>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Audit History Trigger */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-2 text-xs font-medium"
            title="System Audit Trail & Log"
          >
            <History className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Audit Log</span>
          </button>

          {/* Notifications Drawer Toggle */}
          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-bounce">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all"
            title="Reset Data to Default State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Profile Avatar Pill */}
          <div className="hidden lg:flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-blue-500/30 p-0.5 overflow-hidden">
              <img 
                src={profile?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {activeRole === 'customer' ? (profile?.name || 'Aarav Sharma') : 'Officer Rajiv Mehta'}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {activeRole === 'customer' ? `Acc: ${profile?.accountNumber || '4092-XXXX'}` : 'Emp ID: EMP-304'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
