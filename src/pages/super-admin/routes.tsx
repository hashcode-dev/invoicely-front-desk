import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { SuperAdminGuard } from './SuperAdminGuard';
import { SuperAdminLayout } from './SuperAdminLayout';

const Dashboard = lazy(() => import('./dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const Customers = lazy(() => import('./customers/Customers').then((m) => ({ default: m.Customers })));
const Tickets = lazy(() => import('./tickets/Tickets').then((m) => ({ default: m.Tickets })));

export const superAdminRoutes = (
  <Route path="/super-admin" element={<SuperAdminGuard />}>
    <Route element={<SuperAdminLayout />}>
      <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="customers" element={<Customers />} />
      <Route path="tickets" element={<Tickets />} />
    </Route>
  </Route>
);
