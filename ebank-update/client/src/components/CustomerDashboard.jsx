import React from 'react';
import { useBank } from '../context/BankContext';
import { 
  ShieldCheck, 
  Clock, 
  FileText, 
  PlusCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Camera, 
  PenTool, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  ChevronRight,
  FileCheck,
  UserCheck
} from 'lucide-react';

export default function CustomerDashboard() {
  const { profile, requests, setIsRequestModalOpen, setIsAuditModalOpen } = useBank();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Active / Pending Requests
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const pastRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Hero & KYC Health Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* User Welcome */}
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Banking Portal • Verified Profile</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">{profile.name}</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Manage and update your banking contact details, photograph, signature, and address documents seamlessly online without needing to visit the bank branch.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                Account No: <span className="text-slate-200 font-mono font-bold">{profile.accountNumber}</span>
              </div>
              <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                Branch: <span className="text-slate-200 font-medium">{profile.branch}</span>
              </div>
            </div>
          </div>

          {/* KYC Score Meter & Action */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/50 flex flex-col items-center text-center space-y-4 shadow-xl">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Circular SVG Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${profile.kycScore || 90}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white font-display">{profile.kycScore}%</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">KYC Ready</span>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>KYC Fully Compliant</span>
              </span>
            </div>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Submit Update Request</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Active Verified Profile Details Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <span>Current Verified Information</span>
            </h2>
            <p className="text-xs text-slate-400">These details are currently registered with your bank account.</p>
          </div>
          <button 
            onClick={() => setIsRequestModalOpen(true)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>Update Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Photograph Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
              <img src={profile.photoUrl} alt="Customer Photo" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 p-0.5 bg-emerald-500 rounded-tl text-slate-950">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">Customer Photograph</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">Verified Biometric Photo</p>
              <span className="text-[11px] text-emerald-400 font-medium">Active & Approved</span>
            </div>
          </div>

          {/* Signature Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center flex-shrink-0">
              <img src={profile.signatureUrl} alt="Customer Signature" className="max-h-full max-w-full invert filter opacity-90" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <PenTool className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">Digital Signature</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">Specimen Signature</p>
              <span className="text-[11px] text-emerald-400 font-medium">Verified On File</span>
            </div>
          </div>

          {/* Mobile Number Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-400 mb-0.5">Mobile Number</div>
              <p className="text-sm font-mono font-bold text-white truncate">{profile.mobile}</p>
              <span className="text-[11px] text-slate-400">2FA OTP Enabled</span>
            </div>
          </div>

          {/* Email Address Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-400 mb-0.5">Email Address</div>
              <p className="text-sm font-semibold text-white truncate">{profile.email}</p>
              <span className="text-[11px] text-slate-400">E-Statements Active</span>
            </div>
          </div>

          {/* Residential Address Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-4 lg:col-span-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-400 mb-0.5">Registered Residential Address</div>
              <p className="text-sm font-semibold text-slate-200 leading-snug">{profile.address}</p>
              <span className="text-[11px] text-emerald-400 font-medium">Verified by Electricity Bill Proof</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Live Request Tracking Pipeline Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Active Update Request Tracking</span>
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No Pending Update Requests</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All your customer records and KYC documents are currently up-to-date and verified.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 space-y-6">
                
                {/* Request Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-bold text-white font-mono">{req.id}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        Pending Employee Review
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Submitted on: {new Date(req.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Fields requested:</span>
                    {req.fieldsToUpdate.map(field => (
                      <span key={field} className="text-xs font-semibold uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tracking Stepper Visual */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2">
                  
                  {/* Step 1 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Submitted</h4>
                      <p className="text-[11px] text-slate-400">Request & OTP 2FA Verified</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs animate-pulse">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-400">In Verification Queue</h4>
                      <p className="text-[11px] text-slate-400">Assigned to Bank Officer</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start space-x-3 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Document Inspection</h4>
                      <p className="text-[11px] text-slate-500">Checking Address / Proof</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start space-x-3 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Approval & Record Update</h4>
                      <p className="text-[11px] text-slate-500">Database Sync</p>
                    </div>
                  </div>

                </div>

                {/* Submitted Changes Preview */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 text-xs space-y-2">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Requested Changes:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
                    {Object.entries(req.updates).map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 capitalize">{k}:</span>
                        <span className="font-semibold text-blue-300 text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Past Update History Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Update History & Decision Log</span>
          </h2>
          <button 
            onClick={() => setIsAuditModalOpen(true)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <span>View Full System Audit Trail</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Updated Fields</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Verification Remark</th>
                  <th className="px-6 py-4 text-right">Verified By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {pastRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">{req.id}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(req.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {req.fieldsToUpdate.map(f => (
                          <span key={f} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px] border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 font-semibold text-[11px] border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{req.verificationNote || 'N/A'}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-300">{req.verifiedBy || 'System Automated'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
