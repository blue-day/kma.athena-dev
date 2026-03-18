'use client';

/**
 * 팝업 호출 훅
 */
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/app/providers/hooks';
import {
  closeAlert,
  closeConfirm,
  enqueueToast,
  openAlert,
  openConfirm,
  OpenAlertPayload,
  OpenConfirmPayload,
} from '../model/notificationSlice';
import { clearPopupCallbacks, registerPopupCallbacks } from './popCallbackRegistry';

type PopupCallbacks = {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
};

type AlertParams = OpenAlertPayload & PopupCallbacks;
type ConfirmParams = OpenConfirmPayload & PopupCallbacks;

export function useNotification() {
  const dispatch = useAppDispatch();
  const alertCallbackId = useAppSelector((state) => state.pops.alert.callbackId);
  const confirmCallbackId = useAppSelector((state) => state.pops.confirm.callbackId);

  return {
    alert: ({ onConfirm, onCancel, onClose, ...payload }: AlertParams) => {
      const callbackId = nanoid();

      registerPopupCallbacks(callbackId, {
        onConfirm,
        onCancel,
        onClose,
      });

      dispatch(openAlert({ ...payload, callbackId }));
    },

    confirm: ({ onConfirm, onCancel, onClose, ...payload }: ConfirmParams) => {
      const callbackId = nanoid();

      registerPopupCallbacks(callbackId, {
        onConfirm,
        onCancel,
        onClose,
      });

      dispatch(openConfirm({ ...payload, callbackId }));
    },

    toast: (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
      dispatch(enqueueToast({ message, type, duration }));
    },

    closeAlert: () => {
      clearPopupCallbacks(alertCallbackId);
      dispatch(closeAlert());
    },

    closeConfirm: () => {
      clearPopupCallbacks(confirmCallbackId);
      dispatch(closeConfirm());
    },
  };
}
