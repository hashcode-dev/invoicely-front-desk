/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isEmployeeUser } from '$app/common/hooks/useIsEmployee';
import { Guard } from '../Guard';

export function admin(): Guard {
  return ({ companyUser }) => {
    if (isEmployeeUser(companyUser)) {
      return Promise.resolve(false);
    }
    return Promise.resolve(Boolean(companyUser?.is_admin));
  };
}

export function owner(): Guard {
  return ({ companyUser }) => {
    if (isEmployeeUser(companyUser)) {
      return Promise.resolve(false);
    }
    return Promise.resolve(Boolean(companyUser?.is_owner));
  };
}

export function organization(): Guard {
  return ({ companyUser }) => {
    if (isEmployeeUser(companyUser)) {
      return Promise.resolve(false);
    }
    if (companyUser?.is_admin || companyUser?.is_owner) {
      return Promise.resolve(true);
    }
    try {
      const session = typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem('invoicely_auth_user')
        : null;
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.role === 'organization' || parsed.role === 'admin' || parsed.role === 'owner') {
          return Promise.resolve(true);
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return Promise.resolve(false);
  };
}

