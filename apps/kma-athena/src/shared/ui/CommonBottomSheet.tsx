'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) {
    return null;
  }

  const bottomSheetContent = (
    <div
      className={`popup-bottom-wrap md:hidden transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="바텀시트 닫기"
        className="btn-popup-bg"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? '바텀 시트'}
        className={`popup-bottom-box transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
      >
        <button
          type="button"
          aria-label="바텀시트 닫기"
          onClick={onClose}
          className="btn-popup-close"
        >
          <span className="btn-popup-close-bar"></span>
        </button>
        {title ? <h2 className="popup-title">{title}</h2> : null}
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(bottomSheetContent, document.body);
};
