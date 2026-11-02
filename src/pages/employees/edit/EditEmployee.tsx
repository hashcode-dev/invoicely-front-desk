import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentAccount } from '$app/common/hooks/useCurrentAccount';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useTitle } from '$app/common/hooks/useTitle';
import { Card, Element } from '$app/components/cards';
import { Default } from '$app/components/layouts/Default';
import { Button, InputField } from '$app/components/forms';
import Toggle from '$app/components/forms/Toggle';
import { CopyToClipboard } from '$app/components/CopyToClipboard';
import { Eye, EyeOff } from 'react-feather';

export default function EditEmployee() {
  useTitle('edit_employee');

  const { id } = useParams<{ id: string }>();
  const [t] = useTranslation();
  const navigate = useNavigate();

  const currentUser = useCurrentUser();
  const currentAccount = useCurrentAccount();
  const orgId = currentUser?.organization_id || currentAccount?.id || 'demo-workspace-01';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pages = [
    { name: t('employees', 'Employees'), href: '/employees' },
    { name: t('edit_employee', 'Edit Employee'), href: `/employees/${id}/edit` },
  ];

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    request('GET', endpoint(`/api/v1/users/${id}`))
      .then((res) => {
        const data = res.data.data;
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setIsAdmin(data.company_user?.is_admin || data.is_admin || false);
      })
      .catch(() => {
        toast.error('error_title');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrors({});
    setIsSubmitting(true);
    toast.processing();

    const permissions = isAdmin
      ? 'admin'
      : 'view_all,create_invoice,view_invoice,view_client';

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      ...(password ? { password } : {}),
      is_admin: isAdmin,
      permissions,
      company_user: {
        is_admin: isAdmin,
        is_owner: false,
        permissions,
      },
    };

    try {
      await request('PUT', endpoint(`/api/v1/users/${id}`), payload);
      toast.success('updated_user');
      navigate('/employees');
    } catch (error: any) {
      if (error?.response?.status === 422) {
        const backendErrors = error.response.data?.errors || {};
        const formatted: Record<string, string> = {};
        for (const [key, val] of Object.entries(backendErrors)) {
          formatted[key] = Array.isArray(val) ? val[0] : String(val);
        }
        setErrors(formatted);
        toast.dismiss();
      } else {
        toast.error('error_title');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Default title={t('edit_employee', 'Edit Employee')} breadcrumbs={pages}>
        <div className="p-8 text-center text-gray-500">Loading employee details...</div>
      </Default>
    );
  }

  return (
    <Default
      title={t('edit_employee', 'Edit Employee')}
      breadcrumbs={pages}
      docsLink="/docs/advanced-settings/#user_management"
    >
      {orgId && (
        <div className="mb-6 p-4 rounded-xl bg-surface-low dark:bg-slate-900/60 border border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              Organization Context
            </p>
            <p className="text-sm text-text-muted dark:text-slate-300 mt-0.5">
              Employee ID: <span className="font-mono font-semibold text-text dark:text-white">{id}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-surface-high dark:bg-slate-800 border border-outline-variant px-3 py-1.5 rounded-lg font-mono text-sm text-text dark:text-slate-200 shadow-sm w-fit">
            <span className="select-all">{orgId}</span>
            <CopyToClipboard text={orgId} />
          </div>
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card
          title={t('employee_details', 'Employee Details')}
          className="shadow-sm pb-6 border border-outline-variant rounded-xl"
          withoutBodyPadding
          withoutHeaderBorder
        >
          <div className="p-6 space-y-4">
            <Element leftSide={t('first_name', 'First Name')} required>
              <InputField
                value={firstName}
                onValueChange={(val) => setFirstName(val)}
                errorMessage={errors.first_name}
              />
            </Element>

            <Element leftSide={t('last_name', 'Last Name')}>
              <InputField
                value={lastName}
                onValueChange={(val) => setLastName(val)}
                errorMessage={errors.last_name}
              />
            </Element>

            <Element leftSide={t('email', 'Email Address')}>
              <InputField
                type="email"
                value={email}
                disabled
                onValueChange={(val) => setEmail(val)}
                errorMessage={errors.email}
              />
            </Element>

            <Element leftSide={t('phone', 'Phone Number')}>
              <InputField
                value={phone}
                onValueChange={(val) => setPhone(val)}
                errorMessage={errors.phone}
              />
            </Element>

            <Element
              leftSide={t('password', 'Reset Password')}
              leftSideHelp={t('employee_reset_password_help', 'Leave blank to keep the current password')}
            >
              <div className="relative">
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onValueChange={(val) => setPassword(val)}
                  placeholder="Enter new password (optional)"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Element>

            <Element
              leftSide={t('administrator', 'Administrator Access')}
              leftSideHelp={t('employee_admin_help', 'Grant full administrative permissions within this workspace')}
            >
              <Toggle
                checked={isAdmin}
                onChange={(val) => setIsAdmin(val)}
              />
            </Element>
          </div>
        </Card>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="secondary" onClick={() => navigate('/employees')}>
            <span>{t('cancel', 'Cancel')}</span>
          </Button>
          <Button type="primary" onClick={handleSave} disabled={isSubmitting}>
            <span>{t('save', 'Save')}</span>
          </Button>
        </div>
      </form>
    </Default>
  );
}
