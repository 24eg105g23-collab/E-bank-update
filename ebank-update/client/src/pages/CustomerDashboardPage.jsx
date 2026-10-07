import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/api';
import {
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileSignature,
  Camera,
  Smartphone,
  Mail,
  Home,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { profile, user, refreshProfile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshProfile();
    const fetchRequests = async () => {
      try {
        const res = await customerService.getMyRequests();
        if (res.success) {
          setRequests(res.data);
        }
      } catch (err) {
        console.error('Failed to load my requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  const quickActions = [
    { title: 'Update Signature', desc: 'Upload specimen signature', type: 'SIGNATURE', icon: FileSignature, color: 'text-purple-400 bg-purple-500/10' },
    { title: 'Update Photograph', desc: 'Submit updated selfie / portrait', type: 'PHOTO', icon: Camera, color: 'text-sky-400 bg-sky-500/10' },
    { title: 'Update Mobile', desc: 'Change linked phone number', type: 'MOBILE', icon: Smartphone, color: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Update Address', desc: 'Change residence proof', type: 'ADDRESS', icon: Home, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Banking Session
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile?.fullName || user?.username}!
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Keep your digital KYC updated to prevent transaction interruptions and stay compliant with banking guidelines.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800/80 px-5 py-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                Profile Completion
              </span>
              <span className="text-xl font-bold text-white">92% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="text-2xl font-bold text-white mt-0.5">{pendingCount}</div>
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
            <div className="text-2xl font-bold text-white mt-0.5">{approvedCount}</div>
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
            <div className="text-2xl font-bold text-white mt-0.5">{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Quick KYC Modification Actions</h2>
            <p className="text-xs text-slate-400">Select what information you want to update</p>
          </div>
          <Link
            to="/customer/update"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            All update forms <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={`/customer/update?type=${action.type}`}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{action.desc}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Submit update <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Update Requests</h2>
            <p className="text-xs text-slate-400">Track current status of submitted modifications</p>
          </div>
          <Link
            to="/customer/requests"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            View all history
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No update requests submitted yet.{' '}
            <Link to="/customer/update" className="text-blue-400 underline font-medium">
              Create your first request
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Req ID</th>
                  <th className="py-3 px-3">Update Type</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Officer Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-mono font-bold text-blue-400">REQ-{req.id}</td>
                    <td className="py-3 px-3 font-semibold text-white">{req.updateType}</td>
                    <td className="py-3 px-3 text-slate-400">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-3">
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
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                      {req.remarks || 'Under processing'}
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
