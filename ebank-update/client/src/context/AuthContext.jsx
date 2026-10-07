import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, customerService, adminService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.id === toast?.id ? null : prev));
    }, 4000);
  };

  const login = async (username, password, role) => {
    setLoading(true);
    try {
      const res = await authService.login({ username, password, role });
      if (res.success && res.data) {
        const authData = res.data;
        const loggedUser = { username: authData.username, role: authData.role };
        
        setUser(loggedUser);
        setToken(authData.token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        localStorage.setItem('token', authData.token);

        if (authData.profile) {
          setProfile(authData.profile);
          localStorage.setItem('profile', JSON.stringify(authData.profile));
        }

        showToast(`Welcome back, ${authData.username}!`, 'success');
        return authData;
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authService.register(formData);
      if (res.success) {
        showToast('Registration successful! Please login.', 'success');
        return res.data;
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    showToast('Logged out successfully', 'info');
  };

  const refreshProfile = async () => {
    if (user && user.role === 'ROLE_CUSTOMER') {
      try {
        const res = await customerService.getProfile(user.username);
        if (res.success && res.data) {
          setProfile(res.data);
          localStorage.setItem('profile', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Failed to refresh profile:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        toast,
        login,
        register,
        logout,
        refreshProfile,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
