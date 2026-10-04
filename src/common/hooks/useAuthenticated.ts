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

export function useAuthenticated(): boolean {
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem('X-NINJA-TOKEN');
  const demoSession = sessionStorage.getItem('invoicely_auth_user');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if ((demoSession || token === 'demo-token') && (!user.authenticated || !user.user?.id)) {
      let parsedUser = { email: 'user@invoicely.com', name: 'Invoicely User' };
      try {
        if (demoSession) {
          parsedUser = JSON.parse(demoSession);
        }
      } catch {}

      const mockCompany = {
        id: 'demo-company-id',
        is_disabled: false,
        settings: {
          name: 'Invoicely Workspace',
          currency_id: '1',
          country_id: '840',
          language_id: '1',
          timezone_id: '1',
          date_format_id: '1',
          e_invoice_type: '',
        },
        currencies: [],
      };

      const mockUserObj = {
        id: 'demo-user-id',
        first_name: parsedUser.name || 'User',
        last_name: '',
        email: parsedUser.email || 'user@invoicely.com',
        account: { default_company_id: 'demo-company-id' },
        permissions: '',
      };

      const mockCompanyUser = {
        company: mockCompany,
        user: mockUserObj,
        account: { default_company_id: 'demo-company-id' },
        notifications: { email: [] },
        permissions: '',
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
