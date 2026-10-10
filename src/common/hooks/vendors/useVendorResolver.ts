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
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { Vendor } from '$app/common/interfaces/vendor';

export function useVendorResolver() {
  const queryClient = useQueryClient();

  const find = (id: string) => {
    return queryClient.fetchQuery<Vendor>({
      queryKey: ['/api/v1/vendors', id],

      queryFn: () =>
        request('GET', endpoint('/api/v1/vendors/:id', { id }))
          .then((response) => response?.data?.data ?? ({} as Vendor))
          .catch(() => ({} as Vendor)),

      staleTime: Infinity,
    });
  };

  return { find };
}
