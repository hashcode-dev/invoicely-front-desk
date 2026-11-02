import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function SuperAdminGuard() {
  const token = localStorage.getItem('X-NINJA-TOKEN');
  const sessionUser = sessionStorage.getItem('invoicely_auth_user');

  if (!token && !sessionUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
