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
import { CSSProperties } from 'styled-components';
import { useColorScheme } from '$app/common/colors';

interface Props {
  style?: CSSProperties;
  leftSide?: ReactNode;
  leftSideHelp?: ReactNode;
  pushContentToRight?: boolean;
  required?: boolean;
  children?: ReactNode;
  className?: any;
  onClick?: () => unknown;
  noExternalPadding?: boolean;
  withoutItemsCenter?: boolean;
  withoutWrappingLeftSide?: boolean;
  disabledLabels?: boolean;
  noVerticalPadding?: boolean;
  twoGridColumns?: boolean;
  textVerticalAlign?: 'top' | 'middle' | 'bottom';
}

export function Element(props: Props) {
  const colors = useColorScheme();

  const { style } = props;

  return (
    <div
      className={classNames(
        `sm:grid sm:gap-8 flex flex-col lg:flex-row border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 transition-colors ${props.className || ''}`,
        {
          'px-5 sm:px-6': !props.noExternalPadding,
          'py-3.5 sm:py-4': !props.noVerticalPadding,
          'sm:items-center': !props.withoutItemsCenter,
          'sm:grid-cols-2': props.twoGridColumns,
          'sm:grid-cols-3': !props.twoGridColumns,
        }
      )}
      onClick={props.onClick}
      style={style}
    >
      <dt
        className={classNames('text-sm flex flex-col', {
          'opacity-60': props.disabledLabels,
          'h-full justify-start': props.textVerticalAlign === 'top',
        })}
      >
        <span
          className={classNames('font-semibold text-slate-800 dark:text-slate-200 text-sm', {
            'whitespace-nowrap': props.withoutWrappingLeftSide,
          })}
        >
          {props.leftSide}
          {props.required && <span className="ml-1 text-red-500 font-bold">*</span>}
        </span>
        {props.leftSideHelp &&
          (typeof props.leftSideHelp === 'object' ? (
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {props.leftSideHelp}
            </div>
          ) : (
            <span
              className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: props.leftSideHelp }}
            />
          ))}
      </dt>
      <dd
        className={classNames('mt-3 text-sm sm:mt-0', {
          'flex flex-col sm:flex-row sm:justify-end': props.pushContentToRight,
          'sm:col-span-1': props.twoGridColumns,
          'sm:col-span-2': !props.twoGridColumns,
        })}
      >
        {props.children}
      </dd>
    </div>
  );
}
