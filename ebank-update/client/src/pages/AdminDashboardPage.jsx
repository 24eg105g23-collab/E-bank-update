import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            KYC Verification Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bank Employee Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Review customer update requests, verify uploaded signatures and photo identity proofs, and authorize changes to the master banking ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Metrics</span>
          </button>
          <Link
            to="/admin/requests?status=PENDING"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Review Pending Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Customers
            </span>
            <div className="text-2xl font-bold text-white mt-0.5">
              {stats?.totalCustomers ?? 0}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">
              {stats?.pendingRequests ?? 0}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Approved Requests
            </span>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">
              {stats?.approvedRequests ?? 0}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Rejected Requests
            </span>
            <div className="text-2xl font-bold text-rose-400 mt-0.5">
              {stats?.rejectedRequests ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Queue Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Update Queue</h2>
            <p className="text-xs text-slate-400">Latest modification requests received across all customers</p>
          </div>
          <Link
            to="/admin/requests"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Open full queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Loading queue...</div>
        ) : !stats?.recentRequests || stats.recentRequests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No requests currently in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Req ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Update Type</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {stats.recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-3 font-mono font-bold text-indigo-400">REQ-{req.id}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-white block">{req.customer?.fullName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{req.customer?.customerId}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[11px]">
                        {req.updateType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to={`/admin/requests/${req.id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all inline-flex items-center gap-1"
                      >
                        Inspect &amp; Review
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
