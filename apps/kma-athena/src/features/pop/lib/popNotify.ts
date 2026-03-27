import { createClientId } from '@/shared/lib/createClientId';
import { useNotificationStore } from '../model/notificationStore';
import { clearPopupCallbacks, registerPopupCallbacks } from './popCallbackRegistry';

/**
 * 알림 팝업 (확인 버튼만)
 * @example await popAlert('알림', '저장되었습니다.');
 */
export function popAlert(title: string, message?: string): Promise<void> {
  return new Promise((resolve) => {
    const callbackId = createClientId('popup');

    registerPopupCallbacks(callbackId, {
      onConfirm: () => resolve(),
      onClose: () => resolve(),
    });

    useNotificationStore.getState().openAlert({ title, message, callbackId });
  });
}

/**
 * 확인/취소 팝업
 * @returns 확인 시 true, 취소/닫기 시 false
 * @example const ok = await popConfirm('확인', '삭제하시겠습니까?');
 */
export function popConfirm(title: string, message?: string): Promise<boolean> {
  return new Promise((resolve) => {
    const callbackId = createClientId('popup');

    registerPopupCallbacks(callbackId, {
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
      onClose: () => resolve(false),
    });

    useNotificationStore.getState().openConfirm({ title, message, callbackId });
  });
}

/**
 * clearPopupCallbacks re-export — 팝업을 강제로 닫을 때 콜백 정리용
 */
export { clearPopupCallbacks };
