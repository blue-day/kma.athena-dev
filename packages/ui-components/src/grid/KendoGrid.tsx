'use client';
import React, { memo, createContext, useContext, useMemo } from 'react';
import { Grid, GridColumn as Column, GridCellProps, GridRowProps } from '@progress/kendo-react-grid';

export type KendoGridColumn = {
  field: string;
  title: string;
  width?: number | string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  editor?: 'numeric' | 'text' | 'boolean' | 'date';
};

export type KendoGridProps<T extends Record<string, any>> = {
  columns: KendoGridColumn[];
  data: T[];
  rowKey: string;
  height?: number | string;
  maxRows?: number;
  onClickCell?: (row: T, field: string) => void;
  onRowDoubleClick?: (row: T) => void;
  editField?: string;
  onItemChange?: (event: any) => void;
  renderCell?: (props: GridCellProps) => React.ReactNode;
};

const GridContext = createContext<any>(null);

const EditInput = memo(
  ({ value, onChange, inputType }: { value: any; onChange: (value: any) => void; inputType: string }) => {
    const [isComposing, setIsComposing] = React.useState(false);
    const [localValue, setLocalValue] = React.useState(value ?? '');

    React.useEffect(() => {
      if (!isComposing) setLocalValue(value ?? '');
    }, [value, isComposing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      if (!isComposing) {
        const parsedValue =
          inputType === 'number' ? (newValue === '' ? null : parseFloat(newValue)) : newValue;
        onChange(parsedValue);
      }
    };

    return (
      <input
        className="k-textbox w-full px-2 py-1 border rounded"
        type={inputType === 'number' ? 'text' : inputType}
        value={localValue}
        onChange={handleChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(e: any) => {
          setIsComposing(false);
          const val = e.target.value;
          onChange(inputType === 'number' ? parseFloat(val) : val);
        }}
        autoFocus
      />
    );
  },
);
EditInput.displayName = 'EditInput';

const StableCell = (props: GridCellProps) => {
  const context = useContext(GridContext);
  const { field, dataItem, className, style } = props;
  const { columns, editField, onItemChange, onClickCell, renderCell } = context;

  const colField = field || '';
  const col = columns.find((c: any) => c.field === colField);
  const isEditable = editField && dataItem[editField] && col?.editable;

  // Kendo가 주입한 style(너비 정보)은 유지하되, padding은 제거하여
  // renderCell에 전달 — renderCell 내부에서 padding을 덮어쓸 수 있도록 보장
  const styleForRenderCell: React.CSSProperties = {
    ...style, // width 등 kendo 너비 정보 유지
    textAlign: col?.align || 'left',
    cursor: 'pointer',
    height: '36px',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
    borderBottom: '1px solid #eee',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    // ✅ padding을 여기서 제거 — renderCell이 자체 td를 렌더링할 때
    //    kendo 기본 padding(0 8px)이 적용되어 헤더와 오와열 발생하므로 명시하지 않음
  };

  // renderCell이 있는 경우 스타일을 주입하여 호출
  if (renderCell) {
    const customResult = renderCell({ ...props, style: styleForRenderCell });
    if (customResult) return customResult as React.ReactElement;
  }

  // 기본 셀 (renderCell 없거나 null 반환 시)
  const cellBaseStyle: React.CSSProperties = {
    ...styleForRenderCell,
    padding: '0 15px', // 기본 셀에만 padding 적용
  };

  if (isEditable) {
    let inputType = 'text';
    if (col?.editor === 'numeric') inputType = 'number';
    return (
      <td
        className={className}
        style={{ ...cellBaseStyle, cursor: 'default', padding: '0 10px' }}
      >
        <EditInput
          value={dataItem[colField]}
          inputType={inputType}
          onChange={(val) => onItemChange?.({ dataItem, field: colField, value: val })}
        />
      </td>
    );
  }

  return (
    <td
      className={className}
      style={cellBaseStyle}
      onClick={() => onClickCell?.(dataItem, colField)}
    >
      {dataItem[colField]}
    </td>
  );
};

export function KendoGrid<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  height,
  maxRows = 10,
  onClickCell,
  onRowDoubleClick,
  editField,
  onItemChange,
  renderCell,
}: KendoGridProps<T>) {
  const calculatedHeight = height || (maxRows ? `${37 + maxRows * 36 + 2}px` : 300);
  const contextValue = useMemo(
    () => ({ columns, editField, onItemChange, onClickCell, renderCell }),
    [columns, editField, onItemChange, onClickCell, renderCell],
  );

  return (
    <GridContext.Provider value={contextValue}>
      <Grid
        data={data}
        style={{ height: calculatedHeight, border: '1px solid #e5e5e5', backgroundColor: '#fff' }}
        dataItemKey={rowKey}
        rowRender={(trElement: React.ReactElement, props: GridRowProps) => {
          return React.cloneElement(trElement, {
            ...trElement.props,
            style: { height: '36px', boxSizing: 'border-box' },
            onDoubleClick: () => onRowDoubleClick?.(props.dataItem),
          });
        }}
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            title={col.title}
            width={col.width}
            cell={StableCell}
            headerClassName="kma-grid-header"
          />
        ))}
      </Grid>
    </GridContext.Provider>
  );
}
