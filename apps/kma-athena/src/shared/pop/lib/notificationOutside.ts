/**
 * React 외부에서 팝업 구현 진입점.
 * - API layer, util, interceptor 등에서 사용
 * - Hook없이 store에 직접 enqueue
 */
import { useNotificationStore } from '../model/notificationStore';
import type { PopupPayload, ToastType } from '../model/notificationTypes';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const notificationOutside = {
  alert: (payload: PopupPayload) => {
    useNotificationStore.getState().enqueue({
      id: createId(),
      kind: 'alert',
      payload,
    });
  },

  confirm: (payload: PopupPayload) => {
    useNotificationStore.getState().enqueue({
      id: createId(),
      kind: 'confirm',
      payload,
    });
  },

  toast: (message: string, type: ToastType = 'error', duration = 2000) => {
    useNotificationStore.getState().enqueue({
      id: createId(),
      kind: 'toast',
      payload: { message, type, duration },
    });
  },
};
