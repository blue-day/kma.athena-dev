'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Lnb } from './Lnb';
import { MainLayoutProvider } from './MainLayoutContext';
import { CommonLoading } from '@/shared/common/ui/CommonLoading';
import { NotificationRenderer } from '@/features/pop/ui/NotificationRenderer';

interface MainLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

/**
 * 전역 레이아웃 컴포넌트
 * - Lnb (최좌측 바) + Content (우측 전체 영역)
 * - isLoading: 로딩 중 표시 여부
 * - isAlertPopupOpen: alert 팝업 여부
 * - isConfirmPopupOpen: confirm 팝업 여부
 */

export const MainLayout = ({ children, isLoading = false }: MainLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('kma-theme-mode');

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeMode(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    window.localStorage.setItem('kma-theme-mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);


  const contextValue = useMemo(
    () => ({
      mobileMenuOpen,
      openMobileMenu: () => setMobileMenuOpen(true),
      closeMobileMenu: () => setMobileMenuOpen(false),
      themeMode,
      setThemeMode,
    }),
    [mobileMenuOpen, themeMode],
  );

  return (
    <MainLayoutProvider value={contextValue}>
      <div className="h-screen overflow-y-hidden overflow-x-hidden md:overflow-x-auto">
        <div className="flex h-screen w-full min-w-0 md:min-w-[1200px]">
          {/* 1. 최좌측 LNB 사이드바 */}
          <Lnb mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

          {/* 2. 메인 콘텐츠 영역 (채팅 레이아웃 등이 들어갈 자리) */}
          <main className="flex min-w-0 flex-1 flex-col">
            {children}
          </main>
        </div>
      </div>

      {/* 로딩 */}
      {isLoading && <CommonLoading />}

      {/* 팝업 */}
      <NotificationRenderer />
    </MainLayoutProvider>
  );
};
