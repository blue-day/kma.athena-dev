'use client';
/**
 * React 내부 전용 팝업 사용 훅
 * - 팝업 정책 통일 : toast, alert, confirm enqueue
 */
import { closeNotification } from './notification';
import { useNotificationStore } from '../model/notificationStore';
import type { PopupPayload, ToastType } from '../model/notificationTypes';

function createNotificationId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export { closeNotification };

export function useNotification() {
  const enqueue = useNotificationStore((state) => state.enqueue);

  return {
    alert: (payload: PopupPayload) => {
      enqueue({
        id: createNotificationId(),
        kind: 'alert',
        payload,
      });
    },

    confirm: (payload: PopupPayload) => {
      enqueue({
        id: createNotificationId(),
        kind: 'confirm',
        payload,
      });
    },

    toast: (message: string, type: ToastType = 'info', duration = 2000) => {
      enqueue({
        id: createNotificationId(),
        kind: 'toast',
        payload: {
          message,
          type,
          duration,
        },
      });
    },

    closeAlert: closeNotification,
    closeConfirm: closeNotification,
  };
}
