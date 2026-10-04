/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useColorScheme } from '$app/common/colors';
import {
  EMAIL_LIST_DELIMITER_PATTERN,
  joinEmailList,
  limitEmailList,
  parseEmailList,
} from '$app/common/helpers/emails/email-list';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { ErrorMessage } from '$app/components/ErrorMessage';
import { InputLabel } from '$app/components/forms/InputLabel';
import { XMark } from '$app/components/icons/XMark';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmail, ReactMultiEmail } from 'react-multi-email';
import styled from 'styled-components';

interface Props {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string | null;
  id?: string;
  placeholder?: string | null;
  maxEmails?: number;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string | string[];
  className?: string;
  cypressRef?: string;
}

const Field = styled(ReactMultiEmail)<{
  $backgroundColor: string;
  $borderColor: string;
  $focusBorderColor: string;
  $placeholderColor: string;
  $textColor: string;
}>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  min-height: 2.625rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.75rem;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $borderColor }) => $borderColor};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: text;
  transition: all 150ms ease-in-out;

  &.focused {
    border-color: #004bca;
    box-shadow: 0 0 0 2px rgba(0, 97, 255, 0.25);
    outline: none;
  }

  &.is-disabled {
    opacity: 0.75;
    cursor: not-allowed;
    pointer-events: none;
  }

  & > span[data-placeholder] {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: ${({ $placeholderColor }) => $placeholderColor};
    pointer-events: none;
  }

  &.fill > span[data-placeholder] {
    display: none;
  }

  & > input {
    flex: 1 1 8rem;
    min-width: 6rem;
    padding: 0;
    border: 0;
    background-color: transparent;
    color: inherit;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  & > input:focus {
    border: 0;
    outline: none;
    box-shadow: none;
  }

  &.is-disabled > input {
    display: none;
  }
`;

const RemoveBadgeButton = styled.button<{ $hoverBackgroundColor: string }>`
  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: ${({ $hoverBackgroundColor }) => $hoverBackgroundColor};
  }
`;

export function MultiEmailInput({
  value = '',
  onValueChange,
  label,
  id,
  placeholder,
  maxEmails,
  disabled,
  required,
  errorMessage,
  className,
  cypressRef,
}: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const reactSettings = useReactSettings();

  const [emails, setEmails] = useState<string[]>(() => parseEmailList(value));
  const [isPendingEmailInvalid, setIsPendingEmailInvalid] =
    useState<boolean>(false);

  const currentValueRef = useRef<string>(value);
  const pendingEmailRef = useRef<string>('');

  const isLimitReached = useMemo(
    () => Boolean(maxEmails && emails.length >= maxEmails),
    [emails, maxEmails]
  );

  useEffect(() => {
    if (value === currentValueRef.current) {
      return;
    }

    currentValueRef.current = value;

    setEmails(parseEmailList(value));
  }, [value]);

  const handleChange = (updatedEmails: string[]) => {
    const nextEmails = limitEmailList(updatedEmails, maxEmails);
    const nextValue = joinEmailList(nextEmails);

    currentValueRef.current = nextValue;

    setEmails(nextEmails);
    setIsPendingEmailInvalid(false);

    onValueChange(nextValue);
  };

  const handleChangeInput = (pendingEmail: string) => {
    pendingEmailRef.current = pendingEmail;

    setIsPendingEmailInvalid(false);
  };

  const handleBlur = () => {
    setIsPendingEmailInvalid(
      Boolean(pendingEmailRef.current) && !isEmail(pendingEmailRef.current)
    );
  };

  return (
    <section className={className} data-cy={cypressRef}>
      {Boolean(label || maxEmails) && (
        <div
          className={classNames('flex items-center gap-2 mb-1', {
            'justify-between': label,
            'justify-end': !label,
          })}
        >
          {label && (
            <InputLabel for={id}>
              {label}
              {required && <span className="ml-1 text-red-600">*</span>}
            </InputLabel>
          )}

          {Boolean(maxEmails) && (
            <span
              className="text-xs font-medium"
              style={{ color: isLimitReached ? colors.$3 : colors.$17 }}
              data-cy="maxEmailsCounter"
            >
              {emails.length}/{maxEmails}
            </span>
          )}
        </div>
      )}

      <Field
        id={id}
        className={classNames({ 'is-disabled': disabled })}
        emails={emails}
        onChange={handleChange}
        onChangeInput={handleChangeInput}
        onBlur={handleBlur}
        enable={({ emailCnt }: { emailCnt: number }) => !maxEmails || emailCnt < maxEmails}
        delimiter={EMAIL_LIST_DELIMITER_PATTERN}
        placeholder={placeholder || undefined}
        autoComplete="off"
        noClass
        getLabel={(email: string, index: number, removeEmail: (index: number) => void) => (
          <span
            key={`${email}-${index}`}
            className="inline-flex h-6 max-w-full items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900 shadow-xs"
            data-cy="emailBadge"
          >
            <span className="truncate">{email}</span>

            {!disabled && (
              <RemoveBadgeButton
                type="button"
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full hover:bg-blue-200/60 dark:hover:bg-blue-800 focus:outline-none transition-colors"
                onClick={(event) => {
                  event.stopPropagation();

                  removeEmail(index);
                }}
                aria-label={`${String(t('remove'))} ${email}`}
                data-cy="removeEmailBadge"
                $hoverBackgroundColor={
                  reactSettings.dark_mode ? colors.$5 : colors.$24
                }
              >
                <XMark size="0.55rem" color="currentColor" />
              </RemoveBadgeButton>
            )}
          </span>
        )}
        $backgroundColor={colors.$1}
        $borderColor={reactSettings.dark_mode ? '#1f2e41' : '#09090B26'}
        $focusBorderColor={reactSettings.dark_mode ? '#ffffff' : '#000000'}
        $placeholderColor={colors.$17}
        $textColor={colors.$3}
      />

      <ErrorMessage className="mt-2">
        {errorMessage ||
          (isPendingEmailInvalid ? t('email_is_invalid') : undefined)}
      </ErrorMessage>
    </section>
  );
}
