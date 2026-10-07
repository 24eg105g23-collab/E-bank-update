import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertCircle, 
  UserCheck, 
  Camera, 
  PenTool, 
  MapPin, 
  Phone, 
  Mail, 
  ZoomIn, 
  CheckSquare, 
  Square,
  Loader2,
  FileSearch
} from 'lucide-react';

export default function VerificationModal() {
  const { 
    selectedVerificationReq, 
    setSelectedVerificationReq, 
    profile, 
    verifyRequest, 
    showToast 
  } = useBank();

  const [note, setNote] = useState('');
  const [rejectReason, setRejectReason] = useState('Blurry Document Image');
  const [isRejecting, setIsRejecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Compliance Checkbox state
  const [checks, setChecks] = useState({
    nameMatch: true,
    clearDocument: true,
    validProofType: true,
    otpMatchPassed: true
  });

  if (!selectedVerificationReq) return null;

  const req = selectedVerificationReq;

  const toggleCheck = (k) => setChecks(prev => ({ ...prev, [k]: !prev[k] }));

  const handleApprove = async () => {
    // Check if all compliance checks passed
    if (!checks.nameMatch || !checks.clearDocument || !checks.validProofType) {
      showToast("Please complete all mandatory compliance checks before approval.", 'error');
      return;
    }

    setSubmitting(true);
    try {
      await verifyRequest(
        req.id, 
        'APPROVE', 
        note || "Officer Verified: All submitted KYC proof documents, signatures, and contact details match bank compliance guidelines."
      );
      setSelectedVerificationReq(null);
    } catch (err) {
      // Error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    setSubmitting(true);
    try {
      const finalNote = note ? `${rejectReason} - Note: ${note}` : rejectReason;
      await verifyRequest(req.id, 'REJECT', finalNote);
      setSelectedVerificationReq(null);
    } catch (err) {
      // Error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-display font-bold text-white">Side-by-Side Verification Inspector</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400">{req.id}</span>
              </div>
              <p className="text-xs text-slate-400">Comparing current customer records vs. newly uploaded KYC proof</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedVerificationReq(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Customer Metadata Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Customer Name:</span>
              <span className="text-sm font-bold text-white">{req.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Account Number:</span>
              <span className="font-mono font-bold text-blue-300">{req.accountNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Submission Date:</span>
              <span className="text-slate-200">{new Date(req.submittedAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Status:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>{req.status}</span>
            </div>
          </div>

          {/* SIDE-BY-SIDE DATA COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN: Existing Verified Profile */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>Existing Verified Profile (On File)</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 bg-slate-950/50">
                
                {req.fieldsToUpdate.includes('photo') && (
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Current Verified Photo:</span>
                    <img src={profile.photoUrl} alt="Old Photo" className="w-24 h-24 rounded-xl object-cover border border-slate-700" />
                  </div>
                )}

                {req.fieldsToUpdate.includes('signature') && (
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Current Specimen Signature:</span>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 w-48 h-20 flex items-center justify-center">
                      <img src={profile.signatureUrl} alt="Old Sig" className="max-h-full max-w-full invert opacity-80" />
                    </div>
                  </div>
                )}

                {req.fieldsToUpdate.includes('mobile') && (
                  <div>
                    <span className="text-[11px] text-slate-400 block">Current Registered Mobile:</span>
                    <p className="font-mono font-semibold text-slate-300">{profile.mobile}</p>
                  </div>
                )}

                {req.fieldsToUpdate.includes('email') && (
                  <div>
                    <span className="text-[11px] text-slate-400 block">Current Registered Email:</span>
                    <p className="font-semibold text-slate-300">{profile.email}</p>
                  </div>
                )}

                {req.fieldsToUpdate.includes('address') && (
                  <div>
                    <span className="text-[11px] text-slate-400 block">Current Registered Address:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{profile.address}</p>
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN: Newly Submitted Changes & Documents */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Newly Submitted Data & Uploaded Proof</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 space-y-4 bg-emerald-950/10">
                
                {req.updates.photoUrl && (
                  <div>
                    <span className="text-[11px] text-amber-400 font-semibold block mb-1">Uploaded New Photograph:</span>
                    <div className="relative group w-32 h-32 rounded-xl overflow-hidden border-2 border-amber-500/40">
                      <img src={req.updates.photoUrl} alt="New Photo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {req.updates.signatureUrl && (
                  <div>
                    <span className="text-[11px] text-purple-400 font-semibold block mb-1">Uploaded New Signature Specimen:</span>
                    <div className="bg-slate-900 p-2 rounded-xl border border-purple-500/40 w-48 h-20 flex items-center justify-center">
                      <img src={req.updates.signatureUrl} alt="New Sig" className="max-h-full max-w-full invert" />
                    </div>
                  </div>
                )}

                {req.updates.mobile && (
                  <div>
                    <span className="text-[11px] text-blue-400 font-semibold block">Requested New Mobile:</span>
                    <p className="font-mono font-bold text-white text-base bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 inline-block">
                      {req.updates.mobile}
                    </p>
                  </div>
                )}

                {req.updates.email && (
                  <div>
                    <span className="text-[11px] text-indigo-400 font-semibold block">Requested New Email:</span>
                    <p className="font-bold text-white bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20 inline-block">
                      {req.updates.email}
                    </p>
                  </div>
                )}

                {req.updates.address && (
                  <div>
                    <span className="text-[11px] text-emerald-400 font-semibold block">Requested New Address:</span>
                    <p className="text-xs font-semibold text-white bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 leading-relaxed">
                      {req.updates.address}
                    </p>
                  </div>
                )}

                {/* Document Viewer Thumbnail */}
                {req.documents?.addressProof && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Attached Address Proof Document:</span>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3">
                      <img src={req.documents.addressProof.url} alt="Proof" className="w-12 h-12 rounded object-cover border border-slate-700" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{req.documents.addressProof.name}</p>
                        <span className="text-[10px] text-emerald-400 font-medium">Electricity Bill Proof Attached</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Compliance Verification Checklist */}
          {req.status === 'PENDING' && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Mandatory Officer Verification Checklist</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div onClick={() => toggleCheck('nameMatch')} className="flex items-center space-x-2 cursor-pointer text-slate-300">
                  {checks.nameMatch ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                  <span>Customer Name & Account Number match banking record</span>
                </div>

                <div onClick={() => toggleCheck('clearDocument')} className="flex items-center space-x-2 cursor-pointer text-slate-300">
                  {checks.clearDocument ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                  <span>Uploaded photo / signature is legible and uncorrupted</span>
                </div>

                <div onClick={() => toggleCheck('validProofType')} className="flex items-center space-x-2 cursor-pointer text-slate-300">
                  {checks.validProofType ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                  <span>Address proof is an accepted government/utility document</span>
                </div>

                <div onClick={() => toggleCheck('otpMatchPassed')} className="flex items-center space-x-2 cursor-pointer text-slate-300">
                  {checks.otpMatchPassed ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                  <span>Customer completed 2FA SMS OTP authentication</span>
                </div>

              </div>
            </div>
          )}

          {/* Officer Verification Remarks input */}
          {req.status === 'PENDING' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Officer Remarks / Audit Note (Optional)</label>
              <textarea 
                rows="2"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add audit note or verification reason..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs resize-none"
              />
            </div>
          )}

          {/* Already Verified Info banner */}
          {req.status !== 'PENDING' && (
            <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
              req.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <p className="font-bold">Processed by: {req.verifiedBy || 'Bank Officer'}</p>
              <p>Timestamp: {new Date(req.verifiedAt).toLocaleString()}</p>
              <p className="text-slate-300">Remark: {req.verificationNote}</p>
            </div>
          )}

          {/* Rejection Reasons Sub-panel */}
          {isRejecting && (
            <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/40 space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-rose-300">Select Primary Rejection Reason</h4>
              <select 
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="Blurry or illegible document image">Blurry or illegible document image</option>
                <option value="Signature mismatch against bank specimen file">Signature mismatch against bank specimen file</option>
                <option value="Expired address proof utility bill">Expired address proof utility bill (>3 months old)</option>
                <option value="Address mismatch on uploaded proof document">Address mismatch on uploaded proof document</option>
                <option value="Biometric photograph quality non-compliant">Biometric photograph quality non-compliant</option>
              </select>
            </div>
          )}

        </div>

        {/* Footer Decision Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => setSelectedVerificationReq(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Inspector
          </button>

          {req.status === 'PENDING' && (
            <div className="flex items-center space-x-3">
              {!isRejecting ? (
                <>
                  <button
                    onClick={() => setIsRejecting(true)}
                    className="px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 hover:text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Request</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Approve & Sync Records</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmReject}
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/25 flex items-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    <span>Confirm Rejection</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
