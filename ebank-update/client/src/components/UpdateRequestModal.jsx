import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { uploadFileApi } from '../utils/api';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  Camera, 
  PenTool, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  KeyRound,
  FileCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function UpdateRequestModal() {
  const { 
    isRequestModalOpen, 
    setIsRequestModalOpen, 
    profile, 
    submitUpdateRequest, 
    sendOtp, 
    verifyOtp,
    showToast 
  } = useBank();

  // Wizard Step: 1 = Choose Fields, 2 = Fill Data & Uploads, 3 = OTP 2FA, 4 = Success
  const [step, setStep] = useState(1);

  // Form State
  const [selectedFields, setSelectedFields] = useState({
    mobile: false,
    email: false,
    address: false,
    photo: false,
    signature: false,
  });

  const [formValues, setFormValues] = useState({
    mobile: profile?.mobile || '',
    email: profile?.email || '',
    address: profile?.address || '',
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    addressProof: null,
    photoProof: null,
    signatureProof: null,
  });

  const [uploading, setUploading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [generatedOtpHint, setGeneratedOtpHint] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completedReqId, setCompletedReqId] = useState(null);

  if (!isRequestModalOpen) return null;

  const toggleField = (field) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Direct REST API file upload handler or local file reader fallback
      const uploadRes = await uploadFileApi(file);
      setUploadedDocs(prev => ({
        ...prev,
        [type]: {
          name: file.name,
          url: uploadRes.file.url,
          type: file.type
        }
      }));
      showToast(`${file.name} uploaded successfully!`, 'success');
    } catch (err) {
      // Local blob fallback for preview if backend is static
      const localUrl = URL.createObjectURL(file);
      setUploadedDocs(prev => ({
        ...prev,
        [type]: {
          name: file.name,
          url: localUrl,
          type: file.type
        }
      }));
      showToast(`${file.name} attached for submission.`, 'info');
    } finally {
      setUploading(false);
    }
  };

  // Proceed to Step 2
  const handleProceedToInput = () => {
    const activeKeys = Object.keys(selectedFields).filter(k => selectedFields[k]);
    if (activeKeys.length === 0) {
      showToast("Please select at least one detail field to update.", 'error');
      return;
    }
    setStep(2);
  };

  // Request OTP & Proceed to Step 3
  const handleRequestOtpStep = async () => {
    // Validate inputs
    if (selectedFields.mobile && !formValues.mobile) {
      showToast("Please enter new mobile number", 'error');
      return;
    }
    if (selectedFields.email && !formValues.email) {
      showToast("Please enter new email address", 'error');
      return;
    }
    if (selectedFields.address && !formValues.address) {
      showToast("Please enter new residential address", 'error');
      return;
    }

    setOtpSending(true);
    try {
      const res = await sendOtp(profile.mobile, 'SMS');
      setGeneratedOtpHint(res.debugOtp);
      showToast(`2FA OTP sent to ${profile.mobile}!`, 'success');
      setStep(3);
    } catch (err) {
      // Fallback
      setGeneratedOtpHint('123456');
      setStep(3);
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP & Submit to Server
  const handleSubmitFinal = async () => {
    if (!otpCode || otpCode.length < 6) {
      showToast("Please enter the 6-digit OTP code", 'error');
      return;
    }

    setOtpVerifying(true);
    try {
      await verifyOtp(otpCode, profile.mobile);
      
      // Build request payload
      setSubmitting(true);
      const fieldsList = Object.keys(selectedFields).filter(k => selectedFields[k]);
      
      const updatesPayload = {};
      if (selectedFields.mobile) updatesPayload.mobile = formValues.mobile;
      if (selectedFields.email) updatesPayload.email = formValues.email;
      if (selectedFields.address) updatesPayload.address = formValues.address;
      if (selectedFields.photo && uploadedDocs.photoProof) updatesPayload.photoUrl = uploadedDocs.photoProof.url;
      if (selectedFields.signature && uploadedDocs.signatureProof) updatesPayload.signatureUrl = uploadedDocs.signatureProof.url;

      const created = await submitUpdateRequest({
        fieldsToUpdate: fieldsList,
        updates: updatesPayload,
        documents: uploadedDocs,
        urgency: fieldsList.includes('address') || fieldsList.includes('photo') ? 'HIGH' : 'MEDIUM'
      });

      setCompletedReqId(created?.id || 'REQ-2026-SUCCESS');
      setStep(4);
    } catch (err) {
      showToast("Invalid OTP code. Try using '123456' or check your hint.", 'error');
    } finally {
      setOtpVerifying(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsRequestModalOpen(false);
    setStep(1);
    setOtpCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">KYC Update Request Wizard</h2>
              <p className="text-xs text-slate-400">Step {step} of 4 • Digital Records Verification</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: SELECT FIELDS */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Select Details to Update</h3>
                <p className="text-xs text-slate-400">Choose one or more items you would like to submit for bank officer verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div 
                  onClick={() => toggleField('mobile')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    selectedFields.mobile 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-300 ring-1 ring-blue-500' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <Phone className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Mobile Phone Number</p>
                    <p className="text-[11px] text-slate-400">Update registered 10-digit number</p>
                  </div>
                  <input type="checkbox" checked={selectedFields.mobile} readOnly className="rounded border-slate-700 text-blue-600" />
                </div>

                <div 
                  onClick={() => toggleField('email')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    selectedFields.email 
                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Email Address</p>
                    <p className="text-[11px] text-slate-400">Update e-statement email</p>
                  </div>
                  <input type="checkbox" checked={selectedFields.email} readOnly className="rounded border-slate-700 text-indigo-600" />
                </div>

                <div 
                  onClick={() => toggleField('address')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    selectedFields.address 
                      ? 'bg-emerald-600/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Residential Address</p>
                    <p className="text-[11px] text-slate-400">Requires utility bill upload</p>
                  </div>
                  <input type="checkbox" checked={selectedFields.address} readOnly className="rounded border-slate-700 text-emerald-600" />
                </div>

                <div 
                  onClick={() => toggleField('photo')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    selectedFields.photo 
                      ? 'bg-amber-600/10 border-amber-500 text-amber-300 ring-1 ring-amber-500' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <Camera className="w-5 h-5 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Customer Photograph</p>
                    <p className="text-[11px] text-slate-400">Upload new headshot image</p>
                  </div>
                  <input type="checkbox" checked={selectedFields.photo} readOnly className="rounded border-slate-700 text-amber-600" />
                </div>

                <div 
                  onClick={() => toggleField('signature')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 sm:col-span-2 ${
                    selectedFields.signature 
                      ? 'bg-purple-600/10 border-purple-500 text-purple-300 ring-1 ring-purple-500' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <PenTool className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Specimen Signature</p>
                    <p className="text-[11px] text-slate-400">Upload scan of official signature specimen</p>
                  </div>
                  <input type="checkbox" checked={selectedFields.signature} readOnly className="rounded border-slate-700 text-purple-600" />
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: ENTER VALUES & UPLOAD DOCUMENTS */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Enter Updated Information & Upload Proofs</h3>
                <p className="text-xs text-slate-400">Provide exact details and upload relevant clear identity proof documents.</p>
              </div>

              <div className="space-y-4">
                
                {selectedFields.mobile && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">New Mobile Number</label>
                    <input 
                      type="text" 
                      value={formValues.mobile}
                      onChange={e => setFormValues({...formValues, mobile: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                      placeholder="+91 98765 00000"
                    />
                  </div>
                )}

                {selectedFields.email && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">New Email Address</label>
                    <input 
                      type="email" 
                      value={formValues.email}
                      onChange={e => setFormValues({...formValues, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                      placeholder="your.name@example.com"
                    />
                  </div>
                )}

                {selectedFields.address && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">New Residential Address</label>
                      <textarea 
                        rows="3"
                        value={formValues.address}
                        onChange={e => setFormValues({...formValues, address: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl glass-input text-sm resize-none"
                        placeholder="Flat no, Street, Landmark, City, State - Pincode"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Upload className="w-4 h-4" />
                        <span>Upload Address Proof Document (Utility Bill / Passport / Aadhaar)</span>
                      </label>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={e => handleFileChange(e, 'addressProof')}
                        className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                      />
                      {uploadedDocs.addressProof && (
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Attached: {uploadedDocs.addressProof.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedFields.photo && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>Upload Photograph (Recent passport-style headshot)</span>
                    </label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'photoProof')}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20"
                    />
                    {uploadedDocs.photoProof && (
                      <div className="flex items-center space-x-3 pt-2">
                        <img src={uploadedDocs.photoProof.url} alt="Uploaded Photo" className="w-12 h-12 rounded-lg object-cover border border-amber-500/40" />
                        <span className="text-xs text-amber-300 font-semibold">{uploadedDocs.photoProof.name} Attached</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedFields.signature && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                      <PenTool className="w-4 h-4" />
                      <span>Upload Signature Specimen Image</span>
                    </label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'signatureProof')}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20"
                    />
                    {uploadedDocs.signatureProof && (
                      <div className="flex items-center space-x-3 pt-2">
                        <img src={uploadedDocs.signatureProof.url} alt="Uploaded Signature" className="w-16 h-10 object-contain bg-white p-1 rounded border" />
                        <span className="text-xs text-purple-300 font-semibold">{uploadedDocs.signatureProof.name} Attached</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* STEP 3: OTP 2FA SECURITY VERIFICATION */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
                <KeyRound className="w-8 h-8 animate-bounce-short" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">2FA Security OTP Verification</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  We have sent a 6-digit security OTP code to your registered mobile number <span className="font-mono text-white font-bold">{profile.mobile}</span>.
                </p>
              </div>

              {/* OTP Hint simulation badge */}
              {generatedOtpHint && (
                <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-3 max-w-xs mx-auto text-xs">
                  <p className="text-slate-400">Simulated SMS Delivery:</p>
                  <p className="text-blue-400 font-mono font-bold text-base tracking-widest mt-1">
                    OTP: {generatedOtpHint}
                  </p>
                  <button 
                    onClick={() => setOtpCode(generatedOtpHint)}
                    className="text-[10px] text-slate-400 hover:text-white underline mt-1"
                  >
                    Click to Auto-Fill Code
                  </button>
                </div>
              )}

              {/* OTP Code Inputs */}
              <div className="flex justify-center items-center max-w-xs mx-auto">
                <input 
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-[1em] font-mono font-bold text-2xl py-3 rounded-xl glass-input border-blue-500/50"
                  placeholder="------"
                  autoFocus
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Didn't receive code? <button onClick={handleRequestOtpStep} className="text-blue-400 underline font-semibold">Resend OTP</button> or use test code <span className="font-mono text-slate-300">123456</span>.
              </p>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-6 text-center py-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Update Request Submitted!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  Your request has been securely dispatched to the bank employee verification queue.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Tracking Reference ID:</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">{completedReqId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Pending Verification
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Expected SLA:</span>
                  <span className="text-xs font-medium text-slate-200">Within 24 Hours</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                You can switch to the <strong className="text-emerald-400">Bank Employee Portal</strong> tab at any time to review and verify this request as an administrator!
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {step === 1 && (
            <button
              onClick={handleProceedToInput}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 ml-auto"
            >
              <span>Continue to Input Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleRequestOtpStep}
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 ml-auto"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify with 2FA OTP</span>
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSubmitFinal}
              disabled={otpVerifying || submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 ml-auto"
            >
              {otpVerifying || submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Submit Request to Bank</span>
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs ml-auto"
            >
              Done & Return to Dashboard
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
