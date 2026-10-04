/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { request } from '$app/common/helpers/request';
import { CompanyUser } from '$app/common/interfaces/company-user';
import {
  changeCurrentIndex,
  resetChanges,
  updateCompanyUsers,
} from '$app/common/stores/slices/company-users';
import { AuthenticationTypes } from '../dtos/authentication';
import { endpoint } from '../helpers';
import { authenticate } from '../stores/slices/user';
import { RootState } from '../stores/store';

import { defaultSettings } from '$app/common/constants/blank-company-settings';

export function useAuthenticated(): boolean {
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem('X-NINJA-TOKEN');
  const demoSession = sessionStorage.getItem('invoicely_auth_user');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      (demoSession || token === 'demo-token') &&
      (!user.authenticated || !user.user?.id || !(user.user as any)?.is_admin)
    ) {
      let parsedUser = { email: 'user@invoicely.com', name: 'Invoicely User' };
      try {
        if (demoSession) {
          parsedUser = JSON.parse(demoSession);
        }
      } catch {}

      const mockCompany = {
        id: 'demo-company-id',
        size_id: '1',
        industry_id: '1',
        is_disabled: false,
        settings: {
          ...defaultSettings,
          name: 'Invoicely Workspace',
          currency_id: '1',
          country_id: '840',
          language_id: '1',
          timezone_id: '1',
          date_format_id: '1',
          military_time: false,
          enable_rappen_rounding: false,
          show_currency_code: false,
          e_invoice_type: '',
          email: parsedUser.email || 'user@invoicely.com',
          website: 'https://invoicely.com',
          phone: '+1 (555) 019-2834',
          address1: '100 Innovation Way',
          address2: 'Suite 400',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94105',
          vat_number: '',
          id_number: '',
          payment_terms: '30',
        },
        currencies: [],
        custom_fields: {},
        enabled_tax_rates: 0,
        enabled_item_tax_rates: 0,
        enable_product_discount: false,
        mark_expenses_paid: false,
        mark_expenses_invoiceable: false,
        invoice_expense_documents: false,
        convert_expense_currency: false,
        custom_surcharge_taxes1: false,
        custom_surcharge_taxes2: false,
        custom_surcharge_taxes3: false,
        custom_surcharge_taxes4: false,
        portal_domain: '',
        enable_product_cost: false,
        enable_product_quantity: false,
        show_task_end_date: false,
        auto_start_tasks: false,
        use_quote_terms_on_conversion: false,
        enable_applying_payments: false,
        enabled_expense_tax_rates: 0,
        stock_notification: false,
        invoice_task_lock: false,
        invoice_task_hours: false,
        invoice_task_project: false,
        track_inventory: false,
        stop_on_unpaid_recurring: false,
        enabled_modules: 0,
        calculate_taxes: false,
        tax_data: null,
        e_invoice_certificate: '',
        e_invoice_passphrase: '',
        has_e_invoice_certificate: false,
        has_e_invoice_certificate_passphrase: false,
        default_password_timeout: 0,
        default_quantity: false,
        subdomain: '',
        client_can_register: false,
        invoice_task_item_description: false,
        show_tasks_table: false,
        invoice_task_datelog: false,
        invoice_task_timelog: false,
        invoice_task_locked: false,
        invoice_task_documents: false,
        oauth_password_required: false,
        first_month_of_year: '1',
        company_key: 'demo-company-key',
        fill_products: false,
        convert_products: false,
        bank_integrations: [],
        documents: [],
        calculate_expense_tax_by_amount: false,
        expense_inclusive_taxes: false,
        smtp_host: '',
        smtp_port: '',
        smtp_encryption: '',
        smtp_username: '',
        smtp_password: '',
        smtp_local_domain: '',
        smtp_verify_peer: false,
        legal_entity_id: null,
      };

      const mockUserObj = {
        id: 'demo-user-id',
        first_name: parsedUser.name || 'User',
        last_name: '',
        email: parsedUser.email || 'user@invoicely.com',
        account: { default_company_id: 'demo-company-id' },
        permissions: '',
        is_admin: true,
        is_owner: true,
      };

      const mockCompanyUser = {
        company: mockCompany,
        user: mockUserObj,
        account: { default_company_id: 'demo-company-id' },
        notifications: { email: [] },
        permissions: '',
        is_admin: true,
        is_owner: true,
        is_locked: false,
        settings: {
          accent_color: '#004bca',
        },
        react_settings: {} as any,
      };

      dispatch(
        authenticate({
          type: AuthenticationTypes.TOKEN,
          user: mockUserObj as any,
          token: token || 'demo-token',
        })
      );

      dispatch(updateCompanyUsers([mockCompanyUser]));
      dispatch(changeCurrentIndex(0));
    }
  }, [demoSession, token, user.authenticated, user.user?.id, dispatch]);


  if (demoSession || token === 'demo-token') {
    return true;
  }

  if (token === null) {
    return false;
  }

  if (user.authenticated) {
    return true;
  }

  queryClient
    .fetchQuery({
      queryKey: ['/api/v1/refresh'],
      queryFn: () =>
        request(
          'POST',
          endpoint('/api/v1/refresh?updated_at=:updatedAt', {
            updatedAt: dayjs().unix(),
          })
        ).then((response) => {
          let currentIndex = 0;

          if (localStorage.getItem('X-CURRENT-INDEX')) {
            currentIndex = parseInt(
              localStorage.getItem('X-CURRENT-INDEX') || '0'
            );
          } else {
            const companyUsers: CompanyUser[] = response.data.data;
            const defaultCompanyId = companyUsers[0].account.default_company_id;

            currentIndex =
              companyUsers.findIndex(
                (companyUser) => companyUser.company.id === defaultCompanyId
              ) || 0;
          }

          if (currentIndex === -1) {
            currentIndex = 0;
          }

          dispatch(
            authenticate({
              type: AuthenticationTypes.TOKEN,
              user: response.data.data[currentIndex].user,
              token: localStorage.getItem('X-NINJA-TOKEN') as string,
            })
          );

          dispatch(updateCompanyUsers(response.data.data));
          dispatch(resetChanges('company'));
          dispatch(changeCurrentIndex(currentIndex));

          queryClient.invalidateQueries({
            queryKey: ['/api/docuninja/login'],
          });

          return response;
        }),
    })
    .catch((e) => {
      console.error(e);
      localStorage.removeItem('X-NINJA-TOKEN');
      navigate('/login');
    });

  return true;
}
