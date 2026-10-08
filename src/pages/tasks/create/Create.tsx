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
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useTitle } from '$app/common/hooks/useTitle';
import { Task } from '$app/common/interfaces/task';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useTaskStatusesQuery } from '$app/common/queries/task-statuses';
import { useBlankTaskQuery } from '$app/common/queries/tasks';
import { Default } from '$app/components/layouts/Default';
import { taskAtom } from '../common/atoms';
import { TaskDetails } from '../common/components/TaskDetails';
import { TaskTable } from '../common/components/TaskTable';
import { isOverlapping } from '../common/helpers/is-overlapping';
import { useStart } from '../common/hooks/useStart';

const blankTask: Task = {
  id: '',
  user_id: '',
  assigned_user_id: '',
  client_id: '',
  invoice_id: '',
  project_id: '',
  status_id: '',
  status_sort_order: 0,
  custom_value1: '',
  custom_value2: '',
  custom_value3: '',
  custom_value4: '',
  duration: 0,
  description: '',
  is_running: false,
  time_log: '[]',
  number: '',
  rate: 0,
  is_date_based: false,
  status_order: 0,
  is_deleted: false,
  archived_at: 0,
  created_at: 0,
  updated_at: 0,
  documents: [],
  date: new Date().toISOString().split('T')[0],
  calculated_start_date: '',
  user: {} as any,
  assigned_user: {} as any,
};

export default function Create() {
  const [t] = useTranslation();
  const { documentTitle } = useTitle('new_task');

  const company = useCurrentCompany();
  const start = useStart();
  const navigate = useNavigate();

  const [task, setTask] = useAtom(taskAtom);
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [isInitialConfiguration, setIsInitialConfiguration] =
    useState<boolean>(true);

  const { data: taskStatuses } = useTaskStatusesQuery({ status: 'active' });
  const { data } = useBlankTaskQuery({ enabled: typeof task === 'undefined' });

  const pages = [
    { name: t('tasks'), href: '/tasks' },
    { name: t('new_task'), href: '/tasks/create' },
  ];

  useEffect(() => {
    setTask((current) => {
      let value = current;

      if (searchParams.get('action') !== 'clone') {
        value = undefined;
      }

      if (
        typeof value === 'undefined' &&
        searchParams.get('action') !== 'clone'
      ) {
        const _task = data ? cloneDeep(data) : cloneDeep(blankTask);

        if (searchParams.get('client')) {
          _task.client_id = searchParams.get('client')!;
        }

        if (searchParams.get('project')) {
          _task.project_id = searchParams.get('project')!;
        }

        _task.rate = company?.settings?.default_task_rate || 0;

        if (searchParams.get('rate')) {
          _task.rate = parseFloat(searchParams.get('rate')!);
        }

        value = _task;
      }

      return value;
    });
  }, [data]);

  useEffect(() => {
    if (task && taskStatuses?.data && isInitialConfiguration) {
      setTask(
        (current) =>
          current && {
            ...current,
            status_id:
              taskStatuses.data.length > 0 ? taskStatuses.data[0].id : '',
          }
      );

      setIsInitialConfiguration(false);
    }
  }, [task, taskStatuses]);

  const handleChange = (property: keyof Task, value: unknown) => {
    setTask((current) => current && { ...current, [property]: value });
  };

  const handleSave = (task: Task) => {
    if (isFormBusy) {
      return;
    }

    toast.processing();

    if (isOverlapping(task)) {
      return toast.error('task_errors');
    }

    setIsFormBusy(true);

    request('POST', endpoint('/api/v1/tasks'), task)
      .then((response) => {
        company?.auto_start_tasks && start(response.data.data);

        $refetch(['tasks']);

        toast.success('created_task');

        navigate(route('/tasks/:id/edit', { id: response.data.data.id }));
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          toast.dismiss();
          setErrors(error.response.data);
        }
      })
      .finally(() => {
        setIsFormBusy(false);
      });
  };

  return (
    <Default
      title={documentTitle}
      onSaveClick={() => task && handleSave(task)}
      breadcrumbs={pages}
    >
      {task && (
        <TaskDetails task={task} handleChange={handleChange} errors={errors} />
      )}
      {task && <TaskTable task={task} handleChange={handleChange} />}
    </Default>
  );
}
