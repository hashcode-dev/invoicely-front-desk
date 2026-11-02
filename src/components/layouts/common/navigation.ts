import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { File } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { ShortcutId } from '$app/common/constants/keyboard-shortcuts';
import { useEnabled } from '$app/common/guards/guards/enabled';
import { formatBinding } from '$app/common/helpers/keyboard-shortcuts';
import { endpoint, isHosted } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useCurrentCompanyUser } from '$app/common/hooks/useCurrentCompanyUser';
import { useIsEmployee } from '$app/common/hooks/useIsEmployee';
import { useResolvedShortcuts } from '$app/common/hooks/useReactSettings';
import { ArrowsTransaction } from '$app/components/icons/ArrowsTransaction';
import { ChartLine } from '$app/components/icons/ChartLine';
import { ClipboardCheck } from '$app/components/icons/ClipboardCheck';
import { CreditCard } from '$app/components/icons/CreditCard';
import { Cube } from '$app/components/icons/Cube';
import { CurrencyExchange } from '$app/components/icons/CurrencyExchange';
import { FileClock } from '$app/components/icons/FileClock';
import { Files } from '$app/components/icons/Files';
import { Gear } from '$app/components/icons/Gear';
import { House } from '$app/components/icons/House';
import { Office } from '$app/components/icons/Office';
import { Plus } from '$app/components/icons/Plus';
import { Refresh } from '$app/components/icons/Refresh';
import SackCoins from '$app/components/icons/SackCoins';
import { SuitCase } from '$app/components/icons/SuitCase';
import { Users } from '$app/components/icons/Users';
import { Wallet } from '$app/components/icons/Wallet';
import { ModuleBitmask } from '$app/pages/settings';
import { Invoice as InvoiceIcon } from '../../icons/Invoice';
import { NavigationItem } from '../components/DesktopSidebar';

export function useNavigation(): NavigationItem[] {
  const [t] = useTranslation();
  const enabled = useEnabled();
  const hasPermission = useHasPermission();
  const companyUser = useCurrentCompanyUser();
  const company = useCurrentCompany();
  const isEmployee = useIsEmployee();
  const shortcutBindings = useResolvedShortcuts();

  const { data: serverNavConfig } = useQuery<
    Record<string, { is_visible: boolean; display_order?: number; custom_label?: string }>
  >({
    queryKey: ['/api/v1/navigation/config', company?.id, isEmployee],
    queryFn: () =>
      request('GET', endpoint('/api/v1/navigation/config'))
        .then((res: any) => res.data?.data || {})
        .catch(() => ({})),
    staleTime: 5 * 60 * 1000,
  });

  const tooltipFor = (id: ShortcutId): string | undefined => {
    const binding = shortcutBindings[id];
    return binding ? formatBinding(binding) : undefined;
  };

  return useMemo(() => {
    const rawItems: NavigationItem[] = [
      {
        id: 'dashboard',
        name: t('dashboard'),
        href: '/dashboard',
        icon: House,
        visible: hasPermission('view_dashboard'),
      },
    {
      name: t('clients'),
      href: '/clients',
      icon: Users,
      visible:
        hasPermission('view_client') ||
        hasPermission('create_client') ||
        hasPermission('edit_client'),
      rightButton: {
        icon: Plus,
        to: '/clients/create',
        label: t('new_client'),
        visible: hasPermission('create_client'),
        tooltipLabel: tooltipFor('create_client'),
      },
    },
    {
      name: t('products'),
      href: '/products',
      icon: Cube,
      visible:
        hasPermission('view_product') ||
        hasPermission('create_product') ||
        hasPermission('edit_product'),
      rightButton: {
        icon: Plus,
        to: '/products/create',
        label: t('new_product'),
        visible: hasPermission('create_product'),
        tooltipLabel: tooltipFor('create_product'),
      },
    },
    {
      name: t('invoices'),
      href: '/invoices',
      icon: InvoiceIcon,
      visible:
        enabled(ModuleBitmask.Invoices) &&
        (hasPermission('view_invoice') ||
          hasPermission('create_invoice') ||
          hasPermission('edit_invoice')),
      rightButton: {
        icon: Plus,
        to: '/invoices/create',
        label: t('new_invoice'),
        visible: hasPermission('create_invoice'),
        tooltipLabel: tooltipFor('create_invoice'),
      },
    },
    {
      name: t('recurring_invoices'),
      href: '/recurring_invoices',
      icon: Refresh,
      visible:
        enabled(ModuleBitmask.RecurringInvoices) &&
        (hasPermission('view_recurring_invoice') ||
          hasPermission('create_recurring_invoice') ||
          hasPermission('edit_recurring_invoice')),
      rightButton: {
        icon: Plus,
        to: '/recurring_invoices/create',
        label: t('new_recurring_invoice'),
        visible: hasPermission('create_recurring_invoice'),
        tooltipLabel: tooltipFor('create_recurring_invoice'),
      },
    },
    {
      name: t('payments'),
      href: '/payments',
      icon: CreditCard,
      visible:
        hasPermission('view_payment') ||
        hasPermission('create_payment') ||
        hasPermission('edit_payment'),
      rightButton: {
        icon: Plus,
        to: '/payments/create',
        label: t('new_payment'),
        visible: hasPermission('create_payment'),
        tooltipLabel: tooltipFor('create_payment'),
      },
    },
    {
      name: t('quotes'),
      href: '/quotes',
      icon: Files,
      visible:
        enabled(ModuleBitmask.Quotes) &&
        (hasPermission('view_quote') ||
          hasPermission('create_quote') ||
          hasPermission('edit_quote')),
      rightButton: {
        icon: Plus,
        to: '/quotes/create',
        label: t('new_quote'),
        visible: hasPermission('create_quote'),
        tooltipLabel: tooltipFor('create_quote'),
      },
    },
    {
      name: t('credits'),
      href: '/credits',
      icon: Wallet,
      visible:
        enabled(ModuleBitmask.Credits) &&
        (hasPermission('view_credit') ||
          hasPermission('create_credit') ||
          hasPermission('edit_credit')),
      rightButton: {
        icon: Plus,
        to: '/credits/create',
        label: t('new_credit'),
        visible: hasPermission('create_credit'),
        tooltipLabel: tooltipFor('create_credit'),
      },
    },
    {
      name: t('projects'),
      href: '/projects',
      icon: SuitCase,
      visible:
        enabled(ModuleBitmask.Projects) &&
        (hasPermission('view_project') ||
          hasPermission('create_project') ||
          hasPermission('edit_project')),
      rightButton: {
        icon: Plus,
        to: '/projects/create',
        label: t('new_project'),
        visible: hasPermission('create_project'),
        tooltipLabel: tooltipFor('create_project'),
      },
    },
    {
      name: t('tasks'),
      href: '/tasks',
      icon: ClipboardCheck,
      visible:
        enabled(ModuleBitmask.Tasks) &&
        (hasPermission('view_task') ||
          hasPermission('edit_task') ||
          hasPermission('create_task')),
      rightButton: {
        icon: Plus,
        to: '/tasks/create',
        label: t('new_task'),
        visible: hasPermission('create_task'),
        tooltipLabel: tooltipFor('create_task'),
      },
    },
    {
      name: t('vendors'),
      href: '/vendors',
      icon: Office,
      visible:
        enabled(ModuleBitmask.Vendors) &&
        (hasPermission('view_vendor') ||
          hasPermission('create_vendor') ||
          hasPermission('edit_vendor')),
      rightButton: {
        icon: Plus,
        to: '/vendors/create',
        label: t('new_vendor'),
        visible: hasPermission('create_vendor'),
        tooltipLabel: tooltipFor('create_vendor'),
      },
    },
    {
      name: t('purchase_orders'),
      href: '/purchase_orders',
      icon: FileClock,
      visible:
        enabled(ModuleBitmask.PurchaseOrders) &&
        (hasPermission('view_purchase_order') ||
          hasPermission('create_purchase_order') ||
          hasPermission('edit_purchase_order')),
      rightButton: {
        icon: Plus,
        to: '/purchase_orders/create',
        label: t('new_purchase_order'),
        visible: hasPermission('create_purchase_order'),
        tooltipLabel: tooltipFor('create_purchase_order'),
      },
    },
    {
      name: t('expenses'),
      href: '/expenses',
      icon: SackCoins,
      visible:
        enabled(ModuleBitmask.Expenses) &&
        (hasPermission('view_expense') ||
          hasPermission('create_expense') ||
          hasPermission('edit_expense')),
      rightButton: {
        icon: Plus,
        to: '/expenses/create',
        label: t('new_expense'),
        visible: hasPermission('create_expense'),
        tooltipLabel: tooltipFor('create_expense'),
      },
    },
    {
      name: t('recurring_expenses'),
      href: '/recurring_expenses',
      icon: CurrencyExchange,
      visible:
        enabled(ModuleBitmask.RecurringExpenses) &&
        (hasPermission('view_recurring_expense') ||
          hasPermission('create_recurring_expense') ||
          hasPermission('edit_recurring_expense')),
      rightButton: {
        icon: Plus,
        to: '/recurring_expenses/create',
        label: t('new_recurring_expense'),
        visible: hasPermission('create_recurring_expense'),
        tooltipLabel: tooltipFor('create_recurring_expense'),
      },
    },
    {
      name: t('transactions'),
      href: '/transactions',
      icon: ArrowsTransaction,
      visible:
        enabled(ModuleBitmask.Transactions) &&
        (hasPermission('view_bank_transaction') ||
          hasPermission('create_bank_transaction') ||
          hasPermission('edit_bank_transaction')),
      rightButton: {
        icon: Plus,
        to: '/transactions/create',
        label: t('new_transaction'),
        visible: hasPermission('create_bank_transaction'),
        tooltipLabel: tooltipFor('create_transaction'),
      },
    },
    {
      name: t('reports'),
      href: '/reports',
      icon: ChartLine,
      visible: hasPermission('view_reports'),
    },
    {
      name: t('employees', 'Employees'),
      href: '/employees',
      icon: Users,
      visible:
        !isEmployee &&
        Boolean(companyUser?.is_admin || companyUser?.is_owner),
      rightButton: {
        icon: Plus,
        to: '/employees/create',
        label: t('new_employee', 'New Employee'),
        visible:
          !isEmployee &&
          Boolean(companyUser?.is_admin || companyUser?.is_owner),
        tooltipLabel: tooltipFor('create_employee' as ShortcutId) || (t('create_employee') as string),
      },
    },
    {
      name: t('docuninja'),
      href: '/docuninja',
      icon: ArrowsTransaction,
      rightButton: {
        icon: Plus,
        to: '/docuninja/create',
        label: t('new_document'),
        visible: isHosted() || import.meta.env.VITE_ENABLE_DOCUNINJA === 'true',
        tooltipLabel: tooltipFor('create_document'),
      },
      visible: isHosted() || import.meta.env.VITE_ENABLE_DOCUNINJA === 'true',
      subOptions: [
        {
          name: t('templates'),
          href: '/docuninja/templates',
          icon: File,
          visible: true,
          rightButton: {
            icon: Plus,
            to: '/docuninja/templates/create',
            label: t('new_template'),
            visible: true,
          },
        },
        {
          name: t('users'),
          href: '/docuninja/users',
          icon: Users,
          visible: true,
          rightButton: {
            icon: Plus,
            to: '/docuninja/users/create',
            label: t('new_user'),
            visible: companyUser?.is_owner ?? false,
          },
        },
      ],
    },
    {
      id: 'settings',
      name: t('settings'),
      href:
        companyUser?.is_admin || companyUser?.is_owner
          ? '/settings/company_details'
          : '/settings/user_details',
      icon: Gear,
      visible:
        !isEmployee &&
        Boolean(companyUser?.is_admin || companyUser?.is_owner),
    },
  ];

    return rawItems
      .map((item, index) => {
        const itemKey = item.id || item.href.replace(/^\//, '').split('/')[0];
        const config = serverNavConfig && itemKey ? serverNavConfig[itemKey] : undefined;
        const visible = Boolean(item.visible) && (config ? config.is_visible !== false : true);
        const name = config?.custom_label ? config.custom_label : item.name;
        const order = config?.display_order !== undefined ? config.display_order : index + 1;
        return { ...item, id: itemKey, visible, name, order };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [t, enabled, hasPermission, companyUser, company, isEmployee, shortcutBindings, serverNavConfig]);
}

export interface NavigationHandler {
  href: string;
}

export function $visibility(_href: string, _visible: boolean) {
  // Declarative navigation handles visibility via permissions/modules
}
