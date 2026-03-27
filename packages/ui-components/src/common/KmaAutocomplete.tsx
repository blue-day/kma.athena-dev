import React, { useMemo, useState } from 'react';
import { ComboBox, Input, Button, Popover, ListBox, ListBoxItem } from 'react-aria-components';

interface Option {
  label: string;
  value: string;
}

export interface KmaAutocompleteProps {
  options: Option[];
  value?: string | null;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export function KmaAutocomplete({ options, value, onChange, placeholder }: KmaAutocompleteProps) {
  // 사용자가 타이핑하는 텍스트 상태
  const [filterText, setFilterText] = useState('');

  // 현재 선택된 value에 해당하는 label 찾기
  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label || '';
  }, [value, options]);

  // 타이핑(filterText)에 따라 옵션 필터링
  const filteredOptions = useMemo(() => {
    if (!filterText) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(filterText.toLowerCase()));
  }, [options, filterText]);

  return (
    <ComboBox
      className="relative w-full"
      inputValue={filterText !== '' ? filterText : selectedLabel}
      onInputChange={setFilterText}
      onSelectionChange={(key) => {
        // 선택 시 해당 키(value) 전달 및 입력창 초기화
        onChange?.(key ? key.toString() : '');
        setFilterText('');
      }}
    >
      <div className="kma-date-group flex relative w-full items-center">
        <Input
          className="kma-input w-full pr-8"
          placeholder={placeholder || '검색 또는 선택...'}
        />
        <Button className="absolute right-2 text-gray-500 cursor-pointer">▼</Button>
      </div>

      <Popover className="kma-date-popover border border-gray-300 bg-white rounded shadow-md mt-1 w-[--trigger-width] z-50">
        <ListBox className="max-h-60 overflow-y-auto p-1 outline-none">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <ListBoxItem
                key={opt.value}
                id={opt.value}
                className="p-2 cursor-pointer hover:bg-gray-100 outline-none focus:bg-blue-50"
              >
                {opt.label}
              </ListBoxItem>
            ))
          ) : (
            <div className="p-2 text-gray-400 text-sm">일치하는 항목이 없습니다.</div>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
