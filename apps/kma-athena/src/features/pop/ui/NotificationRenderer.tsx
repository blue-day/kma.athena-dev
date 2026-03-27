'use client';

/**
 * 팝업 모음
 */
import { useEffect, useRef, useState } from 'react';
import { CommonPopup } from '@/shared/ui/CommonPopup';
import { CommonToast } from '@/shared/ui/CommonToast';
import { showToast } from '@/shared/ui/toast';
import { useNotificationStore } from '../model/notificationStore';
import { clearPopupCallbacks, getPopupCallbacks } from '../lib/popCallbackRegistry';

export function NotificationRenderer() {
  const alert = useNotificationStore((state) => state.alert);
  const confirm = useNotificationStore((state) => state.confirm);
  const toasts = useNotificationStore((state) => state.toasts);
  const consumedToastIdsRef = useRef<Set<string>>(new Set());
  const [isConfirmSubmitting, setIsConfirmSubmitting] = useState(false);  // ?앹뾽 ?뺤씤 踰꾪듉 以묐났 ?대┃ 諛⑹?
  const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);      // ?꾩? ?숈씪

  useEffect(() => {
    toasts.forEach((toastItem) => {
      if (consumedToastIdsRef.current.has(toastItem.id)) return;

      consumedToastIdsRef.current.add(toastItem.id);
      showToast(toastItem.message, {
        type: toastItem.type,
        duration: toastItem.duration,
      });

      useNotificationStore.getState().dequeueToast(toastItem.id);

      queueMicrotask(() => {  // 소비 완료된 id는 바로 제거해서 ref가 계속 커지지 않게 정리
        consumedToastIdsRef.current.delete(toastItem.id);
      });
    });
  }, [toasts]);

  const handleAlertClose = async () => {
    if (isAlertSubmitting) return;
    const callbackId = alert.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      await callbacks?.onClose?.();
    } finally {
      clearPopupCallbacks(callbackId);
      useNotificationStore.getState().closeAlert();
      setIsAlertSubmitting(false);
    }
  };

  const handleAlertConfirm = async () => {
    if (isAlertSubmitting) return;

    const callbackId = alert.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      setIsAlertSubmitting(true);
      await callbacks?.onConfirm?.();
    } finally {
      clearPopupCallbacks(callbackId);
      useNotificationStore.getState().closeAlert();
      setIsAlertSubmitting(false);
    }
  };

  const handleConfirmClose = async () => {
    if (isConfirmSubmitting) return;

    const callbackId = confirm.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      await callbacks?.onClose?.();
    } finally {
      clearPopupCallbacks(callbackId);
      useNotificationStore.getState().closeConfirm();
      setIsConfirmSubmitting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (isConfirmSubmitting) return;

    const callbackId = confirm.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      await callbacks?.onCancel?.();
    } finally {
      clearPopupCallbacks(callbackId);
      useNotificationStore.getState().closeConfirm();
      setIsConfirmSubmitting(false);
    }
  };

  const handleConfirmConfirm = async () => {
    if (isConfirmSubmitting) return;

    const callbackId = confirm.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      setIsConfirmSubmitting(true);
      await callbacks?.onConfirm?.();
    } finally {
      clearPopupCallbacks(callbackId);
      useNotificationStore.getState().closeConfirm();
      setIsConfirmSubmitting(false);
    }
  };

  return (
    <>
      {/* alert 팝업 */}
      <CommonPopup
        open={alert.open}
        variant="alert"
        popupWidth={alert.popupWidth}
        title={alert.title}
        message={alert.message}
        content={alert.content}
        confirmText={alert.confirmText}
        confirmDisabled={alert.confirmDisabled}
        onClose={handleAlertClose}
        onConfirm={handleAlertConfirm}
      />

      {/* confirm 팝업 */}
      <CommonPopup
        open={confirm.open}
        variant="confirm"
        popupWidth={confirm.popupWidth}
        title={confirm.title}
        message={confirm.message}
        content={confirm.content}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        confirmDisabled={confirm.confirmDisabled}
        onClose={handleConfirmClose}
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmConfirm}
      />

      {/* 토스트 팝업 */}
      <CommonToast />
    </>
  );
}
