'use client';

import { useEffect } from 'react';

type CommonBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export const CommonBottomSheet = ({
  open,
  onClose,
  title,
  children,
  className = '',
}: CommonBottomSheetProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="바텀시트 닫기"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? '바텀 시트'}
        className={`absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white px-4 pb-5 transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
      >
        <button
          type="button"
          aria-label="바텀시트 닫기"
          onClick={onClose}
          className="mx-auto p-4 mb-1 block"
        >
          <span className="w-[30px] h-1 flex rounded-[30px] bg-gray-100"></span>
        </button>
        {title ? <h2 className="mb-2.5 pb-3 font-bold border-b border-gray-border">{title}</h2> : null}
        {children}
      </div>
    </div>
  );
};
