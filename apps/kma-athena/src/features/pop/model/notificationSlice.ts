import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
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

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type NotificationState = {
  alert: PopupState;
  confirm: PopupState;
  toasts: ToastItem[];
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

const initialState: NotificationState = {
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

export type OpenAlertPayload = Omit<PopupState, 'open' | 'variant'>;
export type OpenConfirmPayload = Omit<PopupState, 'open' | 'variant'>;

type EnqueueToastPayload = {
  message: string;
  type?: ToastType;
  duration?: number;
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    openAlert: (state, action: PayloadAction<OpenAlertPayload>) => {
      state.alert = {
        open: true,
        variant: 'alert',
        title: action.payload.title,
        message: action.payload.message,
        content: action.payload.content,
        confirmText: action.payload.confirmText,
        cancelText: undefined,
        popupWidth: action.payload.popupWidth,
        confirmDisabled: action.payload.confirmDisabled ?? false,
        callbackId: action.payload.callbackId,
      };
    },

    closeAlert: (state) => {
      state.alert = {
        ...initialPopupState,
        variant: 'alert',
      };
    },

    openConfirm: (state, action: PayloadAction<OpenConfirmPayload>) => {
      state.confirm = {
        open: true,
        variant: 'confirm',
        title: action.payload.title,
        message: action.payload.message,
        content: action.payload.content,
        confirmText: action.payload.confirmText,
        cancelText: action.payload.cancelText,
        popupWidth: action.payload.popupWidth,
        confirmDisabled: action.payload.confirmDisabled ?? false,
        callbackId: action.payload.callbackId,
      };
    },

    closeConfirm: (state) => {
      state.confirm = {
        ...initialPopupState,
        variant: 'confirm',
      };
    },

    enqueueToast: {
      reducer: (state, action: PayloadAction<ToastItem>) => {
        state.toasts.push(action.payload);
      },
      prepare: ({ message, type = 'info', duration }: EnqueueToastPayload) => ({
        payload: {
          id: nanoid(),
          message,
          type,
          duration,
        },
      }),
    },

    dequeueToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },

    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {
  openAlert,
  closeAlert,
  openConfirm,
  closeConfirm,
  enqueueToast,
  dequeueToast,
  clearAllToasts,
} = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
