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
import { useColorScheme } from '$app/common/colors';
import CommonProps from '$app/common/interfaces/common-props.interface';

interface Props extends CommonProps {
  withoutPadding?: boolean;
  borderColor?: string;
}

export function Divider(props: Props) {
  return (
    <div
      style={props.borderColor ? { borderColor: props.borderColor } : undefined}
      className={classNames(
        'border-b border-slate-200/80 dark:border-slate-800',
        {
          'pt-6 mb-4': !props.withoutPadding,
        },
        props.className ?? ''
      )}
    />
  );
}
