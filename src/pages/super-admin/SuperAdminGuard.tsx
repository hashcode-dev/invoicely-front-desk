import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function SuperAdminGuard() {
  const superAdminToken = localStorage.getItem('X-SUPERADMIN-TOKEN');
  const superAdminSession = sessionStorage.getItem('invoicely_superadmin_session');

  if (!superAdminToken && !superAdminSession) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return <Outlet />;
}
