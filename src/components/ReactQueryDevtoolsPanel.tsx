/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2026. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React, { lazy, Suspense } from 'react';

const ReactQueryDevtools: React.ComponentType<any> = lazy(() =>
  import('@tanstack/react-query-devtools').then((module: any) => ({
    default: module.ReactQueryDevtools,
  }))
);

export function shouldMountReactQueryDevtools(): boolean {
  return import.meta.env.DEV;
}

export function ReactQueryDevtoolsPanel() {
  if (!shouldMountReactQueryDevtools()) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} />
    </Suspense>
  );
}
