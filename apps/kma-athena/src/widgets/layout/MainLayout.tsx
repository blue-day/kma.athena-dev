'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Lnb } from './Lnb';
import { MainLayoutProvider } from './MainLayoutContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * 전역 레이아웃 컴포넌트
 * - Lnb (최좌측 바) + Content (우측 전체 영역)
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [mobileMenuOpen]);

  const contextValue = useMemo(
    () => ({
      mobileMenuOpen,
      openMobileMenu: () => setMobileMenuOpen(true),
      closeMobileMenu: () => setMobileMenuOpen(false),
    }),
    [mobileMenuOpen],
  );

  return (
    <MainLayoutProvider value={contextValue}>
      <div className="h-screen overflow-y-hidden overflow-x-hidden md:overflow-x-auto">
        <div className="flex h-screen w-full min-w-0 md:min-w-[1280px]">
          {/* 1. 최좌측 LNB 사이드바 */}
          <Lnb mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

          {/* 2. 메인 콘텐츠 영역 (채팅 레이아웃 등이 들어갈 자리) */}
          <main className="flex min-w-0 flex-1 flex-col">
            {children}
          </main>
        </div>
      </div>
    </MainLayoutProvider>
  );
};
