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
import { cloneDeep } from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useSearchParams } from 'react-router-dom';
import { blankInvitation } from '$app/common/constants/blank-invitation';
import { InvoiceSum } from '$app/common/helpers/invoices/invoice-sum';
import { InvoiceSumInclusive } from '$app/common/helpers/invoices/invoice-sum-inclusive';
import { useClientResolver } from '$app/common/hooks/clients/useClientResolver';
import { useAtomWithPrevent } from '$app/common/hooks/useAtomWithPrevent';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useTitle } from '$app/common/hooks/useTitle';
import { Client } from '$app/common/interfaces/client';
import { Credit } from '$app/common/interfaces/credit';
import { Invitation } from '$app/common/interfaces/purchase-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { Tab, Tabs } from '$app/components/Tabs';
import { creditAtom, invoiceSumAtom } from '../common/atoms';
import { useCreate, useCreditUtilities } from '../common/hooks';
import { useBlankCreditQuery } from '../common/queries';

const blankCredit: Credit = {
  id: '',
  user_id: '',
  project_id: '',
  assigned_user_id: '',
  amount: 0,
  balance: 0,
  client_id: '',
  vendor_id: '',
  status_id: '1',
  design_id: '',
  recurring_id: '',
  invoice_id: '',
  created_at: 0,
  updated_at: 0,
  archived_at: 0,
  is_deleted: false,
  number: '',
  discount: 0,
  po_number: '',
  date: new Date().toISOString().split('T')[0],
  last_sent_date: '',
  next_send_date: '',
  due_date: '',
  terms: '',
  public_notes: '',
  private_notes: '',
  uses_inclusive_taxes: false,
  tax_name1: '',
  tax_rate1: 0,
  tax_name2: '',
  tax_rate2: 0,
  tax_name3: '',
  tax_rate3: 0,
  total_taxes: 0,
  is_amount_discount: false,
  footer: '',
  partial: 0,
  partial_due_date: '',
  custom_value1: '',
  custom_value2: '',
  custom_value3: '',
  custom_value4: '',
  has_tasks: false,
  has_expenses: false,
  custom_surcharge1: 0,
  custom_surcharge2: 0,
  custom_surcharge3: 0,
  custom_surcharge4: 0,
  exchange_rate: 1,
  custom_surcharge_tax1: false,
  custom_surcharge_tax2: false,
  custom_surcharge_tax3: false,
  custom_surcharge_tax4: false,
  line_items: [],
  entity_type: 'credit',
  reminder1_sent: '',
  reminder2_sent: '',
  reminder3_sent: '',
  reminder_last_sent: '',
  paid_to_date: 0,
  subscription_id: '',
  auto_bill_enabled: false,
  invitations: [],
  documents: [],
  location_id: '',
};

export interface CreditsContext {
  credit: Credit | undefined;
  setCredit: Dispatch<SetStateAction<Credit | undefined>>;
  isDefaultFooter: boolean;
  isDefaultTerms: boolean;
  setIsDefaultFooter: Dispatch<SetStateAction<boolean>>;
  setIsDefaultTerms: Dispatch<SetStateAction<boolean>>;
  errors: ValidationBag | undefined;
  client: Client | undefined;
  invoiceSum: InvoiceSum | InvoiceSumInclusive | undefined;
}

export default function Create() {
  const { documentTitle } = useTitle('new_credit');
  const [t] = useTranslation();

  const company = useCurrentCompany();

  const pages: Page[] = [
    { name: t('credits'), href: '/credits' },
    {
      name: t('new_credit'),
      href: '/credits/create',
    },
  ];

  const tabs: Tab[] = [
    {
      name: t('create'),
      href: '/credits/create',
    },
    {
      name: t('documents'),
      href: '/credits/create/documents',
    },
    {
      name: t('settings'),
      href: '/credits/create/settings',
    },
  ];

  const [searchParams] = useSearchParams();

  const [credit, setCredit] = useAtomWithPrevent(creditAtom);
  const [invoiceSum, setInvoiceSum] = useAtom(invoiceSumAtom);

  const [client, setClient] = useState<Client>();
  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [isDefaultTerms, setIsDefaultTerms] = useState<boolean>(false);
  const [isDefaultFooter, setIsDefaultFooter] = useState<boolean>(false);

  const clientResolver = useClientResolver();

  const { data, isLoading } = useBlankCreditQuery({
    enabled: typeof credit === 'undefined',
  });

  const { handleChange, calculateInvoiceSum } = useCreditUtilities({
    client,
  });

  const save = useCreate({
    setErrors,
    isDefaultFooter,
    isDefaultTerms,
    isFormBusy,
    setIsFormBusy,
  });

  const settingResolver = (client: Client, taxNumber: '1' | '2' | '3') => {
    if (client?.settings?.[`tax_name${taxNumber}`]) {
      return {
        name: client.settings[`tax_name${taxNumber}`],
        rate: client.settings[`tax_rate${taxNumber}`],
      };
    }

    if (client?.group_settings?.settings?.[`tax_name${taxNumber}`]) {
      return {
        name: client?.group_settings?.settings[`tax_name${taxNumber}`],
        rate: client?.group_settings?.settings[`tax_rate${taxNumber}`],
      };
    }

    return {
      name: company?.settings[`tax_name${taxNumber}`],
      rate: company?.settings[`tax_rate${taxNumber}`],
    };
  };

  useEffect(() => {
    setInvoiceSum(undefined);

    setCredit((current) => {
      let value = current;

      if (
        searchParams.get('action') !== 'clone' &&
        searchParams.get('action') !== 'reverse'
      ) {
        value = undefined;
      }

      if (
        typeof value === 'undefined' &&
        searchParams.get('action') !== 'clone' &&
        searchParams.get('action') !== 'reverse'
      ) {
        const _credit: Credit = data
          ? cloneDeep(data)
          : cloneDeep(blankCredit);

        if (
          typeof _credit.line_items === 'string' ||
          !Array.isArray(_credit.line_items)
        ) {
          _credit.line_items = [];
        }

        if (searchParams.get('client')) {
          _credit.client_id = searchParams.get('client')!;
        }

        _credit.uses_inclusive_taxes =
          company?.settings?.inclusive_taxes ?? false;

        value = _credit;
      }

      return value;
    });

    return () => {
      if (searchParams.get('action') !== 'clone') {
        setCredit(undefined);
      }
    };
  }, [data]);

  useEffect(() => {
    credit &&
      credit.client_id &&
      credit.client_id.length > 1 &&
      clientResolver.find(credit.client_id).then((client) => {
        setClient(client);

        const invitations: Invitation[] = [];

        client.contacts?.forEach((contact) => {
          if (contact.send_email) {
            const invitation = cloneDeep(
              blankInvitation
            ) as unknown as Invitation;

            invitation.client_contact_id = contact.id;
            invitation.can_sign = contact.can_sign;
            invitations.push(invitation);
          }
        });

        handleChange('invitations', invitations);

        if (!client.is_tax_exempt) {
          if (
            company &&
            company.enabled_tax_rates > 0 &&
            searchParams.get('action') !== 'clone'
          ) {
            const { name, rate } = settingResolver(client, '1');

            handleChange('tax_name1', name);
            handleChange('tax_rate1', rate);
          }

          if (
            company &&
            company.enabled_tax_rates > 1 &&
            searchParams.get('action') !== 'clone'
          ) {
            const { name, rate } = settingResolver(client, '2');

            handleChange('tax_name2', name);
            handleChange('tax_rate2', rate);
          }

          if (
            company &&
            company.enabled_tax_rates > 2 &&
            searchParams.get('action') !== 'clone'
          ) {
            const { name, rate } = settingResolver(client, '3');

            handleChange('tax_name3', name);
            handleChange('tax_rate3', rate);
          }
        }
      });
  }, [credit?.client_id]);

  useEffect(() => {
    credit && calculateInvoiceSum(credit);
  }, [credit]);

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onSaveClick={() => save(credit!)}
      disableSaveButton={!credit?.client_id || credit.client_id.length === 0 || isFormBusy}
    >
      {!isLoading ? (
        <div className="space-y-4">
          <Tabs tabs={tabs} />

          <Outlet
            context={{
              credit,
              setCredit,
              errors,
              isDefaultTerms,
              setIsDefaultTerms,
              isDefaultFooter,
              setIsDefaultFooter,
              client,
              invoiceSum,
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </Default>
  );
}
