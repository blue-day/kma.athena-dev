'use client';

import { ReactNode } from 'react';
import Swal, { SweetAlertOptions } from 'sweetalert2';

type ToastType = 'success' | 'error' | 'info';

type PopupCallbacks = {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
};

type PopupParams = {
  title?: string;
  message?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  popupWidth?: number | string;
  confirmDisabled?: boolean;
} & PopupCallbacks;

type AlertParams = PopupParams;
type ConfirmParams = PopupParams;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildBodyOptions(message?: string, content?: ReactNode) {
  const messageHtml = message ? `<p>${escapeHtml(message)}</p>` : '';

  if (typeof content === 'string' || typeof content === 'number') {
    return {
      html: `${messageHtml}${escapeHtml(String(content))}`,
    } satisfies Pick<SweetAlertOptions, 'html'>;
  }

  return {
    text: message,
  } satisfies Pick<SweetAlertOptions, 'text'>;
}

function createBaseOptions({
  title,
  message,
  content,
  confirmText,
  popupWidth,
  confirmDisabled,
}: PopupParams): SweetAlertOptions {
  return {
    title,
    confirmButtonText: confirmText ?? '확인',
    width: popupWidth,
    showCloseButton: true,
    ...buildBodyOptions(message, content),
    didOpen: () => {
      if (confirmDisabled) {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.disabled = true;
        }
      }
    },
  };
}

export function useNotification() {
  return {
    alert: async ({ onConfirm, onClose, ...params }: AlertParams) => {
      const result = await Swal.fire({
        ...createBaseOptions(params),
      });

      if (result.isConfirmed) {
        await onConfirm?.();
        return;
      }

      await onClose?.();
    },

    confirm: async ({ onConfirm, onCancel, onClose, cancelText, ...params }: ConfirmParams) => {
      const result = await Swal.fire({
        ...createBaseOptions({ ...params, cancelText }),
        showCancelButton: true,
        cancelButtonText: cancelText ?? '취소',
      });

      if (result.isConfirmed) {
        await onConfirm?.();
        return;
      }

      if (result.dismiss === Swal.DismissReason.cancel) {
        await onCancel?.();
        return;
      }

      await onClose?.();
    },

    toast: async (message: string, type: ToastType = 'info', duration = 2000) => {
      await Swal.fire({
        toast: true,
        position: 'top',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: duration,
        timerProgressBar: true,
      });
    },

    closeAlert: () => {
      Swal.close();
    },

    closeConfirm: () => {
      Swal.close();
    },
  };
}
