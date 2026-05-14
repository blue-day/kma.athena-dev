import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';
export type NotificationKind = 'alert' | 'confirm' | 'toast';

type PopupCallbacks = {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
};

export type PopupPayload = {
  title?: string;
  message?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  popupWidth?: number | string;
  confirmDisabled?: boolean;
} & PopupCallbacks;

export type ToastPayload = {
  message: string;
  type?: ToastType;
  duration?: number;
};

export type NotificationQueueItem =
  | {
      id: string;
      kind: 'alert';
      payload: PopupPayload;
    }
  | {
      id: string;
      kind: 'confirm';
      payload: PopupPayload;
    }
  | {
      id: string;
      kind: 'toast';
      payload: ToastPayload;
    };
