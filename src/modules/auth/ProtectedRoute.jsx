import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

/**
 * Route protection wrapper for authenticated pages.
 * Redirects unauthenticated users to /login preserving the requested location.
 */
export const ProtectedRoute = ({ children }) => {
  const { currentUser, isAuthenticated, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen message="Verifying authentication session..." />;
  }

  // If Firebase is configured and user is NOT signed in, redirect to /login
  const authed = isAuthenticated || Boolean(currentUser);
  if (isConfigured && !authed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
