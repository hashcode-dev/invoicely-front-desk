import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi, AdminCustomer } from '../common/admin-api';

export function Customers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  const { data: customers = [], isLoading, isError, refetch } = useQuery<AdminCustomer[]>({
    queryKey: ['admin-customers'],
    queryFn: () => adminApi.getCustomers(1, 100),
  });

  const impersonateMutation = useMutation({
    mutationFn: (companyId: string) => adminApi.impersonateCustomer(companyId),
    onSuccess: (token) => {
      if (token) {
        localStorage.setItem('X-NINJA-TOKEN', token);
        localStorage.setItem('X-IMPERSONATED-BY-OPERATOR', 'true');
        window.location.href = '/dashboard';
      }
    },
    onSettled: () => {
      setImpersonatingId(null);
    },
  });

  const handleImpersonate = (companyId: string) => {
    if (window.confirm('Are you sure you want to impersonate this tenant? An operator audit log entry will be recorded.')) {
      setImpersonatingId(companyId);
      impersonateMutation.mutate(companyId);
    }
  };

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      (cust.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust.owner_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || (cust.status || '').toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
      case 'SUSPENDED':
        return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900';
      case 'DELINQUENT':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan?.toUpperCase()) {
      case 'ENTERPRISE':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'PRO':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header (DESIGN.md Section 3) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Tenant Directory & Customer Accounts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor client accounts, subscription tiers, payment volume, and initiate zero-password tenant impersonation.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="min-h-[40px] px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (DESIGN.md Section 5.1 & 5.3) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name or owner email..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all card-shadow"
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-[44px] px-4 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 card-shadow transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DELINQUENT">Delinquent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table (DESIGN.md Section 5.4 Standard) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden card-shadow">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <span className="material-symbols-outlined text-3xl animate-spin text-blue-600">sync</span>
            <span className="text-sm font-medium">Loading customer accounts...</span>
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined text-3xl mb-2">error</span>
            <p className="text-sm font-medium">Failed to retrieve customer accounts from backend.</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-600">group_off</span>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No organizations match the specified criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-4">Company & Account</th>
                  <th scope="col" className="px-6 py-4">Owner Contact</th>
                  <th scope="col" className="px-6 py-4">Plan Tier</th>
                  <th scope="col" className="px-6 py-4">Account Status</th>
                  <th scope="col" className="px-6 py-4">Gross Invoiced</th>
                  <th scope="col" className="px-6 py-4">Open Tickets</th>
                  <th scope="col" className="px-6 py-4 text-right">Operator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.company_id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {customer.company_name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        ID: {customer.company_id.slice(0, 8)}...
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {customer.owner_email}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPlanBadge(customer.subscription_plan)}`}>
                        {(customer.subscription_plan || 'PRO').toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(customer.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                      ${(customer.gross_volume ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/super-admin/tickets?companyId=${customer.company_id}`)}
                        className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        <span>{customer.total_invoices ?? 0} invoices</span>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        disabled={impersonatingId === customer.company_id}
                        onClick={() => handleImpersonate(customer.company_id)}
                        className="min-h-[36px] px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-800 transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                        title="Impersonate tenant session with audit logging"
                      >
                        <span className="material-symbols-outlined text-base">
                          {impersonatingId === customer.company_id ? 'sync' : 'launch'}
                        </span>
                        <span>{impersonatingId === customer.company_id ? 'Connecting...' : 'Impersonate'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
