'use client';
import React, { useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@kma/ui-components';

const KendoGrid = dynamic(() => import('@kma/ui-components').then((mod) => mod.KendoGrid), { ssr: false });

interface Props {
  data: any[];
  setData: (data: any[]) => void;
  selectedCd: string | null;
  onRowClick: (cd: string) => void;
  onAdd: () => void;
  onSave: () => void;
  onDelete: () => void;
  maxRows?: number;
}

export function CodeMasterGridWidget({
  data,
  setData,
  selectedCd,
  onRowClick,
  onAdd,
  onSave,
  onDelete,
  maxRows = 10,
}: Props) {
  const columns = useMemo(
    () => [
      { field: 'selected', width: 50, title: ' ' },
      { field: 'comnCd', title: '그룹코드', width: 150, editable: false },
      { field: 'comnNm', title: '그룹명', editable: true },
      { field: 'sort', title: '순서', width: 80, editable: true, editor: 'numeric' as const },
      { field: 'comnDiv', title: '구분', width: 120, editable: true },
    ],
    [],
  );

  const renderCell = useCallback(
    (p: any) => {
      const field = p.field;
      if (!field) return null;
      const isSelected = p.dataItem.comnCd && p.dataItem.comnCd === selectedCd;
      const cellStyle: React.CSSProperties = {
        backgroundColor: isSelected ? '#f0f7ff' : undefined,
        cursor: 'pointer',
      };

      if (field === 'selected') {
        return (
          <td style={{ ...cellStyle, textAlign: 'center' }}>
            <input
              type="checkbox"
              checked={!!p.dataItem.selected}
              onChange={(e) => {
                const newData = [...data];
                const idx = newData.findIndex((it) => it.comnCd === p.dataItem.comnCd);
                if (idx > -1) {
                  newData[idx] = { ...newData[idx], selected: e.target.checked };
                  setData(newData);
                }
              }}
            />
          </td>
        );
      }
      if (p.dataItem.inEdit && columns.find((c) => c.field === field)?.editable) return null;
      const displayVal = field === 'comnCd' && p.dataItem.comnCd.startsWith('TEMP_') ? '' : p.dataItem[field];
      return (
        <td
          style={cellStyle}
          onClick={() => onRowClick(p.dataItem.comnCd)}
        >
          {displayVal}
        </td>
      );
    },
    [data, selectedCd, onRowClick, setData, columns],
  );

  return (
    <div className="kma-card border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-end gap-2 mb-3">
        <Button
          variant="primary"
          onClick={onAdd}
        >
          추가
        </Button>
        <Button
          variant="dark"
          onClick={onSave}
        >
          저장
        </Button>
        <Button
          variant="danger"
          onClick={onDelete}
        >
          삭제
        </Button>
      </div>
      <KendoGrid
        columns={columns}
        data={data}
        rowKey="comnCd"
        maxRows={maxRows}
        editField="inEdit"
        onItemChange={(e) => {
          const newData = [...data];
          const idx = newData.findIndex((it) => it.comnCd === e.dataItem.comnCd);
          if (idx > -1) {
            newData[idx] = { ...newData[idx], [e.field]: e.value };
            setData(newData);
          }
        }}
        onRowDoubleClick={(row) => {
          const newData = [...data];
          const idx = newData.findIndex((it) => it.comnCd === row.comnCd);
          if (idx > -1) {
            newData[idx] = { ...newData[idx], inEdit: true };
            setData(newData);
          }
        }}
        onClickCell={(row, field) => {
          if (field !== 'selected') onRowClick(row.comnCd);
        }}
        renderCell={renderCell}
      />
    </div>
  );
}
