import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import type { UserRole } from '@/types/enums';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, only users with one of these roles can access the route */
  allowedRoles?: UserRole[];
}

/**
 * Guards a route by checking authentication and optional role requirements.
 * - Not authenticated → redirect to /auth/login (preserving intended location)
 * - Authenticated but wrong role → redirect to /forbidden
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
