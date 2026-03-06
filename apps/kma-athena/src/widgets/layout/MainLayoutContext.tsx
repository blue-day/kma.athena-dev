'use client';

import { createContext, useContext } from 'react';

// 모바일 레이아웃 전역 상태(메뉴 열림/닫힘)를 공유하기 위한 타입
type MainLayoutContextValue = {
  mobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
};

// MainLayout 하위에서만 접근 가능한 컨텍스트
const MainLayoutContext = createContext<MainLayoutContextValue | null>(null);

interface MainLayoutProviderProps {
  value: MainLayoutContextValue;
  children: React.ReactNode;
}

export const MainLayoutProvider = ({ value, children }: MainLayoutProviderProps) => {
  return <MainLayoutContext.Provider value={value}>{children}</MainLayoutContext.Provider>;
};

// 헤더/콘텐츠 등 자식 컴포넌트에서 레이아웃 상태를 꺼내 쓰는 전용 훅
export const useMainLayout = () => {
  const context = useContext(MainLayoutContext);
  if (!context) {
    // Provider 없이 사용할 경우 즉시 에러로 잘못된 사용을 알림
    throw new Error('useMainLayout must be used within MainLayoutProvider');
  }
  return context;
};
