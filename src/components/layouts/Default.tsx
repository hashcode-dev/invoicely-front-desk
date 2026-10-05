/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useAtomValue } from 'jotai';
import { FormEvent, ReactElement, ReactNode } from 'react';
import { Info } from 'react-feather';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useColorScheme } from '$app/common/colors';
import { isDemo, isHosted, isSelfHosted, trans } from '$app/common/helpers';
import { useCurrentCompanyUser } from '$app/common/hooks/useCurrentCompanyUser';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { usePreventNavigation } from '$app/common/hooks/usePreventNavigation';
import { useUnlockButtonForHosted } from '$app/common/hooks/useUnlockButtonForHosted';
import { useUnlockButtonForSelfHosted } from '$app/common/hooks/useUnlockButtonForSelfHosted';
import { Invoice } from '$app/common/interfaces/invoice';
import { useSocketEvent } from '$app/common/queries/sockets';
import { Breadcrumbs, Page } from '$app/components/Breadcrumbs';
import { Dropdown } from '$app/components/dropdown/Dropdown';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Button, Link } from '$app/components/forms';
import {
  saveBtnAtom,
  useNavigationTopRightElement,
} from '$app/components/layouts/common/hooks';
import CommonProps from '../../common/interfaces/common-props.interface';
import { AccountPlanExpired } from '../banners/AccountPlanExpired';
import { ActivateCompany } from '../banners/ActivateCompany';
import { EInvoiceCredits } from '../banners/EInvoiceCredits';
import { PriceIncreaseBanner } from '../banners/PriceIncrease';
import { VerifyEmail } from '../banners/VerifyEmail';
import { VerifyPhone } from '../banners/VerifyPhone';
import { Feedback } from '../Feedback';

export interface SaveOption {
  label: string;
  onClick: (event: FormEvent<HTMLFormElement>) => unknown;
  icon?: ReactElement;
}

interface Props extends CommonProps {
  title?: string | null;
  onSaveClick?: any;
  onCancelClick?: any;
  breadcrumbs: Page[];
  topRight?: ReactNode;
  docsLink?: string;
  navigationTopRight?: ReactNode;
  saveButtonLabel?: string | null;
  disableSaveButton?: boolean;
  additionalSaveOptions?: SaveOption[];
  aboveMainContainer?: ReactNode;
  afterBreadcrumbs?: ReactNode;
}

export function Default(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const preventNavigation = usePreventNavigation();

  const user = useCurrentUser();
  const companyUser = useCurrentCompanyUser();

  const hostedUnlock = useUnlockButtonForHosted();
  const selfHostedUnlock = useUnlockButtonForSelfHosted();

  const shouldShowUnlockButton =
    !isDemo() && (hostedUnlock || selfHostedUnlock);

  const saveBtn = useAtomValue(saveBtnAtom);
  const navigationTopRightElement = useNavigationTopRightElement();

  useSocketEvent<Invoice>({
    on: ['App\\Events\\Invoice\\InvoiceWasViewed'],
    callback: ({ data }) => {
      if (
        !companyUser?.notifications?.email?.includes('invoice_viewed') ||
        !companyUser?.notifications?.email?.includes('invoice_viewed_user')
      ) {
        return;
      }

      toast(
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1">
            <Info size={18} />
            <span>
              {trans('notification_invoice_viewed_subject', {
                invoice: data.number,
                client: data.client?.display_name,
              })}
              .
            </span>
          </span>

          <div className="flex justify-center">
            <Link to={`/invoices/${data.id}/edit`}>{t('view_invoice')}</Link>
          </div>
        </div>,
        {
          duration: 8000,
          position: 'top-center',
        }
      );
    },
  });

  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="fixed bottom-4 right-4 z-50 flex items-end flex-col-reverse space-y-4 space-y-reverse">
        <ActivateCompany />
        <VerifyEmail />
        <VerifyPhone />
        <EInvoiceCredits />
        <AccountPlanExpired />

        {/* This component is only created for December 2025 if you see it in 2026 you can remove and delete it */}
        <PriceIncreaseBanner />
      </div>

      <div className="flex flex-col flex-1 w-full">
        {(props.title ||
          props.onSaveClick ||
          saveBtn ||
          props.onCancelClick ||
          props.breadcrumbs?.length ||
          navigationTopRightElement ||
          props.navigationTopRight) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-5 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col gap-1 min-w-0">
              {props.breadcrumbs && props.breadcrumbs.length > 0 && (
                <div className="pb-1">
                  <Breadcrumbs pages={props.breadcrumbs} />
                </div>
              )}
              {props.title && (
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {props.title}
                </h1>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2.5 sm:self-center">
              {shouldShowUnlockButton && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm transition-all"
                  onClick={() => {
                    if (
                      isHosted() ||
                      import.meta.env.VITE_ENABLE_NEW_ACCOUNT_MANAGEMENT ===
                        'true'
                    ) {
                      return navigate('/settings/account_management');
                    }

                    preventNavigation({
                      url: (isSelfHosted()
                        ? import.meta.env.VITE_WHITELABEL_INVOICE_URL ||
                          'https://invoiceninja.invoicing.co/client/subscriptions/O5xe7Rwd7r/purchase'
                        : user?.company_user?.ninja_portal_url) as string,
                      externalLink: true,
                    });
                  }}
                >
                  <span>
                    {isSelfHosted() ? t('white_label_button') : t('unlock_pro')}
                  </span>
                </button>
              )}

              {props.onCancelClick && (
                <Button onClick={props.onCancelClick} type="secondary">
                  {t('cancel')}
                </Button>
              )}

              {(Boolean(props.onSaveClick) || saveBtn) && (
                <div>
                  {!props.additionalSaveOptions && (
                    <Button
                      onClick={saveBtn?.onClick || props.onSaveClick}
                      disabled={
                        saveBtn?.disableSaveButton || props.disableSaveButton
                      }
                      disableWithoutIcon
                    >
                      {(saveBtn?.label || props.saveButtonLabel) ?? t('save')}
                    </Button>
                  )}

                  {props.additionalSaveOptions && (
                    <div className="flex">
                      <Button
                        className="rounded-br-none rounded-tr-none px-3"
                        onClick={saveBtn?.onClick || props.onSaveClick}
                        disabled={
                          saveBtn?.disableSaveButton || props.disableSaveButton
                        }
                        disableWithoutIcon
                      >
                        {(saveBtn?.label || props.saveButtonLabel) ?? t('save')}
                      </Button>

                      <Dropdown
                        className="rounded-bl-none rounded-tl-none h-full px-1 border-l-1 border-y-0 border-r-0"
                        cardActions
                        disabled={
                          saveBtn?.disableSaveButton || props.disableSaveButton
                        }
                        labelButtonBorderColor={colors.$1}
                      >
                        {props.additionalSaveOptions.map((option, index) => (
                          <DropdownElement
                            key={index}
                            icon={option.icon}
                            disabled={props.disableSaveButton}
                            onClick={option.onClick}
                          >
                            {option.label}
                          </DropdownElement>
                        ))}
                      </Dropdown>
                    </div>
                  )}
                </div>
              )}

              {(navigationTopRightElement || props.navigationTopRight) && (
                <div className="flex space-x-3 items-center">
                  {navigationTopRightElement?.element ||
                    props.navigationTopRight}
                </div>
              )}
            </div>
          </div>
        )}

        {props.aboveMainContainer}

        <main className="flex-1 w-full">{props.children}</main>
      </div>

      <Feedback />
    </div>
  );
}
