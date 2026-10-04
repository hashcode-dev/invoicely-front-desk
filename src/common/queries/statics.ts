/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useQuery } from '@tanstack/react-query';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { Statics } from '$app/common/interfaces/statics';
import { defaultStatics } from '../constants/default-statics';

export function useStaticsQuery() {
  return useQuery<Statics>({
    queryKey: ['/api/v1/statics'],

    queryFn: async () => {
      const token = localStorage.getItem('X-NINJA-TOKEN');
      if (token === 'demo-token') {
        return defaultStatics;
      }

      try {
        const response = await request('GET', endpoint('/api/v1/statics'));
        if (
          response.data &&
          typeof response.data === 'object' &&
          Array.isArray(response.data.currencies)
        ) {
          return response.data;
        }
        return defaultStatics;
      } catch {
        return defaultStatics;
      }
    },

    enabled: Boolean(localStorage.getItem('X-NINJA-TOKEN')),
    staleTime: Infinity,
  });
}

