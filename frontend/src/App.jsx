import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import { authAPI } from '@/services/api';

// Layout Components
import DashboardLayout from '@/components/Layout/DashboardLayout';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import MenuManagement from '@/pages/MenuManagement';
import MenuAvailability from '@/pages/MenuAvailability';
import Subscription from '@/pages/Subscription';
import Profile from '@/pages/Profile';
import PublicMenu from '@/pages/PublicMenu';
import CreateAdmin from '@/pages/CreateAdmin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminSubscriptionSettings from '@/pages/AdminSubscriptionSettings';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, token, setProfile, logout, initializeAuth } = useAuthStore();

  // Initialize auth on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Fetch user profile if authenticated
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: authAPI.getProfile,
    enabled: isAuthenticated && !!token,
    onSuccess: (response) => {
      setProfile(response.data);
    },
    onError: () => {
      logout();
    },
  });

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />
      
      {/* Public Menu Route */}
      <Route path="/r/:slug" element={<PublicMenu />} />
      
      {/* Admin Creation Route */}
      <Route path="/create-admin" element={<CreateAdmin />} />
      
      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="availability" element={<MenuAvailability />} />
        <Route path="subscription" element={<Subscription />} />

        <Route path="admin/subscription-settings" element={<AdminSubscriptionSettings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Default Redirects */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } 
      />
      
      {/* 404 Route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <a href="/" className="text-blue-600 hover:underline">
                Go back home
              </a>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

export default App;