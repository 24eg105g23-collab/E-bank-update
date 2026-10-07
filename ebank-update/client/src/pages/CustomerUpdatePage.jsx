import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/api';
import {
  FileSignature,
  Camera,
  Smartphone,
  Mail,
  Home,
  ShieldCheck,
  Upload,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function CustomerUpdatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile, showToast } = useAuth();

  const initialType = searchParams.get('type') || 'SIGNATURE';

  const [updateType, setUpdateType] = useState(initialType);
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [remarks, setRemarks] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update old value automatically when type changes
  useEffect(() => {
    setError('');
    setFile(null);
    setPreviewUrl(null);
    if (!profile) return;

    switch (updateType) {
      case 'SIGNATURE':
        setOldValue(profile.signature || 'Current signature on file');
        setNewValue('');
        break;
      case 'PHOTO':
        setOldValue(profile.photo || 'Current photograph on file');
        setNewValue('');
        break;
      case 'MOBILE':
        setOldValue(profile.mobile || '');
        setNewValue('');
        break;
      case 'EMAIL':
        setOldValue(profile.email || '');
        setNewValue('');
        break;
      case 'ADDRESS':
        setOldValue(profile.address || '');
        setNewValue('');
        break;
      case 'KYC':
        setOldValue(profile.kycStatus || 'VERIFIED');
        setNewValue('Full KYC Document Re-Verification');
        break;
      default:
        setOldValue('');
    }
  }, [updateType, profile]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      // Validate file size (10MB)
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must not exceed 10MB');
        return;
      }
      setFile(selected);
      setError('');

      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selected);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if ((updateType === 'SIGNATURE' || updateType === 'PHOTO') && !file && !newValue) {
      setError(`Please upload a ${updateType.toLowerCase()} file`);
      return;
    }
    if ((updateType === 'MOBILE' || updateType === 'EMAIL' || updateType === 'ADDRESS') && !newValue) {
      setError('Please provide the new value to update');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('updateType', updateType);
      formData.append('oldValue', oldValue || '');
      formData.append('newValue', newValue || '');
      formData.append('remarks', remarks || `Update requested for ${updateType}`);
      if (file) {
        formData.append('file', file);
      }

      const res = await customerService.submitRequest(formData);
      if (res.success) {
        showToast(`Update request REQ-${res.data.id} submitted for approval!`, 'success');
        navigate('/customer/requests');
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit update request');
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: 'SIGNATURE', label: 'Signature', icon: FileSignature, desc: 'Specimen Signature' },
    { id: 'PHOTO', label: 'Photograph', icon: Camera, desc: 'Identity Passport Photo' },
    { id: 'MOBILE', label: 'Mobile Number', icon: Smartphone, desc: 'Primary SMS & OTP' },
    { id: 'EMAIL', label: 'Email Address', icon: Mail, desc: 'E-Statements & Alerts' },
    { id: 'ADDRESS', label: 'Residence Address', icon: Home, desc: 'Address Proof' },
    { id: 'KYC', label: 'Full KYC', icon: ShieldCheck, desc: 'Comprehensive KYC' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Submit Customer Information Update
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select information to modify, provide new details and attach supporting documents
        </p>
      </div>

      {/* Select Update Type Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {types.map((t) => {
          const Icon = t.icon;
          const isSelected = updateType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setUpdateType(t.id)}
              className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-bold leading-tight">{t.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Current / Existing Value */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Current Registered {updateType}
            </label>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-mono break-all">
              {updateType === 'SIGNATURE' || updateType === 'PHOTO' ? (
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Current file on record:</span>
                  <span className="text-blue-400 underline truncate max-w-sm">{oldValue}</span>
                </div>
              ) : (
                oldValue || 'No existing record found'
              )}
            </div>
          </div>

          {/* New Value (for text inputs: mobile, email, address) */}
          {(updateType === 'MOBILE' || updateType === 'EMAIL' || updateType === 'ADDRESS') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New {updateType} *
              </label>
              {updateType === 'ADDRESS' ? (
                <textarea
                  rows="3"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter complete new address"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
              ) : (
                <input
                  type={updateType === 'EMAIL' ? 'email' : 'text'}
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={
                    updateType === 'MOBILE' ? 'e.g. +91 99887 76655' : 'e.g. newemail@domain.com'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          )}

          {/* Supporting Document / File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Upload {updateType === 'SIGNATURE' ? 'Specimen Signature *' : updateType === 'PHOTO' ? 'New Photograph *' : 'Supporting Proof Document (Optional)'}
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center transition-colors bg-slate-950/60">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  {file ? file.name : 'Click to select or drag and drop file'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  PNG, JPG, SVG, or PDF up to 10MB
                </span>
              </label>

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl inline-block max-w-xs">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">
                    Attachment Preview:
                  </span>
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="max-h-36 max-w-full rounded-lg mx-auto object-contain bg-white/90 p-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Customer Remarks / Reason for Update
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Signature updated due to official bank specimen renewal."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Request for Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
