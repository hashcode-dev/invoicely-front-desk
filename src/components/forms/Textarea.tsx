/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import CommonProps from '../../common/interfaces/common-props.interface';
import { InputLabel } from './InputLabel';

interface Props extends CommonProps {
  label?: string;
  placeholder?: string;
  rows?: number | undefined;
}

export function Textarea(props: Props) {
  return (
    <section>
      {props.label && (
        <InputLabel className="mb-1.5" for={props.id}>
          {props.label}
        </InputLabel>
      )}

      <textarea
        rows={props.rows ?? 5}
        id={props.id}
        className={`form-textarea w-full min-h-[96px] py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${props.className || ''}`}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
      >
        {props.children}
      </textarea>
    </section>
  );
}
