/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useColorScheme } from '$app/common/colors';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { Divider } from '$app/components/cards/Divider';
import { Button, InputField } from '$app/components/forms';
import { LockCircle } from '$app/components/icons/LockCircle';
import { Modal } from '$app/components/Modal';

const Box = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }
`;

export function License() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      license: '',
    },
    onSubmit: (values) => {
      toast.processing();

      request(
        'POST',
        endpoint('/api/v1/claim_license?license_key=:key', {
          key: values.license,
        })
      )
        .then(() => {
          toast.success('bought_white_label');

          setIsModalVisible(false);
        })
        .finally(() => formik.setSubmitting(false));
    },
  });

  return (
    <>
      <Modal
        title={t('apply_license')}
        visible={isModalVisible}
        onClose={setIsModalVisible}
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <InputField
            onChange={formik.handleChange}
            label={t('license')}
            id="license"
            required
          />

          <Button disabled={formik.isSubmitting} variant="block">
            {t('submit')}
          </Button>
        </form>
      </Modal>

      <div className="px-4 sm:px-6 pb-6">
        <Divider
          className="border-dashed"
          withoutPadding
          style={{ borderColor: colors.$20 }}
        />
      </div>

      <div className="flex flex-col w-full space-y-4 px-4 sm:px-6">
        <Box
          className="flex space-x-2 items-center p-4 border shadow-sm w-full rounded-md cursor-pointer"
          onClick={() => setIsModalVisible(true)}
          theme={{
            backgroundColor: colors.$1,
            hoverBackgroundColor: colors.$4,
          }}
          style={{ borderColor: colors.$24 }}
        >
          <div>
            <LockCircle color={colors.$3} size="1.4rem" />
          </div>

          <span className="text-sm" style={{ color: colors.$3 }}>
            {t('apply_license')}
          </span>
        </Box>
      </div>
    </>
  );
}
