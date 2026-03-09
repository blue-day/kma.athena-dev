'use client';

import { ChangeEvent, InputHTMLAttributes } from 'react';

type CommonInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export function CommonInput({ value, onChange, onClear, className = '', ...props }: CommonInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }

    onChange('');
  };

  return (
    <div className={`ipt-wrap ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        {...props}
      />
      {value ? (
        <button
          type="button"
          className="btn-ipt-clear"
          onClick={handleClear}
          aria-label="입력 내용 초기화"
        />
      ) : null}
    </div>
  );
}
