import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';

export const AdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // 1. Agar user sign in hi nahi hy, to pehle login pr bhej do
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 2. Agar user sign in hy lekin role 'admin' nahi hy (e.g. customer)
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. User logged in hy aur uska role 'admin' hy
  return <Outlet />;
};

export default AdminRoute;

