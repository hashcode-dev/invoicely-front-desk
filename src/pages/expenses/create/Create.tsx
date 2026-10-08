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
import { BiPlusCircle } from 'react-icons/bi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useTitle } from '$app/common/hooks/useTitle';
import { Expense } from '$app/common/interfaces/expense';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankExpenseQuery } from '$app/common/queries/expenses';
import { Icon } from '$app/components/icons/Icon';
import { Default, SaveOption } from '$app/components/layouts/Default';
import { expenseAtom } from '../common/atoms';
import { useHandleChange } from '../common/hooks';
import { AdditionalInfo } from './components/AdditionalInfo';
import { Details } from './components/Details';
import { Notes } from './components/Notes';
import { TaxSettings } from './components/Taxes';

const blankExpense: Expense = {
  entity_type: 'expense',
  id: '',
  user_id: '',
  assigned_user_id: '',
  vendor_id: '',
  invoice_id: '',
  client_id: '',
  bank_id: '',
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
  documents: [],
};

export default function Create() {
  const { documentTitle } = useTitle('new_expense');
  const [t] = useTranslation();

  const navigate = useNavigate();
  const company = useCurrentCompany();
  const [searchParams] = useSearchParams();

  const pages = [
    { name: t('expenses'), href: '/expenses' },
    { name: t('new_expense'), href: '/expenses/create' },
  ];

  const [expense, setExpense] = useAtom(expenseAtom);
  const [errors, setErrors] = useState<ValidationBag>();
  const [taxInputType, setTaxInputType] = useState<'by_rate' | 'by_amount'>(
    company?.calculate_expense_tax_by_amount ? 'by_amount' : 'by_rate'
  );
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const { data } = useBlankExpenseQuery({
    enabled: typeof expense === 'undefined',
  });

  const handleChange = useHandleChange({ setExpense, setErrors });

  const onSave = (actionType: 'create' | 'save') => {
    if (!isFormBusy) {
      toast.processing();
      setErrors(undefined);
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/expenses'), expense)
        .then((response: GenericSingleResourceResponse<Expense>) => {
          toast.success('created_expense');

          $refetch(['expenses']);

          if (actionType === 'save') {
            navigate(
              route('/expenses/:id/edit', { id: response.data.data.id })
            );
          } else {
            if (data) {
              setExpense(data);
            }
          }
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            setErrors(error.response.data);
            toast.dismiss();
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  const saveOptions: SaveOption[] = [
    {
      onClick: () => onSave('create'),
      label: `${t('save')} / ${t('create')}`,
      icon: <Icon element={BiPlusCircle} />,
    },
  ];

  useEffect(() => {
    setExpense((current) => {
      let value = current;

      if (searchParams.get('action') !== 'clone') {
        value = undefined;
      }

      if (
        typeof value === 'undefined' &&
        searchParams.get('action') !== 'clone'
      ) {
        const _expense = data ? cloneDeep(data) : cloneDeep(blankExpense);

        if (searchParams.has('vendor')) {
          _expense.vendor_id = searchParams.get('vendor') as string;
        }

        if (searchParams.has('client')) {
          _expense.client_id = searchParams.get('client') as string;
        }

        if (searchParams.has('project')) {
          _expense.project_id = searchParams.get('project') as string;
        }

        value = {
          ..._expense,
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

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onSaveClick={() => expense && onSave('save')}
      additionalSaveOptions={saveOptions}
      disableSaveButton={isFormBusy}
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-4">
          <Details
            expense={expense}
            handleChange={handleChange}
            taxInputType={taxInputType}
            pageType="create"
            errors={errors}
          />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Notes
            expense={expense}
            handleChange={handleChange}
            errors={errors}
          />
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-4">
          <AdditionalInfo
            expense={expense}
            handleChange={handleChange}
            errors={errors}
          />

          <TaxSettings
            expense={expense}
            handleChange={handleChange}
            taxInputType={taxInputType}
            setTaxInputType={setTaxInputType}
          />
        </div>
      </div>
    </Default>
  );
}
