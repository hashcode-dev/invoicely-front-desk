/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useAtom } from 'jotai';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaObjectGroup } from 'react-icons/fa';
import { MdGroup } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { useColorScheme } from '$app/common/colors';
import { useActiveSettingsDetails } from '$app/common/hooks/useActiveSettingsDetails';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { useSwitchToCompanySettings } from '$app/common/hooks/useSwitchToCompanySettings';
import { Breadcrumbs, Page } from '$app/components/Breadcrumbs';
import { ValidationAlert } from '$app/components/ValidationAlert';
import { classNames } from '../../common/helpers';
import { companySettingsErrorsAtom } from '../../pages/settings/common/atoms';
import { SelectField } from '../forms';
import { Icon } from '../icons/Icon';
import { Sparkle } from '../icons/Sparkle';
import { XMark } from '../icons/XMark';
import { useSettingsRoutes } from './common/hooks';
import { Default } from './Default';

interface Props {
  title: string;
  children: ReactNode;
  onSaveClick?: any;
  onCancelClick?: any;
  breadcrumbs: Page[];
  docsLink?: string;
  navigationTopRight?: ReactNode;
  disableSaveButton?: boolean;
  aboveMainContainer?: ReactNode;
}

const LinkStyled = styled(Link)`
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.backgroundColor};
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

export function Settings(props: Props) {
  const [t] = useTranslation();

  const [errors, setErrors] = useAtom(companySettingsErrorsAtom);

  const location = useLocation();
  const colors = useColorScheme();
  const { basic, advanced } = useSettingsRoutes();
  const activeSettings = useActiveSettingsDetails();
  const settingPathNameKey = location.pathname.split('/')[2];
  const { isGroupSettingsActive, isClientSettingsActive } =
    useCurrentSettingsLevel();

  const navigate = useNavigate();
  const switchToCompanySettings = useSwitchToCompanySettings();

  const [filterQuery, setFilterQuery] = useState('');
  const normalizedQuery = filterQuery.toLowerCase().trim();

  const filteredBasic = basic.filter(
    (item) => item.enabled && (!normalizedQuery || item.name.toLowerCase().includes(normalizedQuery))
  );

  const filteredAdvanced = advanced.filter(
    (item) => item.enabled && (!normalizedQuery || item.name.toLowerCase().includes(normalizedQuery))
  );

  useEffect(() => {
    setErrors(undefined);
  }, [settingPathNameKey]);

  return (
    <Default
      onSaveClick={props.onSaveClick}
      onCancelClick={props.onCancelClick}
      title={props.title}
      docsLink={props.docsLink}
      navigationTopRight={props.navigationTopRight}
      disableSaveButton={props.disableSaveButton}
      breadcrumbs={props.breadcrumbs}
      aboveMainContainer={props.aboveMainContainer}
    >

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 card-shadow space-y-4 sticky top-4">
            {(isGroupSettingsActive || isClientSettingsActive) && (
              <div
                className="flex items-center justify-between border border-blue-200 dark:border-blue-900 py-2.5 px-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 shadow-xs"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="text-blue-600 dark:text-blue-400">
                    <Icon
                      element={isGroupSettingsActive ? FaObjectGroup : MdGroup}
                      size={18}
                    />
                  </div>

                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {isGroupSettingsActive
                      ? t('group_settings')
                      : t('client_settings')}
                    : {activeSettings.name}
                  </span>
                </div>

                <button
                  type="button"
                  className="cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
                  onClick={() => {
                    switchToCompanySettings();

                    isGroupSettingsActive && navigate('/settings/group_settings');
                    isClientSettingsActive && navigate('/clients');
                  }}
                  aria-label="Switch to company settings"
                >
                  <XMark size="0.9rem" />
                </button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={t('search_settings') || 'Search settings...'}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Clear filter"
                >
                  <XMark size="0.75rem" />
                </button>
              )}
            </div>

            {filteredBasic.length === 0 && filteredAdvanced.length === 0 && (
              <div className="text-center py-6 px-3 text-xs text-slate-400 dark:text-slate-500">
                {t('no_matching_settings', 'No settings found')}
              </div>
            )}

            {filteredBasic.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 px-3 py-1 mb-1">
                  {t('basic_settings')}
                </div>

                <div className="lg:hidden mb-2">
                  <SelectField
                    className="text-sm"
                    value={location.pathname}
                    onValueChange={(value) => navigate(value)}
                    withBlank
                    customSelector
                  >
                    {filteredBasic.map((item) => (
                      <option key={item.name} value={item.href}>
                        {item.name}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <nav className="space-y-0.5 hidden lg:block" aria-label="Basic Settings">
                  {filteredBasic.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150',
                        item.current
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border-l-4 border-blue-600 rounded-l-none shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <span className="truncate">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {filteredAdvanced.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-3 py-1 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {t('advanced_settings')}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900">
                    <Sparkle size="0.75rem" color="#004bca" />
                    <span>{t('pro')}</span>
                  </span>
                </div>

                <div className="lg:hidden mb-2">
                  <SelectField
                    className="text-sm"
                    value={location.pathname}
                    onValueChange={(value) => navigate(value)}
                    withBlank
                    customSelector
                  >
                    {filteredAdvanced.map((item) => (
                      <option key={item.name} value={item.href}>
                        {item.name}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <nav className="space-y-0.5 hidden lg:block" aria-label="Advanced Settings">
                  {filteredAdvanced.map((item, index) => (
                    <div key={index}>
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150',
                          item.current
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border-l-4 border-blue-600 rounded-l-none shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        <span className="truncate">{item.name}</span>
                      </Link>

                      {item.children && item.current && (
                        <div className="ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 py-1.5">
                          {item.children.map((child, childIndex) => (
                            <Link
                              key={childIndex}
                              to={child.href}
                              className={classNames(
                                'px-2.5 py-1 text-xs block rounded-lg transition-colors',
                                child.current
                                  ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-950/40'
                                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              )}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-6 min-w-0">
          {errors && <ValidationAlert errors={errors} />}

          {props.children}
        </div>
      </div>

    </Default>
  );
}
