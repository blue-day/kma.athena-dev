'use client';

import Swal from 'sweetalert2';
import { ToastType } from '../model/notificationTypes';

type CommonToastOptions = {
  type?: ToastType;
  duration?: number;
};

const classMap: Record<ToastType, string> = {
  success: 'kma-toast kma-toast-success',
  error: 'kma-toast kma-toast-error',
  info: 'kma-toast',
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timerProgressBar: false,
  customClass: {
    popup: 'kma-toast',
    container: 'kma-toast-container',
  },
});

export function showToast(message: string, options?: CommonToastOptions) {
  const { type = 'info', duration = 2000 } = options ?? {};
  Toast.fire({
    title: message,
    timer: duration,
    customClass: { popup: classMap[type], container: 'kma-toast-container' },
  });
}

export function dismissToast(_toastId?: string) {
  Swal.close();
}
