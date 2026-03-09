'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Lnb } from './Lnb';
import { MainLayoutProvider } from './MainLayoutContext';
import { CommonLoading } from '@/shared/ui/CommonLoading';
import { CommonPopup } from '@/shared/ui/CommonPopup';

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
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);

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
      {/* alert 팝업 */}
      <CommonPopup
        open={isAlertPopupOpen}
        variant="alert"
        content={
          <p>저장 되었습니다.</p>
        }
        onClose={() => setIsAlertPopupOpen(false)}
        onConfirm={() => setIsAlertPopupOpen(false)}
      />

      {/* confirm 팝업 */}
      <CommonPopup
        open={isConfirmPopupOpen}
        variant="confirm"
        content={
          <p>채팅을 삭제하겠습니까?</p>
        }
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={() => setIsConfirmPopupOpen(false)}
      />

      {/* 로딩 */}
      {isLoading && <CommonLoading />}
    </MainLayoutProvider>
  );
};
