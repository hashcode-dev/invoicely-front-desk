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
import {
  CSSProperties,
  FormEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useState,
} from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '$app/common/colors';
import { Element } from '$app/components/cards/Element';
import { Dropdown } from '$app/components/dropdown/Dropdown';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Spinner } from '$app/components/Spinner';
import { Button } from '../forms';
import { CardContainer } from '.';

export interface ButtonOption {
  text: string;
  onClick: (event: FormEvent<HTMLFormElement>) => unknown;
  icon?: ReactElement;
}

interface Props {
  children: ReactNode;
  title?: ReactNode | null;
  description?: string;
  withSaveButton?: boolean;
  additionalSaveOptions?: ButtonOption[];
  onFormSubmit?: (event: FormEvent<HTMLFormElement>) => unknown;
  onSaveClick?: (event: FormEvent<HTMLFormElement>) => unknown;
  saveButtonLabel?: string | null;
  disableSubmitButton?: boolean;
  disableWithoutIcon?: boolean;
  className?: string;
  withContainer?: boolean;
  style?: CSSProperties;
  withScrollableBody?: boolean;
  additionalAction?: ReactNode;
  isLoading?: boolean;
  withoutBodyPadding?: boolean;
  padding?: 'small' | 'regular';
  collapsed?: boolean;
  childrenClassName?: string;
  withoutHeaderBorder?: boolean;
  topRight?: ReactNode;
  height?: 'full';
  headerStyle?: CSSProperties;
  headerClassName?: string;
  withoutHeaderPadding?: boolean;
  innerRef?: RefObject<HTMLDivElement>;
}

export function Card(props: Props) {
  const [t] = useTranslation();

  const { padding = 'regular', height } = props;

  const [isCollapsed, setIsCollpased] = useState(props.collapsed);

  const colors = useColorScheme();

  return (
    <div
      ref={props.innerRef}
      className={classNames(
        `border rounded-2xl bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 card-shadow overflow-visible transition-shadow ${props.className ?? ''}`,
        {
          'overflow-y-auto': props.withScrollableBody,
          'h-full': height === 'full',
        }
      )}
      style={props.style}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onFormSubmit?.(e);
        }}
        className={classNames({ 'h-full': height === 'full' })}
      >
        {props.title && (
          <div
            className={classNames(
              'border-b border-slate-200 dark:border-slate-800',
              {
                'bg-white dark:bg-slate-900 sticky top-0 z-10': props.withScrollableBody,
                'px-4 sm:px-6 py-3':
                  padding === 'small' && !props.withoutHeaderPadding,
                'px-6 py-4.5 sm:py-5':
                  padding === 'regular' && !props.withoutHeaderPadding,
                'border-b-0': props.withoutHeaderBorder,
              },
              props.headerClassName
            )}
            onClick={() =>
              typeof props.collapsed !== 'undefined' &&
              setIsCollpased(!isCollapsed)
            }
            style={props.headerStyle}
          >
            <div
              className={classNames('flex items-center justify-between gap-4', {
                'cursor-pointer select-none':
                  typeof props.collapsed !== 'undefined',
              })}
            >
              <div>
                <h3
                  className={classNames('font-display font-bold text-slate-900 dark:text-slate-100 tracking-tight', {
                    'text-lg': padding === 'regular',
                    'text-base': padding === 'small',
                  })}
                >
                  {props.title}
                </h3>

                {props.description && (
                  <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{props.description}</p>
                )}
              </div>

              {props.topRight}

              {typeof props.collapsed !== 'undefined' && isCollapsed && (
                <ChevronDown className="text-slate-400" />
              )}

              {typeof props.collapsed !== 'undefined' && !isCollapsed && (
                <ChevronUp className="text-slate-400" />
              )}
            </div>
          </div>
        )}

        <div
          className={classNames(props.childrenClassName, {
            hidden: isCollapsed,
            'py-0': props.withoutBodyPadding,
            'p-6': padding === 'regular' && !props.withoutBodyPadding,
            'p-4': padding === 'small' && !props.withoutBodyPadding,
            'h-full': height === 'full',
          })}
        >
          {props.isLoading && <Element leftSide={<Spinner />} />}

          {props.withContainer ? (
            <CardContainer>{props.children}</CardContainer>
          ) : (
            props.children
          )}
        </div>

        {(props.withSaveButton || props.additionalAction) && (
          <div
            className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-b-2xl flex items-center justify-end space-x-3"
          >
            {props.additionalAction}

            {props.withSaveButton && !props.additionalSaveOptions && (
              <Button
                onClick={props.onSaveClick}
                disabled={props.disableSubmitButton}
                disableWithoutIcon={props.disableWithoutIcon}
              >
                {props.saveButtonLabel ?? t('save')}
              </Button>
            )}

            {props.withSaveButton && props.additionalSaveOptions && (
              <div className="flex">
                <Button
                  className="rounded-br-none rounded-tr-none px-3"
                  onClick={props.onSaveClick}
                  disabled={props.disableSubmitButton}
                  disableWithoutIcon={props.disableWithoutIcon}
                >
                  {props.saveButtonLabel ?? t('save')}
                </Button>

                <Dropdown
                  className="rounded-bl-none rounded-tl-none h-full px-1 border-l-1 border-y-0 border-r-0"
                  disabled={props.disableSubmitButton}
                  cardActions
                  labelButtonBorderColor={colors.$1}
                >
                  {props.additionalSaveOptions.map((action, i) => (
                    <DropdownElement
                      key={i}
                      icon={action.icon}
                      disabled={props.disableSubmitButton}
                      onClick={action.onClick}
                    >
                      {action.text}
                    </DropdownElement>
                  ))}
                </Dropdown>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );

}
