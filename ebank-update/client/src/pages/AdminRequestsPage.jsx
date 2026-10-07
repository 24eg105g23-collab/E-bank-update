import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminService } from '../services/api';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Eye,
} from 'lucide-react';

export default function AdminRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRequests = async (status) => {
    setLoading(true);
    try {
      const res = await adminService.getRequests(status);
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load requests queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(statusFilter);
  }, [statusFilter]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setSearchParams(status === 'ALL' ? {} : { status });
  };

  const filtered = requests.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.id.toString().includes(q) ||
      r.updateType.toLowerCase().includes(q) ||
      r.customer?.fullName.toLowerCase().includes(q) ||
      r.customer?.customerId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Update Requests Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and review submitted KYC updates for bank account records
          </p>
        </div>

        <button
          onClick={() => fetchRequests(statusFilter)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => handleFilterChange(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, ID or type..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">Loading queue...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No matching update requests found in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Update Type</th>
                  <th className="py-3.5 px-4">Date Submitted</th>
                  <th className="py-3.5 px-4">Document / Proof</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-400">
                      REQ-{req.id}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-white block">
                        {req.customer?.fullName || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        ID: {req.customer?.customerId} • {req.customer?.mobile}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-indigo-300 text-[11px] border border-slate-700">
                        {req.updateType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      {req.documentPath ? (
                        <a
                          href={`http://localhost:8080${req.documentPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium underline"
                        >
                          View Document <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">Direct Value Input</span>
                      )}
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
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/admin/requests/${req.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
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
