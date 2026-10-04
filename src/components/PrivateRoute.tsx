/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Fallback } from '$app/components/Fallback';
import { useAuthenticated } from '../common/hooks/useAuthenticated';
import { RootState } from '../common/stores/store';

export function PrivateRoute() {
  const authenticated = useAuthenticated();
  const user = useSelector((state: RootState) => state.user);
  const demoSession = sessionStorage.getItem('invoicely_auth_user');

  if (demoSession || authenticated || user.user?.id) {
    return (
      <Fallback>
        <Outlet />
      </Fallback>
    );
  }

  return <Navigate to="/login" />;
}
