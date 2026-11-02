import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { adminApi, SuperAdminUser } from './common/admin-api';

export function SuperAdminLayout() {
  const navigate = useNavigate();

  let adminSession: SuperAdminUser | null = null;
  try {
    const raw = sessionStorage.getItem('invoicely_superadmin_session');
    if (raw) adminSession = JSON.parse(raw);
  } catch {
    // Ignore invalid JSON
  }

  const handleLogout = () => {
    adminApi.logout();
    navigate('/super-admin/login', { replace: true });
  };

  const navLinks = [
    { to: '/super-admin/dashboard', label: 'Metrics & Revenue', icon: 'analytics' },
    { to: '/super-admin/customers', label: 'Tenant Directory', icon: 'group' },
    { to: '/super-admin/tickets', label: 'Support Desk', icon: 'support_agent' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Sticky Enterprise Header (DESIGN.md Section 5.1) */}
      <header className="h-16 sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-6">
              {/* Brand Logo & Operator Tag */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <span className="material-symbols-outlined text-xl">account_balance</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
                    Invoicely
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    Operator HQ
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200 dark:border-slate-800" aria-label="Operator Navigation">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right Status & User Profile */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Engine
              </span>

              <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                    {adminSession?.name || adminSession?.email?.split('@')[0] || 'Super Admin'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {adminSession?.email || 'admin@invoicely.com'}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs uppercase">
                  {(adminSession?.name || adminSession?.email || 'SA').slice(0, 2)}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 min-h-[36px] px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/60 rounded-xl transition-colors"
                  title="Sign out of Operator Console"
                  aria-label="Sign out"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
