'use client';
import React, { useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@kma/ui-components';

const KendoGrid = dynamic(() => import('@kma/ui-components').then((mod) => mod.KendoGrid), { ssr: false });

interface Props {
  upCd: string | null;
  data: any[];
  setData: (data: any[]) => void;
  onAdd: () => void;
  onSave: () => void;
  onDelete: () => void;
  maxRows?: number;
}

export function CodeDetailGridWidget({ upCd, data, setData, onAdd, onSave, onDelete, maxRows = 10 }: Props) {
  const columns = useMemo(
    () => [
      { field: 'selected', width: 50, title: ' ' },
      { field: 'comnCd', title: '상세코드', width: 150, editable: false },
      { field: 'comnNm', title: '코드명', editable: true },
      { field: 'sort', title: '정렬순서', width: 100, editable: true, editor: 'numeric' as const },
    ],
    [],
  );

  const renderCell = useCallback(
    (p: any) => {
      const field = p.field;
      if (!field) return null;
      if (field === 'selected') {
        return (
          <td style={{ textAlign: 'center' }}>
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
      return <td style={{ cursor: 'default' }}>{displayVal}</td>;
    },
    [data, setData, columns],
  );

  if (!upCd)
    return (
      <div className="kma-card border rounded-lg p-4 bg-white shadow-sm text-center text-gray-500">
        상단 그룹 코드를 선택해주세요.
      </div>
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
        renderCell={renderCell}
      />
    </div>
  );
}
