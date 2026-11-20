import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * Route protection wrapper.
 * Ensures user is authenticated before allowing access to private dashboard views.
 */
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen message="Verifying authentication session..." />;
  }

  // If Firebase is configured and user is NOT signed in, redirect to /login
  if (isConfigured && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
