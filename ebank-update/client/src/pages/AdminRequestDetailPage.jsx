import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldCheck,
  FileSignature,
  FileText,
  ExternalLink,
  Calendar,
  AlertTriangle,
  History,
} from 'lucide-react';

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [reqRes, histRes] = await Promise.all([
        adminService.getRequestById(id),
        adminService.getRequestHistory(id).catch(() => ({ data: [] })),
      ]);
      if (reqRes.success) {
        setRequest(reqRes.data);
      }
      if (histRes.success) {
        setHistory(histRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to APPROVE this update request? Customer master data will be automatically updated.')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminService.approveRequest(id, remarks || 'Verified and approved by officer');
      if (res.success) {
        showToast(`Request REQ-${id} approved successfully!`, 'success');
        await fetchDetails();
      }
    } catch (err) {
      alert(err.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert('Please enter remarks explaining the reason for rejection');
      return;
    }
    if (!window.confirm('Are you sure you want to REJECT this update request?')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminService.rejectRequest(id, remarks);
      if (res.success) {
        showToast(`Request REQ-${id} rejected.`, 'error');
        await fetchDetails();
      }
    } catch (err) {
      alert(err.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 text-sm">Loading request details...</div>;
  }

  if (error || !request) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-4">
        <p className="text-rose-400">{error || 'Request not found'}</p>
        <Link to="/admin/requests" className="text-indigo-400 underline text-xs">
          Back to requests queue
        </Link>
      </div>
    );
  }

  const isPending = request.status === 'PENDING';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/requests')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Review Request REQ-{request.id}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  request.status === 'APPROVED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : request.status === 'REJECTED'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {request.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Submitted on {request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Action Buttons for Pending */}
        {isPending && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Request</span>
            </button>
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve &amp; Update Customer Data</span>
            </button>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customer Profile & Existing Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Master Record
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {request.customer?.customerId}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block">Full Name</span>
              <span className="text-white font-semibold text-sm">{request.customer?.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Account Number</span>
              <span className="text-slate-200 font-mono">{request.customer?.accountNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Account Type</span>
              <span className="text-slate-200">{request.customer?.accountType}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Registered Email</span>
              <span className="text-slate-200">{request.customer?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Registered Mobile</span>
              <span className="text-slate-200">{request.customer?.mobile}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Existing Registered {request.updateType}</span>
              <div className="mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono break-all">
                {request.oldValue || 'None'}
              </div>
            </div>

            {/* If signature or photo, show existing preview */}
            {request.updateType?.includes('SIGNATURE') && request.customer?.signature && (
              <div>
                <span className="text-slate-400 block mb-1">Existing Specimen on File:</span>
                <div className="bg-white/95 p-3 rounded-xl border border-slate-700 inline-block">
                  <img
                    src={
                      request.customer.signature.startsWith('/api/files/')
                        ? `http://localhost:8080${request.customer.signature}`
                        : request.customer.signature
                    }
                    alt="Old Signature"
                    className="max-h-20 max-w-xs object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Submitted Modification */}
        <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
              Submitted New Information ({request.updateType})
            </h2>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              NEW VALUE
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {request.newValue && (
              <div>
                <span className="text-slate-400 block mb-1">New Value Requested:</span>
                <div className="p-3 bg-slate-950 border border-indigo-500/30 rounded-xl text-emerald-400 font-mono text-sm break-all font-semibold">
                  {request.newValue}
                </div>
              </div>
            )}

            {/* Uploaded Document / File */}
            {request.documentPath ? (
              <div>
                <span className="text-slate-400 block mb-1">Uploaded Specimen / Proof File:</span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
                  <img
                    src={`http://localhost:8080${request.documentPath}`}
                    alt="Uploaded Proof"
                    className="max-h-48 max-w-full mx-auto rounded-lg object-contain bg-white/95 p-2 shadow-inner"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="mt-3">
                    <a
                      href={`http://localhost:8080${request.documentPath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Attachment in New Tab</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic p-3 bg-slate-950 rounded-xl">
                No external document attachment provided.
              </div>
            )}

            <div>
              <span className="text-slate-400 block mb-1">Customer Notes / Submission Remarks:</span>
              <p className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                {request.remarks || 'No notes provided by customer'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Review Remarks Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          Officer Review Remarks
        </h3>
        {isPending ? (
          <div>
            <textarea
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks for approval or required corrections in case of rejection..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
            <div className="mt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                Reject with Remarks
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                Approve Request
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
            <p className="text-slate-300">
              <span className="font-semibold text-slate-400">Final Decision Remarks: </span>
              {request.remarks}
            </p>
            <p className="text-slate-500 text-[11px]">
              Reviewed By: <span className="text-indigo-400 font-semibold">{request.reviewedBy}</span> on{' '}
              {request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Audit History Timeline */}
      {history.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <span>Audit Trail &amp; Lifecycle History</span>
          </h3>
          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-start gap-3 p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs"
              >
                <div className="mt-0.5">
                  {h.status === 'APPROVED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : h.status === 'REJECTED' ? (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{h.status}</span>
                    <span className="text-slate-500 text-[10px]">
                      {h.changedAt ? new Date(h.changedAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-0.5">{h.remarks}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Actor: {h.changedBy || 'System'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
