import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';
import { useCurrentAccount } from '$app/common/hooks/useCurrentAccount';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useTitle } from '$app/common/hooks/useTitle';
import { User } from '$app/common/interfaces/user';
import { useBulk } from '$app/common/queries/users';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { CopyToClipboard } from '$app/components/CopyToClipboard';
import { Link } from '$app/components/forms';
import { Default } from '$app/components/layouts/Default';
import { PasswordConfirmation } from '$app/components/PasswordConfirmation';

export default function Employees() {
  useTitle('employees');

  const currentUser = useCurrentUser();
  const currentAccount = useCurrentAccount();
  const orgId = currentUser?.organization_id || currentAccount?.id || 'demo-workspace-01';

  const [t] = useTranslation();

  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState<boolean>(false);
  const [action, setAction] = useState<'archive' | 'restore' | 'delete'>();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const bulk = useBulk({ setIsPasswordConfirmModalOpen });

  const pages = [
    { name: t('employees', 'Employees'), href: '/employees' },
  ];

  const columns: DataTableColumns<User> = [
    {
      id: 'name',
      label: 'name',
      format: (_, resource) => (
        <Link to={route('/employees/:id/edit', { id: resource.id })}>
          {resource.first_name} {resource.last_name || ''}
        </Link>
      ),
    },
    { id: 'email', label: 'email' },
    {
      id: 'id',
      label: 'employee_id',
      format: (id) => (
        <span className="font-mono text-xs text-gray-500 select-all">{id}</span>
      ),
    },
    {
      id: 'is_admin',
      label: 'role',
      format: (_, resource) => {
        const isAdmin = resource.company_user?.is_admin || (resource as any).is_admin;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              isAdmin
                ? 'bg-secondary-container text-secondary dark:bg-purple-950/60 dark:text-purple-300'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {isAdmin ? 'Admin' : 'Employee'}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Default
        title={t('employees', 'Employees')}
        breadcrumbs={pages}
        docsLink="/docs/advanced-settings/#user_management"
      >
        {orgId && (
          <div className="mb-6 p-4 rounded-xl bg-surface-low dark:bg-slate-900/60 border border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Organization ID
              </p>
              <p className="text-sm text-text-muted dark:text-slate-300 mt-0.5">
                Share this Organization ID with team members to let them sign in via{' '}
                <span className="font-semibold text-text dark:text-white">Employee Login</span>.
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-surface-high dark:bg-slate-800 border border-outline-variant px-3 py-1.5 rounded-lg font-mono text-sm text-text dark:text-slate-200 shadow-sm w-fit">
              <span className="select-all">{orgId}</span>
              <CopyToClipboard text={orgId} />
            </div>
          </div>
        )}

        <DataTable
          resource="employee"
          columns={columns}
          endpoint={route(
            '/api/v1/employees?sort=id|desc',
            {}
          )}
          linkToCreate="/employees/create"
          bulkRoute="/api/v1/employees/bulk"
          onBulkActionCall={(selectedIds, act) => {
            setSelectedUserIds(selectedIds);
            setAction(act);
            setIsPasswordConfirmModalOpen(true);
          }}
          styleOptions={{
            tdClassName: 'py-4',
            withoutTdPadding: true,
          }}
          enableSavingFilterPreference
        />
      </Default>

      <PasswordConfirmation
        show={isPasswordConfirmModalOpen}
        onClose={setIsPasswordConfirmModalOpen}
        onSave={(password, isPasswordRequired) =>
          action && bulk(selectedUserIds, action, password, isPasswordRequired)
        }
        tableActions
      />
    </>
  );
}
