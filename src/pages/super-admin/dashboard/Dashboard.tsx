import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiLifeBuoy,
  FiArrowUpRight,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { adminApi, AdminMetrics } from '../common/admin-api';

export function Dashboard() {
  const navigate = useNavigate();

  const { data: metrics, isLoading, isError, refetch } = useQuery<AdminMetrics>({
    queryKey: ['admin-platform-metrics'],
    queryFn: adminApi.getMetrics,
    refetchInterval: 30000,
  });

  const mrrData = [
    { month: 'Nov', mrr: 24000, volume: 85000 },
    { month: 'Dec', mrr: 28500, volume: 104000 },
    { month: 'Jan', mrr: 33000, volume: 122000 },
    { month: 'Feb', mrr: 38200, volume: 145000 },
    { month: 'Mar', mrr: 44000, volume: 168000 },
    { month: 'Current', mrr: metrics?.total_monthly_recurring_revenue ?? 48500, volume: metrics?.total_gross_volume ?? 192000 },
  ];

  const ticketData = [
    { category: 'Billing', count: 12, resolved: 11 },
    { category: 'Integrations', count: 8, resolved: 7 },
    { category: 'Tax & Compliance', count: 6, resolved: 5 },
    { category: 'E-Invoicing', count: 4, resolved: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SaaS Platform Executive Dashboard</h1>
          <p className="text-sm text-slate-400">
            Real-time multi-tenant monitoring, revenue metrics, and support desk SLA performance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-slate-500">
          Loading platform metrics...
        </div>
      ) : isError ? (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          Failed to load live metrics from backend. Ensure Spring Boot is running on port 8080.
        </div>
      ) : (
        <>
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Tenants</span>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <FiUsers className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">
                  {metrics?.active_tenants ?? 0}
                </span>
                <span className="text-xs text-slate-400">
                  of {metrics?.total_customers ?? 0} total
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-emerald-400">
                <FiArrowUpRight className="w-3.5 h-3.5 mr-1" />
                <span>+12.4% this quarter</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Monthly Recurring (MRR)</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FiDollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">
                  ${(metrics?.total_monthly_recurring_revenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-emerald-400">
                <FiArrowUpRight className="w-3.5 h-3.5 mr-1" />
                <span>+18.7% vs last month</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Gross Invoiced Volume</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">
                  ${(metrics?.total_gross_volume ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Across all active organizations
              </div>
            </div>

            <div className={`p-5 rounded-xl bg-slate-900 border ${
              (metrics?.tickets_breached_sla ?? 0) > 0 ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
            } transition`}>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Support SLA Status</span>
                <div className={`p-2 rounded-lg ${
                  (metrics?.tickets_breached_sla ?? 0) > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <FiLifeBuoy className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">
                  {metrics?.open_support_tickets ?? 0}
                </span>
                <span className="text-xs text-slate-400">open tickets</span>
              </div>
              <div className="mt-2 flex items-center text-xs">
                {(metrics?.tickets_breached_sla ?? 0) > 0 ? (
                  <span className="flex items-center text-rose-400 font-semibold">
                    <FiAlertTriangle className="w-3.5 h-3.5 mr-1" />
                    {metrics?.tickets_breached_sla} breached SLA
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">100% SLA Compliance</span>
                )}
              </div>
            </div>
          </div>

          {/* Visual Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">MRR & Volume Expansion</h3>
                  <p className="text-xs text-slate-400">Monthly revenue velocity across active customer tiers</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                    />
                    <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#mrrGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Tickets by Category</h3>
                  <p className="text-xs text-slate-400">Incoming vs resolved queries</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticketData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    />
                    <Bar dataKey="count" fill="#38bdf8" name="Total Inquiries" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="#34d399" name="Resolved" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/30 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Customer Account Directory</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect tenant payment volumes, active user seats, and securely impersonate owners.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/super-admin/customers')}
                className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition"
              >
                View Tenants &rarr;
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950/40 border border-blue-900/30 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Customer Support & SLA Resolution</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Manage incoming customer complaints, internal notes, and technical troubleshooting tickets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/super-admin/tickets')}
                className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition"
              >
                Open Support Desk &rarr;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
