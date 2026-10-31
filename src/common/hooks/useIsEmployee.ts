import { CompanyUser } from '$app/common/interfaces/company-user';
import { useCurrentCompanyUser } from './useCurrentCompanyUser';

export function isEmployeeUser(companyUser?: CompanyUser | null): boolean {
  if (
    (companyUser as any)?.is_employee === true ||
    (companyUser as any)?.user?.is_employee === true ||
    (companyUser as any)?.role === 'employee' ||
    (companyUser as any)?.user?.role === 'employee'
  ) {
    return true;
  }

  try {
    const session = typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('invoicely_auth_user')
      : null;
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.role === 'employee' || parsed.is_employee === true) {
        return true;
      }
    }
  } catch {
    // Ignore JSON parse errors in tests / SSR
  }

  return false;
}

export function useIsEmployee(): boolean {
  const companyUser = useCurrentCompanyUser();
  return isEmployeeUser(companyUser);
}
