import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../services/api';
import { Clock, CheckCircle2, XCircle, FileText, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await customerService.getMyRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Update Requests History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status tracking and remarks from bank KYC review officers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/customer/update"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
          >
            + New Update Request
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === st
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st} ({st === 'ALL' ? requests.length : requests.filter((r) => r.status === st).length})
          </button>
        ))}
      </div>

      {/* Request Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">Loading your requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No requests found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">New Value / Document</th>
                  <th className="py-3.5 px-4">Officer Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-400">REQ-{req.id}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-white px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                        {req.updateType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {req.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {req.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                        {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {req.documentPath ? (
                        <a
                          href={`http://localhost:8080${req.documentPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline font-medium"
                        >
                          View Document <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="font-mono text-slate-300 max-w-xs truncate block">
                          {req.newValue || '-'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      {req.remarks ? (
                        <span className="text-slate-300 block">{req.remarks}</span>
                      ) : (
                        <span className="text-slate-500 italic">No remarks yet</span>
                      )}
                      {req.reviewedBy && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Reviewed by: {req.reviewedBy}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
