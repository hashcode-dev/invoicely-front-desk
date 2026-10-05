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
import CommonProps from '../../common/interfaces/common-props.interface';

interface Props extends CommonProps {
  for?: string;
  children: ReactNode;
}

export function InputLabel(props: Props) {
  return (
    <label
      className={`text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block ${
        props.className ?? ''
      }`}
      htmlFor={props.for}
    >
      {props.children}
    </label>
  );
}
