import { ReactNode } from 'react';
export type ToastType = 'success' | 'error' | 'info';
export type PopupVariant = 'alert' | 'confirm' | 'custom';

export type PopupState = {
  open: boolean;
  variant: PopupVariant;
  title?: string;
  message?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  popupWidth?: number | string;
  confirmDisabled?: boolean;
  callbackId?: string;
};

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

export type NotificationState = {
  alert: PopupState;
  confirm: PopupState;
  toasts: ToastItem[];
};

export type OpenAlertPayload = Omit<PopupState, 'open' | 'variant'>;
export type OpenConfirmPayload = Omit<PopupState, 'open' | 'variant'>;
