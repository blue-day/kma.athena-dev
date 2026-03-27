import { create } from 'zustand';
import type {
  NotificationState,
  OpenAlertPayload,
  OpenConfirmPayload,
  PopupState,
  ToastType,
} from './notificationTypes';

type EnqueueToastPayload = {
  message: string;
  type?: ToastType;
  duration?: number;
};

export type NotificationStoreState = NotificationState & {
  openAlert: (payload: OpenAlertPayload) => void;
  closeAlert: () => void;
  openConfirm: (payload: OpenConfirmPayload) => void;
  closeConfirm: () => void;
  enqueueToast: (payload: EnqueueToastPayload) => void;
  dequeueToast: (toastId: string) => void;
  clearAllToasts: () => void;
};

const initialPopupState: PopupState = {
  open: false,
  variant: 'alert',
  title: undefined,
  message: undefined,
  content: undefined,
  confirmText: undefined,
  cancelText: undefined,
  popupWidth: undefined,
  confirmDisabled: false,
  callbackId: undefined,
};

export const initialNotificationState: NotificationState = {
  alert: {
    ...initialPopupState,
    variant: 'alert',
  },
  confirm: {
    ...initialPopupState,
    variant: 'confirm',
  },
  toasts: [],
};

export const useNotificationStore = create<NotificationStoreState>()((set) => ({
  ...initialNotificationState,

  openAlert: (payload) =>
    set({
      alert: {
        open: true,
        variant: 'alert',
        title: payload.title,
        message: payload.message,
        content: payload.content,
        confirmText: payload.confirmText,
        cancelText: undefined,
        popupWidth: payload.popupWidth,
        confirmDisabled: payload.confirmDisabled ?? false,
        callbackId: payload.callbackId,
      },
    }),

  closeAlert: () =>
    set({
      alert: {
        ...initialPopupState,
        variant: 'alert',
      },
    }),

  openConfirm: (payload) =>
    set({
      confirm: {
        open: true,
        variant: 'confirm',
        title: payload.title,
        message: payload.message,
        content: payload.content,
        confirmText: payload.confirmText,
        cancelText: payload.cancelText,
        popupWidth: payload.popupWidth,
        confirmDisabled: payload.confirmDisabled ?? false,
        callbackId: payload.callbackId,
      },
    }),

  closeConfirm: () =>
    set({
      confirm: {
        ...initialPopupState,
        variant: 'confirm',
      },
    }),

  enqueueToast: ({ message, type = 'info', duration }) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: '1',
          message,
          type,
          duration,
        },
      ],
    })),

  dequeueToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),

  clearAllToasts: () =>
    set({
      toasts: [],
    }),
}));
