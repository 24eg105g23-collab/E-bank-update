import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, User, ShieldAlert, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function PortalLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">E-Bank</span>
              <span className="text-blue-400 font-semibold text-lg ml-1">Update</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-400">Digital Banking &amp; KYC</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● System Online
            </span>
          </div>
        </div>
      </header>

      {/* Center Hero Selection */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4" />
          Enterprise KYC &amp; Profile Modification Gateway
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">E-Bank Update</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl">
          Select your dedicated access portal below to proceed with digital customer information management.
        </p>

        {/* Two Separate Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-10 text-left">
          
          {/* 1. CUSTOMER PORTAL */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-8 backdrop-blur-xl transition-all duration-200 flex flex-col justify-between group shadow-xl">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Self-Service Portal
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Customer Portal</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                For bank account holders. Submit updates for your photograph, specimen signature, mobile number, email, address, and KYC documents.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Submit online signature &amp; photo updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Real-time status tracking &amp; remarks</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                to="/customer/login"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Enter Customer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-400">
                New user?{' '}
                <Link to="/customer/register" className="text-blue-400 underline font-medium">
                  Register new account
                </Link>
              </div>
            </div>
          </div>

          {/* 2. EMPLOYEE / ADMIN PORTAL */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 backdrop-blur-xl transition-all duration-200 flex flex-col justify-between group shadow-xl">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Officer Console
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Bank Employee Portal</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                For authorized bank staff and KYC officers. Review pending requests, inspect uploaded proof documents side-by-side, and authorize approvals.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Verification queue &amp; pending review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Approve/Reject &amp; auto-sync master ledger</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                to="/admin/login"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>Enter Employee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-400">
                Default: <span className="text-indigo-400 font-mono">admin01</span> / <span className="text-indigo-400 font-mono">Admin@123</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4">
          E-Bank Update Digital Systems • Full-Stack Spring Boot 3 + React + MySQL
        </div>
      </footer>
    </div>
  );
}
