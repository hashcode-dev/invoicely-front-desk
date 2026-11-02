/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { arrayMoveImmutable } from 'array-move';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useColorScheme } from '$app/common/colors';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useCurrentCompanyUser } from '$app/common/hooks/useCurrentCompanyUser';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useIsEmployee } from '$app/common/hooks/useIsEmployee';
import {
  ReactTableColumns,
  useReactSettings,
  useSaveReactSettings,
  useUpdateReactSettings,
} from '$app/common/hooks/useReactSettings';
import { Button, InputLabel, SelectField } from './forms';
import { Inline } from './Inline';
import { CircleXMark } from './icons/CircleXMark';
import { GridDotsVertical } from './icons/GridDotsVertical';
import { TableColumns } from './icons/TableColumns';
import { Modal } from './Modal';

interface Props {
  columns: string[];
  defaultColumns: string[];
  table: ReactTableColumns;
}

export function DataTableColumnsPicker(props: Props) {
  const currentUser = useCurrentUser();
  const company = useCurrentCompany();
  const companyUser = useCurrentCompanyUser();
  const isEmployee = useIsEmployee();
  const isAdmin = Boolean(companyUser?.is_admin || companyUser?.is_owner);

  const updateSettings = useUpdateReactSettings();
  const saveSettings = useSaveReactSettings();

  const [t] = useTranslation();
  const { table, defaultColumns } = props;

  const colors = useColorScheme();
  const reactSettings = useReactSettings();
  const [saveAsCompanyDefault, setSaveAsCompanyDefault] = useState(false);

  const { data: columnGovConfig } = useQuery<{
    default_columns: string[];
    locked_columns: string[];
    restricted_for_employees: string[];
    allow_employee_customization: boolean;
  }>({
    queryKey: ['table-columns', company?.id, table],
    queryFn: () =>
      request('GET', endpoint(`/api/v1/companies/${company?.id}/table-columns/${table}`))
        .then((res: any) => res.data?.data)
        .catch(() => null),
    enabled: Boolean(company?.id),
  });

  const lockedColumns = useMemo(
    () => columnGovConfig?.locked_columns || [],
    [columnGovConfig]
  );
  const restrictedColumns = useMemo(
    () => (isEmployee ? columnGovConfig?.restricted_for_employees || [] : []),
    [isEmployee, columnGovConfig]
  );

  const initialColumns =
    reactSettings?.react_table_columns?.[table as ReactTableColumns] ||
    columnGovConfig?.default_columns ||
    defaultColumns;

  const getAvailableColumns = useCallback(
    (selectedColumns: string[]) =>
      props.columns
        .filter((col) => !restrictedColumns.includes(col))
        .filter((column) => !selectedColumns.includes(column)),
    [props.columns, restrictedColumns]
  );

  const [currentColumns, setCurrentColumns] =
    useState<string[]>(initialColumns);

  const [filteredColumns, setFilteredColumns] = useState<string[]>(() =>
    getAvailableColumns(initialColumns)
  );

  // Avoid re-seeding on atom reference churn from unrelated settings writes.
  const savedColumns =
    reactSettings?.react_table_columns?.[table as ReactTableColumns];
  const lastSyncedColumnsRef = useRef(savedColumns);
  useEffect(() => {
    if (savedColumns && !isEqual(savedColumns, lastSyncedColumnsRef.current)) {
      lastSyncedColumnsRef.current = savedColumns;
      setCurrentColumns(savedColumns);
    }
  }, [savedColumns]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setFilteredColumns(getAvailableColumns(currentColumns));
  }, [currentColumns, getAvailableColumns]);

  const handleSelectChange = useCallback((value: string) => {
    value.length > 1 && setCurrentColumns((current) => [...current, value]);
  }, []);

  const onSave = () => {
    if (!currentUser?.id) return;

    if (isAdmin && saveAsCompanyDefault && company?.id) {
      request('PUT', endpoint(`/api/v1/companies/${company.id}/table-columns/${table}`), {
        company_id: company.id,
        table_name: table,
        default_columns: currentColumns,
        locked_columns: lockedColumns,
        restricted_for_employees: columnGovConfig?.restricted_for_employees || [],
        allow_employee_customization: columnGovConfig?.allow_employee_customization ?? true,
      }).catch(console.error);
    }

    // Normalize legacy array-shaped table columns before writing this table.
    if (Array.isArray(reactSettings.react_table_columns)) {
      updateSettings('react_table_columns', {});
    }

    toast.processing();

    saveSettings(`react_table_columns.${table}`, currentColumns)
      .then(() => {
        setIsModalVisible(false);
        toast.success('saved_settings');
      })
      .catch(() => toast.dismiss());
  };

  const handleDelete = (columnKey: string) => {
    if (lockedColumns.includes(columnKey)) {
      toast.error('This column is required by company administration and cannot be removed');
      return;
    }

    const updatedCurrentColumns = currentColumns.filter(
      (column) => column !== columnKey
    );

    setCurrentColumns(updatedCurrentColumns);
    setFilteredColumns(getAvailableColumns(updatedCurrentColumns));
  };

  const handleReset = useCallback(() => {
    const fallback = columnGovConfig?.default_columns || defaultColumns;
    setCurrentColumns(fallback);
    setFilteredColumns(getAvailableColumns(fallback));
  }, [columnGovConfig, defaultColumns, getAvailableColumns]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sorted = arrayMoveImmutable(
      currentColumns,
      result.source.index,
      result.destination.index
    );

    setCurrentColumns(sorted);
  };

  return (
    <>
      {createPortal(
        <Modal
          title={t('edit_columns')}
          visible={isModalVisible}
          onClose={setIsModalVisible}
        >
          <div className="flex flex-col">
            <SelectField
              className="shadow-sm"
              label={t('add_column')}
              onValueChange={handleSelectChange}
              value=""
              withBlank
              customSelector
              cypressRef="columSelector"
            >
              {filteredColumns
                .sort((a, b) => t(a).localeCompare(t(b)))
                .map((column, index) => (
                  <option key={index} value={column}>
                    {t(column)}
                  </option>
                ))}
            </SelectField>

            <InputLabel className="mt-4">{t('order_columns')}</InputLabel>

            <div className="mt-3">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="columns"
                  renderClone={(provided, _, rubric) => {
                    const column = currentColumns[rubric.source.index];

                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center justify-between py-[0.4rem] text-sm"
                      >
                        <div
                          className="flex flex-1 space-x-2 items-center cursor-pointer"
                          {...provided.dragHandleProps}
                        >
                          <div>
                            <GridDotsVertical
                              size="1.2rem"
                              color={colors.$17}
                            />
                          </div>

                          <p style={{ color: colors.$3 }}>{t(column)}</p>
                        </div>

                        <CircleXMark
                          color={colors.$16}
                          hoverColor={colors.$3}
                          borderColor={colors.$5}
                          hoverBorderColor={colors.$17}
                          size="1.6rem"
                        />
                      </div>
                    );
                  }}
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {currentColumns.map((column, index) => (
                        <Draggable
                          key={index}
                          draggableId={`item-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between py-[0.4rem]"
                            >
                              <div
                                className="flex flex-1 space-x-2 items-center cursor-pointer"
                                {...provided.dragHandleProps}
                              >
                                <div>
                                  <GridDotsVertical
                                    size="1.2rem"
                                    color={colors.$17}
                                  />
                                </div>

                                <p style={{ color: colors.$3 }}>{t(column)}</p>
                              </div>

                              {lockedColumns.includes(column) ? (
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                                  {t('locked', 'Required')}
                                </span>
                              ) : (
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleDelete(column)}
                                >
                                  <CircleXMark
                                    color={colors.$16}
                                    hoverColor={colors.$3}
                                    borderColor={colors.$5}
                                    hoverBorderColor={colors.$17}
                                    size="1.6rem"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {isAdmin && (
              <label className="flex items-center space-x-2 mt-4 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsCompanyDefault}
                  onChange={(e) => setSaveAsCompanyDefault(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{t('save_as_company_default', 'Save as default columns for all company users')}</span>
              </label>
            )}

            <div className="flex mt-4 lg:flex-row lg:justify-end">
              <Inline>
                <Button type="secondary" onClick={handleReset}>
                  {t('reset')}
                </Button>

                <Button onClick={onSave}>{t('save')}</Button>
              </Inline>
            </div>
          </div>
        </Modal>,
        document.body
      )}

      <Button
        className="shadow-sm"
        type="secondary"
        onClick={() => setIsModalVisible(true)}
      >
        <div className="flex items-center space-x-2">
          <TableColumns size="1.3rem" color={colors.$3} />

          <span className="hidden 2xl:flex">{t('columns')}</span>
        </div>
      </Button>
    </>
  );
}
