import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

const BankContext = createContext();

export function BankProvider({ children }) {
  // Role: 'customer' | 'employee'
  const [activeRole, setActiveRole] = useState('customer');

  // Core Data
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);

  // Active Modals & Selection
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedVerificationReq, setSelectedVerificationReq] = useState(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.id === toast?.id ? null : prev));
    }, 4500);
  };

  // Fetch initial state from server API
  const refreshData = async () => {
    try {
      const [profRes, reqsRes, notifRes, auditRes] = await Promise.all([
        fetchApi('/customer/profile'),
        fetchApi('/requests'),
        fetchApi('/notifications'),
        fetchApi('/audit-logs')
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (reqsRes.success) setRequests(reqsRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
      if (auditRes.success) setAuditLogs(auditRes.data);

      setServerOnline(true);
    } catch (err) {
      console.error("Backend fetch error:", err);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // Polling sync every 10s
    return () => clearInterval(interval);
  }, []);

  // Submit Update Request
  const submitUpdateRequest = async (payload) => {
    try {
      const res = await fetchApi('/requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.success) {
        showToast(`Request ${res.data.id} submitted successfully!`, 'success');
        await refreshData();
        return res.data;
      }
    } catch (err) {
      showToast(err.message || "Failed to submit request", 'error');
      throw err;
    }
  };

  // Verify Request (Bank Employee)
  const verifyRequest = async (id, action, verificationNote) => {
    try {
      const res = await fetchApi(`/requests/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({
          action,
          verificationNote,
          employeeId: 'EMP-304',
          employeeName: 'Officer Rajiv Mehta'
        })
      });

      if (res.success) {
        showToast(`Request ${id} has been ${action === 'APPROVE' ? 'APPROVED' : 'REJECTED'}`, action === 'APPROVE' ? 'success' : 'error');
        await refreshData();
        return res.data;
      }
    } catch (err) {
      showToast(err.message || "Verification action failed", 'error');
      throw err;
    }
  };

  // OTP APIs
  const sendOtp = async (target, channel = 'SMS') => {
    try {
      const res = await fetchApi('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ target, channel })
      });
      return res;
    } catch (err) {
      showToast("OTP dispatch failed: " + err.message, 'error');
      throw err;
    }
  };

  const verifyOtp = async (code, target) => {
    try {
      const res = await fetchApi('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ code, target })
      });
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Read Notifications
  const markNotifRead = async (id) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotifsRead = async () => {
    try {
      await fetchApi('/notifications/read-all', { method: 'POST' });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Demo DB
  const resetDemoData = async () => {
    try {
      await fetchApi('/reset-data', { method: 'POST' });
      showToast("Database reset to demo default state.", 'info');
      await refreshData();
    } catch (err) {
      showToast("Reset failed: " + err.message, 'error');
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <BankContext.Provider value={{
      activeRole,
      setActiveRole,
      profile,
      requests,
      notifications,
      auditLogs,
      loading,
      serverOnline,
      unreadNotifCount,
      isRequestModalOpen,
      setIsRequestModalOpen,
      isAuditModalOpen,
      setIsAuditModalOpen,
      selectedVerificationReq,
      setSelectedVerificationReq,
      isNotifDrawerOpen,
      setIsNotifDrawerOpen,
      submitUpdateRequest,
      verifyRequest,
      sendOtp,
      verifyOtp,
      markNotifRead,
      markAllNotifsRead,
      resetDemoData,
      refreshData,
      toast,
      showToast
    }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  return useContext(BankContext);
}
