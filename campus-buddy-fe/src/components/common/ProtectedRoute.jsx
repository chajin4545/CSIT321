import React from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const context = useOutletContext(); // Capture context from MainLayout

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on their actual role to avoid them getting stuck
    switch (user.role) {
      case 'student':
        return <Navigate to="/student/admin-chat" replace />;
      case 'professor':
        return <Navigate to="/professor/schedule" replace />;
      case 'school_admin':
        return <Navigate to="/school-admin/schedules" replace />;
      case 'sys_admin':
        return <Navigate to="/sys-admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Pass the context down to children (e.g. AdminChat)
  return <Outlet context={context} />;
};

export default ProtectedRoute;
