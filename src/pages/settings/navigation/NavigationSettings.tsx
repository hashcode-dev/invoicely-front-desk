import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiArrowUp, FiArrowDown, FiCheck, FiRefreshCw, FiMenu } from 'react-icons/fi';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useTitle } from '$app/common/hooks/useTitle';
import { Card } from '$app/components/cards';
import { Settings } from '$app/components/layouts/Settings';

export interface NavItemConfig {
  item_key: string;
  is_visible: boolean;
  display_order: number;
  custom_label?: string;
  is_locked?: boolean;
  role?: string;
}

const DEFAULT_MODULE_KEYS = [
  'dashboard',
  'clients',
  'products',
  'invoices',
  'recurring_invoices',
  'payments',
  'quotes',
  'credits',
  'projects',
  'tasks',
  'vendors',
  'purchase_orders',
  'expenses',
  'recurring_expenses',
  'reports',
  'documents',
  'employees',
  'transactions',
  'settings',
];

export function NavigationSettings() {
  useTitle('navigation_menu_customizer');
  const [t] = useTranslation();
  const queryClient = useQueryClient();

  const [activeRole, setActiveRole] = useState<'EMPLOYEE' | 'DEFAULT'>('EMPLOYEE');
  const [items, setItems] = useState<NavItemConfig[]>([]);

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: 'Navigation & Menu Customizer', href: '/settings/navigation_menu' },
  ];

  const { data: serverRules = [], isLoading, refetch } = useQuery<NavItemConfig[]>({
    queryKey: ['/api/v1/navigation/rules', activeRole],
    queryFn: async () => {
      const res = await request('GET', endpoint(`/api/v1/navigation/rules?role=${activeRole}`));
      return (res.data?.data || res.data || []) as NavItemConfig[];
    },
  });

  useEffect(() => {
    // Merge server rules with all available modules to ensure complete list
    const ruleMap = new Map<string, NavItemConfig>();
    serverRules.forEach((r) => ruleMap.set(r.item_key, r));

    const merged = DEFAULT_MODULE_KEYS.map((key, index) => {
      if (ruleMap.has(key)) {
        return ruleMap.get(key)!;
      }
      return {
        item_key: key,
        is_visible: activeRole === 'EMPLOYEE' ? !['employees', 'reports', 'settings'].includes(key) : true,
        display_order: index + 1,
        custom_label: '',
        is_locked: false,
        role: activeRole,
      };
    });

    merged.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    setItems(merged);
  }, [serverRules, activeRole]);

  const saveMutation = useMutation({
    mutationFn: async (updated: NavItemConfig[]) => {
      const res = await request('PUT', endpoint(`/api/v1/navigation/rules?role=${activeRole}`), updated);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Navigation menu configuration saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['/api/v1/navigation/config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/v1/navigation/rules', activeRole] });
    },
    onError: () => {
      toast.error('Failed to save navigation configuration.');
    },
  });

  const handleToggleVisible = (index: number) => {
    const next = [...items];
    next[index] = { ...next[index], is_visible: !next[index].is_visible };
    setItems(next);
  };

  const handleToggleLocked = (index: number) => {
    const next = [...items];
    next[index] = { ...next[index], is_locked: !next[index].is_locked };
    setItems(next);
  };

  const handleLabelChange = (index: number, val: string) => {
    const next = [...items];
    next[index] = { ...next[index], custom_label: val };
    setItems(next);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    // Re-assign display orders sequentially
    const reordered = next.map((it, idx) => ({ ...it, display_order: idx + 1 }));
    setItems(reordered);
  };

  const handleSave = () => {
    const payload = items.map((it, idx) => ({
      ...it,
      display_order: idx + 1,
      role: activeRole,
    }));
    saveMutation.mutate(payload);
  };

  const handleResetToDefaults = () => {
    const reset = DEFAULT_MODULE_KEYS.map((key, index) => ({
      item_key: key,
      is_visible: activeRole === 'EMPLOYEE' ? !['employees', 'reports', 'settings'].includes(key) : true,
      display_order: index + 1,
      custom_label: '',
      is_locked: false,
      role: activeRole,
    }));
    setItems(reset);
  };

  return (
    <Settings
      title="Navigation & Menu Customizer"
      breadcrumbs={pages}
      onSaveClick={handleSave}
      disableSaveButton={saveMutation.isPending}
    >
      <div className="space-y-6">
        <Card
          title="Role-Based Sidebar Navigation Governance"
          description="Control which modules appear in the side navigation bar for organization staff and employees, override menu labels, and establish display order."
        >
          {/* Role Filter Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              type="button"
              onClick={() => setActiveRole('EMPLOYEE')}
              className={`py-2 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeRole === 'EMPLOYEE'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Employee Navigation (Staff & Agents)
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('DEFAULT')}
              className={`py-2 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeRole === 'DEFAULT'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Company Default / Admin Navigation
            </button>
          </div>

          <div className="flex items-center justify-between pb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Configure options visible to users assigned to this role. Hidden options will not be rendered in their sidebar.
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>

          {/* Table of Navigation Items */}
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left w-12">Order</th>
                  <th className="px-4 py-3 text-left">Navigation Module</th>
                  <th className="px-4 py-3 text-center w-28">Visible</th>
                  <th className="px-4 py-3 text-center w-28">Locked</th>
                  <th className="px-4 py-3 text-left">Custom Label Override</th>
                  <th className="px-4 py-3 text-right w-24">Reorder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading rules...
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.item_key}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${
                        !item.is_visible ? 'opacity-60 bg-gray-50/50 dark:bg-gray-900/50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        #{index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                        <FiMenu className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{item.item_key.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.is_visible}
                          onChange={() => handleToggleVisible(index)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(item.is_locked)}
                          onChange={() => handleToggleLocked(index)}
                          className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          title="Lock setting so employees cannot modify it"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.custom_label || ''}
                          onChange={(e) => handleLabelChange(index, e.target.value)}
                          placeholder={`Default: ${item.item_key.replace(/_/g, ' ')}`}
                          className="w-full text-xs px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30"
                          title="Move up"
                        >
                          <FiArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === items.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30"
                          title="Move down"
                        >
                          <FiArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Settings>
  );
}
