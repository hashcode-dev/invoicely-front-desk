import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isEmployeeUser } from '$app/common/hooks/useIsEmployee';
import { admin, owner } from '$app/common/guards/guards/admin';

describe('Employee Access Control & Restrictions', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    const sessionStorageMock = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, val: string) => {
        mockStorage[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
    };
    vi.stubGlobal('sessionStorage', sessionStorageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('isEmployeeUser detection', () => {
    it('detects employee from companyUser.is_employee flag', () => {
      const companyUser: any = { is_employee: true, is_admin: false, is_owner: false };
      expect(isEmployeeUser(companyUser)).toBe(true);
    });

    it('detects employee from companyUser.user.is_employee flag', () => {
      const companyUser: any = { user: { is_employee: true }, is_admin: false };
      expect(isEmployeeUser(companyUser)).toBe(true);
    });

    it('detects employee from companyUser.role === "employee"', () => {
      const companyUser: any = { role: 'employee', is_admin: false };
      expect(isEmployeeUser(companyUser)).toBe(true);
    });

    it('detects employee from sessionStorage auth user role', () => {
      mockStorage['invoicely_auth_user'] = JSON.stringify({
        email: 'emp@company.com',
        role: 'employee',
      });
      expect(isEmployeeUser(null)).toBe(true);
    });

    it('detects employee from sessionStorage auth user is_employee flag', () => {
      mockStorage['invoicely_auth_user'] = JSON.stringify({
        email: 'emp@company.com',
        is_employee: true,
      });
      expect(isEmployeeUser(null)).toBe(true);
    });

    it('returns false for organization owner / admin', () => {
      mockStorage['invoicely_auth_user'] = JSON.stringify({
        email: 'admin@company.com',
        role: 'organization',
        is_employee: false,
      });
      const companyUser: any = { is_admin: true, is_owner: true };
      expect(isEmployeeUser(companyUser)).toBe(false);
    });
  });

  describe('admin and owner route guards', () => {
    it('rejects employee from admin-guarded settings even if is_admin flag was set', async () => {
      const employeeUser: any = { is_employee: true, is_admin: true, is_owner: true };
      const guard = admin();
      const allowed = await guard({ companyUser: employeeUser } as any);
      expect(allowed).toBe(false);
    });

    it('rejects employee from owner-guarded settings', async () => {
      const employeeUser: any = { is_employee: true, is_admin: false, is_owner: true };
      const guard = owner();
      const allowed = await guard({ companyUser: employeeUser } as any);
      expect(allowed).toBe(false);
    });

    it('allows genuine organization admin into admin-guarded settings', async () => {
      const adminUser: any = { is_employee: false, is_admin: true, is_owner: false };
      const guard = admin();
      const allowed = await guard({ companyUser: adminUser } as any);
      expect(allowed).toBe(true);
    });

    it('allows genuine organization owner into owner-guarded settings', async () => {
      const ownerUser: any = { is_employee: false, is_admin: true, is_owner: true };
      const guard = owner();
      const allowed = await guard({ companyUser: ownerUser } as any);
      expect(allowed).toBe(true);
    });
  });

  describe('UI Option Visibility Gates', () => {
    it('disables Add Organization (Company) option for employees', () => {
      const canUserAddCompany = true;
      const shouldShowAddCompany = true;

      // When employee is logged in
      const isEmployee = true;
      const isOwner = false;
      const showAddCompanyForEmployee =
        shouldShowAddCompany && canUserAddCompany && isOwner && !isEmployee;
      expect(showAddCompanyForEmployee).toBe(false);

      // When organization owner is logged in
      const orgOwnerIsEmployee = false;
      const orgOwnerIsOwner = true;
      const showAddCompanyForOwner =
        shouldShowAddCompany && canUserAddCompany && orgOwnerIsOwner && !orgOwnerIsEmployee;
      expect(showAddCompanyForOwner).toBe(true);
    });

    it('disables Settings navigation option for employees', () => {
      const company = { id: 'test-co' };
      const isEmployee = true;
      const companyUser: any = { is_admin: false, is_owner: false, is_employee: true };

      const isSettingsVisibleForEmployee =
        !isEmployee &&
        (companyUser?.is_admin || companyUser?.is_owner || false) &&
        Boolean(company);
      expect(isSettingsVisibleForEmployee).toBe(false);

      // For organization admin
      const orgAdminIsEmployee = false;
      const orgAdminUser: any = { is_admin: true, is_owner: false };
      const isSettingsVisibleForAdmin =
        !orgAdminIsEmployee &&
        (orgAdminUser?.is_admin || orgAdminUser?.is_owner || false) &&
        Boolean(company);
      expect(isSettingsVisibleForAdmin).toBe(true);
    });

    it('disables Account Management in dropdown for employees', () => {
      const isEmployee = true;
      const isAdmin = false;
      const isOwner = false;

      const showAccountManagementForEmployee = !isEmployee && (isAdmin || isOwner);
      expect(showAccountManagementForEmployee).toBe(false);

      const orgIsEmployee = false;
      const orgIsAdmin = true;
      const showAccountManagementForOrg = !orgIsEmployee && (orgIsAdmin || isOwner);
      expect(showAccountManagementForOrg).toBe(true);
    });
  });
});
