/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ReactNode } from 'react';

interface Props {
  label: string | ReactNode;
  helpLabel?: string | ReactNode | null;
  required?: boolean;
}

export function SettingsLabel(props: Props) {
  const { label, helpLabel, required } = props;

  return (
    <div className="flex flex-col text-sm">
      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {label}
        {required && <span className="ml-1 text-red-500 font-bold">*</span>}
      </span>

      {helpLabel && (
        <>
          {typeof helpLabel === 'string' ? (
            <span
              className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: helpLabel }}
            />
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {helpLabel}
            </div>
          )}
        </>
      )}
    </div>
  );
}
