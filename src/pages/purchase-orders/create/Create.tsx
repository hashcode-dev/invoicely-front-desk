/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { cloneDeep } from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useSearchParams } from 'react-router-dom';
import { v4 } from 'uuid';
import { blankInvitation } from '$app/common/constants/blank-invitation';
import { InvoiceSum } from '$app/common/helpers/invoices/invoice-sum';
import { InvoiceSumInclusive } from '$app/common/helpers/invoices/invoice-sum-inclusive';
import { useAtomWithPrevent } from '$app/common/hooks/useAtomWithPrevent';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useTitle } from '$app/common/hooks/useTitle';
import { useVendorResolver } from '$app/common/hooks/vendors/useVendorResolver';
import {
  Invitation,
  PurchaseOrder,
} from '$app/common/interfaces/purchase-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Vendor } from '$app/common/interfaces/vendor';
import { VendorContact } from '$app/common/interfaces/vendor-contact';
import { useBlankPurchaseOrderQuery } from '$app/common/queries/purchase-orders';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { Tab, Tabs } from '$app/components/Tabs';
import { purchaseOrderAtom } from '../common/atoms';
import { useCreate } from '../common/hooks';
import { usePurchaseOrderUtilities } from '../edit/hooks/usePurchaseOrderUtilities';

const blankPurchaseOrder: PurchaseOrder = {
  id: '',
  user_id: '',
  project_id: '',
  assigned_user_id: '',
  vendor_id: '',
  amount: 0,
  balance: 0,
  client_id: '',
  status_id: '1',
  design_id: '',
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
  reminder1_sent: '',
  reminder2_sent: '',
  reminder3_sent: '',
  reminder_last_sent: '',
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
  custom_surcharge_tax1: false,
  custom_surcharge_tax2: false,
  custom_surcharge_tax3: false,
  custom_surcharge_tax4: false,
  exchange_rate: 1,
  line_items: [],
  invitations: [],
  documents: [],
  entity_type: 'purchase_order',
  paid_to_date: 0,
  subscription_id: '',
  expense_id: '',
  location_id: '',
};

export interface PurchaseOrderContext {
  vendor: Vendor | undefined;
  purchaseOrder: PurchaseOrder | undefined;
  setPurchaseOrder: Dispatch<SetStateAction<PurchaseOrder | undefined>>;
  isDefaultTerms: boolean;
  setIsDefaultTerms: Dispatch<SetStateAction<boolean>>;
  isDefaultFooter: boolean;
  setIsDefaultFooter: Dispatch<SetStateAction<boolean>>;
  errors: ValidationBag | undefined;
  invoiceSum: InvoiceSum | InvoiceSumInclusive | undefined;
  setInvoiceSum: Dispatch<
    SetStateAction<InvoiceSum | InvoiceSumInclusive | undefined>
  >;
}

export default function Create() {
  const { documentTitle } = useTitle('new_purchase_order');
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const company = useCurrentCompany();
  const vendorResolver = useVendorResolver();

  const pages: Page[] = [
    { name: t('purchase_orders'), href: '/purchase_orders' },
    {
      name: t('new_purchase_order'),
      href: '/purchase_orders/create',
    },
  ];

  const tabs: Tab[] = [
    {
      name: t('create'),
      href: '/purchase_orders/create',
    },
    {
      name: t('documents'),
      href: '/purchase_orders/create/documents',
    },
    {
      name: t('settings'),
      href: '/purchase_orders/create/settings',
    },
  ];

  const [purchaseOrder, setPurchaseOrder] =
    useAtomWithPrevent(purchaseOrderAtom);

  const { data, isLoading } = useBlankPurchaseOrderQuery({
    enabled: typeof purchaseOrder === 'undefined',
  });

  const [invoiceSum, setInvoiceSum] = useState<
    InvoiceSum | InvoiceSumInclusive
  >();
  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [isDefaultTerms, setIsDefaultTerms] = useState<boolean>(false);
  const [isDefaultFooter, setIsDefaultFooter] = useState<boolean>(false);
  const [vendor, setVendor] = useState<Vendor | undefined>();

  const { calculateInvoiceSum, handleChange } = usePurchaseOrderUtilities({
    purchaseOrder,
    setPurchaseOrder,
    setInvoiceSum,
  });

  const onSave = useCreate({
    setErrors,
    isDefaultTerms,
    isDefaultFooter,
    isFormBusy,
    setIsFormBusy,
  });

  useEffect(() => {
    setPurchaseOrder((current) => {
      let value = current;

      if (
        searchParams.get('action') !== 'clone' &&
        searchParams.get('action') !== 'purchase_order_product'
      ) {
        value = undefined;
      }

      if (
        typeof value === 'undefined' &&
        searchParams.get('action') !== 'clone'
      ) {
        const po = data ? cloneDeep(data) : cloneDeep(blankPurchaseOrder);

        if (typeof po.line_items === 'string' || !Array.isArray(po.line_items)) {
          po.line_items = [];
        }

        if (searchParams.get('vendor')) {
          po.vendor_id = searchParams.get('vendor')!;
        }

        po.line_items.forEach((item) => (item._id = v4()));

        po.invitations = Array.isArray(po.invitations) ? po.invitations : [];
        po.invitations.forEach(
          (invitation) =>
            (invitation['client_contact_id'] =
              invitation.client_contact_id || '')
        );

        po.uses_inclusive_taxes = company?.settings?.inclusive_taxes ?? false;

        value = po;
      }

      return value;
    });

    return () => {
      if (searchParams.get('action') !== 'clone') {
        setPurchaseOrder(undefined);
      }
    };
  }, [data]);

  useEffect(() => {
    if (purchaseOrder && purchaseOrder.vendor_id) {
      vendorResolver.find(purchaseOrder.vendor_id).then((vendor) => {
        setVendor(vendor);

        const invitations: Invitation[] = [];

        vendor.contacts?.forEach((contact: VendorContact) => {
          if (contact.send_email) {
            const invitation = cloneDeep(
              blankInvitation
            ) as unknown as Invitation;

            invitation.vendor_contact_id = contact.id;
            invitation.can_sign = contact.can_sign;
            invitations.push(invitation);
          }
        });

        handleChange('invitations', invitations);
      });
    } else {
      setVendor(undefined);
    }
  }, [purchaseOrder?.vendor_id]);

  useEffect(() => {
    purchaseOrder && calculateInvoiceSum(purchaseOrder);
  }, [purchaseOrder]);

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onSaveClick={() => purchaseOrder && onSave(purchaseOrder)}
    >
      {!isLoading ? (
        <div className="space-y-4">
          <Tabs tabs={tabs} />

          <Outlet
            context={{
              vendor,
              purchaseOrder,
              setPurchaseOrder,
              errors,
              isDefaultTerms,
              setIsDefaultTerms,
              isDefaultFooter,
              setIsDefaultFooter,
              invoiceSum,
              setInvoiceSum,
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
