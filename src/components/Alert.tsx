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
import { useState } from 'react';
import { X } from 'react-feather';
import { useColorScheme } from '$app/common/colors';
import CommonProps from '../common/interfaces/common-props.interface';

interface Props extends CommonProps {
  type?: string | 'success' | 'warning' | 'danger';
  disableClosing?: boolean;
}

export function Alert(props: Props) {
  const [visible, setVisible] = useState<boolean>(true);

  if (!visible) {
    return null;
  }

  const type = props.type || 'info';

  const typeStyles = {
    danger:
      'border-red-200 dark:border-red-900/60 bg-red-50/90 dark:bg-red-950/40 text-red-800 dark:text-red-200',
    warning:
      'border-amber-200 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200',
    success:
      'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200',
    info:
      'border-blue-200 dark:border-blue-900/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200',
  }[type] || 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200';

  return (
    <div
      role="alert"
      className={classNames(
        `rounded-xl border p-4 text-sm font-medium transition-all shadow-xs ${typeStyles}`,
        props.className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 break-words leading-relaxed">
          {props.children}
        </div>

        {!props.disableClosing && (
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500/30 -mr-1 -mt-1"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
