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
  renderCell?: (props: GridCellProps | any) => React.ReactNode;
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

// v14 변경 사항: props 타입을 any로 두어 GridCustomCellProps 호환성 확보
const StableCell = (props: any) => {
  const context = useContext(GridContext);
  const { field, dataItem } = props;

  // v14부터는 tdProps 안에 기본 스타일과 속성이 담겨 옵니다.
  const className = props.className || props.tdProps?.className;
  const style = props.style || props.tdProps?.style;

  const { columns, editField, onItemChange, onClickCell, renderCell } = context;

  const colField = field || '';
  const col = columns.find((c: any) => c.field === colField);
  const isEditable = editField && dataItem[editField] && col?.editable;

  const styleForRenderCell: React.CSSProperties = {
    ...style,
    textAlign: col?.align || 'left',
    cursor: 'pointer',
    height: '36px',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
    borderBottom: '1px solid #eee',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  if (renderCell) {
    const customResult = renderCell({ ...props, style: styleForRenderCell });
    if (customResult) return customResult as React.ReactElement;
  }

  const cellBaseStyle: React.CSSProperties = {
    ...styleForRenderCell,
    padding: '0 15px',
  };

  if (isEditable) {
    let inputType = 'text';
    if (col?.editor === 'numeric') inputType = 'number';
    return (
      <td
        {...props.tdProps} // Kendo의 기본 속성(접근성 등) 유지
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
      {...props.tdProps} // Kendo의 기본 속성 유지
      className={className}
      style={cellBaseStyle}
      onClick={() => onClickCell?.(dataItem, colField)}
    >
      {dataItem[colField]}
    </td>
  );
};

//   인라인 함수로 있던 Row를 완전히 밖으로 빼내어 컴포넌트 재생성을 막습니다.
const CustomRow = (props: any) => {
  const context = useContext(GridContext);
  const trProps = props.trProps || {};
  return (
    <tr
      {...trProps}
      style={{ ...(trProps.style || props.style), height: '36px', boxSizing: 'border-box' }}
      onDoubleClick={() => context.onRowDoubleClick?.(props.dataItem)}
    >
      {props.children}
    </tr>
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

  // onRowDoubleClick을 Context에 추가하여 CustomRow에서 접근 가능하도록 처리
  const contextValue = useMemo(
    () => ({ columns, editField, onItemChange, onClickCell, renderCell, onRowDoubleClick }),
    [columns, editField, onItemChange, onClickCell, renderCell, onRowDoubleClick],
  );

  return (
    <GridContext.Provider value={contextValue}>
      <Grid
        data={data}
        style={{ height: calculatedHeight, border: '1px solid #e5e5e5', backgroundColor: '#fff' }}
        dataItemKey={rowKey}
        //  안정적인 컴포넌트 참조 전달 (포커스 잃음 완벽 해결)
        rows={{ data: CustomRow }}
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            title={col.title}
            width={col.width}
            // 핵심 변경 사항: cell이 삭제되고 cells={{ data: ... }} 형식으로 변경됨
            cells={{ data: StableCell }}
            headerClassName="kma-grid-header"
          />
        ))}
      </Grid>
    </GridContext.Provider>
  );
}
