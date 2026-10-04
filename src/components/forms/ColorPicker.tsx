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
import { ReactNode, useEffect, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';
import { MdDone } from 'react-icons/md';
import { useDebounce } from 'react-use';
import { useColorScheme } from '$app/common/colors';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { Modal } from '$app/components/Modal';
import { Icon } from '../icons/Icon';
import { Button } from './Button';

interface Props {
  value?: string;
  onValueChange?: (color: string) => unknown;
  disabled?: boolean;
  includeDefaultPalette?: boolean;
  renderLabelBox?: (color: string) => ReactNode;
}

const DEFAULT_COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2f7dc3',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
  '#616161',
  '#000000',
  '#57a6e4',
  '#324da1',
  '#4c9a1c',
  '#cd8900',
  '#b93700',
];

export function ColorPicker(props: Props) {
  const { t } = useTranslation();

  const { includeDefaultPalette, renderLabelBox } = props;

  const colors = useColorScheme();
  const reactSettings = useReactSettings();

  const [color, setColor] = useState(props.value || '#000000');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDefaultPaletteModalOpen, setIsDefaultPaletteModalOpen] =
    useState<boolean>(false);

  useDebounce(() => props.onValueChange?.(color), 500, [color]);

  useEffect(() => {
    props.value && setColor(props.value);
  }, [props.value]);

  return (
    <div>
      <Modal
        title={t('color')}
        visible={isModalOpen}
        onClose={setIsModalOpen}
        centerContent
        disableClosing={isDefaultPaletteModalOpen}
        size="micro"
      >
        <div className="flex flex-col space-y-2 w-full">
          <HexColorPicker
            color={color}
            onChange={setColor}
            style={{ width: '100%' }}
          />

          <HexColorInput
            color={color}
            onChange={setColor}
            className="w-full min-h-[42px] px-3.5 py-2 my-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30 transition-all"
          />

          <div className="flex w-full justify-between">
            {includeDefaultPalette && (
              <Button
                behavior="button"
                type="secondary"
                onClick={() => setIsDefaultPaletteModalOpen(true)}
              >
                {t('default')}
              </Button>
            )}

            <Button
              className={classNames({ 'w-full': !includeDefaultPalette })}
              behavior="button"
              onClick={() => setIsModalOpen(false)}
            >
              {t('done')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={t('default')}
        visible={isDefaultPaletteModalOpen}
        size="small"
        onClose={() => setIsDefaultPaletteModalOpen(false)}
      >
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-6 gap-x-2 gap-y-2">
            {DEFAULT_COLORS.map((defaultColor) => (
              <div
                key={defaultColor}
                className="relative cursor-pointer w-full rounded-lg shadow-xs hover:scale-105 transition-transform overflow-hidden"
                onClick={() => setColor(defaultColor)}
                style={{ height: 32, backgroundColor: defaultColor }}
              >
                {color === defaultColor && (
                  <Icon
                    className="absolute"
                    element={MdDone}
                    color="white"
                    size={22}
                    style={{ top: '0.3rem', left: '1.25rem' }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              behavior="button"
              onClick={() => setIsDefaultPaletteModalOpen(false)}
            >
              {t('done')}
            </Button>
          </div>
        </div>
      </Modal>

      {renderLabelBox ? (
        <div onClick={() => setIsModalOpen(true)}>{renderLabelBox(color)}</div>
      ) : (
        <div
          style={{ backgroundColor: color }}
          className={classNames('w-14 h-8 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm transition-transform hover:scale-105', {
            'opacity-75 cursor-not-allowed': props.disabled,
            'cursor-pointer':
              typeof props.disabled === 'undefined' || !props.disabled,
          })}
          onClick={() =>
            (!props.disabled || typeof props.disabled === 'undefined') &&
            setIsModalOpen(true)
          }
        />
      )}
    </div>
  );
}
