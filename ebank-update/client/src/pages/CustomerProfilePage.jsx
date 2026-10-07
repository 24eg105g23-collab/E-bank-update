import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building,
  ShieldCheck,
  FileSignature,
  Camera,
  Calendar,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  profile?.photo?.startsWith('/api/files/')
                    ? `http://localhost:8080${profile.photo}`
                    : profile?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                }
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase rounded-full shadow-md">
                {profile?.kycStatus || 'VERIFIED'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {profile?.fullName || user?.username}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {profile?.accountType || 'Savings Account'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Customer ID: <span className="text-slate-200">{profile?.customerId || 'CUST-10492'}</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Account Number: <span className="text-slate-200">{profile?.accountNumber || '100284759231'}</span>
              </p>
            </div>
          </div>

          <Link
            to="/customer/update"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Request Information Update</span>
          </Link>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact & Personal Information */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Contact &amp; Identity Details
            </h2>
            <Link
              to="/customer/update?type=MOBILE"
              className="text-xs text-blue-400 hover:underline"
            >
              Update
            </Link>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Registered Mobile</span>
                <span className="text-slate-200 font-semibold text-sm">
                  {profile?.mobile || '+91 98765 43210'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Registered Email</span>
                <span className="text-slate-200 font-semibold text-sm">
                  {profile?.email || 'customer@example.com'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Residential Address</span>
                <span className="text-slate-200 font-medium">
                  {profile?.address || '42, Galaxy Residency, MG Road, Bangalore 560001'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Banking & Branch Details */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Bank Branch &amp; Compliance
            </h2>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <Building className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Home Branch</span>
                <span className="text-slate-200 font-semibold text-sm">
                  {profile?.branchName || 'MG Road Metropolis Branch'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Account Category</span>
                <span className="text-slate-200 font-semibold text-sm">
                  {profile?.accountType || 'Savings Platinum Tier'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-400 block">KYC Verification Status</span>
                <span className="text-emerald-400 font-bold uppercase">
                  {profile?.kycStatus || 'VERIFIED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Specimen Signature Section */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Bank Recorded Specimen Signature
              </h2>
              <p className="text-xs text-slate-400">
                Official signature specimen used for validating cheques and branch requests
              </p>
            </div>
            <Link
              to="/customer/update?type=SIGNATURE"
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>Update Specimen Signature</span>
            </Link>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="bg-white/95 p-4 rounded-xl shadow-inner max-w-sm w-full flex items-center justify-center min-h-[90px]">
              {profile?.signature ? (
                <img
                  src={
                    profile.signature.startsWith('/api/files/')
                      ? `http://localhost:8080${profile.signature}`
                      : profile.signature
                  }
                  alt="Customer Specimen Signature"
                  className="max-h-20 max-w-full object-contain filter contrast-125"
                />
              ) : (
                <span className="text-xs text-slate-400 italic">No signature specimen on file</span>
              )}
            </div>

            <div className="text-xs text-slate-400 space-y-1 sm:max-w-md">
              <p className="font-semibold text-slate-300">Specimen Security Compliance:</p>
              <p>
                Any changes to your specimen signature require strict verification by a bank KYC officer.
                Once approved, the new signature instantly reflects across all branch verification points.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
