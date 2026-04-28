'use client';

import { useEffect, useRef, useState } from 'react';
import { SelectBottomSheet } from './SelectBottomSheet';

type CommonSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
};

export function CommonSelect({
  options,
  value,
  onChange,
  ariaLabel = '셀렉트',
  className,
}: CommonSelectProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  return (
    <div className={`common-select ${className ?? ''}`.trim()} ref={containerRef}>
      <button
        type="button"
        className={`common-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup={isMobile ? 'dialog' : 'listbox'}
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span>{value}</span>
      </button>
      {!isMobile && open ? (
        <ul
          className="common-select-menu"
          role="listbox"
          aria-label={`${ariaLabel} 목록`}
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={`common-select-option ${
                  value === option ? 'common-select-option-active' : ''
                }`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                role="option"
                aria-selected={value === option}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {isMobile ? (
        <SelectBottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title={ariaLabel}
          options={options.map((option) => ({ key: option, label: option }))}
          value={value}
          onSelect={onChange}
        />
      ) : null}
    </div>
  );
}
