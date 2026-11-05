import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Agar user logged in nahi hy, to usay /auth (Sign In) pr redirect kr do
    // aur sath state me save kr lo k wo kahan se aya tha
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Agar user logged in hy, to protected screen render kr do
  return <Outlet />;
};

export default ProtectedRoute;

