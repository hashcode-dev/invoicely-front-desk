import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiUserCheck,
  FiExternalLink,
  FiDollarSign,
  FiLifeBuoy,
  FiFilter,
  FiRefreshCw,
} from 'react-icons/fi';
import { adminApi, AdminCustomer } from '../common/admin-api';

export function Customers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  const { data: customers = [], isLoading, isError, refetch } = useQuery<AdminCustomer[]>({
    queryKey: ['admin-customers'],
    queryFn: () => adminApi.getCustomers(1, 100),
  });

  const impersonateMutation = useMutation({
    mutationFn: (companyId: string) => adminApi.impersonateCustomer(companyId),
    onSuccess: (token, companyId) => {
      if (token) {
        localStorage.setItem('X-NINJA-TOKEN', token);
        localStorage.setItem('X-IMPERSONATED-BY-OPERATOR', 'true');
        // Navigate to app dashboard as the impersonated tenant
        window.location.href = '/dashboard';
      }
    },
    onSettled: () => {
      setImpersonatingId(null);
    },
  });

  const handleImpersonate = (companyId: string) => {
    if (window.confirm('Are you sure you want to impersonate this tenant? An audit log entry will be recorded.')) {
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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'SUSPENDED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'DELINQUENT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan?.toUpperCase()) {
      case 'ENTERPRISE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'PRO':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tenant Directory & Customer Accounts</h1>
          <p className="text-sm text-slate-400">
            Monitor client accounts, subscription statuses, payment volumes, and perform zero-password tenant impersonation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search organization or owner email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FiFilter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DELINQUENT">Delinquent</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Owner Email</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">MRR</th>
                <th className="px-6 py-4">Gross Volume</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No customer organizations match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.company_id}
                    className="hover:bg-slate-800/40 transition duration-150"
                  >
                    <td className="px-6 py-4 font-semibold text-white">
                      {customer.company_name || 'Unnamed Company'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {customer.owner_email || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPlanBadge(customer.subscription_plan)}`}>
                        {customer.subscription_plan || 'FREE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(customer.status)}`}>
                        {customer.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-400">
                      ${(customer.mrr ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      ${(customer.gross_volume ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        disabled={impersonatingId === customer.company_id}
                        onClick={() => handleImpersonate(customer.company_id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition disabled:opacity-50"
                        title="Impersonate tenant owner"
                      >
                        <FiUserCheck className="w-3.5 h-3.5" />
                        <span>{impersonatingId === customer.company_id ? 'Entering...' : 'Impersonate'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/super-admin/tickets?companyId=${customer.company_id}`)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                        title="Open Support Desk for this customer"
                      >
                        <FiLifeBuoy className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
