import { InputHTMLAttributes, ReactNode, useId } from 'react';

interface CommonCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  id?: string;
  className?: string;
  label?: ReactNode;
  labelClassName?: string;
}

export const CommonCheckbox = ({
  id,
  className = '',
  label,
  labelClassName = '',
  checked,
  disabled = false,
  onChange,
  ...rest
}: CommonCheckboxProps) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={`common-checkbox ${className}`}>
      <input
        id={checkboxId}
        type="checkbox"
        className="common-checkbox-input"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        {...rest}
      />
      <label htmlFor={checkboxId} className="common-checkbox-trigger">
        <span className="common-checkbox-icon" aria-hidden="true" />
        {label ? (
          <span className={`common-checkbox-label ${labelClassName}`}>{label}</span>
        ) : null}
      </label>
    </div>
  );
};
