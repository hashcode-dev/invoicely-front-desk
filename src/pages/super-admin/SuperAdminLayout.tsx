import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiActivity, FiUsers, FiLifeBuoy, FiShield, FiLogOut, FiUser } from 'react-icons/fi';
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
    { to: '/super-admin/dashboard', label: 'Metrics & Revenue', icon: FiActivity },
    { to: '/super-admin/customers', label: 'Tenant Directory', icon: FiUsers },
    { to: '/super-admin/tickets', label: 'Support Desk', icon: FiLifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-lg tracking-wide">
                <FiShield className="w-6 h-6 text-indigo-500" />
                <span>INVOICELY <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">OPERATOR HQ</span></span>
              </div>
              <div className="hidden md:flex items-center space-x-1 pl-6 border-l border-slate-800">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected: Platform Engine
              </span>

              <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <div className="p-1.5 rounded-full bg-slate-800 text-indigo-400">
                    <FiUser className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium hidden md:inline">
                    {adminSession?.name || adminSession?.email || 'Super Admin'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-md border border-rose-500/30 transition"
                  title="Sign out of Operator Console"
                >
                  <FiLogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
