/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RecurringExpensesFrequency } from '$app/common/enums/recurring-expense-frequency';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useTitle } from '$app/common/hooks/useTitle';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { RecurringExpense } from '$app/common/interfaces/recurring-expense';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankRecurringExpenseQuery } from '$app/common/queries/recurring-expense';
import { Default } from '$app/components/layouts/Default';
import { recurringExpenseAtom } from '../common/atoms';
import { useHandleChange } from '../common/hooks';
import { AdditionalInfo } from '../components/AdditionalInfo';
import { Details } from '../components/Details';
import { Notes } from '../components/Notes';
import { TaxSettings } from '../components/Taxes';

const blankRecurringExpense: RecurringExpense = {
  id: '',
  user_id: '',
  assigned_user_id: '',
  vendor_id: '',
  invoice_id: '',
  client_id: '',
  bank_id: '',
  status_id: '1',
  invoice_currency_id: '',
  expense_currency_id: '',
  currency_id: '',
  category_id: '',
  payment_type_id: '',
  recurring_expense_id: '',
  is_deleted: false,
  should_be_invoiced: false,
  invoice_documents: false,
  amount: 0,
  foreign_amount: 0,
  exchange_rate: 1,
  tax_name1: '',
  tax_rate1: 0,
  tax_name2: '',
  tax_rate2: 0,
  tax_name3: '',
  tax_rate3: 0,
  private_notes: '',
  public_notes: '',
  transaction_reference: '',
  transaction_id: '',
  date: new Date().toISOString().split('T')[0],
  number: '',
  payment_date: '',
  custom_value1: '',
  custom_value2: '',
  custom_value3: '',
  custom_value4: '',
  updated_at: 0,
  archived_at: 0,
  created_at: 0,
  project_id: '',
  tax_amount1: 0,
  tax_amount2: 0,
  tax_amount3: 0,
  uses_inclusive_taxes: false,
  calculate_tax_by_amount: false,
  frequency_id: RecurringExpensesFrequency.FREQUENCY_MONTHLY,
  documents: [],
  entity_type: 'recurring_expense',
  remaining_cycles: 0,
  next_send_date: '',
};

export default function Create() {
  const [t] = useTranslation();

  const company = useCurrentCompany();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { documentTitle } = useTitle('new_recurring_expense');

  const pages = [
    { name: t('recurring_expenses'), href: '/recurring_expenses' },
    { name: t('new_recurring_expense'), href: '/recurring_expenses/create' },
  ];

  const [taxInputType, setTaxInputType] = useState<'by_rate' | 'by_amount'>(
    company?.calculate_expense_tax_by_amount ? 'by_amount' : 'by_rate'
  );

  const [recurringExpense, setRecurringExpense] = useAtom(recurringExpenseAtom);

  const { data } = useBlankRecurringExpenseQuery({
    enabled: typeof recurringExpense === 'undefined',
  });

  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const handleChange = useHandleChange({ setRecurringExpense, setErrors });

  useEffect(() => {
    setRecurringExpense((current) => {
      let value = current;

      if (searchParams.get('action') !== 'clone') {
        value = undefined;
      }

      if (
        typeof value === 'undefined' &&
        searchParams.get('action') !== 'clone'
      ) {
        const _recurringExpense = data
          ? cloneDeep(data)
          : cloneDeep(blankRecurringExpense);

        _recurringExpense.frequency_id =
          RecurringExpensesFrequency.FREQUENCY_MONTHLY;

        if (searchParams.get('client')) {
          _recurringExpense.client_id = searchParams.get('client')!;
        }

        if (searchParams.get('vendor')) {
          _recurringExpense.vendor_id = searchParams.get('vendor')!;
        }

        value = {
          ..._recurringExpense,
          payment_date: company?.mark_expenses_paid
            ? dayjs().format('YYYY-MM-DD')
            : '',
          should_be_invoiced: company?.mark_expenses_invoiceable ?? false,
          invoice_documents: company?.invoice_expense_documents ?? false,
          calculate_tax_by_amount: taxInputType === 'by_amount',
          uses_inclusive_taxes: company?.expense_inclusive_taxes ?? false,
        };
      }

      return value;
    });
  }, [data]);

  const onSave = (recurringExpense: RecurringExpense) => {
    if (isFormBusy) {
      return;
    }

    toast.processing();
    setIsFormBusy(true);
    setErrors(undefined);

    request('POST', endpoint('/api/v1/recurring_expenses'), recurringExpense)
      .then((response: GenericSingleResourceResponse<RecurringExpense>) => {
        toast.success('created_recurring_expense');

        $refetch(['recurring_expenses']);

        navigate(
          route('/recurring_expenses/:id/edit', { id: response.data.data.id })
        );
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data);
          toast.dismiss();
        }
      })
      .finally(() => setIsFormBusy(false));
  };

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onSaveClick={() => recurringExpense && onSave(recurringExpense)}
      disableSaveButton={!recurringExpense || isFormBusy}
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-4">
          <Details
            recurringExpense={recurringExpense}
            handleChange={handleChange}
            taxInputType={taxInputType}
            pageType="create"
            errors={errors}
          />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Notes
            recurringExpense={recurringExpense}
            handleChange={handleChange}
            errors={errors}
          />
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-4">
          <AdditionalInfo
            recurringExpense={recurringExpense}
            handleChange={handleChange}
            errors={errors}
          />

          <TaxSettings
            recurringExpense={recurringExpense}
            handleChange={handleChange}
            taxInputType={taxInputType}
            setTaxInputType={setTaxInputType}
          />
        </div>
      </div>
    </Default>
  );
}
