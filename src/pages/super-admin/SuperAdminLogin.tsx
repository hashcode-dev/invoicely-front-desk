import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from './common/admin-api';

export function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('X-SUPERADMIN-TOKEN');
    const session = sessionStorage.getItem('invoicely_superadmin_session');
    if (token || session) {
      navigate('/super-admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await adminApi.login(email.trim(), password);
      if (response && response.token) {
        localStorage.setItem('X-SUPERADMIN-TOKEN', response.token);
        sessionStorage.setItem('invoicely_superadmin_session', JSON.stringify(response.admin));
        navigate('/super-admin/dashboard', { replace: true });
      } else {
        setErrorMessage('Authentication succeeded but no authorization token was returned.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid administrative credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-blue-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 mb-4">
          <span className="material-symbols-outlined text-3xl">account_balance</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Invoicely <span className="text-blue-600 dark:text-blue-400">Operator HQ</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          SaaS Operator Command Console • Super-Admin Authentication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start space-x-2.5 text-red-700 dark:text-red-400 text-xs font-medium" role="alert">
                <span className="material-symbols-outlined text-base mt-0.5 flex-shrink-0">error</span>
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="operator-email">
                Operator Email
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <input
                  id="operator-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@invoicely.com"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400" htmlFor="operator-password">
                  Security Password
                </label>
              </div>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <input
                  id="operator-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full min-h-[44px] pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Super-Admin Credentials...' : 'Authenticate & Enter Console'}</span>
                {!isLoading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access restricted to platform operations, revenue analytics, and tenant governance.
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                Go to Customer Tenant Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
