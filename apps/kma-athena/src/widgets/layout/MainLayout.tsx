'use client';

import React from 'react';
import { Lnb } from './Lnb';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * 전역 레이아웃 컴포넌트
 * - Lnb (최좌측 바) + Content (우측 전체 영역)
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* 1. 최좌측 LNB 사이드바 */}
      <Lnb />

      {/* 2. 메인 콘텐츠 영역 (채팅 레이아웃 등이 들어갈 자리) */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
};
