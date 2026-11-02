import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiActivity, FiUsers, FiLifeBuoy, FiArrowLeft, FiShield } from 'react-icons/fi';

export function SuperAdminLayout() {
  const navigate = useNavigate();

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

            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected: Platform DB V4
              </span>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Back to App</span>
              </button>
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
