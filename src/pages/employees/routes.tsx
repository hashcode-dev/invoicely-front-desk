import { lazy } from 'react';
import { Outlet, Route } from 'react-router-dom';
import { Guard } from '$app/common/guards/Guard';
import { organization } from '$app/common/guards/guards/admin';

const Employees = lazy(() => import('./index/Employees'));
const CreateEmployee = lazy(() => import('./create/CreateEmployee'));
const EditEmployee = lazy(() => import('./edit/EditEmployee'));

export const employeeRoutes = (
  <Route
    path="/employees"
    element={<Guard guards={[organization()]} component={<Outlet />} />}
  >
    <Route path="" element={<Employees />} />
    <Route path="create" element={<CreateEmployee />} />
    <Route path=":id/edit" element={<EditEmployee />} />
  </Route>
);
