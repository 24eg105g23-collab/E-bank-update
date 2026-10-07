import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  FileText, 
  UserCheck, 
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function EmployeeDashboard() {
  const { requests, setSelectedVerificationReq } = useBank();
  
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalProcessed = approvedCount + rejectedCount;

  // Filter logic
  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.accountNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank Officer Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            KYC Verification Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review submitted customer photo, signature, and address update requests with side-by-side verification tools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Active Officer</span>
            <span className="text-xs font-bold text-emerald-400">Rajiv Mehta (EMP-304)</span>
          </div>
        </div>
      </div>

      {/* 2. Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Pending Queue Metric */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Pending Verification</p>
            <h2 className="text-3xl font-display font-bold text-white mt-1">{pendingCount}</h2>
            <p className="text-[11px] text-slate-400 mt-1">Requires Officer Action</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Approved Metric */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Approved Today</p>
            <h2 className="text-3xl font-display font-bold text-white mt-1">{approvedCount}</h2>
            <p className="text-[11px] text-slate-400 mt-1">Database Auto-Updated</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected Metric */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider">Rejected Requests</p>
            <h2 className="text-3xl font-display font-bold text-white mt-1">{rejectedCount}</h2>
            <p className="text-[11px] text-slate-400 mt-1">Returned with Reason</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        {/* SLA Efficiency */}
        <div className="glass-card p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">SLA Verification Rate</p>
            <h2 className="text-3xl font-display font-bold text-white mt-1">98.4%</h2>
            <p className="text-[11px] text-slate-400 mt-1">Avg Resolution: 18 mins</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Request ID, Customer Name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st} {st === 'PENDING' && pendingCount > 0 ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>

      </div>

      {/* 4. Incoming Verification Requests Queue List */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <span>Incoming Customer Request Queue ({filteredRequests.length})</span>
        </h2>

        {filteredRequests.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
            <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No requests found matching your filter criteria.</h3>
            <p className="text-xs text-slate-400">Try changing the status filter or searching for another term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div 
                key={req.id} 
                className={`glass-card rounded-2xl p-6 border transition-all hover:border-slate-700 space-y-4 ${
                  req.status === 'PENDING' 
                    ? 'border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20' 
                    : req.status === 'APPROVED' 
                    ? 'border-emerald-500/20 bg-slate-900/60' 
                    : 'border-rose-500/20 bg-slate-900/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-mono font-bold text-white">{req.id}</span>
                      
                      {/* Urgency Badge */}
                      <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                        req.urgency === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {req.urgency} Urgency
                      </span>

                      {/* Status Badge */}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-200">
                      Customer: <span className="text-white font-bold">{req.customerName}</span> (Account: {req.accountNumber})
                    </p>
                    <p className="text-xs text-slate-400">
                      Submitted: {new Date(req.submittedAt).toLocaleString()} • OTP 2FA Status: Verified
                    </p>
                  </div>

                  {/* Action Inspect Button */}
                  <div>
                    <button
                      onClick={() => setSelectedVerificationReq(req)}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-lg ${
                        req.status === 'PENDING' 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{req.status === 'PENDING' ? 'Inspect & Verify' : 'View Details'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Requested Field Diffs */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Fields Requested for Update:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {req.fieldsToUpdate.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-semibold uppercase border border-blue-500/20">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {req.updates.mobile && (
                    <div>
                      <span className="text-slate-400 text-[11px] block">New Mobile:</span>
                      <span className="font-mono font-bold text-white">{req.updates.mobile}</span>
                    </div>
                  )}

                  {req.updates.email && (
                    <div>
                      <span className="text-slate-400 text-[11px] block">New Email:</span>
                      <span className="font-semibold text-white">{req.updates.email}</span>
                    </div>
                  )}

                  {req.updates.address && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 text-[11px] block">New Address:</span>
                      <span className="font-medium text-slate-200 line-clamp-1">{req.updates.address}</span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
