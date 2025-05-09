import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  role: string;
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ role, allowedRoles, children }: ProtectedRouteProps) {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
