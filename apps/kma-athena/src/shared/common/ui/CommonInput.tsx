'use client';

import { ChangeEvent, forwardRef, InputHTMLAttributes, useId } from 'react';

type CommonInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(
  ({ id, value, onChange, onClear, className = '', ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

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
      <div className={`ipt-wrap ${className}`.trim()}>
        <input ref={ref} type="text" id={inputId} value={value} onChange={handleChange} {...props} />
        {value ? (
          <button type="button" className="btn-ipt-clear" onClick={handleClear} aria-label="입력 내용 초기화" />
        ) : null}
      </div>
    );
  },
);

CommonInput.displayName = 'CommonInput';
