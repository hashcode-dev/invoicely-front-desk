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
import { merge } from 'lodash';
import React, { CSSProperties, isValidElement, ReactNode } from 'react';
import Select, { StylesConfig } from 'react-select';
import { useColorScheme } from '$app/common/colors';
import CommonProps from '../../common/interfaces/common-props.interface';
import { SelectOption } from '../datatables/Actions';
import { ErrorMessage } from '../ErrorMessage';
import { ChevronDown } from '../icons/ChevronDown';
import { InputLabel } from '.';

export interface SelectProps extends CommonProps {
  defaultValue?: any;
  label?: string | null;
  required?: boolean;
  withBlank?: boolean;
  onValueChange?: (value: string) => unknown;
  errorMessage?: string | string[];
  blankOptionValue?: string | number;
  customSelector?: boolean;
  dismissable?: boolean;
  clearAfterSelection?: boolean;
  menuPosition?: 'fixed';
  searchable?: boolean;
  controlIcon?: ReactNode;
  controlStyle?: CSSProperties;
  applyCustomDropdownIndicator?: boolean;
  dropdownIndicatorClassName?: string;
  withoutDropdownIndicatorPadding?: boolean;
  withoutControlPadding?: boolean;
  controlClassName?: string;
  placeholder?: string | null;
  readOnly?: boolean;
}

export function SelectField(props: SelectProps) {
  const colors = useColorScheme();

  const {
    blankOptionValue,
    withBlank,
    children,
    value,
    defaultValue,
    customSelector,
    onValueChange,
    className,
    disabled,
    cypressRef,
    dismissable = true,
    clearAfterSelection,
    searchable = true,
    controlIcon,
    controlStyle,
    dropdownIndicatorClassName,
    withoutDropdownIndicatorPadding = false,
    withoutControlPadding = false,
    controlClassName,
    readOnly,
  } = props;

  const blankEntry: ReactNode = (
    <option value={blankOptionValue ?? ''}></option>
  );

  const $entries = React.Children.map(
    [withBlank ? blankEntry : [], children],
    (child) =>
      isValidElement(child) && {
        label: Array.isArray(child.props.children)
          ? child.props.children.join('')
          : child.props.children,
        value: child.props.value,
      }
  );

  const selectedEntry = $entries?.find((entry) => entry.value === value);
  const defaultEntry = $entries?.find((entry) => entry.value === defaultValue);

  const customStyles: StylesConfig<SelectOption, false> = {
    input: (styles) => {
      return merge(styles, {
        color: colors.$3,
      });
    },
    singleValue: (styles) => {
      return merge(styles, {
        color: colors.$3,
      });
    },
    control: (base, { isDisabled, isFocused }) => {
      return merge(base, {
        borderRadius: '0.75rem',
        minHeight: '42px',
        backgroundColor: colors.$1,
        color: colors.$3,
        borderColor: isFocused ? '#0061ff' : '#cbd5e1',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        pointerEvents: readOnly ? 'none' : isDisabled ? 'auto' : 'unset',
        boxShadow: isFocused ? '0 0 0 2px rgba(0, 97, 255, 0.25)' : 'none',
        '&:hover': {
          borderColor: isFocused ? '#0061ff' : '#94a3b8',
        },
        ...controlStyle,
      });
    },
    menu: (base) => {
      return merge(base, {
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow:
          '0 10px 25px -5px rgba(11, 28, 48, 0.1), 0 8px 10px -6px rgba(11, 28, 48, 0.05)',
        border: '1px solid #e2e8f0',
        backgroundColor: colors.$1,
        zIndex: 50,
      });
    },
    option: (base, { isSelected, isFocused }) => {
      return merge(base, {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 14px',
        color: isSelected ? '#004bca' : '#0b1c30',
        backgroundColor: isSelected ? '#eff4ff' : isFocused ? '#f8f9ff' : 'transparent',
        ':hover': {
          backgroundColor: '#eff4ff',
          color: '#004bca',
        },
        minHeight: '2.25rem',
      });
    },
    indicatorSeparator: () => {
      return {
        display: 'none',
      };
    },
  };

  return (
    <div className={classNames({ 'space-y-1.5': Boolean(customSelector) })}>
      {props.label && (
        <InputLabel className="mb-1" for={props.id}>
          {props.label}
          {props.required && <span className="ml-1 text-red-600">*</span>}
        </InputLabel>
      )}

      {!customSelector ? (
        <select
          onChange={(event) => {
            props.onValueChange && props.onValueChange(event.target.value);
            props.onChange && props.onChange(event);
          }}
          id={props.id}
          className={classNames(
            `w-full min-h-[42px] px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all disabled:cursor-not-allowed ${props.className ?? ''}`
          )}
          defaultValue={props.defaultValue}
          value={props.value}
          ref={props.innerRef}
          disabled={props.disabled}
          data-cy={props.cypressRef}
        >

          {props.withBlank && (
            <option value={props.blankOptionValue ?? ''}></option>
          )}
          {props.children}
        </select>
      ) : (
        <Select
          className={classNames(className, { 'pointer-events-none': readOnly })}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          options={$entries}
          placeholder={props.placeholder}
          defaultValue={defaultEntry}
          value={clearAfterSelection ? { label: '', value: '' } : selectedEntry}
          onChange={(v) => {
            if (!v) {
              return onValueChange?.((blankOptionValue as string) ?? '');
            }

            return onValueChange?.((v as SelectOption).value as string);
          }}
          menuPosition={props.menuPosition}
          isDisabled={disabled}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          styles={customStyles}
          isSearchable={searchable}
          isClearable={Boolean(
            dismissable &&
              selectedEntry?.value &&
              selectedEntry?.value !== blankOptionValue
          )}
          blurInputOnSelect
          data-cy={cypressRef}
          components={{
            ...((controlIcon || props.menuPosition !== 'fixed') && {
              Control: ({ children: controlChildren, ...rest }) => (
                <div
                  className={classNames(
                    'flex items-center rounded-md border cursor-pointer',
                    {
                      'pl-2': controlIcon && !withoutControlPadding,
                      'pl-1': !controlIcon && !withoutControlPadding,
                      'pointer-events-none': readOnly,
                    },
                    controlClassName
                  )}
                  style={{
                    height: '2.5rem',
                    backgroundColor: colors.$1,
                    borderColor: rest.isFocused ? colors.$3 : colors.$24,
                    ...controlStyle,
                  }}
                  {...rest.innerProps}
                >
                  {controlIcon}
                  {controlChildren}
                </div>
              ),
            }),

            DropdownIndicator: () => (
              <div
                className={classNames(
                  'flex items-center justify-center hover:opacity-75 h-full w-full',
                  { 'px-3': !withoutDropdownIndicatorPadding },
                  dropdownIndicatorClassName
                )}
                style={{ color: colors.$3 }}
              >
                <ChevronDown color={colors.$3} size="1rem" />
              </div>
            ),
          }}
        />
      )}

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </div>
  );
}
