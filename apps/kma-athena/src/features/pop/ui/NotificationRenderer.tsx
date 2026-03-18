'use client';

/**
 * 팝업 모음
 */
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/hooks';
import { CommonPopup } from '@/shared/ui/CommonPopup';
import { CommonToast } from '@/shared/ui/CommonToast';
import { showToast } from '@/shared/ui/toast';
import {
  closeAlert,
  closeConfirm,
  dequeueToast,
} from '../model/notificationSlice';
import { clearPopupCallbacks, getPopupCallbacks } from '../model/popCallbackRegistry';

export function NotificationRenderer() {
  const dispatch = useAppDispatch();
  const { alert, confirm, toasts } = useAppSelector((state) => state.pops);
  const consumedToastIdsRef = useRef<Set<string>>(new Set());
  const [isConfirmSubmitting, setIsConfirmSubmitting] = useState(false);  // 팝업 확인 버튼 중복 클릭 방지
  const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);      // 위와 동일

  useEffect(() => {
    toasts.forEach((toastItem) => {
      if (consumedToastIdsRef.current.has(toastItem.id)) return;

      consumedToastIdsRef.current.add(toastItem.id);
      showToast(toastItem.message, {
        type: toastItem.type,
        duration: toastItem.duration,
      });

      dispatch(dequeueToast(toastItem.id));

      queueMicrotask(() => {  // 소비 완료된 id는 바로 제거해서 ref가 계속 커지지 않게 정리
        consumedToastIdsRef.current.delete(toastItem.id);
      });
    });
  }, [dispatch, toasts]);

  const runAlertClose = async () => {
    if (isAlertSubmitting) return;
    const callbackId = alert.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      await callbacks?.onClose?.();
    } finally {
      clearPopupCallbacks(callbackId);
      dispatch(closeAlert());
      setIsAlertSubmitting(false);
    }
  };

  const runAlertOkey = async () => {
    if (isAlertSubmitting) return;

    const callbackId = alert.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      setIsAlertSubmitting(true);
      await callbacks?.onConfirm?.();
    } finally {
      clearPopupCallbacks(callbackId);
      dispatch(closeAlert());
      setIsAlertSubmitting(false);
    }
  };

  const runConfirmClose = async () => {
    if (isConfirmSubmitting) return;

    const callbackId = confirm.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      await callbacks?.onClose?.();
    } finally {
      clearPopupCallbacks(callbackId);
      dispatch(closeConfirm());
      setIsConfirmSubmitting(false);
    }
  };

  const runConfirmCancel = async () => {
    if (isConfirmSubmitting) return;

    const callbackId = confirm.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      await callbacks?.onCancel?.();
    } finally {
      clearPopupCallbacks(callbackId);
      dispatch(closeConfirm());
      setIsConfirmSubmitting(false);
    }
  };

  const runConfirmOkey = async () => {
    if (isConfirmSubmitting) return;

    const callbackId = confirm.callbackId;
    const callbacks = getPopupCallbacks(callbackId);

    try {
      setIsConfirmSubmitting(true);
      await callbacks?.onConfirm?.();
    } finally {
      clearPopupCallbacks(callbackId);
      dispatch(closeConfirm());
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
        onClose={runAlertClose}
        onConfirm={runAlertOkey}
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
        onClose={runConfirmClose}
        onCancel={runConfirmCancel}
        onConfirm={runConfirmOkey}
      />

      {/* 토스트 팝업 */}
      <CommonToast />
    </>
  );
}