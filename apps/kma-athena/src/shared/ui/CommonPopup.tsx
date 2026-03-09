'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PopupVariant = 'alert' | 'confirm' | 'custom';

type CommonPopupProps = {
  open: boolean;
  variant: PopupVariant;
  popupWidth?: number | string;
  title?: string;
  message?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function CommonPopup({
  open,
  variant,
  popupWidth,
  title,
  message,
  content,
  confirmText,
  cancelText,
  onClose,
  onConfirm,
  onCancel,
}: CommonPopupProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open || !isMounted) {
    return null;
  }

  const showTitle = variant === 'custom';
  const primaryLabel = confirmText ?? '확인';
  const secondaryLabel = cancelText ?? '취소';
  const displayContent = content ?? message;

  const handlePrimaryAction = () => {
    //확인 버튼 동작 
    // onConfirm?.();
    // if (!onConfirm) {
    //   onClose();
    // }
  };

  const handleSecondaryAction = () => {
    onCancel?.();
    if (!onCancel) {
      onClose();
    }
  };

  const popupContent = (
    <div 
      className={`popup-wrap ${variant === 'alert' ? 'type-alert' : ''} ${variant === 'confirm' ? 'type-confirm' : ''}`} 
      onClick={onClose} 
      role="presentation"
    >
      <div
        className="popup-box"
        style={
          popupWidth
            ? { maxWidth: typeof popupWidth === 'number' ? `${popupWidth}px` : popupWidth }
            : undefined
        }
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? '레이어 팝업'}
      >
        {/* <button
          type="button"
          className="btn-popup-close"
          onClick={onClose}
          aria-label="닫기"
        >
          <span className="sr-only">닫기</span>
        </button> */}

        {showTitle ? (
          <div className="popup-title">
            <h3 className="font-medium leading-5">{title ?? '팝업'}</h3>
          </div>
        ) : null}

        <div className="popup-content">{displayContent}</div>

        <div className="popup-footer">
          <div className="btn-wrap">
            {variant !== 'alert' ? (
              <button
                type="button"
                className="btn-txt secondary"
                onClick={handleSecondaryAction}
              >
                {secondaryLabel}
              </button>
            ) : null}
            <button
              type="button"
              className="btn-txt primary"
              onClick={handlePrimaryAction}
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
}
