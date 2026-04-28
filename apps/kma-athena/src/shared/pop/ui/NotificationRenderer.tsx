'use client';
/**
 * 실제 팝업 실행 렌더러
 * - store의 현재 알림을 감시해서 queue를 순차 소비
 * - 실제로 showAlert, showConfirm, showToast를 실행
 */
import { useEffect } from 'react';
import { showToast } from '@/shared/common/ui/toast';
import { showAlert, showConfirm } from '../lib/notification';
import { useNotificationStore } from '../model/notificationStore';

export function NotificationRenderer() {
  const current = useNotificationStore((state) => state.current);
  const dequeue = useNotificationStore((state) => state.dequeue);

  useEffect(() => {
    if (!current) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        if (current.kind === 'alert') {
          await showAlert(current.payload);
          return;
        }

        if (current.kind === 'confirm') {
          await showConfirm(current.payload);
          return;
        }

        if (current.kind === 'toast') {
          showToast(current.payload.message, {
            type: current.payload.type ?? 'info',
            duration: current.payload.duration ?? 2000,
          });
        }
      } finally {
        if (!cancelled) {
          dequeue();
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [current, dequeue]);

  return null;
}