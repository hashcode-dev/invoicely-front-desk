import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useColorScheme } from '$app/common/colors';
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

export default function CreateEmployee() {
  useTitle('new_employee');

  const [t] = useTranslation();
  const colors = useColorScheme();
  const navigate = useNavigate();

  const currentUser = useCurrentUser();
  const currentAccount = useCurrentAccount();
  const orgId = currentUser?.organization_id || currentAccount?.id || '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pages = [
    { name: t('employees', 'Employees'), href: '/employees' },
    { name: t('new_employee', 'New Employee'), href: '/employees/create' },
  ];

  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const validationErrors: Record<string, string> = {};
    if (!email.trim()) {
      validationErrors.email = t('email_is_required', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      validationErrors.email = t('email_is_invalid', 'Email must be valid');
    }

    if (!password) {
      validationErrors.password = t('password_is_required', 'Password is required for employee login');
    } else if (password.length < 6) {
      validationErrors.password = t('password_too_short', 'Password must be at least 6 characters');
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    toast.processing();

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      is_admin: isAdmin,
      permissions: isAdmin ? -1 : 15,
      company_user: {
        is_admin: isAdmin,
        is_owner: false,
        permissions: isAdmin ? "-1" : "15",
      },
    };

    try {
      await request('POST', endpoint('/api/v1/employees'), payload);
      toast.success('created_user');
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
        // Fallback to /api/v1/users if needed
        try {
          await request('POST', endpoint('/api/v1/users?include=company_user'), payload);
          toast.success('created_user');
          navigate('/employees');
        } catch (innerError: any) {
          toast.error('error_title');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Default
      title={t('new_employee', 'New Employee')}
      breadcrumbs={pages}
      docsLink="/docs/advanced-settings/#user_management"
      onSaveClick={handleSave}
      disableSaveButton={isSubmitting}
      saveButtonLabel={t('create_employee', 'Create Employee')}
    >
      {orgId && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-zinc-800/80 border border-blue-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Organization Context
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
              This employee will be created under Organization ID{' '}
              <span className="font-mono font-semibold text-gray-900 dark:text-white">{orgId}</span>.
              Provide this ID and their credentials so they can log in via{' '}
              <span className="font-semibold text-gray-900 dark:text-white">Employee Login</span>.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-3 py-1.5 rounded-md font-mono text-sm text-gray-800 dark:text-gray-200 shadow-sm w-fit">
            <span className="select-all">{orgId}</span>
            <CopyToClipboard text={orgId} />
          </div>
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card
          title={t('employee_details', 'Employee Details')}
          className="shadow-sm pb-6"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
          withoutBodyPadding
          withoutHeaderBorder
        >
          <div className="p-6 space-y-4">
            <Element leftSide={t('first_name', 'First Name')} required>
              <InputField
                value={firstName}
                onValueChange={(val) => setFirstName(val)}
                errorMessage={errors.first_name}
                placeholder="e.g. Alex"
              />
            </Element>

            <Element leftSide={t('last_name', 'Last Name')}>
              <InputField
                value={lastName}
                onValueChange={(val) => setLastName(val)}
                errorMessage={errors.last_name}
                placeholder="e.g. Morgan"
              />
            </Element>

            <Element leftSide={t('email', 'Email Address')} required>
              <InputField
                type="email"
                value={email}
                onValueChange={(val) => setEmail(val)}
                errorMessage={errors.email}
                placeholder="employee@company.com"
              />
            </Element>

            <Element leftSide={t('phone', 'Phone Number')}>
              <InputField
                value={phone}
                onValueChange={(val) => setPhone(val)}
                errorMessage={errors.phone}
                placeholder="+1 555-0199"
              />
            </Element>

            <Element
              leftSide={t('password', 'Password')}
              leftSideHelp={t('employee_password_help', 'Required for the employee to sign in via Employee Login')}
              required
            >
              <div className="relative">
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onValueChange={(val) => setPassword(val)}
                  errorMessage={errors.password}
                  placeholder="Minimum 6 characters"
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
            <span>{t('create_employee', 'Create Employee')}</span>
          </Button>
        </div>
      </form>
    </Default>
  );
}
