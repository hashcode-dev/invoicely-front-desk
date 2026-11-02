import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
    <div className="space-y-8">
      {/* Page Header (DESIGN.md Section 3 & 6) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Executive Dashboard — <span className="text-blue-600 dark:text-blue-400">Platform Overview</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-tenant health, revenue analytics, and SLA resolution performance.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="min-h-[40px] px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Refresh Data</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/super-admin/customers')}
            className="min-h-[40px] px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <span className="material-symbols-outlined text-base">group</span>
            <span>View Tenants</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
          <span className="material-symbols-outlined text-3xl animate-spin text-blue-600">sync</span>
          <span className="text-sm font-medium">Loading platform metrics...</span>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
          <span>Failed to load live metrics from backend. Ensure Spring Boot is running on port 8081.</span>
        </div>
      ) : (
        <>
          {/* KPI Metrics Grid (DESIGN.md Section 5.2 MetricCard Standard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Active Tenants */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Tenants
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">group</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {metrics?.active_tenants ?? 0}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60">
                  +12.4% QTD
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Out of {metrics?.total_customers ?? 0} total registered organizations
              </p>
            </div>

            {/* Card 2: MRR */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Monthly Recurring (MRR)
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  ${(metrics?.total_monthly_recurring_revenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60">
                  +18.7% MoM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Normalized active subscription contracts
              </p>
            </div>

            {/* Card 3: Annual Run Rate */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Annualized Run Rate (ARR)
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                  ${(((metrics?.total_monthly_recurring_revenue ?? 0) * 12)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60">
                  Annual Target
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                12x current Monthly Recurring Revenue
              </p>
            </div>

            {/* Card 4: Support SLA Health */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Support Desk SLA
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  (metrics?.tickets_breached_sla ?? 0) > 0
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <span className="material-symbols-outlined text-xl">
                    {(metrics?.tickets_breached_sla ?? 0) > 0 ? 'warning' : 'support_agent'}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {metrics?.open_support_tickets ?? 0}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  (metrics?.tickets_breached_sla ?? 0) > 0
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60'
                }`}>
                  {metrics?.tickets_breached_sla ?? 0} SLA Breached
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Target resolution: 100% within guaranteed SLA window
              </p>
            </div>
          </div>

          {/* Visual Analytics Grid (DESIGN.md Section 6 Structure) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Area Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                    Platform Revenue & Invoice Processing Volume
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly recurring revenue trajectory across all tenant organizations
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-xs font-medium">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="text-slate-600 dark:text-slate-400">MRR Growth</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400">Processed Volume</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mrrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#004bca" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#004bca" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007f57" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#007f57" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0b131e',
                        borderColor: '#28384d',
                        borderRadius: '12px',
                        color: '#f8f9ff',
                        fontSize: '12px',
                      }}
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="mrr" stroke="#004bca" strokeWidth={2.5} fillOpacity={1} fill="url(#mrrGradient)" name="Monthly Recurring Revenue" />
                    <Area type="monotone" dataKey="volume" stroke="#007f57" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#volGradient)" name="Processing Volume" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Support SLA Resolution Breakdown */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Ticket Resolution by Domain
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly volume vs. resolved SLA targets
                </p>

                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0b131e',
                          borderColor: '#28384d',
                          borderRadius: '12px',
                          color: '#f8f9ff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" name="Total Inquiries" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" fill="#10b981" name="Resolved on Time" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/super-admin/tickets')}
                  className="w-full min-h-[40px] px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">support_agent</span>
                  <span>Open Support SLA Queue</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
