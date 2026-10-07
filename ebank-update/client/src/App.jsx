import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Portal Landing & Auth Pages
import PortalLandingPage from './pages/PortalLandingPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Portal Pages
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import CustomerUpdatePage from './pages/CustomerUpdatePage';
import CustomerRequestsPage from './pages/CustomerRequestsPage';

// Admin / Employee Portal Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminRequestDetailPage from './pages/AdminRequestDetailPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Landing / Portal Switcher */}
          <Route path="/" element={<PortalLandingPage />} />

          {/* Dedicated Customer Portal Auth Routes */}
          <Route path="/login" element={<Navigate to="/customer/login" replace />} />
          <Route path="/customer/login" element={<CustomerLoginPage />} />
          <Route path="/customer/register" element={<RegisterPage />} />
          <Route path="/register" element={<Navigate to="/customer/register" replace />} />

          {/* Dedicated Admin / Employee Portal Auth Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* 1. CUSTOMER PORTAL (Protected for ROLE_CUSTOMER) */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboardPage />} />
            <Route path="profile" element={<CustomerProfilePage />} />
            <Route path="update" element={<CustomerUpdatePage />} />
            <Route path="requests" element={<CustomerRequestsPage />} />
          </Route>

          {/* 2. ADMIN / EMPLOYEE PORTAL (Protected for ROLE_EMPLOYEE) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ROLE_EMPLOYEE">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="requests" element={<AdminRequestsPage />} />
            <Route path="requests/:id" element={<AdminRequestDetailPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
