'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'danger' | 'reset' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
}

export function Button({ variant = 'secondary', className = '', children, ...props }: ButtonProps) {
  const variantClass = variant === 'secondary' ? '' : `kma-btn-${variant}`;

  /**
   * 모든 버튼의 크기를 40px로 통일 (DateRangePicker 기준)
   * - h-[40px]: 32px에서 40px로 상향 조정
   */
  const sizeClasses =
    'h-[40px] min-w-[84px] px-4 py-0 text-sm font-medium flex items-center justify-center leading-none';

  const combinedClassName = `kma-btn ${variantClass} ${sizeClasses} ${className}`.trim();

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
