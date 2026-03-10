'use client';

import toast, { ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info';

type CommonToastOptions = Omit<ToastOptions, 'icon'> & {
  type?: ToastType;
};

export function showToast(message: string, options?: CommonToastOptions) {
  const { type = 'info', ...toastOptions } = options ?? {};

  if (type === 'success') {
    return toast.success(message, toastOptions);
  }

  if (type === 'error') {
    return toast.error(message, toastOptions);
  }

  return toast(message, toastOptions);
}

export function dismissToast(toastId?: string) {
  toast.dismiss(toastId);
}
