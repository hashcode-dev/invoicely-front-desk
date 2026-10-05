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
import { ChangeEvent } from 'react';
import CommonProps from '../../common/interfaces/common-props.interface';

interface Props extends CommonProps {
  options: {
    id: string;
    title: string;
    value: string | number | readonly string[] | undefined;
  }[];
  defaultSelected?: string;
  name: string;
  onValueChange?: (value: string) => unknown;
}

export function Radio(props: Props) {
  return (
    <fieldset>
      <legend className="sr-only">Notification method</legend>
      <div className="space-y-3 sm:flex sm:items-center sm:space-y-0 sm:space-x-8">
        {props.options.map((option) => (
          <div
            key={option.id}
            className="flex items-center"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              props.onValueChange?.(event.target.value)
            }
          >
            <input
              value={option.value}
              onClick={props.onClick}
              onChange={() => {}}
              disabled={props.disabled}
              id={option.id}
              name={props.name}
              type="radio"
              checked={option.value === props.defaultSelected}
              className="h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
            />

            <label
              htmlFor={option.id}
              className={classNames(
                'ml-2.5 block text-sm font-medium text-slate-700 dark:text-slate-200',
                {
                  'opacity-60 cursor-not-allowed': props.disabled,
                  'cursor-pointer':
                    typeof props.disabled === 'undefined' || !props.disabled,
                }
              )}
            >
              {option.title}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
