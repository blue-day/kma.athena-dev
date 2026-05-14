/**
 * 팝업 순수 함수 모듈
 * - 팝업을 정의하는 구현부
 */
import Swal, { type SweetAlertOptions } from 'sweetalert2';

type PopupCallbacks = {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
};

export type PopupParams = {
  title?: string;
  message?: string;
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

function buildBodyOptions(message?: string) {
  return message ? `<p class="popup-message">${escapeHtml(message).replace(/\n/g, '<br />')}</p>` : '';
}

function createBaseOptions(
  { title, message, confirmText, popupWidth, confirmDisabled }: PopupParams,
  variant: 'alert' | 'confirm',
): SweetAlertOptions {
  return {
    title,
    html: buildBodyOptions(message),
    confirmButtonText: confirmText ?? '확인',
    width: popupWidth ?? 320,
    padding: 0,
    showCloseButton: false,
    buttonsStyling: false,
    reverseButtons: true,
    customClass: {
      container: `popup-wrap type-${variant}`,
      popup: 'popup-box',
      title: 'popup-title font-medium leading-5',
      htmlContainer: 'popup-content',
      actions: 'popup-footer',
      confirmButton: 'btn-txt primary h-9',
      cancelButton: 'btn-txt secondary h-9',
      closeButton: 'btn-popup-close',
    },
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

export async function showAlert({ onConfirm, onClose, ...params }: AlertParams) {
  const result = await Swal.fire({
    ...createBaseOptions(params, 'alert'),
  });

  if (result.isConfirmed) {
    await onConfirm?.();
    return;
  }

  await onClose?.();
}

export async function showConfirm({ onConfirm, onCancel, onClose, cancelText, ...params }: ConfirmParams) {
  const result = await Swal.fire({
    ...createBaseOptions({ ...params, cancelText }, 'confirm'),
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
}

export function closeNotification() {
  Swal.close();
}
