import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { authLoading, user } = useAuth();

  if (authLoading) {
    return (
      <div className="double-shell w-full">
        <div className="double-core flex h-64 items-center justify-center">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
