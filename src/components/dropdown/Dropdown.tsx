/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import {
  Children,
  cloneElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChevronDown } from 'react-feather';
import { useClickAway } from 'react-use';
import { styled } from 'styled-components';
import { useColorScheme } from '$app/common/colors';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import CommonProps from '../../common/interfaces/common-props.interface';
import { DropdownElement } from './DropdownElement';

interface Props extends CommonProps {
  label?: string | null;
  cardActions?: boolean;
  cypressRef?: string;
  /** When set, applied to the trigger control as data-cy (defaults to chevronDownButton). */
  triggerCypressRef?: string;
  customLabel?: ReactNode;
  minWidth?: string;
  maxWidth?: string;
  labelButtonBorderColor?: string;
}

const LabelButton = styled.button`
  color: ${(props) => props.theme.color} !important;
  background-color: ${(props) => props.theme.backgroundColor} !important;
  border-color: ${(props) => props.theme.borderColor} !important;
`;

const DropdownElements = styled.div`
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

export function Dropdown(props: Props) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const colors = useColorScheme();
  const accentColor = useAccentColor();

  const [children, setChildren] = useState<ReactNode>();

  const getPropsWithChildType = (
    childType: string | typeof DropdownElement,
    index: number
  ) => {
    if (childType === 'div') {
      return {
        onClick: () => setVisible(false),
        key: index,
      };
    } else {
      return { setVisible, key: index };
    }
  };

  useClickAway(ref, () => {
    visible && setVisible(false);
  });

  useEffect(() => {
    setChildren(Children.toArray(props.children));
  }, [props.children]);

  return (
    <div ref={ref}>
      <Tippy
        disabled={props.disabled}
        placement="bottom"
        interactive={true}
        render={() => (
          <DropdownElements
            theme={{ hoverColor: colors.$2 }}
            className={`rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 card-shadow py-1 focus:outline-none whitespace-normal ${props.className || ''}`}
            style={{
              minWidth: props.minWidth ?? '12rem',
              maxWidth: props.maxWidth ?? '14.7rem',
            }}
            data-cy={props.cypressRef}
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {children?.map((child, index: number) =>
              child &&
              (child['type'] == DropdownElement || child['type'] == 'div')
                ? cloneElement(
                    child,
                    getPropsWithChildType(child['type'], index)
                  )
                : child
            )}
          </DropdownElements>
        )}
        visible={visible}
      >
        {props.customLabel ? (
          <div
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              setVisible(!visible);
            }}
          >
            {props.customLabel}
          </div>
        ) : (
          <LabelButton
            theme={{
              backgroundColor: colors.$18,
              color: colors.$1,
              borderColor: props.labelButtonBorderColor || colors.$24,
            }}
            type="button"
            disabled={props.disabled}
            onClick={() => setVisible(!visible)}
            className={classNames(
              `border inline-flex items-center space-x-2 px-3.5 py-2 justify-center rounded-xl text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${props.className || ''}`,
              {
                'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800':
                  !props.cardActions,
                'hover:opacity-90 shadow-sm': props.cardActions,
              }
            )}
            style={{
              backgroundColor: props.cardActions ? accentColor : '',
              color: props.cardActions ? 'white' : '',
            }}
            data-cy={props.triggerCypressRef ?? 'chevronDownButton'}
          >
            {!props.cardActions && <span>{props.label}</span>}
            <ChevronDown size={props.cardActions ? 18 : 14} />
          </LabelButton>
        )}
      </Tippy>
    </div>
  );
}
