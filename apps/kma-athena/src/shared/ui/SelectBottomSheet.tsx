'use client';

import { CommonBottomSheet } from './CommonBottomSheet';

type SelectBottomSheetOption = {
  key: string;
  label: string;
};

type SelectBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  options: SelectBottomSheetOption[];
  value: string;
  onSelect: (key: string) => void;
};

export const SelectBottomSheet = ({
  open,
  onClose,
  title,
  options,
  value,
  onSelect,
}: SelectBottomSheetProps) => {
  return (
    <CommonBottomSheet open={open} onClose={onClose} title={title}>
      <ul>
        {options.map((option) => {
          const isActive = option.key === value;
          return (
            <li key={option.key}>
              <button
                type="button"
                className={`h-[50px] w-full flex flex-row justify-between items-center gap-[6px] py-[10px] text-sm transition-colors ${
                  isActive
                    ? ' text-primary font-bold'
                    : ''
                }`}
                onClick={() => {
                  onSelect(option.key);
                  onClose();
                }}
              >
                <span>{option.label}</span>
                {isActive ? (
                  <span className="icon-select-check">
                    <span className="sr-only">선택됨</span>
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </CommonBottomSheet>
  );
};
