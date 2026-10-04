import React from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { atom } from 'jotai';
import { useAuth } from './common/context/AuthContext';
import { LoginPage } from './pages/authentication/LoginPage';
import { LandingPage } from './pages/landing/LandingPage';
import { routes } from './common/routes';
import { Toaster } from 'react-hot-toast';

type NavItem = {
  label: string;
  path: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Invoices', path: '/invoices', icon: 'receipt_long' },
  { label: 'Recurring Invoices', path: '/recurring_invoices', icon: 'autorenew' },
  { label: 'Quotes', path: '/quotes', icon: 'request_quote' },
  { label: 'Credits', path: '/credits', icon: 'credit_score' },
  { label: 'Payments', path: '/payments', icon: 'payments' },
  { label: 'Customers', path: '/clients', icon: 'group' },
  { label: 'Vendors', path: '/vendors', icon: 'store' },
  { label: 'Products', path: '/products', icon: 'inventory_2' },
  { label: 'Projects', path: '/projects', icon: 'account_tree' },
  { label: 'Tasks', path: '/tasks', icon: 'task_alt' },
  { label: 'Purchase Orders', path: '/purchase_orders', icon: 'shopping_cart' },
  { label: 'Expenses', path: '/expenses', icon: 'account_balance_wallet' },
  { label: 'Recurring Expenses', path: '/recurring_expenses', icon: 'repeat' },
  { label: 'Transactions', path: '/transactions', icon: 'swap_horiz' },
  { label: 'Reports', path: '/reports', icon: 'analytics' },
  { label: 'Documents', path: '/documents', icon: 'description' },
  { label: 'Activities', path: '/activities', icon: 'history' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
];

export const refreshEntityDataBannerAtom = atom({
  refetchEntityId: '',
  refetchEntity: 'recurring_invoices' as 'invoices' | 'recurring_invoices',
  visible: false,
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate replace to="/login" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sideNavRef = React.useRef<HTMLElement>(null);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleSidebarWheel(e: React.WheelEvent<HTMLElement>) {
    if (sideNavRef.current && !sideNavRef.current.contains(e.target as Node)) {
      sideNavRef.current.scrollTop += e.deltaY;
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" onWheel={handleSidebarWheel}>
        <div className="brand-block">
          <div className="brand-logo">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <h1>Invoicely</h1>
            <p>Enterprise Suite</p>
          </div>
        </div>

        <nav ref={sideNavRef} className="side-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
              to={item.path}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="primary-action"
          type="button"
          onClick={() => navigate('/invoices/create')}
        >
          <span className="material-symbols-outlined">add</span>
          Create Invoice
        </button>
      </aside>

      <div className="main-pane">
        <header className="topbar">
          <label className="search-box" htmlFor="global-search">
            <span className="material-symbols-outlined">search</span>
            <input
              id="global-search"
              placeholder="Search invoices, customers, reports..."
              type="text"
            />
          </label>

          <div className="topbar-actions">
            <button className="icon-btn" type="button" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-btn" type="button" aria-label="Help">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="profile-chip">
              <div>
                <strong>{user?.name ?? 'User'}</strong>
                <small>{user?.email ?? ''}</small>
              </div>
              {user?.picture ? (
                <img
                  src={user.picture}
                  className="avatar"
                  alt={user.name}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="avatar">{user?.avatar ?? 'U'}</div>
              )}
            </div>
            <button
              className="icon-btn"
              type="button"
              title="Sign out"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Landing page — public marketing route */}
        <Route element={<LandingPage />} path="/" />

        {/* Auth routes */}
        <Route element={<LoginPage />} path="/login" />

        {/* Protected app routes — wrapped in Shell + RequireAuth */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Shell>{routes}</Shell>
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}
