/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { isHosted } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { useCurrentAccount } from '$app/common/hooks/useCurrentAccount';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useTitle } from '$app/common/hooks/useTitle';
import { User } from '$app/common/interfaces/user';
import { useBulk } from '$app/common/queries/users';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { CopyToClipboard } from '$app/components/CopyToClipboard';
import { Link } from '$app/components/forms';
import { Settings } from '$app/components/layouts/Settings';
import { PasswordConfirmation } from '$app/components/PasswordConfirmation';
import { UsersPlanAlert } from '../common/components/UsersPlanAlert';

export function Users() {
  useTitle('user_management');

  const currentUser = useCurrentUser();
  const currentAccount = useCurrentAccount();
  const orgId = currentUser?.organization_id || currentAccount?.id || '';

  const [t] = useTranslation();

  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState<boolean>(false);
  const [action, setAction] = useState<'archive' | 'restore' | 'delete'>();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const bulk = useBulk({ setIsPasswordConfirmModalOpen });

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('user_management'), href: '/settings/users' },
  ];

  const columns: DataTableColumns<User> = [
    {
      id: 'name',
      label: 'name',
      format: (_, resource) => (
        <Link to={route('/settings/users/:id/edit', { id: resource.id })}>
          {resource.first_name} {resource.last_name}
        </Link>
      ),
    },
    { id: 'email', label: 'email' },
    {
      id: 'id',
      label: 'user_id',
      format: (id) => (
        <span className="font-mono text-xs text-gray-500">{id}</span>
      ),
    },
  ];

  return (
    <>
      <Settings
        title={t('user_details')}
        breadcrumbs={pages}
        docsLink="/docs/advanced-settings/#user_management"
      >
        {!enterprisePlan() && isHosted() && <UsersPlanAlert />}

        {orgId && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-zinc-800/80 border border-blue-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Organization ID
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                Share this Organization ID with team members to let them sign in via{' '}
                <span className="font-semibold text-gray-900 dark:text-white">Employee Login</span>.
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-3 py-1.5 rounded-md font-mono text-sm text-gray-800 dark:text-gray-200 shadow-sm w-fit">
              <span className="select-all">{orgId}</span>
              <CopyToClipboard text={orgId} />
            </div>
          </div>
        )}

        <DataTable
          resource="user"
          columns={columns}
          endpoint={route(
            '/api/v1/users?hideOwnerUsers=true&without=:userId&sort=id|desc&status=active',
            {
              userId: currentUser?.id,
            }
          )}
          linkToCreate="/settings/users/create"
          bulkRoute="/api/v1/users/bulk"
          onBulkActionCall={(selectedUserIds, action) => {
            setSelectedUserIds(selectedUserIds);
            setAction(action);
            setIsPasswordConfirmModalOpen(true);
          }}
          styleOptions={{
            tdClassName: 'py-4',
            withoutTdPadding: true,
          }}
          enableSavingFilterPreference
        />
      </Settings>

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
