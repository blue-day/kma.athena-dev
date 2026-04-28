'use client';
/**
 * 팝업 Zustand queue 기반 전역 통합 알림 상태 저장소
 * - 팝업 전역 상태 관리 : 현재 표시 중인 알림과 대기열을 순차 처리
 */
import { create } from 'zustand';
import type { NotificationQueueItem } from './notificationTypes';

type NotificationStore = {
  queue: NotificationQueueItem[];
  current: NotificationQueueItem | null;
  enqueue: (item: NotificationQueueItem) => void;
  dequeue: () => void;
  clearAll: () => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  queue: [],
  current: null,

  enqueue: (item) => {
    const { current, queue } = get();

    if (!current) {
      set({ current: item });
      return;
    }

    set({ queue: [...queue, item] });
  },

  dequeue: () => {
    const { queue } = get();

    if (queue.length === 0) {
      set({ current: null });
      return;
    }

    const [next, ...rest] = queue;
    set({ current: next, queue: rest });
  },

  clearAll: () => {
    set({ current: null, queue: [] });
  },
}));
