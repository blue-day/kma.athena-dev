'use client';

import { useEffect, useRef, useState } from 'react';

type CommonSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
};

export function CommonSelect({
  options,
  value,
  onChange,
  ariaLabel = '셀렉트',
}: CommonSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="common-select" ref={containerRef}>
      <button
        type="button"
        className={`common-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span>{value}</span>
      </button>
      {open ? (
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
    </div>
  );
}
