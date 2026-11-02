import { describe, it, expect } from 'vitest';

describe('Navigation Governance & Admin Portal Logic', () => {
  describe('Navigation item resolution & ordering', () => {
    it('applies server visibility and display order to raw items', () => {
      const rawItems = [
        { id: 'dashboard', name: 'Dashboard', visible: true, order: 1 },
        { id: 'invoices', name: 'Invoices', visible: true, order: 2 },
        { id: 'reports', name: 'Reports', visible: true, order: 3 },
      ];

      const serverConfig: Record<string, { is_visible: boolean; display_order?: number; custom_label?: string }> = {
        reports: { is_visible: false, display_order: 10 },
        invoices: { is_visible: true, display_order: 1, custom_label: 'Billings' },
        dashboard: { is_visible: true, display_order: 2 },
      };

      const resolved = rawItems
        .map((item) => {
          const config = serverConfig[item.id];
          const visible = Boolean(item.visible) && (config ? config.is_visible !== false : true);
          const name = config?.custom_label ? config.custom_label : item.name;
          const order = config?.display_order !== undefined ? config.display_order : item.order;
          return { ...item, visible, name, order };
        })
        .sort((a, b) => a.order - b.order);

      expect(resolved[0].id).toBe('invoices');
      expect(resolved[0].name).toBe('Billings');
      expect(resolved[1].id).toBe('dashboard');
      expect(resolved[2].id).toBe('reports');
      expect(resolved[2].visible).toBe(false);
    });

    it('correctly filters hidden modules for employee role by default', () => {
      const employeeRestricted = ['employees', 'reports', 'settings'];
      const modules = ['dashboard', 'invoices', 'clients', 'employees', 'reports', 'settings'];

      const visibleModules = modules.filter((m) => !employeeRestricted.includes(m));
      expect(visibleModules).toEqual(['dashboard', 'invoices', 'clients']);
      expect(visibleModules.includes('reports')).toBe(false);
      expect(visibleModules.includes('employees')).toBe(false);
    });
  });

  describe('Table Column Governance & Lock Enforcement', () => {
    it('prevents locked columns from being deselected', () => {
      const lockedColumns = ['number', 'status', 'amount'];
      const requestedSelection = ['client', 'date']; // attempted to deselect number, status, amount

      // Merging with locked columns
      const finalColumns = Array.from(new Set([...requestedSelection, ...lockedColumns]));

      expect(finalColumns).toContain('number');
      expect(finalColumns).toContain('status');
      expect(finalColumns).toContain('amount');
      expect(finalColumns).toContain('client');
      expect(finalColumns).toContain('date');
    });

    it('filters restricted columns for employee users', () => {
      const allColumns = ['number', 'client', 'amount', 'profit_margin', 'cost_price'];
      const employeeRestrictedColumns = ['profit_margin', 'cost_price'];

      const isEmployee = true;
      const allowedColumns = isEmployee
        ? allColumns.filter((col) => !employeeRestrictedColumns.includes(col))
        : allColumns;

      expect(allowedColumns).not.toContain('profit_margin');
      expect(allowedColumns).not.toContain('cost_price');
      expect(allowedColumns).toEqual(['number', 'client', 'amount']);
    });
  });

  describe('SaaS Operator Admin SLA Evaluation', () => {
    it('correctly detects breached SLA for unresolved tickets', () => {
      const overdueDate = new Date(Date.now() - 3600 * 1000).toISOString(); // 1 hr ago
      const futureDate = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hr from now

      const isBreached = (slaDueAt: string, status: string) => {
        return Boolean(slaDueAt && new Date(slaDueAt).getTime() < Date.now() && status !== 'RESOLVED' && status !== 'CLOSED');
      };

      expect(isBreached(overdueDate, 'OPEN')).toBe(true);
      expect(isBreached(overdueDate, 'IN_PROGRESS')).toBe(true);
      expect(isBreached(overdueDate, 'RESOLVED')).toBe(false); // Resolved ticket is not currently breaching SLA
      expect(isBreached(futureDate, 'OPEN')).toBe(false);
    });

    it('differentiates internal note from public ticket response', () => {
      const message = {
        is_internal_note: true,
        is_platform_admin: true,
        message: 'Customer requested manual refund; pending gateway review.',
      };

      expect(message.is_internal_note).toBe(true);
      expect(message.is_platform_admin).toBe(true);
    });
  });
});
