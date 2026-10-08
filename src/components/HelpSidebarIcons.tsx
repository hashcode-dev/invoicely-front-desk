/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useQuery } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useId, useRef, useState } from 'react';
import { Mail } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { FaSlack } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { endpoint, isHosted, isSelfHosted } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentAccount } from '$app/common/hooks/useCurrentAccount';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useHandleCollapseExpandSidebar } from '$app/common/hooks/useHandleCollapseExpandSidebar';
import { useHandleDarkLightMode } from '$app/common/hooks/useHandleDarkLightMode';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import {
  resetChanges,
  updateCompanyUsers,
} from '$app/common/stores/slices/company-users';
import { AboutModal } from './AboutModal';
import { Button, InputField } from './forms';
import Toggle from './forms/Toggle';
import { CircleInfo } from './icons/CircleInfo';
import { CircleQuestion } from './icons/CircleQuestion';
import { CircleWarning } from './icons/CircleWarning';
import { CloseNavbarArrow } from './icons/CloseNavbarArrow';
import { Icon } from './icons/Icon';
import { Message } from './icons/Message';
import { MoonStars } from './icons/MoonStars';
import { OpenNavbarArrow } from './icons/OpenNavbarArrow';
import { Sun } from './icons/Sun';
import { TriangleWarning } from './icons/TriangleWarning';
import { Modal } from './Modal';
import { UpdateAppModal } from './UpdateAppModal';

interface Props {
  docsLink?: string;
  mobileNavbar?: boolean;
  isCompactViewport?: boolean;
}

export function HelpSidebarIcons(props: Props) {
  const [t] = useTranslation();

  const user = useCurrentUser();
  const account = useCurrentAccount();

  const reactSettings = useReactSettings();

  const { mobileNavbar } = props;

  const dispatch = useDispatch();
  const handleDarkLightMode = useHandleDarkLightMode();
  const handleCollapseExpandSidebar = useHandleCollapseExpandSidebar();

  const { data: latestVersion } = useQuery({
    queryKey: ['/pdf.invoicing.co/api/version'],
    queryFn: () =>
      axios
        .get('https://pdf.invoicing.co/api/version')
        .then((response) => response.data),
    staleTime: Infinity,
    enabled: isSelfHosted(),
  });

  const { data: currentSystemInfo } = useQuery({
    queryKey: ['/api/v1/health_check'],
    queryFn: () =>
      request('GET', endpoint('/api/v1/health_check')).then(
        (response) => response.data
      ),
    staleTime: Infinity,
    enabled: isSelfHosted(),
  });

  const [isContactVisible, setIsContactVisible] = useState<boolean>(false);
  const [isAboutVisible, setIsAboutVisible] = useState<boolean>(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState<boolean>(false);
  const [cronsNotEnabledModal, setCronsNotEnabledModal] =
    useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);
  const helpMenuId = useId();
  const helpMenuContainerRef = useRef<HTMLDivElement>(null);
  const helpMenuButtonRef = useRef<HTMLButtonElement>(null);

  const isMiniSidebar =
    Boolean(reactSettings.show_mini_sidebar) && !props.isCompactViewport;

  const isUpdateAvailable =
    isSelfHosted() &&
    latestVersion &&
    currentSystemInfo?.api_version &&
    currentSystemInfo.api_version !== latestVersion &&
    !currentSystemInfo?.is_docker;

  const hasSchedulerError = Boolean(
    isSelfHosted() && account && !account.is_scheduler_running
  );
  const hasSidebarAlert = Boolean(isUpdateAvailable || hasSchedulerError);
  const sidebarAlertLabels = [
    isUpdateAvailable ? t('update_available') : undefined,
    hasSchedulerError ? t('error') : undefined,
  ]
    .filter(Boolean)
    .join(', ');

  const formik = useFormik({
    initialValues: {
      message: '',
      platform: 'R',
      send_logs: false,
    },
    onSubmit: (values) => {
      toast.processing();

      request('POST', endpoint('/api/v1/support/messages/send'), values)
        .then(() => toast.success('your_message_has_been_received'))
        .finally(() => {
          formik.setSubmitting(false);
          setIsContactVisible(false);
        });
    },
  });

  const refreshData = () => {
    setDisabledButton(true);

    request(
      'POST',
      endpoint('/api/v1/refresh?updated_at=:updatedAt', {
        updatedAt: dayjs().unix(),
      })
    ).then((data) => {
      dispatch(updateCompanyUsers(data.data.data));
      dispatch(resetChanges('company'));
      setDisabledButton(false);
      setCronsNotEnabledModal(false);
    });
  };

  useEffect(() => {
    const handler = () => setIsContactVisible(true);
    window.addEventListener('open-contact-modal', handler);
    return () => window.removeEventListener('open-contact-modal', handler);
  }, []);

  useEffect(() => {
    if (!isHelpMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!helpMenuContainerRef.current?.contains(event.target as Node)) {
        setIsHelpMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHelpMenuOpen(false);
        helpMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHelpMenuOpen]);

  return (
    <>
      <Modal
        title={t('contact_us')}
        visible={isContactVisible}
        onClose={setIsContactVisible}
        disableClosing
        enableClosingOnXMark
      >
        <InputField
          label={t('from')}
          id="from"
          value={`${user?.first_name} - ${user?.email}`}
          disabled
        />

        <InputField
          element="textarea"
          label={t('message')}
          id="message"
          onChange={formik.handleChange}
        />

        {isSelfHosted() && (
          <Toggle
            id="send_errors"
            label={t('include_recent_errors')}
            onChange={(value) => formik.setFieldValue('send_logs', value)}
          />
        )}

        <div className="flex gap-x-4 justify-end">
          <Button
            type="secondary"
            onClick={() => setIsContactVisible(false)}
            disabled={formik.isSubmitting}
          >
            {t('cancel')}
          </Button>

          <Button
            onClick={() => formik.submitForm()}
            disabled={formik.isSubmitting}
          >
            {t('send')}
          </Button>
        </div>
      </Modal>

      <Modal
        title={t('crons_not_enabled')}
        visible={cronsNotEnabledModal}
        onClose={setCronsNotEnabledModal}
      >
        <Button
          onClick={() => {
            window.open(
              'https://invoiceninja.github.io/docs/self-host/self-host-troubleshooting/#cron-not-running-queue-not-running',
              '_blank'
            );
          }}
        >
          {t('learn_more')}
        </Button>
        <Button disabled={disabledButton} onClick={refreshData}>
          {t('refresh_data')}
        </Button>
        <Button
          onClick={() => {
            setCronsNotEnabledModal(false);
          }}
        >
          {t('dismiss')}
        </Button>
      </Modal>

      <UpdateAppModal
        isVisible={isUpdateModalVisible}
        setIsVisible={setIsUpdateModalVisible}
        installedVersion={currentSystemInfo?.api_version}
        latestVersion={latestVersion}
      />

      <AboutModal
        isAboutVisible={isAboutVisible}
        setIsAboutVisible={setIsAboutVisible}
        currentSystemInfo={currentSystemInfo}
        latestVersion={latestVersion}
      />

      <nav
        className={classNames('sidebar-footer-actions py-0 text-white', {
          'mobile-navbar': mobileNavbar,
        })}
      >
        {!isMiniSidebar && !mobileNavbar && (
          <>
            <div
              className="sidebar-footer-menu-container"
              ref={helpMenuContainerRef}
            >
              <button
                ref={helpMenuButtonRef}
                type="button"
                className="sidebar-footer-action"
                aria-label={String(
                  sidebarAlertLabels
                    ? `${t('help')}: ${sidebarAlertLabels}`
                    : t('help')
                )}
                aria-expanded={isHelpMenuOpen}
                aria-controls={helpMenuId}
                onClick={() => setIsHelpMenuOpen((open) => !open)}
              >
                {hasSidebarAlert ? (
                  isUpdateAvailable ? (
                    <TriangleWarning color="white" size="1.3rem" />
                  ) : (
                    <CircleWarning color="white" size="1.3rem" />
                  )
                ) : (
                  <CircleQuestion color="white" size="1.3rem" />
                )}
              </button>

              <div
                id={helpMenuId}
                className="sidebar-footer-popover"
                role="group"
                aria-label={String(t('help'))}
                hidden={!isHelpMenuOpen}
              >
                {isUpdateAvailable && (
                  <button
                    type="button"
                    className="sidebar-footer-menu-action"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      setIsUpdateModalVisible(true);
                    }}
                  >
                    <TriangleWarning color="white" size="1.1rem" />
                    <span>{t('update_available')}</span>
                  </button>
                )}

                {hasSchedulerError && (
                  <button
                    type="button"
                    className="sidebar-footer-menu-action"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      setCronsNotEnabledModal(true);
                    }}
                  >
                    <CircleWarning color="white" size="1.1rem" />
                    <span>{t('error')}</span>
                  </button>
                )}

                {isHosted() ? (
                  <button
                    type="button"
                    className="sidebar-footer-menu-action"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      setIsContactVisible(true);
                    }}
                  >
                    <Mail size={18} />
                    <span>{t('contact_us')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sidebar-footer-menu-action"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      window.open('https://slack.invoiceninja.com', '_blank');
                    }}
                  >
                    <Icon element={FaSlack} color="white" size={18} />
                    <span>{t('contact_us')}</span>
                  </button>
                )}

                {!isUpdateAvailable && (
                  <button
                    type="button"
                    className="sidebar-footer-menu-action"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      window.open('https://forum.invoiceninja.com', '_blank');
                    }}
                  >
                    <Message color="white" size="1.1rem" />
                    <span>{t('support_forum')}</span>
                  </button>
                )}

                {!hasSchedulerError && (
                  <button
                    type="button"
                    className="sidebar-footer-menu-action"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      window.open(
                        props.docsLink
                          ? `https://invoiceninja.github.io/${props.docsLink}`
                          : 'https://invoiceninja.github.io',
                        '_blank'
                      );
                    }}
                  >
                    <CircleQuestion color="white" size="1.1rem" />
                    <span>{t('user_guide')}</span>
                  </button>
                )}
              </div>
            </div>

            <Tippy
              duration={0}
              content={t('about')}
              className="rounded-md text-xs p-2 bg-[#F2F2F2]"
            >
              <button
                type="button"
                className="sidebar-footer-action"
                aria-label={String(t('about'))}
                onClick={() => setIsAboutVisible(true)}
              >
                <CircleInfo color="white" size="1.3rem" />
              </button>
            </Tippy>

            <Tippy
              duration={0}
              content={t('dark_mode')}
              className="rounded-md text-xs p-2 bg-[#F2F2F2]"
            >
              <button
                type="button"
                className="sidebar-footer-action"
                aria-label={String(t('dark_mode'))}
                onClick={() => handleDarkLightMode(!reactSettings?.dark_mode)}
              >
                {reactSettings?.dark_mode ? (
                  <Sun color="white" size="1.3rem" />
                ) : (
                  <MoonStars color="white" size="1.3rem" />
                )}
              </button>
            </Tippy>
          </>
        )}

        {!props.isCompactViewport && (
          <Tippy
            duration={0}
            content={
              <span style={{ fontSize: isMiniSidebar ? '0.6rem' : '0.75rem' }}>
                {isMiniSidebar ? t('show_menu') : t('hide_menu')}
              </span>
            }
            className="rounded-md text-xs p-2 bg-[#F2F2F2]"
          >
            <button
              type="button"
              className="sidebar-footer-action"
              aria-label={String(
                isMiniSidebar ? t('show_menu') : t('hide_menu')
              )}
              onClick={() => handleCollapseExpandSidebar(!isMiniSidebar)}
            >
              {isMiniSidebar ? (
                <OpenNavbarArrow color="#e5e7eb" size="1.5rem" />
              ) : (
                <CloseNavbarArrow color="#e5e7eb" size="1.35rem" />
              )}
            </button>
          </Tippy>
        )}
      </nav>
    </>
  );
}
