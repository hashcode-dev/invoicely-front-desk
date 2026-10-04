/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from 'classnames';
import { ReactNode } from 'react';
import { useColorScheme } from '$app/common/colors';
import { Link } from './forms';
import { House } from './icons/House';

export type Page = { name: string; href: string; afterName?: ReactNode };

export function Breadcrumbs(props: { pages: Page[] }) {
  if (props.pages.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <li>
          <Link
            to="/dashboard"
            withoutDefaultStyling
            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
            aria-label="Dashboard"
          >
            <House size="1rem" />
          </Link>
        </li>

        {props.pages.map((page, index) => {
          const isLast = index === props.pages.length - 1;
          return (
            <li key={page.name} className="flex items-center space-x-2">
              <span className="text-slate-300 dark:text-slate-600">/</span>

              <div
                className={classNames('flex items-center', {
                  'space-x-1.5': page.afterName,
                })}
              >
                <Link
                  to={page.href}
                  className={classNames('text-xs transition-colors', {
                    'text-slate-800 dark:text-slate-200 font-semibold cursor-default pointer-events-none':
                      isLast,
                    'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400':
                      !isLast,
                  })}
                  disableHoverUnderline
                >
                  {page.name}
                </Link>

                {page.afterName && <div>{page.afterName}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
