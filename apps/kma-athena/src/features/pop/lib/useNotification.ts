'use client';

import { createClientId } from '@/shared/lib/createClientId';
import { useNotificationStore } from '../model/notificationStore';
import type { OpenAlertPayload, OpenConfirmPayload } from '../model/notificationTypes';
import { clearPopupCallbacks, registerPopupCallbacks } from './popCallbackRegistry';

type PopupCallbacks = {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
};

type AlertParams = OpenAlertPayload & PopupCallbacks;
type ConfirmParams = OpenConfirmPayload & PopupCallbacks;

export function useNotification() {
  const alertCallbackId = useNotificationStore((state) => state.alert.callbackId);
  const confirmCallbackId = useNotificationStore((state) => state.confirm.callbackId);

  return {
    alert: ({ onConfirm, onCancel, onClose, ...payload }: AlertParams) => {
      const callbackId = createClientId('popup');

      registerPopupCallbacks(callbackId, {
        onConfirm,
        onCancel,
        onClose,
      });

      useNotificationStore.getState().openAlert({ ...payload, callbackId });
    },

    confirm: ({ onConfirm, onCancel, onClose, ...payload }: ConfirmParams) => {
      const callbackId = createClientId('popup');

      registerPopupCallbacks(callbackId, {
        onConfirm,
        onCancel,
        onClose,
      });

      useNotificationStore.getState().openConfirm({ ...payload, callbackId });
    },

    toast: (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
      useNotificationStore.getState().enqueueToast({ message, type, duration });
    },

    closeAlert: () => {
      clearPopupCallbacks(alertCallbackId);
      useNotificationStore.getState().closeAlert();
    },

    closeConfirm: () => {
      clearPopupCallbacks(confirmCallbackId);
      useNotificationStore.getState().closeConfirm();
    },
  };
}
