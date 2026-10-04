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
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import { useColorScheme } from '$app/common/colors';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import CommonProps from '../../common/interfaces/common-props.interface';
import { Spinner } from '../Spinner';

interface Props extends CommonProps {
  children?: ReactNode;
  variant?: 'block';
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'minimal';
  onClick?: any;
  to?: string;
  behavior?: 'button' | 'submit';
  disableWithoutIcon?: boolean;
  noBackgroundColor?: boolean;
  form?: string;
}

const defaultProps: Props = {
  type: 'primary',
  behavior: 'submit',
};

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color} !important;
  background-color: ${(props) => props.theme.backgroundColor} !important;
  border-color: ${(props) => props.theme.borderColor} !important;
`;

const StyledButton = styled.button`
  color: ${(props) => props.theme.color} !important;
  border-color: ${(props) => props.theme.borderColor} !important;
  background-color: ${(props) => props.theme.backgroundColor} !important;

  &:hover {
    background-color: ${(props) => props.theme.hoverColor} !important;
  }
`;

export function Button(props: Props) {
  props = { ...defaultProps, ...props };

  const colors = useColorScheme();
  const accentColor = useAccentColor();

  const css: React.CSSProperties = {
    backgroundColor:
      props.type === 'primary'
        ? accentColor
        : props.noBackgroundColor
          ? 'transparent'
          : 'white',
    color:
      props.type !== 'primary' && props.type !== 'secondary' ? accentColor : '',
  };

  const getButtonClasses = () => {
    return classNames(
      `inline-flex items-center justify-center space-x-2 text-sm font-semibold rounded-xl transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ''}`,
      {
        'w-full': props.variant === 'block',
        'p-0 m-0 border-0 bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100':
          props.type === 'minimal',
        'min-h-[42px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow active:scale-[0.98] border border-transparent focus:ring-2 focus:ring-blue-500/40':
          props.type === 'primary',
        'min-h-[42px] px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs focus:ring-2 focus:ring-blue-500/20':
          props.type === 'secondary',
        'opacity-75 pointer-events-none': props.disabled && props.to,
      }
    );
  };

  if (props.to) {
    return (
      <Link
        to={props.to}
        className={getButtonClasses()}
        style={props.style}
      >
        {props.disabled && !props.disableWithoutIcon ? (
          <Spinner variant="light" />
        ) : (
          props.children
        )}
      </Link>
    );
  }

  return (
    <button
      type={props.behavior}
      disabled={props.disabled}
      className={getButtonClasses()}
      style={props.style}
      onClick={props.onClick}
      form={props.form}
    >
      {props.disabled && !props.disableWithoutIcon ? (
        <Spinner variant="light" />
      ) : (
        props.children
      )}
    </button>
  );
}

