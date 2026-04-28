'use client';

import Lottie from 'lottie-react';
import loadingLottie from '@/shared/assets/lottie/loading.json';

interface CommonLoadingProps {
  className?: string;
}

export function CommonLoading({ className = '' }: CommonLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="로딩 중"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/40 dark:bg-black/40 ${className}`}
    >
      <div style={{ width: 80, height: 80 }}>
        <Lottie animationData={loadingLottie} loop autoplay className="h-full w-full" />
      </div>
    </div>
  );
}
